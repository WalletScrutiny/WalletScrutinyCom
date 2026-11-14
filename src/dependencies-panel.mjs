// The wallet page's "Dependencies" panel: what the source analysis
// (external/source_analysis) found in the release's lockfiles, drawn from the
// per-app file of its static export. Loaded on demand, one small file per
// wallet; the full dependency list is only fetched for the CSV download.
// Measurement only, not part of the verdict, and labelled so.
import { el } from './html-utils.mjs';
import { panelModel, releaseForVersion, appForListing, safeName, csvOf, notInAppText, sortingLabel } from './dependencies-panel-model.mjs';
import { withStatement, mergeLiveTriage, triageForApp } from './dependency-triage.mjs';
import { openTriageDialog } from './dependencies-triage-form.mjs';
import { treeElement } from './dependencies-tree.mjs';
import { rebuildTile, rebuildsElement, rebuildIndex } from './dependencies-rebuilds.mjs';
import { tipTrigger } from './dependencies-epss-tip.mjs';
import { showAnalysedReleases } from './build-verifications.mjs';
import { EXPORT_BASE, TRIAGE_BASE, fetchJson, loadApp, loadTriage, triageAuthors, liveTriageEvents, loadApk, loadUpstream, loadSignals } from './dependencies-data.mjs';
import { tile, historyChart, plural } from './dependencies-tiles.mjs';
import { severityTally, nameSigners, defaultProfiles, trustedLine, advisoryTable, allWhereUnknown } from './dependencies-advisories.mjs';
import { submodulesSection } from './dependencies-submodules.mjs';
export { EXPORT_BASE, TRIAGE_BASE, loadApp, loadTriage, loadTrusted, triageAuthors, liveTriageEvents, loadApk, loadUpstream, loadSignals } from './dependencies-data.mjs';
export { historyScale, historyPointText, historyChart } from './dependencies-tiles.mjs';
export { severityCell, viaLine, repoLine, severityTally, fixedInMasterLine, signerLink, nameSigners, staleLabel, decisionCell, CLEARED_TIP_LINES, usedBy } from './dependencies-advisories.mjs';
export { submoduleIdentityText, submoduleScopeText, submodulesSummaryText } from './dependencies-submodules.mjs';

// The CSV download is hidden until a wallet developer asks for it (Luis,
// 2026-11-05); the code stays, set window.WS_DEPENDENCY_CSV = true to show it.
const SHOW_CSV = typeof window !== 'undefined' && window.WS_DEPENDENCY_CSV === true;

const dateOf = (s) => (s ? String(s).slice(0, 10) : null);

// "0 known malware": hidden on phones, where it only takes a row.
function malwareFreeTile(count) {
  const t = tile(count, 'known malware', { tone: 'good' });
  if (count === 0) t.classList.add('dp-tile--phone-hidden');
  return t;
}

// What the vulnerability tile's number counts, how it was found, and what it
// says about the app a visitor has installed.
export function vulnerabilityTipLines(model) {
  const at = model.lookedUpAt || model.analysedAt;
  const date = at ? `, on ${dateOf(at)}` : '';
  return [
    'This counts published security reports (advisories) that list as affected a package version this app’s source code uses. Every package counts the same, whether it goes into the app or is used to build or test it: a build tool can change the app too. The Where? column on each row says which.',
    `How we counted: we took the package list from the app’s public source code for ${model.ref} and looked up each package version in OSV.dev, a public database of these reports${date}. One report can match several packages, so the number of distinct reports is shown below.`,
    `What it means for your app: it is about ${model.ref}. A report tells us the package version is affected, not whether the affected part is used. ${model.apk ? 'Each row below says whether we found the package in the released app.' : 'We have not checked the released app itself for these packages.'}`,
    'The colour shows the highest severity among reports not yet cleared.',
  ];
}

// The vulnerability tile counts every match alike, app, build and tests
// (Leo, 2026-10-26: a build dependency can carry a backdoor too). A row's `part`
// is a guess from a folder name, so the tile does not repeat it as a fact.
function vulnerabilityTile(model) {
  const rows = (model.advisories || []).filter(a => a.severity !== 'malicious' && a.severity !== 'informational');
  const notices = (model.advisories || []).filter(a => a.severity === 'informational').length;
  const tally = severityTally(model, rows, { explain: true });
  // The number takes the colour of the worst severity still open; once every
  // advisory is cleared it turns green.
  // An incomplete package list cannot show a green "0": it is a lower bound.
  const incomplete = model.lockCoverage && model.lockCoverage.verdict !== 'locked';
  const tone = tally.worstOpen ? `sev-${tally.worstOpen}` : (incomplete ? '' : 'good');
  const distinct = new Set(rows.map(a => a.id)).size;
  // Where the matches sit, muted: the total above stays the headline.
  const sc = model.vulnerabilitiesByScope;
  const split = sc ? [[sc.app, 'in the app'], [sc.build, 'in build tooling'], [sc.tests, 'only in tests'], [sc.unknown, 'unclear']]
    .filter(([n]) => n).map(([n, l]) => `${n} ${l}`).join(' · ') : '';
  const lines = vulnerabilityTipLines(model);
  const value = tipTrigger(String(rows.length), () => lines.map(line => el('p', {}, line)), { className: 'dp-term dp-term--value' });
  return tile(value, 'advisory matches', { tone, sub: [
    tally.lines,
    rows.length ? el('div', { className: 'dp-tile__line' }, `${distinct} distinct advisories`) : null,
    rows.length && split ? el('div', { className: 'dp-tile__line dp-tile__line--muted' }, split) : null,
    // RustSec notices: a package nobody maintains or with an unsound API, no reported flaw
    notices ? el('div', { className: 'dp-tile__line dp-tile__line--muted' }, `Not counted: ${notices} ${notices === 1 ? 'notice' : 'notices'} of unmaintained or unsound packages (listed as "Notice")`) : null,
    rows.length ? el('div', { className: 'dp-tile__caveat' }, model.apk
      ? 'A match means a package version is listed as affected, not that the affected part is used.'
      : 'A match means a package version is listed as affected, not that the affected part is used. The released app itself was not checked for these packages.') : null,
    incomplete ? el('div', { className: 'dp-tile__caveat' }, 'At least this many: part of the build was not checked (see the note above).') : null,
    triageLine(model),
  ] });
}

// "3 decided · 3 under investigation · 409 still to look at" in the
// vulnerability tile: the triage work queue, so a long list is never mistaken for a finished one.
function triageLine(model) {
  const t = model.triage;
  if (!t || !t.total) return null;
  const parts = [`${t.decided} decided`];
  if (t.affected) parts.push(`${t.affected} affected`);
  if (t.not_affected) parts.push(`${t.not_affected} not affected`);
  if (t.fixed) parts.push(`${t.fixed} fixed`);
  if (t.under_investigation) parts.push(`${t.under_investigation} under investigation`);
  const detail = [t.partial ? `${t.partial} partly` : null, t.stale ? `${t.stale} to re-check` : null].filter(Boolean).join(', ');
  parts.push(t.undecided ? `${t.undecided} still to look at${detail ? ` (${detail})` : ''}` : 'nothing left to look at');
  return el('div', { className: 'dp-triage-line' }, parts.join(' · '));
}

function headline(model) {
  const bits = [
    el('span', {}, 'Checked release ', el('b', {}, model.ref), model.commit ? ` (source tag, commit ${model.commit})` : ' (source tag)'),
  ];
  if (model.analysedAt) bits.push(el('span', {}, 'Checked on ', el('b', {}, dateOf(model.analysedAt))));
  // the advisories are looked up again every hour (issue 1020 P16)
  if (model.lookedUpAt) bits.push(el('span', {}, 'Advisories looked up on ', el('b', {}, dateOf(model.lookedUpAt))));
  if (model.recheckFailed) {
    const f = model.recheckFailed;
    bits.push(el('span', { className: 'dp-recheck-failed' }, 'Re-check failed on ', el('b', {}, dateOf(f.at))));
  }
  const line = el('p', { className: 'dp-headline' });
  bits.forEach((b, i) => { if (i) line.append(' · '); line.append(b); });
  return line;
}

// Lock coverage (external/source_analysis/plugins/lock-coverage.mjs): what
// this check could not see, said to the reader, with what would fix it in a
// toggletip. "0 advisories" must not read as "nothing wrong" when the list
// of packages is incomplete.
const LOCKFILE_KIND = {
  pub: 'Flutter (pubspec.lock)', go: 'Go (go.sum)', cocoapods: 'CocoaPods (Podfile.lock)',
  swiftpm: 'Swift (Package.resolved)', carthage: 'Carthage (Cartfile.resolved)', npm: 'npm (pnpm or bun lockfile)',
  pip: 'Python (poetry, uv, Pipfile or pdm lockfile)', 'esp-idf': 'ESP-IDF (dependencies.lock)', 'c/c++': 'C/C++ build',
};
const fileList = (files, count) => {
  const out = [];
  files.forEach((f, i) => { if (i) out.push(', '); out.push(el('code', {}, f)); });
  if (count > files.length) out.push(` and ${count - files.length} more`);
  return out;
};

// What could not be seen, in words: "2 manifests without a lockfile, 1 download without a hash check".
export function coverageGaps(c) {
  const gaps = [];
  if (c.missingCount) gaps.push(plural(c.missingCount, 'dependency file without a lockfile', 'dependency files without a lockfile'));
  if (c.floating) gaps.push(plural(c.floating, 'version range', 'version ranges'));
  if (c.downloadCount) gaps.push(plural(c.downloadCount, 'download without a hash check', 'downloads without a hash check'));
  if (c.binaryCount) gaps.push(plural(c.binaryCount, 'committed binary', 'committed binaries'));
  const kinds = [...new Set(c.unread.map(u => LOCKFILE_KIND[u.ecosystem] || u.ecosystem))];
  if (kinds.length) gaps.push(`the ${kinds.join(', ')} part${kinds.length > 1 ? 's' : ''}, which this check does not read yet`);
  return gaps;
}

// The toggletip: what the wallet team can do, item by item, and what a reader can do.
export function coverageTipLines(c) {
  const lines = [el('p', {}, el('b', {}, 'What would fix it'))];
  if (c.missingCount) lines.push(el('p', {}, 'Wallet team: commit the lockfile your package manager writes for ', ...fileList(c.missing.map(m => m.manifest), c.missingCount), '.'));
  const rangeFiles = c.floatingFiles?.length ? [' in ', ...fileList(c.floatingFiles, c.floatingFiles.length)] : [];
  if (c.floating) lines.push(el('p', {}, 'Wallet team: replace version ranges (like ', el('code', {}, '1.+'), ' or ', el('code', {}, '^2.0'), ') with exact versions', ...rangeFiles, ', or add a lockfile.'));
  if (c.downloadCount) lines.push(el('p', {}, 'Wallet team: check the hash of what the build downloads (', el('code', {}, 'sha256sum -c'), ', or an image ', el('code', {}, '@sha256:'), ' digest) in ', ...fileList(c.downloads.map(d => `${d.file}:${d.line}`), c.downloadPlaceCount ?? c.downloadCount), '.'));
  if (c.binaryCount) lines.push(el('p', {}, 'Wallet team: build these from source, or say where each comes from with its hash: ', ...fileList(c.binaries, c.binaryCount), '.'));
  const native = c.unread.filter(u => u.ecosystem === 'c/c++');
  const unread = c.unread.filter(u => u.ecosystem !== 'c/c++');
  if (native.length) lines.push(el('p', {}, 'Wallet team: C and C++ have no lockfile. Bring each library in as a git submodule, which this check follows, or list its version and hash next to the build.'));
  const unreadCount = c.unreadCount - native.length;
  if (unread.length) lines.push(el('p', {}, 'Nothing for the wallet team here: ', ...fileList(unread.map(u => u.lockfile), unreadCount), unreadCount === 1 ? ' exists, but this check cannot read it yet.' : ' exist, but this check cannot read them yet.', ' That is on us.'));
  // Something only the wallet team can fix: a reader can pass it on.
  const forTheTeam = c.missingCount || c.floating || c.downloadCount || c.binaryCount || native.length;
  lines.push(el('p', {}, forTheTeam
    ? 'Using this wallet? Send the list above to its team. Until then, treat the advisory count as a lower bound.'
    : 'Using this wallet? Treat the advisory count as a lower bound until this check reads those files.'));
  return lines;
}

// The verifier's build-lock.json (external/source_analysis/plugins/build-lock.mjs):
// why a file was not used, and what the build downloaded that the resolved list
// does not show, or the other way round.
function buildLockNotices(model) {
  const b = model.buildLock;
  if (!b) return [];
  const items = [];
  // a few names inline; the export keeps more
  const some = (d) => d.names.slice(0, 5).join(', ') + (d.count > Math.min(d.names.length, 5) ? ` and ${d.count - Math.min(d.names.length, 5)} more` : '');
  for (const f of b.files) {
    if (f.verifier === 'unlisted') items.push('A build-lock.json attached to this verification is from a verifier not on the list, so its list was not used.');
    else if (f.problem === 'not-found' || f.problem === 'unavailable') items.push('A build-lock.json attached to this verification could not be downloaded from files.nostr.info, so it was not read.');
    else if (f.problem === 'too-large') items.push('A build-lock.json attached to this verification is too large to read, so it was not read.');
    else if (f.problem === 'hash-mismatch') items.push('A build-lock.json attached to this verification did not match its published hash, so it was not read.');
    else if (f.problem) items.push('A file attached to this verification as build-lock.json was not written by ws-buildlock.sh, so it was not read.');
    else if (f.match === 'another-build') {
      const what = (f.differ || []).map(d => `${d.field === 'appVersion' ? 'version' : d.field === 'appId' ? 'app' : d.field} ${d.file} in the file, ${d.event ?? 'none'} in the verification`).join('; ');
      items.push(el('span', {}, el('b', {}, 'Belongs to another build: '), `a build-lock.json attached to this verification is from a different build (${what}), so its list was not used.`));
    } else if (f.match === 'not-tied') {
      items.push('A build-lock.json attached to this verification does not say which app, version and platform it was built for, so it is not tied to this build and its list was not used.');
    }
  }
  for (const name of b.misnamed) items.push(el('span', {}, el('b', {}, 'Misnamed: '), `"${name}" looks like the build's download list, but only a file named exactly build-lock.json is read.`));
  if (b.modules !== null) {
    const parts = [`The build downloaded ${b.modules} Gradle modules (from the verifier's build-lock.json), and the ones with code were checked for advisories too.`];
    if (b.builtNotResolved.count) parts.push(` ${b.builtNotResolved.count} of them are not in the resolved list: ${some(b.builtNotResolved)}.`);
    if (b.descriptionsOnly.count) parts.push(` ${b.descriptionsOnly.count} downloaded descriptions without code (.pom or .module files only) were not counted: ${some(b.descriptionsOnly)}.`);
    if (b.resolvedNotBuilt.count) parts.push(` ${b.resolvedNotBuilt.count} resolved modules were never downloaded by the build: ${some(b.resolvedNotBuilt)}.`);
    items.push(parts.join(''));
  }
  return items;
}

function coverageNotice(model) {
  const c = model.lockCoverage;
  if (!c || c.verdict === 'locked') return null;
  // A release with only submodules already says so in its status notice.
  if (c.verdict === 'none') return model.submodules ? null : el('span', { className: 'dp-coverage' }, 'This check found no dependency files in this release, so its dependencies are unknown, not absent.');
  const gaps = coverageGaps(c);
  const lead = c.verdict === 'unknown'
    ? 'This check could read only part of this release\'s dependencies'
    : 'Part of this release\'s build is not pinned to exact versions, so it can pull different code without any change to its source';
  return el('span', { className: 'dp-coverage' },
    el('b', {}, 'Incomplete check: '), `${lead}${gaps.length ? `: ${gaps.join(', ')}` : ''}. Those parts were not checked for advisories. `,
    tipTrigger('What would fix it?', () => coverageTipLines(c)));
}

function notices(model, { triageFailed = false } = {}) {
  const items = [];
  // A package OSV lists as malicious outranks everything else on the panel:
  // it is checked by hand (the registry package, not a workspace or an alias)
  // and the team is alerted (external/source_analysis/alerts.mjs).
  const malicious = (model.advisories || []).filter(a => a.severity === 'malicious');
  if (malicious.length) {
    items.push(el('span', { className: 'dp-malware' }, el('b', {}, 'Possible malware: '),
      malicious.map(a => `${a.package}@${a.version} (${a.id})`).join(', '),
      ` is listed on OSV.dev as malicious. A person is checking whether the lockfile really installs that registry package; until then this is a lead, not a finding. It matters even when only the build uses it: build code can change the app.`));
  }
  // issue 1002: without statements.json no statement is shown and the relays are not asked
  if (triageFailed && model.advisories?.length) {
    items.push(el('span', { className: 'dp-triage-failed' }, el('b', {}, 'Statements not loaded: '),
      'the list of statements on these advisories (statements.json) could not be loaded, so no decisions or "What others say" are shown, and the relays were not asked for newer ones. Reload the page to try again.'));
  }
  if (model.recheckFailed) {
    const f = model.recheckFailed;
    items.push(`A re-check of ${model.ref} on ${dateOf(f.at)} failed${f.error ? ` (${f.error})` : ''}; what is shown is from the check that worked${model.analysedAt ? `, on ${dateOf(model.analysedAt)}` : ''}.`);
  }
  // One "reproducible" from anyone is enough to show a version (#1020 P4); say when others found it not reproducible.
  const v = model.selectedVersion ? model.verdicts : null;
  if (v?.reproducible && v.notReproducible) {
    items.push(`${plural(v.notReproducible, 'verification')} of version ${model.selectedVersion} found it not reproducible, and ${v.reproducible} found it reproducible. Its dependencies are shown because one reproducible verification is enough; each verdict is under "Every version".`);
  }
  for (const f of model.selectedVersion ? [] : model.newerFailed) {
    items.push(`The check of ${f.ref} failed${f.error ? ` (${f.error})` : ''}; showing the last release that was checked.`);
  }
  const coverage = coverageNotice(model);
  if (coverage) items.push(coverage);
  items.push(...buildLockNotices(model));
  if (model.sameRepositoryAs.length) {
    items.push(`Built from the same source repository as ${model.sameRepositoryAs.join(', ')}, which shares this analysis.`);
  }
  if (model.unlisted?.length) {
    const names = model.unlisted.slice(0, 3).join(', ') + (model.unlisted.length > 3 ? ` and ${model.unlisted.length - 3} more` : '');
    items.push(el('span', {}, el('b', {}, 'Unchecked guess: '), `${names} may belong to another product, judging by the name. Nobody has checked, so it is still counted here.`));
  }
  if (model.unchecked) {
    const why = model.uncheckedBreakdown.map(u => `${u.count} ${u.label}`).join(', ');
    items.push(`${model.unchecked} of the ${model.repoPackages ?? model.packages} packages${model.notInApp ? ' in this repository' : ''} could not be checked for advisories${why ? ` (${why})` : ''}; that is not the same as "no problems".`);
  }
  // "unsupported" means the app type is unknown, not that nothing was read: Bitkey has lockfiles.
  if (model.status === 'unsupported' && model.submodules && !model.repoPackages) {
    items.push('No lockfile this check reads was found in this release, so only its git submodules were checked.');
  } else if (model.status === 'unsupported' && coverage) {
    // the coverage notice already says what was not read, in words
  } else if (model.status !== 'ok') {
    items.push(`This check ended with status "${model.status}"${model.error ? `: ${model.error}` : ''}.`);
  }
  if (model.apk) {
    const k = model.apk;
    const parts = [`Checked against the released APK${k.name ? ` ${k.name}` : ''}${k.sha256 ? ` (sha256 ${k.sha256.slice(0, 12)}…)` : ''}: ${k.present} of the ${k.declared} declared Maven/Gradle packages are in it${k.cantTell ? `, ${k.cantTell} can't be told` : ''}`];
    if (k.native) parts.push(`${k.nativeIdentical} of ${k.native} native libraries are the same code as the published packages${k.nativeDiffers ? `, ${k.nativeDiffers} differ` : ''}`);
    if (k.undeclaredNative.length) parts.push(`no dependency declares ${k.undeclaredNative.join(', ')}`);
    if (k.undeclaredClasses) parts.push(`${k.undeclaredClasses} classes come from no declared package (${k.undeclaredPackages.join(', ')}${k.undeclaredPackages.length < 5 ? '' : ', …'}), the wallet's own code among them`);
    items.push(`${parts.join('; ')}.`);
  }
  return items.length ? el('ul', { className: 'dp-notices' }, items.map(t => el('li', {}, t))) : null;
}

function howToRead(model) {
  const parts = [el('b', {}, 'How to read this. ')];
  parts.push('"Direct" dependencies are the packages the wallet imports itself; "transitive" ones arrive through them, and the line under a package name says through which. ');
  if (model.unchecked) parts.push('A package "could not be checked" when it has no exact registry version to look up (a version range, a git reference, no version recorded). ');
  parts.push('Results are a snapshot from the check date; new advisories may appear later. ');
  parts.push('A listed advisory is not a defect in the wallet: it says that a version with a published advisory is present, nothing more. Leaving such a version in place can be the right call, when the vulnerable code is never reached or the flaw needs a position an attacker does not have here; that is a decision per advisory. ');
  const t = model.triage;
  if (t && t.total) {
    parts.push('A decision is keyed by the advisory and the package\'s direct user (the line under the package name), and made for this wallet: a row is settled once every direct user has a statement, the wallet itself counting as one when it imports the package. What another wallet concluded about the same direct user is listed under "What others say" and can be adopted after a look, but it never settles a row here; only a statement by the direct user\'s listed maintainer holds for every wallet. ');
    parts.push(t.decided
      ? `The "Decision" column shows ${t.decided} of ${t.total} advisories settled that way, each with its reasons and signers; the rest nobody has judged yet. `
      : 'Nobody has made those statements for this wallet\'s advisories yet, which is what the empty "Decision" column says. ');
    parts.push('"Add statement" on a row writes one: signed with your Nostr browser extension, published to the relays, shown here at once and on every wallet page after the next site build. Anyone can publish; whose statements settle rows is a list the site keeps, the others are shown. ');
  }
  if (model.signals) {
    parts.push('Under the severity, "exploited in the wild" means CISA lists the advisory as exploited somewhere, EPSS is the published probability that it gets exploited anywhere within 30 days, and "public since" is when the advisory was published; all three are about the advisory, not this wallet. ');
  }
  parts.push('We do not rank wallets by this number. ');
  parts.push('Which app a dependency file belongs to comes from a short hand-made list, made by reading each wallet\'s build files. It is not a check of the released app. A file not on the list counts on every page, so the numbers can be too high. "Where?" labels such as "website" or "desktop app" are guesses from folder names. ');
  if (allWhereUnknown(model)) {
    parts.push('The files do not say whether any package with an advisory ends up in the app, the build tooling or the tests, so the table has no Where? column. ');
  } else if (model.byScope) {
    const b = model.byScope;
    parts.push(`"Where?" says where a package ends up: ${b.app} in the app, ${b.build} in the build tooling, ${b.tests} only in tests`);
    parts.push(b.unknown ? `, and ${b.unknown} the files do not say ("unknown"). ` : '. ');
    parts.push('A build or test dependency can still hurt the product (an install script runs on the developer\'s machine), so every advisory needs its own look. ');
  } else if (model.whereUnknown) {
    parts.push(`"unknown" in the Where? column means the files do not say whether the package ends up in the app, the build tooling or the tests (${model.whereUnknown} packages). `);
  }
  parts.push('"Used by" counts how many of the wallets we have checked ship the package in any version, and how many this exact version: a package shared by many wallets is a shared risk, not a problem with this one. A package no other checked wallet uses is marked "only this wallet", here and in the dependency tree: nobody else\'s use of it gets it looked at, so it deserves a look of its own. ');
  if (model.lockfiles.length) {
    parts.push('Files read: ');
    model.lockfiles.forEach((l, i) => { if (i) parts.push(', '); parts.push(el('code', {}, l)); });
    parts.push('. ');
  }
  if (model.diff) {
    const d = model.diff;
    parts.push(`Since ${d.ref}: ${d.added} packages added, ${d.removed} removed, ${d.changed} updated`);
    parts.push(d.integrityChangedAtSameVersion.length
      ? `, and ${d.integrityChangedAtSameVersion.length} changed content at the same version (${d.integrityChangedAtSameVersion.join(', ')}). `
      : ', none changed content at the same version. ');
  }
  // three lines, then "Read more": in full it is taller than a phone screen
  const text = el('p', { className: 'dp-note-text', id: `dp-note-${Math.random().toString(36).slice(2, 8)}` }, parts);
  const more = el('button', { type: 'button', className: 'dp-note-more', 'aria-controls': text.id, 'aria-expanded': 'false' }, 'Read more');
  more.addEventListener('click', () => {
    const open = more.getAttribute('aria-expanded') !== 'true';
    text.classList.toggle('dp-note-text--open', open);
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? 'Read less' : 'Read more';
  });
  return el('div', { className: 'dp-note' }, [text, more]);
}

function actions(model, { appId, base, fetchImpl }) {
  const csv = el('button', { type: 'button', className: 'btn-small dp-csv' }, 'Download CSV');
  csv.addEventListener('click', async () => {
    csv.disabled = true;
    try {
      const data = await fetchJson(`${base}/apps/${safeName(appId)}/${safeName(model.ref)}/dependencies.json`, fetchImpl);
      const text = csvOf(data?.dependencies || [], model.allAdvisories || model.advisories);
      const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
      const a = el('a', { href: url, download: `${appId}-${model.ref}-dependencies.csv` });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Dependencies CSV download failed', error);
    } finally {
      csv.disabled = false;
    }
  });
  return el('div', { className: 'dp-actions' }, csv);
}

// The panel element for a model; exported for tests. `onJudge(advisory)`
// puts a Judge button on every row; after a publish, `flash` is the line
// above the table saying so, `freshId` the statement to mark, and every row
// is shown so the judged one stays in sight wherever it re-sorts to.
// Below the tiles everything starts folded behind one link; `expanded` opens
// it, `onToggle(open)` hears the reader open or close it. `triageFailed`:
// statements.json did not load, said in the notices. `onRowsAdded(node)`:
// rows "Show all" added under node.
export function panelElement(model, { appId, wallet = appId, base = EXPORT_BASE, fetchImpl = globalThis.fetch, onJudge = null, flash = null, freshId = null, showAll = false, trusted = [], expanded = false, onToggle = null, triageFailed = false, onRowsAdded = null } = {}) {
  // No lockfile was read (a C/C++ release with only submodules, or a Flutter one): zeros here would read as clean.
  const tiles = !model.packages && (model.submodules || model.status === 'unsupported' || model.notInApp) ? null : el('div', { className: 'dp-tiles' },
    tile(model.packages, 'dependencies', { sub: `${model.direct} direct · ${model.transitive} transitive`, extra: historyChart(model.history) }),
    vulnerabilityTile(model),
    // rebuilds before malware: the malware count is almost always 0
    rebuildTile(model.rebuilds, model.repoPackages ?? model.packages, tile),
    model.malware
      ? tile(model.malware, 'possible malware', { tone: 'bad', sub: 'being checked by a person; see the note above' })
      : malwareFreeTile(model.malware),
  );
  const rest = [
    treeTabs(model, advisoryTable(model, { onJudge, freshId, showAll, onRowsAdded }), { appId, base, fetchImpl, label: `${wallet} ${model.ref}` }),
    model.advisories.length ? trustedLine(trusted) : null,
    submodulesSection(model, { appId, base, fetchImpl }),
    howToRead(model),
    SHOW_CSV ? actions(model, { appId, base, fetchImpl }) : null,
  ];
  return el('div', { className: 'dp-panel' },
    el('div', { className: 'dp-top' },
      headline(model),
      el('span', { className: 'dp-badge' }, 'Measurement only · not part of the verdict'),
    ),
    notices(model, { triageFailed }),
    flash ? el('p', { className: 'dp-flash', role: 'status' }, flash) : null,
    tiles,
    sortingElement(model.sorting),
    model.notInApp ? el('p', { className: 'dp-not-in-app' }, `${notInAppText(model.notInApp)} Sorted by file path from the wallet's build files; not a check of the released app.`) : null,
    // without the tiles there is nothing to fold under
    tiles ? foldedDetails(model, rest, { expanded: expanded || showAll, onToggle }) : rest,
  );
}

// "See 38 Advisories and Dependency Tree": the count is the advisory tile's.
export function detailsLinkText(model, open = false) {
  const n = (model.advisories || []).filter(a => a.severity !== 'malicious').length;
  const what = !model.packages ? 'Details'
    : n ? `${open ? '' : `${n} `}${n === 1 ? 'Advisory' : 'Advisories'} and Dependency Tree` : 'Dependency Tree';
  return `${open ? 'Hide' : 'See'} ${what}`;
}

function foldedDetails(model, rest, { expanded, onToggle }) {
  const body = el('div', { className: 'dp-details', id: `dp-details-${Math.random().toString(36).slice(2, 8)}` }, rest);
  const link = el('button', { type: 'button', className: 'dp-details-link', 'aria-controls': body.id });
  const set = (open) => {
    body.hidden = !open;
    link.setAttribute('aria-expanded', String(open));
    link.textContent = detailsLinkText(model, open);
  };
  set(expanded);
  link.addEventListener('click', () => {
    const open = body.hidden;
    set(open);
    onToggle?.(open);
  });
  return [link, body];
}

// "Which files count: [Checked by a person] A person chose ...". One pill colour for both, so
// none of them reads as saying the wallet is safe.
function sortingElement(sorting) {
  const label = sortingLabel(sorting);
  if (!label) return null;
  return el('p', { className: 'dp-sorting' }, 'Which files count: ', el('span', { className: 'dp-badge' }, label.pill), ` ${label.text}`);
}

// "Advisories" (the table) and "Dependency tree" tabs. The tree's file (the
// release's full dependency list) is fetched when its tab is first opened.
function treeTabs(model, table, { appId, base, fetchImpl, label }) {
  if (!(model.repoPackages ?? model.packages)) return table;
  const tabs = [];
  const panes = [];
  let loaded = false;
  const dir = `${base}/apps/${safeName(appId)}/${safeName(model.ref)}`;
  const treePane = el('div', { className: 'dp-tabpanel', role: 'tabpanel', hidden: true }, el('p', { className: 'dpt-intro' }, 'Loading the dependency list…'));
  const rebuildPane = el('div', { className: 'dp-tabpanel', role: 'tabpanel', hidden: true }, el('p', { className: 'dpt-intro' }, 'Loading the rebuild results…'));
  const tablePane = el('div', { className: 'dp-tabpanel', role: 'tabpanel' }, table || el('p', { className: 'dpt-intro' }, noAdvisoriesText(model)));
  const select = (i) => {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; panes[j].hidden = i !== j; });
    if (i >= 1 && !loaded) {
      loaded = true;
      Promise.all([
        fetchJson(`${dir}/dependencies.json`, fetchImpl),
        model.rebuilds ? fetchJson(`${dir}/rebuilds.json`, fetchImpl).catch(() => null) : null,
      ]).then(([data, rebuilds]) => {
        if (!data?.dependencies?.length) throw new Error('empty');
        // a row's product from the export's file sorting (issue 994); none says "this app"
        treePane.replaceChildren(treeElement({ dependencies: data.dependencies, advisories: model.allAdvisories || model.advisories, wallet: label, rebuilds: rebuildIndex(rebuilds), productOf: row => row.target ?? null, counted: model.counted }));
        rebuildPane.replaceChildren(rebuilds ? rebuildsElement(rebuilds, data.dependencies) : el('p', { className: 'dpt-intro' }, 'No rebuild results for this release.'));
      }).catch((error) => {
        console.warn('Dependency tree not available', error);
        loaded = false;
        treePane.replaceChildren(el('p', { className: 'dpt-intro' }, 'The dependency list for this release could not be loaded.'));
      });
    }
  };
  const names = [['Advisories', tablePane], ['Dependency tree', treePane]];
  if (model.rebuilds) names.push(['Rebuilds', rebuildPane]);
  names.forEach(([name, pane], i) => {
    const tab = el('button', { type: 'button', className: 'dp-tab', role: 'tab', 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1' }, name);
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const j = (i + (e.key === 'ArrowRight' ? 1 : names.length - 1)) % names.length; select(j); tabs[j].focus(); e.preventDefault(); }
    });
    tabs.push(tab); panes.push(pane);
  });
  return el('div', { className: 'dp-tabs' }, el('div', { className: 'dp-tablist', role: 'tablist' }, tabs), ...panes);
}

// An empty Advisories tab: "none found" only when the check read the whole
// build; Bitcoin Core's C/C++ part is not read at all (issue 1020 P22).
export function noAdvisoriesText(model) {
  const incomplete = (model.lockCoverage && model.lockCoverage.verdict !== 'locked') || model.unchecked;
  return incomplete
    ? 'No published advisories found in the part of this release this check could read. The rest was not checked (see the note above), so this is not "none".'
    : 'No published advisories found for this release.';
}

// "Your statement on GHSA-… is published (3 of 6 relays): this page shows it now, every wallet page after the next site build."
export function publishedFlash(statement, summary) {
  const where = summary?.settles === false ? 'shown under "What others say" here' : 'this page shows it now';
  return `Your statement on ${statement.vulns[0]} is published (${summary?.successful ?? '?'} of ${summary?.total ?? '?'} relays accepted it): ${where}, every wallet page after the next site build.`;
}

/**
 * Fetch the app's export file and paint the panel into `host`. The host stays
 * hidden when the app has no analysed release or the export is unreachable:
 * a wallet nobody analysed shows no empty box. Resolves to the model or null.
 * `nostr` overrides the dialog's signer and relays, `profiles(pubkeys)` the
 * signer-name lookup (tests).
 */
// Shown instead of the panel when the version picked in "Every version" has no
// analysis: which releases do, each a button that picks its stone when the
// river has one.
function notAnalysedElement(version, app, platform, failed) {
  const river = typeof document !== 'undefined' ? document.getElementById(`buildVerifications-${platform}`) : null;
  const analysed = (app.releases || []).filter(hasAnalysis);
  const refs = analysed.map((r) => {
    const stone = river && [...river.querySelectorAll('.bv-stone[data-version-key]')]
      .find(b => releaseForVersion({ releases: [r] }, b.dataset.versionKey));
    if (!stone) return el('b', {}, r.ref);
    const pick = el('button', { type: 'button', className: 'dp-pick-version' }, r.ref);
    pick.addEventListener('click', () => stone.click());
    return pick;
  });
  const list = el('span', { className: 'dp-pick-list' }, refs);
  return el('div', { className: 'dp-panel dp-panel--not-analysed' },
    el('p', { className: 'dp-headline' },
      failed
        ? `The dependency check of version ${version} (${failed.ref}) failed${failed.error ? ` (${failed.error})` : ''}.`
        : `Version ${version} has not been checked for dependencies.`),
    refs.length ? el('p', {}, analysed.length === 1 ? 'Checked: ' : 'Checked releases: ', list) : null,
  );
}

// How long the panel waits for "Every version" to pick a version before it
// shows the newest checked release anyway (that section failed to load).
const PICK_WAIT_MS = 15000;

// In place of the panel while "Every version" has not picked a version yet.
function waitingElement() {
  return el('div', { className: 'dp-panel dp-panel--waiting' },
    el('p', { className: 'dp-headline', role: 'status' }, 'Loading the release picked under "Every version"…'));
}

// A release the panel can show: analysed, or failed with something still read from it.
function hasAnalysis(release) {
  return (release.status || 'ok') === 'ok' || Boolean(release.submodules) || Boolean(release.lockCoverage);
}

// The version picked in "Every version" (src/build-verifications.mjs keeps it
// on its host), or null before that section is painted.
function pickedVersion(platform) {
  if (typeof document === 'undefined') return null;
  const river = document.getElementById(`buildVerifications-${platform}`);
  return (river && !river.hidden && river.dataset.selectedVersion) || null;
}

// How many of the picked version's verifications found it reproducible and
// not reproducible ({ reproducible, notReproducible }), or null.
function pickedVerdicts(platform) {
  if (typeof document === 'undefined') return null;
  const river = document.getElementById(`buildVerifications-${platform}`);
  const [reproducible, notReproducible] = String(river?.dataset.selectedVerdicts || '').split(' ').map(Number);
  return Number.isFinite(notReproducible) ? { reproducible, notReproducible } : null;
}

/**
 * Paints the panel into [host] for the release the "Every version" section of
 * [platform] has picked, and follows it when another version is picked
 * (`buildVersionSelected`); the newest analysed release until that section is
 * painted, or when the page has none. `selectedVersion` overrides the pick.
 */
export async function renderDependenciesPanel({ host, appId, platform = 'app', selectedVersion = undefined, title = '', base = EXPORT_BASE, triageBase = TRIAGE_BASE, liveEvents = liveTriageEvents, fetchImpl = globalThis.fetch, nostr = undefined, profiles = undefined, pickWaitMs = PICK_WAIT_MS }) {
  if (!host || !appId) return null;
  let selected = selectedVersion === undefined ? pickedVersion(platform) : selectedVersion;
  let verdicts = selectedVersion === undefined ? pickedVerdicts(platform) : null;
  let ready = false;
  // "Every version" picks only once the verifications are in from the relays
  // (0.2 to 6 s). A release painted before that is often not the one it
  // picks, so the reader saw one release and then another (issue 1020 P10):
  // on a page with that section, a loading line until it has picked, or
  // until `pickWaitMs` has passed without a pick.
  const river = selectedVersion === undefined && typeof document !== 'undefined' ? document.getElementById(`buildVerifications-${platform}`) : null;
  let waiting = Boolean(river) && !selected;
  let waitTimer = null;
  const stopWaiting = () => {
    waiting = false;
    clearTimeout(waitTimer);
  };
  if (selectedVersion === undefined && typeof document !== 'undefined') {
    // Listening before the export loads: a pick made meanwhile is not lost.
    document.addEventListener('buildVersionSelected', (event) => {
      if (event.detail?.platform !== platform) return;
      const version = event.detail.version || null;
      const next = event.detail.verdicts || null;
      if (!waiting && version === selected && JSON.stringify(next) === JSON.stringify(verdicts)) return;
      stopWaiting();
      selected = version;
      verdicts = next;
      if (ready) paint();
    });
  }
  let app = null;
  let published = null;
  let triage = null;
  let signals = null;
  let upstream = null;
  let apk = null;
  try {
    app = appForListing(await loadApp(appId, { base, fetchImpl }), appId, platform);
    if (app) {
      published = await loadTriage({ triageBase, fetchImpl });
      triage = triageForApp(app, published);
      signals = await loadSignals({ base, fetchImpl });
      upstream = await loadUpstream([app.appId, appId], { base, fetchImpl });
      apk = await loadApk([app.appId, appId], { base, fetchImpl });
    }
  } catch (error) {
    console.warn('Dependencies panel: export not reachable', error);
    return null;
  }
  const analysisId = app?.appId || appId;
  let model = null;
  // Every release the panel can show gets a stone in "Every version", verified or not.
  if (selectedVersion === undefined && typeof document !== 'undefined') {
    const shown = (app?.releases || []).filter(r => r.ref && hasAnalysis(r));
    showAnalysedReleases(document.getElementById(`buildVerifications-${platform}`), shown.map(r => ({ ref: r.ref, versions: r.versions })));
  }

  // Repainted after a statement is published, with the statement merged in,
  // and when the relay has statements the site build did not see.
  const lists = { trusted: published?.trusted || [], maintainers: published?.maintainers || {} };
  // whether the reader opened the advisories and tree; kept across repaints and version picks
  let expanded = false;
  const getProfiles = profiles === undefined ? defaultProfiles : profiles;
  const paint = (extra = {}) => {
    if (extra.showAll) expanded = true;
    if (waiting) {
      model = panelModel(app, { triage, signals, upstream, apk, platform, appId });
      if (model) host.replaceChildren(waitingElement());
      return model;
    }
    const release = selected ? releaseForVersion(app, selected) : null;
    if (selected && (!release || !hasAnalysis(release)) && app?.releases?.length) {
      model = { ref: release?.ref || null, selectedVersion: selected, notAnalysed: true };
      host.replaceChildren(notAnalysedElement(selected, app, platform, release));
      return model;
    }
    model = panelModel(app, { release: release?.ref || null, selectedVersion: release ? selected : null, triage, signals, upstream, apk, platform, appId });
    if (!model) return null;
    model.verdicts = release ? verdicts : null;
    host.replaceChildren(panelElement(model, { appId: analysisId, wallet: title || analysisId, base, fetchImpl, onJudge, trusted: lists.trusted, triageFailed: Boolean(published?.failed), expanded, onToggle: (open) => { expanded = open; }, onRowsAdded: (node) => nameSigners(node, getProfiles), ...extra }));
    nameSigners(host, getProfiles);
    return model;
  };
  async function onJudge(advisory, edit = null) {
    openTriageDialog({
      advisory,
      edit,
      appId: analysisId,
      release: model?.ref || null,
      rows: model?.allAdvisories || [],
      triage,
      trusted: lists.trusted,
      maintainers: lists.maintainers,
      profiles: getProfiles,
      ...(nostr ? { nostr } : {}),
      onPublished: (statement, summary) => {
        triage = withStatement(triage, statement, { appId: analysisId, trusted: lists.trusted, maintainers: lists.maintainers });
        paint({ flash: publishedFlash(statement, summary), freshId: statement.id, showAll: true });
        (host.querySelector('.dp-row--fresh') || host.querySelector('.dp-flash'))?.scrollIntoView?.({ block: 'center' });
      },
      onDeleted: (statement, summary) => {
        // every version of that subject by that author: an earlier one still in the page's list must not come back
        triage = triage ? { ...triage, statements: triage.statements.filter(s => !(s.pubkey === statement.pubkey && s.d === statement.d)) } : triage;
        paint({ flash: `Your statement on ${statement.vulns[0]} is deleted (${summary.text}): gone from this page and, once the relay has the request, from every wallet page.`, showAll: true });
        host.querySelector('.dp-flash')?.scrollIntoView?.({ block: 'center' });
      },
    });
  }

  ready = true;
  if (waiting) {
    waitTimer = setTimeout(() => {
      if (!waiting) return;
      stopWaiting();
      paint();
    }, pickWaitMs);
  }
  if (!paint()) {
    stopWaiting();
    host.hidden = true;
    return null;
  }
  host.hidden = false;
  const step = host.closest('.dependencies-step');
  if (step) step.hidden = false;
  // The relay's statements, after the first paint: a statement made since the
  // last site build shows now, a deleted one goes. A dialog the reader has open
  // keeps working on the rows it was opened from.
  if (app?.releases?.some(r => r.advisories?.length)) {
    const events = await liveEvents({ authors: triageAuthors(lists) });
    const merged = triageForApp(app, mergeLiveTriage(published, events));
    const ids = (t) => JSON.stringify((t?.statements || []).map(st => st.id).sort());
    if (ids(merged) !== ids(triage)) {
      triage = merged;
      paint();
    }
  }
  return model;
}

if (typeof window !== 'undefined') {
  window.renderDependenciesPanel = renderDependenciesPanel;
}
