import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'crypto';

import { getAssetAttemptKey } from '../asset-utils.mjs';
import { assetBundleRegistrationKind, assetRegistrationKind } from '../nostr-constants.mjs';

const BASE = 'a'.repeat(64);
const ARM64 = 'b'.repeat(64);
const EN = 'c'.repeat(64);
const ES = 'd'.repeat(64);

function bundle(files) {
  return {
    kind: assetBundleRegistrationKind,
    tags: files.map(([hash, name]) => ['x', hash, name]),
  };
}

describe('getAssetAttemptKey', () => {
  test('is the file hash for a single-file asset', () => {
    const asset = { kind: assetRegistrationKind, tags: [['x', BASE], ['file-name', 'app.apk']] };
    assert.equal(getAssetAttemptKey(asset), BASE);
  });

  test('is the sha256 of the sorted hashes for a split set, whatever the tag order', () => {
    const expected = createHash('sha256').update([BASE, ARM64, EN].sort().join(',')).digest('hex');
    const forward = bundle([[BASE, 'base.apk'], [ARM64, 'split_config.arm64_v8a.apk'], [EN, 'split_config.en.apk']]);
    const reversed = bundle([[EN, 'split_config.en.apk'], [ARM64, 'split_config.arm64_v8a.apk'], [BASE, 'base.apk']]);
    assert.equal(getAssetAttemptKey(forward), expected);
    assert.equal(getAssetAttemptKey(reversed), expected);
  });

  test('differs between split sets that share base.apk', () => {
    const english = bundle([[BASE, 'base.apk'], [ARM64, 'split_config.arm64_v8a.apk'], [EN, 'split_config.en.apk']]);
    const spanish = bundle([[BASE, 'base.apk'], [ARM64, 'split_config.arm64_v8a.apk'], [ES, 'split_config.es.apk']]);
    assert.notEqual(getAssetAttemptKey(english), getAssetAttemptKey(spanish));
  });

  test('is null when the asset lists no file hashes', () => {
    assert.equal(getAssetAttemptKey({ kind: assetBundleRegistrationKind, tags: [] }), null);
  });
});
