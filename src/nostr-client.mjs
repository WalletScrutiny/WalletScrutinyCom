import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure';
import { hexToBytes } from '@noble/hashes/utils.js';
import { bech32 } from '@scure/base';
import * as nip04 from 'nostr-tools/nip04';
import * as nip19 from 'nostr-tools/nip19';
import * as nip57 from 'nostr-tools/nip57';
import { eventRelayUrls } from './nostr-constants.mjs';

let pool = null;
let relayUrls = [];
let privateKeyMaterial = null;
let connectionPromise = null;

const relayListeners = {
  onConnect: null,
  onDisconnect: null,
  onError: null,
};

export function setupWebSocketForNode(WebSocketImpl) {
  useWebSocketImplementation(WebSocketImpl);
}

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

export async function fetchEventsWithPagination(filter) {
  const allEvents = new Set();
  let hasMoreEvents = true;
  let pageCount = 0;
  const pageFilter = { ...filter };

  while (hasMoreEvents) {
    pageCount++;
    try {
      const pageEvents = await fetchEvents(pageFilter);

      if (pageEvents.size === 0) {
        hasMoreEvents = false;
        break;
      }

      let oldestCreatedAt = Infinity;
      pageEvents.forEach(event => {
        allEvents.add(event);
        if (event.created_at < oldestCreatedAt) {
          oldestCreatedAt = event.created_at;
        }
      });

      pageFilter.until = oldestCreatedAt - 1;
    } catch (error) {
      console.error(`Error fetching page ${pageCount}:`, error);
      break;
    }
  }

  return allEvents;
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

export async function fetchProfile(pubkey, options = {}) {
  await ensureConnected();
  const urls = options.relayUrls ?? eventRelayUrls;
  const maxWait = options.maxWait ?? 4000;

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const event = await pool.get([url], { kinds: [0], authors: [pubkey], limit: 1 }, { maxWait });
      if (!event?.content) {
        return null;
      }
      try {
        return JSON.parse(event.content);
      } catch {
        return null;
      }
    })
  );

  let fallback = null;
  for (const result of results) {
    if (result.status !== 'fulfilled' || !result.value || typeof result.value !== 'object') {
      continue;
    }
    const profile = result.value;
    if (profile.picture || profile.image) {
      return profile;
    }
    if (!fallback) {
      fallback = profile;
    }
  }

  return fallback;
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

export function parseZapInvoiceFromReceipt(event) {
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
    created_at: created_at ?? Math.floor(Date.now() / 1000),
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

export { nip04, nip19, nip57 };
