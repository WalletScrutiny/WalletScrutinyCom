import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { finalizeEvent, generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';

import {
  triageTemplate, triageSubject, statementFromEvent, newestStatements, resolveRow, applyTriage, statementScope,
  dependencyTriageKind, TRIAGE_STATUSES, statementBasis, versionChanges,
} from '../../src/dependency-triage.mjs';
import { mergeLiveTriage, triageForApp } from '../../src/dependency-triage.mjs';
import { buildTriage, acceptEvents, acceptDeletions, trustedAuthors, listedMaintainers, capOutsiders, insiders } from '../../scripts/build-dependency-triage.mjs';

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
    assert.equal(triageSubject({ vuln: 'GHSA-1', via: 'npm:a', app: 'it.airgap.vault' }), 'GHSA-1|via:npm:a|app:it.airgap.vault', 'a direct user, judged for one wallet');
    assert.equal(triageSubject({ vuln: 'GHSA-1' }), 'GHSA-1|package');
    assert.throws(() => triageTemplate({ vulns: [], pkg: 'npm:x', status: 'fixed' }), /at least one advisory/);
    assert.throws(() => triageTemplate({ vulns: ['nope'], pkg: 'npm:x', status: 'fixed' }), /not an advisory id/);
    assert.throws(() => triageTemplate({ vulns: ['GHSA-1'], pkg: 'x', status: 'fixed' }), /not a package reference/);
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
    assert.deepEqual((({ via, app }) => ({ via, app }))(statementFromEvent({ ...e, tags: [...e.tags, ['via', 'npm:a'], ['app', 'b']] })), { via: 'npm:a', app: 'b' }, 'via and app: a direct user in one wallet');
    assert.equal(statementFromEvent({ ...e, tags: e.tags.map(t => (t[0] === 'justification' ? t : t)).concat([['justification', 'because']]) }).justification, null, 'unknown label is dropped, not fatal');
  });

  test('newestStatements keeps one per author and subject', () => {
    const old = stmt({ vulns: ['GHSA-1'], pkg: 'npm:b', via: 'npm:a', status: 'under_investigation' }, sk, 100);
    const newer = stmt({ vulns: ['GHSA-1'], pkg: 'npm:b', via: 'npm:a', status: 'not_affected' }, sk, 200);
    const theirs = stmt({ vulns: ['GHSA-1'], pkg: 'npm:b', via: 'npm:a', status: 'affected' }, other, 50);
    const kept = newestStatements([old, newer, theirs, null]);
    assert.deepEqual(kept.map(s => [s.pubkey === pk ? 'me' : 'them', s.status]).sort(), [['me', 'not_affected'], ['them', 'affected']]);
  });

  test('resolveRow: a row is settled when every direct user is judged for this wallet, the wallet itself counting as one', () => {
    const trusted = new Set([pk]);
    const appIds = ['it.airgap.vault'];
    const core = stmt({ vulns: ['CVE-2023-45133'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', app: 'it.airgap.vault', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path' });
    const helpers = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/helpers', app: 'it.airgap.vault', status: 'under_investigation' });
    let r = resolveRow(traverse, [core], { appIds, trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.needs, ['via:npm:@babel/core', 'via:npm:@babel/helpers']);
    assert.deepEqual(r.covered, ['via:npm:@babel/core'], 'an alias matches');
    assert.equal(r.partial.length, 1);

    r = resolveRow(traverse, [core, helpers], { appIds, trusted });
    assert.equal(r.decision.status, 'under_investigation', 'the gravest call among the direct users');
    assert.deepEqual(r.decision.basis.map(b => b.need), ['via:npm:@babel/core', 'via:npm:@babel/helpers']);

    // the wallet imports the package itself: its own `app` statement or a package-wide one is needed too
    const direct = { ...traverse, direct: true };
    r = resolveRow(direct, [core, helpers], { appIds, trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.needs, ['app:it.airgap.vault', 'via:npm:@babel/core', 'via:npm:@babel/helpers']);
    const own = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', app: 'it.airgap.vault', status: 'affected', content: 'we feed it user input' });
    r = resolveRow(direct, [core, helpers, own], { appIds, trusted });
    assert.equal(r.decision.status, 'affected', 'the wallet\'s own statement settles the row outright');
    assert.deepEqual(r.decision.basis.map(b => b.need), ['app:it.airgap.vault']);

    // a package-wide statement answers any direct user that has none, when the package's maintainer signed it
    const wide = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', status: 'not_affected', content: 'needs attacker-written source' });
    r = resolveRow(traverse, [wide], { appIds, trusted });
    assert.equal(r.decision, null, 'a trusted reviewer is not the package\'s maintainer');
    assert.deepEqual(r.others.map(o => o.scope), ['unproven']);
    const maintainers = { 'npm:@babel/traverse': [pk] };
    r = resolveRow(traverse, [wide], { appIds, trusted, maintainers });
    assert.equal(r.decision.status, 'not_affected');
    r = resolveRow({ ...traverse, dependants: null }, [wide], { appIds: ['x'], trusted, maintainers });
    assert.deepEqual(r.needs, ['package'], 'no graph (gradle): only a package-wide or app statement can answer');
    assert.equal(r.decision.status, 'not_affected');

    // statements about another package with the same advisory id do not apply; untrusted authors are shown, not applied
    const otherPkg = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:something-else', status: 'not_affected' });
    const community = stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', app: 'it.airgap.vault', status: 'not_affected' }, other);
    r = resolveRow(traverse, [otherPkg, community, helpers], { appIds, trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.others.map(o => o.scope), ['community']);
  });

  test('resolveRow: what one wallet concluded about a direct user is shown in another, never applied', () => {
    const trusted = new Set([pk]);
    const otherKey = getPublicKey(other);
    const row = { id: 'GHSA-fjxv-7rqg-78g4', aliases: [], ecosystem: 'npm', package: 'form-data', direct: false, dependants: ['graphql-request'] };
    const airgap = stmt({ vulns: ['GHSA-fjxv-7rqg-78g4'], pkg: 'npm:form-data', via: 'npm:graphql-request', app: 'it.airgap.vault', status: 'not_affected', content: 'graphql-request never uploads files here' });
    assert.equal(resolveRow(row, [airgap], { appIds: ['it.airgap.vault'], trusted }).decision.status, 'not_affected', 'settles where it was made');
    let r = resolveRow(row, [airgap], { appIds: ['d.wallet'], trusted });
    assert.equal(r.decision, null, 'D-wallet may come to a different conclusion');
    assert.deepEqual(r.others.map(o => [o.scope, o.statement.app]), [['elsewhere', 'it.airgap.vault']]);

    // the same claim without a wallet: about the library, so only its maintainer can make it hold everywhere
    const reviewer = stmt({ vulns: ['GHSA-fjxv-7rqg-78g4'], pkg: 'npm:form-data', via: 'npm:graphql-request', status: 'not_affected' });
    const maintainer = stmt({ vulns: ['GHSA-fjxv-7rqg-78g4'], pkg: 'npm:form-data', via: 'npm:graphql-request', status: 'not_affected' }, other);
    const maintainers = { 'npm:graphql-request': [otherKey] };
    r = resolveRow(row, [reviewer], { appIds: ['d.wallet'], trusted, maintainers });
    assert.equal(r.decision, null);
    assert.deepEqual(r.others.map(o => o.scope), ['unproven']);
    r = resolveRow(row, [maintainer], { appIds: ['d.wallet'], trusted, maintainers });
    assert.equal(r.decision.status, 'not_affected', 'the listed maintainer settles it in every wallet, trusted list or not');

    // this wallet's own statement on the direct user wins over the maintainer's
    const dsays = stmt({ vulns: ['GHSA-fjxv-7rqg-78g4'], pkg: 'npm:form-data', via: 'npm:graphql-request', app: 'd.wallet', status: 'affected' }, sk, 1);
    r = resolveRow(row, [maintainer, dsays], { appIds: ['d.wallet'], trusted, maintainers });
    assert.equal(r.decision.status, 'affected');
    assert.equal(statementScope(airgap, row, { appIds: ['it.airgap.vault'], trusted: new Set() }), 'community', 'made here, by an untrusted author');
  });

  test('resolveRow: a statement about a direct user the release no longer has stays in sight', () => {
    const row = { id: 'GHSA-fjxv-7rqg-78g4', aliases: [], ecosystem: 'npm', package: 'form-data', direct: false, dependants: ['superagent'] };
    const stale = stmt({ vulns: ['GHSA-fjxv-7rqg-78g4'], pkg: 'npm:form-data', via: 'npm:graphql-request', app: 'w', status: 'not_affected' });
    const r = resolveRow(row, [stale], { appIds: ['w'], trusted: new Set([pk]) });
    assert.equal(r.decision, null);
    assert.deepEqual(r.others.map(o => o.scope), ['unused']);
  });

  test('applyTriage counts the queue', () => {
    const triage = { trusted: [pk], statements: [
      stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', app: 'app', status: 'not_affected' }),
      stmt({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/helpers', app: 'app', status: 'not_affected' }),
      stmt({ vulns: ['GHSA-x'], pkg: 'npm:x', via: 'npm:a', app: 'app', status: 'affected' }),
      stmt({ vulns: ['GHSA-z'], pkg: 'npm:z', status: 'fixed' }, other),
    ] };
    const { advisories, summary } = applyTriage([
      traverse,
      { id: 'GHSA-x', ecosystem: 'npm', package: 'x', dependants: ['a', 'b'] },
      { id: 'GHSA-z', ecosystem: 'npm', package: 'z', dependants: [] },
    ], triage, { appIds: ['app'] });
    assert.deepEqual(summary, { total: 3, decided: 1, undecided: 2, affected: 0, not_affected: 1, fixed: 0, under_investigation: 0, partial: 1, others: 1 });
    assert.deepEqual(advisories.map(a => a.decision?.status || null), ['not_affected', null, null]);
    assert.deepEqual(advisories[1].triage, { needs: ['via:npm:a', 'via:npm:b'], covered: ['via:npm:a'], others: [], partial: advisories[1].triage.partial });
    assert.deepEqual(advisories[2].triage.others.map(o => [o.scope, o.statement.status]), [['community', 'fixed']], 'the statement itself is kept for display');
    assert.deepEqual(applyTriage([traverse], null).summary, { total: 1, decided: 0, undecided: 1, affected: 0, not_affected: 0, fixed: 0, under_investigation: 0, partial: 0, others: 0 });
  });

  test('buildTriage merges snapshot and relay events, publishes statements.json, keeps the snapshot current', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'triage-'));
    try {
      const target = join(tmp, 'dependency-triage');
      const outFile = join(target, 'statements.json');
      const snapshotFile = join(tmp, 'events.json');
      const trustedFile = join(tmp, 'trusted.yml');
      writeFileSync(trustedFile, `trustedAuthors:\n  - ${nip19.npubEncode(pk)} # me\nmaintainers:\n  npm:@babel/core:\n    - ${nip19.npubEncode(getPublicKey(other))}\n`);
      const old = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'under_investigation' }, sk, 100);
      writeFileSync(snapshotFile, JSON.stringify([old, { ...old, id: 'f'.repeat(64) }]));
      const newer = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected' }, sk, 200);
      const unrelated = signed({ vulns: ['GHSA-nobody'], pkg: 'npm:n', status: 'fixed' }, other, 300);
      // a JSON round trip, as from a relay or the file: nostr-tools marks objects it verified, a spread would carry the mark
      const broken = JSON.parse(JSON.stringify({ ...newer, sig: '0'.repeat(128) }));

      const r = buildTriage({ events: [newer, unrelated, broken], snapshotFile, trustedFile, target });
      assert.deepEqual(r, { statements: 2, trusted: 1, rejected: 2, deleted: 0, capped: 0, published: 2, snapshotChanged: true });
      const out = triageForApp({ appId: 'it.airgap.vault', releases: [{ advisories: [traverse] }] }, JSON.parse(readFileSync(outFile, 'utf8')));
      assert.deepEqual(out.trusted, [pk]);
      assert.deepEqual(out.maintainers, { 'npm:@babel/core': [getPublicKey(other)] });
      assert.equal(out.statements.length, 1);
      assert.equal(out.statements[0].status, 'not_affected', 'the newer version of the same subject wins');
      assert.equal(triageForApp({ appId: 'other.app', releases: [{ advisories: [{ id: 'GHSA-q', aliases: [] }] }] }, JSON.parse(readFileSync(outFile, 'utf8'))).statements.length, 0, 'a wallet nobody said anything about');
      const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));
      assert.deepEqual(snapshot.map(e => e.id).sort(), [newer.id, unrelated.id].sort(), 'superseded and forged events leave the snapshot');

      // a second run with nothing new changes nothing
      assert.equal(buildTriage({ events: [], snapshotFile, trustedFile, target }).snapshotChanged, false);
      assert.deepEqual(acceptEvents([newer, broken]).accepted.map(x => x.event.id), [newer.id]);

      // its author deletes the statement (NIP-09): it leaves the export, and the request stays in the snapshot
      const del = finalizeEvent({ kind: 5, created_at: 400, tags: [['e', newer.id], ['k', String(dependencyTriageKind)]], content: 'moved to a wallet-scoped statement' }, sk);
      const forgedDel = finalizeEvent({ kind: 5, created_at: 400, tags: [['e', unrelated.id], ['k', String(dependencyTriageKind)]], content: '' }, sk);
      const r2 = buildTriage({ events: [del, forgedDel], snapshotFile, trustedFile, target });
      assert.equal(r2.deleted, 1, 'only the author\'s own statement goes');
      assert.deepEqual(JSON.parse(readFileSync(outFile, 'utf8')).statements.map(x => x.id), [unrelated.id]);
      assert.deepEqual(JSON.parse(readFileSync(outFile, 'utf8')).deletions.map(x => x.id).sort(), [del.id, forgedDel.id].sort(), 'the requests are published for the page to apply to the relay\'s copy');
      const snap2 = JSON.parse(readFileSync(snapshotFile, 'utf8'));
      assert.ok(snap2.some(e => e.id === del.id) && !snap2.some(e => e.id === newer.id));
      // once every relay dropped the statement, its author has nothing left: the request still stays
      buildTriage({ events: [], snapshotFile, trustedFile, target });
      assert.ok(JSON.parse(readFileSync(snapshotFile, 'utf8')).some(e => e.id === del.id), 'a build with no relay copy keeps the request');
      assert.equal(buildTriage({ events: [newer], snapshotFile, trustedFile, target }).deleted, 1, 'a relay serving it again does not bring it back');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('mergeLiveTriage adds the relay\'s newer statements and applies deletions from either source', () => {
    const subject = { vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core' };
    const built = signed({ ...subject, status: 'under_investigation' }, sk, 100);
    const gone = signed({ vulns: ['GHSA-gone'], pkg: 'npm:g', status: 'fixed' }, sk, 100);
    const builtDel = finalizeEvent({ kind: 5, created_at: 150, tags: [['e', gone.id], ['k', String(dependencyTriageKind)]], content: '' }, sk);
    const published = { trusted: [pk], maintainers: {}, statements: [statementFromEvent(built)], deletions: [builtDel] };
    const newer = signed({ ...subject, status: 'not_affected' }, sk, 200);
    const fresh = signed({ vulns: ['GHSA-new'], pkg: 'npm:n', status: 'affected' }, other, 300);
    const freshDel = finalizeEvent({ kind: 5, created_at: 400, tags: [['e', fresh.id], ['k', String(dependencyTriageKind)]], content: '' }, other);
    const stranger = finalizeEvent({ kind: 5, created_at: 400, tags: [['e', newer.id], ['k', String(dependencyTriageKind)]], content: '' }, generateSecretKey());
    const forged = JSON.parse(JSON.stringify({ ...signed({ vulns: ['GHSA-x'], pkg: 'npm:x', status: 'fixed' }, sk, 500), sig: '0'.repeat(128) }));

    let m = mergeLiveTriage(published, [newer, fresh, gone, stranger, forged]);
    assert.deepEqual(m.statements.map(x => [x.vulns[0], x.status]).sort(), [['GHSA-67hx-6x53-jw92', 'not_affected'], ['GHSA-new', 'affected']],
      'the newer version wins, a new one joins, a statement deleted in the build stays gone, a stranger\'s request and a forged event change nothing');
    assert.deepEqual(m.trusted, [pk]);
    m = mergeLiveTriage(published, [newer, fresh, freshDel]);
    assert.deepEqual(m.statements.map(x => x.vulns[0]), ['GHSA-67hx-6x53-jw92'], 'a request only the relay has removes its author\'s statement');
    assert.deepEqual(mergeLiveTriage(published, []).statements.map(x => x.status), ['under_investigation'], 'no relay: the build\'s statements');
    assert.deepEqual(mergeLiveTriage(null, [fresh]).statements.map(x => x.id), [fresh.id], 'no build file: the relay alone');
  });

  test('the committed trusted list and snapshot are valid', () => {
    const trusted = trustedAuthors();
    assert.ok(Object.values(listedMaintainers()).every(keys => keys.every(h => /^[0-9a-f]{64}$/.test(h))));
    assert.ok(trusted.length >= 3);
    assert.ok(trusted.every(h => /^[0-9a-f]{64}$/.test(h)));
    const snapshotFile = '_data/dependencyTriageEvents.json';
    if (existsSync(snapshotFile)) {
      const events = JSON.parse(readFileSync(snapshotFile, 'utf8'));
      const deletions = events.filter(e => e.kind === 5);
      assert.equal(acceptEvents(events.filter(e => e.kind !== 5)).rejected, 0, 'every committed event is a signed, well-formed statement');
      assert.equal(acceptDeletions(deletions).length, deletions.length, 'or a signed deletion request');
    }
  });
});

// Issue 995: a statement holds where the versions it was judged on still are.
describe('dependency triage statements: the versions they were judged on', () => {
  const trusted = new Set([pk]);
  const appIds = ['it.airgap.vault'];
  // bn.js under @ethereumjs/util, as AirGap ships it; a release with a direct user at another version
  const bn = (version, util = '9.1.0') => ({ id: 'GHSA-378v-28hj-76wf', aliases: [], ecosystem: 'npm', package: 'bn.js', version, severity: 'moderate', direct: false, dependants: ['@ethereumjs/util'], dependantVersions: { '@ethereumjs/util': [util] } });
  const judged = (extra = {}, created_at = 1_700_000_000) => stmt({ vulns: ['GHSA-378v-28hj-76wf'], pkg: 'npm:bn.js', via: 'npm:@ethereumjs/util', app: 'it.airgap.vault', status: 'not_affected', justification: 'vulnerable_code_not_in_execute_path', release: 'v3.35.0', packageVersion: '5.2.2', viaVersion: '9.1.0', ...extra }, sk, created_at);

  test('the version tags round-trip, and the same versions in a later release keep the decision', () => {
    const s = judged();
    assert.deepEqual([s.release, s.packageVersion, s.viaVersion], ['v3.35.0', '5.2.2', '9.1.0']);
    const e = signed({ vulns: ['GHSA-1'], pkg: 'npm:blib', app: 'w', status: 'fixed', packageVersion: '1.0.0', viaVersion: '2.0.0' });
    assert.equal(e.tags.some(t => t[0] === 'via-version'), false, 'no direct user, no direct user\'s version');
    const r = resolveRow(bn('5.2.2'), [s], { appIds, trusted });
    assert.equal(r.decision?.status, 'not_affected');
    assert.deepEqual(r.stale, []);
  });

  test('a bumped vulnerable package reopens the row, labelled with the old decision, and it counts as still to look at', () => {
    const s = judged();
    const r = resolveRow(bn('5.2.1'), [s], { appIds, trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.stale.map(x => [x.release, x.changes]), [['v3.35.0', [{ what: 'bn.js', was: '5.2.2', now: '5.2.1' }]]]);
    const { summary } = applyTriage([bn('5.2.1'), bn('5.2.2')], { trusted: [pk], statements: [s] }, { appIds });
    assert.deepEqual([summary.decided, summary.undecided, summary.stale], [1, 1, 1]);
    const affected = judged({ status: 'affected', justification: null });
    assert.equal(resolveRow(bn('5.2.1'), [affected], { appIds, trusted }).decision, null, '"affected" is tied to its versions too');
  });

  test('a bumped direct user reopens the row; a row that does not say its direct user\'s version is not compared on it', () => {
    const s = judged();
    const r = resolveRow(bn('5.2.2', '10.0.0'), [s], { appIds, trusted });
    assert.equal(r.decision, null);
    assert.deepEqual(r.stale[0].changes, [{ what: '@ethereumjs/util', was: '9.1.0', now: '10.0.0' }]);
    const { dependantVersions, ...older } = bn('5.2.2');
    assert.equal(resolveRow(older, [s], { appIds, trusted }).decision?.status, 'not_affected', 'an export before dependantVersions');
  });

  test('a statement without versions counts as made on the release current then, on every version that release has', () => {
    const day = (iso) => Math.floor(Date.parse(iso) / 1000);
    const legacy = stmt({ vulns: ['GHSA-378v-28hj-76wf'], pkg: 'npm:bn.js', via: 'npm:@ethereumjs/util', app: 'it.airgap.vault', status: 'not_affected' }, sk, day('2026-10-16T10:00:00Z'));
    const releases = [
      { ref: 'v3.36.0', releasedAt: '2026-11-01', advisories: [bn('5.2.3')] },
      { ref: 'v3.35.0', releasedAt: '2026-09-28', advisories: [bn('4.12.0', '7.0.0'), bn('5.2.2')] },
      { ref: 'v3.34.0', releasedAt: '2025-08-28', advisories: [bn('5.2.1')] },
    ];
    assert.deepEqual(statementBasis(legacy, releases), { release: 'v3.35.0', packageVersions: ['4.12.0', '5.2.2'], viaVersions: ['7.0.0', '9.1.0'], legacy: true });
    assert.equal(resolveRow(bn('5.2.2'), [legacy], { appIds, trusted, releases }).decision?.status, 'not_affected', 'the release it was made on');
    assert.equal(resolveRow(bn('4.12.0', '7.0.0'), [legacy], { appIds, trusted, releases }).decision?.status, 'not_affected', 'both bn.js rows of that release');
    const older = resolveRow(bn('5.2.1'), [legacy], { appIds, trusted, releases });
    assert.equal(older.decision, null);
    assert.deepEqual(older.stale.map(x => [x.release, x.changes]), [['v3.35.0', [{ what: 'bn.js', was: '4.12.0, 5.2.2', now: '5.2.1' }]]]);
    assert.equal(resolveRow(bn('5.2.3'), [legacy], { appIds, trusted, releases }).decision, null, 'a newer release that bumped it');
    assert.deepEqual(resolveRow(bn('5.2.1'), [legacy], { appIds, trusted }).decision?.status, 'not_affected', 'without the releases there is nothing to place it in');
    const wide = stmt({ vulns: ['GHSA-378v-28hj-76wf'], pkg: 'npm:bn.js', via: 'npm:@ethereumjs/util', status: 'not_affected' }, sk, day('2026-10-16T10:00:00Z'));
    assert.equal(statementBasis(wide, releases), null, 'a library-wide statement without versions is not placed in any wallet\'s release');
    assert.deepEqual(versionChanges(legacy, bn('5.2.2'), releases), []);
    const undated = [{ ref: 'v3.36.0', analysedAt: '2026-10-10 08:00:00', advisories: [bn('5.2.3')] }, ...releases.slice(1)];
    assert.equal(statementBasis(legacy, undated).release, 'v3.36.0', 'a release without a publication date counts from its analysis');
  });

  test('a statement without versions settles only the versions it can have judged (issue 1020 P13)', () => {
    const day = (iso) => Math.floor(Date.parse(iso) / 1000);
    // AirGap v3.34.4: secp256k1 4.0.3 via hdkey and 5.0.0 via @airgap/icp; the statement reasoned about 4.0.3
    const secp = (version, via) => ({ id: 'GHSA-584q-6j8j-r5pm', aliases: ['CVE-2024-48930'], ecosystem: 'npm', package: 'secp256k1', version, severity: 'high', direct: false, dependants: [via], dependantVersions: { [via]: ['1.0.0'] } });
    const old = secp('4.0.3', 'hdkey');
    const icp = secp('5.0.0', '@airgap/icp');
    const releases = [{ ref: 'v3.34.4', releasedAt: '2026-10-01', advisories: [old, icp] }];
    const at = day('2026-10-16T10:00:00Z');
    const own = (content) => stmt({ vulns: ['GHSA-584q-6j8j-r5pm'], pkg: 'npm:secp256k1', app: 'it.airgap.vault', status: 'not_affected', content }, sk, at);
    // its reasoning names 4.0.3 (and the fix, 4.0.4, which the release does not ship)
    const named = own('secp256k1 4.0.3 via hdkey: the flaw is in ecdh(), nothing calls it. The fix is in-range at 4.0.4.');
    assert.deepEqual(statementBasis(named, releases).packageVersions, ['4.0.3']);
    assert.equal(resolveRow(old, [named], { appIds, trusted, releases }).decision?.status, 'not_affected');
    const reopened = resolveRow(icp, [named], { appIds, trusted, releases });
    assert.equal(reopened.decision, null, '5.0.0 is not what it judged');
    assert.deepEqual(reopened.stale[0].changes, [{ what: 'secp256k1', was: '4.0.3', now: '5.0.0' }]);
    // one naming both holds for both (AirGap's bn.js 4.12.0 and 5.2.2); "14.0.3" names no 4.0.3
    const both = own('4.0.3 (hdkey) and 5.0.0 (@airgap/icp): only sign and verify are called.');
    assert.equal(resolveRow(icp, [both], { appIds, trusted, releases }).decision?.status, 'not_affected');
    // one naming neither cannot say which it judged
    const unnamed = own('Only sign and verify are called, as of node 14.0.3.');
    assert.equal(statementBasis(unnamed, releases).unsure, true);
    for (const row of [old, icp]) {
      const r = resolveRow(row, [unnamed], { appIds, trusted, releases });
      assert.equal(r.decision, null, `${row.version} is not settled`);
      assert.deepEqual(r.stale[0].changes, [{ what: 'which', package: 'secp256k1', was: '4.0.3, 5.0.0', now: row.version }]);
    }
    // one version in its release: as before
    const single = [{ ref: 'v3.34.4', releasedAt: '2026-10-01', advisories: [old] }];
    assert.equal(resolveRow(old, [unnamed], { appIds, trusted, releases: single }).decision?.status, 'not_affected');
    // a statement on a direct user takes only the rows that direct user requires
    const viaHdkey = stmt({ vulns: ['GHSA-584q-6j8j-r5pm'], pkg: 'npm:secp256k1', via: 'npm:hdkey', app: 'it.airgap.vault', status: 'not_affected' }, sk, day('2026-10-16T10:00:00Z'));
    assert.deepEqual(statementBasis(viaHdkey, releases).packageVersions, ['4.0.3']);
    assert.equal(resolveRow(old, [viaHdkey], { appIds, trusted, releases }).decision?.status, 'not_affected');
    assert.equal(resolveRow(icp, [viaHdkey], { appIds, trusted, releases }).decision, null);
  });

  test('a statement written on one bn.js row records every bn.js version of the release, so it settles both', () => {
    const s = judged({ packageVersion: '4.12.0,5.2.2', viaVersion: '7.0.0,9.1.0' });
    assert.equal(resolveRow(bn('5.2.2'), [s], { appIds, trusted }).decision?.status, 'not_affected');
    assert.equal(resolveRow(bn('4.12.0', '7.0.0'), [s], { appIds, trusted }).decision?.status, 'not_affected');
    assert.equal(resolveRow(bn('5.2.1'), [s], { appIds, trusted }).decision, null);
  });

  test('a reopened wallet call stays in sight when another statement settles the row', () => {
    const wallet = judged({ status: 'affected', justification: null });
    const wide = stmt({ vulns: ['GHSA-378v-28hj-76wf'], pkg: 'npm:bn.js', status: 'not_affected' });
    const r = resolveRow(bn('5.2.1'), [wallet, wide], { appIds, trusted, maintainers: { 'npm:bn.js': [pk] } });
    assert.equal(r.decision?.status, 'not_affected');
    assert.deepEqual(r.stale.map(x => x.statement.status), ['affected']);
  });
});

describe('dependency triage statements: a flood by other authors (issue 1002)', () => {
  const flood = (key, n, from = 1000) => Array.from({ length: n }, (_, i) => signed({ vulns: [`GHSA-spam-${i}`], pkg: 'npm:spam', status: 'affected' }, key, from + i));

  test('capOutsiders never caps insiders, keeps what the snapshot had, then the newest within the limits', () => {
    const a = generateSecretKey();
    const b = generateSecretKey();
    const mine = flood(sk, 5);
    const old = signed({ vulns: ['GHSA-old'], pkg: 'npm:o', status: 'fixed' }, a, 10);
    const fromA = flood(a, 4);
    const fromB = flood(b, 4);
    const limits = { perAuthor: 2, total: 3 };
    const r = capOutsiders([...mine, old, ...fromA, ...fromB], { insiders: [pk], snapshotEvents: [old], limits });
    const ids = new Set(r.kept.map(e => e.id));
    assert.ok(mine.every(e => ids.has(e.id)), 'every insider statement stays');
    assert.ok(ids.has(old.id), 'a statement the snapshot had stays, though it is the oldest');
    assert.deepEqual([...fromA, ...fromB].filter(e => ids.has(e.id)).map(e => [e.pubkey === getPublicKey(a) ? 'a' : 'b', e.created_at]), [['a', 1003], ['b', 1003]], 'then the newest: one more from a (two per author), one from b (three in all)');
    assert.equal(r.dropped, 9 - 3);
    // a newer version of a subject the snapshot had counts as known too
    const oldNewer = signed({ vulns: ['GHSA-old'], pkg: 'npm:o', status: 'affected' }, a, 20);
    assert.ok(capOutsiders([oldNewer, ...fromB], { snapshotEvents: [old], limits: { perAuthor: 5, total: 1 } }).kept.some(e => e.id === oldNewer.id));
  });

  test('buildTriage keeps the trusted statement and the snapshot through a flood, and caps the rest', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'triage-flood-'));
    try {
      const target = join(tmp, 'dependency-triage');
      const snapshotFile = join(tmp, 'events.json');
      const trustedFile = join(tmp, 'trusted.yml');
      const maintainer = generateSecretKey();
      writeFileSync(trustedFile, `trustedAuthors:\n  - ${nip19.npubEncode(pk)}\nmaintainers:\n  npm:@babel/core:\n    - ${nip19.npubEncode(getPublicKey(maintainer))}\n`);
      assert.deepEqual(insiders(trustedFile), [pk, getPublicKey(maintainer)]);
      const community = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/helpers', status: 'not_affected' }, other, 100);
      writeFileSync(snapshotFile, JSON.stringify([community]));
      const trustedNew = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected' }, sk, 5000);
      const maintained = signed({ vulns: ['GHSA-67hx-6x53-jw92'], pkg: 'npm:@babel/traverse', via: 'npm:@babel/core', status: 'not_affected' }, maintainer, 5001);
      const spam = Array.from({ length: 30 }, () => generateSecretKey()).flatMap(k => flood(k, 10, 2000));
      const spamDeletions = flood(generateSecretKey(), 1).map(e => finalizeEvent({ kind: 5, created_at: 3000, tags: [['e', e.id], ['k', String(dependencyTriageKind)]], content: '' }, sk));
      const r = buildTriage({ events: [...spam, trustedNew, maintained, ...spamDeletions], snapshotFile, trustedFile, target, limits: { perAuthor: 2, total: 10 } });
      const out = JSON.parse(readFileSync(join(target, 'statements.json'), 'utf8'));
      const ids = new Set(out.statements.map(s => s.id));
      assert.ok(ids.has(trustedNew.id) && ids.has(maintained.id), 'trusted author and listed maintainer are never capped');
      assert.ok(ids.has(community.id), 'the outsider statement the snapshot had survives the flood');
      assert.equal(out.statements.length, 2 + 10, 'two insiders, then ten others in all');
      assert.equal(r.capped, 300 + 1 - 10);
      assert.equal(JSON.parse(readFileSync(snapshotFile, 'utf8')).length, 12 + spamDeletions.length, 'the snapshot holds what was published; an insider\'s deletion request is never capped');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
