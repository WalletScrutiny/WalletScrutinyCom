import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { classifiedIdsFromReports } from '../../src/verifications_utils.mjs';
import {
  hasWarningVerification,
  renderVersionWarningBadge,
  selectCurrentRowVerifications,
} from '../../src/assets-table-paint.js';
import { siteAdminPubkeys, verificationKind, verificationReportKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

// Companion to verification-reports.test.mjs, which covers the hiding-only view. This file covers
// the warning reason: reports that flag a verification while leaving it visible.
//
// NOT COVERED: that the badge reaches the rendered table. paintMainAssetsTable needs a real DOM and
// this suite has no document shim or jsdom.

const VERIFICATION_A = 'a'.repeat(64);
const VERIFICATION_B = 'b'.repeat(64);
const ADMIN = siteAdminPubkeys[0];
const NON_ADMIN = 'f'.repeat(64);

function makeReport({ pubkey = ADMIN, eTags = [VERIFICATION_A], reason = 'warning' } = {}) {
  const tags = eTags.map(id => ['e', id]);
  if (reason != null) {
    tags.push(['r', reason]);
  }
  return makeEvent({ id: `report-${reason}-${eTags[0].slice(0, 6)}`, pubkey, kind: verificationReportKind, tags });
}

describe('classifiedIdsFromReports — warning reason', () => {
  test('an admin warning flags without hiding', () => {
    const { hidden, warned } = classifiedIdsFromReports([makeReport()], [VERIFICATION_A]);
    assert.deepEqual([...warned], [VERIFICATION_A]);
    assert.equal(hidden.size, 0, 'a warning must never remove the verification');
  });

  test('a warning from a non-admin is ignored entirely', () => {
    // Warnings must not be a backdoor to hiding, and a stranger must not be able to brand a
    // verification with a red badge.
    const { hidden, warned } = classifiedIdsFromReports(
      [makeReport({ pubkey: NON_ADMIN })], [VERIFICATION_A]);
    assert.equal(warned.size, 0);
    assert.equal(hidden.size, 0);
  });

  test('hiding wins when the same verification is both warned and hidden', () => {
    const { hidden, warned } = classifiedIdsFromReports([
      makeReport({ reason: 'warning' }),
      makeReport({ reason: 'spam' }),
    ], [VERIFICATION_A]);
    assert.equal(hidden.has(VERIFICATION_A), true);
    assert.equal(warned.has(VERIFICATION_A), false, 'a hidden verification must not also be warned');
  });

  test('a warning cannot reach verifications outside the requested ids', () => {
    const { hidden, warned } = classifiedIdsFromReports(
      [makeReport({ eTags: [VERIFICATION_A, VERIFICATION_B] })], [VERIFICATION_A]);
    assert.deepEqual([...warned], [VERIFICATION_A]);
    // Pin the invariant on both sets: an id we did not ask about must not appear anywhere, not
    // merely fail to be warned.
    assert.equal(warned.has(VERIFICATION_B), false);
    assert.equal(hidden.has(VERIFICATION_B), false);
  });

  test('an unrecognised reason neither warns nor hides', () => {
    const { hidden, warned } = classifiedIdsFromReports(
      [makeReport({ reason: 'somethingelse' })], [VERIFICATION_A]);
    assert.equal(hidden.size, 0);
    assert.equal(warned.size, 0);
  });

  test('a missing reason neither warns nor hides', () => {
    const { hidden, warned } = classifiedIdsFromReports(
      [makeReport({ reason: null })], [VERIFICATION_A]);
    assert.equal(hidden.size, 0);
    assert.equal(warned.size, 0);
  });

  test('every site admin can warn, not only the first', () => {
    for (const admin of siteAdminPubkeys) {
      const { warned } = classifiedIdsFromReports(
        [makeReport({ pubkey: admin })], [VERIFICATION_A]);
      assert.equal(warned.has(VERIFICATION_A), true, `expected ${admin} to be able to warn`);
    }
  });

  test('warnings and hides on different verifications both survive', () => {
    const { hidden, warned } = classifiedIdsFromReports([
      makeReport({ reason: 'warning', eTags: [VERIFICATION_A] }),
      makeReport({ reason: 'spam', eTags: [VERIFICATION_B] }),
    ], [VERIFICATION_A, VERIFICATION_B]);
    assert.deepEqual([...warned], [VERIFICATION_A]);
    assert.deepEqual([...hidden], [VERIFICATION_B]);
  });
});

describe('hasWarningVerification with admin warning reports', () => {
  const reproducible = makeEvent({
    id: VERIFICATION_A,
    pubkey: 'd'.repeat(64),
    kind: verificationKind,
    created_at: 100,
    tags: [['status', 'reproducible']],
  });

  test('a reproducible verification is flagged when an admin warned it', () => {
    const rows = selectCurrentRowVerifications([reproducible]);
    assert.equal(hasWarningVerification(rows, new Set([VERIFICATION_A])), true);
  });

  test('the same verification is not flagged without the report', () => {
    const rows = selectCurrentRowVerifications([reproducible]);
    assert.equal(hasWarningVerification(rows, new Set()), false);
  });

  test('a warned id belonging to another verification does not flag this row', () => {
    const rows = selectCurrentRowVerifications([reproducible]);
    assert.equal(hasWarningVerification(rows, new Set([VERIFICATION_B])), false);
  });

  test('omitting the set keeps the status-only behaviour', () => {
    const rows = selectCurrentRowVerifications([reproducible]);
    assert.equal(hasWarningVerification(rows), false);
  });
});

describe('renderVersionWarningBadge copy', () => {
  const reproducible = makeEvent({
    id: VERIFICATION_A,
    pubkey: 'd'.repeat(64),
    kind: verificationKind,
    created_at: 100,
    tags: [['status', 'reproducible']],
  });
  const statusWarning = makeEvent({
    id: VERIFICATION_B,
    pubkey: 'd'.repeat(64),
    kind: verificationKind,
    created_at: 100,
    tags: [['status', 'warning']],
  });

  test('renders nothing when the row is not flagged', () => {
    assert.equal(renderVersionWarningBadge([reproducible], new Set()), '');
  });

  test('a status-sourced warning points at the Warning verification card', () => {
    const html = renderVersionWarningBadge([statusWarning], new Set());
    assert.ok(html.includes('⚠️ Warning'));
    assert.ok(html.includes('See the Warning verification on this row'));
  });

  test('a report-sourced warning does not promise a card that does not exist', () => {
    // An admin warning report leaves the target verification's status untouched, so no Warning
    // card is rendered. Telling the reader to look for one sends them after nothing.
    const html = renderVersionWarningBadge([reproducible], new Set([VERIFICATION_A]));
    assert.ok(html.includes('⚠️ Warning'));
    assert.equal(html.includes('See the Warning verification on this row'), false);
    assert.ok(html.includes('verifier or WalletScrutiny admin'));
  });
});
