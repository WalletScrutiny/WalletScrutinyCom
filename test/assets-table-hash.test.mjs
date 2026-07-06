import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { getVerificationIdFromHash } from '../src/assets-table-hash.js';

const originalLocation = globalThis.location;

afterEach(() => {
  if (originalLocation) {
    globalThis.location = originalLocation;
  } else {
    delete globalThis.location;
  }
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
