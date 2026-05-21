import { isDebugEnv } from './verifications_common.mjs';

export const mainRelayUrl = "wss://relay.nostr.info/";
export const explicitRelayUrls = [
  mainRelayUrl,                       // FI - Do not change
  "wss://relay.nostr.band/",
  "wss://vidono.apps.slidestr.net/",  // FR
  "wss://nostr.mom/",                 // DE (rate-limited)
  "wss://relay.primal.net/",          // CA
  "wss://relay.damus.io/",            // CA
  "wss://strfry.iris.to/",            // CA
  "wss://purplepag.es/",              // Profile-focused (NIP-77)
  "wss://nos.lol/",
];

export const wsBotPublicKey = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

export const nip89ClientTagD = '7703371760017';

// Verifications
export const assetRegistrationKind = isDebugEnv() ? 1267 : 1063;
export const verificationKind = isDebugEnv() ? 32304 : 30301;
export const verificationDraftKind = isDebugEnv() ? 30901 : 30801;
export const verificationCommentKind = isDebugEnv() ? 30902 : 30802;
export const codeSnippetKind = 1337;
export const endorsementKind = isDebugEnv() ? 31971 : 31871;

export const maxFileAttachmentContentLength = 48235;

/** NIP-56: reporting; used by site admins to flag bogus verifications. */
export const verificationReportKind = 1984;

/**
 * Hex pubkeys (64-char) of WalletScrutiny.com administrators.
 * Only these accounts see the in-app "Report as wrong/spam" control.
 * (Visibility of verifications uses any kind-1984 that references the event id.)
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

// Opinions
export const opinionKind = 30023; // Long-form Content (NIP-23)

export const verificationEventsSinceTS = isDebugEnv() ? 1742220163 : 1742997262;