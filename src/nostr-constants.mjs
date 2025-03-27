import { isDebug } from './verifications_utils.mjs';

export const explicitRelayUrls = [
  "wss://relay.primal.net/",          // CA
  "wss://relay.damus.io/",            // CA
  "wss://strfry.iris.to/",            // CA
  "wss://vidono.apps.slidestr.net/",  // FR
  "wss://relay.nostr.band/",          // FI
  "wss://nostr.mom/"                  // DE (rate-limited)
];

// Verifications
export const assetRegistrationKind = isDebug() ? 1267 : 1063;
export const verificationKind = isDebug() ? 32304 : 30301;
export const endorsementKind = isDebug() ? 30302 : 30302;

export const verificationsFeatureSinceTS = isDebug() ? 1742220163 : 1742220163;