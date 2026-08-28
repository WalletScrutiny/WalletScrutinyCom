import './setup.mjs';
import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  setAssetTableResponse,
  getAssetTableResponse,
  setOriginalUrlBeforeModal,
  getOriginalUrlBeforeModal,
  findVerificationByIdInMaps,
  resolveVerificationById,
  indexVerificationsFromAssetInfo,
  clearVerificationIndex,
  eventIdsMatch,
} from '../../src/assets-table-state.mjs';
import { HASH_A, HASH_B, makeVerification } from './fixtures.mjs';

beforeEach(() => {
  clearVerificationIndex();
  setAssetTableResponse(null);
  globalThis.window.allAssetInformation = undefined;
});

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

describe('eventIdsMatch', () => {
  test('matches event ids case-insensitively', () => {
    const id = '8b0bf12ebeb4ca0e5eeb8637a1353c0297a5061204cbc0e9e2905462f45bf040';
    assert.equal(eventIdsMatch(id, id.toUpperCase()), true);
    assert.equal(eventIdsMatch(id, 'other'), false);
    assert.equal(eventIdsMatch('', ''), false);
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

describe('resolveVerificationById', () => {
  test('finds a painted verification after the table response is replaced', () => {
    const androidVerification = makeVerification({
      id: HASH_A,
      appId: 'com.app.android',
      platform: 'android',
      version: '1.0.0',
    });
    const androidData = {
      verifications: new Map([['hash-android', [androidVerification]]]),
      draftVerifications: new Map(),
    };
    setAssetTableResponse(androidData);

    const iphoneData = {
      verifications: new Map(),
      draftVerifications: new Map(),
    };
    setAssetTableResponse(iphoneData);

    const found = resolveVerificationById(HASH_A);
    assert.equal(found.verification, androidVerification);
    assert.equal(found.sha256Hash, 'hash-android');
  });

  test('finds a verification from the painted index after skip-repaint overwrite', () => {
    const verification = makeVerification({
      id: HASH_B,
      appId: 'com.app',
      platform: 'linux',
      version: '2.0.0',
    });
    indexVerificationsFromAssetInfo({
      verifications: new Map([['hash-b', [verification]]]),
      draftVerifications: new Map(),
    });
    setAssetTableResponse({
      verifications: new Map(),
      draftVerifications: new Map(),
    });

    assert.equal(resolveVerificationById(HASH_B).verification.id, HASH_B);
  });

  test('falls back to window.allAssetInformation', () => {
    const verification = makeVerification({
      id: HASH_A,
      appId: 'com.app',
      platform: 'android',
      version: '1.0.0',
    });
    globalThis.window.allAssetInformation = {
      verifications: new Map([['hash-global', [verification]]]),
      draftVerifications: new Map(),
    };

    const found = resolveVerificationById(HASH_A);
    assert.equal(found.verification, verification);
    assert.equal(found.sha256Hash, 'hash-global');
  });
});
