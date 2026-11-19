// Scope (reproducible.mjs): which wallets have a reproducible verification,
// at which versions, and the cache used when the relays are unreachable. No network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { reproducibleVersions, pageRelay, loadReproducible, verifiedVersionsOf, inScope, tagOfVersion, analyseVerifiedVersions } from '../reproducible.mjs';
import { initDatabase, recordAnalysis, getAnalyses, saveAppList, saveReproducibleVersions, getReproducibleVersions, saveVerifiedRef, getVerifiedRefs, releasesToReanalyse } from '../ddbbUtils.mjs';
import { exportAll } from '../export.mjs';

const tmpDb = () => initDatabase(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'repro-')), 'assets.db'));

const verification = (pubkey, appId, version, status, created_at, d = `${appId}:${version}:android:hash`) => ({
  pubkey, created_at, kind: 30301,
  tags: [['status', status], ['d', d], ['i', appId], ['version', version], ['platform', 'android']],
});

test('reproducibleVersions: only reproducible, newest event per author and d, newest verification first', () => {
  const byApp = reproducibleVersions([
    verification('a', 'wallet.one', '1.0', 'reproducible', 100),
    verification('a', 'wallet.one', '1.1', 'reproducible', 300),
    verification('b', 'wallet.one', '1.0', 'reproducible', 200),
    // revised by its author: no longer vouches
    verification('a', 'wallet.two', '2.0', 'reproducible', 100),
    verification('a', 'wallet.two', '2.0', 'not_reproducible', 150),
    verification('c', 'wallet.three', '3.0', 'ftbfs', 100),
  ]);
  assert.deepEqual([...byApp.keys()], ['wallet.one']);
  assert.deepEqual(byApp.get('wallet.one'), [{ version: '1.1', verifiedAt: 300, platform: 'android' }, { version: '1.0', verifiedAt: 200, platform: 'android' }]);
});

test('a wallet is in scope through any alias, and stays in scope when later versions fail', () => {
  const byApp = reproducibleVersions([
    verification('a', 'ios.wallet', '5.0', 'reproducible', 100),
    verification('a', 'ios.wallet', '6.0', 'not_reproducible', 200),
  ]);
  const job = { appId: 'android.wallet', aliases: [{ appId: 'android.wallet', platform: 'android' }, { appId: 'ios.wallet', platform: 'iphone' }] };
  assert.ok(inScope(job, byApp));
  assert.deepEqual(verifiedVersionsOf(job, byApp), [{ version: '5.0', verifiedAt: 100, platform: 'android', appId: 'ios.wallet' }]);
  assert.ok(!inScope({ appId: 'other', aliases: [] }, byApp));
});

test('loadReproducible: fresh from the relays, cached copy when they fail, error when neither', async () => {
  const db = tmpDb();
  await assert.rejects(loadReproducible(db, { query: async () => { throw new Error('offline'); } }), /no cached copy: offline/);
  // an answer without a single reproducible verification is not trusted as "nothing in scope"
  await assert.rejects(loadReproducible(db, { query: async () => [] }), /no cached copy/);
  const fresh = await loadReproducible(db, { query: async () => [verification('a', 'w', '1.0', 'reproducible', 100)] });
  assert.equal(fresh.source, 'relays');
  const cached = await loadReproducible(db, { query: async () => { throw new Error('offline'); } });
  assert.equal(cached.source, 'cache');
  assert.deepEqual(cached.byApp.get('w'), [{ version: '1.0', verifiedAt: 100, platform: 'android' }]);
});

test('pageRelay: pages a capped relay with until down to its oldest event', async () => {
  // 7 events, two of them in the same second as a page boundary
  const held = [100, 200, 300, 300, 400, 500, 600].map((created_at, i) => ({ id: `e${i}`, created_at }));
  const asked = [];
  const capped = async ([relay], f) => {
    asked.push(f.until);
    return held.filter(e => e.created_at >= f.since && (f.until === undefined || e.created_at <= f.until))
      .sort((a, b) => b.created_at - a.created_at).slice(0, 3);
  };
  const events = await pageRelay(capped, 'wss://r/', { kinds: [30301], since: 0 });
  assert.deepEqual(events.map(e => e.id).sort(), held.map(e => e.id));
  assert.deepEqual(asked, [undefined, 400, 300, 200, 100]);
  // nothing older than since
  assert.deepEqual((await pageRelay(capped, 'wss://r/', { kinds: [30301], since: 350 })).map(e => e.created_at).sort(), [400, 500, 600]);
});

test('tagOfVersion: v-prefix, app-qualified tags, a build suffix the tag does not carry', () => {
  const tags = new Map([['v1.2.3', 'x'], ['wallet-2.0.0', 'y'], ['3.2.0', 'z']]);
  assert.equal(tagOfVersion(tags, 'wallet', '1.2.3'), 'v1.2.3');
  assert.equal(tagOfVersion(tags, 'wallet', '2.0.0'), 'wallet-2.0.0');
  assert.equal(tagOfVersion(tags, 'keystone3.pro', '3.2.0-Multi'), '3.2.0');
  assert.equal(tagOfVersion(tags, 'wallet', '9.9'), null);
});

test('tagOfVersion: component-prefixed tags, the verified platform picks between sibling apps', () => {
  const tags = new Map([['firmware/v9.27.1', 'a'], ['android-v2.8.2', 'b'], ['ios-v2.8.2', 'c'], ['app/2026.16.1', 'd'], ['core/v2.13.0', 'e']]);
  assert.equal(tagOfVersion(tags, 'bitBox2', '9.27.1 - Multi', 'hardware'), 'firmware/v9.27.1');
  assert.equal(tagOfVersion(tags, 'world.bitkey.app', '2026.16.1 (3)', 'android'), 'app/2026.16.1');
  assert.equal(tagOfVersion(tags, 'trezorOne', '2.13.0-Universal', 'hardware'), 'core/v2.13.0');
  assert.equal(tagOfVersion(tags, 'fr.acinq.phoenix.mainnet', '2.8.2', 'android'), 'android-v2.8.2');
  assert.equal(tagOfVersion(tags, 'fr.acinq.phoenix', '2.8.2', 'iphone'), 'ios-v2.8.2');
  assert.equal(tagOfVersion(tags, 'phoenix', '2.8.2', 'hardware'), null, 'two candidates and no hint: no guess');
});

test('tagOfVersion: a dotted app prefix, and the flavour in the verified version picks the tag', () => {
  const tags = new Map([['android.2.9.2', 'a'], ['1.2.9.2', 'x'], ['v0.59.4-fdroid', 'b'], ['v0.59.4-google', 'c'],
    ['firmware/v9.25.0', 'd'], ['firmware-btc-only/v9.25.0', 'e']]);
  assert.equal(tagOfVersion(tags, 'io.nunchuk.android', '2.9.2', 'android'), 'android.2.9.2');
  assert.equal(tagOfVersion(tags, 'cash.p.terminal', '0.59.4 - Fdroid', 'android'), 'v0.59.4-fdroid');
  assert.equal(tagOfVersion(tags, 'cash.p.terminal', '0.59.4', 'android'), null, 'fdroid or google: no guess');
  assert.equal(tagOfVersion(tags, 'bitBox2', '9.25.0-Btc-Only', 'hardware'), 'firmware-btc-only/v9.25.0');
});

test('tagOfVersion: a flavour the repository tags apart beats the plain tag (OneKey, issue 1018)', () => {
  // OneKeyHQ/firmware-classic1s and firmware-pro
  const tags = new Map(['v3.19.0', 'v3.19.0-btc', 'v3.21.0', 'v3.21.0-btc', 'v4.21.0', 'v4.21.0-btc', 'v3.12.1'].map(t => [t, '']));
  assert.equal(tagOfVersion(tags, 'onekey.classic.1s', '3.21.0-BTC only', 'hardware'), 'v3.21.0-btc');
  assert.equal(tagOfVersion(tags, 'onekey.classic.1s', '3.19.0 - Btc', 'hardware'), 'v3.19.0-btc');
  assert.equal(tagOfVersion(tags, 'onekey.pro', '4.21.0 - btc-only', 'hardware'), 'v4.21.0-btc');
  assert.equal(tagOfVersion(tags, 'onekey.classic.1s', '3.21.0-Universal', 'hardware'), 'v3.21.0');
  assert.equal(tagOfVersion(tags, 'onekey.classic.1s', '3.19.0 - Stable', 'hardware'), 'v3.19.0');
  assert.equal(tagOfVersion(tags, 'onekey.classic.1s', '3.12.1', 'hardware'), 'v3.12.1');
});

test('tagOfVersion: two tags naming the flavour pick none of them, with a warning', (t) => {
  const warn = t.mock.method(console, 'warn', () => {});
  const tags = new Map(['v3.21.0', 'v3.21.0-btc', 'v3.21.0-btc-only'].map(t => [t, '']));
  assert.equal(tagOfVersion(tags, 'onekey.classic.1s', '3.21.0-BTC only', 'hardware'), 'v3.21.0');
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /"BTC only" build of 3\.21\.0 \(v3\.21\.0-btc, v3\.21\.0-btc-only\)/);
  // one flavoured tag: picked, nothing to warn about
  assert.equal(tagOfVersion(new Map([['v3.21.0', ''], ['v3.21.0-btc', '']]), 'onekey.classic.1s', '3.21.0-BTC only', 'hardware'), 'v3.21.0-btc');
  assert.equal(warn.mock.callCount(), 1);
});

test('tagOfVersion: the app id names the product prefix, the vendor alone does not (OneKey, issue 1019)', () => {
  // OneKeyHQ/firmware tags every product
  const tags = new Map(['classic/v3.10.0', 'mini/v3.10.0', 'classic/v3.12.0', 'touch/v4.12.0'].map(t => [t, '']));
  assert.equal(tagOfVersion(tags, 'onekeymini', '3.10.0', 'hardware'), 'mini/v3.10.0');
  assert.equal(tagOfVersion(tags, 'onekey', '3.10.0', 'hardware'), null, 'classic or mini: no guess');
  assert.equal(tagOfVersion(tags, 'onekey', '3.12.0', 'hardware'), 'classic/v3.12.0');
  assert.equal(tagOfVersion(tags, 'onekey.touch', '4.12.0', 'hardware'), 'touch/v4.12.0');
});

test('analyseVerifiedVersions: the tag hint comes from the alias that was verified', async () => {
  const db = tmpDb();
  const tags = new Map([['classic/v3.10.0', 'a'], ['mini/v3.10.0', 'b']]);
  const analysed = [];
  await analyseVerifiedVersions(db, { appId: 'onekey', repoUrl: 'x', verified: [{ version: '3.10.0', verifiedAt: 1, platform: 'hardware', appId: 'onekeymini' }],
    perPass: 2, analyse: async (tag) => { analysed.push(tag); }, listTags: async () => tags, analyser: 't' });
  assert.deepEqual(analysed, ['mini/v3.10.0']);
  assert.equal(getVerifiedRefs(db, 'onekey').get('mini/v3.10.0'), '3.10.0');
});

test('analyseVerifiedVersions: newest first, capped per pass, finished ones skipped, a missing tag recorded', async () => {
  const db = tmpDb();
  const tags = new Map([['v3.0', 'a'], ['v2.0', 'b'], ['v1.0', 'c']]);
  const verified = [{ version: '3.0', verifiedAt: 30 }, { version: '2.5', verifiedAt: 25 }, { version: '2.0', verifiedAt: 20 }, { version: '1.0', verifiedAt: 10 }];
  const analysed = [];
  const analyse = async (tag) => { analysed.push(tag); recordAnalysis(db, { appId: 'w', kind: 'release', ref: tag, status: 'ok', analyser: 't' }); };
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 2, analyse, listTags: async () => tags, analyser: 't' });

  assert.deepEqual(await run(), ['v3.0', 'v2.0']);
  assert.equal(getVerifiedRefs(db, 'w').get('v1.0'), '1.0', 'a version past the cap still gets its tag, for the export');
  assert.deepEqual(await run(), ['v1.0'], 'the next pass drains the backlog');
  assert.deepEqual(await run(), []);
  assert.deepEqual(analysed, ['v3.0', 'v2.0', 'v1.0']);
  assert.ok(getAnalyses(db, 'w').some(a => a.kind === 'verified-no-tag' && a.ref === '2.5'));


  // unreadable tags: nothing analysed, nothing thrown
  assert.deepEqual(await analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 2, analyse, listTags: async () => { throw new Error('gone'); } }), []);
});

test('analyseVerifiedVersions: a build-lock.json published after the analysis runs the release again, once', async () => {
  const db = tmpDb();
  const tags = new Map([['v2.0', 'a'], ['v1.0', 'b']]);
  const verified = [{ version: '2.0', verifiedAt: 20, platform: 'android' }, { version: '1.0', verifiedAt: 10, platform: 'android' }];
  const lock = (sha, eventId) => ({ sha256: sha.repeat(64), eventId, pubkey: 'p', appId: 'w', version: '2.0', platform: 'android' });
  const publish = (buildLocks, misnamedLocks) => saveReproducibleVersions(db, new Map([['w', [
    { version: '2.0', verifiedAt: 20, platform: 'android', ...(buildLocks ? { buildLocks } : {}), ...(misnamedLocks ? { misnamedLocks } : {}) },
    { version: '1.0', verifiedAt: 10, platform: 'android' },
  ]]]));
  // what checkBuildLocks would store: one file per (sha256, event), the misnamed ones as given
  const analyse = async (tag) => {
    const v = getReproducibleVersions(db).get('w').find(x => `v${x.version}` === tag);
    const buildLock = v.buildLocks || v.misnamedLocks
      ? { files: (v.buildLocks || []).map(l => ({ sha256: l.sha256, eventId: l.eventId, verifier: 'listed' })), misnamed: v.misnamedLocks || [], platforms: {} }
      : null;
    recordAnalysis(db, { appId: 'w', kind: 'release', ref: tag, status: 'ok', analyser: 't', buildLock });
  };
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 5, analyse, listTags: async () => tags, analyser: 't' });

  publish();
  assert.deepEqual(await run(), ['v2.0', 'v1.0']);
  assert.deepEqual(await run(), [], 'no build-lock.json then or now: done');

  publish([lock('a', 'e1')]);
  assert.deepEqual(await run(), ['v2.0'], 'the new file is read: only its release runs again');
  assert.equal(getAnalyses(db, 'w').find(a => a.ref === 'v2.0').build_lock.files[0].eventId, 'e1');
  assert.deepEqual(await run(), [], 'the analysis read it: not again');

  publish([lock('a', 'e1'), lock('a', 'e1')]);
  assert.deepEqual(await run(), [], 'the same file twice is the same file');
  publish([lock('b', 'e2')]);
  assert.deepEqual(await run(), ['v2.0'], 'a replaced file runs it again');
  publish([lock('b', 'e2')], [{ name: 'build-lock (1).json', sha256: null, eventId: 'e3', pubkey: 'p', platform: 'android' }]);
  assert.deepEqual(await run(), ['v2.0'], 'so does a new misnamed one, to report it');
  assert.deepEqual(await run(), []);
  publish();
  assert.deepEqual(await run(), ['v2.0'], 'a deleted file runs it again, so its rows go');
  assert.deepEqual(await run(), []);
});

test('analyseVerifiedVersions: a rerun for a build-lock.json counts against the per-pass cap', async () => {
  const db = tmpDb();
  const tags = new Map([['v2.0', 'a'], ['v1.0', 'b']]);
  const verified = [{ version: '2.0', verifiedAt: 20 }, { version: '1.0', verifiedAt: 10 }];
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.0', status: 'ok', analyser: 't' });
  saveReproducibleVersions(db, new Map([['w', [
    { version: '2.0', verifiedAt: 20, buildLocks: [{ sha256: 'a'.repeat(64), eventId: 'e1', pubkey: 'p' }] },
    { version: '1.0', verifiedAt: 10 },
  ]]]));
  const analysed = [];
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 1, analyse: async (tag) => { analysed.push(tag); }, listTags: async () => tags, analyser: 't' });
  assert.deepEqual(await run(), ['v2.0']);
  assert.deepEqual(analysed, ['v2.0'], 'v1.0, never analysed, waits for the next pass');
});

// One verified release whose build-lock.json the analysis stored as `entry`
// (checkBuildLocks's files[0]); analyse() stores it the same way again.
function storedBuildLockCase(entry) {
  const db = tmpDb();
  const tags = new Map([['v2.0', 'a']]);
  const verified = [{ version: '2.0', verifiedAt: 20, platform: 'android' }];
  const lock = { sha256: 'a'.repeat(64), eventId: 'e1', pubkey: entry.pubkey, appId: 'w', version: '2.0', platform: 'android' };
  saveReproducibleVersions(db, new Map([['w', [{ version: '2.0', verifiedAt: 20, platform: 'android', buildLocks: [lock] }]]]));
  const store = (e) => recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.0', status: 'ok', analyser: 't',
    buildLock: { files: [{ sha256: lock.sha256, eventId: 'e1', ...e }], misnamed: [], platforms: {} } });
  store(entry);
  return { db, store, run: (analyse, now) => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 5, analyse, listTags: async () => tags, analyser: 't', now }) };
}

const DAY = 24 * 60 * 60 * 1000;

test('analyseVerifiedVersions: a build-lock.json that could not be downloaded is asked for again, once a day', async () => {
  for (const problem of ['not-found', 'unavailable']) {
    const listed = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';
    const { db, store, run } = storedBuildLockCase({ pubkey: listed, verifier: 'listed', problem });
    const stillMissing = async () => store({ pubkey: listed, verifier: 'listed', problem });
    // the row is stamped with the real clock, so a day passes by moving it back
    const dayPasses = () => db.prepare("UPDATE analyses SET analysed_at = datetime(analysed_at, '-25 hours'), failed_attempt_at = datetime(failed_attempt_at, '-25 hours')").run();
    assert.deepEqual(await run(stillMissing), [], `${problem}: not again the same day`);
    dayPasses();
    assert.deepEqual(await run(stillMissing), ['v2.0'], `${problem}: a day later it is asked for again`);
    assert.deepEqual(await run(stillMissing), [], `${problem}: still missing, so the next day again, not the next pass`);
    // a failed rerun keeps the ok row; its attempt still counts as the day's try
    dayPasses();
    const failed = async () => recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.0', status: 'failed', error: 'HTTP 503', analyser: 't' });
    assert.deepEqual(await run(failed), ['v2.0']);
    assert.deepEqual(await run(failed), [], `${problem}: a failed retry waits a day too`);
  }
  // a file that was read, or one that can never be read, is done
  for (const entry of [{ verifier: 'listed', match: 'ok', modules: 3 }, { verifier: 'listed', problem: 'too-large' }, { verifier: 'listed', problem: 'not-a-build-lock' }]) {
    const { run } = storedBuildLockCase({ pubkey: 'p', ...entry });
    assert.deepEqual(await run(async () => {}, Date.now() + DAY + 60_000), [], JSON.stringify(entry));
  }
});

test('analyseVerifiedVersions: a build-lock.json skipped as unlisted runs again once its verifier is on the list', async () => {
  const nowListed = '54790a499115f63e32536aadab43f62c0cf3922cd1653b3a74846fe2f6573f5d';
  const { store, run } = storedBuildLockCase({ pubkey: nowListed, verifier: 'unlisted' });
  assert.deepEqual(await run(async () => store({ pubkey: nowListed, verifier: 'listed', match: 'ok', modules: 3 })), ['v2.0']);
  assert.deepEqual(await run(async () => {}), [], 'read now: done');
  const stillUnlisted = storedBuildLockCase({ pubkey: 'p', verifier: 'unlisted' });
  assert.deepEqual(await stillUnlisted.run(async () => {}, Date.now() + DAY + 60_000), [], 'an unlisted verifier stays skipped');
});

test('--reanalyse: verified versions run again without a cap, except tags already redone this pass', async () => {
  const db = tmpDb();
  const tags = new Map([['v3.0', 'a'], ['v2.0', 'b'], ['v1.0', 'c']]);
  const verified = [{ version: '3.0', verifiedAt: 30 }, { version: '2.0', verifiedAt: 20 }, { version: '1.0', verifiedAt: 10 }];
  for (const ref of ['v3.0', 'v2.0']) recordAnalysis(db, { appId: 'w', kind: 'release', ref, status: 'ok', analyser: 't' });
  const analysed = [];
  const analyse = async (tag) => { analysed.push(tag); };
  const done = await analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 1, analyse, listTags: async () => tags, redo: ['v3.0'] });
  assert.deepEqual(done, ['v2.0', 'v1.0']);
  assert.deepEqual(analysed, ['v2.0', 'v1.0']);
  // with no cap configured (perPass 0) it still runs
  assert.deepEqual(await analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 0, analyse, listTags: async () => tags, redo: [] }), ['v3.0', 'v2.0', 'v1.0']);
});

test('releasesToReanalyse: the newest stored GitHub release first, then every analysed release, once each', () => {
  const db = tmpDb();
  const asset = db.prepare("INSERT INTO assets (app_id, source, version, asset_name, sha256, published_at) VALUES (?, ?, ?, ?, 'h', ?)");
  asset.run('w', 'github', 'v1.0', 'a.apk', '2026-01-01');
  asset.run('w', 'github', 'v3.0', 'a.apk', '2026-03-01');
  asset.run('w', 'docker', 'v9.0', 'img', '2026-09-01');
  asset.run('other', 'github', 'v8.0', 'a.apk', '2026-08-01');
  for (const ref of ['v2.0', 'v3.0']) recordAnalysis(db, { appId: 'w', kind: 'release', ref, status: 'ok', analyser: 't' });
  recordAnalysis(db, { appId: 'w', kind: 'default-branch', ref: 'abc', status: 'ok', analyser: 't' });
  recordAnalysis(db, { appId: 'w', kind: 'verified-no-tag', ref: '2.5', status: 'unsupported', analyser: 't' });
  const refs = releasesToReanalyse(db, 'w');
  assert.equal(refs[0], 'v3.0');
  assert.deepEqual([...refs].sort(), ['v2.0', 'v3.0']);
  assert.deepEqual(releasesToReanalyse(db, 'nobody'), []);
});

test('exportAll with onlyReproducible leaves out wallets without a reproducible version, matched through aliases', () => {
  const db = tmpDb();
  saveAppList(db, [
    { appId: 'android.wallet', platform: 'android', repository: 'https://github.com/o/a' },
    { appId: 'ios.wallet', platform: 'iphone', repository: 'https://github.com/o/a' },
    { appId: 'other.wallet', platform: 'android', repository: 'https://github.com/o/b' },
  ]);
  for (const appId of ['android.wallet', 'other.wallet']) recordAnalysis(db, { appId, kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  saveReproducibleVersions(db, new Map([['ios.wallet', [{ version: '1', verifiedAt: 1, platform: 'iphone' }]]]));
  saveVerifiedRef(db, 'android.wallet', 'v1', '1');
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'repro-export-')), 'export');
  assert.equal(exportAll(db, dir, { onlyReproducible: true }).apps, 1);
  assert.ok(fs.existsSync(path.join(dir, 'apps', 'android.wallet.json')));
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'other.wallet.json')));
  assert.equal(exportAll(db, dir).apps, 2, 'without the option, everything analysed');
});
