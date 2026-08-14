import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import * as nip19 from 'nostr-tools/nip19';

/** True on localhost / beta / old hostnames unless `?forceProd=true`. Node (no window) is production. */
function isDebugEnv() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (new URLSearchParams(window.location.search).get('forceProd') === 'true') {
    return false;
  }
  return window.location.hostname.includes('localhost') || window.location.hostname.includes('beta') || window.location.hostname.includes('old');
}

function getFirstTagValue(event, tagName, valueIfNull = '') {
  return event.tags?.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

/**
 * Digest for asset hash(es) used in the NIP-33 replaceable key.
 * One hash is used as-is; multiple hashes are sorted, concatenated, and re-hashed.
 */
function getAssetHashesDigest(hashes) {
  if (!hashes?.length) {
    return '';
  }
  if (hashes.length === 1) {
    return hashes[0];
  }
  const concatenated = [...hashes].sort().join('');
  return bytesToHex(sha256(new TextEncoder().encode(concatenated)));
}

/** NIP-33 replaceable key for verification and draft events (${appId}:${version}:${platform}:${hashDigest}). */
function getVerificationReplaceableKey(appId, version, platform, hashes = []) {
  let key = '';
  if (appId) {
    key += `${appId}:`;
  }
  key += `${version}:${platform}`;
  const hashDigest = getAssetHashesDigest(hashes);
  if (hashDigest) {
    key += `:${hashDigest}`;
  }
  return key;
}

function getNpubFromPubkey(pubkey) {
  return nip19.npubEncode(pubkey);
}

function shortenNpub(npub) {
  if (!npub || npub.length < 16) return npub;
  return `${npub.substring(0, 10)}…${npub.substring(npub.length - 6)}`;
}

function getStatusText(status, short = false) {
  switch (status) {
    case 'reproducible':
      return 'Reproducible when tested';
    case 'not_reproducible':
      return short ? 'Not reproducible' : 'Not reproducible from source provided, or differences are significant';
    case 'ftbfs':
      return short ? 'Failed to build from source' : 'Failed to build from source provided';
    case 'spam':
      return short ? 'Spam' : 'The application is spam';
    case 'notag':
      return short ? 'Git revision not clear' : 'The git revision to compile is not clear';
    case 'nosource':
      return short ? 'Source not found' : 'Source for this version was not found or repository was taken down';
    case 'obfuscated':
      return short ? 'Source obfuscated' : 'Source code is obfuscated';
    case 'warning':
      return 'Warning';
    default:
      return status;
  }
}

export {
  isDebugEnv,
  getFirstTagValue,
  getAssetHashesDigest,
  getVerificationReplaceableKey,
  getNpubFromPubkey,
  shortenNpub,
  getStatusText,
};

if (typeof window !== 'undefined') {
  window.getFirstTagValue = getFirstTagValue;
  window.getStatusText = getStatusText;
}