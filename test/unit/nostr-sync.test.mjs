import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { syncDelta, syncDeltaInTagBatches } from '../../src/nostr-sync.mjs';
import { makeEvent } from './fixtures.mjs';

function createDeps({
  range = { oldest: null, newest: null, count: 0 },
  pagedEvents = [],
  singleEvents = [],
} = {}) {
  const calls = [];
  const saved = [];
  return {
    calls,
    saved,
    deps: {
      getRange: async (kinds) => {
        calls.push({ type: 'range', kinds });
        return range;
      },
      save: async (events) => {
        saved.push([...events]);
        return events.size;
      },
      fetchEvents: async (filter, options = {}) => {
        calls.push({ type: 'single', filter, options });
        return new Set(singleEvents);
      },
      fetchEventsWithPagination: async (filter, options = {}) => {
        calls.push({ type: 'paged', filter, options });
        return new Set(pagedEvents);
      },
    },
  };
}

describe('syncDelta', () => {
  test('fetches from sinceFloor when the cache is empty', async () => {
    const newer = makeEvent({ id: 'new', created_at: 200 });
    const { calls, saved, deps } = createDeps({ pagedEvents: [newer] });

    const result = await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
    }, deps);

    assert.equal(result.size, 1);
    assert.equal(calls[0].type, 'range');
    assert.equal(calls[1].type, 'paged');
    assert.equal(calls[1].filter.since, 100);
    assert.equal(calls[1].filter.kinds[0], 30301);
    assert.equal(saved.length, 1);
    assert.equal(saved[0][0].id, 'new');
  });

  test('fetches since newest+1 when a cursor is provided', async () => {
    const { calls, deps } = createDeps();

    await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
      newest: 150,
      oldest: 120,
    }, deps);

    assert.equal(calls.some(call => call.type === 'range'), false);
    assert.equal(calls[0].filter.since, 151);
  });

  test('fills a gap when oldest is far enough above sinceFloor', async () => {
    const older = makeEvent({ id: 'old', created_at: 80 });
    const { calls, saved, deps } = createDeps({
      range: { oldest: 400, newest: 500, count: 2 },
      pagedEvents: [older],
    });

    const result = await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
      fillGaps: true,
    }, deps);

    const gapCall = calls.find(call => call.type === 'paged' && call.filter.until === 399);
    assert.ok(gapCall);
    assert.equal(gapCall.filter.since, 100);
    assert.equal(result.size, 1);
    assert.equal(saved.length, 1);
  });

  test('skips gap fill when oldest is within the threshold', async () => {
    const { calls, deps } = createDeps({
      range: { oldest: 110, newest: 200, count: 1 },
    });

    await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
      fillGaps: true,
      gapThresholdSeconds: 20,
    }, deps);

    assert.equal(calls.filter(call => call.type === 'paged').length, 1);
    assert.equal(calls[1].filter.since, 201);
  });

  test('can fetch only the gap window', async () => {
    const { calls, deps } = createDeps({
      range: { oldest: 400, newest: 500, count: 1 },
    });

    await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
      fetchNewer: false,
      fillGaps: true,
    }, deps);

    assert.equal(calls.filter(call => call.type === 'paged').length, 1);
    assert.equal(calls[1].filter.since, 100);
    assert.equal(calls[1].filter.until, 399);
  });

  test('fills gaps with one paged fetch per kind', async () => {
    const { calls, deps } = createDeps();

    await syncDelta({
      kinds: [30301, 1063],
      sinceFloor: 100,
      newest: 500,
      oldest: 400,
      fetchNewer: false,
      fillGaps: true,
    }, deps);

    const paged = calls.filter(call => call.type === 'paged');
    assert.equal(paged.length, 2);
    assert.deepEqual(paged.map(call => call.filter.kinds), [[30301], [1063]]);
    assert.equal(paged[0].filter.until, 399);
    assert.equal(paged[1].filter.until, 399);
  });

  test('splits paged fetches and cache cursors by kind', async () => {
    const { calls, deps } = createDeps();

    await syncDelta({
      kinds: [30301, 30801],
      sinceFloor: 100,
    }, deps);

    const rangeCalls = calls.filter(call => call.type === 'range');
    const paged = calls.filter(call => call.type === 'paged');
    assert.deepEqual(rangeCalls.map(call => call.kinds), [[30301], [30801]]);
    assert.equal(paged.length, 2);
    assert.deepEqual(paged.map(call => call.filter.kinds), [[30301], [30801]]);
  });

  test('reuses an explicit cursor across kinds without reading IDB', async () => {
    const { calls, deps } = createDeps();

    await syncDelta({
      kinds: [30301, 30801],
      sinceFloor: 100,
      newest: 150,
      oldest: 120,
    }, deps);

    assert.equal(calls.some(call => call.type === 'range'), false);
    const paged = calls.filter(call => call.type === 'paged');
    assert.equal(paged.length, 2);
    assert.equal(paged[0].filter.since, 151);
    assert.equal(paged[1].filter.since, 151);
  });

  test('singleBatch keeps multiple kinds in one fetch', async () => {
    const { calls, deps } = createDeps({
      singleEvents: [makeEvent({ id: 'batch' })],
    });

    await syncDelta({
      kinds: [30301, 1063],
      sinceFloor: 100,
      newest: null,
      singleBatch: true,
    }, deps);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].type, 'single');
    assert.deepEqual(calls[0].filter.kinds, [30301, 1063]);
  });

  test('singleBatch uses fetchEvents and skips gap fill', async () => {
    const { calls, saved, deps } = createDeps({
      singleEvents: [makeEvent({ id: 'batch' })],
    });

    await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
      newest: 150,
      oldest: 400,
      fillGaps: true,
      singleBatch: true,
      extraFilter: { '#i': ['com.example'] },
      paginationOptions: { relayUrls: ['wss://relay.example/'], maxWait: 15_000 },
    }, deps);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].type, 'single');
    assert.deepEqual(calls[0].filter['#i'], ['com.example']);
    assert.deepEqual(calls[0].options, { relayUrls: ['wss://relay.example/'], maxWait: 15_000 });
    assert.equal(saved.length, 1);
  });

  test('does not save when nothing was fetched', async () => {
    const { saved, deps } = createDeps();
    const result = await syncDelta({
      kinds: [30301],
      sinceFloor: 100,
      newest: null,
    }, deps);
    assert.equal(result.size, 0);
    assert.equal(saved.length, 0);
  });

  test('still returns events when save fails', async () => {
    const event = makeEvent({ id: 'keep' });
    const { deps } = createDeps({ pagedEvents: [event] });
    deps.save = async () => {
      throw new Error('idb down');
    };
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
      const result = await syncDelta({
        kinds: [30301],
        sinceFloor: 100,
        newest: null,
      }, deps);
      assert.equal(result.has(event), true);
    } finally {
      console.warn = originalWarn;
    }
  });
});

describe('syncDeltaInTagBatches', () => {
  test('returns an empty set when there are no tag values', async () => {
    const { calls, deps } = createDeps();
    const result = await syncDeltaInTagBatches({
      kinds: [1],
      tagName: 'e',
      tagValues: [],
      sinceFloor: 100,
    }, deps);
    assert.equal(result.size, 0);
    assert.equal(calls.length, 0);
  });

  test('reuses one cache cursor across batches', async () => {
    const { calls, deps } = createDeps({
      range: { oldest: 10, newest: 50, count: 1 },
      singleEvents: [makeEvent({ id: 'e1' })],
    });

    await syncDeltaInTagBatches({
      kinds: [1],
      tagName: 'e',
      tagValues: ['a'.repeat(64), 'b'.repeat(64), 'c'.repeat(64)],
      batchSize: 2,
      sinceFloor: 1,
      singleBatch: true,
    }, deps);

    const rangeCalls = calls.filter(call => call.type === 'range');
    const fetchCalls = calls.filter(call => call.type === 'single');
    assert.equal(rangeCalls.length, 1);
    assert.equal(fetchCalls.length, 2);
    assert.deepEqual(fetchCalls[0].filter['#e'].length, 2);
    assert.deepEqual(fetchCalls[1].filter['#e'].length, 1);
    assert.equal(fetchCalls[0].filter.since, 51);
    assert.equal(fetchCalls[1].filter.since, 51);
  });
});
