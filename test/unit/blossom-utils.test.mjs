import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getBlossomFileURL,
  getBlossomDownloadURL,
  isSafeBlossomFileURL,
  blossomServerUrl,
} from '../../src/blossom-utils.js';

describe('getBlossomFileURL', () => {
  test('builds direct file url from hash', () => {
    const hash = 'a'.repeat(64);
    assert.equal(getBlossomFileURL(hash), `${blossomServerUrl}/${hash}`);
  });

  test('returns empty string for a non-hex hash', () => {
    assert.equal(getBlossomFileURL('not-a-hash'), '');
    assert.equal(getBlossomFileURL(`javascript:alert(1)`), '');
    assert.equal(getBlossomFileURL(`${'a'.repeat(63)}g`), '');
  });
});

describe('isSafeBlossomFileURL', () => {
  const hash = 'a'.repeat(64);
  const safeUrl = `${blossomServerUrl}/${hash}`;

  test('accepts an https blossom blob path', () => {
    assert.equal(isSafeBlossomFileURL(safeUrl), true);
  });

  test('rejects javascript URLs, other hosts, and non-hex paths', () => {
    assert.equal(isSafeBlossomFileURL('javascript:alert(1)'), false);
    assert.equal(isSafeBlossomFileURL(`https://evil.example/${hash}`), false);
    assert.equal(isSafeBlossomFileURL(`${blossomServerUrl}/not-a-hash`), false);
    assert.equal(isSafeBlossomFileURL(`${blossomServerUrl}/${hash}/extra`), false);
    assert.equal(isSafeBlossomFileURL(`${blossomServerUrl}/${hash}?filename=x`), false);
    assert.equal(isSafeBlossomFileURL(`http://files.nostr.info/${hash}`), false);
    assert.equal(isSafeBlossomFileURL(`https://user:pass@files.nostr.info/${hash}`), false);
    assert.equal(isSafeBlossomFileURL(''), false);
    assert.equal(isSafeBlossomFileURL(null), false);
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
