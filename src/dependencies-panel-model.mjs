// What the wallet page's "Dependencies" panel shows, computed from one app's
// file of the source-analysis export (external/source_analysis/export.mjs,
// apps/<appId>.json). Pure functions, no DOM: the renderer in
// dependencies-panel.mjs only lays these out.

import { applyTriage, TRIAGE_LABEL, JUSTIFICATION_LABEL, whereOf, WHERE_LABELS } from './dependency-triage.mjs';

export { whereOf, WHERE_LABELS };

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

// Where a package ends up (`whereOf`, dependency-triage.mjs): "app", "build",
// "tests", or "?" when the files do not say.
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

// The analysed release for a version picked in "Every version"
// (src/build-verifications.mjs), or null when none was analysed. The version
// digits must agree; only a plain version ("1.4.0") also takes a tag with a
// suffix (v1.4.0-android), so a picked beta never shows the final release.
export function releaseForVersion(app, version) {
  const releases = Array.isArray(app?.releases) ? app.releases : [];
  const core = versionCore(version);
  if (!core) return null;
  return releases.find(r => versionCore(r.ref) === core)
    || (/[-+]/.test(core) ? null : releases.find(r => versionCore(r.ref).split(/[-+]/)[0] === core))
    || null;
}

// Public per-CVE signals (scripts/build-advisory-signals.mjs, signals.json):
// the advisory's EPSS probability and percentile, and whether CISA lists it
// as exploited, and the date it became public. Looked up by id or alias;
// null when the file has nothing.
export function signalsFor(advisory, signals) {
  if (!signals || !advisory) return { epss: null, epssPercentile: null, exploited: null, published: null };
  const out = { epss: null, epssPercentile: null, exploited: null, published: null };
  for (const id of [advisory.id, ...(advisory.aliases || [])]) {
    if (out.epss == null && signals.epss?.[id]) [out.epss, out.epssPercentile] = signals.epss[id];
    if (out.exploited == null && signals.kev?.[id]) out.exploited = signals.kev[id];
    if (out.published == null && signals.published?.[id]) out.published = signals.published[id];
  }
  return out;
}

export function applySignals(advisories = [], signals = null) {
  if (!signals) return advisories;
  return advisories.map(a => ({ ...a, ...signalsFor(a, signals) }));
}

// "0.5 %", "12 %", "<0.1 %": EPSS as the panel prints it.
export function epssLabel(p) {
  if (p == null) return null;
  const pct = p * 100;
  if (pct < 0.1) return '<0.1 %';
  return `${pct < 10 ? pct.toFixed(1) : Math.round(pct)} %`;
}

// Advisories as the table shows them: by severity alone, worst first; within
// one severity what is exploited in the wild, then the more likely to be
// exploited (EPSS); then by package name. Neither the decision nor where the
// package ends up moves a row (Leo, 2026-10-20).
export function sortAdvisories(advisories = []) {
  return [...advisories].sort((a, b) =>
    SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
    || (b.exploited ? 1 : 0) - (a.exploited ? 1 : 0)
    || (b.epss ?? -1) - (a.epss ?? -1)
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

// What scanner ignore files and VEX documents say about an advisory
// (external/source_analysis/upstreamTriage.mjs, upstream/<appId>.json): the
// wallet's own, or a direct user's at the shipped version. Unsigned and
// harvested, so they only ever join "What others say". An entry whose link a
// statement on the row already cites as evidence is left out (AirGap's own
// file was relayed as signed statements).
export function upstreamFor(advisory, upstream) {
  const byId = upstream?.advisories;
  if (!byId || !advisory) return [];
  const seen = new Set();
  const cited = new Set([...(advisory.decision?.basis || []), ...(advisory.triage?.partial || []), ...(advisory.triage?.others || [])].map(b => b.statement?.evidence).filter(Boolean));
  const out = [];
  for (const id of [advisory.id, ...(advisory.aliases || [])]) {
    for (const h of byId[id] || []) {
      if (seen.has(h.url) || cited.has(h.url)) continue;
      seen.add(h.url);
      out.push(h);
    }
  }
  return out;
}

// Whether a package is in the released APK (external/source_analysis/
// apk-contents-cli.mjs, apk/<appId>.json): `{ status, shipped }` with status
// present | absent | cant-tell | not-fetched | other-version-shipped and
// `shipped` the version the APK says it carries when that differs; null when
// the APK was not checked or the package is not a Maven/Gradle one.
export function inApkOf(advisory, apk) {
  if (!apk?.packages || !advisory) return null;
  const v = apk.packages[`${advisory.ecosystem}:${advisory.package}@${advisory.version}`];
  if (!v) return null;
  const [status, shipped = null] = v.split(/:(.*)/s);
  return { status, shipped: shipped || null };
}

// "The released APK …: 289 of 451 declared packages in it; 35 of 35 native
// libraries the same code as published; none no dependency declares."
export function apkSummary(apk) {
  if (!apk?.summary) return null;
  const s = apk.summary;
  const undeclaredNative = [...new Set((apk.nativeFiles || []).filter(n => n.verdict === 'undeclared').map(n => n.path.split('/').pop()))];
  return {
    name: apk.apk?.name || null,
    sha256: apk.apk?.sha256 || null,
    ref: apk.ref || null,
    declared: s.declared,
    present: s.present + (s.otherVersionShipped || 0),
    cantTell: s.cantTell,
    native: s.native ?? null,
    nativeIdentical: s.nativeIdentical ?? null,
    nativeDiffers: s.nativeDiffers ?? 0,
    undeclaredNative,
    undeclaredClasses: s.undeclaredClasses ?? 0,
    undeclaredPackages: (apk.undeclared || []).slice(0, 5).map(u => u.package),
  };
}

/**
 * The panel's content for one app file. `storeVersion` is the version the
 * wallet page lists; `release` picks a specific analysed release, else the
 * latest; `triage` is the wallet's decisions file (triage/<appId>.json), or
 * null when nobody has said anything yet; `signals` is signals.json (EPSS,
 * exploited list) or null; `upstream` the wallet's harvested ignore-file
 * entries (upstreamFor) or null; `apk` the released APK's check
 * (apk/<appId>.json) or null. `selectedVersion` is the version picked in
 * "Every version" that `release` was looked up for. Returns null when the app
 * has no analysed release.
 */
export function panelModel(app, { storeVersion = '', release = null, selectedVersion = null, triage = null, signals = null, upstream = null, apk = null, platform = null } = {}) {
  const releases = Array.isArray(app?.releases) ? app.releases : [];
  // The newest release whose analysis worked; a newer one that failed is reported, not shown.
  // A release of a language the lockfile check does not read can still have its git submodules checked.
  const current = (release && releases.find(r => r.ref === release)) || releases.find(r => (r.status || 'ok') === 'ok' || r.submodules || r.lockCoverage) || releases[0];
  if (!current) return null;
  const newerFailed = releases.slice(0, releases.indexOf(current)).filter(r => r.status && r.status !== 'ok');

  const bySeverity = { ...Object.fromEntries(SEVERITY_ORDER.map(s => [s, 0])), ...(current.vulnerabilities?.bySeverity || {}) };
  const malware = bySeverity.malicious;
  const vulnerabilities = SEVERITY_ORDER.filter(s => s !== 'malicious').reduce((n, s) => n + bySeverity[s], 0);
  const appIds = [app.appId, ...(app.aliases || []).map(a => a.appId)].filter(Boolean);
  const triaged = applyTriage(applySignals(current.advisories || [], signals), triage, { appIds });
  const apkOfRelease = apk && apk.ref === current.ref ? apk : null; // an APK of another release says nothing about these rows
  const advisories = sortAdvisories(triaged.advisories.map(a => {
    const hints = upstreamFor(a, upstream);
    const inApk = inApkOf(a, apkOfRelease);
    return hints.length || inApk ? { ...a, ...(hints.length ? { upstream: hints } : {}), ...(inApk ? { inApk } : {}) } : a;
  }));
  const exploited = advisories.filter(a => a.exploited).length;
  const unchecked = uncheckedCount(current.osv);

  return {
    ref: current.ref,
    commit: current.commit ? String(current.commit).slice(0, 7) : null,
    analysedAt: current.analysedAt || null,
    status: current.status || 'ok',
    error: current.error || null,
    storeVersion: storeVersion || null,
    selectedVersion: selectedVersion || null,
    versionMatches: storeVersion ? tagMatchesVersion(current.ref, storeVersion) : null,
    packages: current.dependencies?.total ?? 0,
    direct: current.dependencies?.direct ?? 0,
    // Everything the wallet does not import itself; its direct users are named per row.
    transitive: Math.max(0, (current.dependencies?.total ?? 0) - (current.dependencies?.direct ?? 0)),
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
    triage: triaged.summary,
    apk: apkSummary(apkOfRelease),
    signals: signals ? { date: signals.date || null, exploited, withEpss: advisories.filter(a => a.epss != null).length } : null,
    diff: current.diffFrom || null,
    submodules: current.submodules || null,
    // how much of the build the lockfiles we read cover (external/source_analysis/plugins/lock-coverage.mjs)
    // this page's app only, when the repository also builds another (iPhone files stay off the Android page)
    lockCoverage: current.lockCoverageByPlatform?.[platform] || current.lockCoverage || null,
    newerFailed: newerFailed.map(r => ({ ref: r.ref, status: r.status, error: r.error || null })),
    releases: releases.map(r => ({ ref: r.ref, analysedAt: r.analysedAt || null, status: r.status || 'ok' })),
    sameRepositoryAs: app.aliases?.length > 1 ? app.aliases.map(a => a.appId).filter(id => id !== app.appId) : [],
  };
}

// File name the export uses for an app id or release tag (export.mjs safeName).
export function safeName(s) {
  return String(s).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '_') || '_';
}

// "via npm:@babel/core: vulnerable code never executed" per basis of a decision, for the CSV.
export function decisionReason(decision) {
  if (!decision) return '';
  return (decision.basis || []).map(b => `${b.need}: ${JUSTIFICATION_LABEL[b.statement.justification] || b.statement.content || TRIAGE_LABEL[b.statement.status]}`).join('; ');
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
  const header = ['ecosystem', 'package', 'version', 'lockfile', 'direct', 'where', 'pinning', 'advisories', 'worst_severity', 'products', 'products_same_version', 'decision', 'justification', 'epss', 'exploited'];
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
      d.products ?? '',
      d.productsSameVersion ?? '',
      // The worst advisory's decision; a row with several advisories lists each decision in the advisories' order.
      hits.map(h => TRIAGE_LABEL[h.decision?.status] || 'undecided').join(' '),
      hits.map(h => decisionReason(h.decision)).filter(Boolean).join(' | '),
      // The worst advisory's EPSS probability (0..1) and whether CISA lists it as exploited.
      worst?.epss ?? '',
      worst ? (worst.exploited ? 'yes' : 'no') : '',
    ].map(csvCell).join(','));
  }
  return lines.join('\n') + '\n';
}
