#!/usr/bin/env node
// Static export of the analysis database for consumers outside this host: the
// website first (a "Source analysis" section per wallet), the Android app and
// anyone else later. Plain JSON files, written atomically into one directory,
// small at the top and detailed below, so a reader fetches only what it shows:
//
//   index.json                          the exported app ids (exportApp keeps it current)
//   apps/<appId>.json                   all analyses of one app, with advisories (each with how many products ship the package) and the diff to the previous release
//   apps/<aliasId>.json                 stub {appId, alias: true} for the repository's other app ids (the iPhone record)
//   apps/<appId>/<ref>/dependencies.json  the full resolved dependency list of one release, each row with how many products ship the package
//   apps/<appId>/<ref>/submodules.json    the release's git submodules, when it has any
//
// Each file carries only what a reader uses (the wallet page's Dependencies
// panel, signals.mjs, apk-contents-cli.mjs --deps); the database keeps the rest.
//
// How the files travel to the site (Blossom blob + pointer event, rsync, or a
// web server) is decided outside this module: it only writes a directory.
//
// Usage: node export.mjs --out <dir>      (SOURCE_ANALYSIS_DB_PATH selects the database)
// The service calls exportAll at the end of each pass when SOURCE_ANALYSIS_EXPORT_DIR is set,
// and exportApp for each app as soon as its analysis ends.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { groupByRepository } from './appList.mjs';
import { hintsByApp } from './upstreamTriage.mjs';
import { coverageForReaders, coverageByPlatform } from './plugins/lock-coverage.mjs';
import { getAppList, getAnalyses, listAnalysedApps, getDependencies, getVulnerabilities, diffDependencies, dependantsOfRow, packageSources, getReproducibleVersions, getEndOfLife, getSubmodules } from './ddbbUtils.mjs';

export const SCHEMA = 1;
const SEVERITIES = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];

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
// Counts for the release summary from the stored submodule rows
// (plugins/submodules.mjs). Only submodules that may be in the app count
// towards advisories; the ones that are not built or only tested are counted
// apart, never dropped.
export function summarizeSubmodules(stored) {
  if (!stored) return undefined;
  const rows = stored.rows;
  const inApp = rows.filter(r => !r.error && (!r.scope || r.scope.status === 'assumed'));
  return {
    total: rows.length,
    errors: rows.filter(r => r.error).length,
    firstParty: rows.filter(r => r.firstParty).length,
    notInApp: rows.filter(r => r.scope && r.scope.status !== 'assumed').length,
    // of the submodules that may be in the app
    derived: inApp.filter(r => r.identity.status === 'derived').length,
    unknownOrigin: inApp.filter(r => r.identity.status === 'unknown-origin').length,
    affected: inApp.filter(r => r.advisories?.status === 'affected').length,
    advisories: inApp.reduce((n, r) => n + (r.advisories?.applies?.length || 0), 0),
    advisoriesUnknown: inApp.reduce((n, r) => n + (r.advisories?.unknown?.length || 0), 0),
  };
}

// A stored submodule row as the panel reads it: the walk depth, the scope's
// parent and the base commit stay in the database.
function submoduleRow({ depth, ...r }) {
  const out = { ...r };
  if (r.scope) { const { via, ...scope } = r.scope; out.scope = scope; }
  if (r.identity) { const { baseCommit, ...identity } = r.identity; out.identity = identity; }
  return out;
}

export function summarizeRelease(db, appId, ref) {
  const deps = getDependencies(db, appId, ref);
  const vulns = getVulnerabilities(db, appId, ref);
  const submodules = summarizeSubmodules(getSubmodules(db, appId, ref));
  return {
    ...(submodules ? { submodules } : {}),
    dependencies: {
      total: deps.length,
      direct: deps.filter(d => d.direct === 1).length,
      // where the packages end up, from the lockfile graph: app / build / tests / unknown
      byScope: Object.fromEntries(['app', 'build', 'tests', 'unknown'].map(s => [s, deps.filter(d => scopeOfRow(d) === s).length])),
      byEcosystem: Object.fromEntries([...new Set(deps.map(d => d.ecosystem))].sort().map(e => [e, deps.filter(d => d.ecosystem === e).length])),
      lockfiles: [...new Set(deps.map(d => d.lockfile))].sort(),
    },
    vulnerabilities: {
      bySeverity: countBy(vulns, 'severity', SEVERITIES),
      byScope: Object.fromEntries(['app', 'build', 'tests', 'unknown'].map(s => [s, vulns.filter(v => scopeOfRow(v) === s).length])),
    },
  };
}

function analysisEntry(a) {
  return {
    ref: a.ref, commit: a.commit_sha, analysedAt: a.analysed_at, status: a.status,
    error: a.error || undefined, lockfiles: a.lockfiles,
    osv: a.osv_checked === null ? null : { skipped: a.osv_skipped },
    // how much of the build the lockfiles we read cover (plugins/lock-coverage.mjs)
    lockCoverage: coverageForReaders(a.lock_coverage) || undefined,
    // the same, for one app's page, when the repository also builds the other app
    lockCoverageByPlatform: coverageByPlatform(a.lock_coverage),
  };
}

// The releases of an app that have stored rows but no analyses row (analysed
// before the table existed): still exported, with provenance marked unknown.
function releasesWithoutAnalysis(db, appId, analyses) {
  const known = new Set(analyses.filter(a => a.kind === 'release').map(a => a.ref));
  return db.prepare('SELECT DISTINCT version FROM app_dependencies WHERE app_id = ? ORDER BY created_at DESC').all(appId)
    .map(r => r.version).filter(v => !known.has(v));
}

// Newest first by version number (v1.10.0 > v1.9.0; 1.2.0 > 1.2.0-rc1). Refs
// without digits fall back to analysis time. Returns 0 for equal versions, so
// the stable sort keeps their stored order.
function compareReleasesNewestFirst(x, y) {
  const core = r => String(r.ref).split(/[-+]/)[0].match(/\d+/g);
  const nx = core(x), ny = core(y);
  if (!nx || !ny) return (y.analysedAt || '').localeCompare(x.analysedAt || '');
  for (let i = 0; i < Math.max(nx.length, ny.length); i++) {
    const d = Number(ny[i] ?? -1) - Number(nx[i] ?? -1);
    if (d) return d;
  }
  const pre = r => /[-+]?(alpha|beta|rc|pre|dev|snapshot)/i.test(String(r.ref)) ? 1 : 0;
  return pre(x) - pre(y);
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
    releases.push({ ref: v, commit: null, analysedAt: null, status: 'ok', ...summarizeRelease(db, appId, v) });
  }
  // Newest version first. Analysis time says nothing about it: releases added
  // later (backfill) are analysed last but are older. Equal versions keep their order.
  releases.sort(compareReleasesNewestFirst);
  for (let i = 0; i < releases.length; i++) {
    const r = releases[i];
    const previous = releases[i + 1];
    const lockfilesOf = new Map();
    for (const d of getDependencies(db, appId, r.ref)) {
      const key = `${d.ecosystem}:${d.name}@${d.dep_version}`;
      lockfilesOf.set(key, [...(lockfilesOf.get(key) || []), d.lockfile]);
    }
    r.advisories = getVulnerabilities(db, appId, r.ref).map(v => ({
      id: v.vuln_id, severity: v.severity, aliases: v.aliases ? v.aliases.split(' ') : [],
      summary: v.summary, ecosystem: v.ecosystem, package: v.name, version: v.dep_version,
      direct: v.direct === null ? null : v.direct === 1,
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
  return { schema: SCHEMA, appId, aliases, releases };
}

function indexEntry(app) {
  return { appId: app.appId };
}

// The app ids the site lists for each analysed id (rows are keyed by the
// first alias of a repository, see appList.groupByRepository).
function aliasMap(db) {
  const map = new Map();
  try {
    const { jobs } = groupByRepository(getAppList(db));
    for (const j of jobs) map.set(j.appId, j.aliases.map(a => ({ appId: a.appId })));
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
export function exportAll(db, outDir, { onlyReproducible = false } = {}) {
  const parent = path.dirname(path.resolve(outDir));
  fs.mkdirSync(parent, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(parent, '.export-'));
  const aliases = aliasMap(db);
  let appIds = new Set([...listAnalysedApps(db), ...db.prepare('SELECT DISTINCT app_id FROM app_dependencies').all().map(r => r.app_id)]);
  // Out of scope (no reproducible version, reproducible.mjs, or past its end of life): the rows stay in
  // the database as supplementary data, the site does not show them.
  if (onlyReproducible) {
    const inScope = scopeFilter(db, aliases);
    appIds = new Set([...appIds].filter(inScope));
  }
  const index = { schema: SCHEMA, apps: [] };
  const counts = productCounts(db);
  const sources = packageSources(db);
  let releases = 0;
  for (const appId of [...appIds].sort()) {
    const app = writeAppFiles(db, tmp, appId, aliases.get(appId) || [], counts, sources, (id) => appIds.has(id));
    releases += app.releases.length;
    index.apps.push(indexEntry(app));
  }
  writeUpstreamHints(db, tmp);
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

/**
 * Update one app in an existing export as soon as its analysis ends, so its
 * page does not wait for the rest of the pass: its app file, dependency lists,
 * alias stubs and index entry. Everything else (shared packages, upstream
 * hints, signals, releases removed since, product counts of the other apps)
 * stays as the last exportAll left it until the pass ends with a new one.
 * Each file is written to a temporary name and renamed into place.
 * Returns { exported: false } for an app out of scope, else
 * { exported: true, releases, files } with the paths (relative to outDir) to publish.
 */
export function exportApp(db, outDir, appId, { onlyReproducible = false, counts = productCounts(db), sources = packageSources(db) } = {}) {
  const aliases = aliasMap(db);
  if (onlyReproducible && !scopeFilter(db, aliases)(appId)) return { exported: false };
  const indexFile = path.join(outDir, 'index.json');
  let index = null;
  try { index = JSON.parse(fs.readFileSync(indexFile, 'utf8')); } catch { /* first export: start an index */ }
  if (!index || index.schema !== SCHEMA || !Array.isArray(index.apps)) index = { schema: SCHEMA, apps: [] };
  const exported = new Set(index.apps.map(a => a.appId));
  const app = writeAppFiles(db, outDir, appId, aliases.get(appId) || [], counts, sources, (id) => id === appId || exported.has(id), { atomic: true });
  index.apps = [...index.apps.filter(a => a.appId !== appId), indexEntry(app)].sort((a, b) => a.appId.localeCompare(b.appId));
  writeAtomic(indexFile, JSON.stringify(index));
  const files = ['index.json', `apps/${safeName(appId)}.json`, `apps/${safeName(appId)}/`,
    ...app.aliases.filter(a => a.appId !== appId && !exported.has(a.appId)).map(a => `apps/${safeName(a.appId)}.json`)];
  return { exported: true, releases: app.releases.length, files };
}

// Which app ids the site shows: a reproducible version on any of the
// repository's ids, and not past its end of life.
function scopeFilter(db, aliases) {
  const verified = getReproducibleVersions(db);
  const endOfLife = getEndOfLife(db); // gone and no commit for years (index.mjs)
  return (id) => !endOfLife.has(id) && [id, ...(aliases.get(id) || []).map(a => a.appId)].some(a => verified.has(a));
}

function writeAtomic(file, content) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

// One app's files under dir: apps/<appId>.json, a dependencies.json per
// release, and a stub for each alias that is not exported in its own right.
function writeAppFiles(db, dir, appId, aliases, counts, sources, isExported, { atomic = false } = {}) {
  const write = atomic ? writeAtomic : (file, content) => fs.writeFileSync(file, content);
  const app = buildApp(db, appId, aliases, counts, sources);
  const appDir = path.join(dir, 'apps', safeName(appId));
  fs.mkdirSync(appDir, { recursive: true });
  for (const r of app.releases) {
    const refDir = path.join(appDir, safeName(r.ref));
    fs.mkdirSync(refDir, { recursive: true });
    write(path.join(refDir, 'dependencies.json'), JSON.stringify({
      schema: SCHEMA, dependencies: getDependencies(db, appId, r.ref).map(d => ({
        ecosystem: d.ecosystem, name: d.name, version: d.dep_version, lockfile: d.lockfile, tier: d.tier,
        direct: d.direct === null ? null : d.direct === 1,
        scope: scopeOfRow(d) === 'unknown' ? null : scopeOfRow(d),
        part: productPartOf(d.lockfile) || undefined,
        dependants: dependantsOfRow(d.dependants),
        products: counts.byName.get(`${d.ecosystem}:${d.name}`) || 1,
        productsSameVersion: counts.byVersion.get(`${d.ecosystem}:${d.name}@${d.dep_version}`) || 1,
      })),
    }));
    const subs = getSubmodules(db, appId, r.ref);
    if (subs) write(path.join(refDir, 'submodules.json'), JSON.stringify({ schema: SCHEMA, rows: subs.rows.map(submoduleRow) }));
  }
  // The app file last: a reader that sees a release in it finds its dependency list.
  write(path.join(dir, 'apps', `${safeName(appId)}.json`), JSON.stringify(app));
  // The repository's other app ids (the iPhone page, a desktop record) get a
  // stub pointing at the file above, so a reader needs no index lookup.
  for (const alias of app.aliases) {
    if (alias.appId === appId || isExported(alias.appId)) continue;
    write(path.join(dir, 'apps', `${safeName(alias.appId)}.json`), JSON.stringify({ schema: SCHEMA, appId, alias: true }));
  }
  return app;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outFlag = process.argv.indexOf('--out');
  const outDir = outFlag > -1 ? process.argv[outFlag + 1] : process.env.SOURCE_ANALYSIS_EXPORT_DIR;
  if (!outDir) {
    console.error('Usage: node export.mjs --out <dir>   (or SOURCE_ANALYSIS_EXPORT_DIR)');
    process.exit(2);
  }
  const { initDatabase } = await import('./ddbbUtils.mjs');
  const { DB_PATH } = await import('./config.mjs');
  const { lockPathFor, waitForLock } = await import('./runLock.mjs');
  const release = await waitForLock(lockPathFor(DB_PATH)); // not while a pass or refresh writes
  const db = initDatabase();
  try {
    const { SCOPE } = await import('./config.mjs');
    const { apps, releases, dir } = exportAll(db, outDir, { onlyReproducible: SCOPE !== 'all' });
    console.log(`Exported ${apps} apps, ${releases} releases to ${dir}`);
  } finally {
    db.close();
    release();
  }
}
