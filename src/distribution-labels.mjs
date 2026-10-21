/**
 * Store-package check results as NIP-32 labels (kind 1985), read by the store-package
 * step (assets/js/distribution-checks.js) through window.loadDistributionChecks, which
 * src/verifications_utils.mjs sets up once the site's Nostr connection exists.
 *
 * A label says that one store revision of a package matches (or differs from) the official
 * file it wraps. It is never a verification: the colour on the page comes from the wrapped
 * file's own verdict. Labels count only when signed by the pinned key (site config
 * `distribution_label_pubkey`), and every field is checked before it is used.
 *
 *   kind 1985, pubkey = pinned key
 *   ["L", "ws.distribution"]
 *   ["l", "matches" | "differs", "ws.distribution"]
 *   ["r", "https://flathub.org/apps/<id>"]   the package; single-letter, so relays index it
 *   ["channel", "flathub"], ["id", "<id>"]
 *   ["commit", "<store revision, 64 hex>"], ["version", "<store version>"]
 *   ["x", "<sha256 of the wrapped official file>"], ["file", "<its file name>"]
 *   ["method", "files" | "pin"]
 *   created_at = when we checked
 */
import { verifyEvent } from 'nostr-tools/pure';

import { fetchEvents } from './nostr-client.mjs';
import { verificationKind } from './nostr-constants.mjs';

export const LABEL_KIND = 1985;
export const LABEL_NAMESPACE = 'ws.distribution';
const HEX64 = /^[0-9a-f]{64}$/;
/** Verification statuses, as validated in createVerification (src/verifications_utils.mjs). */
const STATUSES = ['reproducible', 'not_reproducible', 'ftbfs', 'spam', 'notag', 'nosource', 'warning', 'obfuscated'];

/** URL of a package in its store, used as the label's indexed `r` tag. */
const STORE_URL = {
  flathub: id => `https://flathub.org/apps/${id}`,
};

function tagValues(event, name) {
  return (event.tags || []).filter(t => Array.isArray(t) && t[0] === name).map(t => t[1]);
}

/** The single value of a tag, or null when it is missing or given more than once. */
function only(event, name) {
  const values = tagValues(event, name);
  return values.length === 1 && typeof values[0] === 'string' ? values[0] : null;
}

/** Relay filter for the labels of one package. */
export function labelFilter({ pubkey, channel, id }) {
  return {
    kinds: [LABEL_KIND],
    authors: [pubkey],
    '#L': [LABEL_NAMESPACE],
    '#r': [STORE_URL[channel](id)],
    limit: 200,
  };
}

/**
 * The check a label describes, in the shape distribution-checks.js expects (verdict still
 * unknown), or null if the label is not one we trust for this package.
 */
export function labelToCheck(event, { pubkey, channel, id }, verify = verifyEvent) {
  if (!event || event.kind !== LABEL_KIND || event.pubkey !== pubkey) return null;
  if (!tagValues(event, 'L').includes(LABEL_NAMESPACE)) return null;
  const results = (event.tags || []).filter(t => t[0] === 'l' && t[2] === LABEL_NAMESPACE).map(t => t[1]);
  if (results.length !== 1 || !['matches', 'differs'].includes(results[0])) return null;
  if (only(event, 'channel') !== channel || only(event, 'id') !== id) return null;
  if (!tagValues(event, 'r').includes(STORE_URL[channel](id))) return null;
  const commit = only(event, 'commit');
  const sha256 = only(event, 'x');
  if (!commit || !HEX64.test(commit) || !sha256 || !HEX64.test(sha256)) return null;
  if (!Number.isInteger(event.created_at) || event.created_at <= 0) return null;
  // The pool already verifies signatures; checking again keeps this safe for any caller.
  // nostr-tools caches the result on the event object, and the cache survives a spread
  // copy with changed tags, so verify a fresh object with only the signed fields.
  const { id: eventId, kind, tags, content, sig } = event;
  if (!verify({ id: eventId, pubkey: event.pubkey, created_at: event.created_at, kind, tags, content, sig })) return null;
  return {
    commit,
    version: only(event, 'version'),
    checked: new Date(event.created_at * 1000).toISOString().slice(0, 10),
    result: results[0],
    file: only(event, 'file'),
    sha256,
    verdict: null,
    created_at: event.created_at,
  };
}

/** Newest verification status per sha256, from verification events. */
export function verdictsBySha256(verifications, sha256s) {
  const wanted = new Set(sha256s);
  const newest = new Map();
  for (const v of verifications) {
    const status = only(v, 'status');
    if (!STATUSES.includes(status)) continue;
    for (const x of tagValues(v, 'x')) {
      if (!wanted.has(x)) continue;
      const prev = newest.get(x);
      if (!prev || v.created_at > prev.created_at) newest.set(x, { created_at: v.created_at, status });
    }
  }
  return new Map([...newest].map(([x, { status }]) => [x, status]));
}

/**
 * Checks for one package, newest first, each with the wrapped file's verdict filled in.
 * Returns [] when the pinned key is missing or malformed, or the channel is unknown.
 */
export async function loadDistributionChecks({ pubkey, channel, id }, { ensureConnected = async () => {} } = {}) {
  if (typeof pubkey !== 'string' || !HEX64.test(pubkey) || !STORE_URL[channel]) return [];
  await ensureConnected();
  const expected = { pubkey, channel, id };
  const labels = await fetchEvents(labelFilter(expected));
  const checks = [...labels]
    .sort((a, b) => b.created_at - a.created_at)
    .map(e => labelToCheck(e, expected))
    .filter(Boolean);
  if (!checks.length) return [];
  const sha256s = [...new Set(checks.map(c => c.sha256))];
  const verifications = await fetchEvents({ kinds: [verificationKind], '#x': sha256s });
  const verdicts = verdictsBySha256([...verifications], sha256s);
  return checks.map(({ created_at, ...c }) => ({ ...c, verdict: verdicts.get(c.sha256) ?? null }));
}
