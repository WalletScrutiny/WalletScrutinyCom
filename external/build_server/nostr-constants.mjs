import { isDebugEnv } from './config/argv.mjs';

export const mainRelayUrl = "wss://relay.nostr.info/";
export const explicitRelayUrls = [
  mainRelayUrl,                       // FI - Do not change
  "wss://nostr.mom/",                 // DE (rate-limited)
  "wss://relay.primal.net/",          // CA
  "wss://relay.damus.io/",            // CA
  "wss://purplepag.es/",              // Profile-focused (NIP-77)
  "wss://nos.lol/",
];

export const profileRelayUrl = "wss://purplepag.es/";
export const eventRelayUrls = explicitRelayUrls.filter((url) => url !== profileRelayUrl);

export const wsBotPublicKey = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

export const nip89ClientTagD = '7703371760017';

// Verifications
export const assetRegistrationKind = isDebugEnv() ? 1267 : 1063;
export const assetBundleRegistrationKind = isDebugEnv() ? 9605 : 9401;
export const verificationKind = isDebugEnv() ? 32304 : 30301;

export const verificationEventsSinceTS = isDebugEnv() ? 1742220163 : 1742997262;