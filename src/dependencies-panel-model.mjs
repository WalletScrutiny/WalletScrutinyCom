// What the wallet page's "Dependencies" panel shows, computed from one app's
// file of the source-analysis export (external/source_analysis/export.mjs,
// apps/<appId>.json). Pure functions, no DOM: the renderer in
// dependencies-panel.mjs only lays these out.

export const SEVERITY_ORDER = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];

export const SEVERITY_LABEL = {
  malicious: 'Malware',
  critical: 'Critical',
  high: 'High',
  moderate: 'Medium',
  low: 'Low',
  unknown: 'Unrated',
};

export const SKIP_REASON_LABEL = {
  floating: 'version range, not an exact version',
  unversioned: 'no version recorded',
  'source-ref-pinned': 'built from a git reference, not a registry release',
  'git-or-path': 'git or local path dependency',
  'no-exact-version': 'no exact version',
  ecosystem: 'ecosystem OSV.dev does not cover',
};

export const WORST_ROWS = 10;

// Where a package ends up: "app" (reachable from the project's own
// dependencies, so bundled), "build" (its development tooling), "tests" (test
// frameworks and what only they pull in), or "?" when the files do not say.
// Rows exported before `scope` existed only carry the dev flag.
export const WHERE_LABELS = { app: 'app', build: 'build', tests: 'tests' };
export function whereOf(row) {
  if (row?.scope && WHERE_LABELS[row.scope]) return row.scope;
  if (row?.dev === true) return 'build';
  if (row?.dev === false) return 'app';
  return 'unknown';
}
export function whereLabel(row) {
  return WHERE_LABELS[whereOf(row)] || '?';
}

// The digits of a version: "android-v2.8.4" -> "2.8.4", "v1.4.0-beta1" -> "1.4.0-beta1".
export function versionCore(s) {
  const m = String(s || '').match(/\d+(?:\.\d+)*(?:[-+.][0-9A-Za-z.]+)?/);
  return m ? m[0] : '';
}

// Whether the analysed source tag names the version the store ships. A tag
// without digits matches nothing; a store version without digits matches nothing.
export function tagMatchesVersion(ref, storeVersion) {
  const tag = versionCore(ref);
  const store = versionCore(storeVersion);
  if (!tag || !store) return false;
  return tag === store || tag.split(/[-+]/)[0] === store.split(/[-+]/)[0];
}

// Advisories as the table shows them: worst first, then by package name.
export function sortAdvisories(advisories = []) {
  return [...advisories].sort((a, b) =>
    SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
    || (a.package || '').localeCompare(b.package || '')
    || (a.id || '').localeCompare(b.id || ''));
}

// Total of the OSV skip counts, whatever the reasons.
export function uncheckedCount(osv) {
  if (!osv || !osv.skipped) return null;
  return Object.values(osv.skipped).reduce((n, v) => n + (Number(v) || 0), 0);
}

export function uncheckedBreakdown(osv) {
  if (!osv || !osv.skipped) return [];
  return Object.entries(osv.skipped)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, n]) => ({ reason, label: SKIP_REASON_LABEL[reason] || reason, count: n }));
}

/**
 * The panel's content for one app file. `storeVersion` is the version the
 * wallet page lists; `release` picks a specific analysed release, else the
 * latest. Returns null when the app has no analysed release.
 */
export function panelModel(app, { storeVersion = '', release = null } = {}) {
  const releases = Array.isArray(app?.releases) ? app.releases : [];
  // The newest release whose analysis worked; a newer one that failed is reported, not shown.
  const current = (release && releases.find(r => r.ref === release)) || releases.find(r => (r.status || 'ok') === 'ok') || releases[0];
  if (!current) return null;
  const newerFailed = releases.slice(0, releases.indexOf(current)).filter(r => r.status && r.status !== 'ok');

  const bySeverity = { ...Object.fromEntries(SEVERITY_ORDER.map(s => [s, 0])), ...(current.vulnerabilities?.bySeverity || {}) };
  const malware = bySeverity.malicious;
  const vulnerabilities = SEVERITY_ORDER.filter(s => s !== 'malicious').reduce((n, s) => n + bySeverity[s], 0);
  const advisories = sortAdvisories(current.advisories || []);
  const unchecked = uncheckedCount(current.osv);

  return {
    ref: current.ref,
    commit: current.commit ? String(current.commit).slice(0, 7) : null,
    analysedAt: current.analysedAt || null,
    status: current.status || 'ok',
    error: current.error || null,
    storeVersion: storeVersion || null,
    versionMatches: storeVersion ? tagMatchesVersion(current.ref, storeVersion) : null,
    packages: current.dependencies?.total ?? 0,
    direct: current.dependencies?.direct ?? 0,
    devUnknown: current.dependencies?.devUnknown ?? 0,
    byScope: current.dependencies?.byScope || null,
    whereUnknown: current.dependencies?.byScope?.unknown ?? current.dependencies?.devUnknown ?? 0,
    ecosystems: Object.keys(current.dependencies?.byEcosystem || {}),
    tiers: current.dependencies?.tiers || {},
    lockfiles: current.lockfiles?.length ? current.lockfiles : (current.dependencies?.lockfiles || []),
    unchecked,
    uncheckedBreakdown: uncheckedBreakdown(current.osv),
    vulnerabilities,
    malware,
    bySeverity,
    vulnerablePackages: current.vulnerabilities?.packages ?? 0,
    vulnerabilitiesByScope: current.vulnerabilities?.byScope || null,
    advisories,
    worst: advisories.slice(0, WORST_ROWS),
    diff: current.diffFrom || null,
    newerFailed: newerFailed.map(r => ({ ref: r.ref, status: r.status, error: r.error || null })),
    releases: releases.map(r => ({ ref: r.ref, analysedAt: r.analysedAt || null, status: r.status || 'ok' })),
    sameRepositoryAs: app.aliases?.length > 1 ? app.aliases.map(a => a.appId).filter(id => id !== app.appId) : [],
  };
}

// File name the export uses for an app id or release tag (export.mjs safeName).
export function safeName(s) {
  return String(s).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '_') || '_';
}

const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// One CSV with the whole dependency list and, per row, the advisories hitting it.
export function csvOf(dependencies = [], advisories = []) {
  const byPackage = new Map();
  for (const a of advisories) {
    const key = `${a.ecosystem}:${a.package}@${a.version}`;
    if (!byPackage.has(key)) byPackage.set(key, []);
    byPackage.get(key).push(a);
  }
  const header = ['ecosystem', 'package', 'version', 'lockfile', 'direct', 'where', 'pinning', 'advisories', 'worst_severity'];
  const lines = [header.join(',')];
  for (const d of dependencies) {
    const hits = byPackage.get(`${d.ecosystem}:${d.name}@${d.version}`) || [];
    const worst = sortAdvisories(hits)[0];
    lines.push([
      d.ecosystem, d.name, d.version, d.lockfile,
      d.direct === null ? '' : (d.direct ? 'yes' : 'no'),
      whereOf(d),
      d.tier,
      hits.map(h => h.id).join(' '),
      worst ? worst.severity : '',
    ].map(csvCell).join(','));
  }
  return lines.join('\n') + '\n';
}
