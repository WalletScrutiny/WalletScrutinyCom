import { subscribeEvents, getRelayConnectionStatus } from '../../src/nostr-client.mjs';
import { assetRegistrationKind, assetBundleRegistrationKind } from './nostr-constants.mjs';
import { ASSET_WATCH_WATCHDOG_MINUTES } from './config/config.mjs';
import { appLog } from './logger.mjs';
import { getFirstTagValue } from './utils.mjs';

export const WS_CLIENT_TAG = 'WalletScrutiny.com';

const watchedKinds = [assetRegistrationKind, assetBundleRegistrationKind];

/**
 * True for Asset Registry events written by WalletScrutiny.com. Relays only
 * index single-letter tags, so the `client` tag cannot go into the REQ filter
 * and is checked here, exactly like getAllAssetsForTheseAppIds() does.
 */
export function isWatchedAssetEvent(event) {
  if (!event || !watchedKinds.includes(event.kind) || !Array.isArray(event.tags)) {
    return false;
  }
  return getFirstTagValue(event, 'client') === WS_CLIENT_TAG;
}

/**
 * Debounced wake request: the first `request()` arms a timer, further requests
 * within the window are coalesced, `onWake` fires once when it elapses.
 * `reset()` drops the pending wake (used at the start of every cycle).
 */
export function createWakeDebounce({
  delayMs,
  onWake,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
}) {
  let requested = false;
  let timer = null;

  return {
    request() {
      requested = true;
      if (timer) {
        return;
      }
      timer = setTimeoutFn(() => {
        timer = null;
        if (requested) {
          onWake();
        }
      }, delayMs);
      timer?.unref?.();
    },
    reset() {
      requested = false;
      if (timer) {
        clearTimeoutFn(timer);
        timer = null;
      }
    },
    get requested() {
      return requested;
    },
    get pending() {
      return timer !== null;
    },
  };
}

/**
 * Keeps a live subscription on the Asset Registry kinds and calls
 * `onNewAsset(event)` for every WalletScrutiny registration that arrives.
 *
 * The subscription is a latency optimisation only: the periodic scan in
 * mainProcess stays the source of truth, so a wedged subscription costs at
 * most one scan interval. Robustness comes from two layers:
 *   - nostr-tools (with enablePing/enableReconnect on the shared pool) detects
 *     dead sockets via ping and reconnects with backoff, re-sending open
 *     subscriptions with `since` = last event seen.
 *   - The watchdog below covers what the library does not: relays that failed
 *     on the first connect (never retried by nostr-tools) or that were down
 *     when the subscription was opened (no subscription created on them). It
 *     re-opens the subscription whenever any configured relay is disconnected.
 *
 * Dependencies are injectable for tests.
 */
export function createAssetWatcher({
  onNewAsset,
  subscribe = subscribeEvents,
  relayStatus = getRelayConnectionStatus,
  watchdogMs = ASSET_WATCH_WATCHDOG_MINUTES * 60 * 1000,
  now = () => Math.floor(Date.now() / 1000),
  log = appLog,
} = {}) {
  if (typeof onNewAsset !== 'function') {
    throw new Error('createAssetWatcher requires an onNewAsset callback');
  }

  // Inclusive lower bound for (re)subscriptions. Starting slightly in the past
  // covers events published while the process was starting up; duplicates are
  // harmless because the scan deduplicates against the database.
  let since = now() - 60;
  let subscription = null;
  let watchdog = null;
  let stopped = false;
  let reopenCount = 0;
  // Re-subscribing from an inclusive `since` re-delivers the last event seen,
  // and several relays deliver the same event; neither must wake the loop twice.
  const seenIds = new Set();
  const MAX_SEEN_IDS = 1000;

  function open(reason) {
    if (stopped) {
      return;
    }
    if (subscription) {
      try {
        subscription.close();
      } catch (error) {
        log.warn('Asset watch: error closing previous subscription:', error);
      }
      subscription = null;
    }
    try {
      const current = subscribe({ kinds: watchedKinds, since }, {
        onevent: handleEvent,
        onclose: (reasons) => {
          // Closes we caused (replace or stop) are not worth a warning.
          if (stopped || subscription !== current) {
            return;
          }
          log.warn(`Asset watch: subscription closed on all relays (${JSON.stringify(reasons)}); the watchdog will re-open it.`);
        },
      });
      subscription = current;
      log.info(`Asset watch: subscription open (${reason}), since=${since}`);
    } catch (error) {
      log.error('Asset watch: failed to open subscription:', error);
    }
  }

  function handleEvent(event) {
    if (!isWatchedAssetEvent(event)) {
      return;
    }
    if (Number.isFinite(event.created_at) && event.created_at > since) {
      since = event.created_at;
    }
    if (seenIds.has(event.id)) {
      return;
    }
    seenIds.add(event.id);
    if (seenIds.size > MAX_SEEN_IDS) {
      seenIds.delete(seenIds.values().next().value);
    }
    log.info(`Asset watch: new asset ${event.id} (kind ${event.kind}, ${getFirstTagValue(event, 'i')})`);
    try {
      onNewAsset(event);
    } catch (error) {
      log.error('Asset watch: onNewAsset handler failed:', error);
    }
  }

  function check() {
    if (stopped) {
      return;
    }
    const status = relayStatus();
    const down = status.filter(s => !s.connected).map(s => s.url);
    if (down.length === 0 && subscription) {
      return;
    }
    reopenCount++;
    const why = subscription
      ? `relays disconnected: ${down.join(', ')}`
      : 'no subscription';
    log.warn(`Asset watch: watchdog re-opening subscription (${why})`);
    open(`watchdog #${reopenCount}`);
  }

  open('startup');
  if (watchdogMs > 0) {
    watchdog = setInterval(check, watchdogMs);
    watchdog.unref?.();
  }

  return {
    check,
    stop() {
      stopped = true;
      if (watchdog) {
        clearInterval(watchdog);
        watchdog = null;
      }
      if (subscription) {
        try {
          subscription.close();
        } catch {
          // ignore: shutting down
        }
        subscription = null;
      }
    },
    get since() {
      return since;
    },
    get reopenCount() {
      return reopenCount;
    },
  };
}
