// Hours between main process executions
export const HOURS_BETWEEN_EXECUTIONS = 24;

// Approved verifiers public keys (hex format)
export const APPROVED_VERIFIERS_PUBKEY_HEX = [
  '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed', // danny
  '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45', // keraliss
];

export const WS_BOT_NOSTR_PUBKEY_HEX = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

// Public key of the Nostr account that will receive notifications about issues with the app
export const NOSTR_NOTIFICATIONS_PUBLIC_KEY = '03b5036dc3db82604307c1964d2b926417a91c3b11ef75ba6ca55019e9b7a62a';

// Queue configuration
export const QUEUE_TIMEOUT_HOURS = 6;
export const QUEUE_CONCURRENCY = 3;

// Debug array: If it has elements, it will only process these appIds. If it is empty, it will process all.
export const DEBUG_APP_IDS = [
    // Example: 'com.example.app', 'org.bitcoin.wallet', 'bitcoinknots'
];

export const BUILD_DIR = '/opt/build-server-builds';