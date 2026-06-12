import NDK, { NDKPrivateKeySigner, NDKEvent } from '@nostr-dev-kit/ndk';
import { explicitRelayUrls, verificationKind } from './nostr-constants.mjs';
import { appLog } from './logger.mjs';
import {
  buildVerificationUrl,
  formatNotificationMessage,
  getFirstTagValue,
  parseVerificationEvent,
} from './utils.mjs';

const FETCH_LIMIT = 500;
const FETCH_TIMEOUT_MS = Number(process.env.WS_NOTIFICATIONS_FETCH_TIMEOUT_MS ?? 120_000);
const WS_CLIENT_TAG = 'WalletScrutiny.com';

let ndk;

async function fetchEventsWithTimeout(filter, opts) {
  const fetchPromise = ndk.fetchEvents(filter, opts);
  if (!Number.isFinite(FETCH_TIMEOUT_MS) || FETCH_TIMEOUT_MS <= 0) {
    return fetchPromise;
  }
  return Promise.race([
    fetchPromise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`fetch timeout after ${FETCH_TIMEOUT_MS}ms`)), FETCH_TIMEOUT_MS);
    }),
  ]);
}

export function getNdk() {
  return ndk;
}

export async function connectToNostr(nostrPrivateKey) {
  appLog.info('Connecting to Nostr relays...');

  const ndkOptions = {
    initialValidationRatio: 1.0,
    lowestValidationRatio: 1.0,
    explicitRelayUrls,
  };

  if (nostrPrivateKey) {
    ndkOptions.signer = new NDKPrivateKeySigner(nostrPrivateKey);
  } else {
    appLog.info('No Nostr private key provided; connected in read-only mode');
  }

  ndk = new NDK(ndkOptions);

  ndk.pool.on('relay:connect', (relay) => {
    appLog.info(`Connected to relay: ${relay.url}`);
  });

  ndk.pool.on('relay:disconnect', (relay) => {
    appLog.info(`Disconnected from relay: ${relay.url}`);
  });

  ndk.pool.on('relay:error', (relay, error) => {
    appLog.error(`Relay error (${relay.url}):`, error);
  });

  await ndk.connect(2000);
  appLog.info('Successfully connected to Nostr');
}

export async function disconnectFromNostr() {
  if (!ndk) return;
  await Promise.all(
    Array.from(ndk.pool.relays.values()).map((relay) =>
      new Promise((resolve) => {
        relay.disconnect();
        setTimeout(resolve, 100);
      })
    )
  );
  ndk = undefined;
}

function isWalletScrutinyVerification(event) {
  return getFirstTagValue(event, 'client') === WS_CLIENT_TAG;
}

/**
 * Fetch published verification events since the given cursor, with pagination.
 * @param {number} since Unix timestamp (seconds)
 * @returns {Promise<Array<import('@nostr-dev-kit/ndk').NDKEvent>>}
 */
export async function fetchNewVerifications(since) {
  if (!ndk) {
    throw new Error('NDK is not initialized. Call connectToNostr() first.');
  }

  const filter = {
    kinds: [verificationKind],
    since,
    limit: FETCH_LIMIT,
  };

  const allEvents = new Set();
  let hasMoreEvents = true;
  let pageCount = 0;

  appLog.info(`Fetching verification events since ${since}...`);

  while (hasMoreEvents) {
    pageCount++;
    const pageEvents = await fetchEventsWithTimeout(filter, { closeOnEose: true });

    if (pageEvents.size === 0) {
      hasMoreEvents = false;
      break;
    }

    let oldestCreatedAt = Infinity;
    pageEvents.forEach((event) => {
      if (isWalletScrutinyVerification(event)) {
        allEvents.add(event);
      }
      if (event.created_at < oldestCreatedAt) {
        oldestCreatedAt = event.created_at;
      }
    });

    filter.until = oldestCreatedAt - 1;
    appLog.debug(`Fetched page ${pageCount}: ${pageEvents.size} events, oldest created_at: ${oldestCreatedAt}`);
  }

  const sorted = [...allEvents].sort((a, b) => a.created_at - b.created_at);
  appLog.info(`Fetched ${sorted.length} verification event(s) since ${since} (${pageCount} page(s))`);
  return sorted;
}

/**
 * Build the kind=1 notification payload for a verification event.
 * @param {import('@nostr-dev-kit/ndk').NDKEvent} verificationEvent
 */
export function buildNotificationForVerification(verificationEvent) {
  const metadata = parseVerificationEvent(verificationEvent);
  if (!metadata) {
    throw new Error(`Verification event ${verificationEvent.id} is missing required tags`);
  }

  const url = buildVerificationUrl({
    platform: metadata.platform,
    appId: metadata.appId,
    eventId: verificationEvent.id,
  });

  const content = formatNotificationMessage({ ...metadata, url });

  return {
    content,
    tags: [
      ['e', verificationEvent.id, '', verificationEvent.pubkey],
    ],
    metadata,
  };
}

/**
 * Publish a kind=1 notification for a verification event.
 * @param {import('@nostr-dev-kit/ndk').NDKEvent} verificationEvent
 * @returns {Promise<string>} Published note event id
 */
export async function publishNotification(verificationEvent) {
  if (!ndk) {
    throw new Error('NDK is not initialized. Call connectToNostr() first.');
  }

  const { content, tags } = buildNotificationForVerification(verificationEvent);

  const note = new NDKEvent(ndk, {
    kind: 1,
    content,
    tags,
  });

  await note.publish();
  appLog.info(`Published kind=1 notification for verification ${verificationEvent.id}`);
  return note.id;
}
