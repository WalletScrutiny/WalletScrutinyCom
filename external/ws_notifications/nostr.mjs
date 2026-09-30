import {
  connectNostr,
  getPool,
  fetchEvents,
  createEventDraft,
  signEvent,
  publishEvent,
  setPrivateKey,
  disconnectNostr,
} from '../../src/nostr-client.mjs';
import { eventRelayUrls, verificationKind } from './nostr-constants.mjs';
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

async function fetchEventsWithTimeout(filter) {
  const fetchPromise = fetchEvents(filter);
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
  return getPool();
}

export async function connectToNostr(nostrPrivateKey) {
  appLog.info('Connecting to Nostr relays...');

  if (nostrPrivateKey) {
    setPrivateKey(nostrPrivateKey);
  } else {
    appLog.info('No Nostr private key provided; connected in read-only mode');
  }

  await connectNostr({
    relayUrls: eventRelayUrls,
    connectTimeoutMs: 2000,
    privateKey: nostrPrivateKey ?? undefined,
    onRelayConnect: (relay) => {
      appLog.info(`Connected to relay: ${relay.url}`);
    },
    onRelayDisconnect: (relay) => {
      appLog.info(`Disconnected from relay: ${relay.url}`);
    },
    onRelayError: (relay, error) => {
      appLog.error(`Relay error (${relay.url}):`, error);
    },
  });

  appLog.info('Successfully connected to Nostr');
}

export async function disconnectFromNostr() {
  await disconnectNostr();
}

function isWalletScrutinyVerification(event) {
  return getFirstTagValue(event, 'client') === WS_CLIENT_TAG;
}

export async function fetchNewVerifications(since) {
  if (!getPool()) {
    throw new Error('Nostr pool is not initialized. Call connectToNostr() first.');
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
    const pageEvents = await fetchEventsWithTimeout(filter);

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

export async function publishNotification(verificationEvent) {
  if (!getPool()) {
    throw new Error('Nostr pool is not initialized. Call connectToNostr() first.');
  }

  const { content, tags } = buildNotificationForVerification(verificationEvent);

  const draft = createEventDraft({
    kind: 1,
    content,
    tags,
  });

  const signed = await signEvent(draft);
  await publishEvent(signed);
  appLog.info(`Published kind=1 notification for verification ${verificationEvent.id}`);
  return signed.id;
}
