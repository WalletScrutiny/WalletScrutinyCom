import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';

import { statementFields, ownStatement, publishOutcome, openTriageDialog, NO_EXTENSION_MESSAGE } from '../../src/dependencies-triage-form.mjs';
import { statementChoices, withStatement, triageTemplate, statementFromEvent, evidenceUrl } from '../../src/dependency-triage.mjs';
import { renderDependenciesPanel, publishedFlash } from '../../src/dependencies-panel.mjs';

const traverse = { id: 'GHSA-67hx-6x53-jw92', aliases: ['CVE-2023-45133'], ecosystem: 'npm', package: '@babel/traverse', version: '7.22.10', severity: 'critical', summary: 'arbitrary code execution', direct: false, dependants: ['@babel/core', '@babel/helpers'] };

const sk = generateSecretKey();
const pk = getPublicKey(sk);

// A signer and relay set standing in for the extension and the pool.
function fakeNostr({ extension = true, accepted = 3, total = 6, failures = [] } = {}) {
  const published = [];
  return {
    published,
    waitExtension: async () => extension,
    getPubkey: async () => pk,
    signEvent: async (template) => finalizeEvent(template, sk),
    publish: async (event) => { published.push(event); return { successful: accepted, total, failures, rejectedRequired: [] }; },
  };
}

const tick = () => new Promise(r => setTimeout(r, 0));
async function settled(times = 4) { for (let i = 0; i < times; i++) await tick(); }

describe('dependency triage form', () => {
  test('statementChoices lists each direct user, this wallet and the package, preferring the single direct user', () => {
    const c = statementChoices(traverse, { appId: 'it.airgap.vault' });
    assert.deepEqual(c.map(x => x.key), ['via:npm:@babel/core', 'via:npm:@babel/helpers', 'app:it.airgap.vault', 'package']);
    assert.deepEqual(c.map(x => x.preferred), [false, false, true, false], 'two direct users: start from the wallet');
    const one = statementChoices({ ...traverse, dependants: ['@babel/core'] }, { appId: 'a' });
    assert.equal(one.find(x => x.preferred).key, 'via:npm:@babel/core');
    const direct = statementChoices({ ...traverse, direct: true, dependants: [] }, { appId: 'a' });
    assert.deepEqual(direct.map(x => [x.key, x.preferred]), [['app:a', true], ['package', false]]);
    assert.match(direct[0].label, /own use/);
    const gradle = statementChoices({ ...traverse, ecosystem: 'gradle', package: 'io.netty:netty-codec', dependants: null });
    assert.deepEqual(gradle.map(x => x.key), ['package']);
  });

  test('statementFields turns the form into template fields and refuses an unreasoned "not affected"', () => {
    const [core] = statementChoices(traverse, { appId: 'a' });
    const f = statementFields(traverse, { choice: core, status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', versions: ' 7.23 and later ', evidence: 'https://github.com/babel/babel/issues/1', content: ' only compiles the project ' });
    assert.deepEqual(f, { vulns: ['GHSA-67hx-6x53-jw92', 'CVE-2023-45133'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', app: null, status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', versions: '7.23 and later', evidence: 'https://github.com/babel/babel/issues/1', content: 'only compiles the project' });
    const t = triageTemplate(f);
    assert.deepEqual(t.tags.find(x => x[0] === 'evidence'), ['evidence', 'https://github.com/babel/babel/issues/1']);
    assert.equal(statementFromEvent(finalizeEvent(t, sk)).evidence, 'https://github.com/babel/babel/issues/1');
    const app = statementChoices(traverse, { appId: 'a' })[2];
    assert.equal(statementFields(traverse, { choice: app, status: 'affected', versions: '1.0', justification: 'component_not_present' }).versions, null, 'versions only make sense for a direct user');
    assert.equal(statementFields(traverse, { choice: app, status: 'affected', justification: 'component_not_present' }).justification, null, 'a justification only goes with not_affected');
    assert.throws(() => statementFields(traverse, { choice: core, status: 'not_affected' }), /needs a justification or a reason/);
    assert.throws(() => statementFields(traverse, { choice: null, status: 'affected' }), /what the statement is about/);
    assert.throws(() => statementFields(traverse, { choice: core, status: '' }), /choose a status/);
    assert.throws(() => statementFields(traverse, { choice: core, status: 'affected', evidence: 'ftp://x' }), /http\(s\)/);
    assert.equal(evidenceUrl('javascript:alert(1)'), null);
    assert.throws(() => triageTemplate({ ...f, evidence: 'nope' }), /not an http\(s\) link/);
  });

  test('ownStatement, withStatement and publishOutcome', () => {
    const s1 = { pubkey: pk, d: 'GHSA-1|package', created_at: 1 };
    const s2 = { pubkey: pk, d: 'GHSA-1|package', created_at: 2 };
    assert.equal(ownStatement({ statements: [s1, s2] }, pk, 'GHSA-1|package'), s2);
    assert.equal(ownStatement(null, pk, 'x'), null);
    const t = withStatement(null, s1, { appId: 'a', trusted: [pk] });
    assert.deepEqual(t, { schema: 3, appId: 'a', trusted: [pk], statements: [s1] });
    assert.deepEqual(withStatement(t, s2).statements, [s1, s2]);
    assert.deepEqual(publishOutcome({ successful: 0, total: 2, failures: [{ url: 'wss://relay.nostr.info/', error: 'blocked: kind' }] }), { ok: false, text: '0 of 2 relays accepted the statement; relay.nostr.info: blocked: kind' });
    assert.equal(publishOutcome({ successful: 2, total: 2, failures: [] }).text, '2 of 2 relays accepted the statement');
  });

  test('the dialog signs with the extension, publishes, and the row shows the statement at once', async () => {
    const app = { schema: 1, appId: 'it.airgap.vault', aliases: [{ appId: 'it.airgap.vault', platform: 'android' }], releases: [{
      kind: 'release', ref: 'v3.35.0', status: 'ok', lockfiles: ['yarn.lock'],
      dependencies: { total: 3, direct: 1, byEcosystem: { npm: 3 } },
      vulnerabilities: { total: 1, bySeverity: { critical: 1 }, packages: 1 },
      advisories: [traverse],
    }] };
    const files = { '/x/apps/it.airgap.vault.json': app, '/x/triage/_trusted.json': { schema: 1, trusted: [pk] } };
    const fetchImpl = async (url) => (files[url] === undefined ? { ok: false, status: 404, json: async () => null } : { ok: true, status: 200, json: async () => files[url] });
    const nostr = fakeNostr({ failures: [{ url: 'wss://relay.nostr.info/', error: 'blocked: kind not allowed' }] });
    const host = document.createElement('div');
    document.body.appendChild(host);
    await renderDependenciesPanel({ host, appId: 'it.airgap.vault', base: '/x', fetchImpl, nostr });

    const judge = host.querySelector('.dp-judge');
    assert.equal(judge.textContent, 'Add statement');
    judge.click();
    await settled();
    const dialog = document.querySelector('dialog.dp-dialog');
    assert.ok(dialog, 'the dialog is on the page');
    assert.equal(dialog.querySelector('.dp-dialog__title').textContent, 'Statement on GHSA-67hx-6x53-jw92');
    assert.deepEqual([...dialog.querySelectorAll('input[name="subject"]')].map(i => i.value), ['via:npm:@babel/core', 'via:npm:@babel/helpers', 'app:it.airgap.vault', 'package']);
    assert.equal(dialog.querySelector('input[name="subject"][value="app:it.airgap.vault"]').hasAttribute('checked'), true);
    assert.match(dialog.querySelector('.dp-form__signer').textContent, /^Signing as npub1.*settle rows on this site\.$/);
    assert.equal(dialog.querySelector('.dp-form__publish').disabled, false);

    // a statement about how @babel/core uses the package, not affected, with evidence
    dialog.querySelector('input[name="subject"][value="app:it.airgap.vault"]').removeAttribute('checked');
    const core = dialog.querySelector('input[name="subject"][value="via:npm:@babel/core"]');
    core.checked = true;
    core.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(dialog.querySelector('input[name="versions"]').closest('label').hidden, false, 'versions field appears for a direct user');
    const notAffected = dialog.querySelector('input[name="status"][value="not_affected"]');
    notAffected.checked = true;
    notAffected.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(dialog.querySelector('select[name="justification"]').closest('label').hidden, false);
    dialog.querySelector('select[name="justification"] option[value="vulnerable_code_not_in_execute_path"]').setAttribute('selected', '');
    dialog.querySelector('input[name="evidence"]').value = 'https://github.com/babel/babel/pull/16033';
    dialog.querySelector('textarea[name="content"]').value = 'babel/core only compiles the project\'s own sources';

    dialog.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await settled(8);

    assert.equal(nostr.published.length, 1, 'one signed event went to the relays');
    const event = nostr.published[0];
    assert.equal(event.pubkey, pk);
    assert.deepEqual(event.tags.filter(t => ['d', 'status', 'justification', 'evidence', 'via'].includes(t[0])), [
      ['d', 'GHSA-67hx-6x53-jw92|via:npm:@babel/core'], ['via', 'npm:@babel/core'], ['status', 'not_affected'], ['justification', 'vulnerable_code_not_in_execute_path'], ['evidence', 'https://github.com/babel/babel/pull/16033'],
    ]);
    assert.equal(document.querySelector('dialog.dp-dialog'), null, 'the dialog closed');
    assert.equal(host.querySelector('.dp-flash').textContent, 'Your statement on GHSA-67hx-6x53-jw92 is published (3 of 6 relays accepted it): this page shows it now, every wallet page after the next site build.');
    const freshRow = host.querySelector('tr.dp-row--fresh');
    assert.equal(freshRow.dataset.advisory, 'GHSA-67hx-6x53-jw92', 'the judged row is marked');
    assert.equal(host.querySelector('.dp-decision__fresh').textContent, ' just published');
    assert.equal(host.querySelector('.dp-more'), null, 'every row is shown after a publish');
    const decision = host.querySelector('.dp-td-decision');
    assert.equal(decision.querySelector('.dp-decision').textContent, 'Not assessed', 'one of two direct users judged: still open');
    assert.equal(decision.querySelector('.dp-decision__why').textContent, '1 of 2 direct users assessed');
    const line = decision.querySelectorAll('.dp-decision__why')[1];
    assert.match(line.textContent, /^via @babel\/core: vulnerable code never executed \(not affected, [0-9a-f]{8}…\) just published$/);
    assert.equal(line.querySelector('a').getAttribute('href'), 'https://github.com/babel/babel/pull/16033');
    assert.equal(host.querySelector('.dp-judge').textContent, 'Add statement');

    // judging again on the same subject prefills the earlier statement
    host.querySelector('.dp-judge').click();
    await settled();
    const again = document.querySelector('dialog.dp-dialog');
    const coreAgain = again.querySelector('input[name="subject"][value="via:npm:@babel/core"]');
    coreAgain.checked = true;
    coreAgain.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(again.querySelector('textarea[name="content"]').value, 'babel/core only compiles the project\'s own sources');
    assert.equal(again.querySelector('.dp-form__publish').textContent, 'Update statement');
    again.querySelector('.dp-dialog__close').click();
    assert.equal(document.querySelector('dialog.dp-dialog'), null);
  });

  test('a community statement published from the page can be read on the row, unfolded', async () => {
    const app = { schema: 1, appId: 'it.airgap.vault', releases: [{
      kind: 'release', ref: 'v3.35.0', status: 'ok', lockfiles: ['yarn.lock'],
      dependencies: { total: 3, direct: 1, byEcosystem: { npm: 3 } },
      vulnerabilities: { total: 1, bySeverity: { critical: 1 }, packages: 1 },
      advisories: [traverse],
    }] };
    // its own base: the trusted list is cached per base, and '/x' trusts the signer
    const files = { '/y/apps/it.airgap.vault.json': app, '/y/triage/_trusted.json': { schema: 1, trusted: ['f'.repeat(64)] } };
    const fetchImpl = async (url) => (files[url] === undefined ? { ok: false, status: 404, json: async () => null } : { ok: true, status: 200, json: async () => files[url] });
    const host = document.createElement('div');
    document.body.appendChild(host);
    await renderDependenciesPanel({ host, appId: 'it.airgap.vault', base: '/y', fetchImpl, nostr: fakeNostr() });

    host.querySelector('.dp-judge').click();
    await settled();
    const dialog = document.querySelector('dialog.dp-dialog');
    dialog.querySelector('input[name="subject"][value="app:it.airgap.vault"]').removeAttribute('checked');
    const pkg = dialog.querySelector('input[name="subject"][value="package"]');
    pkg.checked = true;
    pkg.dispatchEvent(new window.Event('change', { bubbles: true }));
    dialog.querySelector('input[name="status"][value="under_investigation"]').checked = true;
    dialog.querySelector('textarea[name="content"]').value = 'Testing the button';
    dialog.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await settled(8);

    const decision = host.querySelector('tr.dp-row--fresh .dp-td-decision');
    assert.ok(decision, 'the row is marked even though the statement settles nothing');
    assert.equal(decision.querySelector('.dp-decision').textContent, 'Not assessed');
    const folded = decision.querySelector('details.dp-decision__community');
    assert.equal(folded.querySelector('summary').textContent, '1 community statement');
    assert.equal(folded.hasAttribute('open'), true, 'the statement just published is shown without a click');
    assert.match(folded.querySelector('.dp-decision__why').textContent, /^the package: Testing the button \(investigating, [0-9a-f]{8}…\) just published$/);
    host.remove();
  });

  test('without an extension the dialog says so and cannot publish; a rejected publish stays open with the reason', async () => {
    const none = openTriageDialog({ advisory: traverse, appId: 'a', nostr: fakeNostr({ extension: false }) });
    await settled();
    assert.equal(none.querySelector('.dp-form__signer').textContent, NO_EXTENSION_MESSAGE);
    assert.equal(none.querySelector('.dp-form__publish').disabled, true);
    none.remove();

    const rejected = fakeNostr({ accepted: 0, total: 1, failures: [{ url: 'wss://relay.nostr.info/', error: 'blocked' }] });
    const dialog = openTriageDialog({ advisory: traverse, appId: 'a', nostr: rejected, trusted: ['f'.repeat(64)] });
    await settled();
    assert.match(dialog.querySelector('.dp-form__signer').textContent, /community statement/);
    dialog.querySelector('input[name="status"][value="affected"]').checked = true;
    dialog.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await settled(8);
    assert.ok(document.body.contains(dialog), 'stays open');
    assert.equal(dialog.querySelector('.dp-form__error').textContent, 'No relay accepted the statement: 0 of 1 relays accepted the statement; relay.nostr.info: blocked');
    assert.equal(dialog.querySelector('.dp-form__publish').disabled, false);
    dialog.remove();

    // a missing status is caught before the extension is asked
    const early = fakeNostr();
    const d2 = openTriageDialog({ advisory: traverse, appId: 'a', nostr: early });
    await settled();
    d2.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await settled();
    assert.equal(d2.querySelector('.dp-form__error').textContent, 'choose a status');
    assert.equal(early.published.length, 0);
    d2.remove();
    assert.match(publishedFlash({ vulns: ['GHSA-1'] }, { successful: 1, total: 2, trusted: false }), /counted as a community statement here/);
  });
});
