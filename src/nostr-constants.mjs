import { isDebugEnv } from './verifications_common.mjs';

export const mainRelayUrl = "wss://relay.nostr.info/";
export const explicitRelayUrls = [
  mainRelayUrl,                       // FI - Do not change
  "wss://nostr.mom/",                 // DE (rate-limited)
  "wss://relay.primal.net/",          // CA
  "wss://relay.ditto.pub/",
  "wss://purplepag.es/",              // Profile-focused (NIP-77)
  "wss://nos.lol/",
];

/** NIP-77 relay; do not use for kind-0 fetches (stalls ~5–8s without returning data). */
export const profileRelayUrl = "wss://purplepag.es/";

/**
 * Relays for writes, kind-0 profile fetches, and admin backup scripts.
 * Application-event reads use readRelayUrls (the project relay only).
 * Excludes profileRelayUrl, which often never sends EOSE on id/kind filters.
 */
export const eventRelayUrls = explicitRelayUrls.filter((url) => url !== profileRelayUrl);

/** Application-event reads (verifications, assets, comments, …). Not kind 0. */
export const readRelayUrls = [mainRelayUrl];

/** Writes go to every event relay; publish must succeed on mainRelayUrl. */
export const writeRelayUrls = eventRelayUrls;

/** Default LIMIT per paginated REQ when a relay has no entry in relayPaginationPageLimits. */
export const defaultRelayPaginationPageLimit = 500;

/**
 * Max events per paginated filter REQ, keyed by relay URL.
 * Match each relay's server-side response cap (e.g. strfry maxFilterLimit).
 * For strfry, also raise relay.queryTimesliceBudgetMicroseconds or scans stop
 * early and clients need many small pages despite a high limit.
 */
export const relayPaginationPageLimits = {
  [mainRelayUrl]: 2000,
};

export const wsBotPublicKey = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

export const nip89ClientTagD = '7703371760017';

// Verifications
export const assetRegistrationKind = isDebugEnv() ? 1267 : 1063;
export const assetBundleRegistrationKind = isDebugEnv() ? 9605 : 9401;
export const verificationKind = isDebugEnv() ? 32304 : 30301;
export const verificationDraftKind = isDebugEnv() ? 30901 : 30801;
export const verificationCommentKind = isDebugEnv() ? 30902 : 30802;
export const codeSnippetKind = 1337;
export const endorsementKind = isDebugEnv() ? 31971 : 31871;

export const maxFileAttachmentContentLength = 48235;

/** NIP-56 reporting; debug uses a separate kind so local reports never hit production. */
export const verificationReportKind = isDebugEnv() ? 11984 : 1984;

/**
 * Hex pubkeys (64-char) of WalletScrutiny.com administrators.
 * Only these accounts see the in-app report control, and only their
 * verification-report events can hide verifications on the site.
 */
export const siteAdminPubkeys = [
  '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed', // danny
  '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45', // keraliss
  '46fcbe3065eaf1ae7811465924e48923363ff3f526bd6f73d7c184b16bd8ce4d', // Leo
  '03b5036dc3db82604307c1964d2b926417a91c3b11ef75ba6ca55019e9b7a62a', // Luis
];

export function isWalletScrutinySiteAdmin(pubkey) {
  return Boolean(pubkey && siteAdminPubkeys.includes(pubkey));
}

/** Allowed `r` tag values on NIP-56 verification reports. */
export const REPORT_REASONS = new Set(['spam', 'incorrect']);

// Opinions
export const opinionKind = 30023; // Long-form Content (NIP-23)

export const verificationEventsSinceTS = isDebugEnv() ? 1742220163 : 1742997262;