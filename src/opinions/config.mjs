import * as nip19 from 'nostr-tools/nip19';
import { parseSubjectKeys, parseTagList } from './content.mjs';

const HEX_PUBKEY = /^[0-9a-f]{64}$/i;

/** Accepts a hex pubkey, an npub or an nprofile; anything else is ignored. */
export function toHexPubkey(entity) {
  const value = String(entity ?? '').trim();
  if (HEX_PUBKEY.test(value)) {
    return value.toLowerCase();
  }
  try {
    const decoded = nip19.decode(value);
    if (decoded.type === 'npub') {
      return decoded.data;
    }
    if (decoded.type === 'nprofile') {
      return decoded.data.pubkey;
    }
  } catch {
    // not a nip19 entity
  }
  return null;
}

function parseJsonList(value) {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function hexSet(entities) {
  return new Set(entities.map(toHexPubkey).filter(Boolean));
}

/** Trusted authors and the blocklist, from the data attributes on the opinions index. */
export function readModerationLists(dataset) {
  return {
    trustedAuthors: hexSet(parseJsonList(dataset.trustedAuthors)),
    blockedEventIds: new Set(parseJsonList(dataset.blockedEventIds).map((id) => id.toLowerCase())),
    blockedAuthors: hexSet(parseJsonList(dataset.blockedAuthors)),
  };
}

/**
 * Widget parameters from the data attributes written by
 * _includes/review/nostrOpinion.html.
 */
export function readWidgetConfig(dataset) {
  const subject = String(dataset.subject ?? '').trim();
  if (!subject) {
    throw new Error('opinions: data-subject is required');
  }
  return {
    subject,
    subjectKeys: parseSubjectKeys(subject, dataset.subjects),
    /** Android package id, set on mobile pages: Zapstore comments are looked up by it. */
    zapstoreAppId: String(dataset.zapstoreAppId ?? '').trim(),
    header: dataset.header ?? '',
    footer: dataset.footer ?? '',
    title: dataset.title ?? '',
    image: dataset.image ?? '',
    tags: parseTagList(dataset.tags || 'nostrOpinion'),
    summary: `An opinion made about ${subject} generated using nostr-opinion-plugin.`,
    ...readModerationLists(dataset),
  };
}
