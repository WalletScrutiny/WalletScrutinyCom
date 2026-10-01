import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  createVerificationCard,
  createVerificationsCell,
  SELF_ATTESTATION_BADGE_TITLE,
} from '../../src/assets-table-paint.mjs';
import { htmlOf } from '../../src/html-utils.mjs';
import { verificationKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

const ID_A = 'a'.repeat(64);
const ID_B = 'b'.repeat(64);
const PUBKEY_A = '1'.repeat(64);
const PUBKEY_B = '2'.repeat(64);
const SHA = 'c'.repeat(64);

function makeAttestation(overrides = {}) {
  return makeEvent({
    id: ID_A,
    pubkey: PUBKEY_A,
    kind: verificationKind,
    created_at: 1_700_000_000,
    tags: [['status', 'reproducible']],
    content: JSON.stringify({ description: 'ok', content: 'ok' }),
    ...overrides,
  });
}

describe('createVerificationCard self-attestation label', () => {
  test('renders the badge, note and modifier class when marked', () => {
    const html = htmlOf(createVerificationCard({
      attestation: makeAttestation(),
      sha256HashKey: SHA,
      identifier: 'com.example',
      platform: 'android',
      isMyDraft: false,
      isSelfAttested: true,
    }));
    assert.match(html, /verification-card--self-attestation/);
    assert.match(html, /verification-self-attestation-badge/);
    assert.match(html, />Self-attestation</);
    assert.ok(html.includes(SELF_ATTESTATION_BADGE_TITLE));
    assert.match(html, /verification-card__note/);
    // the status pill is unchanged: the label never replaces the verdict
    assert.match(html, /verification-status-pill--reproducible/);
  });

  test('renders no label by default', () => {
    const html = htmlOf(createVerificationCard({
      attestation: makeAttestation(),
      sha256HashKey: SHA,
      identifier: 'com.example',
      platform: 'android',
      isMyDraft: false,
    }));
    assert.doesNotMatch(html, /self-attestation/);
    assert.doesNotMatch(html, /verification-card__note/);
  });
});

describe('createVerificationsCell self-attestation ids', () => {
  test('labels only the cards whose id is in selfAttestedVerificationIds', () => {
    const cell = createVerificationsCell({
      attestations: [
        makeAttestation({ id: ID_A, pubkey: PUBKEY_A }),
        makeAttestation({ id: ID_B, pubkey: PUBKEY_B }),
      ],
      sha256HashKey: SHA,
      identifier: 'com.example',
      platform: 'android',
      version: '1.0.0',
      hideButtons: true,
      selfAttestedVerificationIds: new Set([ID_B]),
    });
    const cards = [...cell.querySelectorAll('.verification-card')];
    assert.equal(cards.length, 2);
    assert.equal(cards[0].classList.contains('verification-card--self-attestation'), false);
    assert.equal(cards[1].classList.contains('verification-card--self-attestation'), true);
    assert.equal(cell.querySelectorAll('.verification-self-attestation-badge').length, 1);
  });

  test('tolerates a missing id set', () => {
    const cell = createVerificationsCell({
      attestations: [makeAttestation()],
      sha256HashKey: SHA,
      identifier: 'com.example',
      platform: 'android',
      version: '1.0.0',
      hideButtons: true,
    });
    assert.equal(cell.querySelectorAll('.verification-self-attestation-badge').length, 0);
  });
});
