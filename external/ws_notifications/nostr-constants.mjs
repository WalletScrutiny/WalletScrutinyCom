import { isDebugEnv } from './config/env.mjs';

export const mainRelayUrl = 'wss://relay.nostr.info/';
export const explicitRelayUrls = [
  mainRelayUrl,
  'wss://nostr.mom/',
  'wss://relay.primal.net/',
  'wss://relay.damus.io/',
  'wss://purplepag.es/',
  'wss://nos.lol/',
];

export const profileRelayUrl = 'wss://purplepag.es/';
export const eventRelayUrls = explicitRelayUrls.filter((url) => url !== profileRelayUrl);

export const wsBotPublicKey = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

export const verificationKind = isDebugEnv() ? 32304 : 30301;
