import DOMPurify from 'dompurify';
import * as nip19 from 'nostr-tools/nip19';
import { ensureConnected, getPool } from './nostr-client.mjs';
import { eventRelayUrls } from './nostr-constants.mjs';
import { el, htmlOf, isSha256Hex, sanitizeHttpUrl } from './html-utils.mjs';

const DB_NAME = 'WalletScrutinyDB';
const DB_VERSION = 4;
const PROFILES_STORE = 'profiles';
const PROFILE_HIT_MAX_AGE = 24 * 60 * 60;
const PROFILE_CACHE_VERSION = 6;
const PROFILE_URL_KEYS = new Set(['image', 'picture', 'banner']);

const purifyConfig = {
  ALLOWED_TAGS: ['div'],
  ALLOWED_ATTR: ['id'],
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  RETURN_TRUSTED_TYPE: false,
};

export const PROFILE_PLACEHOLDER_IMAGE = '/images/profile-placeholder.svg';

let dbOpenPromise = null;
const inFlightProfileFetches = new Map();

function openProfilesDb() {
  if (dbOpenPromise) {
    return dbOpenPromise;
  }

  dbOpenPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      dbOpenPromise = null;
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      dbOpenPromise = null;
      reject(`IndexedDB error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(PROFILES_STORE)) {
        const profilesStore = db.createObjectStore(PROFILES_STORE, { keyPath: 'pubkey' });
        profilesStore.createIndex('cached_at', 'cached_at', { unique: false });
      }
    };
  });

  return dbOpenPromise;
}

async function saveProfileToIDB(pubkey, profile) {
  const db = await openProfilesDb().catch(() => null);
  if (!db) {
    return;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROFILES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(PROFILES_STORE);
    const request = objectStore.put({
      pubkey,
      profile,
      cached_at: Math.floor(Date.now() / 1000),
      cache_version: PROFILE_CACHE_VERSION,
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject('Error saving profile to IDB');
  });
}

async function getProfileFromIDB(pubkey) {
  const db = await openProfilesDb().catch(() => null);
  if (!db) {
    return null;
  }

  return new Promise((resolve) => {
    const transaction = db.transaction([PROFILES_STORE], 'readonly');
    const objectStore = transaction.objectStore(PROFILES_STORE);
    const request = objectStore.get(pubkey);
    request.onsuccess = () => {
      const result = request.result;
      if (!result) {
        resolve(null);
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const age = now - result.cached_at;
      const isEmpty = !result.profile || Object.keys(result.profile).length === 0;
      if (isEmpty || age > PROFILE_HIT_MAX_AGE || result.cache_version !== PROFILE_CACHE_VERSION) {
        resolve(null);
        return;
      }

      resolve(result.profile);
    };
    request.onerror = () => resolve(null);
  });
}

function sanitizeProfileMediaUrl(url) {
  return sanitizeHttpUrl(url) ?? '';
}

function sanitizeProfileValue(key, value) {
  const str = String(value ?? '');
  if (PROFILE_URL_KEYS.has(key)) {
    return sanitizeProfileMediaUrl(str);
  }
  // Text-only: strip tags. Attribute escaping is handled by el()/setAttribute at render.
  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(str, purifyConfig);
  }
  return str.replace(/<[^>]*>/g, '');
}

function normalizeProfileMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object' || Object.keys(metadata).length === 0) {
    return null;
  }
  const normalized = { ...metadata };
  if (!normalized.image && normalized.picture) {
    normalized.image = normalized.picture;
  }
  if (!normalized.displayName && normalized.display_name) {
    normalized.displayName = normalized.display_name;
  }
  return normalized;
}

function hasUsableCachedProfileMetadata(metadata) {
  if (!metadata) {
    return false;
  }
  if (metadata.image || metadata.picture) {
    return true;
  }
  return Boolean(String(metadata.name || metadata.displayName || metadata.display_name || '').trim());
}

function buildProfile(pubkey, metadata, profileEvent) {
  const normalized = normalizeProfileMetadata(metadata);
  if (!normalized) {
    return null;
  }
  return {
    pubkey,
    ...normalized,
    profileEvent,
  };
}

async function fetchKind0ProfileEvent(pubkey) {
  await ensureConnected();
  const pool = getPool();
  if (!pool) {
    return null;
  }
  return pool.get(
    eventRelayUrls,
    { kinds: [0], authors: [pubkey], limit: 1 },
    { maxWait: 10_000 }
  );
}

/**
 * Fetch a Nostr profile by pubkey.
 * Returns display metadata (name, image, lud16, …) plus the kind-0 event for zaps.
 */
export async function getNostrProfile(pubkey) {
  if (!pubkey || pubkey.length !== 64) {
    console.info('getNostrProfile: Invalid pubkey', pubkey);
    return null;
  }

  const cached = await getProfileFromIDB(pubkey).catch(() => null);
  if (cached) {
    const normalizedCached = normalizeProfileMetadata(cached);
    if (hasUsableCachedProfileMetadata(normalizedCached)) {
      return { pubkey, ...normalizedCached, profileEvent: cached.profileEvent ?? null };
    }
  }

  if (inFlightProfileFetches.has(pubkey)) {
    return inFlightProfileFetches.get(pubkey);
  }

  const fetchPromise = (async () => {
    let profileEvent;
    try {
      profileEvent = await fetchKind0ProfileEvent(pubkey);
    } catch (e) {
      console.debug(
        `Nostr profile fetch failed for ${pubkey.substring(0, 8)}...`,
        e && e.message ? e.message : e
      );
      return null;
    }

    if (!profileEvent?.content) {
      return null;
    }

    let metadata;
    try {
      metadata = JSON.parse(profileEvent.content);
    } catch {
      return null;
    }

    if (!metadata || typeof metadata !== 'object' || Object.keys(metadata).length === 0) {
      return null;
    }

    const sanitizedMetadata = {};
    Object.keys(metadata).forEach((key) => {
      sanitizedMetadata[key] = sanitizeProfileValue(key, metadata[key]);
    });

    const profile = buildProfile(pubkey, sanitizedMetadata, profileEvent);
    if (!profile) {
      return null;
    }

    saveProfileToIDB(pubkey, profile).catch((e) => console.warn('Failed to save profile to IDB', e));
    return profile;
  })().finally(() => {
    inFlightProfileFetches.delete(pubkey);
  });

  inFlightProfileFetches.set(pubkey, fetchPromise);
  return fetchPromise;
}

function shortenNpub(npub) {
  if (!npub || npub.length < 16) {
    return npub;
  }
  return `${npub.substring(0, 10)}…${npub.substring(npub.length - 6)}`;
}

export function getProfileDisplayName(profile, pubkey) {
  const candidate = profile && (profile.name || profile.displayName || profile.display_name);
  if (candidate && String(candidate).trim()) {
    return String(candidate).trim();
  }
  try {
    return shortenNpub(nip19.npubEncode(pubkey));
  } catch {
    return pubkey ? `${pubkey.substring(0, 8)}…` : '';
  }
}

function normalizeProfileImageUrl(url) {
  const safe = sanitizeHttpUrl(url);
  if (!safe) {
    return '';
  }
  if (
    typeof window !== 'undefined' &&
    window.location?.protocol === 'https:' &&
    safe.startsWith('http://')
  ) {
    return `https://${safe.slice('http://'.length)}`;
  }
  return safe;
}

export function getProfileImageUrl(profile) {
  const url = normalizeProfileImageUrl(profile?.image || profile?.picture);
  return url || PROFILE_PLACEHOLDER_IMAGE;
}

export function profileImageFallback(img) {
  const placeholder = img.dataset.placeholder || PROFILE_PLACEHOLDER_IMAGE;
  if (img.src !== placeholder) {
    img.onerror = null;
    img.src = placeholder;
    img.classList.add('profile-circle--placeholder');
  }
}

function wireProfileImageFallback(img) {
  img.addEventListener('error', () => profileImageFallback(img));
}

function wireVerifierNavigation(node, pubkey) {
  if (!isSha256Hex(pubkey)) {
    return;
  }
  node.style.cursor = 'pointer';
  node.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = `/verifier/?pubkey=${pubkey}`;
  });
}

/**
 * Build profile circle markup. Callers that insert via innerHTML should then call
 * wireProfileCircleInteractions(container) so image fallback / navigation work without
 * interpolating untrusted values into inline handlers.
 */
export function buildProfileCircleHtml(pubkey, profile, imageUrl, placeholderUrl) {
  const displayName = getProfileDisplayName(profile, pubkey);
  const safeImageUrl = sanitizeHttpUrl(imageUrl) || placeholderUrl || PROFILE_PLACEHOLDER_IMAGE;
  const safePlaceholder = placeholderUrl || PROFILE_PLACEHOLDER_IMAGE;
  const placeholderClass = safeImageUrl === safePlaceholder ? ' profile-circle--placeholder' : '';
  const safePubkey = isSha256Hex(pubkey) ? pubkey : '';

  const container = el('div', {
    className: 'profile-circle-container',
    dataset: { name: displayName },
  },
    el('img', {
      src: safeImageUrl,
      className: `profile-circle${placeholderClass}`,
      alt: '',
      dataset: { placeholder: safePlaceholder },
    }),
    el('div', { className: 'profile-hover-modal' },
      el('div', { className: 'profile-modal-content' },
        el('img', {
          src: safeImageUrl,
          className: 'profile-modal-image',
          alt: '',
          dataset: { placeholder: safePlaceholder },
        }),
        el('br'),
        el('span', {}, displayName),
        el('button', {
          type: 'button',
          className: 'profile-page-btn',
          ...(safePubkey ? { dataset: { verifierPubkey: safePubkey } } : {}),
        }, 'Verifier Page'),
      ),
    ),
  );

  return htmlOf(container);
}

export function wireProfileCircleInteractions(root) {
  if (!root) {
    return;
  }
  root.querySelectorAll('img.profile-circle, img.profile-modal-image').forEach(wireProfileImageFallback);
  root.querySelectorAll('.profile-page-btn[data-verifier-pubkey]').forEach((btn) => {
    wireVerifierNavigation(btn, btn.dataset.verifierPubkey);
  });
}

export function renderProfileCardHtml(pubkey, profile) {
  const displayName = getProfileDisplayName(profile, pubkey);
  const imageUrl = getProfileImageUrl(profile);
  const safePubkey = isSha256Hex(pubkey) ? pubkey : '';
  const card = el('div', {
    className: 'profile-card',
    style: { cursor: safePubkey ? 'pointer' : '' },
    ...(safePubkey ? { dataset: { verifierPubkey: safePubkey } } : {}),
  },
    el('img', {
      src: imageUrl,
      className: 'profile-image',
      alt: '',
      dataset: { placeholder: PROFILE_PLACEHOLDER_IMAGE },
    }),
    el('div', { className: 'profile-info' },
      el('div', {}, displayName),
      profile?.nip05 ? el('div', { className: 'profile-nip05' }, profile.nip05) : null,
    ),
  );
  return htmlOf(card);
}

export function wireProfileCardInteractions(root) {
  if (!root) {
    return;
  }
  root.querySelectorAll('img.profile-image').forEach(wireProfileImageFallback);
  root.querySelectorAll('.profile-card[data-verifier-pubkey]').forEach((card) => {
    wireVerifierNavigation(card, card.dataset.verifierPubkey);
  });
}

export function renderBigProfileCardHtml(pubkey, profile) {
  const displayName = getProfileDisplayName(profile, pubkey);
  const imageUrl = getProfileImageUrl(profile);
  const card = el('div', { className: 'big-profile-card' },
    el('img', {
      src: imageUrl,
      alt: 'Profile Picture',
      style: {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        marginBottom: '10px',
        objectFit: 'cover',
      },
      dataset: { placeholder: PROFILE_PLACEHOLDER_IMAGE },
    }),
    el('div', { style: { fontSize: '1.5em', fontWeight: 'bold' } }, displayName),
    profile?.nip05 ? el('div', { className: 'profile-nip05' }, profile.nip05) : null,
  );
  return htmlOf(card);
}

export function wireBigProfileCardInteractions(root) {
  if (!root) {
    return;
  }
  root.querySelectorAll('img').forEach(wireProfileImageFallback);
}

if (typeof window !== 'undefined') {
  window.getNostrProfile = getNostrProfile;
  window.getProfileDisplayName = getProfileDisplayName;
  window.getProfileImageUrl = getProfileImageUrl;
  window.PROFILE_PLACEHOLDER_IMAGE = PROFILE_PLACEHOLDER_IMAGE;
  window.profileImageFallback = profileImageFallback;
  window.buildProfileCircleHtml = buildProfileCircleHtml;
  window.wireProfileCircleInteractions = wireProfileCircleInteractions;
  window.renderProfileCardHtml = renderProfileCardHtml;
  window.wireProfileCardInteractions = wireProfileCardInteractions;
  window.renderBigProfileCardHtml = renderBigProfileCardHtml;
  window.wireBigProfileCardInteractions = wireBigProfileCardInteractions;
}
