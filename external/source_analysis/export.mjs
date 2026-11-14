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
import { getAppList, getAnalyses, listAnalysedApps, getDependencies, getVulnerabilities, diffDependencies, dependantsOfRow, packageSources, getSubmodules, getRebuildClaims, getDefaultBranch, getReproducibleVersions, DEFAULT_BRANCH_REF } from './ddbbUtils.mjs';
import { partOfFile, productPartOf, targetOfLockfile, targetsOfLockfiles, unlistedFiles, useRepositories } from './products.mjs';
import { scopeOfRow, partOfLockfiles, scopesOfRows, submoduleRow, summarizeRelease, analysisEntry, compareReleasesNewestFirst, dependantVersionsOf, releaseRebuilds } from './exportRelease.mjs';
import { reproducedListings, scopeFilter } from './exportScope.mjs';

// Moved to exportRelease.mjs and exportScope.mjs; still exported from here for existing callers.
export { summarizeSubmodules, summarizeRelease, dependantVersionsOf, releaseRebuilds } from './exportRelease.mjs';
export { pagePlatform, reproducedListings } from './exportScope.mjs';

export const SCHEMA = 1;

// A file name an app id or release tag maps to: ids are reverse-DNS or slugs,
// tags may carry slashes or spaces.
export function safeName(s) {
  return String(s).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '_') || '_';
}

// A lockfile that belongs to another product built from the same repository:
// the desktop app (electron/, desktop/), a server, a website, a browser
// extension, the docs. Its packages are not in the mobile app the wallet page
// is about, whatever the lockfile says about dev and prod (AirGap's ejs came
// from electron/package-lock.json). null for the main product.
export { productPartOf };

// The releases of an app that have stored rows but no analyses row (analysed
// before the table existed): still exported, with provenance marked unknown.
function releasesWithoutAnalysis(db, appId, analyses) {
  const known = new Set(analyses.filter(a => a.kind === 'release').map(a => a.ref));
  return db.prepare('SELECT DISTINCT version FROM app_dependencies WHERE app_id = ? ORDER BY created_at DESC').all(appId)
    .map(r => r.version).filter(v => !known.has(v) && v !== DEFAULT_BRANCH_REF);
}

// Everything the export says about one app.
// counts: productCounts(db), passed in by exportAll so the two queries run once per export.
// With `reproduced` (reproducedListings) only the releases in it, each with
// `reproducedFor` and `versions` (the names verifiers typed for it); the other
// analyses stay in the database as early warning.
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
  if (reproduced) for (const r of releases) Object.assign(r, { reproducedFor: reproduced.get(r.ref).listings, versions: reproduced.get(r.ref).versions });
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

// Every app with an analysis or stored dependency rows.
function analysedAppIds(db) {
  return new Set([...listAnalysedApps(db), ...db.prepare('SELECT DISTINCT app_id FROM app_dependencies').all().map(r => r.app_id)]);
}

// The releases an export with onlyReproducible writes, as [appId, ref] pairs:
// the reproduced ones (reproducedListings) of every app in scope.
export function exportedReleases(db, aliases = loadRepositories(db)) {
  const inScope = scopeFilter(db, aliases);
  const byApp = getReproducibleVersions(db);
  const out = [];
  for (const appId of analysedAppIds(db)) {
    if (!inScope(appId)) continue;
    for (const ref of reproducedListings(db, appId, aliases.get(appId) || [], byApp).keys()) out.push([appId, ref]);
  }
  return out;
}

// How many products ship each package (any version) and each exact version:
// "12 products use libX, 3 use libX 0.2.3". Keyed by ecosystem:name and
// ecosystem:name@version. With `releases` ([appId, ref] pairs, exportedReleases)
// only those releases count: "Used by" names wallets the site shows, not every
// analysed app in the database (issue 1020 P18).
export function productCounts(db, releases = null) {
  const byName = new Map();
  const byVersion = new Map();
  const from = releases
    ? `json_each(?) j JOIN app_dependencies d ON d.app_id = j.value ->> 0 AND d.version = j.value ->> 1 JOIN packages p ON p.id = d.package_id`
    : 'app_dependencies d JOIN packages p ON p.id = d.package_id';
  const params = releases ? [JSON.stringify(releases), DEFAULT_BRANCH_REF] : [DEFAULT_BRANCH_REF];
  const rows = db.prepare(`
    SELECT p.ecosystem, p.name, p.version, COUNT(DISTINCT d.app_id) AS products
    FROM ${from}
    WHERE d.version != ?
    GROUP BY p.ecosystem, p.name, p.version
  `).all(...params);
  const apps = db.prepare(`
    SELECT p.ecosystem, p.name, COUNT(DISTINCT d.app_id) AS products
    FROM ${from}
    WHERE d.version != ?
    GROUP BY p.ecosystem, p.name
  `).all(...params);
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
  let appIds = analysedAppIds(db);
  // Out of scope (no reproducible version, reproducible.mjs, or past its end of life): the rows stay in
  // the database as supplementary data, the site does not show them.
  if (onlyReproducible) {
    const inScope = scopeFilter(db, aliases);
    appIds = new Set([...appIds].filter(inScope));
  }
  const index = { schema: SCHEMA, apps: [] };
  const counts = productCounts(db, onlyReproducible ? exportedReleases(db, aliases) : null);
  const sources = packageSources(db);
  const rebuilds = getRebuildClaims(db);
  let releases = 0;
  const unlisted = {};
  // Alias stubs wait for the loop: an alias in scope may still write nothing
  // of its own (its reproduced refs sit under the other id, Passport Batch 2).
  const stubs = new Map();
  for (const appId of [...appIds].sort()) {
    const app = writeAppFiles(db, tmp, appId, aliases.get(appId) || [], counts, sources, null, { rebuilds, onlyReproducible, stubs });
    if (!app) continue;
    releases += app.releases.length;
    index.apps.push(indexEntry(app));
    const files = unlistedFiles(app.releases.flatMap(r => r.dependencies?.lockfiles || []), appId);
    if (files.length) unlisted[appId] = files;
  }
  const written = new Set(index.apps.map(a => a.appId));
  for (const [alias, appId] of stubs) {
    if (!written.has(alias)) fs.writeFileSync(path.join(tmp, 'apps', `${safeName(alias)}.json`), JSON.stringify({ schema: SCHEMA, appId, alias: true }));
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
export function exportApp(db, outDir, appId, { onlyReproducible = false, counts = null, sources = packageSources(db) } = {}) {
  const aliases = loadRepositories(db);
  counts ??= productCounts(db, onlyReproducible ? exportedReleases(db, aliases) : null);
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


function writeAtomic(file, content) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}


// One app's files under dir: apps/<appId>.json, a dependencies.json per
// release, and a stub for each alias that is not exported in its own right.
// With `stubs` (a Map) the stubs are collected there instead, alias id to app id.
// Writes nothing and returns null when `onlyReproducible` leaves no release.
function writeAppFiles(db, dir, appId, aliases, counts, sources, isExported, { atomic = false, rebuilds = getRebuildClaims(db), onlyReproducible = false, stubs = null } = {}) {
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
    if (alias.appId === appId || (reproducedIds && !reproducedIds.has(alias.appId))) continue;
    if (stubs) { stubs.set(alias.appId, appId); continue; }
    if (isExported(alias.appId)) continue;
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
