import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { mergeBundleAssetRows, fingerprintAllAssetInformation } from '../../src/assets-table-filters.js';
import { assetBundleRegistrationKind } from '../../src/nostr-constants.mjs';
import { HASH_A, HASH_B, makeEvent } from './fixtures.mjs';

function makeGroup({ sha256, items }) {
  return { sha256, items };
}

describe('mergeBundleAssetRows', () => {
  test('merges groups that share the same bundle dedup key', () => {
    const bundleItem = makeEvent({
      kind: assetBundleRegistrationKind,
      tags: [
        ['i', 'com.app'],
        ['platform', 'android'],
        ['version', '1.0.0'],
        ['x', HASH_A, 'base.apk'],
        ['x', HASH_B, 'split.apk'],
      ],
    });

    const groups = [
      makeGroup({ sha256: HASH_A, items: [bundleItem] }),
      makeGroup({ sha256: HASH_B, items: [{ ...bundleItem, id: 'other-id' }] }),
    ];

    const merged = mergeBundleAssetRows(groups);
    assert.equal(merged.length, 1);
    assert.equal(merged[0].items.length, 2);
  });

  test('keeps legacy single-file groups separate', () => {
    const legacy = makeGroup({
      sha256: HASH_A,
      items: [makeEvent({ tags: [['x', HASH_A], ['file-name', 'app.deb']] })],
    });
    const merged = mergeBundleAssetRows([legacy]);
    assert.deepEqual(merged, [legacy]);
  });

  test('uses requested sha256 when present in bundle hashes', () => {
    const bundleItem = makeEvent({
      kind: assetBundleRegistrationKind,
      tags: [
        ['x', HASH_A, 'base.apk'],
        ['x', HASH_B, 'split.apk'],
      ],
    });
    const groups = [makeGroup({ sha256: HASH_A, items: [bundleItem] })];
    const merged = mergeBundleAssetRows(groups, HASH_B);
    assert.equal(merged[0].sha256, HASH_B);
  });
});

describe('fingerprintAllAssetInformation', () => {
  test('returns empty string for incomplete input', () => {
    assert.equal(fingerprintAllAssetInformation(null), '');
    assert.equal(fingerprintAllAssetInformation({ assets: new Map() }), '');
  });

  test('produces stable fingerprint for identical maps', () => {
    const verification = makeEvent({ id: 'v1', tags: [['status', 'reproducible']] });
    const info = {
      assets: new Map([['hash-a', [{ id: 'asset-1' }]]]),
      verifications: new Map([['hash-a', [verification]]]),
      draftVerifications: new Map(),
      oldestEventTimestamp: 100,
    };
    const fp1 = fingerprintAllAssetInformation(info);
    const fp2 = fingerprintAllAssetInformation({
      assets: new Map([['hash-a', [{ id: 'asset-1' }]]]),
      verifications: new Map([['hash-a', [verification]]]),
      draftVerifications: new Map(),
      oldestEventTimestamp: 100,
    });
    assert.equal(fp1, fp2);
    assert.ok(fp1.includes('hash-a=asset-1'));
    assert.ok(fp1.includes('v1'));
  });

  test('changes when event ids differ', () => {
    const base = {
      assets: new Map(),
      verifications: new Map([['hash-a', [{ id: 'v1' }]]]),
      draftVerifications: new Map(),
      oldestEventTimestamp: 1,
    };
    const other = {
      ...base,
      verifications: new Map([['hash-a', [{ id: 'v2' }]]]),
    };
    assert.notEqual(fingerprintAllAssetInformation(base), fingerprintAllAssetInformation(other));
  });
});
