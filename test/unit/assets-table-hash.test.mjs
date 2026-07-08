import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  getVerificationIdFromHash,
  findCachedGlobalAssetInfo,
} from '../../src/assets-table-hash.js';
import { HASH_A, makeVerification } from './fixtures.mjs';

const originalLocation = globalThis.location;
const originalAllAssetInformation = globalThis.window.allAssetInformation;

afterEach(() => {
  if (originalLocation) {
    globalThis.location = originalLocation;
  } else {
    delete globalThis.location;
  }
  globalThis.window.allAssetInformation = originalAllAssetInformation;
});

function setLocationHash(hash) {
  globalThis.location = { hash };
}

describe('getVerificationIdFromHash', () => {
  test('returns verification id from hash fragment', () => {
    setLocationHash('#verificationId=abc123');
    assert.equal(getVerificationIdFromHash(), 'abc123');
  });

  test('returns null for unrelated hash fragments', () => {
    setLocationHash('#section=top');
    assert.equal(getVerificationIdFromHash(), null);
  });

  test('returns null when hash is empty', () => {
    setLocationHash('');
    assert.equal(getVerificationIdFromHash(), null);
  });
});

describe('findCachedGlobalAssetInfo', () => {
  test('returns null without verification id or cached asset info', () => {
    globalThis.window.allAssetInformation = undefined;
    assert.equal(findCachedGlobalAssetInfo('com.app', null), null);
    assert.equal(findCachedGlobalAssetInfo('com.app', 'verification-1'), null);
  });

  test('returns cached asset info when verification id and app id match', () => {
    const verification = makeVerification({
      id: 'verification-1',
      appId: 'com.app',
      platform: 'android',
      version: '1.0.0',
      extraTags: [['x', HASH_A]],
    });
    const cached = {
      verifications: new Map([[HASH_A, [verification]]]),
      draftVerifications: new Map(),
      assets: new Map(),
    };
    globalThis.window.allAssetInformation = cached;

    assert.equal(findCachedGlobalAssetInfo('com.app', 'verification-1'), cached);
    assert.equal(findCachedGlobalAssetInfo('com.other', 'verification-1'), null);
  });

  test('ignores app id filter when effective app id is not provided', () => {
    const verification = makeVerification({
      id: 'verification-2',
      appId: 'com.app',
      platform: 'android',
      version: '2.0.0',
      extraTags: [['x', HASH_A]],
    });
    const cached = {
      verifications: new Map([[HASH_A, [verification]]]),
      draftVerifications: new Map(),
      assets: new Map(),
    };
    globalThis.window.allAssetInformation = cached;

    assert.equal(findCachedGlobalAssetInfo(null, 'verification-2'), cached);
  });
});
