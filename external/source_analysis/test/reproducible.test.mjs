// Scope (reproducible.mjs): which wallets have a reproducible verification,
// at which versions, and the cache used when the relays are unreachable. No network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { reproducibleVersions, loadReproducible, verifiedVersionsOf, inScope, tagOfVersion, analyseVerifiedVersions } from '../reproducible.mjs';
import { initDatabase, recordAnalysis, getAnalyses, saveAppList, saveReproducibleVersions, releasesToReanalyse } from '../ddbbUtils.mjs';
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

test('analyseVerifiedVersions: newest first, capped per pass, finished ones skipped, a missing tag recorded', async () => {
  const db = tmpDb();
  const tags = new Map([['v3.0', 'a'], ['v2.0', 'b'], ['v1.0', 'c']]);
  const verified = [{ version: '3.0', verifiedAt: 30 }, { version: '2.5', verifiedAt: 25 }, { version: '2.0', verifiedAt: 20 }, { version: '1.0', verifiedAt: 10 }];
  const analysed = [];
  const analyse = async (tag) => { analysed.push(tag); recordAnalysis(db, { appId: 'w', kind: 'release', ref: tag, status: 'ok', analyser: 't' }); };
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 2, analyse, listTags: async () => tags, analyser: 't' });

  assert.deepEqual(await run(), ['v3.0', 'v2.0']);
  assert.deepEqual(await run(), ['v1.0'], 'the next pass drains the backlog');
  assert.deepEqual(await run(), []);
  assert.deepEqual(analysed, ['v3.0', 'v2.0', 'v1.0']);
  assert.ok(getAnalyses(db, 'w').some(a => a.kind === 'verified-no-tag' && a.ref === '2.5'));


  // unreadable tags: nothing analysed, nothing thrown
  assert.deepEqual(await analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 2, analyse, listTags: async () => { throw new Error('gone'); } }), []);
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
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'repro-export-')), 'export');
  assert.equal(exportAll(db, dir, { onlyReproducible: true }).apps, 1);
  assert.ok(fs.existsSync(path.join(dir, 'apps', 'android.wallet.json')));
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'other.wallet.json')));
  assert.equal(exportAll(db, dir).apps, 2, 'without the option, everything analysed');
});
