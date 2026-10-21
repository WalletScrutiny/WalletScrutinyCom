import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { getAttestedFileNames } from '../../src/assets-table-modal.mjs';
import { assetRegistrationKind, assetBundleRegistrationKind } from '../../src/nostr-constants.mjs';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);

describe('attested file names', () => {
  test('the name on the verification\'s own x tag wins', () => {
    const verification = { tags: [['x', A, 'Bisq-64bit-1.10.9.deb']] };
    const assets = new Map([[A, [{ kind: assetRegistrationKind, tags: [['x', A], ['file-name', 'other.deb']] }]]]);
    assert.equal(getAttestedFileNames(verification, assets).get(A), 'Bisq-64bit-1.10.9.deb');
  });

  test('a bare hash takes its name from the asset registration, single or bundle', () => {
    const verification = { tags: [['x', A], ['x', B]] };
    const assets = new Map([
      [A, [{ kind: assetRegistrationKind, tags: [['x', A], ['file-name', 'Bisq-64bit-1.10.9.deb']] }]],
      [B, [{ kind: assetBundleRegistrationKind, tags: [['x', A, 'a.deb'], ['x', B, 'b.dmg']] }]],
    ]);
    const names = getAttestedFileNames(verification, assets);
    assert.equal(names.get(A), 'Bisq-64bit-1.10.9.deb');
    assert.equal(names.get(B), 'b.dmg');
  });

  test('a hash nobody named maps to an empty name, and no assets is fine', () => {
    assert.equal(getAttestedFileNames({ tags: [['x', A]] }, undefined).get(A), '');
  });
});
