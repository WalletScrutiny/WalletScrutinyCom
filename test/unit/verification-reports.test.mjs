import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { reportedIdsFromReports } from '../../src/verifications_utils.mjs';
import { siteAdminPubkeys, verificationReportKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

const VERIFICATION_A = 'a'.repeat(64);
const VERIFICATION_B = 'b'.repeat(64);
const VERIFICATION_C = 'c'.repeat(64);
const NON_ADMIN = 'f'.repeat(64);
const ADMIN = siteAdminPubkeys[0];

function makeReport({ pubkey = ADMIN, eTags = [VERIFICATION_A], reason = 'spam' } = {}) {
  const tags = eTags.map(id => ['e', id]);
  if (reason != null) {
    tags.push(['r', reason]);
  }
  return makeEvent({
    id: `report-${eTags[0].slice(0, 8)}`,
    pubkey,
    kind: verificationReportKind,
    tags,
  });
}

describe('reportedIdsFromReports', () => {
  test('hides a verification reported by a site admin with a recognized reason', () => {
    const reported = reportedIdsFromReports(
      [makeReport({ reason: 'spam' })],
      [VERIFICATION_A]
    );
    assert.deepEqual([...reported], [VERIFICATION_A]);
  });

  test('accepts incorrect as a hide reason', () => {
    const reported = reportedIdsFromReports(
      [makeReport({ reason: 'incorrect' })],
      [VERIFICATION_A]
    );
    assert.deepEqual([...reported], [VERIFICATION_A]);
  });

  test('ignores reports from non-admin authors', () => {
    const reported = reportedIdsFromReports(
      [makeReport({ pubkey: NON_ADMIN })],
      [VERIFICATION_A]
    );
    assert.equal(reported.size, 0);
  });

  test('ignores reports with missing or unrecognized reasons', () => {
    const reported = reportedIdsFromReports(
      [
        makeReport({ reason: null }),
        makeReport({ reason: 'warning' }),
      ],
      [VERIFICATION_A]
    );
    assert.equal(reported.size, 0);
  });

  test('intersects e tags with the requested ids', () => {
    const reported = reportedIdsFromReports(
      [makeReport({ eTags: [VERIFICATION_A, VERIFICATION_B, VERIFICATION_C] })],
      [VERIFICATION_A]
    );
    assert.deepEqual([...reported], [VERIFICATION_A]);
  });

  test('can hide multiple requested verifications from one admin report', () => {
    const reported = reportedIdsFromReports(
      [makeReport({ eTags: [VERIFICATION_A, VERIFICATION_B] })],
      [VERIFICATION_A, VERIFICATION_B]
    );
    assert.equal(reported.size, 2);
    assert.ok(reported.has(VERIFICATION_A));
    assert.ok(reported.has(VERIFICATION_B));
  });

  test('returns empty set when there are no requested ids', () => {
    assert.equal(reportedIdsFromReports([makeReport()], []).size, 0);
  });
});
