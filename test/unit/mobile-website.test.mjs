import { test } from 'node:test';
import assert from 'node:assert/strict';

import { applyStoreWebsite } from '../../scripts/mobileWalletStore.mjs';

const OLD = 'https://old.example/';
const NEW = 'https://new.example/';
const page = (android = {}, iphone = {}) => ({
  website: OLD,
  android: { appId: 'a', meta: 'ok', ...android },
  iphone: { appId: 'i', meta: 'ok', ...iphone }
});

test('the only store still listing the app sets the website', () => {
  for (const gone of [{ meta: 'removed' }, { meta: 'defunct' }, { playStore: 'removed' }, { playStore: false }]) {
    const mobile = page(gone);
    applyStoreWebsite(mobile, 'iphone', NEW);
    assert.equal(mobile.website, NEW);
  }
});

test('stores that agree after normalizing keep one website untouched', () => {
  const mobile = page();
  applyStoreWebsite(mobile, 'android', 'http://www.OLD.example');
  assert.deepEqual(mobile, page());
});

test('stores that disagree keep one website each, then collapse once they agree', () => {
  const mobile = page();
  applyStoreWebsite(mobile, 'iphone', NEW);
  assert.equal(mobile.android.website, OLD);
  assert.equal(mobile.iphone.website, NEW);
  applyStoreWebsite(mobile, 'android', NEW);
  assert.equal(mobile.website, NEW);
  assert.equal(mobile.android.website, undefined);
  assert.equal(mobile.iphone.website, undefined);
});
