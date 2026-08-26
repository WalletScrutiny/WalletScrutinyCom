import { SimplePool } from 'nostr-tools/pool';
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure';
import { hexToBytes } from '@noble/hashes/utils.js';
import { bech32 } from '@scure/base';
import * as nip19 from 'nostr-tools/nip19';

let nip04Promise;
let nip57Promise;

function getNip04() {
  nip04Promise ??= import('nostr-tools/nip04');
  return nip04Promise;
}

export function getNip57() {
  nip57Promise ??= import('nostr-tools/nip57');
  return nip57Promise;
}

let pool = null;
let relayUrls = [];
let privateKeyMaterial = null;
let connectionPromise = null;

const relayListeners = {
  onConnect: null,
  onDisconnect: null,
  onError: null,
};

function normalizePrivateKey(key) {
  if (!key) {
    return null;
  }
  if (typeof key === 'string' && key.startsWith('nsec')) {
    const decoded = nip19.decode(key);
    if (decoded.type !== 'nsec') {
      throw new Error('Invalid nsec key');
    }
    return typeof decoded.data === 'string' ? hexToBytes(decoded.data) : decoded.data;
  }
  return key;
}

function getPrivateKeyBytes() {
  if (!privateKeyMaterial) {
    return null;
  }
  if (typeof privateKeyMaterial === 'string') {
    return hexToBytes(privateKeyMaterial);
  }
  return privateKeyMaterial;
}

export function getTagValue(event, tagName) {
  const tag = event.tags?.find(t => t[0] === tagName);
  return tag?.[1] ?? '';
}

export function getMatchingTags(event, tagName) {
  return event.tags?.filter(t => t[0] === tagName) ?? [];
}

export function getPool() {
  return pool;
}

/** @deprecated Use getPool() */
export function getNdk() {
  return pool;
}

export function getRelayUrls() {
  return relayUrls;
}

export function setPrivateKey(privateKey) {
  privateKeyMaterial = normalizePrivateKey(privateKey);
}

export async function connectNostr(options = {}) {
  const {
    relayUrls: urls,
    connectTimeoutMs = 3000,
    privateKey = undefined,
    onRelayConnect,
    onRelayDisconnect,
    onRelayError,
  } = options;

  relayListeners.onConnect = onRelayConnect ?? null;
  relayListeners.onDisconnect = onRelayDisconnect ?? null;
  relayListeners.onError = onRelayError ?? null;

  if (privateKey !== undefined) {
    privateKeyMaterial = normalizePrivateKey(privateKey);
  }

  if (urls) {
    relayUrls = urls;
  }

  if (connectionPromise && pool) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    if (!pool) {
      pool = new SimplePool();
    }

    await Promise.allSettled(
      relayUrls.map(async (url) => {
        try {
          await pool.ensureRelay(url, { connectionTimeout: connectTimeoutMs });
          relayListeners.onConnect?.({ url });
        } catch (error) {
          relayListeners.onError?.({ url }, error);
        }
      })
    );
  })();

  return connectionPromise;
}

export async function ensureConnected() {
  if (connectionPromise) {
    await connectionPromise;
  }
  if (!pool) {
    throw new Error('Nostr pool not initialized');
  }
}

export async function disconnectNostr() {
  if (pool) {
    pool.destroy();
    pool = null;
  }
  connectionPromise = null;
}

export async function withEphemeralPool(urls, fn, { connectTimeoutMs = 3000 } = {}) {
  const ephemeralPool = new SimplePool();
  try {
    await Promise.allSettled(
      urls.map(url => ephemeralPool.ensureRelay(url, { connectionTimeout: connectTimeoutMs }))
    );
    return await fn(ephemeralPool, urls);
  } finally {
    ephemeralPool.destroy();
  }
}

export async function fetchEvents(filterOrFilters, options = {}) {
  await ensureConnected();
  const filters = Array.isArray(filterOrFilters) ? filterOrFilters : [filterOrFilters];
  const urls = options.relayUrls ?? relayUrls;
  const eventMap = new Map();
  const maxWait = options.maxWait ?? 3000;

  for (const filter of filters) {
    const events = await pool.querySync(urls, filter, {
      maxWait,
      abort: options.abort,
    });
    for (const event of events) {
      eventMap.set(event.id, event);
    }
  }

  return new Set(eventMap.values());
}

export async function fetchEvent(eventId, options = {}) {
  await ensureConnected();
  return pool.get(relayUrls, { ids: [eventId] }, { maxWait: options.maxWait ?? 3000 });
}

const DEFAULT_PAGINATION_PAGE_LIMIT = 500;
const DEFAULT_PAGINATION_MAX_WAIT_MS = 15_000;
const DEFAULT_EMPTY_PAGE_RETRIES = 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resolvePaginationPageLimit(relayUrl, filter, options) {
  if (filter.limit !== undefined) {
    return filter.limit;
  }
  const relayLimit = options.relayPageLimits?.[relayUrl];
  if (relayLimit !== undefined) {
    return relayLimit;
  }
  if (options.pageLimit !== undefined) {
    return options.pageLimit;
  }
  return DEFAULT_PAGINATION_PAGE_LIMIT;
}

function formatPaginationKindsLabel(filter) {
  if (!filter.kinds?.length) {
    return '';
  }
  return ` kinds=[${filter.kinds.join(',')}]`;
}

async function fetchEventsWithPaginationFromRelay(relayUrl, filter, options = {}) {
  const pageLimit = resolvePaginationPageLimit(relayUrl, filter, options);
  const maxWait = options.maxWait ?? DEFAULT_PAGINATION_MAX_WAIT_MS;
  const maxEmptyRetries = options.maxEmptyRetries ?? DEFAULT_EMPTY_PAGE_RETRIES;
  const since = filter.since;
  const kindsLabel = formatPaginationKindsLabel(filter);

  const relayEvents = new Map();
  let pageCount = 0;
  let emptyPageRetries = 0;
  const pageFilter = { ...filter, limit: pageLimit };

  while (true) {
    pageCount++;
    let pageEvents;

    try {
      pageEvents = await fetchEvents(pageFilter, { maxWait, relayUrls: [relayUrl] });
    } catch (error) {
      console.error(`Error fetching page ${pageCount} from ${relayUrl}${kindsLabel}:`, error);
      break;
    }

    if (pageEvents.size === 0) {
      const hasMoreHistory = since === undefined
        || pageFilter.until === undefined
        || pageFilter.until >= since;

      if (hasMoreHistory && emptyPageRetries < maxEmptyRetries) {
        emptyPageRetries++;
        await sleep(400 * emptyPageRetries);
        continue;
      }
      break;
    }

    emptyPageRetries = 0;

    let oldestCreatedAt = Infinity;
    for (const event of pageEvents) {
      relayEvents.set(event.id, event);
      if (event.created_at < oldestCreatedAt) {
        oldestCreatedAt = event.created_at;
      }
    }

    const isFullPage = pageEvents.size >= pageLimit;

    console.debug(
      `fetchEventsWithPaginationFromRelay(${relayUrl})${kindsLabel}:`
      + ` page ${pageCount} returned ${pageEvents.size} events`
      + (isFullPage ? ' (full page)' : ' (partial page, stopping)')
    );

    if (since !== undefined && oldestCreatedAt <= since) {
      break;
    }

    // A short page means the relay has no older matching events left.
    if (!isFullPage) {
      break;
    }

    pageFilter.until = oldestCreatedAt - 1;
    if (since !== undefined && pageFilter.until < since) {
      break;
    }
  }

  console.debug(
    `fetchEventsWithPaginationFromRelay(${relayUrl})${kindsLabel}:`
    + ` ${relayEvents.size} events in ${pageCount} page(s), limit ${pageLimit}`
  );

  return relayEvents;
}

/**
 * Fetches events backwards in time using `until` pagination.
 * Each relay is paginated independently (a single shared cursor would skip
 * events when relays each return their own limit-sized page) and results are
 * merged by event id.
 */
export async function fetchEventsWithPagination(filter, options = {}) {
  const urls = options.relayUrls ?? relayUrls;
  const relayEventMaps = await Promise.all(
    urls.map(relayUrl => fetchEventsWithPaginationFromRelay(relayUrl, filter, options))
  );

  const allEvents = new Map();
  for (const relayEvents of relayEventMaps) {
    relayEvents.forEach((event, id) => {
      allEvents.set(id, event);
    });
  }

  console.debug(
    `fetchEventsWithPagination: ${allEvents.size} unique events from ${urls.length} relay(s)`
    + (filter.since !== undefined ? ` (since ${filter.since})` : '')
  );

  return new Set(allEvents.values());
}

export async function signEvent(template) {
  if (typeof window !== 'undefined' && window.nostr?.signEvent) {
    return window.nostr.signEvent(template);
  }

  const secretKey = getPrivateKeyBytes();
  if (!secretKey) {
    throw new Error('No signer available');
  }

  return finalizeEvent(template, secretKey);
}

export async function getUserPubkeyFromSigner() {
  if (typeof window !== 'undefined' && window.nostr?.getPublicKey) {
    return window.nostr.getPublicKey();
  }

  const secretKey = getPrivateKeyBytes();
  if (!secretKey) {
    throw new Error('No signer available');
  }

  return getPublicKey(secretKey);
}

export async function publishEvent(event, urlsOverride) {
  await ensureConnected();
  const urls = urlsOverride ?? relayUrls;
  const results = await Promise.allSettled(pool.publish(urls, event));
  const successful = results.filter(result => result.status === 'fulfilled').length;
  return { successful, total: urls.length, results };
}

export async function publishToRelays(event, urls, timeoutMs = 5000, minSuccess = 1) {
  const publishPromise = (async () => {
    await ensureConnected();
    const results = await Promise.allSettled(pool.publish(urls, event));
    const fulfilled = results.filter(result => result.status === 'fulfilled').length;
    if (fulfilled < minSuccess) {
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.message ?? String(result.reason));
      throw new Error(`Published to ${fulfilled} relays, needed ${minSuccess}. Errors: ${errors.join('; ')}`);
    }
    return fulfilled;
  })();

  if (timeoutMs > 0) {
    return Promise.race([
      publishPromise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('publish timeout')), timeoutMs);
      }),
    ]);
  }

  return publishPromise;
}

export function subscribeEvents(filter, { onevent, onclose, maxWait } = {}) {
  if (!pool) {
    throw new Error('Pool not initialized');
  }

  return pool.subscribe(relayUrls, filter, {
    onevent,
    onclose,
    maxWait: maxWait ?? 3000,
  });
}

export async function createEncryptedDm(recipientPubkey, plaintext, authorPubkey) {
  let content;
  if (typeof window !== 'undefined' && window.nostr?.nip04?.encrypt) {
    content = await window.nostr.nip04.encrypt(recipientPubkey, plaintext);
  } else {
    const secretKey = getPrivateKeyBytes();
    if (!secretKey) {
      throw new Error('No signer for NIP-04 encryption');
    }
    const nip04 = await getNip04();
    content = nip04.encrypt(secretKey, recipientPubkey, plaintext);
  }

  const template = {
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', recipientPubkey]],
    content,
  };

  if (authorPubkey) {
    template.pubkey = authorPubkey;
  }

  return signEvent(template);
}

export async function createDeletionRequest(targetEvent, reason = '', publish = true, urlsOverride) {
  const template = {
    kind: 5,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['e', targetEvent.id], ['k', String(targetEvent.kind)]],
    content: reason,
  };
  const signed = await signEvent(template);

  if (publish) {
    await publishEvent(signed, urlsOverride);
  }

  return signed;
}

export async function getNip57ZapSpecFromLud({ lud06, lud16 }) {
  let zapEndpoint;

  if (lud16 && !lud16.startsWith('LNURL')) {
    const [name, domain] = lud16.split('@');
    zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
  } else if (lud06) {
    const { words } = bech32.decode(lud06, 1000);
    const data = bech32.fromWords(words);
    zapEndpoint = new TextDecoder().decode(data);
  }

  if (!zapEndpoint) {
    throw new Error('No zap endpoint found');
  }

  const response = await fetch(zapEndpoint);
  if (response.status !== 200) {
    const text = await response.text();
    throw new Error(`Unable to fetch zap endpoint ${zapEndpoint}: ${text}`);
  }

  return response.json();
}

export async function fetchLnInvoice(zapRequestEvent, amountMsat, lnurlSpec) {
  const url = new URL(lnurlSpec.callback);
  url.searchParams.append('amount', amountMsat.toString());
  url.searchParams.append('nostr', JSON.stringify(zapRequestEvent));

  const response = await fetch(url.toString());
  if (response.status !== 200) {
    const text = await response.text();
    throw new Error(`Unable to fetch zap endpoint ${lnurlSpec.callback}: ${text}`);
  }

  const body = await response.json();
  return body.pr ?? null;
}

export async function parseZapInvoiceFromReceipt(event) {
  const description = getMatchingTags(event, 'description')[0];
  const bolt11 = getMatchingTags(event, 'bolt11')[0];

  if (!description?.[1] || !bolt11?.[1]) {
    return null;
  }

  try {
    let zapRequestPayload = description[1];
    if (zapRequestPayload.startsWith('%')) {
      zapRequestPayload = decodeURIComponent(zapRequestPayload);
    }
    if (zapRequestPayload === '') {
      return null;
    }

    const zapRequest = JSON.parse(zapRequestPayload);
    const amountTag = zapRequest.tags?.find(tag => tag[0] === 'amount');
    const nip57 = await getNip57();
    const amount = amountTag ? Number.parseInt(amountTag[1], 10) : nip57.getSatoshisAmountFromBolt11(bolt11[1]) * 1000;
    const recipientTag = getMatchingTags(event, 'p')[0];
    let zappedEvent = getMatchingTags(event, 'e')[0];
    if (!zappedEvent) {
      zappedEvent = getMatchingTags(event, 'a')[0];
    }

    return {
      id: event.id,
      zapper: event.pubkey,
      zappee: zapRequest.pubkey,
      zapped: recipientTag?.[1],
      zappedEvent: zappedEvent?.[1],
      amount,
      comment: zapRequest.content,
    };
  } catch {
    return null;
  }
}

export function createEventDraft({ kind, content, tags = [], created_at = null, pubkey = null }) {
  const draft = {
    kind,
    content,
    tags: [...tags],
    created_at: Number.isFinite(created_at) ? created_at : Math.floor(Date.now() / 1000),
  };

  if (pubkey) {
    draft.pubkey = pubkey;
  }

  return draft;
}

export async function signAndPublishEvent(template, eventType = 'event', urlsOverride) {
  try {
    const signed = await signEvent(template);
    const { successful } = await publishEvent(signed, urlsOverride);
    console.debug(`Published ${eventType} (id: ${signed.id}) to ${successful} relays`);
    return signed;
  } catch (error) {
    console.error(`Error publishing ${eventType} to relays`, error);
    return null;
  }
}

export { nip19 };
