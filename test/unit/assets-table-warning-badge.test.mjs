import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  selectCurrentRowVerifications,
  hasWarningVerification,
} from '../../src/assets-table-paint.js';
import { getRowLookupHashes } from '../../src/assets-table-filters.js';
import {
  verificationKind,
  verificationDraftKind,
  assetBundleRegistrationKind,
} from '../../src/nostr-constants.mjs';
import { HASH_A, HASH_B, HASH_C, makeEvent } from './fixtures.mjs';

// NOT COVERED HERE: that the badge is injected into both version-cell branches of row.innerHTML.
// paintMainAssetsTable needs a real DOM (document.createElement, table rows) and this suite has
// neither a document shim nor jsdom. The hideConfig.wallet:true branch - the one device pages use -
// was confirmed manually against COLDCARD Mk4 6.5.0X on 2026-08-03. The hideConfig.wallet:false
// branch remains unverified by either route.

const ALICE = 'a'.repeat(64);
const BOB = 'b'.repeat(64);

function verification({ id = 'v', pubkey = ALICE, status = 'reproducible', created_at = 100 } = {}) {
  return makeEvent({
    id,
    pubkey,
    kind: verificationKind,
    created_at,
    tags: [['status', status]],
  });
}

function draft({ id = 'd', pubkey = ALICE, status = 'warning', created_at = 100 } = {}) {
  return makeEvent({
    id,
    pubkey,
    kind: verificationDraftKind,
    created_at,
    tags: [['status', status]],
  });
}

describe('hasWarningVerification', () => {
  test('flags a row carrying a published warning', () => {
    const rows = selectCurrentRowVerifications([verification({ status: 'warning' })]);
    assert.equal(hasWarningVerification(rows), true);
  });

  test('does not flag a row with no warning', () => {
    const rows = selectCurrentRowVerifications([
      verification({ id: 'v1', pubkey: ALICE }),
      verification({ id: 'v2', pubkey: BOB }),
    ]);
    assert.equal(hasWarningVerification(rows), false);
  });

  test('ignores a draft warning - an unpublished draft is not a public statement', () => {
    const rows = selectCurrentRowVerifications([draft({ status: 'warning' })]);
    assert.equal(hasWarningVerification(rows), false);
  });

  test('ignores a draft warning even alongside a published non-warning', () => {
    const rows = selectCurrentRowVerifications([
      verification({ id: 'v1', pubkey: ALICE, status: 'reproducible', created_at: 100 }),
      draft({ id: 'd1', pubkey: ALICE, status: 'warning', created_at: 200 }),
    ]);
    assert.equal(hasWarningVerification(rows), false);
  });

  test('a verifier withdraws their own warning by publishing later', () => {
    const rows = selectCurrentRowVerifications([
      verification({ id: 'v1', pubkey: ALICE, status: 'warning', created_at: 100 }),
      verification({ id: 'v2', pubkey: ALICE, status: 'reproducible', created_at: 200 }),
    ]);
    assert.equal(hasWarningVerification(rows), false);
  });

  test('an older reproducible does not override that verifier\'s newer warning', () => {
    const rows = selectCurrentRowVerifications([
      verification({ id: 'v1', pubkey: ALICE, status: 'reproducible', created_at: 100 }),
      verification({ id: 'v2', pubkey: ALICE, status: 'warning', created_at: 200 }),
    ]);
    assert.equal(hasWarningVerification(rows), true);
  });

  test('one verifier cannot clear another verifier\'s warning', () => {
    const rows = selectCurrentRowVerifications([
      verification({ id: 'v1', pubkey: ALICE, status: 'warning', created_at: 100 }),
      verification({ id: 'v2', pubkey: BOB, status: 'reproducible', created_at: 999 }),
    ]);
    assert.equal(hasWarningVerification(rows), true);
  });

  test('empty row is not flagged', () => {
    assert.equal(hasWarningVerification(selectCurrentRowVerifications([])), false);
  });
});

describe('selectCurrentRowVerifications', () => {
  test('keeps only the newest published verification per verifier', () => {
    const selected = selectCurrentRowVerifications([
      verification({ id: 'old', pubkey: ALICE, created_at: 100 }),
      verification({ id: 'new', pubkey: ALICE, created_at: 200 }),
    ]);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].id, 'new');
  });

  test('is order independent', () => {
    const selected = selectCurrentRowVerifications([
      verification({ id: 'new', pubkey: ALICE, created_at: 200 }),
      verification({ id: 'old', pubkey: ALICE, created_at: 100 }),
    ]);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].id, 'new');
  });

  test('keeps one entry per verifier', () => {
    const selected = selectCurrentRowVerifications([
      verification({ id: 'a1', pubkey: ALICE }),
      verification({ id: 'b1', pubkey: BOB }),
    ]);
    assert.equal(selected.length, 2);
  });

  test('keeps every draft as its own entry and never collapses it into the published one', () => {
    const selected = selectCurrentRowVerifications([
      verification({ id: 'v1', pubkey: ALICE, created_at: 100 }),
      draft({ id: 'd1', pubkey: ALICE, created_at: 200 }),
      draft({ id: 'd2', pubkey: ALICE, created_at: 300 }),
    ]);
    assert.equal(selected.length, 3);
    assert.equal(selected.filter(e => e.kind === verificationKind).length, 1);
    assert.equal(selected.filter(e => e.kind === verificationDraftKind).length, 2);
  });
});

describe('getRowLookupHashes', () => {
  const bundle = makeEvent({
    id: 'bundle',
    kind: assetBundleRegistrationKind,
    created_at: 100,
    tags: [
      ['i', 'com.app'],
      ['x', HASH_A, 'base.bin'],
      ['x', HASH_B, 'extra.bin'],
    ],
  });

  test('returns every bundle hash even when a newer single-file event sorts first', () => {
    // The regression this guards: items are sorted newest-first, so a single-file verification
    // published after the bundle lands at items[0]. Deriving hashes from items[0] would narrow the
    // row to one hash and hide a warning attached to the bundle's other file.
    const newerSingleFile = makeEvent({
      id: 'newer',
      kind: verificationKind,
      created_at: 999,
      tags: [['x', HASH_A]],
    });
    const group = { sha256: HASH_A, items: [newerSingleFile, bundle] };

    const hashes = getRowLookupHashes(group, HASH_A);
    assert.deepEqual([...hashes].sort(), [HASH_A, HASH_B].sort());
    assert.ok(hashes.includes(HASH_B), 'non-canonical bundle hash must be looked up');
  });

  test('finds bundle hashes regardless of the bundle event position', () => {
    const group = { sha256: HASH_A, items: [bundle] };
    assert.deepEqual([...getRowLookupHashes(group, HASH_A)].sort(), [HASH_A, HASH_B].sort());
  });

  test('treats any multi-file item as the bundle, not only bundle-kind events', () => {
    const multiFile = makeEvent({
      id: 'multi',
      kind: verificationKind,
      created_at: 10,
      tags: [['x', HASH_B], ['x', HASH_C]],
    });
    const group = { sha256: HASH_B, items: [multiFile] };
    assert.deepEqual([...getRowLookupHashes(group, HASH_B)].sort(), [HASH_B, HASH_C].sort());
  });

  test('single-file row falls back to the supplied hash', () => {
    const single = makeEvent({
      id: 'single',
      kind: verificationKind,
      created_at: 10,
      tags: [['x', HASH_A]],
    });
    const group = { sha256: HASH_A, items: [single] };
    assert.deepEqual(getRowLookupHashes(group, HASH_A), [HASH_A]);
  });

  test('single-file row with no supplied hash falls back to the item\'s own hash', () => {
    const single = makeEvent({
      id: 'single',
      kind: verificationKind,
      created_at: 10,
      tags: [['x', HASH_C]],
    });
    const group = { sha256: undefined, items: [single] };
    assert.deepEqual(getRowLookupHashes(group, undefined), [HASH_C]);
  });

  test('never returns empty-ish entries', () => {
    const empty = makeEvent({ id: 'empty', kind: verificationKind, created_at: 10, tags: [] });
    const group = { sha256: undefined, items: [empty] };
    assert.deepEqual(getRowLookupHashes(group, undefined), []);
  });
});
