// The release summary and row shaping the export writes for each release:
// counts, scopes, submodules, the analysis entry, the newest-first order,
// rebuild claims (export.mjs puts them together into the app files).
import { coverageForReaders, coverageByPlatform } from './plugins/lock-coverage.mjs';
import { buildLockForReaders } from './plugins/build-lock.mjs';
import { getDependencies, getVulnerabilities, getSubmodules, dependantsOfRow } from './ddbbUtils.mjs';
import { COUNTED_TARGETS, partOfFile, sortingOf, targetOfLockfile, unlistedFiles } from './products.mjs';

// `informational` is a RustSec notice (unmaintained, unsound), not a
// vulnerability report (plugins/osv.mjs); `unknown` stays last, countBy's fallback.
export const SEVERITIES = ['malicious', 'critical', 'high', 'moderate', 'low', 'informational', 'unknown'];

export const countBy = (rows, key, keys) => {
  const out = Object.fromEntries(keys.map(k => [k, 0]));
  for (const r of rows) out[keys.includes(r[key]) ? r[key] : keys[keys.length - 1]]++;
  return out;
};

// A stored row's scope; rows written before the column existed fall back to the dev flag.
export function scopeOfRow(row) {
  if (row.scope) return row.scope;
  if (row.dev === 1) return 'build';
  if (row.dev === 0) return 'app';
  return 'unknown';
}

// The other product a row belongs to when every lockfile it comes from is that product's.
export function partOfLockfiles(lockfiles, appId) {
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
export function submoduleRow({ depth, ...r }) {
  const out = { ...r };
  if (r.scope) { const { via, ...scope } = r.scope; out.scope = scope; }
  if (r.identity) { const { baseCommit, ...identity } = r.identity; out.identity = identity; }
  return out;
}

// The counts the wallet page shows for a set of dependency rows.
export function dependencyCounts(deps) {
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
export function countsByTarget(deps, appId) {
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
export function librariesOnlyOutside(deps, appId) {
  const targets = deps.map(d => targetOfLockfile(d.lockfile, appId));
  const key = d => `${d.ecosystem}:${d.name}@${d.dep_version}`;
  return Object.fromEntries(Object.entries(COUNTED_TARGETS).map(([platform, counted]) => {
    const inside = new Set(deps.filter((_, i) => counted.includes(targets[i])).map(key));
    return [platform, new Set(deps.filter((d, i) => !counted.includes(targets[i]) && !inside.has(key(d))).map(key)).size];
  }));
}

// A package's scope in each target when it differs from the row's, which is
// the whole repository's: a build tool here can be bundled in another app.
export const SCOPE_RANK = ['app', 'build', 'tests', 'unknown'];
export function scopesOfRows(rows, appId, scope) {
  const best = {};
  for (const d of rows) {
    const target = targetOfLockfile(d.lockfile, appId);
    const s = scopeOfRow(d);
    if (!best[target] || SCOPE_RANK.indexOf(s) < SCOPE_RANK.indexOf(best[target])) best[target] = s;
  }
  return Object.values(best).some(s => s !== scope) ? best : undefined;
}

export function vulnsLookedUpAt(db, appId, ref) {
  return db.prepare('SELECT MAX(checked_at) AS at FROM app_vulnerabilities WHERE app_id = ? AND version = ?').get(appId, ref)?.at || undefined;
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
      // where the advisories sit; notices are counted only under bySeverity
      byScope: Object.fromEntries(['app', 'build', 'tests', 'unknown'].map(s => [s, vulns.filter(v => v.severity !== 'informational' && scopeOfRow(v) === s).length])),
      // when OSV.dev last answered for this release: every lookup rewrites its
      // rows (saveVulnerabilities), the hourly refresh's too; none without rows
      lookedUpAt: vulnsLookedUpAt(db, appId, ref),
    },
  };
}

export function analysisEntry(a) {
  return {
    ref: a.ref, commit: a.commit_sha, analysedAt: a.analysed_at, status: a.status,
    error: a.error || undefined, lockfiles: a.lockfiles,
    osv: a.osv_checked === null ? null : { skipped: a.osv_skipped },
    // how much of the build the lockfiles we read cover (plugins/lock-coverage.mjs)
    lockCoverage: coverageForReaders(a.lock_coverage) || undefined,
    // the same, for one app's page, when the repository also builds the other app
    lockCoverageByPlatform: coverageByPlatform(a.lock_coverage),
    // the build's own download list, when the verification carries one (plugins/build-lock.mjs)
    buildLock: buildLockForReaders(a.build_lock) || undefined,
    // a later re-check that failed and left this result in place (issue 998)
    recheckFailed: a.failed_attempt_at ? { at: a.failed_attempt_at, error: a.failed_attempt_error || undefined } : undefined,
  };
}

// Newest first by version number (v1.10.0 > v1.9.0; 1.2.0 > 1.2.0-rc1). Refs
// without digits fall back to analysis time. Returns 0 for equal versions, so
// the stable sort keeps their stored order.
export function compareReleasesNewestFirst(x, y) {
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
