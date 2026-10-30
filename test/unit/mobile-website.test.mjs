import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { applyStoreWebsite, isOnPlay, isOnAppStore } from '../../scripts/mobileWebsite.mjs';

const OLD = 'https://old.example/';
const NEW = 'https://new.example/';
const play = (extra = {}) => ({ appId: 'com.example', meta: 'ok', ...extra });
const appStore = (extra = {}) => ({ appId: 'ios.example', idd: 1, meta: 'ok', ...extra });

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

describe('applyStoreWebsite', () => {
  test('the App Store sets the website when Play removed the app', () => {
    const mobile = { website: OLD, android: play({ meta: 'removed' }), iphone: appStore() };
    assert.equal(applyStoreWebsite(mobile, 'iphone', NEW), null);
    assert.equal(mobile.website, NEW);
  });

  test('Play sets the website when the App Store removed the app', () => {
    const mobile = { website: OLD, android: play(), iphone: appStore({ meta: 'removed' }) };
    assert.equal(applyStoreWebsite(mobile, 'android', NEW), null);
    assert.equal(mobile.website, NEW);
  });

  test('a store that is the only one listed sets the website', () => {
    const ios = { website: OLD, iphone: appStore() };
    applyStoreWebsite(ios, 'iphone', NEW);
    assert.equal(ios.website, NEW);
    const sideloaded = { website: OLD, android: play({ playStore: false }), iphone: appStore() };
    applyStoreWebsite(sideloaded, 'iphone', NEW);
    assert.equal(sideloaded.website, NEW);
  });

  test('with both stores listed, neither overrides the other', () => {
    for (const platform of ['android', 'iphone']) {
      const mobile = { website: OLD, android: play(), iphone: appStore() };
      assert.equal(applyStoreWebsite(mobile, platform, NEW), OLD);
      assert.equal(mobile.website, OLD);
    }
  });

  test('with both stores listed, an agreeing or missing value is no conflict', () => {
    const agree = { website: OLD, android: play(), iphone: appStore() };
    assert.equal(applyStoreWebsite(agree, 'android', OLD), null);
    assert.equal(applyStoreWebsite(agree, 'android', ''), null);
    assert.equal(agree.website, OLD);
    const empty = { android: play(), iphone: appStore() };
    applyStoreWebsite(empty, 'iphone', NEW);
    assert.equal(empty.website, NEW);
  });
});
