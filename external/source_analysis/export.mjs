#!/usr/bin/env node
// Static export of the analysis database for consumers outside this host: the
// website first (a "Source analysis" section per wallet), the Android app and
// anyone else later. Plain JSON files, written atomically into one directory,
// small at the top and detailed below, so a reader fetches only what it shows:
//
//   index.json                          every analysed app with its latest analysis summary
//   apps/<appId>.json                   all analyses of one app, with advisories (each with how many products ship the package) and the diff to the previous release
//   apps/<aliasId>.json                 stub {appId, alias: true} for the repository's other app ids (the iPhone record)
//   apps/<appId>/<ref>/dependencies.json  the full resolved dependency list of one release, each row with how many products ship the package
//   packages/index.json                 every package shipped by two or more products, with the products per version
//
// How the files travel to the site (Blossom blob + pointer event, rsync, or a
// web server) is decided outside this module: it only writes a directory.
//
// Usage: node export.mjs --out <dir>      (SOURCE_ANALYSIS_DB_PATH selects the database)
// The service calls exportAll at the end of each pass when SOURCE_ANALYSIS_EXPORT_DIR is set.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { groupByRepository } from './appList.mjs';
import { hintsByApp } from './upstreamTriage.mjs';
import { getAppList, getAnalyses, listAnalysedApps, getDependencies, getVulnerabilities, diffDependencies, dependantsOfRow, packageSources } from './ddbbUtils.mjs';

export const SCHEMA = 1;
const SEVERITIES = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];
const TIERS = ['hash-pinned', 'version-pinned', 'build-service-tag', 'source-ref-pinned', 'floating', 'unversioned'];

// A file name an app id or release tag maps to: ids are reverse-DNS or slugs,
// tags may carry slashes or spaces.
export function safeName(s) {
  return String(s).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '_') || '_';
}

const countBy = (rows, key, keys) => {
  const out = Object.fromEntries(keys.map(k => [k, 0]));
  for (const r of rows) out[keys.includes(r[key]) ? r[key] : keys[keys.length - 1]]++;
  return out;
};

// A stored row's scope; rows written before the column existed fall back to the dev flag.
function scopeOfRow(row) {
  if (row.scope) return row.scope;
  if (row.dev === 1) return 'build';
  if (row.dev === 0) return 'app';
  return 'unknown';
}

// A lockfile that belongs to another product built from the same repository:
// the desktop app (electron/, desktop/), a server, a website, a browser
// extension, the docs. Its packages are not in the mobile app the wallet page
// is about, whatever the lockfile says about dev and prod (AirGap's ejs came
// from electron/package-lock.json). null for the main product.
const PRODUCT_PARTS = [
  ['desktop', /^(electron|desktop|electron-app|app-electron)$/i],
  ['server', /^(server|backend|api|services?)$/i],
  ['web', /^(web|website|webapp|site|landing)$/i],
  ['extension', /^(extension|browser-extension|chrome-extension|webextension)$/i],
  ['docs', /^(docs?|documentation)$/i],
];
export function productPartOf(lockfile) {
  for (const dir of String(lockfile || '').split('/').slice(0, -1)) {
    const hit = PRODUCT_PARTS.find(([, re]) => re.test(dir));
    if (hit) return hit[0];
  }
  return null;
}

// The other product a row belongs to when every lockfile it comes from is that product's.
function partOfLockfiles(lockfiles) {
  const parts = [...new Set(lockfiles.map(productPartOf))];
  return parts.length === 1 && parts[0] ? parts[0] : null;
}

// Summary of one release's stored rows: counts only, what the index and the
// wallet page list show before anything is expanded.
export function summarizeRelease(db, appId, ref) {
  const deps = getDependencies(db, appId, ref);
  const vulns = getVulnerabilities(db, appId, ref);
  return {
    dependencies: {
      total: deps.length,
      direct: deps.filter(d => d.direct === 1).length,
      dev: deps.filter(d => d.dev === 1).length,
      devUnknown: deps.filter(d => d.dev === null).length,
      // where the packages end up, from the lockfile graph: app / build / tests / unknown
      byScope: Object.fromEntries(['app', 'build', 'tests', 'unknown'].map(s => [s, deps.filter(d => scopeOfRow(d) === s).length])),
      byEcosystem: Object.fromEntries([...new Set(deps.map(d => d.ecosystem))].sort().map(e => [e, deps.filter(d => d.ecosystem === e).length])),
      tiers: countBy(deps, 'tier', TIERS),
      lockfiles: [...new Set(deps.map(d => d.lockfile))].sort(),
    },
    vulnerabilities: {
      total: vulns.length,
      bySeverity: countBy(vulns, 'severity', SEVERITIES),
      packages: new Set(vulns.map(v => `${v.ecosystem}:${v.name}@${v.dep_version}`)).size,
      direct: vulns.filter(v => v.direct === 1).length,
      shipped: vulns.filter(v => v.dev === 0).length,
      byScope: Object.fromEntries(['app', 'build', 'tests', 'unknown'].map(s => [s, vulns.filter(v => scopeOfRow(v) === s).length])),
    },
  };
}

function analysisEntry(a) {
  return {
    kind: a.kind, ref: a.ref, commit: a.commit_sha, analysedAt: a.analysed_at, analyser: a.analyser, status: a.status,
    error: a.error || undefined, appType: a.app_type, plugins: a.plugins, lockfiles: a.lockfiles,
    osv: a.osv_checked === null ? null : { checked: a.osv_checked, skipped: a.osv_skipped },
    lockCoverage: a.lock_coverage || undefined,
  };
}

// The releases of an app that have stored rows but no analyses row (analysed
// before the table existed): still exported, with provenance marked unknown.
function releasesWithoutAnalysis(db, appId, analyses) {
  const known = new Set(analyses.filter(a => a.kind === 'release').map(a => a.ref));
  return db.prepare('SELECT DISTINCT version FROM app_dependencies WHERE app_id = ? ORDER BY created_at DESC').all(appId)
    .map(r => r.version).filter(v => !known.has(v));
}

// Everything the export says about one app.
// counts: productCounts(db), passed in by exportAll so the two queries run once per export.
export function buildApp(db, appId, aliases = [], counts = productCounts(db), sources = packageSources(db)) {
  const analyses = getAnalyses(db, appId);
  const releases = [];
  const seen = new Set();
  for (const a of analyses) {
    if (a.kind !== 'release' || seen.has(a.ref)) continue;
    seen.add(a.ref);
    releases.push({ ...analysisEntry(a), ...summarizeRelease(db, appId, a.ref) });
  }
  for (const v of releasesWithoutAnalysis(db, appId, analyses)) {
    releases.push({ kind: 'release', ref: v, commit: null, analysedAt: null, analyser: null, status: 'ok', ...summarizeRelease(db, appId, v) });
  }
  // Newest first, by analysis time; rows without one keep their stored order after them.
  releases.sort((x, y) => (y.analysedAt || '').localeCompare(x.analysedAt || ''));
  for (let i = 0; i < releases.length; i++) {
    const r = releases[i];
    const previous = releases[i + 1];
    const lockfilesOf = new Map();
    for (const d of getDependencies(db, appId, r.ref)) {
      const key = `${d.ecosystem}:${d.name}@${d.dep_version}`;
      lockfilesOf.set(key, [...(lockfilesOf.get(key) || []), d.lockfile]);
    }
    r.advisories = getVulnerabilities(db, appId, r.ref).map(v => ({
      id: v.vuln_id, severity: v.severity, aliases: v.aliases ? v.aliases.split(' ') : [], fixed: v.fixed ? v.fixed.split(' ') : [],
      summary: v.summary, ecosystem: v.ecosystem, package: v.name, version: v.dep_version,
      direct: v.direct === null ? null : v.direct === 1, dev: v.dev === null ? null : v.dev === 1,
      scope: scopeOfRow(v) === 'unknown' ? null : scopeOfRow(v),
      part: partOfLockfiles(lockfilesOf.get(`${v.ecosystem}:${v.name}@${v.dep_version}`) || []) || undefined,
      dependants: dependantsOfRow(v.dependants),
      repo: sources.get(`${v.ecosystem}:${v.name}`)?.repo_url || undefined,
      products: counts.byName.get(`${v.ecosystem}:${v.name}`) || 1,
      productsSameVersion: counts.byVersion.get(`${v.ecosystem}:${v.name}@${v.dep_version}`) || 1,
    }));
    if (previous) {
      const d = diffDependencies(db, appId, previous.ref, r.ref);
      r.diffFrom = { ref: previous.ref, added: d.added.length, removed: d.removed.length, changed: d.changed.length,
        integrityChangedAtSameVersion: d.changed.filter(c => c.integrityChangedAtSameVersion.length).map(c => `${c.ecosystem}:${c.name}`) };
    }
  }
  const defaultBranch = analyses.filter(a => a.kind === 'default-branch').map(analysisEntry)[0] || null;
  return { schema: SCHEMA, appId, aliases, releases, defaultBranch };
}

function indexEntry(app) {
  const latest = app.releases[0] || null;
  return {
    appId: app.appId, aliases: app.aliases,
    latest: latest ? {
      ref: latest.ref, commit: latest.commit, analysedAt: latest.analysedAt, status: latest.status,
      dependencies: latest.dependencies.total, direct: latest.dependencies.direct, tiers: latest.dependencies.tiers,
      vulnerabilities: latest.vulnerabilities.bySeverity, osv: latest.osv,
      lock: latest.lockCoverage?.verdict,
    } : null,
    defaultBranch: app.defaultBranch ? { commit: app.defaultBranch.commit, analysedAt: app.defaultBranch.analysedAt, status: app.defaultBranch.status } : null,
  };
}

// The app ids the site lists for each analysed id (rows are keyed by the
// first alias of a repository, see appList.groupByRepository).
function aliasMap(db) {
  const map = new Map();
  try {
    const { jobs } = groupByRepository(getAppList(db));
    for (const j of jobs) map.set(j.appId, j.aliases.map(a => ({ appId: a.appId, platform: a.platform })));
  } catch { /* no cached app list: aliases stay empty */ }
  return map;
}

// How many products ship each package (any version) and each exact version:
// "12 products use libX, 3 use libX 0.2.3". Keyed by ecosystem:name and
// ecosystem:name@version.
export function productCounts(db) {
  const byName = new Map();
  const byVersion = new Map();
  const rows = db.prepare(`
    SELECT p.ecosystem, p.name, p.version, COUNT(DISTINCT d.app_id) AS products
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    GROUP BY p.ecosystem, p.name, p.version
  `).all();
  const apps = db.prepare(`
    SELECT p.ecosystem, p.name, COUNT(DISTINCT d.app_id) AS products
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    GROUP BY p.ecosystem, p.name
  `).all();
  for (const r of apps) byName.set(`${r.ecosystem}:${r.name}`, r.products);
  for (const r of rows) byVersion.set(`${r.ecosystem}:${r.name}@${r.version}`, r.products);
  return { byName, byVersion };
}

// The packages shipped by two or more products, most shared first, with the
// product count per version: the cross-wallet "who ships X" list.
export function sharedPackages(db, { minProducts = 2 } = {}) {
  const rows = db.prepare(`
    SELECT p.ecosystem, p.name, p.version, COUNT(DISTINCT d.app_id) AS products
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    GROUP BY p.ecosystem, p.name, p.version
  `).all();
  const byName = new Map();
  for (const r of rows) {
    const key = `${r.ecosystem}:${r.name}`;
    if (!byName.has(key)) byName.set(key, { ecosystem: r.ecosystem, name: r.name, versions: {}, apps: new Set() });
    byName.get(key).versions[r.version] = r.products;
  }
  const totals = db.prepare(`
    SELECT p.ecosystem, p.name, COUNT(DISTINCT d.app_id) AS products
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    GROUP BY p.ecosystem, p.name HAVING products >= ?
  `).all(minProducts);
  return totals
    .map(t => ({ ecosystem: t.ecosystem, name: t.name, products: t.products, versions: byName.get(`${t.ecosystem}:${t.name}`).versions }))
    .sort((a, b) => b.products - a.products || a.ecosystem.localeCompare(b.ecosystem) || a.name.localeCompare(b.name));
}

// The upstream triage hints (upstreamTriage.mjs, hintsByApp): one file per
// wallet, upstream/<appId>.json, `{ schema, appId, advisories: { id: [entry] } }`.
// Nothing is written while the harvest tables are empty.
export function writeUpstreamHints(db, exportDir) {
  const hints = hintsByApp(db);
  const dir = path.join(exportDir, 'upstream');
  fs.rmSync(dir, { recursive: true, force: true });
  if (Object.keys(hints).length) fs.mkdirSync(dir, { recursive: true });
  let rows = 0;
  for (const [appId, byId] of Object.entries(hints)) {
    fs.writeFileSync(path.join(dir, `${safeName(appId)}.json`), JSON.stringify({ schema: 1, appId, advisories: byId }));
    rows += Object.keys(byId).length;
  }
  return { apps: Object.keys(hints).length, advisories: rows };
}

/**
 * Write the whole export into `outDir`: built in a sibling temporary
 * directory and swapped in with a rename, so a reader never sees a half-written
 * tree; the previous export is removed afterwards.
 * Returns { apps, releases, dir }.
 */
export function exportAll(db, outDir, { generatedAt = new Date().toISOString(), analyser = null } = {}) {
  const parent = path.dirname(path.resolve(outDir));
  fs.mkdirSync(parent, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(parent, '.export-'));
  const aliases = aliasMap(db);
  const appIds = new Set([...listAnalysedApps(db), ...db.prepare('SELECT DISTINCT app_id FROM app_dependencies').all().map(r => r.app_id)]);
  const index = { schema: SCHEMA, generatedAt, analyser, apps: [] };
  const counts = productCounts(db);
  const sources = packageSources(db);
  let releases = 0;
  for (const appId of [...appIds].sort()) {
    const app = buildApp(db, appId, aliases.get(appId) || [], counts, sources);
    const appDir = path.join(tmp, 'apps', safeName(appId));
    fs.mkdirSync(appDir, { recursive: true });
    fs.writeFileSync(path.join(tmp, 'apps', `${safeName(appId)}.json`), JSON.stringify(app));
    for (const r of app.releases) {
      const refDir = path.join(appDir, safeName(r.ref));
      fs.mkdirSync(refDir, { recursive: true });
      fs.writeFileSync(path.join(refDir, 'dependencies.json'), JSON.stringify({
        schema: SCHEMA, appId, ref: r.ref, dependencies: getDependencies(db, appId, r.ref).map(d => ({
          ecosystem: d.ecosystem, name: d.name, version: d.dep_version, lockfile: d.lockfile, tier: d.tier,
          direct: d.direct === null ? null : d.direct === 1, dev: d.dev === null ? null : d.dev === 1,
          scope: scopeOfRow(d) === 'unknown' ? null : scopeOfRow(d),
          part: productPartOf(d.lockfile) || undefined,
          dependants: dependantsOfRow(d.dependants),
          repo: sources.get(`${d.ecosystem}:${d.name}`)?.repo_url || undefined,
          resolved: d.resolved || undefined, integrity: d.integrity || undefined,
          products: counts.byName.get(`${d.ecosystem}:${d.name}`) || 1,
          productsSameVersion: counts.byVersion.get(`${d.ecosystem}:${d.name}@${d.dep_version}`) || 1,
        })),
      }));
      releases++;
    }
    // The repository's other app ids (the iPhone page, a desktop record) get a
    // stub pointing at the file above, so a reader needs no index lookup.
    for (const alias of app.aliases) {
      if (alias.appId === appId || appIds.has(alias.appId)) continue;
      fs.writeFileSync(path.join(tmp, 'apps', `${safeName(alias.appId)}.json`), JSON.stringify({ schema: SCHEMA, appId, alias: true }));
    }
    index.apps.push(indexEntry(app));
  }
  fs.mkdirSync(path.join(tmp, 'packages'), { recursive: true });
  const shared = sharedPackages(db);
  fs.writeFileSync(path.join(tmp, 'packages', 'index.json'), JSON.stringify({ schema: SCHEMA, generatedAt, minProducts: 2, packages: shared }));
  index.sharedPackages = shared.length;
  index.upstreamHints = writeUpstreamHints(db, tmp).apps;
  // The APK checks (apk-contents-cli.mjs --export) are written next to the
  // export from outside the database; a new export keeps them.
  const apkDir = path.join(outDir, 'apk');
  if (fs.existsSync(apkDir)) fs.cpSync(apkDir, path.join(tmp, 'apk'), { recursive: true });
  // signals.json (signals.mjs) is rewritten after the export; until then, and
  // when every feed is down, the previous one stays.
  const signals = path.join(outDir, 'signals.json');
  if (fs.existsSync(signals)) fs.copyFileSync(signals, path.join(tmp, 'signals.json'));
  fs.writeFileSync(path.join(tmp, 'index.json'), JSON.stringify(index));
  const previous = `${path.resolve(outDir)}.previous`;
  fs.rmSync(previous, { recursive: true, force: true });
  if (fs.existsSync(outDir)) fs.renameSync(outDir, previous);
  fs.renameSync(tmp, outDir);
  fs.rmSync(previous, { recursive: true, force: true });
  return { apps: index.apps.length, releases, dir: path.resolve(outDir) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outFlag = process.argv.indexOf('--out');
  const outDir = outFlag > -1 ? process.argv[outFlag + 1] : process.env.SOURCE_ANALYSIS_EXPORT_DIR;
  if (!outDir) {
    console.error('Usage: node export.mjs --out <dir>   (or SOURCE_ANALYSIS_EXPORT_DIR)');
    process.exit(2);
  }
  const { initDatabase } = await import('./ddbbUtils.mjs');
  const { analyserVersion } = await import('./appAnalysis.mjs');
  const db = initDatabase();
  try {
    const { apps, releases, dir } = exportAll(db, outDir, { analyser: analyserVersion() });
    console.log(`Exported ${apps} apps, ${releases} releases to ${dir}`);
  } finally {
    db.close();
  }
}
