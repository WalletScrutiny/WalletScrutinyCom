#!/usr/bin/env node
// Static export of the analysis database for consumers outside this host: the
// website first (a "Source analysis" section per wallet), the Android app and
// anyone else later. Plain JSON files, written atomically into one directory,
// small at the top and detailed below, so a reader fetches only what it shows:
//
//   index.json                          the exported app ids (exportApp keeps it current)
//   apps/<appId>.json                   all analyses of one app, with advisories (each with how many products ship the package) and the diff to the previous release
//   apps/<aliasId>.json                 stub {appId, alias: true} for the repository's other app ids (the iPhone record), only those some release was reproduced for
//   apps/<appId>/<ref>/dependencies.json  the full resolved dependency list of one release, each row with how many products ship the package
//   apps/<appId>/<ref>/submodules.json    the release's git submodules, when it has any
//   apps/<appId>/<ref>/rebuilds.json      who rebuilt which of the release's dependencies from source (ours and imported claims), when anyone did
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
import { getAppList, getAnalyses, listAnalysedApps, getDependencies, getVulnerabilities, diffDependencies, dependantsOfRow, packageSources, getReproducibleVersions, getVerifiedRefs, getEndOfLife, getSubmodules, getRebuildClaims, getDefaultBranch, DEFAULT_BRANCH_REF } from './ddbbUtils.mjs';
import { COUNTED_TARGETS, partOfFile, productPartOf, sortingOf, targetOfLockfile, targetsOfLockfiles, unlistedFiles, useRepositories } from './products.mjs';

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
export { productPartOf };

// The other product a row belongs to when every lockfile it comes from is that product's.
function partOfLockfiles(lockfiles, appId) {
  const parts = [...new Set(lockfiles.map(l => partOfFile(l, appId)))];
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

// The counts the wallet page shows for a set of dependency rows.
function dependencyCounts(deps) {
  return {
    total: deps.length,
    direct: deps.filter(d => d.direct === 1).length,
    // where the packages end up, from the lockfile graph: app / build / tests / unknown
    byScope: Object.fromEntries(['app', 'build', 'tests', 'unknown'].map(s => [s, deps.filter(d => scopeOfRow(d) === s).length])),
    byEcosystem: Object.fromEntries([...new Set(deps.map(d => d.ecosystem))].sort().map(e => [e, deps.filter(d => d.ecosystem === e).length])),
  };
}

// The same counts per target (products.mjs), for a page that counts only its
// own app's files; undefined when the repository has only shared files.
function countsByTarget(deps, appId) {
  const rows = new Map();
  for (const d of deps) {
    const target = targetOfLockfile(d.lockfile, appId);
    if (!rows.has(target)) rows.set(target, []);
    rows.get(target).push(d);
  }
  if (![...rows.keys()].some(t => t !== 'shared')) return undefined;
  return Object.fromEntries([...rows].sort(([x], [y]) => x.localeCompare(y)).map(([t, r]) => [t, dependencyCounts(r)]));
}

// Per page, the libraries found only in files it does not count: the same
// library in the app's own files and the desktop app's is in the app.
function librariesOnlyOutside(deps, appId) {
  const targets = deps.map(d => targetOfLockfile(d.lockfile, appId));
  const key = d => `${d.ecosystem}:${d.name}@${d.dep_version}`;
  return Object.fromEntries(Object.entries(COUNTED_TARGETS).map(([platform, counted]) => {
    const inside = new Set(deps.filter((_, i) => counted.includes(targets[i])).map(key));
    return [platform, new Set(deps.filter((d, i) => !counted.includes(targets[i]) && !inside.has(key(d))).map(key)).size];
  }));
}

// A package's scope in each target when it differs from the row's, which is
// the whole repository's: a build tool here can be bundled in another app.
const SCOPE_RANK = ['app', 'build', 'tests', 'unknown'];
function scopesOfRows(rows, appId, scope) {
  const best = {};
  for (const d of rows) {
    const target = targetOfLockfile(d.lockfile, appId);
    const s = scopeOfRow(d);
    if (!best[target] || SCOPE_RANK.indexOf(s) < SCOPE_RANK.indexOf(best[target])) best[target] = s;
  }
  return Object.values(best).some(s => s !== scope) ? best : undefined;
}

export function summarizeRelease(db, appId, ref) {
  const deps = getDependencies(db, appId, ref);
  const vulns = getVulnerabilities(db, appId, ref);
  const submodules = summarizeSubmodules(getSubmodules(db, appId, ref));
  const byTarget = countsByTarget(deps, appId);
  const unlisted = unlistedFiles(deps.map(d => d.lockfile), appId);
  return {
    ...(submodules ? { submodules } : {}),
    dependencies: {
      ...dependencyCounts(deps),
      lockfiles: [...new Set(deps.map(d => d.lockfile))].sort(),
      byTarget,
      onlyOutside: byTarget ? librariesOnlyOutside(deps, appId) : undefined,
      // files that look like another product's but nobody has checked; still counted
      unlisted: unlisted.length ? unlisted : undefined,
      // whether a person reviewed how this release's files were sorted (products.mjs)
      sorting: sortingOf(deps.map(d => d.lockfile), appId),
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
    // a later re-check that failed and left this result in place (issue 998)
    recheckFailed: a.failed_attempt_at ? { at: a.failed_attempt_at, error: a.failed_attempt_error || undefined } : undefined,
  };
}

// The releases of an app that have stored rows but no analyses row (analysed
// before the table existed): still exported, with provenance marked unknown.
function releasesWithoutAnalysis(db, appId, analyses) {
  const known = new Set(analyses.filter(a => a.kind === 'release').map(a => a.ref));
  return db.prepare('SELECT DISTINCT version FROM app_dependencies WHERE app_id = ? ORDER BY created_at DESC').all(appId)
    .map(r => r.version).filter(v => !known.has(v) && v !== DEFAULT_BRANCH_REF);
}

// Newest first by version number (v1.10.0 > v1.9.0; 1.2.0 > 1.2.0-rc1). Refs
// without digits fall back to analysis time. Returns 0 for equal versions, so
// the stable sort keeps their stored order.
function compareReleasesNewestFirst(x, y) {
  // The version digits, wherever the tag puts them: "firmware-btc-only/v9.25.0"
  // and "android-v2.8.4" have a prefix with a dash in it.
  const version = r => String(r.ref).match(/\d+(?:\.\d+)+/) || String(r.ref).match(/\d+/);
  const vx = version(x), vy = version(y);
  if (!vx || !vy) return (y.analysedAt || '').localeCompare(x.analysedAt || '');
  const nx = vx[0].split('.'), ny = vy[0].split('.');
  for (let i = 0; i < Math.max(nx.length, ny.length); i++) {
    const d = Number(ny[i] ?? -1) - Number(nx[i] ?? -1);
    if (d) return d;
  }
  // only what follows the digits marks a pre-release, not the prefix
  const pre = v => /alpha|beta|rc|pre|dev|snapshot/i.test(v.input.slice(v.index + v[0].length)) ? 1 : 0;
  return pre(vx) - pre(vy);
}

// A verification's platform tag as the wallet page names its platform:
// verifiers write linux, windows or "Android (arm64-v8a)".
export function pagePlatform(platform) {
  const p = String(platform || '').toLowerCase();
  if (p.includes('android')) return 'android';
  if (/ios|iphone/.test(p)) return 'iphone';
  if (/linux|windows|mac|desktop/.test(p)) return 'desktop';
  return p || null;
}

// ref -> the listings ({ appId, platform }) whose binary of that release was
// reproduced. Only those artifacts get their dependencies shown (Leo,
// 2026-11-09): a sibling listing that was never reproduced (the iPhone app of a
// reproduced Android app, an older hardware model) builds from other files or
// ships something else. verified_refs is the tag each pass resolved a verified
// version to (reproducible.mjs); the version names the listing that verified it.
export function reproducedListings(db, appId, aliases = [], byApp = getReproducibleVersions(db)) {
  const ids = [...new Set([appId, ...aliases.map(a => a.appId)])];
  const out = new Map();
  for (const [ref, version] of getVerifiedRefs(db, appId)) {
    const listings = [];
    for (const id of ids) {
      for (const v of byApp.get(id) || []) {
        if (v.version !== version) continue;
        const platform = pagePlatform(v.platform);
        if (!listings.some(l => l.appId === id && l.platform === platform)) listings.push({ appId: id, platform });
      }
    }
    if (listings.length) out.set(ref, listings);
  }
  return out;
}

// Everything the export says about one app.
// counts: productCounts(db), passed in by exportAll so the two queries run once per export.
// With `reproduced` (reproducedListings) only the releases in it, each with
// `reproducedFor`; the other analyses stay in the database as early warning.
export function buildApp(db, appId, aliases = [], counts = productCounts(db), sources = packageSources(db), { reproduced = null } = {}) {
  const analyses = getAnalyses(db, appId);
  const releases = [];
  const seen = new Set();
  for (const a of analyses) {
    if (a.kind !== 'release' || seen.has(a.ref)) continue;
    seen.add(a.ref);
    if (reproduced && !reproduced.has(a.ref)) continue;
    releases.push({ ...analysisEntry(a), ...summarizeRelease(db, appId, a.ref) });
  }
  for (const v of releasesWithoutAnalysis(db, appId, analyses)) {
    if (reproduced && !reproduced.has(v)) continue;
    releases.push({ ref: v, commit: null, analysedAt: null, status: 'ok', ...summarizeRelease(db, appId, v) });
  }
  if (reproduced) for (const r of releases) r.reproducedFor = reproduced.get(r.ref);
  const inDefaultBranch = defaultBranchCheck(db, appId);
  // Newest version first. Analysis time says nothing about it: releases added
  // later (backfill) are analysed last but are older. Equal versions keep their order.
  releases.sort(compareReleasesNewestFirst);
  // The day each release was published, for the /news/ page's release-age
  // filter: its GitHub release assets, else the tagged commit's date
  // (releaseDates.mjs); absent when neither is known.
  const releasedOn = new Map(db.prepare('SELECT ref, released_at AS at FROM release_dates WHERE app_id = ? AND released_at IS NOT NULL')
    .all(appId).map(row => [row.ref, row.at]));
  for (const row of db.prepare('SELECT version, MIN(published_at) AS at FROM assets WHERE app_id = ? AND published_at IS NOT NULL GROUP BY version').all(appId)) {
    releasedOn.set(row.version, String(row.at).slice(0, 10));
  }
  for (let i = 0; i < releases.length; i++) {
    const r = releases[i];
    if (releasedOn.has(r.ref)) r.releasedAt = releasedOn.get(r.ref);
    const previous = releases[i + 1];
    const rowsOf = new Map();
    for (const d of getDependencies(db, appId, r.ref)) {
      const key = `${d.ecosystem}:${d.name}@${d.dep_version}`;
      if (!rowsOf.has(key)) rowsOf.set(key, []);
      rowsOf.get(key).push(d);
    }
    const rowsOfAdvisory = v => rowsOf.get(`${v.ecosystem}:${v.name}@${v.dep_version}`) || [];
    // The versions each package is locked at, per lockfile: a statement on a
    // row records its direct users' (src/dependency-triage.mjs, issue 995).
    const lockedAt = new Map();
    for (const rows of rowsOf.values()) for (const d of rows) {
      const key = `${d.lockfile}\0${d.ecosystem}:${d.name}`;
      if (!lockedAt.has(key)) lockedAt.set(key, new Set());
      lockedAt.get(key).add(d.dep_version);
    }
    r.advisories = getVulnerabilities(db, appId, r.ref).map(v => ({
      id: v.vuln_id, severity: v.severity, aliases: v.aliases ? v.aliases.split(' ') : [],
      summary: v.summary, ecosystem: v.ecosystem, package: v.name, version: v.dep_version,
      affected: v.affected ? JSON.parse(v.affected) : undefined,
      fixed: v.fixed ? v.fixed.split(' ') : undefined,
      direct: v.direct === null ? null : v.direct === 1,
      scope: scopeOfRow(v) === 'unknown' ? null : scopeOfRow(v),
      part: partOfLockfiles(rowsOfAdvisory(v).map(d => d.lockfile), appId) || undefined,
      targets: targetsOfLockfiles(rowsOfAdvisory(v).map(d => d.lockfile), appId),
      scopes: targetsOfLockfiles(rowsOfAdvisory(v).map(d => d.lockfile), appId) ? scopesOfRows(rowsOfAdvisory(v), appId, scopeOfRow(v)) : undefined,
      dependants: dependantsOfRow(v.dependants),
      dependantVersions: dependantVersionsOf(v, rowsOfAdvisory(v), lockedAt),
      repo: sources.get(`${v.ecosystem}:${v.name}`)?.repo_url || undefined,
      products: counts.byName.get(`${v.ecosystem}:${v.name}`) || 1,
      productsSameVersion: counts.byVersion.get(`${v.ecosystem}:${v.name}@${v.dep_version}`) || 1,
      inDefaultBranch: inDefaultBranch?.(v),
    }));
    if (previous) {
      const d = diffDependencies(db, appId, previous.ref, r.ref);
      r.diffFrom = { ref: previous.ref, added: d.added.length, removed: d.removed.length, changed: d.changed.length,
        integrityChangedAtSameVersion: d.changed.filter(c => c.integrityChangedAtSameVersion.length).map(c => `${c.ecosystem}:${c.name}`) };
    }
  }
  const defaultBranch = inDefaultBranch ? getDefaultBranch(db, appId) : null;
  return { schema: SCHEMA, appId, aliases, ...(defaultBranch ? { defaultBranch } : {}), releases };
}

// Whether a release's advisory is gone on the default branch's latest
// analysis: { status: 'removed' } when no file read there lists the package,
// { status: 'updated', versions } when it is there only at versions the
// advisory does not match (its ids and aliases are not among the branch's own
// advisories for the package), undefined while it still matches or nothing is
// known. Null when the branch has no stored rows to compare with. The
// branch's advisories are looked up again with the releases' (recheck.mjs),
// so an advisory published after its analysis does not read as fixed.
export function defaultBranchCheck(db, appId) {
  if (!getDefaultBranch(db, appId)) return null;
  const deps = getDependencies(db, appId, DEFAULT_BRANCH_REF);
  if (!deps.length) return null;
  const versions = new Map();
  for (const d of deps) {
    const key = `${d.ecosystem}:${d.name}`;
    if (!versions.has(key)) versions.set(key, new Set());
    versions.get(key).add(d.dep_version);
  }
  const ids = new Map();
  for (const v of getVulnerabilities(db, appId, DEFAULT_BRANCH_REF)) {
    const key = `${v.ecosystem}:${v.name}`;
    if (!ids.has(key)) ids.set(key, new Set());
    for (const id of [v.vuln_id, ...(v.aliases ? v.aliases.split(' ') : [])]) ids.get(key).add(id);
  }
  return (v) => {
    const key = `${v.ecosystem}:${v.name}`;
    if (!versions.has(key)) return { status: 'removed' };
    const listed = ids.get(key);
    if (listed && [v.vuln_id, ...(v.aliases ? v.aliases.split(' ') : [])].some(id => listed.has(id))) return undefined;
    return { status: 'updated', versions: [...versions.get(key)].sort() };
  };
}

// The versions of an advisory row's direct users in the lockfiles the
// vulnerable package is in, `{ alib: ['1.2.0'] }`; undefined without
// dependants or when none is locked there.
export function dependantVersionsOf(v, rows, lockedAt) {
  const names = dependantsOfRow(v.dependants) || [];
  const out = {};
  for (const name of names) {
    const versions = new Set();
    for (const d of rows) for (const version of lockedAt.get(`${d.lockfile}\0${v.ecosystem}:${name}`) || []) versions.add(version);
    if (versions.size) out[name] = [...versions].sort();
  }
  return Object.keys(out).length ? out : undefined;
}

function indexEntry(app) {
  return { appId: app.appId };
}

// Connects each app id to its repository for the file-sorting rules, and returns
// the app ids the site lists for each analysed id (rows are keyed by the first
// alias of a repository, see appList.groupByRepository). Without the list no rules
// apply and every page would quietly count every file, so it stops the export:
// the last good one stays in place.
export function loadRepositories(db) {
  const list = getAppList(db);
  if (!list.length) throw new Error('The app list is empty, so no file-sorting rules can be found: not exporting');
  const { jobs, iosOnly } = groupByRepository(list);
  useRepositories([...jobs, ...iosOnly]);
  return new Map(jobs.map(j => [j.appId, j.aliases.map(a => ({ appId: a.appId, platform: a.platform }))]));
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
    WHERE d.version != ?
    GROUP BY p.ecosystem, p.name, p.version
  `).all(DEFAULT_BRANCH_REF);
  const apps = db.prepare(`
    SELECT p.ecosystem, p.name, COUNT(DISTINCT d.app_id) AS products
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    WHERE d.version != ?
    GROUP BY p.ecosystem, p.name
  `).all(DEFAULT_BRANCH_REF);
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
  const aliases = loadRepositories(db);
  const parent = path.dirname(path.resolve(outDir));
  fs.mkdirSync(parent, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(parent, '.export-'));
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
  const rebuilds = getRebuildClaims(db);
  let releases = 0;
  const unlisted = {};
  for (const appId of [...appIds].sort()) {
    const app = writeAppFiles(db, tmp, appId, aliases.get(appId) || [], counts, sources, (id) => appIds.has(id), { rebuilds, onlyReproducible });
    if (!app) continue;
    releases += app.releases.length;
    index.apps.push(indexEntry(app));
    const files = unlistedFiles(app.releases.flatMap(r => r.dependencies?.lockfiles || []), appId);
    if (files.length) unlisted[appId] = files;
  }
  writeUpstreamHints(db, tmp);
  // The APK checks (apk-contents-cli.mjs --export) are written next to the
  // export from outside the database; a new export keeps them.
  const apkDir = path.join(outDir, 'apk');
  if (fs.existsSync(apkDir)) fs.cpSync(apkDir, path.join(tmp, 'apk'), { recursive: true });
  // signals.json (signals.mjs) and news.json (news.mjs) are rewritten after the
  // export; until then, and when every feed is down, the previous ones stay.
  const signals = path.join(outDir, 'signals.json');
  if (fs.existsSync(signals)) fs.copyFileSync(signals, path.join(tmp, 'signals.json'));
  const news = path.join(outDir, 'news.json');
  if (fs.existsSync(news)) fs.copyFileSync(news, path.join(tmp, 'news.json'));
  fs.writeFileSync(path.join(tmp, 'index.json'), JSON.stringify(index));
  const previous = `${path.resolve(outDir)}.previous`;
  fs.rmSync(previous, { recursive: true, force: true });
  if (fs.existsSync(outDir)) fs.renameSync(outDir, previous);
  fs.renameSync(tmp, outDir);
  fs.rmSync(previous, { recursive: true, force: true });
  return { apps: index.apps.length, releases, dir: path.resolve(outDir), unlisted };
}

/**
 * Update one app in an existing export as soon as its analysis ends, so its
 * page does not wait for the rest of the pass: its app file, dependency lists,
 * alias stubs and index entry. Everything else (shared packages, upstream
 * hints, signals, releases removed since, product counts of the other apps)
 * stays as the last exportAll left it until the pass ends with a new one.
 * Each file is written to a temporary name and renamed into place.
 * Returns { exported: false } for an app out of scope or with no reproduced release, else
 * { exported: true, releases, files } with the paths (relative to outDir) to publish.
 */
export function exportApp(db, outDir, appId, { onlyReproducible = false, counts = productCounts(db), sources = packageSources(db) } = {}) {
  const aliases = loadRepositories(db);
  if (onlyReproducible && !scopeFilter(db, aliases)(appId)) return { exported: false };
  const indexFile = path.join(outDir, 'index.json');
  let index = null;
  try { index = JSON.parse(fs.readFileSync(indexFile, 'utf8')); } catch { /* first export: start an index */ }
  if (!index || index.schema !== SCHEMA || !Array.isArray(index.apps)) index = { schema: SCHEMA, apps: [] };
  const exported = new Set(index.apps.map(a => a.appId));
  const app = writeAppFiles(db, outDir, appId, aliases.get(appId) || [], counts, sources, (id) => id === appId || exported.has(id), { atomic: true, onlyReproducible });
  if (!app) return { exported: false };
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

/**
 * The rebuild claims for one release's dependencies: rows for rebuilds.json
 * and the counts for the release entry (packages someone reproduced, packages
 * tried with no success, and per claimant). Null when nobody tried any.
 */
export function releaseRebuilds(deps, claims) {
  const rows = [], seen = new Set();
  const summary = { reproduced: 0, failed: 0, byClaimant: {} };
  for (const d of deps) {
    const key = `${d.ecosystem}\0${d.name}\0${d.dep_version}`;
    if (seen.has(key) || !claims.has(key)) continue;
    seen.add(key);
    const list = claims.get(key);
    rows.push({ ecosystem: d.ecosystem, name: d.name, version: d.dep_version, claims: list });
    if (list.some(c => c.result === 'reproduced')) summary.reproduced++; else summary.failed++;
    for (const c of list) {
      const b = summary.byClaimant[c.by] ||= { reproduced: 0, failed: 0 };
      b[c.result]++;
    }
  }
  return rows.length ? { rows, summary } : null;
}

// One app's files under dir: apps/<appId>.json, a dependencies.json per
// release, and a stub for each alias that is not exported in its own right.
// Writes nothing and returns null when `onlyReproducible` leaves no release.
function writeAppFiles(db, dir, appId, aliases, counts, sources, isExported, { atomic = false, rebuilds = getRebuildClaims(db), onlyReproducible = false } = {}) {
  const write = atomic ? writeAtomic : (file, content) => fs.writeFileSync(file, content);
  const reproduced = onlyReproducible ? reproducedListings(db, appId, aliases) : null;
  const app = buildApp(db, appId, aliases, counts, sources, { reproduced });
  if (reproduced && !app.releases.length) return null;
  const reproducedIds = reproduced && new Set(app.releases.flatMap(r => r.reproducedFor.map(l => l.appId)));
  const appDir = path.join(dir, 'apps', safeName(appId));
  fs.mkdirSync(appDir, { recursive: true });
  for (const r of app.releases) {
    const refDir = path.join(appDir, safeName(r.ref));
    fs.mkdirSync(refDir, { recursive: true });
    const deps = getDependencies(db, appId, r.ref);
    const rb = releaseRebuilds(deps, rebuilds);
    if (rb) {
      write(path.join(refDir, 'rebuilds.json'), JSON.stringify({ schema: SCHEMA, rows: rb.rows }));
      r.rebuilds = rb.summary;
    }
    write(path.join(refDir, 'dependencies.json'), JSON.stringify({
      schema: SCHEMA, dependencies: deps.map(d => ({
        ecosystem: d.ecosystem, name: d.name, version: d.dep_version, lockfile: d.lockfile, tier: d.tier,
        direct: d.direct === null ? null : d.direct === 1,
        scope: scopeOfRow(d) === 'unknown' ? null : scopeOfRow(d),
        part: partOfFile(d.lockfile, appId) || undefined,
        // the product the row's file builds, as the release's byTarget counts it (the tree's "In this app", issue 996)
        target: r.dependencies?.byTarget ? targetOfLockfile(d.lockfile, appId) : undefined,
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
    if (alias.appId === appId || isExported(alias.appId) || (reproducedIds && !reproducedIds.has(alias.appId))) continue;
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
    const { apps, releases, dir, unlisted } = exportAll(db, outDir, { onlyReproducible: SCOPE !== 'all' });
    console.log(`Exported ${apps} apps, ${releases} releases to ${dir}`);
    for (const [appId, files] of Object.entries(unlisted)) console.log(`Counted as shared until checked (products.mjs): ${appId}: ${files.join(', ')}`);
  } finally {
    db.close();
    release();
  }
}
