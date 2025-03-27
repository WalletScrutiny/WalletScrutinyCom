import { isDebug } from './verifications_utils.mjs';

export const mainRelayUrl = "wss://relay.nostr.band";

export const explicitRelayUrls = [
  mainRelayUrl,                       // FI - Do not change
  "wss://vidono.apps.slidestr.net/",  // FR
  "wss://nostr.mom/",                 // DE (rate-limited)
  "wss://relay.primal.net/",          // CA
  "wss://relay.damus.io/",            // CA
  "wss://strfry.iris.to/",            // CA
];

export const wsBotPublicKey = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

export const nip89ClientTagD = '5985153332267';

// Verifications
export const assetRegistrationKind = isDebug() ? 1267 : 1063;
export const verificationKind = isDebug() ? 32304 : 30301;
export const endorsementKind = isDebug() ? 30302 : 30302;

export const verificationEventsSinceTS = isDebug() ? 1742220163 : 1742997262;