import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { loadApp, renderDependenciesPanel, liveTriageEvents, triageAuthors, panelElement, usedBy, severityTally, coverageTipLines, historyScale, vulnerabilityTipLines } from '../../src/dependencies-panel.mjs';
import { panelModel, releaseForVersion, appForListing } from '../../src/dependencies-panel-model.mjs';
import { nip19 } from 'nostr-tools';
import { viaLine, submoduleIdentityText } from '../../src/dependencies-panel.mjs';
import { severityCell } from '../../src/dependencies-advisories.mjs';

const shortNpub = (pk) => { const n = nip19.npubEncode(pk); return `${n.slice(0, 10)}…${n.slice(-4)}`; };

const advisory = (id, severity, extra = {}) => ({ id, severity, aliases: [], fixed: [], summary: 's', ecosystem: 'npm', package: 'pkg', version: '1.0.0', direct: true, dev: false, ...extra });

const APP = {
  schema: 1, appId: 'app.android',
  aliases: [{ appId: 'app.android', platform: 'android' }, { appId: 'app.ios', platform: 'iphone' }],
  releases: [{
    kind: 'release', ref: 'v1.4.0', commit: 'a1b2c3d4', analysedAt: '2026-10-01 00:00:00', status: 'ok',
    lockfiles: ['package-lock.json'],
    osv: { checked: 398, skipped: { floating: 14 } },
    dependencies: { total: 412, direct: 40, dev: 100, devUnknown: 0, byScope: { app: 300, build: 90, tests: 10, unknown: 12 }, byEcosystem: { npm: 412 }, tiers: {}, lockfiles: ['package-lock.json'] },
    vulnerabilities: { total: 13, bySeverity: { malicious: 0, critical: 1, high: 2, moderate: 10, low: 0, unknown: 0 }, packages: 13, byScope: { app: 1, build: 2, tests: 0, unknown: 10 } },
    advisories: [advisory('GHSA-crit', 'critical'), advisory('GHSA-high', 'high', { dev: true }), advisory('GHSA-test', 'high', { dev: true, scope: 'tests' }), ...Array.from({ length: 10 }, (_, i) => advisory(`GHSA-mod-${i}`, 'moderate', { dev: null }))],
    diffFrom: { ref: 'v1.3.0', added: 12, removed: 3, changed: 40, integrityChangedAtSameVersion: ['npm:left-pad'] },
  }],
  defaultBranch: null,
};

const noLive = async () => [];

function fakeFetch(files) {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    const body = files[url];
    if (body === undefined) return { ok: false, status: 404, json: async () => null };
    return { ok: true, status: 200, json: async () => body };
  };
  return { fetchImpl, calls };
}

describe('dependencies panel', () => {
  test('loadApp follows one alias stub to the repository\'s first app id', async () => {
    const { fetchImpl, calls } = fakeFetch({
      '/x/apps/app.ios.json': { schema: 1, appId: 'app.android', alias: true },
      '/x/apps/app.android.json': APP,
    });
    const app = await loadApp('app.ios', { base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.equal(app.appId, 'app.android');
    assert.deepEqual(calls, ['/x/apps/app.ios.json', '/x/apps/app.android.json']);
    assert.equal(await loadApp('app.none', { base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl }), null);
  });

  test('a listing shows only the releases reproduced for it, and nothing when none was', async () => {
    const listed = (ref, ...reproducedFor) => ({ ...APP.releases[0], ref, reproducedFor });
    const app = { ...APP, releases: [listed('v1.5.0', { appId: 'app.android', platform: 'android' }), listed('v1.4.0', { appId: 'app.android', platform: 'android' }, { appId: 'app.android', platform: 'iphone' })] };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.ios.json': { schema: 1, appId: 'app.android', alias: true }, '/x/apps/app.android.json': app });
    const render = async (appId, platform) => {
      const host = document.createElement('div');
      host.hidden = true;
      return [await renderDependenciesPanel({ host, appId, platform, selectedVersion: null, base: '/x', triageBase: '/xt1937', liveEvents: noLive, fetchImpl }), host];
    };
    assert.equal((await render('app.android', 'android'))[0].ref, 'v1.5.0');
    assert.equal((await render('app.android', 'iphone'))[0].ref, 'v1.4.0', 'one app id listed on two platforms (Bitkey)');
    const [none, host] = await render('app.ios', 'iphone');
    assert.equal(none, null, 'the iPhone app was never reproduced');
    assert.equal(host.hidden, true);
    // an export without reproducedFor (SOURCE_ANALYSIS_SCOPE=all) shows every release, as before
    assert.equal(appForListing(APP, 'app.ios', 'iphone'), APP);
  });

  test('renderDependenciesPanel paints tiles, worst rows, notes and keeps the host hidden without data', async () => {
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': APP, '/xt/statements.json': { schema: 1, trusted: [], maintainers: {}, statements: [] } });
    const step = document.createElement('div');
    step.className = 'step dependencies-step';
    step.hidden = true;
    const host = document.createElement('div');
    host.hidden = true;
    step.appendChild(host);
    document.body.appendChild(step);

    const model = await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.equal(model.ref, 'v1.4.0');
    assert.equal(host.hidden, false);
    assert.equal(step.hidden, false);
    const values = [...host.querySelectorAll('.dp-tile__value')].map(e => e.textContent);
    assert.deepEqual(values, ['412', '13', '0'], 'the vulnerability tile counts app, build and test matches alike');
    assert.equal(host.querySelector('.dp-tile .dp-tile__sub').textContent, '40 direct · 372 transitive');
    assert.match(host.querySelector('.dp-notices').textContent, /14 of the 412 packages could not be checked for advisories \(14 version range, not an exact version\); that is not the same as "no problems"\./);
    assert.deepEqual([...host.querySelectorAll('.dp-tally')].map(e => e.textContent), ['1 critical · none cleared', '2 high · none cleared', '10 medium · none cleared'], 'one line per severity, build and tests included');
    assert.ok(host.querySelector('.dp-tile--sev-critical'), 'the count takes the worst open severity\'s colour');
    const vulnTile = host.querySelectorAll('.dp-tile')[1];
    assert.equal(vulnTile.querySelector('.dp-tile__label').textContent, 'advisory matches');
    assert.deepEqual([...vulnTile.querySelectorAll('.dp-tile__line')].map(e => e.textContent), ['13 distinct advisories', '1 in the app · 2 in build tooling · 10 unclear'], 'the split is a muted line; the headline stays the total');
    assert.doesNotMatch(vulnTile.textContent, /only/, 'nothing is played down as "only" build or tests');
    assert.match(vulnTile.querySelector('.dp-tile__caveat').textContent, /not that the affected part is used\. The released app itself was not checked/);
    const number = vulnTile.querySelector('.dp-tile__value button');
    number.dispatchEvent(new window.Event('click', { bubbles: true }));
    const tip = document.getElementById(number.getAttribute('aria-controls'));
    assert.equal(tip.hidden, false, 'the number explains itself');
    assert.match(tip.textContent, /Every package counts the same, whether it goes into the app or is used to build or test it/);
    assert.match(tip.textContent, /source code for v1\.4\.0 and looked up each package version in OSV\.dev, a public database of these reports, on 2026-10-01\./);
    assert.match(tip.textContent, /What it means for your app: it is about v1\.4\.0\. A report tells us the package version is affected, not whether the affected part is used\. We have not checked the released app/);
    const cleared = vulnTile.querySelector('.dp-tally button');
    assert.equal(cleared.textContent, 'cleared');
    cleared.dispatchEvent(new window.Event('click', { bubbles: true }));
    assert.equal(number.getAttribute('aria-expanded'), 'false', 'one tip at a time');
    assert.match(tip.textContent, /signed that it does not affect this app/);
    assert.match(tip.textContent, /nobody has checked them yet/);
    cleared.dispatchEvent(new window.Event('click', { bubbles: true }));
    assert.equal(host.querySelectorAll('tbody tr').length, 10);
    assert.equal(host.querySelector('tbody tr td a').textContent, 'GHSA-crit');
    assert.equal(host.querySelector('tbody tr td a').getAttribute('href'), 'https://osv.dev/vulnerability/GHSA-crit');
    assert.equal(host.querySelector('.dp-more').textContent, 'Show all 13 advisories');
    assert.deepEqual([...host.querySelectorAll('thead th')].map(e => e.textContent), ['Package', 'Version', 'Advisory', 'Severity', 'Where?', 'Used by', 'Decision']);
    const headerTips = [...host.querySelectorAll('thead th button')];
    assert.deepEqual(headerTips.map(e => e.textContent), ['Advisory', 'Severity', 'Where?', 'Decision'], 'Used by has no tip');
    headerTips[2].dispatchEvent(new window.Event('click', { bubbles: true }));
    assert.match(host.querySelector('.dp-tip').textContent, /^Where this library ends up: app \(inside the wallet\)/);
    assert.deepEqual([...host.querySelectorAll('.dp-tip strong')].map(e => e.textContent), ['app', 'build', 'tests', 'server', 'Unknown']);
    headerTips[2].dispatchEvent(new window.Event('click', { bubbles: true }));
    assert.equal(host.querySelector('.dp-exposure'), null, 'the severities are counted once, in the tile');
    assert.equal(host.querySelector('.dp-tile .dp-triage-line').textContent, '0 decided · 13 still to look at');
    assert.equal(host.querySelectorAll('.dp-decision--undecided').length, 10);
    assert.match(host.querySelector('.dp-note').textContent, /Nobody has made those statements for this wallet's advisories yet/);
    assert.equal(host.querySelector('.dp-eco'), null, 'one ecosystem: no tag on the package');
    assert.match(host.querySelector('.dp-note').textContent, /300 in the app, 90 in the build tooling, 10 only in tests, and 12 the files do not say/);
    assert.equal(host.querySelector('.dp-badge').textContent, 'Measurement only · not part of the verdict');
    assert.match(host.querySelector('.dp-note').textContent, /A listed advisory is not a defect in the wallet/);
    assert.match(host.querySelector('.dp-note').textContent, /We do not rank wallets by this number/);
    const notices = [...host.querySelectorAll('.dp-notices li')].map(e => e.textContent);
    assert.match(notices[0], /same source repository as app\.ios, which shares this analysis/);
    assert.doesNotMatch(host.textContent, /store version/i, 'the store version is not shown');
    assert.match(host.querySelector('.dp-note').textContent, /Since v1\.3\.0: 12 packages added, 3 removed, 40 updated, and 1 changed content at the same version \(npm:left-pad\)/);
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.4\.0 \(source tag, commit a1b2c3d\) · Checked on 2026-10-01/);
    assert.deepEqual([...host.querySelectorAll('.dp-where')].slice(0, 4).map(e => e.textContent), ['app', 'build', 'tests', 'unknown']);

    const empty = document.createElement('div');
    empty.hidden = true;
    assert.equal(await renderDependenciesPanel({ host: empty, appId: 'app.none', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl }), null);
    assert.equal(empty.hidden, true);
  });

  test('the headline says when the advisories were last looked up (issue 1020 P16)', () => {
    const app = { ...APP, releases: [{ ...APP.releases[0], vulnerabilities: { ...APP.releases[0].vulnerabilities, lookedUpAt: '2026-11-12 06:00:00' } }] };
    const model = panelModel(app);
    const node = panelElement(model, { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    assert.match(node.querySelector('.dp-headline').textContent, /Checked on 2026-10-01 · Advisories looked up on 2026-11-12$/);
    assert.match(vulnerabilityTipLines(model)[1], /in OSV\.dev, a public database of these reports, on 2026-11-12\./, 'the tip names the newest lookup, not the analysis');
    const older = panelElement(panelModel(APP), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    assert.doesNotMatch(older.querySelector('.dp-headline').textContent, /looked up/, 'an export without the time says nothing');
  });

  test('an empty Advisories tab does not say "none" while part of the build was not read (issue 1020 P22)', () => {
    // Bitcoin Core v32.1: three pip packages read, the C/C++ build part not
    const core = { ...APP, releases: [{ ...APP.releases[0], advisories: [], vulnerabilities: { bySeverity: {} }, osv: { skipped: {} },
      lockCoverage: { verdict: 'unlocked', missing: [], missingCount: 0, unread: [{ ecosystem: 'c/c++', manifest: 'CMakeLists.txt', lockfile: null }], unreadCount: 1, floating: 0, downloads: [], downloadCount: 0, binaries: [], binaryCount: 0 } }] };
    const tab = (app) => panelElement(panelModel(app), { appId: 'app.android', base: '/x', fetchImpl: async () => null }).querySelector('.dp-tabpanel').textContent;
    assert.match(tab(core), /^No published advisories found in the part of this release this check could read\. The rest was not checked \(see the note above\), so this is not "none"\.$/);
    const locked = { ...core, releases: [{ ...core.releases[0], lockCoverage: { ...core.releases[0].lockCoverage, verdict: 'locked', unread: [], unreadCount: 0 } }] };
    assert.match(tab(locked), /^No published advisories found for this release\.$/, 'everything read: none found');
  });

  test('a failed re-check is noted next to the kept result, which still shows (issue 998)', async () => {
    const rechecked = { ...APP, releases: [{ ...APP.releases[0], recheckFailed: { at: '2026-11-06 08:00:00', error: 'git clone timed out' } }] };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': rechecked });
    const host = document.createElement('div');
    document.body.appendChild(host);
    await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.match(host.querySelector('.dp-headline').textContent, /Checked on 2026-10-01 · Re-check failed on 2026-11-06$/);
    assert.equal(host.querySelector('.dp-recheck-failed b').textContent, '2026-11-06');
    const notices = [...host.querySelectorAll('.dp-notices li')].map(e => e.textContent);
    assert.ok(notices.includes('A re-check of v1.4.0 on 2026-11-06 failed (git clone timed out); what is shown is from the check that worked, on 2026-10-01.'));
    assert.doesNotMatch(host.textContent, /ended with status/);
    assert.deepEqual([...host.querySelectorAll('.dp-tile__value')].map(e => e.textContent), ['412', '13', '0'], 'the kept numbers stay');

    const plain = document.createElement('div');
    document.body.appendChild(plain);
    await renderDependenciesPanel({ host: plain, appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl: fakeFetch({ '/x/apps/app.android.json': APP }).fetchImpl });
    assert.equal(plain.querySelector('.dp-recheck-failed'), null);
    assert.doesNotMatch(plain.textContent, /Re-check failed|A re-check of/);
  });

  test('a triage file paints decisions from the direct users\' statements, keeps rows in severity order and counts the queue', async () => {
    const me = 'a'.repeat(64);
    let n = 0;
    const statement = (vulns, extra) => ({ id: String(++n), pubkey: me, created_at: 1, d: `${vulns[0]}|${n}`, vulns, package: 'npm:pkg', via: null, app: null, justification: null, versions: null, content: '', ...extra });
    const triage = { schema: 3, appId: 'app.android', trusted: [me], statements: [
      statement(['GHSA-crit'], { via: 'npm:alib', app: 'app.android', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', content: 'alib never calls parse()' }),
      statement(['GHSA-crit'], { via: 'npm:alib', app: 'd.wallet', status: 'affected', content: 'd.wallet hands alib user input' }),
      statement(['GHSA-test'], { app: 'app.android', status: 'affected', content: 'postinstall runs on the build machine' }),
      statement(['GHSA-high'], { via: 'npm:one', app: 'app.android', status: 'not_affected' }),
      statement(['GHSA-mod-0'], { via: 'npm:zlib', status: 'fixed', pubkey: 'b'.repeat(64) }),
    ] };
    const app = { ...APP, releases: [{ ...APP.releases[0], advisories: APP.releases[0].advisories.map(a => (
      a.id === 'GHSA-crit' ? { ...a, direct: false, dependants: ['alib'] }
        : a.id === 'GHSA-high' ? { ...a, direct: false, dependants: ['one', 'two'] }
          : a.id === 'GHSA-mod-0' ? { ...a, direct: false, dependants: ['zlib'] } : a)) }] };
    const upstream = { schema: 1, appId: 'app.android', advisories: { 'GHSA-mod-0': [{ kind: 'upstream', repo: 'https://github.com/z/zlib', ref: 'v2', file: 'osv-scanner.toml', line: 4, url: 'https://github.com/z/zlib/blob/v2/osv-scanner.toml#L4', reason: 'zlib never inflates untrusted input', package: 'npm:zlib@2.0.0' }] } };
    const apk = { schema: 1, appId: 'app.android', ref: 'v1.4.0', apk: { name: 'app-1.4.0.apk', sha256: 'ab'.repeat(32) },
      summary: { declared: 3, present: 1, otherVersionShipped: 1, cantTell: 0, native: 2, nativeIdentical: 1, nativeDiffers: 0, undeclaredClasses: 7 },
      packages: { 'npm:pkg@1.0.0': 'absent' }, nativeFiles: [{ path: 'lib/arm64-v8a/libmystery.so', verdict: 'undeclared', providers: [] }], undeclared: [{ package: 'com.vendored', classes: 7 }] };
    const { fetchImpl, calls } = fakeFetch({ '/x/apps/app.ios.json': { schema: 1, appId: 'app.android', alias: true }, '/x/apps/app.android.json': app, '/xt3/statements.json': triage, '/x/upstream/app.android.json': upstream, '/x/apk/app.android.json': apk });
    const host = document.createElement('div');
    const model = await renderDependenciesPanel({ host, appId: 'app.ios', base: '/x', triageBase: '/xt3', liveEvents: noLive, fetchImpl, profiles: async () => new Map([[me, { name: 'Alice', picture: 'https://example.org/alice.png' }]]) });
    await new Promise(r => setTimeout(r, 0)); // signer names arrive after the paint
    assert.deepEqual(calls.slice(2), ['/xt3/statements.json', '/x/signals.json', '/x/upstream/app.android.json', '/x/apk/app.android.json'], 'the site build\'s statements (cached per base, so this test has its own), then the signals, the harvested ignore files and the APK check');
    assert.deepEqual(model.triage, { total: 13, decided: 2, undecided: 11, affected: 1, not_affected: 1, fixed: 0, under_investigation: 0, partial: 1, others: 2 });
    assert.deepEqual([...host.querySelectorAll('.dp-tally')].map(e => e.textContent), ['1 critical · 1 cleared', '2 high · none cleared', '10 medium · none cleared'], 'the not-affected critical is cleared; the affected high is not');
    assert.ok(host.querySelector('.dp-tile--sev-high'), 'with the only critical cleared, the count goes orange');
    assert.equal(host.querySelector('.dp-tile__caveat').textContent, 'A match means a package version is listed as affected, not that the affected part is used.', 'with an APK check, no "not checked" sentence');
    assert.equal(host.querySelector('.dp-tile .dp-triage-line').textContent, '2 decided · 1 affected · 1 not affected · 11 still to look at (1 partly)');
    const rows = [...host.querySelectorAll('tbody tr')];
    assert.deepEqual(rows.slice(0, 3).map(r => r.querySelector('td a').textContent), ['GHSA-crit', 'GHSA-high', 'GHSA-test'], 'by severity alone: a decision does not move a row');
    const affected = rows[2];
    const partlyRow = rows[1];
    const first = rows[0].querySelector('.dp-td-decision');
    assert.equal(first.querySelector('.dp-decision').textContent, 'not affected');
    assert.equal(first.querySelector('.dp-decision__why').textContent, 'via alib: vulnerable code never executed (not affected, Alice) Edit');
    assert.equal(rows[0].querySelector('.dp-via').textContent, 'via alib');
    assert.equal(rows[0].querySelector('.dp-inapk').textContent, 'not in the APK', 'the released APK\'s answer under Where?');
    assert.match(host.querySelector('.dp-notices').textContent, /Checked against the released APK app-1\.4\.0\.apk \(sha256 abababababab…\): 2 of the 3 declared Maven\/Gradle packages are in it; 1 of 2 native libraries are the same code as the published packages; no dependency declares libmystery\.so; 7 classes come from no declared package \(com\.vendored\)/);
    const signer = first.querySelector('a.dp-signer');
    assert.equal(signer.getAttribute('href'), `https://njump.me/${nip19.npubEncode(me)}`, 'the signer links to their profile');
    assert.equal(signer.getAttribute('title'), "Alice's profile");
    assert.equal(signer.querySelector('img').getAttribute('src'), 'https://example.org/alice.png', 'with their picture');
    assert.equal(host.querySelector(`a.dp-signer[data-pubkey="${'b'.repeat(64)}"] img`).getAttribute('src'), '/images/profile-placeholder.svg', 'no profile: the placeholder');
    assert.equal(host.querySelector('.dp-trusted').textContent, 'Decisions here count only from: Alice. Statements by anyone else are listed under "What others say".');
    const elsewhere = first.querySelector('details.dp-decision__others');
    assert.equal(elsewhere.querySelector('summary').textContent, 'What others say (1)', 'another wallet\'s call on the same direct user is shown, not applied');
    assert.equal(elsewhere.querySelector('.dp-decision__why').textContent, 'in d.wallet, via alib: d.wallet hands alib user input (affected, Alice) Adopt');
    assert.equal(affected.querySelector('.dp-decision').textContent, 'affected');
    assert.equal(affected.querySelector('.dp-decision__why').textContent, 'this wallet: postinstall runs on the build machine (affected, Alice) Edit');
    assert.equal(affected.querySelector('.dp-via').textContent, 'imported by the wallet');
    const partly = partlyRow.querySelector('.dp-td-decision');
    assert.equal(partly.querySelector('.dp-decision').textContent, 'Not assessed');
    assert.equal(partly.querySelector('.dp-decision__why').textContent, '1 of 2 direct users assessed');
    const community = rows.find(r => r.querySelector('td a').textContent === 'GHSA-mod-0');
    assert.equal(community.querySelector('.dp-decision').textContent, 'Not assessed', 'an author outside the trusted list settles nothing');
    const folded = community.querySelector('details.dp-decision__others');
    assert.equal(folded.querySelector('summary').textContent, 'What others say (2)', 'one community statement, one ignore-file entry');
    const harvested = folded.querySelector('.dp-decision__upstream');
    assert.equal(harvested.textContent, 'osv-scanner.toml of zlib@2.0.0: zlib never inflates untrusted input (ignore file, unsigned)');
    assert.equal(harvested.querySelector('a').getAttribute('href'), 'https://github.com/z/zlib/blob/v2/osv-scanner.toml#L4');
    assert.equal(folded.hasAttribute('open'), false, 'folded until asked for');
    assert.equal(folded.querySelector('.dp-decision__why').textContent, `community, via zlib: fixed (fixed, ${shortNpub('b'.repeat(64))}) Edit`, 'the statement itself is there to read');
    assert.match(host.querySelector('.dp-note').textContent, /2 of 13 advisories settled that way/);
  });

  // Issue 995: a decision made on other versions reopens the row and shows under it.
  test('a decision judged on other versions reopens the row, labelled with the old call, and counts as to re-check', async () => {
    const me = 'a'.repeat(64);
    const judged = { id: 'j1', pubkey: me, created_at: 1, d: 'GHSA-crit|via:npm:alib|app:app.android', vulns: ['GHSA-crit'], package: 'npm:pkg', via: 'npm:alib', app: 'app.android', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', versions: null, content: '', release: 'v1.3.0', packageVersion: '0.9.0', viaVersion: '2.0.0' };
    const app = { ...APP, releases: [{ ...APP.releases[0], advisories: APP.releases[0].advisories.map(a => (
      a.id === 'GHSA-crit' ? { ...a, direct: false, dependants: ['alib'], dependantVersions: { alib: ['2.0.0'] } } : a)) }] };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': app, '/xt995/statements.json': { schema: 1, trusted: [me], statements: [judged] } });
    const host = document.createElement('div');
    const model = await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt995', liveEvents: noLive, fetchImpl, profiles: async () => new Map([[me, { name: 'Alice' }]]) });
    await new Promise(r => setTimeout(r, 0));
    assert.equal(model.triage.decided, 0);
    assert.equal(model.triage.stale, 1);
    assert.equal(host.querySelector('.dp-tile .dp-triage-line').textContent, '0 decided · 13 still to look at (1 to re-check)');
    const cell = host.querySelector('tbody tr .dp-td-decision');
    assert.equal(cell.querySelector('.dp-decision').textContent, 'Not assessed');
    assert.equal(cell.querySelector('.dp-decision__why').textContent, 'previously not affected in v1.3.0 (pkg 0.9.0, now 1.0.0): vulnerable code never executed (not affected, Alice) Edit');
  });

  test('rows "Show all" adds name their signers like the first rows (issue 1020 P14)', async () => {
    const me = 'a'.repeat(64);
    const s = { id: 's9', pubkey: me, created_at: 1, d: 'GHSA-mod-9|app:app.android', vulns: ['GHSA-mod-9'], package: 'npm:pkg', via: null, app: 'app.android', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', versions: null, content: '' };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': APP, '/xt1020/statements.json': { schema: 1, trusted: [me], statements: [s] } });
    const host = document.createElement('div');
    await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt1020', liveEvents: noLive, fetchImpl, profiles: async () => new Map([[me, { name: 'Alice' }]]) });
    await new Promise(r => setTimeout(r, 0));
    assert.equal(host.querySelector('.dp-trusted .dp-signer__name').textContent, 'Alice');
    assert.equal(host.querySelector('tr[data-advisory="GHSA-mod-9"]'), null, 'beyond the worst rows');
    host.querySelector('.dp-more').click();
    await new Promise(r => setTimeout(r, 0));
    assert.equal(host.querySelector('tr[data-advisory="GHSA-mod-9"] .dp-signer__name').textContent, 'Alice');
  });

  test('signals paint "exploited in the wild" and EPSS under the severity and reorder within a severity', async () => {
    const signals = { schema: 1, date: '2026-10-16', epss: { 'CVE-A': [0.0052, 0.43], 'CVE-B': [0.3, 0.99] }, kev: { 'CVE-B': { added: '2024-01-01' } }, published: { 'GHSA-test': '2022-04-25' } };
    const app = { ...APP, releases: [{ ...APP.releases[0], advisories: APP.releases[0].advisories.map(a => (
      a.id === 'GHSA-high' ? { ...a, aliases: ['CVE-A'] } : a.id === 'GHSA-test' ? { ...a, aliases: ['CVE-B'] } : a)) }] };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': app, '/x/signals.json': signals });
    const host = document.createElement('div');
    const model = await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.deepEqual(model.signals, { date: '2026-10-16', exploited: 1, withEpss: 2 });
    const rows = [...host.querySelectorAll('tbody tr')];
    assert.deepEqual(rows.slice(0, 3).map(r => r.querySelector('td a').textContent), ['GHSA-crit', 'GHSA-test', 'GHSA-high'], 'the exploited high row before the other high row');
    assert.equal(rows[1].querySelector('.dp-kev').textContent, 'exploited in the wild');
    assert.equal(rows[1].querySelector('.dp-published').textContent, 'public since 2022-04-25');
    assert.equal(rows[2].querySelector('.dp-published'), null, 'no date known, none shown');
    assert.equal(rows[1].querySelector('.dp-epss').textContent, 'EPSS 30 %');
    assert.equal(rows[2].querySelector('.dp-epss').textContent, 'EPSS 0.5 %');
    assert.equal(rows[0].querySelector('.dp-epss'), null);
    assert.match(host.querySelector('.dp-note').textContent, /EPSS is the published probability/);
  });

  test('an unreachable export leaves the host untouched', async () => {
    const fetchImpl = async () => { throw new Error('offline'); };
    const host = document.createElement('div');
    host.hidden = true;
    const warn = console.warn;
    console.warn = () => {};
    try {
      assert.equal(await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl }), null);
    } finally {
      console.warn = warn;
    }
    assert.equal(host.hidden, true);
    assert.equal(host.childElementCount, 0);
  });

  test('a release mixing ecosystems tags each package with its ecosystem', () => {
    const mixed = { ...APP, releases: [{ ...APP.releases[0], dependencies: { ...APP.releases[0].dependencies, byEcosystem: { npm: 400, gradle: 12 } } }] };
    const node = panelElement(panelModel(mixed), { appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl: async () => null });
    assert.equal(node.querySelector('tbody tr .dp-eco').textContent, 'npm');
  });

  test('panelElement without advisories has no table and green tiles', () => {
    const clean = { ...APP, releases: [{ ...APP.releases[0], advisories: [], vulnerabilities: { bySeverity: {} }, diffFrom: null }] };
    const node = panelElement(panelModel(clean), { appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl: async () => null });
    assert.equal(node.querySelector('table'), null);
    assert.equal(node.querySelectorAll('.dp-tile--good').length, 2);
  });

  test('severityTally: fixed and not affected are cleared, under investigation is not, the worst open severity colours the count', () => {
    const row = (severity, status) => ({ severity, decision: status ? { status } : null });
    const model = (bySeverity, advisories) => ({ bySeverity, advisories });
    const text = (t) => t.lines.map(e => e.textContent);
    let t = severityTally(model({ critical: 2, low: 1, unknown: 1 }, [row('critical', 'fixed'), row('critical', 'under_investigation'), row('low', null), row('weird', null)]));
    assert.deepEqual(text(t), ['2 critical · 1 cleared', '1 low · none cleared', '1 unrated · none cleared']);
    assert.equal(t.worstOpen, 'critical');
    t = severityTally(model({ critical: 1, moderate: 1 }, [row('critical', 'not_affected'), row('moderate', 'affected')]));
    assert.deepEqual(text(t), ['1 critical · 1 cleared', '1 medium · none cleared']);
    assert.equal(t.worstOpen, 'moderate');
    t = severityTally(model({ high: 1 }, [row('high', 'not_affected')]));
    assert.equal(t.worstOpen, null, 'everything cleared');
    assert.equal(severityTally(model({}, [])).lines, null);
  });

  test('usedBy: wallets shipping the package, this exact version, or only this one', () => {
    const text = (a) => { const v = usedBy(a); return typeof v === 'string' ? v : v.textContent; };
    assert.equal(text(advisory('x', 'low', { products: 25, productsSameVersion: 3 })), '25 · 3 this version');
    assert.equal(text(advisory('x', 'low', { products: 1, productsSameVersion: 1 })), 'only this wallet');
    assert.equal(usedBy(advisory('x', 'low', { products: 1 })).className, 'dp-only-here', 'flagged, not grey like a count (issue 1020 P17)');
    assert.equal(text(advisory('x', 'low')), '–', 'an export from before the field existed');
    const rows = panelElement(panelModel({ ...APP, releases: [{ ...APP.releases[0], advisories: [advisory('GHSA-1', 'high', { products: 7, productsSameVersion: 2 })] }] }), { appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl: async () => null })
      .querySelectorAll('tbody tr');
    assert.equal(rows[0].querySelector('.dp-td-products').textContent, '7 · 2 this version');
  });

  test('an advisory gone on the default branch says "Already fixed in master" under its version', () => {
    const app = { ...APP, defaultBranch: { commit: 'abcdef1234567890', analysedAt: '2026-11-06 10:00:00' }, releases: [{ ...APP.releases[0], advisories: [
      advisory('GHSA-1', 'high', { package: 'gone', inDefaultBranch: { status: 'removed' } }),
      advisory('GHSA-2', 'high', { package: 'bumped', inDefaultBranch: { status: 'updated', versions: ['1.2.0'] } }),
      advisory('GHSA-3', 'high', { package: 'still' }),
    ] }] };
    const rows = [...panelElement(panelModel(app), { appId: 'app.android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl: async () => null }).querySelectorAll('tbody tr')];
    const line = (pkg) => rows.find(r => r.dataset.package === pkg).querySelector('.dp-td-version .dp-master');
    assert.equal(line('gone').textContent, 'Already fixed in master');
    assert.match(line('gone').title, /abcdef1, checked 2026-11-06.*not in any file read there/);
    assert.match(line('bumped').title, /only at 1\.2\.0/);
    assert.equal(line('still'), null);
  });

  test('RustSec notices are listed as "Notice" but not counted as advisory matches', () => {
    const notice = advisory('RUSTSEC-2023-0089', 'informational', { ecosystem: 'cargo', package: 'atomic-polyfill', summary: 'atomic-polyfill is unmaintained' });
    const app = { ...APP, releases: [{ ...APP.releases[0], vulnerabilities: { ...APP.releases[0].vulnerabilities, bySeverity: { ...APP.releases[0].vulnerabilities.bySeverity, informational: 1 } },
      advisories: [...APP.releases[0].advisories, notice] }] };
    const model = panelModel(app);
    assert.equal(model.vulnerabilities, 13);
    assert.equal(model.notices, 1);
    const node = panelElement(model, { appId: 'app.android' });
    const tile = [...node.querySelectorAll('.dp-tile')].find(t => t.querySelector('.dp-tile__label').textContent === 'advisory matches');
    assert.equal(tile.querySelector('.dp-tile__value').textContent, '13');
    assert.match(tile.textContent, /Not counted: 1 notice of unmaintained or unsound packages/);
    assert.doesNotMatch(tile.textContent, /notice · /, 'no severity line for notices');
    assert.equal(model.advisories.at(-1).id, 'RUSTSEC-2023-0089', 'listed last');
    assert.equal(severityCell(notice).querySelector('.dp-sev').textContent, 'Notice');
  });

  test('a malicious package is a lead being checked, called out above everything else', () => {
    const app = { ...APP, releases: [{ ...APP.releases[0], vulnerabilities: { ...APP.releases[0].vulnerabilities, bySeverity: { ...APP.releases[0].vulnerabilities.bySeverity, malicious: 1 } },
      advisories: [advisory('MAL-2025-1', 'malicious', { package: 'evil', version: '6.6.6' }), ...APP.releases[0].advisories] }] };
    const node = panelElement(panelModel(app), { appId: 'app.android' });
    assert.match(node.querySelector('.dp-notices .dp-malware').textContent, /^Possible malware: evil@6\.6\.6 \(MAL-2025-1\) is listed on OSV\.dev as malicious/);
    const tile = [...node.querySelectorAll('.dp-tile')].find(t => t.querySelector('.dp-tile__label').textContent === 'possible malware');
    assert.ok(tile.classList.contains('dp-tile--bad'));
  });

  test('releaseForVersion: the version digits must agree; a beta never takes the final release', () => {
    const app = { releases: [{ ref: 'v2.0.0-beta1' }, { ref: 'android-v1.4.0' }, { ref: 'v1.3.0-android' }] };
    assert.equal(releaseForVersion(app, '1.4.0').ref, 'android-v1.4.0');
    assert.equal(releaseForVersion(app, '1.3.0').ref, 'v1.3.0-android', 'a plain version takes a tag with a suffix');
    assert.equal(releaseForVersion(app, '2.0.0-beta1').ref, 'v2.0.0-beta1');
    assert.equal(releaseForVersion(app, '1.4.0-beta2'), null);
    assert.equal(releaseForVersion(app, '1.4'), null);
    assert.equal(releaseForVersion(app, 'latest'), null);
  });

  test('releaseForVersion: with the names the checker resolved, the picked name decides, not the digits (P7, P9, P20)', () => {
    const app = { releases: [
      { ref: '3.2.2', versions: ['3.2.2-Multi', '3.2.2 - Multi'] },
      { ref: '2026-08-31T1604-v6.6.1QX', versions: ['6.6.1QX'] },
      { ref: 'android-v1.4.0', versions: ['v1.4.0'] },
    ] };
    assert.equal(releaseForVersion(app, '3.2.2-Multi').ref, '3.2.2');
    assert.equal(releaseForVersion(app, '3.2.2 - Multi').ref, '3.2.2', 'every name typed for the tag finds it');
    assert.equal(releaseForVersion(app, '6.6.1QX').ref, '2026-08-31T1604-v6.6.1QX', 'a date-prefixed tag found by its name');
    assert.equal(releaseForVersion(app, '1.4.0').ref, 'android-v1.4.0', 'a leading v is no difference, as on the version river');
    assert.equal(releaseForVersion(app, '3.2.2'), null, 'no digit guess when the export names its releases');
    assert.equal(releaseForVersion(app, '2026-08'), null);
  });

  test('the panel follows the version picked in "Every version"', async () => {
    const older = { ...APP.releases[0], ref: 'v1.3.0', commit: 'f0f0f0f0', advisories: [advisory('GHSA-old', 'low')], vulnerabilities: { total: 1, bySeverity: { low: 1 }, packages: 1 } };
    const app = { ...APP, releases: [APP.releases[0], older, { ref: 'v1.2.0', status: 'failed', error: 'no lockfile' },
      { ref: 'v1.0.0', status: 'unsupported', lockfiles: [], advisories: [], dependencies: { total: 0, direct: 0 },
        lockCoverage: { verdict: 'unknown', missing: [], missingCount: 0, unread: [{ ecosystem: 'pub', manifest: 'pubspec.yaml', lockfile: 'pubspec.lock' }], unreadCount: 1, floating: 0, downloads: [], downloadCount: 0, binaries: [], binaryCount: 0 } }] };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': app });
    const river = document.createElement('div');
    river.id = 'buildVerifications-android';
    river.dataset.selectedVersion = '1.3.0';
    for (const v of ['1.1.0', '1.3.0', '1.4.0']) {
      const stone = document.createElement('button');
      stone.className = 'bv-stone';
      stone.dataset.versionKey = v;
      river.appendChild(stone);
    }
    const host = document.createElement('div');
    document.body.append(river, host);
    const pick = (version) => river.dispatchEvent(new window.CustomEvent('buildVersionSelected', { bubbles: true, detail: { platform: 'android', version } }));

    const model = await renderDependenciesPanel({ host, appId: 'app.android', platform: 'android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.equal(model.ref, 'v1.3.0', 'the version already picked when the export arrives');
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.3\.0/);
    assert.equal(host.querySelector('tbody tr td a').textContent, 'GHSA-old');

    pick('1.4.0');
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.4\.0/);
    assert.equal(host.querySelector('tbody tr td a').textContent, 'GHSA-crit');

    pick('1.1.0');
    assert.equal(host.querySelector('tbody'), null);
    assert.equal(host.querySelector('.dp-headline').textContent, 'Version 1.1.0 has not been checked for dependencies.');
    assert.deepEqual([...host.querySelectorAll('.dp-pick-list > *')].map(r => r.textContent), ['v1.4.0', 'v1.3.0', 'v1.0.0'], 'an unsupported release with results is listed, the failed v1.2.0 is not');
    let clicked = null;
    river.addEventListener('click', (e) => { clicked = e.target.dataset.versionKey; });
    host.querySelectorAll('.dp-pick-version')[1].click();
    assert.equal(clicked, '1.3.0', 'a checked release picks its stone');

    pick('1.2.0');
    assert.equal(host.querySelector('.dp-headline').textContent, 'The dependency check of version 1.2.0 (v1.2.0) failed (no lockfile).');

    river.dispatchEvent(new window.CustomEvent('buildVersionSelected', { bubbles: true, detail: { platform: 'iphone', version: '1.4.0' } }));
    assert.match(host.querySelector('.dp-headline').textContent, /failed/, 'another platform\'s pick is ignored');

    // nothing read, but the coverage says why: the panel with its notice, not "failed" (Bull Bitcoin v6.15.0)
    pick('1.0.0');
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.0\.0/);
    assert.match(host.querySelector('.dp-coverage').textContent, /Flutter \(pubspec\.lock\)/);
    river.remove();
    host.remove();
  });

  test('before "Every version" has picked, the panel shows no release it may replace (issue 1020 P10)', async () => {
    const older = { ...APP.releases[0], ref: 'v1.3.0', commit: 'f0f0f0f0', advisories: [advisory('GHSA-old', 'low')], vulnerabilities: { total: 1, bySeverity: { low: 1 }, packages: 1 } };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': { ...APP, releases: [APP.releases[0], older] } });
    const river = document.createElement('div');
    river.id = 'buildVerifications-android';
    river.hidden = true; // not painted yet: the verifications are still loading
    const host = document.createElement('div');
    document.body.append(river, host);

    await renderDependenciesPanel({ host, appId: 'app.android', platform: 'android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.equal(host.hidden, false);
    assert.equal(host.querySelector('.dp-tiles'), null, 'no release painted yet');
    assert.doesNotMatch(host.textContent, /v1\.4\.0/, 'the newest release is not shown first');
    assert.match(host.querySelector('.dp-headline').textContent, /Loading the release picked/);
    river.dispatchEvent(new window.CustomEvent('buildVersionSelected', { bubbles: true, detail: { platform: 'android', version: '1.3.0' } }));
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.3\.0/, 'the first release painted is the picked one');
    river.remove();
    host.remove();

    // the section never picks (its load failed): the newest release after the wait
    const river2 = document.createElement('div');
    river2.id = 'buildVerifications-android';
    const host2 = document.createElement('div');
    document.body.append(river2, host2);
    await renderDependenciesPanel({ host: host2, appId: 'app.android', platform: 'android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl, pickWaitMs: 5 });
    assert.match(host2.querySelector('.dp-headline').textContent, /Loading/);
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.match(host2.querySelector('.dp-headline').textContent, /Checked release v1\.4\.0/);
    river2.remove();
    host2.remove();
  });
});

describe('dependencies panel: split verdicts (#1020 P4)', () => {
  test('says when some verifications of the picked version found it not reproducible', async () => {
    const older = { ...APP.releases[0], ref: 'v1.3.0' };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': { ...APP, releases: [APP.releases[0], older] } });
    const river = document.createElement('div');
    river.id = 'buildVerifications-android';
    river.dataset.selectedVersion = '1.3.0';
    river.dataset.selectedVerdicts = '2 1'; // Wasabi 2.8.5: reproducible for the zip, not for the msi
    const host = document.createElement('div');
    document.body.append(river, host);
    const pick = (version, verdicts) => river.dispatchEvent(new window.CustomEvent('buildVersionSelected', { bubbles: true, detail: { platform: 'android', version, verdicts } }));
    const split = () => [...host.querySelectorAll('.dp-notices li')].map(li => li.textContent).find(t => /not reproducible/.test(t)) || null;

    await renderDependenciesPanel({ host, appId: 'app.android', platform: 'android', base: '/x', triageBase: '/xt', liveEvents: noLive, fetchImpl });
    assert.equal(split(), '1 verification of version 1.3.0 found it not reproducible, and 2 found it reproducible. Its dependencies are shown because one reproducible verification is enough; each verdict is under "Every version".');
    pick('1.4.0', { reproducible: 3, notReproducible: 0 });
    assert.equal(split(), null, 'all agree: nothing said');
    pick('1.4.0', { reproducible: 3, notReproducible: 2 });
    assert.match(split(), /^2 verifications of version 1\.4\.0 found it not reproducible, and 3/, 'a later verdict on the same version repaints');
    river.remove();
    host.remove();
  });
});

describe('dependencies panel: git submodules', () => {
  const SUBS = { total: 5, errors: 0, firstParty: 1, notInApp: 2, upstream: 1, derived: 1, unknownOrigin: 0, affected: 1, advisories: 2, advisoriesUnknown: 1 };
  const ROWS = [
    { path: 'contrib/own', url: 'https://github.com/o/own.git', commit: 'a'.repeat(40), firstParty: true, scope: { status: 'assumed' }, identity: { status: 'upstream-commit' }, advisories: { status: 'none-listed', applies: [] } },
    { path: 'contrib/openssl', url: 'https://github.com/openssl/openssl.git', commit: 'b'.repeat(40), scope: { status: 'assumed' }, identity: { status: 'upstream-tag', tag: 'openssl-3.0.13' }, advisories: { status: 'affected', applies: ['CVE-1', 'CVE-2'] } },
    { path: 'contrib/openssl/krb5', url: 'https://github.com/krb5/krb5', commit: 'c'.repeat(40), scope: { status: 'test-only', why: "openssl's external test suites" }, identity: { status: 'upstream-commit' }, advisories: { status: 'affected', applies: ['CVE-3'] } },
    { path: 'contrib/fork', url: 'https://github.com/me/lib.git', upstream: 'https://github.com/up/lib.git', commit: 'd'.repeat(40), scope: { status: 'assumed' }, identity: { status: 'derived', base: 'v1.0', ahead: 3, files: ['a.c'] }, advisories: { status: 'unknown', base: 'v1.0', unknown: [{ id: 'CVE-4', hint: 'fix-patch-absent' }] } },
    { path: 'contrib/t/vendor/mp', url: 'https://github.com/x/mp', commit: 'e'.repeat(40), scope: { status: 'not-built', why: 'the build of contrib/t uses only crypto/' }, identity: { status: 'derived', base: 'v1', ahead: 1 }, advisories: { status: 'unknown', base: 'v1', unknown: [] } },
  ];
  // A C/C++ wallet: no lockfile the check reads, so the analysis is "unsupported", but its submodules were checked.
  const CPP = { schema: 1, appId: 'cpp.wallet', aliases: [], defaultBranch: null, releases: [{ kind: 'release', ref: '2.9.1', commit: 'f'.repeat(40), status: 'unsupported', advisories: [], submodules: SUBS }] };

  test('a submodule git could not read says why, not only the end of git\'s advice (issue 1020 P19)', () => {
    assert.equal(submoduleIdentityText({ error: 'and the repository exists.' }), 'Could not be checked: git could not read the repository (no access to it, or it does not exist).', 'a row stored before the fix (Keystone 3 Pro)');
    assert.equal(submoduleIdentityText({ error: 'git@github.com: Permission denied (publickey). Could not read from remote repository.' }), 'Could not be checked: git@github.com: Permission denied (publickey). Could not read from remote repository.');
  });

  test('a release with packages never says that no lockfile was found', () => {
    // Bitkey: its app type is unknown, so "unsupported", but its lockfiles were read.
    const counted = { total: 3, direct: 1, byScope: { app: 3 }, byEcosystem: { npm: 3 }, lockfiles: ['package-lock.json'] };
    const app = { ...CPP, releases: [{ ...CPP.releases[0], lockfiles: ['package-lock.json'], dependencies: counted }] };
    const node = panelElement(panelModel(app), { appId: 'cpp.wallet', base: '/x', fetchImpl: async () => null });
    assert.doesNotMatch(node.querySelector('.dp-notices')?.textContent ?? '', /No lockfile this check reads/);
  });

  test('the summary line counts what may be in the app apart from what is not', () => {
    const node = panelElement(panelModel(CPP), { appId: 'cpp.wallet', base: '/x', fetchImpl: async () => null });
    const summary = node.querySelector('.dp-submodules > summary').textContent;
    assert.match(summary, /^Libraries pinned as git submodules\. 5 libraries, 1 of them the wallet's own, 2 not in the app/);
    assert.equal(node.querySelector('.dp-tiles'), null, 'no lockfile was read: no zero tiles that read as clean');
    assert.match(node.querySelector('.dp-notices').textContent, /only its git submodules were checked/);
    assert.match(summary, /Of the 3 that may be in the app, 1 unmodified upstream copy has 2 listed advisories; 1 is a modified copy, where upstream advisories may or may not apply \(1 to check\)\./);
  });

  test('opening it loads the rows: identity, scope and advisories in words', async () => {
    const { fetchImpl, calls } = fakeFetch({ '/x/apps/cpp.wallet/2.9.1/submodules.json': { schema: 1, rows: ROWS } });
    const node = panelElement(panelModel(CPP), { appId: 'cpp.wallet', base: '/x', fetchImpl });
    const details = node.querySelector('.dp-submodules');
    details.open = true;
    details.dispatchEvent(new window.Event('toggle'));
    await new Promise(r => setTimeout(r, 0));
    assert.deepEqual(calls, ['/x/apps/cpp.wallet/2.9.1/submodules.json']);
    const rows = [...node.querySelectorAll('.dp-sub-table tbody tr')].map(tr => [...tr.querySelectorAll('td')].slice(2).map(td => td.textContent));
    assert.deepEqual(rows[0], ["The wallet's own code", 'May be', 'None listed']);
    assert.deepEqual(rows[1], ['Upstream release openssl-3.0.13, unmodified', 'May be', '2 listed: CVE-1, CVE-2']);
    assert.equal(rows[2][1], "No, tests only: openssl's external test suites");
    assert.equal(rows[3][0], 'Modified: v1.0 plus 3 commits upstream does not have (1 file changed)');
    assert.match(rows[3][2], /^Status unknown: 1 listed for v1.0.*CVE-4: fix patch applies, so likely missing$/);
    assert.equal(rows[4][1], 'No: the build of contrib/t uses only crypto/');
    assert.equal(node.querySelectorAll('.dp-sub-out').length, 2);
  });

  test('only an http(s) submodule URL becomes a link', async () => {
    const rows = [
      { ...ROWS[1], url: 'javascript:alert(1)', path: 'contrib/evil' },
      { ...ROWS[1], url: 'git@github.com:o/r.git', path: 'contrib/ssh' },
      { ...ROWS[1], url: 'https://github.com/o/r.git', path: 'contrib/web' },
    ];
    const { fetchImpl } = fakeFetch({ '/x/apps/cpp.wallet/2.9.1/submodules.json': { schema: 1, rows } });
    const node = panelElement(panelModel(CPP), { appId: 'cpp.wallet', base: '/x', fetchImpl });
    const details = node.querySelector('.dp-submodules');
    details.open = true;
    details.dispatchEvent(new window.Event('toggle'));
    await new Promise(r => setTimeout(r, 0));
    const cells = [...node.querySelectorAll('.dp-sub-table tbody tr')].map(tr => tr.querySelector('td'));
    assert.deepEqual(cells.map(td => td.querySelector('a')?.getAttribute('href') ?? null), [null, null, 'https://github.com/o/r']);
    assert.deepEqual(cells.map(td => td.firstChild.textContent), ['evil', 'ssh', 'web']);
  });

  test('a release with only submodules is not reported as unanalysed', () => {
    assert.equal(panelModel(CPP).ref, '2.9.1');
    assert.equal(panelModel({ ...CPP, releases: [{ ...CPP.releases[0], submodules: undefined }] }).submodules, null);
  });
});

describe('build-lock notices', () => {
  // the export's shape (plugins/build-lock.mjs buildLockForReaders), from one Android verification's result
  const asExport = ({ files, misnamed, modules, builtNotResolved, descriptionsOnly, resolvedNotBuilt }) => ({
    files: files.map(f => ({ platform: 'android', ...f })),
    misnamed: misnamed.map(name => ({ name, platform: 'android' })),
    platforms: modules === null ? {} : { android: { modules, builtNotResolved, descriptionsOnly, resolvedNotBuilt } },
  });
  const withLock = (buildLock) => ({ ...APP, releases: [{ ...APP.releases[0], buildLock: asExport(buildLock) }] });
  const text = (app, platform = 'android') => panelElement(panelModel(app, { platform }), { appId: 'app.android' }).querySelector('.dp-notices')?.textContent || '';
  const USED = { match: 'ok', problem: null, differ: null, schema: 2, commit: 'c0ffee', modules: 40 };
  const none = { count: 0, names: [] };

  test('a used file: how many modules, and both differences with "and N more"', () => {
    const seven = Array.from({ length: 7 }, (_, i) => `g:a${i}@1.0`);
    assert.match(text(withLock({ files: [USED], misnamed: [], modules: 40, builtNotResolved: { count: 7, names: seven }, resolvedNotBuilt: none })),
      /7 of them are not in the resolved list: g:a0@1\.0, g:a1@1\.0, g:a2@1\.0, g:a3@1\.0, g:a4@1\.0 and 2 more\./, 'five names inline');
    const t = text(withLock({ files: [USED], misnamed: [], modules: 40,
      builtNotResolved: { count: 22, names: ['androidx.core:core@1.13.1', 'com.android.tools.build:gradle@8.5.2'] },
      resolvedNotBuilt: { count: 1, names: ['androidx.appcompat:appcompat@1.7.0'] } }));
    assert.match(t, /The build downloaded 40 Gradle modules \(from the verifier's build-lock\.json\), and the ones with code were checked for advisories too\./);
    assert.match(t, /22 of them are not in the resolved list: androidx\.core:core@1\.13\.1, com\.android\.tools\.build:gradle@8\.5\.2 and 20 more\./);
    assert.match(t, /1 resolved modules were never downloaded by the build: androidx\.appcompat:appcompat@1\.7\.0\./);
  });

  test('descriptions without code: how many were not counted, with names; nothing when none, or in an older export', () => {
    const t = text(withLock({ files: [USED], misnamed: [], modules: 40, builtNotResolved: { count: 1, names: ['g:jar@1.0'] },
      descriptionsOnly: { count: 2, names: ['com.google.guava:guava@29.0-android', 'g:bom@1.0'] }, resolvedNotBuilt: none }));
    assert.match(t, /2 downloaded descriptions without code \(\.pom or \.module files only\) were not counted: com\.google\.guava:guava@29\.0-android, g:bom@1\.0\./);
    assert.doesNotMatch(text(withLock({ files: [USED], misnamed: [], modules: 40, builtNotResolved: none, descriptionsOnly: { count: 0, names: [] }, resolvedNotBuilt: none })), /descriptions/);
    assert.doesNotMatch(text(withLock({ files: [USED], misnamed: [], modules: 40, builtNotResolved: none, resolvedNotBuilt: none })), /descriptions/, 'an export from before has no such field');
  });

  test('another build, not tied, a hash mismatch and a misnamed file each say so; nothing about modules when none was used', () => {
    const t = text(withLock({ files: [
      { ...USED, match: 'another-build', differ: [{ field: 'appVersion', file: '1.2.2', event: '1.2.3' }], modules: null },
      { ...USED, match: null, problem: 'hash-mismatch', modules: null },
      { ...USED, match: null, problem: 'not-found', modules: null },
      { ...USED, match: null, problem: 'too-large', modules: null },
    ], misnamed: ['build-lock (1).json'], modules: null, builtNotResolved: none, resolvedNotBuilt: none }));
    assert.match(t, /Belongs to another build: a build-lock\.json attached to this verification is from a different build \(version 1\.2\.2 in the file, 1\.2\.3 in the verification\), so its list was not used\./);
    assert.match(t, /did not match its published hash, so it was not read\./);
    assert.match(t, /could not be downloaded from files\.nostr\.info, so it was not read\./);
    assert.match(t, /is too large to read, so it was not read\./);
    assert.match(t, /Misnamed: "build-lock \(1\)\.json" looks like the build's download list, but only a file named exactly build-lock\.json is read\./);
    assert.doesNotMatch(t, /The build downloaded/);
    assert.match(text(withLock({ files: [{ ...USED, match: 'not-tied', schema: 1, modules: null }], misnamed: [], modules: null, builtNotResolved: none, resolvedNotBuilt: none })),
      /does not say which app, version and platform it was built for, so it is not tied to this build and its list was not used\./);
  });

  test('a file from a verifier not on the list says so, and nothing about modules', () => {
    const t = text(withLock({ files: [{ verifier: 'unlisted', match: null, problem: null, differ: null, schema: null, commit: null, modules: null }],
      misnamed: [], modules: null, builtNotResolved: none, resolvedNotBuilt: none }));
    assert.match(t, /A build-lock\.json attached to this verification is from a verifier not on the list, so its list was not used\./);
    assert.doesNotMatch(t, /The build downloaded|not read/);
  });

  test('a release without a build-lock.json says nothing about one', () => {
    assert.doesNotMatch(text(APP), /build-lock|Gradle modules/);
  });

  test('each page shows only its own platform\'s build-lock.json and differences', () => {
    const app = { ...APP, releases: [{ ...APP.releases[0], buildLock: {
      files: [{ ...USED, platform: 'android' }, { ...USED, platform: 'iphone', match: 'another-build', differ: [{ field: 'appVersion', file: '1.2.2', event: '1.2.3' }], modules: null }],
      misnamed: [{ name: 'build-lock (1).json', platform: 'android' }],
      platforms: { android: { modules: 40, builtNotResolved: { count: 1, names: ['androidx.core:core@1.13.1'] }, resolvedNotBuilt: none } },
    } }] };
    const android = text(app, 'android');
    assert.match(android, /The build downloaded 40 Gradle modules/);
    assert.match(android, /Misnamed/);
    assert.doesNotMatch(android, /Belongs to another build/);
    const iphone = text(app, 'iphone');
    assert.match(iphone, /Belongs to another build/);
    assert.doesNotMatch(iphone, /Gradle modules|Misnamed/);
    assert.equal(panelModel(app, { platform: 'hardware' }).buildLock, null, 'a hardware page of the same repository sees none of it');
  });
});

describe('lock coverage notice', () => {
  const withCoverage = (lockCoverage, extra = {}) => ({ ...APP, releases: [{ ...APP.releases[0], lockCoverage, ...extra }] });
  const COVERAGE = { verdict: 'locked', missing: [], missingCount: 0, unread: [], unreadCount: 0, floating: 0, downloads: [], downloadCount: 0, binaries: [], binaryCount: 0 };
  const node = (app) => panelElement(panelModel(app), { appId: 'app.android' });
  const notice = (app) => node(app).querySelector('.dp-notices .dp-coverage');
  // the toggletip's children, as the trigger would show them
  const tipText = (c) => coverageTipLines(c).map(p => p.textContent).join('\n');

  test('a locked release, or one without the measurement, says nothing', () => {
    assert.equal(notice(withCoverage(COVERAGE)), null);
    assert.equal(notice(APP), null);
  });

  test('an unread Flutter lockfile: the gap is ours, the reader is told the count is a lower bound', () => {
    const c = { ...COVERAGE, verdict: 'unknown', unread: [{ ecosystem: 'pub', manifest: 'pubspec.yaml', lockfile: 'pubspec.lock' }], unreadCount: 1 };
    const n = notice(withCoverage(c));
    assert.match(n.textContent, /^Incomplete check: This check could read only part of this release's dependencies: the Flutter \(pubspec\.lock\) part, which this check does not read yet\. Those parts were not checked for advisories\./);
    assert.ok(n.querySelector('.dp-term'), 'the call to action is a toggletip');
    assert.match(n.textContent, /What would fix it\?/);
    const tip = tipText(c);
    assert.match(tip, /Nothing for the wallet team here: pubspec\.lock exists, but this check cannot read it yet\. That is on us\./);
    assert.match(tip, /Using this wallet\? Treat the advisory count as a lower bound until this check reads those files\./);
    assert.doesNotMatch(tip, /Send the list above/, 'nothing to send when the gap is ours');
    assert.doesNotMatch(tip, /commit the lockfile/);
    // the advisory tile cannot read as a green all-clear
    const empty = { ...withCoverage(c), releases: [{ ...withCoverage(c).releases[0], advisories: [] }] };
    const tiles = node(empty).querySelectorAll('.dp-tile');
    assert.ok(![...tiles].some(t => t.className.includes('good') && /advisory matches/.test(t.textContent)));
    assert.match(node(empty).textContent, /At least this many: part of the build was not checked/);
    // nothing was read at all (Bull Bitcoin v6.15.0): no zero tiles, and no bare status line next to the notice
    const unsupported = { ...APP, releases: [{ ...APP.releases[0], status: 'unsupported', lockfiles: [], advisories: [], dependencies: { ...APP.releases[0].dependencies, total: 0, direct: 0 }, lockCoverage: c }] };
    assert.equal(node(unsupported).querySelector('.dp-tiles'), null);
    assert.doesNotMatch(node(unsupported).textContent, /ended with status/);
    assert.ok(notice(unsupported));
    const clean = { ...withCoverage(COVERAGE), releases: [{ ...withCoverage(COVERAGE).releases[0], advisories: [] }] };
    assert.doesNotMatch(node(clean).textContent, /At least this many/);
  });

  test('an unlocked release names what the wallet team can fix, capped with a count', () => {
    const c = { ...COVERAGE, verdict: 'unlocked',
      missing: [{ ecosystem: 'npm', manifest: 'web/package.json' }], missingCount: 3,
      floating: 2, downloads: [{ file: 'Dockerfile', line: 4, target: 'https://x/sdk.zip' }], downloadCount: 1,
      binaries: ['libs/x.aar'], binaryCount: 1,
      unread: [{ ecosystem: 'c/c++', manifest: 'CMakeLists.txt', lockfile: null }], unreadCount: 1 };
    assert.match(notice(withCoverage(c)).textContent, /Part of this release's build is not pinned to exact versions, so it can pull different code without any change to its source: 3 dependency files without a lockfile, 2 version ranges, 1 download without a hash check, 1 committed binary, the C\/C\+\+ build part, which this check does not read yet\./);
    const tip = tipText(c);
    assert.match(tip, /commit the lockfile your package manager writes for web\/package\.json and 2 more\./);
    assert.match(tip, /replace version ranges/);
    assert.match(tip, /in Dockerfile:4\./);
    assert.match(tip, /with its hash: libs\/x\.aar\./);
    assert.match(tip, /C and C\+\+ have no lockfile\. Bring each library in as a git submodule/);
    assert.doesNotMatch(tip, /Nothing for the wallet team/, 'only C/C++ is unread, and that one the team can act on');
    assert.match(tip, /Using this wallet\? Send the list above to its team\./);
  });

  test('each app page shows its own build; ranges are named by file, a line downloading twice once', () => {
    // AirGap Vault v3.35.0: the whole repository reads the iPhone lockfiles; the Android app does not use them
    const all = { ...COVERAGE, verdict: 'unknown', unread: [{ ecosystem: 'cocoapods', manifest: 'ios/App/Podfile', lockfile: 'ios/App/Podfile.lock' }], unreadCount: 1 };
    const app = withCoverage(all, { lockCoverageByPlatform: { android: COVERAGE } });
    assert.equal(panelModel(app, { platform: 'android' }).lockCoverage.verdict, 'locked');
    assert.equal(panelModel(app, { platform: 'iphone' }).lockCoverage.verdict, 'unknown', 'no entry for the iPhone: it sees the whole');
    assert.equal(panelModel(app).lockCoverage.verdict, 'unknown');
    const c = { ...COVERAGE, verdict: 'unlocked', floating: 3, floatingFiles: ['app/build.gradle'],
      downloads: [{ file: 'Dockerfile', line: 16, target: 'https://a/key.pub' }], downloadCount: 2, downloadPlaceCount: 1 };
    const tip = tipText(c);
    assert.match(tip, /with exact versions in app\/build\.gradle, or add a lockfile\./);
    assert.match(tip, /in Dockerfile:16\./);
    assert.doesNotMatch(tip, /more/);
    assert.match(notice(withCoverage(c)).textContent, /2 downloads without a hash check/);
  });

  test('nothing found: unknown, not absent; a submodule-only release keeps its own notice', () => {
    assert.match(notice(withCoverage({ ...COVERAGE, verdict: 'none' })).textContent, /no dependency files in this release, so its dependencies are unknown, not absent/);
    const subsOnly = withCoverage({ ...COVERAGE, verdict: 'none' }, { submodules: { total: 1, mayBeInApp: 0 } });
    assert.equal(notice(subsOnly), null);
  });
});

describe('folded details', () => {
  const opts = { appId: 'app.android', base: '/x', fetchImpl: async () => null };

  test('under the tiles only a link shows, with the advisory count, until it is clicked', () => {
    let heard = null;
    const node = panelElement(panelModel(APP), { ...opts, onToggle: (open) => { heard = open; } });
    const link = node.querySelector('.dp-details-link');
    const body = node.querySelector('.dp-details');
    assert.equal(link.previousElementSibling.className, 'dp-tiles');
    assert.equal(link.textContent, 'See 13 Advisories and Dependency Tree');
    assert.equal(body.hidden, true);
    assert.ok(body.querySelector('.dp-tabs'));
    link.dispatchEvent(new window.Event('click'));
    assert.equal(body.hidden, false);
    assert.equal(link.textContent, 'Hide Advisories and Dependency Tree');
    assert.equal(heard, true);
  });

  test('a publish (showAll) or an earlier open paints it open', () => {
    assert.equal(panelElement(panelModel(APP), { ...opts, showAll: true }).querySelector('.dp-details').hidden, false);
    assert.equal(panelElement(panelModel(APP), { ...opts, expanded: true }).querySelector('.dp-details').hidden, false);
  });

  test('without advisories the link names only the tree', () => {
    const clean = { ...APP, releases: [{ ...APP.releases[0], advisories: [], vulnerabilities: { total: 0, bySeverity: {}, packages: 0 } }] };
    assert.equal(panelElement(panelModel(clean), opts).querySelector('.dp-details-link').textContent, 'See Dependency Tree');
  });
});

describe('dependencies per version', () => {
  const rel = (ref, total, direct, extra = {}) => ({ ...APP.releases[0], ref, dependencies: { ...APP.releases[0].dependencies, total, direct }, ...extra });
  const multi = { ...APP, releases: [rel('v1.4.0', 412, 40), rel('v1.3.0', 0, 0, { status: 'failed' }), rel('v1.2.0', 380, 38), rel('v1.1.0', 510, 51)] };

  test('the history runs oldest first, marks the shown release, and leaves out releases without a count', () => {
    assert.deepEqual(panelModel(multi, { release: 'v1.2.0' }).history, [
      { ref: 'v1.1.0', total: 510, direct: 51, current: false },
      { ref: 'v1.2.0', total: 380, direct: 38, current: true },
      { ref: 'v1.4.0', total: 412, direct: 40, current: false },
    ]);
  });

  test('the chart has a dot per release under the count, and names the first and last version', () => {
    const node = panelElement(panelModel(multi), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    const chart = node.querySelector('.dp-history');
    assert.ok(chart);
    assert.equal(chart.parentElement.querySelector('.dp-tile__label').textContent, 'dependencies');
    assert.equal(chart.querySelectorAll('.dp-history__dot').length, 3);
    assert.equal(chart.querySelectorAll('.dp-history__dot--current').length, 1);
    assert.equal(chart.querySelector('.dp-history__current').textContent, 'Currentlyselected');
    assert.equal(chart.querySelector('.dp-history__xaxis').textContent, 'v1.1.0v1.4.0');
  });

  test('the arrow keys show one version and its count', () => {
    const node = panelElement(panelModel(multi), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    const plot = node.querySelector('.dp-history__plot');
    const tip = node.querySelector('.dp-history__tip');
    plot.dispatchEvent(new window.Event('focus'));
    assert.equal(tip.textContent, 'v1.4.0: 412 dependencies (40 direct)');
    const key = new window.Event('keydown');
    key.key = 'ArrowLeft';
    plot.dispatchEvent(key);
    assert.equal(tip.textContent, 'v1.2.0: 380 dependencies (38 direct)');
  });

  test('the Direct tab draws the direct counts', () => {
    const node = panelElement(panelModel(multi), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    const [all, direct] = node.querySelectorAll('.dp-history__tab');
    assert.equal(all.getAttribute('aria-selected'), 'true');
    direct.dispatchEvent(new window.Event('click'));
    assert.equal(direct.getAttribute('aria-selected'), 'true');
    const plot = node.querySelector('.dp-history__plot');
    plot.dispatchEvent(new window.Event('focus'));
    assert.equal(node.querySelector('.dp-history__tip').textContent, 'v1.4.0: 40 direct dependencies (412 in all)');
    assert.equal(node.querySelectorAll('.dp-history__dot').length, 3);
  });

  test('one analysed release draws no chart', () => {
    assert.equal(panelElement(panelModel(APP), { appId: 'app.android', base: '/x', fetchImpl: async () => null }).querySelector('.dp-history'), null);
  });

  test('the y axis spans the counts with a little room, not from zero', () => {
    assert.deepEqual(historyScale(1686, 3028), { bottom: 1000, top: 3500, step: 500 });
    assert.deepEqual(historyScale(1152, 2126), { bottom: 1000, top: 2500, step: 500 });
    assert.deepEqual(historyScale(115, 665), { bottom: 0, top: 800, step: 200 });
    assert.deepEqual(historyScale(167, 167), { bottom: 164, top: 170, step: 2 });
  });
});

describe('dependencies panel: which app a file belongs to (issue 994)', () => {
  const release = (dependencies) => ({ ref: 'v1', status: 'ok', dependencies: { total: 3, direct: 1, byScope: { app: 3 }, byEcosystem: { npm: 3 }, lockfiles: [], ...dependencies }, advisories: [] });
  const panel = (dependencies, platform) => panelElement(panelModel({ appId: 'w', releases: [release(dependencies)] }, { platform }), { appId: 'w', base: '/x', fetchImpl: async () => null });

  test('a guess nobody checked is named as a guess, and the file still counts', () => {
    const node = panel({ unlisted: ['webapp/package-lock.json'] }, 'hardware');
    assert.match(node.querySelector('.dp-notices').textContent, /Unchecked guess: webapp\/package-lock\.json may belong to another product, judging by the name\. Nobody has checked, so it is still counted here\./);
    assert.equal(node.querySelector('.dp-notices b').textContent, 'Unchecked guess: ');
    assert.equal(node.querySelector('.dp-tile__value').textContent, '3');
    assert.equal(node.querySelector('.dp-not-in-app'), null);
  });

  test('the advisory tile does not state a folder-name guess as fact', () => {
    const row = { id: 'GHSA-1', severity: 'high', aliases: [], fixed: [], summary: '', ecosystem: 'npm', package: 'a', version: '1', part: 'web', scope: 'app', products: 1, productsSameVersion: 1 };
    const node = panelElement(panelModel({ appId: 'w', releases: [{ ...release({ unlisted: ['webapp/package-lock.json'] }), advisories: [row] }] }, { platform: 'hardware' }), { appId: 'w', base: '/x', fetchImpl: async () => null });
    assert.doesNotMatch(node.querySelector('.dp-tiles').textContent, /only in the/);
  });

  test('the file-sorting label is on the page when the wallet has rules', () => {
    const line = panel({ sorting: { status: 'reviewed', by: 'Danny', on: '2026-11-05', release: 'v1' } }, 'android').querySelector('.dp-sorting');
    assert.equal(line.textContent, "Which files count: Checked by a person A person chose at release v1 which of the repository's dependency files belong to this app.");
    assert.equal(line.querySelector('.dp-badge').textContent, 'Checked by a person');
    assert.equal(panel({ sorting: { status: 'none' } }, 'android').querySelector('.dp-sorting'), null);
    assert.equal(panel({}, 'android').querySelector('.dp-sorting'), null);
  });

  test('the "not in this app" line says it is not a check of the released app', () => {
    const c = total => ({ total, direct: 0, byScope: { app: total }, byEcosystem: { npm: total } });
    const node = panel({ byTarget: { desktop: c(1), shared: c(2) }, onlyOutside: { android: 1 } }, 'android');
    assert.equal(node.querySelector('.dp-not-in-app').textContent, 'Not in this app: desktop app, 1 library. Sorted by file path from the wallet\'s build files; not a check of the released app.');
  });

  test('the note on how to read the panel says labels are guesses and counts can be too high', () => {
    const text = panel({}, 'android').querySelector('.dp-note-text').textContent;
    assert.match(text, /not a check of the released app/);
    assert.match(text, /so the numbers can be too high/);
    assert.match(text, /are guesses from folder names/);
  });
});

describe('dependencies panel: whose statements the relays are asked for (issue 1002)', () => {
  test('triageAuthors is the trusted authors and the listed maintainers, once each', () => {
    assert.deepEqual(triageAuthors({ trusted: ['a', 'b'], maintainers: { 'npm:x': ['b', 'c'], 'npm:y': [] } }), ['a', 'b', 'c']);
    assert.deepEqual(triageAuthors({}), []);
  });

  test('the page asks for the trusted authors and maintainers from statements.json', async () => {
    const me = 'a'.repeat(64);
    const maintainer = 'b'.repeat(64);
    const asked = [];
    const liveEvents = async (opts) => { asked.push(opts); return []; };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': APP, '/xt1002/statements.json': { schema: 1, trusted: [me], maintainers: { 'npm:pkg': [maintainer] }, statements: [] } });
    await renderDependenciesPanel({ host: document.createElement('div'), appId: 'app.android', base: '/x', triageBase: '/xt1002', liveEvents, fetchImpl });
    assert.deepEqual(asked, [{ authors: [me, maintainer] }]);
  });

  test('the notice shows when statements.json fails to load, and only then', async () => {
    const liveEvents = async () => [];
    const broken = { ...fakeFetch({ '/x/apps/app.android.json': APP }) };
    const fetchImpl = async (url, opts) => (String(url).includes('statements.json') ? { ok: false, status: 503, json: async () => ({}) } : broken.fetchImpl(url, opts));
    const host = document.createElement('div');
    await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt1002-503', liveEvents, fetchImpl });
    assert.ok(host.querySelector('.dp-triage-failed'), 'HTTP 503');
    const fine = document.createElement('div');
    const ok = fakeFetch({ '/x/apps/app.android.json': APP, '/xt1002-ok/statements.json': { schema: 1, trusted: [], maintainers: {}, statements: [] } });
    await renderDependenciesPanel({ host: fine, appId: 'app.android', base: '/x', triageBase: '/xt1002-ok', liveEvents, fetchImpl: ok.fetchImpl });
    assert.ok(fine.querySelector('.dp-table'));
    assert.equal(fine.querySelector('.dp-triage-failed'), null, 'loaded, even with nobody trusted: no notice');
  });

  test('without statements.json the page still paints, and nobody is asked for', async () => {
    const asked = [];
    const liveEvents = async (opts) => { asked.push(opts); return []; };
    const host = document.createElement('div');
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': APP });
    assert.ok(await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', triageBase: '/xt1002-missing', liveEvents, fetchImpl }));
    assert.ok(host.querySelector('.dp-table'), 'the advisories still show');
    assert.deepEqual(asked, [{ authors: [] }]);
    assert.match(host.querySelector('.dp-notices .dp-triage-failed').textContent, /^Statements not loaded: .*statements\.json.*not asked/, 'and the reader is told');
    const warn = console.warn;
    const warned = [];
    console.warn = (...args) => warned.push(args.join(' '));
    try {
      assert.deepEqual(await liveTriageEvents({ authors: [] }), [], 'no query: an empty authors filter reads as no filter on some relays');
      assert.deepEqual(await liveTriageEvents(), []);
    } finally {
      console.warn = warn;
    }
    assert.equal(warned.length, 2);
    assert.match(warned[0], /not asking the relays/);
  });
});

describe('the via line', () => {
  test('a direct build row is a build tool, not imported by the wallet', () => {
    assert.equal(viaLine(advisory('CVE-1', 'high')).textContent, 'imported by the wallet');
    const host = advisory('CVE-1', 'high', { ecosystem: 'native', package: 'hostpython3', dev: true, scope: 'build', dependants: ['PyQt6', 'python3'] });
    assert.equal(viaLine(host).textContent, 'build tool of the wallet · via PyQt6, python3');
    assert.equal(viaLine(advisory('CVE-1', 'high', { dev: null, scope: 'tests' })).textContent, 'imported by the wallet', 'only build rows change');
  });
});
