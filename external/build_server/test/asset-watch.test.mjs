import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { assetRegistrationKind, assetBundleRegistrationKind } from '../nostr-constants.mjs';
import { createAssetWatcher, createWakeDebounce, isWatchedAssetEvent, WS_CLIENT_TAG } from '../asset-watch.mjs';

const silentLog = { info() {}, warn() {}, error() {}, debug() {} };

function registration(overrides = {}) {
  return {
    id: 'e'.repeat(64),
    kind: assetBundleRegistrationKind,
    created_at: 1_700_000_100,
    tags: [['i', 'io.horizontalsystems.bankwallet'], ['client', WS_CLIENT_TAG]],
    ...overrides,
  };
}

/** Fake subscribe() that records filters and lets tests inject events/closes. */
function fakeSubscribe() {
  const calls = [];
  return {
    calls,
    subscribe(filter, handlers) {
      const sub = { filter, handlers, closed: false, close() { sub.closed = true; } };
      calls.push(sub);
      return sub;
    },
  };
}

describe('isWatchedAssetEvent', () => {
  test('accepts WalletScrutiny asset and bundle registrations', () => {
    assert.equal(isWatchedAssetEvent(registration()), true);
    assert.equal(isWatchedAssetEvent(registration({ kind: assetRegistrationKind })), true);
  });

  test('rejects other kinds, other clients and malformed events', () => {
    assert.equal(isWatchedAssetEvent(registration({ kind: 1 })), false);
    assert.equal(isWatchedAssetEvent(registration({ tags: [['i', 'x'], ['client', 'other']] })), false);
    assert.equal(isWatchedAssetEvent(registration({ tags: [['i', 'x']] })), false);
    assert.equal(isWatchedAssetEvent(registration({ tags: undefined })), false);
    assert.equal(isWatchedAssetEvent(null), false);
  });
});

describe('createWakeDebounce', () => {
  function fakeTimers() {
    const timers = [];
    return {
      timers,
      setTimeoutFn(fn, ms) { const t = { fn, ms, cleared: false }; timers.push(t); return t; },
      clearTimeoutFn(t) { t.cleared = true; },
      fire() { const t = timers.find(x => !x.cleared && !x.fired); t.fired = true; t.fn(); },
    };
  }

  test('coalesces several requests into one wake after the delay', () => {
    const ft = fakeTimers();
    let wakes = 0;
    const wake = createWakeDebounce({ delayMs: 30_000, onWake: () => wakes++, ...ft });

    wake.request();
    wake.request();
    wake.request();
    assert.equal(ft.timers.length, 1);
    assert.equal(ft.timers[0].ms, 30_000);
    assert.equal(wake.requested, true);
    assert.equal(wake.pending, true);
    assert.equal(wakes, 0);

    ft.fire();
    assert.equal(wakes, 1);
    assert.equal(wake.pending, false);
    // The flag stays set until the next cycle resets it, so the main loop
    // skips the sleep after a cycle that was already running.
    assert.equal(wake.requested, true);
  });

  test('reset drops the pending wake and the flag', () => {
    const ft = fakeTimers();
    let wakes = 0;
    const wake = createWakeDebounce({ delayMs: 10, onWake: () => wakes++, ...ft });

    wake.request();
    wake.reset();
    assert.equal(wake.requested, false);
    assert.equal(wake.pending, false);
    assert.equal(ft.timers[0].cleared, true);

    // A request after reset arms a fresh timer.
    wake.request();
    assert.equal(ft.timers.length, 2);
    ft.timers[1].fn();
    assert.equal(wakes, 1);
  });
});

describe('createAssetWatcher', () => {
  test('subscribes on startup to the asset kinds since shortly before now', () => {
    const fs = fakeSubscribe();
    const watcher = createAssetWatcher({
      onNewAsset: () => {},
      subscribe: fs.subscribe,
      relayStatus: () => [],
      watchdogMs: 0,
      now: () => 1_700_000_000,
      log: silentLog,
    });

    assert.equal(fs.calls.length, 1);
    assert.deepEqual(fs.calls[0].filter.kinds, [assetRegistrationKind, assetBundleRegistrationKind]);
    assert.equal(fs.calls[0].filter.since, 1_700_000_000 - 60);
    // The client tag is not in the filter: relays only index single-letter tags.
    assert.equal('#client' in fs.calls[0].filter, false);
    watcher.stop();
    assert.equal(fs.calls[0].closed, true);
  });

  test('forwards only WalletScrutiny registrations and advances since', () => {
    const fs = fakeSubscribe();
    const seen = [];
    const watcher = createAssetWatcher({
      onNewAsset: (event) => seen.push(event.id),
      subscribe: fs.subscribe,
      relayStatus: () => [],
      watchdogMs: 0,
      now: () => 1_700_000_000,
      log: silentLog,
    });
    const { handlers } = fs.calls[0];

    handlers.onevent(registration({ id: 'a'.repeat(64), created_at: 1_700_000_050 }));
    handlers.onevent(registration({ id: 'b'.repeat(64), kind: 1063 + 1000 }));
    handlers.onevent(registration({ id: 'c'.repeat(64), tags: [['client', 'Amethyst']] }));
    handlers.onevent(registration({ id: 'd'.repeat(64), kind: assetRegistrationKind, created_at: 1_700_000_200 }));

    assert.deepEqual(seen, ['a'.repeat(64), 'd'.repeat(64)]);
    assert.equal(watcher.since, 1_700_000_200);
    watcher.stop();
  });

  test('delivers each registration once even if several relays or a resubscribe repeat it', () => {
    const fs = fakeSubscribe();
    const seen = [];
    let status = [{ url: 'wss://a/', connected: true }];
    const watcher = createAssetWatcher({
      onNewAsset: (event) => seen.push(event.id),
      subscribe: fs.subscribe,
      relayStatus: () => status,
      watchdogMs: 0,
      now: () => 1_700_000_000,
      log: silentLog,
    });

    const event = registration({ created_at: 1_700_000_300 });
    fs.calls[0].handlers.onevent(event);
    fs.calls[0].handlers.onevent(event);
    status = [{ url: 'wss://a/', connected: false }];
    watcher.check();
    // Inclusive since => the relay re-delivers the last event on resubscribe.
    fs.calls[1].handlers.onevent(event);

    assert.deepEqual(seen, [event.id]);
    watcher.stop();
  });

  test('closes caused by replace or stop are not reported as failures', () => {
    const fs = fakeSubscribe();
    const warnings = [];
    let status = [{ url: 'wss://a/', connected: true }];
    const watcher = createAssetWatcher({
      onNewAsset: () => {},
      subscribe: fs.subscribe,
      relayStatus: () => status,
      watchdogMs: 0,
      log: { ...silentLog, warn: (msg) => warnings.push(msg) },
    });

    status = [{ url: 'wss://a/', connected: false }];
    watcher.check();
    fs.calls[0].handlers.onclose(['closed by caller']);
    assert.equal(warnings.filter(w => w.includes('closed on all relays')).length, 0);

    fs.calls[1].handlers.onclose(['connection failed']);
    assert.equal(warnings.filter(w => w.includes('closed on all relays')).length, 1, 'a real close is reported');

    watcher.stop();
    fs.calls[1].handlers.onclose(['closed by caller']);
    assert.equal(warnings.filter(w => w.includes('closed on all relays')).length, 1);
  });

  test('a throwing onNewAsset does not kill the subscription', () => {
    const fs = fakeSubscribe();
    const watcher = createAssetWatcher({
      onNewAsset: () => { throw new Error('boom'); },
      subscribe: fs.subscribe,
      relayStatus: () => [],
      watchdogMs: 0,
      log: silentLog,
    });
    assert.doesNotThrow(() => fs.calls[0].handlers.onevent(registration()));
    assert.equal(fs.calls[0].closed, false);
    watcher.stop();
  });

  test('watchdog re-opens the subscription from the last seen event when a relay is down', () => {
    const fs = fakeSubscribe();
    let status = [{ url: 'wss://a/', connected: true }, { url: 'wss://b/', connected: true }];
    const watcher = createAssetWatcher({
      onNewAsset: () => {},
      subscribe: fs.subscribe,
      relayStatus: () => status,
      watchdogMs: 0,
      now: () => 1_700_000_000,
      log: silentLog,
    });

    watcher.check();
    assert.equal(fs.calls.length, 1, 'all relays up: nothing to do');

    fs.calls[0].handlers.onevent(registration({ created_at: 1_700_000_500 }));
    status = [{ url: 'wss://a/', connected: true }, { url: 'wss://b/', connected: false }];
    watcher.check();

    assert.equal(fs.calls.length, 2);
    assert.equal(fs.calls[0].closed, true, 'previous subscription closed first');
    assert.equal(fs.calls[1].filter.since, 1_700_000_500, 'resubscribes from the last event seen');
    assert.equal(watcher.reopenCount, 1);

    watcher.stop();
    assert.equal(fs.calls[1].closed, true);
    watcher.check();
    assert.equal(fs.calls.length, 2, 'no re-open after stop');
  });

  test('watchdog re-opens when the initial subscribe failed', () => {
    let attempts = 0;
    const fs = fakeSubscribe();
    const subscribe = (filter, handlers) => {
      attempts++;
      if (attempts === 1) {
        throw new Error('Pool not initialized');
      }
      return fs.subscribe(filter, handlers);
    };
    const watcher = createAssetWatcher({
      onNewAsset: () => {},
      subscribe,
      relayStatus: () => [{ url: 'wss://a/', connected: true }],
      watchdogMs: 0,
      log: silentLog,
    });

    assert.equal(fs.calls.length, 0);
    watcher.check();
    assert.equal(fs.calls.length, 1, 'watchdog opened the subscription');
    watcher.stop();
  });

  test('requires an onNewAsset callback', () => {
    assert.throws(() => createAssetWatcher({}), /onNewAsset/);
  });
});
