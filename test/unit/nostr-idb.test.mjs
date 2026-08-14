import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  eventHasTagValue,
  eventMatchesQuery,
  eventTimeRange,
  getEventsFromIDB,
  getEventsByIdsFromIDB,
  getIDBEventRange,
  missingEventIds,
  saveEventsToIDB,
  deleteCachedEventById,
} from '../../src/nostr-idb.mjs';
import { HASH_A, HASH_B, makeEvent } from './fixtures.mjs';

describe('eventMatchesQuery', () => {
  const event = makeEvent({
    pubkey: 'pk-alice',
    tags: [
      ['i', 'com.example.wallet'],
      ['x', HASH_A],
      ['x', HASH_B],
    ],
  });

  test('matches when no filters are set', () => {
    assert.equal(eventMatchesQuery(event), true);
  });

  test('filters by pubkey', () => {
    assert.equal(eventMatchesQuery(event, { pubkey: 'pk-alice' }), true);
    assert.equal(eventMatchesQuery(event, { pubkey: 'pk-bob' }), false);
  });

  test('filters by appId string or array', () => {
    assert.equal(eventMatchesQuery(event, { appId: 'com.example.wallet' }), true);
    assert.equal(eventMatchesQuery(event, { appId: ['other', 'com.example.wallet'] }), true);
    assert.equal(eventMatchesQuery(event, { appId: 'com.other' }), false);
  });

  test('filters by sha256 hash tag', () => {
    assert.equal(eventMatchesQuery(event, { sha256: HASH_A }), true);
    assert.equal(eventMatchesQuery(event, { sha256: HASH_B }), true);
    assert.equal(eventMatchesQuery(event, { sha256: 'c'.repeat(64) }), false);
  });

  test('requires every provided filter to match', () => {
    assert.equal(eventMatchesQuery(event, {
      appId: 'com.example.wallet',
      sha256: HASH_A,
      pubkey: 'pk-alice',
    }), true);
    assert.equal(eventMatchesQuery(event, {
      appId: 'com.example.wallet',
      pubkey: 'pk-bob',
    }), false);
  });

  test('filters by tag name and values', () => {
    assert.equal(eventMatchesQuery(event, { tagName: 'i', tagValues: ['com.example.wallet'] }), true);
    assert.equal(eventMatchesQuery(event, { tagName: 'e', tagValues: [HASH_A] }), false);
    assert.equal(eventMatchesQuery(event, { tagName: 'x', tagValues: [HASH_B] }), true);
  });
});

describe('eventHasTagValue', () => {
  const event = makeEvent({
    tags: [
      ['e', HASH_A],
      ['v', 'android:com.example:1'],
    ],
  });

  test('matches a single tag value or a list', () => {
    assert.equal(eventHasTagValue(event, 'e', HASH_A), true);
    assert.equal(eventHasTagValue(event, 'e', [HASH_B, HASH_A]), true);
    assert.equal(eventHasTagValue(event, 'v', ['android:com.example:1']), true);
  });

  test('rejects missing tags and empty value lists', () => {
    assert.equal(eventHasTagValue(event, 'e', HASH_B), false);
    assert.equal(eventHasTagValue(event, 'p', HASH_A), false);
    assert.equal(eventHasTagValue(event, 'e', []), false);
    assert.equal(eventHasTagValue({ tags: null }, 'e', HASH_A), false);
  });
});

describe('missingEventIds', () => {
  test('returns unique requested ids that are not in the cache', () => {
    assert.deepEqual(
      missingEventIds(['a', 'b', 'a', '', null], [{ id: 'b' }, { id: 'c' }]),
      ['a']
    );
  });

  test('returns all unique ids when the cache is empty', () => {
    assert.deepEqual(missingEventIds(['a', 'b', 'a'], []), ['a', 'b']);
    assert.deepEqual(missingEventIds(null, null), []);
  });
});

describe('eventTimeRange', () => {
  test('returns nulls for an empty list', () => {
    assert.deepEqual(eventTimeRange([]), { oldest: null, newest: null });
  });

  test('ignores events without created_at', () => {
    assert.deepEqual(eventTimeRange([makeEvent({ id: 'a' })]), { oldest: null, newest: null });
  });

  test('returns oldest and newest timestamps', () => {
    const events = [
      makeEvent({ id: 'a', created_at: 50 }),
      makeEvent({ id: 'b', created_at: 10 }),
      makeEvent({ id: 'c', created_at: 30 }),
    ];
    assert.deepEqual(eventTimeRange(events), { oldest: 10, newest: 50 });
  });
});

describe('IndexedDB helpers without a browser DB', () => {
  test('read helpers return empty results', async () => {
    assert.deepEqual(await getEventsFromIDB({ kinds: [1] }), []);
    assert.deepEqual(await getEventsByIdsFromIDB(['a', 'b']), []);
    assert.deepEqual(await getEventsByIdsFromIDB([]), []);
    assert.deepEqual(await getIDBEventRange([1]), { oldest: null, newest: null, count: 0 });
  });

  test('write helpers no-op', async () => {
    assert.equal(await saveEventsToIDB([makeEvent({ id: 'x' })]), 0);
    await deleteCachedEventById('x');
    await deleteCachedEventById('');
  });
});
