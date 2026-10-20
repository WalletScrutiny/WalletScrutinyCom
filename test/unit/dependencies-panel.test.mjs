import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { loadApp, renderDependenciesPanel, panelElement, usedBy, severityTally } from '../../src/dependencies-panel.mjs';
import { panelModel } from '../../src/dependencies-panel-model.mjs';
import { nip19 } from 'nostr-tools';

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
    const app = await loadApp('app.ios', { base: '/x', fetchImpl });
    assert.equal(app.appId, 'app.android');
    assert.deepEqual(calls, ['/x/apps/app.ios.json', '/x/apps/app.android.json']);
    assert.equal(await loadApp('app.none', { base: '/x', fetchImpl }), null);
  });

  test('renderDependenciesPanel paints tiles, worst rows, notes and keeps the host hidden without data', async () => {
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': APP });
    const step = document.createElement('div');
    step.className = 'step dependencies-step';
    step.hidden = true;
    const host = document.createElement('div');
    host.hidden = true;
    step.appendChild(host);
    document.body.appendChild(step);

    const model = await renderDependenciesPanel({ host, appId: 'app.android', storeVersion: '1.4.2', base: '/x', fetchImpl });
    assert.equal(model.ref, 'v1.4.0');
    assert.equal(host.hidden, false);
    assert.equal(step.hidden, false);
    const values = [...host.querySelectorAll('.dp-tile__value')].map(e => e.textContent);
    assert.deepEqual(values, ['412', '13', '0'], 'direct and transitive share one tile');
    assert.equal(host.querySelector('.dp-tile .dp-tile__sub').textContent, '40 direct · 372 transitive');
    assert.match(host.querySelector('.dp-notices').textContent, /14 of the 412 packages could not be checked for advisories \(14 version range, not an exact version\); that is not the same as "no problems"\./);
    assert.deepEqual([...host.querySelectorAll('.dp-tally')].map(e => e.textContent), ['1 critical · none cleared', '2 high · none cleared', '10 medium · none cleared'], 'one line per severity');
    assert.ok(host.querySelector('.dp-tile--sev-critical'), 'the count takes the worst open severity\'s colour');
    assert.equal(host.querySelector('.dp-tile__sub--where'), null, 'no app/build-tooling split in the tile');
    assert.equal(host.querySelectorAll('tbody tr').length, 10);
    assert.equal(host.querySelector('tbody tr td a').textContent, 'GHSA-crit');
    assert.equal(host.querySelector('tbody tr td a').getAttribute('href'), 'https://osv.dev/vulnerability/GHSA-crit');
    assert.equal(host.querySelector('.dp-more').textContent, 'Show all 13 advisories');
    assert.deepEqual([...host.querySelectorAll('thead th')].map(e => e.textContent), ['Package', 'Version', 'Advisory', 'Severity', 'Where?', 'Used by', 'Decision']);
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
    assert.match(notices[0], /store version 1\.4\.2 has not been checked yet/);
    assert.match(notices[1], /Same source repository as app\.ios/);
    assert.match(host.querySelector('.dp-note').textContent, /Since v1\.3\.0: 12 packages added, 3 removed, 40 updated, and 1 changed content at the same version \(npm:left-pad\)/);
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.4\.0 \(source tag, commit a1b2c3d\) · Store version 1\.4\.2 · Checked on 2026-10-01/);
    assert.deepEqual([...host.querySelectorAll('.dp-where')].slice(0, 4).map(e => e.textContent), ['app', 'build', 'tests', '?']);

    const empty = document.createElement('div');
    empty.hidden = true;
    assert.equal(await renderDependenciesPanel({ host: empty, appId: 'app.none', base: '/x', fetchImpl }), null);
    assert.equal(empty.hidden, true);
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
    const { fetchImpl, calls } = fakeFetch({ '/x/apps/app.ios.json': { schema: 1, appId: 'app.android', alias: true }, '/x/apps/app.android.json': app, '/x/triage/app.android.json': triage, '/x/upstream/app.android.json': upstream, '/x/apk/app.android.json': apk });
    const host = document.createElement('div');
    const model = await renderDependenciesPanel({ host, appId: 'app.ios', base: '/x', fetchImpl, profiles: async () => new Map([[me, { name: 'Alice' }]]) });
    await new Promise(r => setTimeout(r, 0)); // signer names arrive after the paint
    assert.deepEqual(calls.slice(2), ['/x/triage/app.ios.json', '/x/triage/app.android.json', '/x/signals.json', '/x/upstream/app.android.json', '/x/apk/app.android.json'], 'the page\'s id first, then the analysis id, then the signals, the harvested ignore files and the APK check');
    assert.deepEqual(model.triage, { total: 13, decided: 2, undecided: 11, affected: 1, not_affected: 1, fixed: 0, under_investigation: 0, partial: 1, others: 2 });
    assert.deepEqual([...host.querySelectorAll('.dp-tally')].map(e => e.textContent), ['1 critical · 1 cleared', '2 high · none cleared', '10 medium · none cleared'], 'the not-affected critical is cleared; the affected high is not');
    assert.ok(host.querySelector('.dp-tile--sev-high'), 'with the only critical cleared, the count goes orange');
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
    assert.equal(host.querySelector('.dp-trusted').textContent, 'Statements settle rows on this site when signed by Alice. Anyone else\'s are shown under "What others say".');
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

  test('signals paint "exploited in the wild" and EPSS under the severity and reorder within a severity', async () => {
    const signals = { schema: 1, date: '2026-10-16', epss: { 'CVE-A': [0.0052, 0.43], 'CVE-B': [0.3, 0.99] }, kev: { 'CVE-B': { added: '2024-01-01' } }, published: { 'GHSA-test': '2022-04-25' } };
    const app = { ...APP, releases: [{ ...APP.releases[0], advisories: APP.releases[0].advisories.map(a => (
      a.id === 'GHSA-high' ? { ...a, aliases: ['CVE-A'] } : a.id === 'GHSA-test' ? { ...a, aliases: ['CVE-B'] } : a)) }] };
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': app, '/x/signals.json': signals });
    const host = document.createElement('div');
    const model = await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', fetchImpl });
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
      assert.equal(await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', fetchImpl }), null);
    } finally {
      console.warn = warn;
    }
    assert.equal(host.hidden, true);
    assert.equal(host.childElementCount, 0);
  });

  test('a release mixing ecosystems tags each package with its ecosystem', () => {
    const mixed = { ...APP, releases: [{ ...APP.releases[0], dependencies: { ...APP.releases[0].dependencies, byEcosystem: { npm: 400, gradle: 12 } } }] };
    const node = panelElement(panelModel(mixed), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    assert.equal(node.querySelector('tbody tr .dp-eco').textContent, 'npm');
  });

  test('panelElement without advisories has no table and green tiles', () => {
    const clean = { ...APP, releases: [{ ...APP.releases[0], advisories: [], vulnerabilities: { bySeverity: {} }, diffFrom: null }] };
    const node = panelElement(panelModel(clean), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
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
    assert.equal(text(advisory('x', 'low')), '–', 'an export from before the field existed');
    const rows = panelElement(panelModel({ ...APP, releases: [{ ...APP.releases[0], advisories: [advisory('GHSA-1', 'high', { products: 7, productsSameVersion: 2 })] }] }), { appId: 'app.android', base: '/x', fetchImpl: async () => null })
      .querySelectorAll('tbody tr');
    assert.equal(rows[0].querySelector('.dp-td-products').textContent, '7 · 2 this version');
  });
});
