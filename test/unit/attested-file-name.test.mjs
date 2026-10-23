import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { buildAttestedFileHtml, getAttestedFileNames } from '../../src/assets-table-modal.mjs';
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

  test('each file is a list line: name, hidden download, hyphen, short hash, copy; unnamed drops name and hyphen', () => {
    const named = buildAttestedFileHtml('base.apk', A);
    assert.match(named, />base\.apk<\/span><button data-file-name="base\.apk"[^>]* hidden[ >][^]*<\/button><span [^>]*>-<\/span><span title="a{64}" class="verification-modal-hash">aaaaaaa<\/span><button [^>]*data-hash="a{64}"/);
    const unnamed = buildAttestedFileHtml('', B);
    assert.doesNotMatch(unnamed, /file__name|file__sep/);
    assert.match(unnamed, /^<li [^>]*><button [^]*<\/button><span [^>]*>bbbbbbb<\/span><button [^>]*js-copy-hash/);
  });
});
