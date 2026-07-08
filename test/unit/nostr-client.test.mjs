import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';

import {
  getTagValue,
  getMatchingTags,
  createEventDraft,
  setPrivateKey,
  signEvent,
} from '../../src/nostr-client.mjs';
import { makeEvent } from './fixtures.mjs';

describe('getTagValue', () => {
  test('returns first tag value or empty string', () => {
    const event = makeEvent({ tags: [['d', 'key'], ['status', 'reproducible']] });
    assert.equal(getTagValue(event, 'status'), 'reproducible');
    assert.equal(getTagValue(event, 'missing'), '');
  });
});

describe('getMatchingTags', () => {
  test('returns all tags with the given name', () => {
    const event = makeEvent({ tags: [['x', 'a'], ['i', 'app'], ['x', 'b']] });
    assert.deepEqual(getMatchingTags(event, 'x'), [['x', 'a'], ['x', 'b']]);
    assert.deepEqual(getMatchingTags(event, 'missing'), []);
  });

  test('returns empty array when event has no tags', () => {
    assert.deepEqual(getMatchingTags({}, 'x'), []);
  });
});

describe('createEventDraft', () => {
  test('uses current timestamp when created_at is invalid', () => {
    const draft = createEventDraft({ kind: 1, content: 'hello', tags: [], created_at: null });
    assert.ok(Number.isFinite(draft.created_at));
    assert.ok(draft.created_at > 0);
  });

  test('preserves explicit created_at and pubkey', () => {
    const pubkey = 'a'.repeat(64);
    const draft = createEventDraft({
      kind: 30301,
      content: '{}',
      tags: [['d', 'key']],
      created_at: 1_700_000_000,
      pubkey,
    });
    assert.equal(draft.created_at, 1_700_000_000);
    assert.equal(draft.pubkey, pubkey);
  });
});

describe('signEvent', () => {
  test('signs with configured private key in Node', async () => {
    const secretKey = generateSecretKey();
    setPrivateKey(secretKey);
    const template = createEventDraft({ kind: 1, content: 'signed in test' });
    const signed = await signEvent(template);
    assert.equal(signed.pubkey, getPublicKey(secretKey));
    assert.equal(typeof signed.sig, 'string');
    assert.equal(signed.sig.length, 128);
  });
});
