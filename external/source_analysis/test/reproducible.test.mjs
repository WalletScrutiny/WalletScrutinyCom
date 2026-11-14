// Scope (reproducible.mjs): which wallets have a reproducible verification,
// at which versions, and the cache used when the relays are unreachable. No network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { reproducibleVersions, pageRelay, queryRelays, loadReproducible, verifiedVersionsOf, inScope, tagOfVersion, analyseVerifiedVersions } from '../reproducible.mjs';
import { initDatabase, recordAnalysis, getAnalyses, saveAppList, saveReproducibleVersions, getReproducibleVersions, saveVerifiedRef, getVerifiedRefs, releasesToReanalyse } from '../ddbbUtils.mjs';
import { exportAll, reproducedListings } from '../export.mjs';

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

test('a later "not reproducible" of the same file by the same author revises under another d; ftbfs, another file or another author does not (#1020 P3)', () => {
  // Edge 4.44.0: reproducible, then not reproducible for the same file, each with a random d.
  const v = (pubkey, version, status, created_at, d, x) => ({ pubkey, created_at, kind: 30301,
    tags: [['status', status], ['d', d], ['i', 'co.edgesecure.app'], ['version', version], ['platform', 'android'], ...x.map(h => ['x', h])] });
  const byApp = reproducibleVersions([
    v('a', '4.44.0', 'reproducible', 100, 'r1', ['AA']),
    v('a', '4.44.0', 'not_reproducible', 150, 'r2', ['aa', 'bb']),
    v('a', '4.43.0', 'reproducible', 100, 'r3', ['cc']),
    v('a', '4.43.0', 'ftbfs', 150, 'r4', ['cc']),
    v('a', '4.42.0', 'reproducible', 100, 'r5', ['dd']),
    v('a', '4.42.0', 'not_reproducible', 150, 'r6', ['ee']),
    v('b', '4.41.0', 'reproducible', 100, 'r7', ['ff']),
    v('a', '4.41.0', 'not_reproducible', 150, 'r8', ['ff']),
    v('a', '4.40.0', 'not_reproducible', 50, 'r9', ['gg']),
    v('a', '4.40.0', 'reproducible', 100, 'r10', ['gg']),
  ]);
  assert.deepEqual(byApp.get('co.edgesecure.app').map(x => x.version).sort(), ['4.40.0', '4.41.0', '4.42.0', '4.43.0'],
    '4.44.0 revised; ftbfs, another file, another author and an earlier refusal leave the others');
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

test('one app id reproduced on Android and iPhone under one version name keeps both listings (#1020 P2)', () => {
  // Bitkey: world.bitkey.app is both listings; 2025.19.0 (6) was reproduced on
  // Android, later on iPhone, and the iPhone verdict replaced the Android one.
  const v = (platform, created_at, pubkey) => ({ pubkey, created_at, kind: 30301,
    tags: [['status', 'reproducible'], ['d', `${platform}-${pubkey}`], ['i', 'world.bitkey.app'], ['version', '2025.19.0 (6)'], ['platform', platform]] });
  const byApp = reproducibleVersions([v('android', 100, 'a'), v('iphone', 200, 'b'), v('android', 50, 'c')]);
  assert.deepEqual(byApp.get('world.bitkey.app'), [{ version: '2025.19.0 (6)', verifiedAt: 200, platform: 'iphone', platforms: ['iphone', 'android'] }]);

  const db = tmpDb();
  saveReproducibleVersions(db, new Map([...byApp, ['one.platform', [{ version: '1.0', verifiedAt: 1, platform: 'android' }]]]));
  assert.deepEqual([...getReproducibleVersions(db)], [...byApp, ['one.platform', [{ version: '1.0', verifiedAt: 1, platform: 'android' }]]], 'the cache keeps every platform');
  saveVerifiedRef(db, 'world.bitkey.app', 'app/2025.19.0', '2025.19.0 (6)');
  const aliases = [{ appId: 'world.bitkey.app', platform: 'android' }, { appId: 'world.bitkey.app', platform: 'iphone' }];
  assert.deepEqual(reproducedListings(db, 'world.bitkey.app', aliases).get('app/2025.19.0').listings,
    [{ appId: 'world.bitkey.app', platform: 'iphone' }, { appId: 'world.bitkey.app', platform: 'android' }], 'both listings, through the cache');
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

test('a read without the main relay keeps the cached verifications (#1020 P6)', async () => {
  // A relay that cannot be reached answers with nothing. A smaller relay holds
  // only part of the events (nos.lol, primal): cached, they would drop wallet.two from scope.
  const held = { 'wss://main/': [verification('a', 'wallet.one', '1.0', 'reproducible', 100), verification('a', 'wallet.two', '2.0', 'reproducible', 90)],
    'wss://small/': [verification('a', 'wallet.one', '1.0', 'reproducible', 100)] };
  held['wss://main/'].forEach((e, i) => { e.id = `m${i}`; });
  held['wss://small/'][0].id = 'm0';
  const relays = ['wss://main/', 'wss://small/'];
  const reading = (down) => async ([relay], f) => (relay === down ? [] : held[relay].filter(e => f.until === undefined || e.created_at < f.until));
  const query = (down) => (r, f) => queryRelays(r, f, { querySync: reading(down) });
  const db = tmpDb();
  assert.equal((await loadReproducible(db, { relays, query: query(null) })).byApp.size, 2);
  const partial = await loadReproducible(db, { relays, query: query('wss://main/') });
  assert.equal(partial.source, 'cache');
  assert.match(partial.error, /main relay wss:\/\/main\/ returned no events/);
  assert.deepEqual([...partial.byApp.keys()].sort(), ['wallet.one', 'wallet.two']);
  assert.equal((await loadReproducible(db, { relays, query: query('wss://small/') })).source, 'relays', 'another relay down is fine');
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
  assert.equal(tagOfVersion(tags, 'cash.p.terminal', '0.59.4', 'android'), 'v0.59.4-google', 'a plain Android version is the Play Store build');
  assert.equal(tagOfVersion(tags, 'cash.p.terminal', '0.59.4', 'hardware'), null, 'fdroid or google: no guess');
  assert.equal(tagOfVersion(tags, 'bitBox2', '9.25.0-Btc-Only', 'hardware'), 'firmware-btc-only/v9.25.0');
});

test('tagOfVersion on real tag lists: BitBox02 editions, Play Store builds, a tag without the last .0; ambiguous names stay untagged (#1020 P9)', () => {
  const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/verified-tags.json', import.meta.url), 'utf8'));
  const tags = (appId) => new Map(fixture[appId].tags.map(t => [t, 'x']));
  const of = (appId, version, platform) => tagOfVersion(tags(appId), appId, version, platform);
  // BitBox02 tags the multi edition firmware/ and the Bitcoin-only one firmware-btc-only/
  assert.equal(of('bitBox2', '9.25.0 - Multi', 'hardware'), 'firmware/v9.25.0');
  assert.equal(of('bitBox2', '9.23.3 -multi', 'hardware'), 'firmware/v9.23.3');
  assert.equal(of('bitBox2', '9.23.1 - Multi', 'hardware'), 'firmware/v9.23.1');
  assert.equal(of('bitBox2', '9.23.1 - Bitcoin-only', 'hardware'), 'firmware-btc-only/v9.23.1');
  assert.equal(of('bitBox2', '9.25.0-Btc-Only', 'hardware'), 'firmware-btc-only/v9.25.0');
  assert.equal(of('bitBox2', '9.23.0', 'hardware'), null, 'both editions were verified under the plain name: no guess');
  // P.CASH tags each store's build; the Android listing is the Play Store app
  assert.equal(of('cash.p.terminal', '0.60.0', 'android'), 'v0.60.0-google');
  assert.equal(of('cash.p.terminal', '0.59.2', 'android'), 'v0.59.2-google');
  assert.equal(of('cash.p.terminal', '0.59.4 - Fdroid', 'android'), 'v0.59.4-fdroid');
  assert.equal(of('cash.p.terminal', '0.59.0 - Fdroid', 'android'), 'v0.59.0-fdroid', 'no google tag for it, the F-Droid one still found');
  assert.equal(of('cash.p.terminal', '0.60.0', null), null, 'no platform: no guess');
  // Nunchuk tags 1.70.0 as android.1.70
  assert.equal(of('io.nunchuk.android', '1.70.0', 'android'), 'android.1.70');
  assert.equal(of('io.nunchuk.android', '1.70.1', 'android'), 'android.1.70.1');
  // two Knots 29.3 releases (knots20260210, knots20260507): no guess
  assert.equal(of('bitcoinknots', '29.3', 'windows'), null);
  // "2026.2.12" is 2026.2.1 build 2 typed without the parentheses: no tag says so
  assert.equal(of('world.bitkey.app', '2026.2.12', 'android'), null);
  assert.equal(of('world.bitkey.app', '2026.2.1 (2)', 'android'), 'app/2026.2.1');
});

test('analyseVerifiedVersions: newest first, capped per pass, finished ones skipped, a missing tag recorded', async () => {
  const db = tmpDb();
  const tags = new Map([['v3.0', 'a'], ['v2.0', 'b'], ['v1.0', 'c']]);
  const verified = [{ version: '3.0', verifiedAt: 30 }, { version: '2.5', verifiedAt: 25 }, { version: '2.0', verifiedAt: 20 }, { version: '1.0', verifiedAt: 10 }];
  const analysed = [];
  const analyse = async (tag) => { analysed.push(tag); recordAnalysis(db, { appId: 'w', kind: 'release', ref: tag, status: 'ok', analyser: 't' }); };
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 2, analyse, listTags: async () => tags, analyser: 't' });

  assert.deepEqual(await run(), ['v3.0', 'v2.0']);
  assert.deepEqual(getVerifiedRefs(db, 'w').get('v1.0'), ['1.0'], 'a version past the cap still gets its tag, for the export');
  assert.deepEqual(await run(), ['v1.0'], 'the next pass drains the backlog');
  assert.deepEqual(await run(), []);
  assert.deepEqual(analysed, ['v3.0', 'v2.0', 'v1.0']);
  assert.ok(getAnalyses(db, 'w').some(a => a.kind === 'verified-no-tag' && a.ref === '2.5'));


  // unreadable tags: nothing analysed, nothing thrown
  assert.deepEqual(await analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 2, analyse, listTags: async () => { throw new Error('gone'); } }), []);
});

test('analyseVerifiedVersions: a tag moved since its analysis is analysed again; one with no recorded commit is not', async () => {
  // Envoy v2.3.7 (#1020 P5): analysed at 6733f28, then the tag was recreated at fead13a.
  const db = tmpDb();
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.3.7', commit: '6733f28', status: 'ok', analyser: 't' });
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.3.6', commit: 'b', status: 'ok', analyser: 't' });
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.3.5', status: 'ok', analyser: 't' });
  const tags = new Map([['v2.3.7', 'fead13a'], ['v2.3.6', 'b'], ['v2.3.5', 'c']]);
  const verified = [{ version: '2.3.7', verifiedAt: 3 }, { version: '2.3.6', verifiedAt: 2 }, { version: '2.3.5', verifiedAt: 1 }];
  const analyse = async (tag) => recordAnalysis(db, { appId: 'w', kind: 'release', ref: tag, commit: tags.get(tag), status: 'ok', analyser: 't' });
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 5, analyse, listTags: async () => tags, analyser: 't' });
  assert.deepEqual(await run(), ['v2.3.7']);
  assert.deepEqual(await run(), [], 'analysed at the new commit: done');
});

test('analyseVerifiedVersions: a moved tag whose new analysis failed is not retried every pass', async () => {
  const db = tmpDb();
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v2.3.7', commit: '6733f28', status: 'ok', analyser: 't' });
  const tags = new Map([['v2.3.7', 'fead13a']]);
  const verified = [{ version: '2.3.7', verifiedAt: 3 }];
  const tried = [];
  const analyse = async (tag) => { tried.push(tag); recordAnalysis(db, { appId: 'w', kind: 'release', ref: tag, commit: tags.get(tag), status: 'failed', error: 'boom', analyser: 't' }); };
  const run = () => analyseVerifiedVersions(db, { appId: 'w', repoUrl: 'x', verified, perPass: 5, analyse, listTags: async () => tags, analyser: 't' });
  await run();
  await run();
  assert.deepEqual(tried, ['v2.3.7'], 'one try at the new commit, then the old ok analysis stands');
});

test('analyseVerifiedVersions rebuilds an app\'s verified_refs each pass: a stale tag for a name goes, a failed tag listing keeps the rows', async () => {
  const db = tmpDb();
  const tags = new Map([['firmware/v9.25.0', 'a'], ['firmware-btc-only/v9.25.0', 'b']]);
  const verified = [{ version: '9.25.0-Btc-Only', verifiedAt: 2, platform: 'hardware' }];
  const analyse = async (tag) => recordAnalysis(db, { appId: 'bitBox2', kind: 'release', ref: tag, status: 'ok', analyser: 't' });
  // An earlier pass (older rule) put the Bitcoin-only name on the multi tag, and
  // the other app sharing the table keeps its own rows.
  saveVerifiedRef(db, 'bitBox2', 'firmware/v9.25.0', '9.25.0-Btc-Only');
  saveVerifiedRef(db, 'other', 'v1', '1');
  const run = (listTags) => analyseVerifiedVersions(db, { appId: 'bitBox2', repoUrl: 'x', verified, perPass: 2, analyse, listTags, analyser: 't' });

  await run(async () => { throw new Error('gone'); });
  assert.deepEqual([...getVerifiedRefs(db, 'bitBox2')], [['firmware/v9.25.0', ['9.25.0-Btc-Only']]], 'tags unreadable: old rows kept');

  await run(async () => tags);
  assert.deepEqual([...getVerifiedRefs(db, 'bitBox2')], [['firmware-btc-only/v9.25.0', ['9.25.0-Btc-Only']]],
    'the name sits only where this pass resolved it; the stale row is gone');
  assert.deepEqual([...getVerifiedRefs(db, 'other')], [['v1', ['1']]], 'other apps untouched');
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

test('verified_refs keeps every name typed for a tag, and an old (app, ref) key is rekeyed with its rows', () => {
  const db = initDatabase(':memory:');
  saveVerifiedRef(db, 'w', 'v2.2.6', '2.2.6-btc');
  saveVerifiedRef(db, 'w', 'v2.2.6', '2.2.6 - Btc');
  saveVerifiedRef(db, 'w', 'v2.2.6', '2.2.6-btc');
  assert.deepEqual([...getVerifiedRefs(db, 'w')], [['v2.2.6', ['2.2.6 - Btc', '2.2.6-btc']]]);

  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-rekey-')), 'assets.db');
  const old = initDatabase(file);
  old.exec('DROP TABLE verified_refs; CREATE TABLE verified_refs (app_id TEXT NOT NULL, ref TEXT NOT NULL, version TEXT NOT NULL, PRIMARY KEY (app_id, ref))');
  old.prepare('INSERT INTO verified_refs VALUES (?, ?, ?)').run('w', 'v1', '1-btc');
  old.close();
  const again = initDatabase(file);
  saveVerifiedRef(again, 'w', 'v1', '1 - Btc');
  assert.deepEqual([...getVerifiedRefs(again, 'w')], [['v1', ['1 - Btc', '1-btc']]], 'the old row kept, the second name added');
});
