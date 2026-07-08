import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { sha256, sha256FromBlob } from '../../src/blossom.js';

describe('sha256', () => {
  test('hashes array buffer data', async () => {
    const data = new TextEncoder().encode('walletscrutiny').buffer;
    const hash = await sha256(data);
    assert.equal(hash.length, 64);
    assert.match(hash, /^[0-9a-f]{64}$/);
  });

  test('hashes blob contents', async () => {
    const blob = new Blob(['test payload'], { type: 'text/plain' });
    const hash = await sha256FromBlob(blob);
    assert.equal(hash.length, 64);
  });
});
