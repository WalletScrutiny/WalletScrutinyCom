import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  applyStoreWebsite,
  isOnPlay,
  isOnAppStore,
  normalizeWebsite
} from '../../scripts/mobileWebsite.mjs';
import { stripPlatformWebsite } from '../../scripts/mobileWalletStore.mjs';

const OLD = 'https://old.example/';
const NEW = 'https://new.example/';
const play = (extra = {}) => ({ appId: 'com.example', meta: 'ok', ...extra });
const appStore = (extra = {}) => ({ appId: 'ios.example', idd: 1, meta: 'ok', ...extra });
const both = (website, android = {}, iphone = {}) =>
  ({ website, android: play(android), iphone: appStore(iphone) });

describe('isOnPlay / isOnAppStore', () => {
  test('removed, defunct, delisted and never-listed apps are not on the store', () => {
    assert.equal(isOnPlay(play()), true);
    assert.equal(isOnPlay(play({ meta: 'removed' })), false);
    assert.equal(isOnPlay(play({ meta: 'defunct' })), false);
    assert.equal(isOnPlay(play({ playStore: 'removed' })), false);
    assert.equal(isOnPlay(play({ playStore: false })), false);
    assert.equal(isOnPlay(undefined), false);
    assert.equal(isOnAppStore(appStore()), true);
    assert.equal(isOnAppStore(appStore({ meta: 'removed' })), false);
    assert.equal(isOnAppStore({ meta: 'ok' }), false);
  });
});

describe('normalizeWebsite', () => {
  test('ignores scheme, www, host case and a trailing slash', () => {
    assert.equal(normalizeWebsite('https://WWW.Trendo.com/'), 'trendo.com');
    assert.equal(normalizeWebsite('http://trendo.com'), 'trendo.com');
    assert.equal(normalizeWebsite('https://trendo.com/en/'), 'trendo.com/en');
    assert.notEqual(normalizeWebsite('https://fxtrendo.com'), normalizeWebsite('https://trendo.com/'));
  });
});

describe('applyStoreWebsite', () => {
  test('the App Store sets the website when Play removed the app', () => {
    const mobile = both(OLD, { meta: 'removed' });
    assert.equal(applyStoreWebsite(mobile, 'iphone', NEW), false);
    assert.equal(mobile.website, NEW);
  });

  test('Play sets the website when the App Store removed the app', () => {
    const mobile = both(OLD, {}, { meta: 'removed' });
    applyStoreWebsite(mobile, 'android', NEW);
    assert.equal(mobile.website, NEW);
  });

  test('a store that is the only one listed sets the website', () => {
    const ios = { website: OLD, iphone: appStore() };
    applyStoreWebsite(ios, 'iphone', NEW);
    assert.equal(ios.website, NEW);
    const sideloaded = both(OLD, { playStore: false });
    applyStoreWebsite(sideloaded, 'iphone', NEW);
    assert.equal(sideloaded.website, NEW);
  });

  test('stores that agree after normalizing keep one website and no churn', () => {
    const mobile = both('https://www.example.com/');
    assert.equal(applyStoreWebsite(mobile, 'android', 'http://example.com'), false);
    assert.equal(mobile.website, 'https://www.example.com/');
    assert.equal(mobile.android.website, undefined);
  });

  test('stores that disagree get one website each, in either refresh order', () => {
    for (const platform of ['android', 'iphone']) {
      const mobile = both(OLD);
      assert.equal(applyStoreWebsite(mobile, platform, NEW), true);
      assert.equal(mobile[platform].website, NEW);
      assert.equal(mobile[platform === 'android' ? 'iphone' : 'android'].website, OLD);
    }
  });

  test('when the stores agree again, the per-store websites collapse into one', () => {
    const mobile = both(OLD, { website: OLD }, { website: NEW });
    assert.equal(applyStoreWebsite(mobile, 'android', NEW), false);
    assert.equal(mobile.website, NEW);
    assert.equal(mobile.android.website, undefined);
    assert.equal(mobile.iphone.website, undefined);
  });

  test('when one store drops the app, the other one\'s website wins alone', () => {
    const mobile = both(OLD, { website: OLD, meta: 'removed' }, { website: NEW });
    applyStoreWebsite(mobile, 'iphone', NEW);
    assert.equal(mobile.website, NEW);
    assert.equal(mobile.android.website, undefined);
  });

  test('a store without a website changes nothing', () => {
    const mobile = both(OLD);
    assert.equal(applyStoreWebsite(mobile, 'android', ''), false);
    assert.deepEqual(mobile, both(OLD));
  });
});

describe('stripPlatformWebsite', () => {
  test('keeps a per-store pair, hoists a lone platform website', () => {
    const pair = both(OLD, { website: OLD }, { website: NEW });
    stripPlatformWebsite(pair);
    assert.equal(pair.android.website, OLD);
    assert.equal(pair.iphone.website, NEW);
    const lone = both(undefined, { website: NEW });
    stripPlatformWebsite(lone);
    assert.equal(lone.website, NEW);
    assert.equal(lone.android.website, undefined);
  });
});
