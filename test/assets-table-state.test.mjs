import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  setAssetTableResponse,
  getAssetTableResponse,
  setOriginalUrlBeforeModal,
  getOriginalUrlBeforeModal,
  findVerificationByIdInMaps,
} from '../src/assets-table-state.js';
import { makeVerification } from './fixtures.mjs';

describe('asset table response state', () => {
  test('stores and retrieves response object', () => {
    const response = { assets: new Map(), verifications: new Map() };
    setAssetTableResponse(response);
    assert.equal(getAssetTableResponse(), response);
  });

  test('stores original url before modal', () => {
    setOriginalUrlBeforeModal('/verifications/?app=1');
    assert.equal(getOriginalUrlBeforeModal(), '/verifications/?app=1');
  });
});

describe('findVerificationByIdInMaps', () => {
  test('finds verification in published map', () => {
    const verification = makeVerification({
      id: 'verification-1',
      appId: 'com.app',
      platform: 'android',
      version: '1.0.0',
    });
    const response = {
      verifications: new Map([['hash-a', [verification]]]),
      draftVerifications: new Map(),
    };

    assert.deepEqual(findVerificationByIdInMaps(response, 'verification-1'), {
      verification,
      sha256Hash: 'hash-a',
    });
  });

  test('searches draft verifications when not in published map', () => {
    const draft = makeVerification({
      id: 'draft-1',
      appId: 'com.app',
      platform: 'linux',
      version: '2.0.0',
    });
    const response = {
      verifications: new Map(),
      draftVerifications: new Map([['hash-b', [draft]]]),
    };

    assert.equal(findVerificationByIdInMaps(response, 'draft-1').verification.id, 'draft-1');
  });

  test('returns null when id is not found', () => {
    const response = {
      verifications: new Map(),
      draftVerifications: new Map(),
    };
    assert.equal(findVerificationByIdInMaps(response, 'missing'), null);
    assert.equal(findVerificationByIdInMaps(null, 'missing'), null);
  });
});
