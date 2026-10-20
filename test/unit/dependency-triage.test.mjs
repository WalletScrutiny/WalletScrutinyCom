import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { finalizeEvent, generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';

import {
  triageTemplate, triageSubject, statementFromEvent, newestStatements, resolveRow, applyTriage,
  dependencyTriageKind, TRIAGE_STATUSES,
} from '../../src/dependency-triage.mjs';
import { buildTriage, acceptEvents, trustedAuthors } from '../../scripts/build-dependency-triage.mjs';

const sk = generateSecretKey();
const pk = getPublicKey(sk);
const other = generateSecretKey();
const signed = (fields, key = sk, created_at = 1_700_000_000) => finalizeEvent(triageTemplate({ ...fields, created_at }), key);
const stmt = (fields, key = sk, created_at = 1_700_000_000) => statementFromEvent(signed(fields, key, created_at));

const traverse = { id: 'GHSA-67hx-6x53-jw92', aliases: ['CVE-2023-45133'], ecosystem: 'npm', package: '@babel/traverse', version: '7.22.10', severity: 'critical', direct: false, dependants: ['@babel/core', '@babel/helpers'] };

describe('dependency triage statements', () => {
  test('triageTemplate builds the addressable event and refuses bad input', () => {
    const t = triageTemplate({ vulns: ['GHSA-67hx-6x53-jw92', 'CVE-2023-45133'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', content: 'only compiles the project\'s own sources', created_at: 1 });
    assert.equal(t.kind, dependencyTriageKind);
    assert.deepEqual(t.tags, [
      ['d', 'GHSA-67hx-6x53-jw92|via:npm:@babel/core'], ['vuln', 'GHSA-67hx-6x53-jw92'], ['vuln', 'CVE-2023-45133'], ['package', 'npm:@babel/traverse'],
      ['via', 'npm:@babel/core'], ['status', 'not_affected'], ['justification', 'vulnerable_code_not_in_execute_path'], ['client', 'WalletScrutiny.com'], ['c', 'walletscrutiny'],
    ]);
    assert.equal(triageSubject({ vuln: 'GHSA-1', app: 'it.airgap.vault' }), 'GHSA-1|app:it.airgap.vault');
    assert.equal(triageSubject({ vuln: 'GHSA-1' }), 'GHSA-1|package');
    assert.throws(() => triageTemplate({ vulns: [], pkg: 'npm:x', status: 'fixed' }), /at least one advisory/);
    assert.throws(() => triageTemplate({ vulns: ['nope'], pkg: 'npm:x', status: 'fixed' }), /not an advisory id/);
    assert.throws(() => triageTemplate({ vulns: ['GHSA-1'], pkg: 'x', status: 'fixed' }), /not a package reference/);
    assert.throws(() => triageTemplate({ vulns: ['GHSA-1'], pkg: 'npm:x', via: 'npm:a', app: 'b', status: 'fixed' }), /via or app, not both/);
    assert.throws(() => triageTemplate({ vulns: ['GHSA-1'], pkg: 'npm:x', status: 'maybe' }), /status "maybe"/);
    assert.throws(() => triageTemplate({ vulns: ['GHSA-1'], pkg: 'npm:x', status: 'not_affected', justification: 'because' }), /justification "because"/);
    assert.deepEqual(TRIAGE_STATUSES, ['affected', 'not_affected', 'fixed', 'under_investigation']);
  });

  test('statementFromEvent reads a signed event back and drops malformed ones', () => {
    const s = stmt({ vulns: ['GHSA-1', 'CVE-2020-1'], pkg: 'npm:blib', via: 'npm:alib', status: 'affected', versions: '< 2', evidence: null, content: 'why' });
    assert.deepEqual({ ...s, id: undefined }, { id: undefined, pubkey: pk, created_at: 1_700_000_000, d: 'GHSA-1|via:npm:alib', vulns: ['GHSA-1', 'CVE-2020-1'], package: 'npm:blib', via: 'npm:alib', app: null, status: 'affected', justification: null, versions: '< 2', evidence: null, content: 'why' });
    const e = signed({ vulns: ['GHSA-1'], pkg: 'npm:blib', status: 'fixed' });
    assert.equal(statementFromEvent({ ...e, kind: 1 }), null, 'wrong kind');
    assert.equal(statementFromEvent({ ...e, tags: e.tags.filter(t => t[0] !== 'vuln') }), null, 'no advisory');
    assert.equal(statementFromEvent({ ...e, tags: e.tags.map(t => (t[0] === 'status' ? ['status', 'maybe'] : t)) }), null, 'bad status');
    assert.equal(statementFromEvent({ ...e, tags: [...e.tags, ['via', 'npm:a'], ['app', 'b']] }), null, 'via and app');
    assert.equal(statementFromEvent({ ...e, tags: e.tags.map(t => (t[0] === 'justification' ? t : t)).concat([['justification', 'because']]) }).justification, null, 'unknown label is dropped, not fatal');
  });

  test('newestStatements keeps one per author and subject', () => {
    const old = stmt({ vulns: ['GHSA-1'], pkg: 'npm:b', via: 'npm:a', status: 'under_investigation' }, sk, 100);
    const newer = stmt({ vulns: ['GHSA-1'], pkg: 'npm:b', via: 'npm:a', status: 'not_affected' }, sk, 200);
    const theirs = stmt({ vulns: ['GHSA-1'], pkg: 'npm:b', via: 'npm:a', status: 'affected' }, other, 50);
    const kept = newestStatements([old, newer, theirs, null]);
    assert.deepEqual(kept.map(s => [s.pubkey === pk ? 'me' : 'them', s.status]).sort(), [['me', 'not_affected'], ['them', 'affected']]);
  });

  test('resolveRow: a row is settled when every direct user is judged, the wallet itself counting as one', () => {
    const trusted = new Set([pk]);
    const core = stmt({ vulns: ['CVE-2023-45133'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path' });
    const helpers = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/helpers', status: 'under_investigation' });
    let r = resolveRow(traverse, [core], { appIds: ['it.airgap.vault'], trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.needs, ['via:npm:@babel/core', 'via:npm:@babel/helpers']);
    assert.deepEqual(r.covered, ['via:npm:@babel/core'], 'an alias matches');
    assert.equal(r.partial.length, 1);

    r = resolveRow(traverse, [core, helpers], { appIds: ['it.airgap.vault'], trusted });
    assert.equal(r.decision.status, 'under_investigation', 'the gravest call among the direct users');
    assert.deepEqual(r.decision.basis.map(b => b.need), ['via:npm:@babel/core', 'via:npm:@babel/helpers']);

    // the wallet imports the package itself: its own `app` statement or a package-wide one is needed too
    const direct = { ...traverse, direct: true };
    r = resolveRow(direct, [core, helpers], { appIds: ['it.airgap.vault'], trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.needs, ['app:it.airgap.vault', 'via:npm:@babel/core', 'via:npm:@babel/helpers']);
    const own = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', app: 'it.airgap.vault', status: 'affected', content: 'we feed it user input' });
    r = resolveRow(direct, [core, helpers, own], { appIds: ['it.airgap.vault'], trusted });
    assert.equal(r.decision.status, 'affected', 'the wallet\'s own statement settles the row outright');
    assert.deepEqual(r.decision.basis.map(b => b.need), ['app:it.airgap.vault']);

    // a package-wide statement answers any direct user that has none
    const wide = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', status: 'not_affected', content: 'needs attacker-written source' });
    r = resolveRow(traverse, [wide], { appIds: ['it.airgap.vault'], trusted });
    assert.equal(r.decision.status, 'not_affected');
    r = resolveRow({ ...traverse, dependants: null }, [wide], { appIds: ['x'], trusted });
    assert.deepEqual(r.needs, ['package'], 'no graph (gradle): only a package-wide or app statement can answer');
    assert.equal(r.decision.status, 'not_affected');

    // statements about another package with the same advisory id do not apply; untrusted authors are counted, not applied
    const otherPkg = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:something-else', status: 'not_affected' });
    const community = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected' }, other);
    r = resolveRow(traverse, [otherPkg, community, helpers], { appIds: ['it.airgap.vault'], trusted });
    assert.equal(r.decision, null);
    assert.equal(r.community.length, 1);
  });

  test('applyTriage counts the queue', () => {
    const triage = { trusted: [pk], statements: [
      stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected' }),
      stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/helpers', status: 'not_affected' }),
      stmt({ vulns: ['GHSA-x'], pkg: 'npm:x', via: 'npm:a', status: 'affected' }),
      stmt({ vulns: ['GHSA-z'], pkg: 'npm:z', status: 'fixed' }, other),
    ] };
    const { advisories, summary } = applyTriage([
      traverse,
      { id: 'GHSA-x', ecosystem: 'npm', package: 'x', dependants: ['a', 'b'] },
      { id: 'GHSA-z', ecosystem: 'npm', package: 'z', dependants: [] },
    ], triage, { appIds: ['app'] });
    assert.deepEqual(summary, { total: 3, decided: 1, undecided: 2, affected: 0, not_affected: 1, fixed: 0, under_investigation: 0, partial: 1, community: 1 });
    assert.deepEqual(advisories.map(a => a.decision?.status || null), ['not_affected', null, null]);
    assert.deepEqual(advisories[1].triage, { needs: ['via:npm:a', 'via:npm:b'], covered: ['via:npm:a'], community: 0, communityStatements: [], partial: advisories[1].triage.partial });
    assert.deepEqual(advisories[2].triage.communityStatements.map(s => s.status), ['fixed'], 'the community statement itself is kept for display');
    assert.deepEqual(applyTriage([traverse], null).summary, { total: 1, decided: 0, undecided: 1, affected: 0, not_affected: 0, fixed: 0, under_investigation: 0, partial: 0, community: 0 });
  });

  test('buildTriage merges snapshot and relay events, publishes per wallet, keeps the snapshot current', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'triage-'));
    try {
      const exportDir = join(tmp, 'export');
      mkdirSync(join(exportDir, 'apps'), { recursive: true });
      writeFileSync(join(exportDir, 'apps', 'it.airgap.vault.json'), JSON.stringify({ appId: 'it.airgap.vault', aliases: [], releases: [{ advisories: [traverse] }] }));
      writeFileSync(join(exportDir, 'apps', 'other.app.json'), JSON.stringify({ appId: 'other.app', aliases: [], releases: [{ advisories: [{ id: 'GHSA-q', aliases: [] }] }] }));
      writeFileSync(join(exportDir, 'apps', 'alias.json'), JSON.stringify({ appId: 'it.airgap.vault', alias: true }));
      const snapshotFile = join(tmp, 'events.json');
      const trustedFile = join(tmp, 'trusted.yml');
      writeFileSync(trustedFile, `trustedAuthors:\n  - ${nip19.npubEncode(pk)} # me\n`);
      const old = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'under_investigation' }, sk, 100);
      writeFileSync(snapshotFile, JSON.stringify([old, { ...old, id: 'f'.repeat(64) }]));
      const newer = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected' }, sk, 200);
      const unrelated = signed({ vulns: ['GHSA-nobody'], pkg: 'npm:n', status: 'fixed' }, other, 300);
      // a JSON round trip, as from a relay or the file: nostr-tools marks objects it verified, a spread would carry the mark
      const broken = JSON.parse(JSON.stringify({ ...newer, sig: '0'.repeat(128) }));

      const r = buildTriage({ events: [newer, unrelated, broken], snapshotFile, trustedFile, exportDir });
      assert.deepEqual(r, { statements: 2, trusted: 1, rejected: 2, apps: 1, published: 1, snapshotChanged: true });
      const out = JSON.parse(readFileSync(join(exportDir, 'triage', 'it.airgap.vault.json'), 'utf8'));
      assert.deepEqual(out.trusted, [pk]);
      assert.equal(out.statements.length, 1);
      assert.equal(out.statements[0].status, 'not_affected', 'the newer version of the same subject wins');
      assert.equal(existsSync(join(exportDir, 'triage', 'other.app.json')), false, 'a wallet nobody said anything about gets no file');
      const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));
      assert.deepEqual(snapshot.map(e => e.id).sort(), [newer.id, unrelated.id].sort(), 'superseded and forged events leave the snapshot');

      // a second run with nothing new changes nothing
      rmSync(join(exportDir, 'triage'), { recursive: true });
      assert.equal(buildTriage({ events: [], snapshotFile, trustedFile, exportDir }).snapshotChanged, false);
      assert.deepEqual(acceptEvents([newer, broken]).accepted.map(x => x.event.id), [newer.id]);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('the committed trusted list and snapshot are valid', () => {
    const trusted = trustedAuthors();
    assert.ok(trusted.length >= 3);
    assert.ok(trusted.every(h => /^[0-9a-f]{64}$/.test(h)));
    const snapshotFile = '_data/dependencyTriageEvents.json';
    if (existsSync(snapshotFile)) {
      const events = JSON.parse(readFileSync(snapshotFile, 'utf8'));
      assert.equal(acceptEvents(events).rejected, 0, 'every committed event is a signed, well-formed statement');
    }
  });
});
