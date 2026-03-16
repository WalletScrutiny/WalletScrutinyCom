// Hours between main process executions
export const HOURS_BETWEEN_EXECUTIONS = 24;

// Approved verifiers public keys (hex format)
export const APPROVED_VERIFIERS_PUBKEY_HEX = [
  '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed', // danny
  '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45', // keraliss
];

export const WS_BOT_NOSTR_PUBKEY_HEX = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

// Queue configuration
export const QUEUE_TIMEOUT_HOURS = 6;
export const QUEUE_CONCURRENCY = 3;
// Debug: log when job runs longer than this (minutes). Set to 0 to disable. Helps investigate if processes finish without queue being notified.
export const QUEUE_DEBUG_TIMEOUT_MINUTES = 15;

// Debug filter: include = only these appIds (empty = all); exclude = never these appIds
export const DEBUG_APP_IDS = {
  include: [],  // If empty, process all except exclude. If has elements, process only these (minus any in exclude)
  exclude: ['app.zeusln.zeus', 'io.metamask'],   // Always skip these appIds
  // Include these (appId, version) pairs even when they already have verifications (for re-build testing)
  includeEvenWithVerification: []  // e.g. [{ appId: 'com.example.wallet', version: '1.2.3' }]
};

export function shouldProcessAppId(appId) {
  if (DEBUG_APP_IDS.exclude.includes(appId)) return false;
  if (DEBUG_APP_IDS.include.length === 0) return true;
  return DEBUG_APP_IDS.include.includes(appId);
}

export const BUILD_DIR = '/opt/build-server-builds';

export const BLOSSOM_SERVER_URL = 'https://files.nostr.info';