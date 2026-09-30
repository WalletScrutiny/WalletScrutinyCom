import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

import {
  getFirstTagValue,
  getAssetHashesDigest,
  getVerificationReplaceableKey,
  getStatusText,
} from '../../src/verifications_common.mjs';
import { makeEvent } from './fixtures.mjs';

const HASH = 'a'.repeat(64);

describe('getFirstTagValue', () => {
  test('returns the first matching tag value', () => {
    const event = makeEvent({ tags: [['x', 'first'], ['x', 'second']] });
    assert.equal(getFirstTagValue(event, 'x'), 'first');
  });

  test('returns default when tag is missing', () => {
    const event = makeEvent({ tags: [['i', 'app']] });
    assert.equal(getFirstTagValue(event, 'x'), '');
    assert.equal(getFirstTagValue(event, 'x', 'fallback'), 'fallback');
  });
});

describe('getAssetHashesDigest', () => {
  test('returns empty string for empty input', () => {
    assert.equal(getAssetHashesDigest([]), '');
    assert.equal(getAssetHashesDigest(null), '');
  });

  test('returns sole hash unchanged', () => {
    assert.equal(getAssetHashesDigest([HASH]), HASH);
  });

  test('sorts, concatenates, and re-hashes multiple hashes', () => {
    const hashA = 'a'.repeat(64);
    const hashB = 'b'.repeat(64);
    const expected = bytesToHex(sha256(new TextEncoder().encode(hashA + hashB)));
    assert.equal(getAssetHashesDigest([hashB, hashA]), expected);
  });
});

describe('getVerificationReplaceableKey', () => {
  test('builds key without app id', () => {
    assert.equal(getVerificationReplaceableKey('', '1.0.0', 'android'), '1.0.0:android');
  });

  test('builds key with app id and hash digest', () => {
    assert.equal(
      getVerificationReplaceableKey('app.id', '2.0.0', 'linux', [HASH]),
      `app.id:2.0.0:linux:${HASH}`,
    );
  });
});

describe('getStatusText', () => {
  test('returns long labels by default', () => {
    assert.equal(getStatusText('reproducible'), 'Reproducible when tested');
    assert.equal(getStatusText('not_reproducible'), 'Not reproducible from source provided, or differences are significant');
    assert.equal(getStatusText('ftbfs'), 'Failed to build from source provided');
  });

  test('returns short labels when requested', () => {
    assert.equal(getStatusText('not_reproducible', true), 'Not reproducible');
    assert.equal(getStatusText('spam', true), 'Spam');
    assert.equal(getStatusText('nosource', true), 'Source not found');
  });

  test('passes through unknown status values', () => {
    assert.equal(getStatusText('custom_status'), 'custom_status');
  });
});
