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
  'no-upstream': 'native library we do not know the source repository of',
  'nvd-unavailable': 'native library checked against OSV.dev only, NVD did not answer',
};

export const WORST_ROWS = 10;

// The files each page counts (issue 994): its own app's and the shared ones.
// The same map as external/source_analysis/products.mjs. Other platforms, and
// a release the export found only shared files in, are not filtered.
export const COUNTED_TARGETS = {
  android: ['shared', 'mobile', 'android'],
  iphone: ['shared', 'mobile', 'iphone'],
  desktop: ['shared', 'desktop'],
  hardware: ['shared', 'firmware'],
};

export const TARGET_LABELS = {
  android: 'Android app', iphone: 'iPhone app', mobile: 'phone apps', desktop: 'desktop app',
  server: 'server', web: 'website', extension: 'browser extension', docs: 'docs', firmware: 'firmware', tests: 'tests', none: 'other files',
};

// A row without `targets` comes from shared files only.
const inThisApp = (row, counted) => !row.targets || row.targets.some(t => counted.includes(t));

// The release's dependency counts added up over the targets a page counts.
function countsOfTargets(byTarget, counted) {
  const out = { total: 0, direct: 0, byScope: {}, byEcosystem: {} };
  for (const target of counted) {
    const c = byTarget[target];
    if (!c) continue;
    out.total += c.total;
    out.direct += c.direct;
    for (const [k, n] of Object.entries(c.byScope || {})) out.byScope[k] = (out.byScope[k] || 0) + n;
    for (const [k, n] of Object.entries(c.byEcosystem || {})) out.byEcosystem[k] = (out.byEcosystem[k] || 0) + n;
  }
  return out;
}

// The advisory counts of the rows a page shows, as the export counts them for the whole release.
function countsOfAdvisories(rows) {
  const bySeverity = {};
  const byScope = { app: 0, build: 0, tests: 0, unknown: 0 };
  for (const a of rows) {
    const severity = SEVERITY_ORDER.includes(a.severity) ? a.severity : 'unknown';
    bySeverity[severity] = (bySeverity[severity] || 0) + 1;
    byScope[byScope[a.scope] === undefined ? 'unknown' : a.scope] += 1;
  }
  return { bySeverity, byScope };
}

// A row's scope on this page: its own in the files the page counts, not the
// whole repository's (exportRelease.mjs scopesOfRows).
function scopeOnPage(row, counted) {
  if (!row.scopes) return row;
  const here = counted.map(t => row.scopes[t]).filter(Boolean);
  const best = ['app', 'build', 'tests', 'unknown'].find(s => here.includes(s));
  return best ? { ...row, scope: best === 'unknown' ? null : best } : row;
}

// What the page left out, once each: the other products by name, biggest first,
// and the libraries and advisories found only there. Null when nothing was.
function notInAppOf(dependencies, rows, counted, platform) {
  const others = Object.entries(dependencies.byTarget).filter(([target, c]) => !counted.includes(target) && c.total > 0)
    .sort(([, x], [, y]) => y.total - x.total);
  const hits = rows.filter(a => !inThisApp(a, counted));
  const libraries = dependencies.onlyOutside?.[platform] ?? 0;
  if (!others.length || (!libraries && !hits.length)) return null;
  return {
    labels: others.map(([target]) => TARGET_LABELS[target] || target),
    libraries,
    advisories: hits.filter(a => a.severity !== 'malicious').length,
    malware: hits.filter(a => a.severity === 'malicious').length,
  };
}

// This page's part of the verifiers' build-lock.json (export.mjs, plugins/build-lock.mjs):
// the files and names of its own platform's verifications, and that platform's
// differences. A page without a platform sees every file, and the differences
// only when one platform has them. Null when nothing is left.
function buildLockOnPage(b, platform) {
  if (!b) return null;
  const here = x => !platform || !x.platform || x.platform === platform;
  const files = b.files.filter(here);
  const misnamed = b.misnamed.filter(here).map(m => m.name);
  const all = Object.entries(b.platforms || {});
  const diff = platform ? b.platforms?.[platform] : all.length === 1 ? all[0][1] : null;
  if (!files.length && !misnamed.length && !diff) return null;
  const none = { count: 0, names: [] };
  return { files, misnamed, modules: diff?.modules ?? null, builtNotResolved: diff?.builtNotResolved || none, descriptionsOnly: diff?.descriptionsOnly || none, resolvedNotBuilt: diff?.resolvedNotBuilt || none };
}

// The export's file-sorting label for this page; null for an export without one.
function sortingOnPage(sorting, platform) {
  if (!sorting) return null;
  const { filesOutside, ...rest } = sorting;
  return { ...rest, filesRemoved: filesOutside?.[platform] ?? 0 };
}

// What a reader is told about how files were sorted onto this page: a pill and the
// sentence beside it. "Checked by a person" is about the sorting only: it is not a
// security audit, and not proof of the numbers. No line for a wallet without
// rules: nothing was taken off its page, and "not sorted" only puzzles a reader.
export function sortingLabel(sorting) {
  if (!sorting || sorting.status === 'none') return null;
  // No reviewer's name: "a person" is all a reader needs.
  if (sorting.status === 'reviewed') return { pill: 'Checked by a person', text: `A person chose at release ${sorting.release} which of the repository's dependency files belong to this app.` };
  const why = sorting.changedSince
    ? `A person checked this at release ${sorting.changedSince.release}, but this release's files differ, so rules chose which of the repository's dependency files belong to this app.`
    : 'Rules chose which of the repository\'s dependency files belong to this app.';
  const n = sorting.filesRemoved;
  return { pill: 'Not checked by a person', text: `${why}${n ? ` They left ${n === 1 ? '1 file' : `${n.toLocaleString('en-US')} files`} out of this page.` : ''}` };
}

// "Not in this app: desktop app and server, 232 libraries, 120 advisories."
export function notInAppText(notInApp) {
  if (!notInApp) return null;
  const count = (n, one, many) => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;
  const names = notInApp.labels.length > 1 ? `${notInApp.labels.slice(0, -1).join(', ')} and ${notInApp.labels.at(-1)}` : notInApp.labels[0];
  return `Not in this app: ${[
    names,
    notInApp.libraries ? count(notInApp.libraries, 'library', 'libraries') : null,
    notInApp.advisories ? count(notInApp.advisories, 'advisory', 'advisories') : null,
    notInApp.malware ? `${notInApp.malware} possible malware` : null,
  ].filter(Boolean).join(', ')}.`;
}

// Where a package ends up (`whereOf`, dependency-triage.mjs): "app", "build",
// "tests", or "unknown" when the files do not say.
export function whereLabel(row) {
  return WHERE_LABELS[whereOf(row)] || 'unknown';
}

// The tooltip on an "unknown" Where? label.
export const WHERE_UNKNOWN_TIP = 'The dependency files do not record whether this package ends up in the app, the build tooling or the tests.';

// The digits of a version: "android-v2.8.4" -> "2.8.4", "v1.4.0-beta1" -> "1.4.0-beta1".
export function versionCore(s) {
  const m = String(s || '').match(/\d+(?:\.\d+)*(?:[-+.][0-9A-Za-z.]+)?/);
  return m ? m[0] : '';
}

// The app file as one listing's page shows it: only the releases reproduced
// for that app id and platform (a release's `reproducedFor`, exportScope.mjs), or
// null when there is none. The iPhone page of a wallet reproduced on Android
// shows no dependencies: nobody built that app from source. An export that
// names no listing on any release (SOURCE_ANALYSIS_SCOPE=all) is shown whole.
export function appForListing(app, appId, platform) {
  const releases = Array.isArray(app?.releases) ? app.releases : [];
  if (!releases.some(r => Array.isArray(r.reproducedFor))) return app;
  const mine = releases.filter(r => r.reproducedFor?.some(l => l.appId === appId && l.platform === platform));
  return mine.length ? { ...app, releases: mine } : null;
}

// A version name as "Every version" keys it (normalizeVersionName,
// build-verifications-model.mjs): trimmed, without a leading "v".
const versionName = (s) => String(s ?? '').trim().replace(/^[vV](?=\d)/, '');

// The analysed release for a version picked in "Every version"
// (src/build-verifications.mjs), or null when none was analysed. The export
// lists the names verifiers typed for each release (`versions`, export.mjs),
// resolved to its tag by the checker; the name must be one of them. Only an
// export without names falls back to the version digits: they must agree, and
// only a plain version ("1.4.0") also takes a tag with a suffix
// (v1.4.0-android), so a picked beta never shows the final release.
export function releaseForVersion(app, version) {
  const releases = Array.isArray(app?.releases) ? app.releases : [];
  if (releases.some(r => Array.isArray(r.versions))) {
    const name = versionName(version);
    return (name && releases.find(r => r.versions?.some(v => versionName(v) === name))) || null;
  }
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
// file was relayed as signed statements), but only when a trusted author or
// a listed maintainer of the row's library signed it, whatever the wallet it
// was made for: anyone else could, to hide the wallet's own note. `trusted`
// and `maintainers` are the triage file's lists.
export function upstreamFor(advisory, upstream, { trusted = [], maintainers = {} } = {}) {
  const byId = upstream?.advisories;
  if (!byId || !advisory) return [];
  const seen = new Set();
  const library = (s) => s.via || (advisory.package ? `${advisory.ecosystem || 'npm'}:${advisory.package}` : null);
  const insider = (s) => trusted.includes(s.pubkey) || (maintainers[library(s)] || []).includes(s.pubkey);
  const others = (advisory.triage?.others || []).filter(o => o.statement && insider(o.statement));
  const cited = new Set([...(advisory.decision?.basis || []), ...(advisory.triage?.partial || []), ...others].map(b => b.statement?.evidence).filter(Boolean));
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
 * The panel's content for one app file. `release` picks a specific analysed
 * release, else the latest; `triage` is the wallet's decisions file (triage/<appId>.json), or
 * null when nobody has said anything yet; `signals` is signals.json (EPSS,
 * exploited list) or null; `upstream` the wallet's harvested ignore-file
 * entries (upstreamFor) or null; `apk` the released APK's check
 * (apk/<appId>.json) or null. `selectedVersion` is the version picked in
 * "Every version" that `release` was looked up for; `appId` the page's own app
 * id, which an alias's page differs from `app.appId` in. Returns null when the app
 * has no analysed release.
 */
export function panelModel(app, { release = null, selectedVersion = null, triage = null, signals = null, upstream = null, apk = null, platform = null, appId = null } = {}) {
  const releases = Array.isArray(app?.releases) ? app.releases : [];
  // The newest release whose analysis worked; a newer one that failed is reported, not shown.
  // A release of a language the lockfile check does not read can still have its git submodules checked.
  const current = (release && releases.find(r => r.ref === release)) || releases.find(r => (r.status || 'ok') === 'ok' || r.submodules || r.lockCoverage) || releases[0];
  if (!current) return null;
  const newerFailed = releases.slice(0, releases.indexOf(current)).filter(r => r.status && r.status !== 'ok');

  // Only this page's app (issue 994). The tree and the CSV still get every row.
  const counted = current.dependencies?.byTarget ? COUNTED_TARGETS[platform] || null : null;
  const inApp = a => !counted || inThisApp(a, counted);
  const dependencies = counted ? countsOfTargets(current.dependencies.byTarget, counted) : current.dependencies;
  const vulnerabilityCounts = counted ? countsOfAdvisories((current.advisories || []).filter(inApp).map(a => scopeOnPage(a, counted))) : current.vulnerabilities;

  const bySeverity = { ...Object.fromEntries(SEVERITY_ORDER.map(s => [s, 0])), ...(vulnerabilityCounts?.bySeverity || {}) };
  const malware = bySeverity.malicious;
  const vulnerabilities = SEVERITY_ORDER.filter(s => s !== 'malicious').reduce((n, s) => n + bySeverity[s], 0);
  const appIds = [app.appId, ...(app.aliases || []).map(a => a.appId)].filter(Boolean);
  const triaged = applyTriage(applySignals(current.advisories || [], signals), triage, { appIds, releases });
  const apkOfRelease = apk && apk.ref === current.ref ? apk : null; // an APK of another release says nothing about these rows
  const allAdvisories = sortAdvisories(triaged.advisories.map(a => {
    const hints = upstreamFor(a, upstream, { trusted: triage?.trusted || [], maintainers: triage?.maintainers || {} });
    const inApk = inApkOf(a, apkOfRelease);
    return hints.length || inApk ? { ...a, ...(hints.length ? { upstream: hints } : {}), ...(inApk ? { inApk } : {}) } : a;
  }));
  // A shown row that names a product names this page's own: "only in the desktop app" says nothing on the desktop page.
  const advisories = counted ? allAdvisories.filter(inApp).map(({ part, ...a }) => scopeOnPage(a, counted)) : allAdvisories;
  const triageSummary = counted ? applyTriage((current.advisories || []).filter(inApp), triage, { appIds, releases }).summary : triaged.summary;
  const exploited = advisories.filter(a => a.exploited).length;
  const unchecked = uncheckedCount(current.osv);

  return {
    ref: current.ref,
    commit: current.commit ? String(current.commit).slice(0, 7) : null,
    analysedAt: current.analysedAt || null,
    status: current.status || 'ok',
    error: current.error || null,
    // a later re-check of this release failed; the result shown is the earlier one that worked (issue 998)
    recheckFailed: current.recheckFailed?.at ? { at: current.recheckFailed.at, error: current.recheckFailed.error || null } : null,
    selectedVersion: selectedVersion || null,
    packages: dependencies?.total ?? 0,
    // the whole repository's, for what still covers all of it: the rebuild tile, the unchecked note, the tree
    repoPackages: current.dependencies?.total ?? 0,
    // the products this page counts as its own app, for the tree's "In this app" (issue 996)
    counted,
    notInApp: counted ? notInAppOf(current.dependencies, current.advisories || [], counted, platform) : null,
    sorting: sortingOnPage(current.dependencies?.sorting, platform),
    // files whose names suggest another product, a guess nobody has checked: they still count here
    unlisted: current.dependencies?.unlisted || [],
    direct: dependencies?.direct ?? 0,
    // Everything the wallet does not import itself; its direct users are named per row.
    transitive: Math.max(0, (dependencies?.total ?? 0) - (dependencies?.direct ?? 0)),
    devUnknown: current.dependencies?.devUnknown ?? 0,
    byScope: dependencies?.byScope || null,
    whereUnknown: dependencies?.byScope?.unknown ?? current.dependencies?.devUnknown ?? 0,
    ecosystems: Object.keys(dependencies?.byEcosystem || {}),
    tiers: current.dependencies?.tiers || {},
    lockfiles: current.lockfiles?.length ? current.lockfiles : (current.dependencies?.lockfiles || []),
    unchecked,
    uncheckedBreakdown: uncheckedBreakdown(current.osv),
    vulnerabilities,
    malware,
    bySeverity,
    vulnerablePackages: current.vulnerabilities?.packages ?? 0,
    vulnerabilitiesByScope: vulnerabilityCounts?.byScope || null,
    advisories,
    allAdvisories,
    worst: advisories.slice(0, WORST_ROWS),
    triage: triageSummary,
    apk: apkSummary(apkOfRelease),
    signals: signals ? { date: signals.date || null, exploited, withEpss: advisories.filter(a => a.epss != null).length } : null,
    diff: current.diffFrom || null,
    submodules: current.submodules || null,
    // who rebuilt this release's dependencies from source (issue 992 part G; exportRelease.mjs releaseRebuilds)
    rebuilds: current.rebuilds || null,
    // the default branch's latest analysis, that each advisory's inDefaultBranch compares with (export.mjs)
    defaultBranch: app.defaultBranch || null,
    // how much of the build the lockfiles we read cover (external/source_analysis/plugins/lock-coverage.mjs)
    // this page's app only, when the repository also builds another (iPhone files stay off the Android page)
    lockCoverage: current.lockCoverageByPlatform?.[platform] || current.lockCoverage || null,
    // the verifier's build-lock.json: used or why not, and how it differs from the resolved list (plugins/build-lock.mjs)
    buildLock: buildLockOnPage(current.buildLock, platform),
    newerFailed: newerFailed.map(r => ({ ref: r.ref, status: r.status, error: r.error || null })),
    releases: releases.map(r => ({ ref: r.ref, analysedAt: r.analysedAt || null, status: r.status || 'ok' })),
    history: dependencyHistory(releases, current.ref, platform),
    // the other apps of the repository: an alias's page (com.zeusln.zeus) names the analysed one, not itself
    sameRepositoryAs: app.aliases?.length > 1 ? app.aliases.map(a => a.appId).filter(id => id !== (appId || app.appId)) : [],
  };
}

// The dependency count of every analysed release, oldest first, for the
// chart under the count: { ref, total, direct, current }. A release whose
// analysis failed has no count, and a zero from one that read no lockfile
// would draw a cliff that is not there, so both are left out.
export function dependencyHistory(releases = [], currentRef = null, platform = null) {
  const counted = COUNTED_TARGETS[platform];
  return releases
    .filter(r => Number.isFinite(r.dependencies?.total) && ((r.status || 'ok') === 'ok' || r.dependencies.total > 0))
    .map((r) => {
      const c = counted && r.dependencies.byTarget ? countsOfTargets(r.dependencies.byTarget, counted) : r.dependencies;
      return { ref: r.ref, total: c.total, direct: c.direct ?? null, current: r.ref === currentRef, empty: c !== r.dependencies && !c.total };
    })
    // A release with only other products' files says nothing about this app: no cliff to zero.
    .filter(h => !h.empty)
    .map(({ empty, ...h }) => h)
    .reverse();
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

// A text cell starting with = + - @ tab or CR runs as a formula in a spreadsheet, and the
// justification column holds text anyone can publish, so prefix those with ' (OWASP CSV injection).
export const csvCell = (v) => {
  let s = v == null ? '' : String(v);
  if (typeof v !== 'number' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
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
