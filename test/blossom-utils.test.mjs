import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getBlossomFileURL,
  getBlossomDownloadURL,
  blossomServerUrl,
} from '../src/blossom-utils.js';

describe('getBlossomFileURL', () => {
  test('builds direct file url from hash', () => {
    const hash = 'a'.repeat(64);
    assert.equal(getBlossomFileURL(hash), `${blossomServerUrl}/${hash}`);
  });
});

describe('getBlossomDownloadURL', () => {
  test('adds filename query parameter when provided', () => {
    const hash = 'b'.repeat(64);
    const url = new URL(getBlossomDownloadURL(hash, 'wallet.apk'));
    assert.equal(url.pathname, `/${hash}`);
    assert.equal(url.searchParams.get('filename'), 'wallet.apk');
  });

  test('omits query string when filename is absent', () => {
    const hash = 'c'.repeat(64);
    const url = getBlossomDownloadURL(hash);
    assert.equal(url, `${blossomServerUrl}/${hash}`);
  });
});
