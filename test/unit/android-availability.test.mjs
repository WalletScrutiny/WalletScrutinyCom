import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isDelistedFromPlay,
  githubRepoPath,
  hasRecentApkRelease,
  otherChannels,
  nextMeta
} from '../../scripts/androidAvailability.mjs';

const NOW = new Date('2026-10-27T00:00:00Z');
const release = (publishedAt, assets, draft = false) => ({
  draft,
  published_at: publishedAt,
  assets: assets.map((name) => ({ name }))
});

describe('isDelistedFromPlay', () => {
  test('playStore: removed and the older meta: removed both mean delisted', () => {
    assert.equal(isDelistedFromPlay({ playStore: 'removed', meta: 'ok' }), true);
    assert.equal(isDelistedFromPlay({ meta: 'removed' }), true);
  });

  test('an app that was never on Play is not delisted', () => {
    assert.equal(isDelistedFromPlay({ playStore: false, meta: 'removed' }), false);
    assert.equal(isDelistedFromPlay({ meta: 'ok' }), false);
  });
});

describe('githubRepoPath', () => {
  test('extracts owner/repo and ignores other hosts', () => {
    assert.equal(githubRepoPath('https://github.com/aeonBTC/IbisWallet.git'), 'aeonBTC/IbisWallet');
    assert.equal(githubRepoPath('https://github.com/a/b/tree/main'), 'a/b');
    assert.equal(githubRepoPath('https://gitlab.com/bitcoin-wallet/bitcoin-wallet'), null);
    assert.equal(githubRepoPath(undefined), null);
  });
});

describe('hasRecentApkRelease', () => {
  test('needs an APK asset in a published release of the last 12 months', () => {
    assert.equal(hasRecentApkRelease([release('2026-03-01T00:00:00Z', ['app-release.apk'])], NOW), true);
    assert.equal(hasRecentApkRelease([release('2025-09-01T00:00:00Z', ['app-release.apk'])], NOW), false);
    assert.equal(hasRecentApkRelease([release('2026-03-01T00:00:00Z', ['source.tar.gz'])], NOW), false);
    assert.equal(hasRecentApkRelease([release('2026-03-01T00:00:00Z', ['app.apk'], true)], NOW), false);
    assert.equal(hasRecentApkRelease([], NOW), false);
  });
});

describe('nextMeta', () => {
  test('a removed app another store still ships goes back to ok', () => {
    const android = { meta: 'removed', alternativeStores: ['fdroid'] };
    assert.equal(nextMeta(android, otherChannels(android, null)), 'ok');
    const viaGithub = { meta: 'removed' };
    assert.equal(nextMeta(viaGithub, otherChannels(viaGithub, true)), 'ok');
  });

  test('an app no channel ships becomes removed', () => {
    const android = { playStore: 'removed', meta: 'ok', alternativeStores: ['other'] };
    assert.equal(nextMeta(android, otherChannels(android, false)), 'removed');
    assert.equal(nextMeta({ meta: 'removed' }, otherChannels({}, false)), null);
  });

  test('an app with few Play installs that another channel ships is fewusers', () => {
    const removed = { meta: 'removed', users: 20 };
    assert.equal(nextMeta(removed, otherChannels(removed, true)), 'fewusers');
    const ok = { playStore: 'removed', meta: 'ok', users: 20, alternativeStores: ['zapstore'] };
    assert.equal(nextMeta(ok, otherChannels(ok, null)), 'fewusers');
    const many = { playStore: 'removed', meta: 'ok', users: 1000, alternativeStores: ['zapstore'] };
    assert.equal(nextMeta(many, otherChannels(many, null)), null);
  });

  test('keeps any other meta while another channel ships', () => {
    const android = { playStore: 'removed', meta: 'fewusers', alternativeStores: ['zapstore'] };
    assert.equal(nextMeta(android, otherChannels(android, null)), null);
  });

  test('a failed GitHub query with no other store changes nothing', () => {
    assert.equal(nextMeta({ meta: 'removed' }, otherChannels({}, null)), null);
    assert.equal(nextMeta({ playStore: 'removed', meta: 'ok' }, otherChannels({}, null)), null);
  });
});
