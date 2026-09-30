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
  summarizePublishResults,
  assertRequiredRelaysAccepted,
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

describe('summarizePublishResults', () => {
  const urls = ['wss://project.example/', 'wss://public-a.example/', 'wss://public-b.example/'];
  const ok = { status: 'fulfilled', value: 'ok' };
  const rejected = (message) => ({ status: 'rejected', reason: new Error(message) });

  test('counts accepted relays and lists failures with the relay reason', () => {
    const summary = summarizePublishResults(urls, [ok, rejected('rate-limited: slow down'), ok]);
    assert.equal(summary.successful, 2);
    assert.equal(summary.total, 3);
    assert.deepEqual(summary.failures, [{ url: 'wss://public-a.example/', error: 'rate-limited: slow down' }]);
    assert.deepEqual(summary.rejectedRequired, []);
  });

  test('flags a required relay that rejected the event even when others accepted it', () => {
    const summary = summarizePublishResults(urls, [rejected('blocked: kind not allowed'), ok, ok], [urls[0]]);
    assert.equal(summary.successful, 2);
    assert.deepEqual(summary.rejectedRequired, [{ url: urls[0], error: 'blocked: kind not allowed' }]);
  });

  test('flags a required relay missing from the publish set', () => {
    const summary = summarizePublishResults(urls.slice(1), [ok, ok], [urls[0]]);
    assert.equal(summary.successful, 2);
    assert.deepEqual(summary.rejectedRequired, [{ url: urls[0], error: 'relay is not in the publish set' }]);
  });

  test('treats a resolved "connection failure" value as a failure', () => {
    // SimplePool.publish resolves with this string for an unreachable relay.
    const summary = summarizePublishResults(urls, [{ status: 'fulfilled', value: 'connection failure: Error: connection timed out' }, ok, ok], [urls[0]]);
    assert.equal(summary.successful, 2);
    assert.deepEqual(summary.rejectedRequired, [{ url: urls[0], error: 'connection failure: Error: connection timed out' }]);
  });

  test('stringifies non-Error rejection reasons', () => {
    const summary = summarizePublishResults([urls[0]], [{ status: 'rejected', reason: 'publish timed out' }], [urls[0]]);
    assert.deepEqual(summary.rejectedRequired, [{ url: urls[0], error: 'publish timed out' }]);
  });
});

describe('assertRequiredRelaysAccepted', () => {
  const projectRelay = 'wss://project.example/';

  test('returns when every required relay accepted', () => {
    assert.doesNotThrow(() => assertRequiredRelaysAccepted({ successful: 1, rejectedRequired: [] }, 'verification'));
  });

  test('throws with the relay reason and notes other relays that accepted', () => {
    const summary = { successful: 2, rejectedRequired: [{ url: projectRelay, error: 'invalid: event too large' }] };
    assert.throws(() => assertRequiredRelaysAccepted(summary, 'verification'), (error) => {
      assert.match(error.message, /Failed to publish verification/);
      assert.match(error.message, /wss:\/\/project\.example\/ \(invalid: event too large\)/);
      assert.match(error.message, /reached 2 other relay\(s\)/);
      return true;
    });
  });

  test('does not claim other relays accepted when none did', () => {
    const summary = { successful: 0, rejectedRequired: [{ url: projectRelay, error: 'publish timed out' }] };
    assert.throws(() => assertRequiredRelaysAccepted(summary, 'comment'), (error) => {
      assert.doesNotMatch(error.message, /other relay/);
      return true;
    });
  });
});
