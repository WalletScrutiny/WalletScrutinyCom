import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { generateSecretKey } from 'nostr-tools/pure';

import {
  createEventDraft,
  signEvent,
  setPrivateKey,
} from '../../../src/nostr-client.mjs';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

import { getAssetHashesDigest, getVerificationReplaceableKey } from '../../../src/verifications_common.mjs';
import { verificationKind } from '../nostr-constants.mjs';
import { createVerification } from '../nostr-utils.mjs';

const HASH = 'a'.repeat(64);
const CAST_HASH = 'b'.repeat(64);

const baseVerificationParams = {
  hashes: [HASH],
  description: 'Automatic verification by WalletScrutiny Build Server',
  content: 'Build server test content',
  status: 'reproducible',
  appId: 'app.zeusln.zeus',
  version: '13.1.0',
  platform: 'android',
  reusedFileIds: ['file-event-id'],
  outputFiles: [{ name: 'script.cast', hash: CAST_HASH }],
  basedOn: 'based-on-event:author-pubkey',
};

function assertValidCreatedAt(createdAt, label) {
  assert.ok(Number.isFinite(createdAt), `${label}: created_at must be a finite number`);
  assert.ok(createdAt > 0, `${label}: created_at must be positive`);
  assert.equal(JSON.stringify({ created_at: createdAt }).includes('null'), false,
    `${label}: created_at must not serialize as null`);
}

function mockPublishSuccess() {
  return async () => ({
    successful: 1,
    total: 1,
    results: [{ status: 'fulfilled' }],
  });
}

function captureEventAndSign(id = '2'.repeat(64)) {
  const holder = { event: undefined };
  return {
    get event() {
      return holder.event;
    },
    signEventFn: async (event) => {
      holder.event = event;
      return {
        ...event,
        id,
        sig: '3'.repeat(128),
        pubkey: '4'.repeat(64),
      };
    },
  };
}

describe('createEventDraft', () => {
  test('uses a valid timestamp when created_at is omitted', () => {
    const draft = createEventDraft({ kind: 1, content: 'hello', tags: [] });
    assertValidCreatedAt(draft.created_at, 'omitted created_at');
  });

  test('uses a valid timestamp when created_at is null', () => {
    const draft = createEventDraft({ kind: 1, content: 'hello', tags: [], created_at: null });
    assertValidCreatedAt(draft.created_at, 'null created_at');
  });

  test('replaces NaN created_at with the current timestamp', () => {
    const brokenCreatedAt = Math.floor(new Date(undefined).getTime() / 1000);
    assert.equal(Number.isNaN(brokenCreatedAt), true);

    const draft = createEventDraft({
      kind: verificationKind,
      content: '{}',
      tags: [],
      created_at: brokenCreatedAt,
    });
    assertValidCreatedAt(draft.created_at, 'NaN created_at');
  });

  test('preserves an explicit valid created_at', () => {
    const createdAt = 1_700_000_000;
    const draft = createEventDraft({
      kind: 1,
      content: 'hello',
      tags: [],
      created_at: createdAt,
    });
    assert.equal(draft.created_at, createdAt);
  });
});

describe('getAssetHashesDigest', () => {
  test('returns the sole hash unchanged', () => {
    assert.equal(getAssetHashesDigest([HASH]), HASH);
  });

  test('sorts, concatenates, and re-hashes multiple hashes', () => {
    const hashA = 'a'.repeat(64);
    const hashB = 'b'.repeat(64);
    const expected = bytesToHex(sha256(new TextEncoder().encode(hashA + hashB)));
    assert.equal(getAssetHashesDigest([hashB, hashA]), expected);
  });
});

describe('createVerification', () => {
  test('builds a verification event with a valid created_at when createdAt is omitted', async () => {
    const capture = captureEventAndSign();

    await createVerification(baseVerificationParams, {
      signEventFn: capture.signEventFn,
      publishEventFn: mockPublishSuccess(),
    });

    assert.equal(capture.event.kind, verificationKind);
    assertValidCreatedAt(capture.event.created_at, 'verification event without createdAt');
    assert.equal(capture.event.tags.find(tag => tag[0] === 'status')?.[1], 'reproducible');
    assert.equal(capture.event.tags.find(tag => tag[0] === 'i')?.[1], 'app.zeusln.zeus');
    assert.equal(
      capture.event.tags.find(tag => tag[0] === 'd')?.[1],
      getVerificationReplaceableKey('app.zeusln.zeus', '13.1.0', 'android', [HASH])
    );
    assert.equal(capture.event.tags.find(tag => tag[0] === 'x')?.[1], HASH);
  });

  test('does not reproduce the legacy NaN created_at bug', async () => {
    const legacyBrokenCreatedAt = Math.floor(new Date(undefined).getTime() / 1000);
    assert.equal(Number.isNaN(legacyBrokenCreatedAt), true);

    const capture = captureEventAndSign();

    await createVerification(baseVerificationParams, {
      signEventFn: capture.signEventFn,
      publishEventFn: mockPublishSuccess(),
    });

    assert.notEqual(capture.event.created_at, legacyBrokenCreatedAt);
    assertValidCreatedAt(capture.event.created_at, 'verification event regression guard');
  });

  test('honors an explicit createdAt parameter', async () => {
    const createdAt = '2024-06-01T12:00:00.000Z';
    const capture = captureEventAndSign();

    await createVerification({ ...baseVerificationParams, createdAt }, {
      signEventFn: capture.signEventFn,
      publishEventFn: mockPublishSuccess(),
    });

    assert.equal(capture.event.created_at, Math.floor(new Date(createdAt).getTime() / 1000));
  });

  test('returns a string event id, not an object with an id property', async () => {
    const eventId = await createVerification(baseVerificationParams, {
      signEventFn: async (event) => ({
        ...event,
        id: '2'.repeat(64),
        sig: '3'.repeat(128),
        pubkey: '4'.repeat(64),
      }),
      publishEventFn: mockPublishSuccess(),
    });

    assert.equal(typeof eventId, 'string');
    assert.equal(eventId.length, 64);
    assert.equal(eventId.id, undefined);
  });

  test('throws when no relay accepts the event', async () => {
    await assert.rejects(
      () => createVerification(baseVerificationParams, {
        signEventFn: async (event) => ({
          ...event,
          id: 'f'.repeat(64),
          sig: '0'.repeat(128),
          pubkey: '1'.repeat(64),
        }),
        publishEventFn: async () => ({
          successful: 0,
          total: 2,
          results: [
            { status: 'rejected', reason: new Error('invalid: created_at') },
            { status: 'rejected', reason: new Error('blocked') },
          ],
        }),
      }),
      /Failed to publish to any relay/
    );
  });

  test('produces a relay-acceptable signed event when createdAt is omitted', async () => {
    setPrivateKey(generateSecretKey());

    let signedEvent;
    await createVerification(baseVerificationParams, {
      signEventFn: async (event) => {
        signedEvent = await signEvent(event);
        return signedEvent;
      },
      publishEventFn: mockPublishSuccess(),
    });

    assertValidCreatedAt(signedEvent.created_at, 'signed verification event');
    assert.equal(typeof signedEvent.id, 'string');
    assert.equal(signedEvent.id.length, 64);
  });
});
