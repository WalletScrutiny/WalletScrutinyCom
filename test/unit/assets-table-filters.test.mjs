import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  mergeBundleAssetRows,
  fingerprintAllAssetInformation,
  findMultiFileItemInGroup,
  getRowLookupHashes,
  attestationMatchesRowHashes,
} from '../../src/assets-table-filters.mjs';
import { getAssetFileEntries } from '../../src/asset-utils.mjs';
import { assetBundleRegistrationKind, verificationKind } from '../../src/nostr-constants.mjs';
import { HASH_A, HASH_B, HASH_C, HASH_D, HASH_E, makeEvent } from './fixtures.mjs';

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

  test('keeps overlapping split-APK hash sets as separate rows (#974)', () => {
    const wsa = makeEvent({
      id: 'wsa',
      kind: assetBundleRegistrationKind,
      created_at: 100,
      tags: [
        ['x', HASH_A, 'base.apk'],
        ['x', HASH_B, 'split_config.arm64_v8a.apk'],
        ['x', HASH_C, 'split_config.xxhdpi.apk'],
        ['x', HASH_E, 'split_config.es.apk'],
      ],
    });
    const danny = makeEvent({
      id: 'danny',
      kind: verificationKind,
      created_at: 200,
      tags: [
        ['x', HASH_A],
        ['x', HASH_B],
        ['x', HASH_C],
        ['x', HASH_D],
      ],
    });

    const byHash = new Map();
    for (const event of [wsa, danny]) {
      for (const hash of getAssetFileEntries(event).map(entry => entry.hash)) {
        const items = byHash.get(hash) || [];
        items.push(event);
        byHash.set(hash, items);
      }
    }
    const groups = [...byHash.entries()].map(([sha256, items]) => ({
      sha256,
      items: [...items].sort((a, b) => b.created_at - a.created_at),
    }));

    const merged = mergeBundleAssetRows(groups);
    assert.equal(merged.length, 2);

    const hashesOf = row => getAssetFileEntries(findMultiFileItemInGroup(row))
      .map(entry => entry.hash)
      .sort();
    const wsaRow = merged.find(row => hashesOf(row).includes(HASH_E));
    const dannyRow = merged.find(row => hashesOf(row).includes(HASH_D));

    assert.ok(wsaRow);
    assert.ok(dannyRow);
    assert.equal(wsaRow.items.some(item => item.id === 'danny'), false);
    assert.equal(wsaRow.items.some(item => item.id === 'wsa'), true);
    assert.equal(dannyRow.items.some(item => item.id === 'danny'), true);
    assert.ok(
      getAssetFileEntries(findMultiFileItemInGroup(wsaRow))
        .some(entry => entry.fileName === 'split_config.es.apk'),
    );

    const wsaLookup = getRowLookupHashes(wsaRow, wsaRow.sha256);
    const dannyLookup = getRowLookupHashes(dannyRow, dannyRow.sha256);
    assert.equal(attestationMatchesRowHashes(danny, wsaLookup), false);
    assert.equal(attestationMatchesRowHashes(danny, dannyLookup), true);
  });

  test('attaches a single-file verification to every overlapping bundle that contains that hash', () => {
    const wsa = makeEvent({
      id: 'wsa',
      kind: assetBundleRegistrationKind,
      created_at: 100,
      tags: [
        ['x', HASH_A, 'base.apk'],
        ['x', HASH_E, 'split_config.es.apk'],
      ],
    });
    const other = makeEvent({
      id: 'other',
      kind: assetBundleRegistrationKind,
      created_at: 110,
      tags: [
        ['x', HASH_A, 'base.apk'],
        ['x', HASH_D, 'split_config.en.apk'],
      ],
    });
    const warning = makeEvent({
      id: 'warn',
      kind: verificationKind,
      created_at: 300,
      tags: [['x', HASH_A], ['status', 'warning']],
    });

    const groups = [
      makeGroup({ sha256: HASH_A, items: [warning, other, wsa] }),
      makeGroup({ sha256: HASH_E, items: [wsa] }),
      makeGroup({ sha256: HASH_D, items: [other] }),
    ];
    const merged = mergeBundleAssetRows(groups);
    assert.equal(merged.length, 2);
    for (const row of merged) {
      assert.ok(row.items.some(item => item.id === 'warn'));
    }
  });
});

describe('attestationMatchesRowHashes', () => {
  const fourHashes = [HASH_A, HASH_B, HASH_C, HASH_D];
  const overlappingFour = [HASH_A, HASH_B, HASH_C, HASH_E];

  test('matches a multi-file verification only against the exact hash set', () => {
    const verification = makeEvent({
      kind: verificationKind,
      tags: fourHashes.map(hash => ['x', hash]),
    });
    assert.equal(attestationMatchesRowHashes(verification, fourHashes), true);
    assert.equal(attestationMatchesRowHashes(verification, [...fourHashes].reverse()), true);
    assert.equal(attestationMatchesRowHashes(verification, overlappingFour), false);
  });

  test('matches a single-file verification when the row contains that hash', () => {
    const verification = makeEvent({
      kind: verificationKind,
      tags: [['x', HASH_A]],
    });
    assert.equal(attestationMatchesRowHashes(verification, overlappingFour), true);
    assert.equal(attestationMatchesRowHashes(verification, [HASH_D]), false);
  });

  test('rejects empty hash lists', () => {
    const verification = makeEvent({ kind: verificationKind, tags: [['x', HASH_A]] });
    assert.equal(attestationMatchesRowHashes(verification, []), false);
    assert.equal(attestationMatchesRowHashes(makeEvent({ tags: [] }), [HASH_A]), false);
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
