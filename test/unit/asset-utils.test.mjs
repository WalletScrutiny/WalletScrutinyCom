import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isAssetRegistrationKind,
  isAssetBundleRegistrationKind,
  getAssetFileEntries,
  pickScriptBinaryEntry,
  getAssetBundleDedupKey,
  getLegacyAssetLookupHash,
  getAssetIndexHashes,
  bundleHasFullVerification,
  parseHashListInput,
  buildVerificationHashTags,
} from '../../src/asset-utils.mjs';
import {
  assetRegistrationKind,
  assetBundleRegistrationKind,
} from '../../src/nostr-constants.mjs';
import { HASH_A, HASH_B, HASH_C, makeAsset, makeVerification } from './fixtures.mjs';

describe('isAssetRegistrationKind', () => {
  test('recognizes asset and bundle registration kinds', () => {
    assert.equal(isAssetRegistrationKind(assetRegistrationKind), true);
    assert.equal(isAssetRegistrationKind(assetBundleRegistrationKind), true);
    assert.equal(isAssetRegistrationKind(1), false);
  });
});

describe('isAssetBundleRegistrationKind', () => {
  test('matches only bundle kind', () => {
    assert.equal(isAssetBundleRegistrationKind(assetBundleRegistrationKind), true);
    assert.equal(isAssetBundleRegistrationKind(assetRegistrationKind), false);
  });
});

describe('getAssetFileEntries', () => {
  test('returns empty array when tags are missing', () => {
    assert.deepEqual(getAssetFileEntries({}), []);
  });

  test('parses single-hash legacy asset with file-name', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A], fileName: 'app.deb' });
    assert.deepEqual(getAssetFileEntries(asset), [{ hash: HASH_A, fileName: 'app.deb' }]);
  });

  test('parses bundle asset with per-file names', () => {
    const asset = makeAsset({
      appId: 'a',
      platform: 'android',
      kind: assetBundleRegistrationKind,
      hashes: [HASH_A, HASH_B],
      fileName: ['base.apk', 'split.apk'],
    });
    assert.deepEqual(getAssetFileEntries(asset), [
      { hash: HASH_A, fileName: 'base.apk' },
      { hash: HASH_B, fileName: 'split.apk' },
    ]);
  });

  test('ignores x tags that are not 64-char hashes', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: ['short'] });
    assert.deepEqual(getAssetFileEntries(asset), []);
  });
});

describe('pickScriptBinaryEntry', () => {
  test('returns null when no file entries exist', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [] });
    assert.equal(pickScriptBinaryEntry(asset), null);
  });

  test('returns the only entry for single-file assets', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A], fileName: 'app.deb' });
    assert.deepEqual(pickScriptBinaryEntry(asset), { hash: HASH_A, fileName: 'app.deb' });
  });

  test('prefers platform-specific binary extensions in bundles', () => {
    const asset = makeAsset({
      appId: 'a',
      platform: 'android',
      kind: assetBundleRegistrationKind,
      hashes: [HASH_A, HASH_B],
      fileName: ['metadata.json', 'app.apk'],
    });
    assert.equal(pickScriptBinaryEntry(asset).fileName, 'app.apk');
  });
});

describe('getAssetBundleDedupKey', () => {
  test('returns null when no hashes exist', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [] });
    assert.equal(getAssetBundleDedupKey(asset), null);
  });

  test('sorts hashes for stable dedup key', () => {
    const asset = makeAsset({
      appId: 'a',
      platform: 'android',
      kind: assetBundleRegistrationKind,
      hashes: [HASH_B, HASH_A],
      fileName: ['b.apk', 'a.apk'],
    });
    assert.equal(getAssetBundleDedupKey(asset), `bundle:${HASH_A}:${HASH_B}`);
  });
});

describe('getLegacyAssetLookupHash', () => {
  test('uses second hash for split-android legacy assets', () => {
    const asset = makeAsset({ appId: 'a', platform: 'android', hashes: [HASH_A, HASH_B] });
    assert.equal(getLegacyAssetLookupHash(asset), HASH_B);
  });

  test('uses first hash when only one x tag exists', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A] });
    assert.equal(getLegacyAssetLookupHash(asset), HASH_A);
  });
});

describe('getAssetIndexHashes', () => {
  test('returns all bundle hashes for bundle assets', () => {
    const asset = makeAsset({
      appId: 'a',
      platform: 'android',
      kind: assetBundleRegistrationKind,
      hashes: [HASH_A, HASH_B],
      fileName: ['a.apk', 'b.apk'],
    });
    assert.deepEqual(getAssetIndexHashes(asset), [HASH_A, HASH_B]);
  });

  test('returns legacy lookup hash for non-bundle assets', () => {
    const asset = makeAsset({ appId: 'a', platform: 'android', hashes: [HASH_A, HASH_B] });
    assert.deepEqual(getAssetIndexHashes(asset), [HASH_B]);
  });
});

describe('bundleHasFullVerification', () => {
  test('returns false when asset has no hashes', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [] });
    assert.equal(bundleHasFullVerification(asset, new Map()), false);
  });

  test('returns true when a verification lists every bundle hash', () => {
    const asset = makeAsset({
      appId: 'a',
      platform: 'android',
      kind: assetBundleRegistrationKind,
      hashes: [HASH_A, HASH_B],
      fileName: ['a.apk', 'b.apk'],
    });
    const verification = makeVerification({
      appId: 'a',
      platform: 'android',
      version: '1.0.0',
      extraTags: [['x', HASH_A], ['x', HASH_B]],
    });
    const map = new Map([[HASH_A, [verification]]]);
    assert.equal(bundleHasFullVerification(asset, map), true);
  });

  test('returns false when verification is missing a required hash', () => {
    const asset = makeAsset({
      appId: 'a',
      platform: 'android',
      kind: assetBundleRegistrationKind,
      hashes: [HASH_A, HASH_B],
      fileName: ['a.apk', 'b.apk'],
    });
    const verification = makeVerification({
      appId: 'a',
      platform: 'android',
      version: '1.0.0',
      extraTags: [['x', HASH_A]],
    });
    const map = new Map([[HASH_A, [verification]]]);
    assert.equal(bundleHasFullVerification(asset, map), false);
  });
});

describe('parseHashListInput', () => {
  const upperA = HASH_A.toUpperCase();

  test('takes bare hashes, one per line, lower-cased and de-duplicated', () => {
    const { entries, invalidLines } = parseHashListInput(`${upperA}\n\n${HASH_B}\n${HASH_A}\n`);
    assert.deepEqual(entries, [
      { sha256: HASH_A, fileName: null },
      { sha256: HASH_B, fileName: null },
    ]);
    assert.deepEqual(invalidLines, []);
  });

  test('reads sha256sum output, including binary-mode markers', () => {
    const { entries } = parseHashListInput(`${HASH_A}  base.apk\n${HASH_B} *split_config.arm64_v8a.apk`);
    assert.deepEqual(entries, [
      { sha256: HASH_A, fileName: 'base.apk' },
      { sha256: HASH_B, fileName: 'split_config.arm64_v8a.apk' },
    ]);
  });

  test('reads "file: hash" and BSD "SHA256 (file) = hash" forms', () => {
    const { entries } = parseHashListInput(`wallet.dmg: ${HASH_A}\nSHA256 (wallet.deb) = ${HASH_B}`);
    assert.deepEqual(entries, [
      { sha256: HASH_A, fileName: 'wallet.dmg' },
      { sha256: HASH_B, fileName: 'wallet.deb' },
    ]);
  });

  test('several hashes on one line are all taken without a file name', () => {
    const { entries } = parseHashListInput(`${HASH_A} ${HASH_B}, ${HASH_C}`);
    assert.deepEqual(entries.map(entry => entry.sha256), [HASH_A, HASH_B, HASH_C]);
    assert.ok(entries.every(entry => entry.fileName === null));
  });

  test('keeps the first file name seen for a repeated hash', () => {
    const { entries } = parseHashListInput(`${HASH_A} base.apk\n${HASH_A} other.apk`);
    assert.deepEqual(entries, [{ sha256: HASH_A, fileName: 'base.apk' }]);
  });

  test('reports lines without a hash as invalid and keeps going', () => {
    const { entries, invalidLines } = parseHashListInput(`not a hash\n${HASH_A.slice(0, 63)}\n${HASH_B}`);
    assert.deepEqual(entries, [{ sha256: HASH_B, fileName: null }]);
    assert.deepEqual(invalidLines, ['not a hash', HASH_A.slice(0, 63)]);
  });

  test('tolerates empty input', () => {
    assert.deepEqual(parseHashListInput(''), { entries: [], invalidLines: [] });
    assert.deepEqual(parseHashListInput(null), { entries: [], invalidLines: [] });
  });
});

describe('buildVerificationHashTags', () => {
  test('adds the file name as third element only when one is known', () => {
    assert.deepEqual(
      buildVerificationHashTags([HASH_A, HASH_B], { [HASH_A]: 'base.apk', [HASH_B]: '   ' }),
      [['x', HASH_A, 'base.apk'], ['x', HASH_B]],
    );
  });

  test('accepts a Map and no names at all', () => {
    assert.deepEqual(
      buildVerificationHashTags([HASH_A], new Map([[HASH_A, 'a.bin']])),
      [['x', HASH_A, 'a.bin']],
    );
    assert.deepEqual(buildVerificationHashTags([HASH_A]), [['x', HASH_A]]);
    assert.deepEqual(buildVerificationHashTags([HASH_A], null), [['x', HASH_A]]);
  });
});
