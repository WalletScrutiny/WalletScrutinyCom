// The site's app list: URL normalisation, grouping by repository, and the
// SQLite cache used when the site is unreachable. No network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { normalizeRepoUrl, groupByRepository, fetchAppList, loadAppList } from '../appList.mjs';
import { initDatabase, getAppList } from '../ddbbUtils.mjs';

const tmpDb = () => initDatabase(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'applist-')), 'assets.db'));

test('normalizeRepoUrl: forms found in the wallet records', () => {
  const cases = {
    'https://github.com/ZeusLN/zeus': 'https://github.com/ZeusLN/zeus',
    'https://github.com/ZeusLN/zeus/': 'https://github.com/ZeusLN/zeus',
    'https://github.com/ZeusLN/zeus.git': 'https://github.com/ZeusLN/zeus',
    'https://www.github.com/ZeusLN/zeus': 'https://github.com/ZeusLN/zeus',
    'https://github.com/cypherstack/stack_wallet/tags': 'https://github.com/cypherstack/stack_wallet',
    'https://github.com/crypto-power/cryptopower/releases': 'https://github.com/crypto-power/cryptopower',
    'https://github.com/leather-io/mono/tree/main/apps': 'https://github.com/leather-io/mono',
    'https://gitlab.com/walletscrutiny/walletScrutinyCom': 'https://gitlab.com/walletscrutiny/walletScrutinyCom',
    'https://gitlab.com/group/sub/repo/-/tags': 'https://gitlab.com/group/sub/repo',
    'https://code.samourai.io/wallet/samourai-wallet.git': 'https://code.samourai.io/wallet/samourai-wallet',
    // no repository named
    'https://github.com/Toporin': null,
    'https://github.com/orgs/revolut-engineering/repositories': null,
    'https://www.github.com/kzen-networks': null,
    'git@github.com:ZeusLN/zeus.git': null,
    'https://web.archive.org/web/20201113132658/https://github.com/neatnik/icywallet': null,
    'https://github.com/blockchain/My-Wallet-V3-iOS#deadLink': null,
    'https://github.com/ONTO-Data-Wallet/ONTO&deadLink': null,
    '': null,
  };
  for (const [input, expected] of Object.entries(cases)) {
    assert.equal(normalizeRepoUrl(input), expected, input);
  }
  assert.equal(normalizeRepoUrl(null), null);
});

test('groupByRepository: one job per repository, android record first, others become aliases', () => {
  const { jobs, skipped } = groupByRepository([
    { appId: 'com.zeus.ios', platform: 'iphone', repository: 'https://github.com/ZeusLN/zeus/' },
    { appId: 'app.zeusln.zeus', platform: 'android', repository: 'https://github.com/ZeusLN/zeus' },
    { appId: 'sparrow', platform: 'desktop', repository: 'https://github.com/sparrowwallet/sparrow' },
    { appId: 'com.toporin', platform: 'android', repository: 'https://github.com/Toporin' },
    { appId: 'com.github.ontio.onto', platform: 'android', repository: 'https://github.com/ONTO-Data-Wallet/ONTO#deadLink' },
  ]);
  assert.equal(jobs.length, 2);
  const zeus = jobs.find(j => j.repoUrl === 'https://github.com/ZeusLN/zeus');
  assert.equal(zeus.appId, 'app.zeusln.zeus');
  assert.deepEqual(zeus.aliases.map(a => a.appId), ['app.zeusln.zeus', 'com.zeus.ios']);
  assert.deepEqual(skipped.map(e => e.appId), ['com.toporin', 'com.github.ontio.onto']);
});

test('groupByRepository: a repository only iPhone records point at is left out', () => {
  const { jobs, iosOnly } = groupByRepository([
    { appId: 'com.vultisig.wallet', platform: 'android', repository: 'https://github.com/vultisig/vultisig-android' },
    { appId: 'com.vultisig.wallet', platform: 'iphone', repository: 'https://github.com/vultisig/vultisig-ios' },
    { appId: 'com.zeus.ios', platform: 'iphone', repository: 'https://github.com/ZeusLN/zeus' },
    { appId: 'app.zeusln.zeus', platform: 'android', repository: 'https://github.com/ZeusLN/zeus' },
  ]);
  assert.deepEqual(jobs.map(j => j.repoUrl).sort(), ['https://github.com/ZeusLN/zeus', 'https://github.com/vultisig/vultisig-android']);
  assert.deepEqual(iosOnly, [{ appId: 'com.vultisig.wallet', repoUrl: 'https://github.com/vultisig/vultisig-ios' }]);
});

test('groupByRepository: a repository is gone only when every record of it is', () => {
  // de.schildbach.wallet: removed from Google Play, still on F-Droid and reproducible.
  const { jobs } = groupByRepository([
    { appId: 'de.schildbach.wallet', platform: 'android', repository: 'https://github.com/bitcoin-wallet/bitcoin-wallet', gone: true },
    { appId: 'com.zeus.ios', platform: 'iphone', repository: 'https://github.com/ZeusLN/zeus', gone: true },
    { appId: 'app.zeusln.zeus', platform: 'android', repository: 'https://github.com/ZeusLN/zeus', gone: false },
  ]);
  const gone = Object.fromEntries(jobs.map(j => [j.appId, j.gone]));
  assert.deepEqual(gone, { 'de.schildbach.wallet': true, 'app.zeusln.zeus': false });
});

test('loadAppList: gone survives the cache', async () => {
  const db = tmpDb();
  const list = [{ appId: 'de.schildbach.wallet', platform: 'android', repository: 'https://github.com/bitcoin-wallet/bitcoin-wallet', gone: true }];
  await loadAppList(db, { source: 'https://example.invalid/list.json', get: async () => ({ data: list }) });
  assert.deepEqual(getAppList(db), list);
  db.close();
});

test('fetchAppList: reads a local file and rejects malformed entries', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'applist-'));
  const file = path.join(dir, 'list.json');
  fs.writeFileSync(file, JSON.stringify([{ appId: 'a', platform: 'android', repository: 'https://github.com/x/y' }]));
  const entries = await fetchAppList(file);
  assert.deepEqual(entries, [{ appId: 'a', platform: 'android', repository: 'https://github.com/x/y', gone: false }]);

  fs.writeFileSync(file, JSON.stringify([{ appId: 'a', platform: 'android' }]));
  await assert.rejects(fetchAppList(file), /malformed app list entry/);
  fs.writeFileSync(file, JSON.stringify({ not: 'a list' }));
  await assert.rejects(fetchAppList(file), /not an array/);
});

test('loadAppList: caches a fetched list and falls back to the cache when the fetch fails', async () => {
  const db = tmpDb();
  const list = [{ appId: 'a', platform: 'android', repository: 'https://github.com/x/y', gone: false }];
  const ok = async () => ({ data: list });
  const down = async () => { throw new Error('ECONNREFUSED'); };

  const fresh = await loadAppList(db, { source: 'https://example.invalid/list.json', get: ok });
  assert.equal(fresh.source, 'site');
  assert.deepEqual(getAppList(db), list);

  const cached = await loadAppList(db, { source: 'https://example.invalid/list.json', get: down });
  assert.equal(cached.source, 'cache');
  assert.deepEqual(cached.entries, list);
  assert.match(cached.error, /ECONNREFUSED/);

  // Bad data on a later fetch does not overwrite the cache.
  const bad = async () => ({ data: [{ appId: 'b' }] });
  const stillCached = await loadAppList(db, { source: 'https://example.invalid/list.json', get: bad });
  assert.equal(stillCached.source, 'cache');
  assert.deepEqual(getAppList(db), list);
  db.close();
});

test('loadAppList: two records claiming the same (appId, platform) are cached once', async () => {
  // The legacy and the rewritten Mycelium records both list com.mycelium.wallet-ios.
  const db = tmpDb();
  const dup = { appId: 'com.mycelium.wallet-ios', platform: 'iphone', repository: 'https://github.com/mycelium-com/wallet-ios' };
  const list = [dup, { ...dup }, { appId: 'com.mycelium.wallet-ios', platform: 'android', repository: 'https://github.com/x/y' }];
  const loaded = await loadAppList(db, { source: 'https://example.invalid/list.json', get: async () => ({ data: list }) });
  assert.equal(loaded.source, 'site');
  assert.equal(loaded.entries.length, 2);
  assert.equal(getAppList(db).length, 2);
  db.close();
});

test('loadAppList: no list and no cache is an error', async () => {
  const db = tmpDb();
  await assert.rejects(loadAppList(db, { source: 'https://example.invalid/list.json', get: async () => { throw new Error('nope'); } }), /no cached copy/);
  db.close();
});
