import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isDebugEnv } from './argv.mjs';

// Approved verifiers public keys (hex format)
export const APPROVED_VERIFIERS_PUBKEY_HEX = [
  '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed', // danny
  '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45', // keraliss
  '54790a499115f63e32536aadab43f62c0cf3922cd1653b3a74846fe2f6573f5d', // BitForBit (Carol)
];

// Approved verifiers who left the team: ABS keeps reusing the scripts of the
// verifications they published while on it, and ignores anything else signed
// by their key (a new or replaced event, or one with a back-dated created_at).
// pubkey -> ids of the verification events ABS may use.
export const PINNED_VERIFIER_EVENT_IDS = {
  // keraliss: his 436 verifications as of 2026-11-17, the newest from 2026-09-07
  '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45': new Set(
    JSON.parse(fs.readFileSync(new URL('./keraliss-verification-ids.json', import.meta.url), 'utf8'))
  ),
};

// Approved verifiers trusted only for some apps: pubkey -> appIds whose
// verifications ABS may use. Their verifications for other apps are ignored.
export const SCOPED_VERIFIER_APP_IDS = {
  // BitForBit (Carol): one test app first (Danny, Luis Miguel, 2026-11-17),
  // then the apps whose alerts Carol triages (Danny, 2026-11-26)
  '54790a499115f63e32536aadab43f62c0cf3922cd1653b3a74846fe2f6573f5d': ['com.coinspace.app', 'world.bitkey.app', 'io.horizontalsystems.bankwallet'],
};

/**
 * False for events by a pinned verifier that are not on their list, and for
 * events by a scoped verifier about an app outside their scope.
 */
export function isTrustedVerifierEvent(event, pinned = PINNED_VERIFIER_EVENT_IDS, scoped = SCOPED_VERIFIER_APP_IDS) {
  const ids = pinned[event?.pubkey];
  if (ids && !ids.has(event.id)) return false;
  const appIds = scoped[event?.pubkey];
  if (appIds && !appIds.includes(event.tags?.find(tag => tag[0] === 'i')?.[1])) return false;
  return true;
}

export const WS_BOT_NOSTR_PUBKEY_HEX = '168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335';

// Hours between main process executions
export const HOURS_BETWEEN_EXECUTIONS = 1;

// Asset Registry watch: a live relay subscription wakes the main loop early
// when a new asset is registered, instead of waiting for the next scheduled
// execution. The scheduled scan stays the source of truth.
// Seconds to wait after the first new asset before waking (a bundle
// registration arrives as several events in a row).
export const ASSET_WATCH_DEBOUNCE_SECONDS = 30;
// Minutes between watchdog checks that re-open the subscription on relays that
// are disconnected (set to 0 to disable the watchdog).
export const ASSET_WATCH_WATCHDOG_MINUTES = 5;

// Feature flag: when true, mainProcess also refreshes desktop/hardware wallet
// versions and queues verifications for any new release found in the wallet
// repos (in addition to assets registered in the Asset Registry).
// Set to false to reproduce only Asset Registry assets.
export const FEATURE_REFRESH_APPS = true;

// Feature flag: when true, a newly published ftbfs or not_reproducible verdict
// for a version newer than the reproducible one it was built from posts an
// alert in the Buzz Reproducible-Builds channel, tagging Carol (see
// regression-alert.mjs). So does an Android asset skipped because no script
// was verified on its signer. Needs ALERT_NOSTR_NSEC_FILE.
export const FEATURE_REGRESSION_ALERTS = true;
export const REGRESSION_ALERT_RELAY_URL = 'https://buzz.walletscrutiny.com';
export const REGRESSION_ALERT_CHANNEL_ID = '55ad8b5e-0356-4548-aafe-6ddd2c06bab0'; // Reproducible-Builds
export const REGRESSION_ALERT_MENTION = {
  name: 'Carol (agent, Opus 5.5, high)',
  pubkey: 'fab90c1a5aa488fbabbac00cae04307429147f36af69930b72c1c6a53c4e9b26'
};
export const REGRESSION_ALERT_TIMEOUT_SECONDS = 10;
// Apps whose regressions are alerted (empty = every app). One test app first
// (Danny, Luis Miguel, 2026-11-17), the same one BitForBit is scoped to; Bitkey and
// Unstoppable added (Danny, 2026-11-26).
export const REGRESSION_ALERT_APP_IDS = ['com.coinspace.app', 'world.bitkey.app', 'io.horizontalsystems.bankwallet'];
// Apps whose skipped signers are alerted (empty = every app). Every app: a
// skipped APK gets no verdict at all, and one alert per app and signer is
// little noise (Dan's review of !2062, 2026-11-26).
export const SKIPPED_SIGNER_ALERT_APP_IDS = [];

// Apps whose build scripts get the real GITHUB_TOKEN. Every other script gets
// the public-only token instead, which keeps the real one out of its
// environment and so out of published recordings (Dan, Luis Miguel,
// 2026-11-26). Scripts still run as the ABS user and can read the credential
// file itself until they run as abs-runner. Scripts that only use the token to
// avoid GitHub rate limits are not on the list.
export const GITHUB_TOKEN_APP_IDS = [
  'to.bitkit',             // Bitkit: Gradle deps on GitHub Packages need read:packages
  'com.tangem.wallet',     // Tangem: Gradle deps on GitHub Packages need read:packages
  'com.coinspace.app',     // Coin Wallet: Gradle and npm deps on GitHub Packages need read:packages
  'com.gemwallet.android', // Gem: older versions pull wallet-core from GitHub Packages
  'sparrow',               // Sparrow Windows: dispatches the Windows build on GitHub Actions
  'bisq',                  // Bisq 1 Windows: dispatches CI and reads its artifacts
  'gingerwallet',          // GingerWallet: dispatches the build on GitHub Actions
];

// Queue configuration
export const QUEUE_TIMEOUT_HOURS = 6;
export const QUEUE_CONCURRENCY = 3;
// Debug: log when job runs longer than this (minutes). Set to 0 to disable. Helps investigate if processes finish without queue being notified.
export const QUEUE_DEBUG_TIMEOUT_MINUTES = 30;
// Interval (minutes) for periodic queue status logs
export const QUEUE_STATUS_INTERVAL_MINUTES = 5;

// Debug filter: include = only these appIds (empty = all); exclude = never these appIds
export const DEBUG_APP_IDS = {
  include: [],  // If empty, process all except exclude. If has elements, process only these (minus any in exclude)
  exclude: [],   // Always skip these appIds
  // Force rebuild for these (appId, version) pairs even when they already have
  // verifications or a previous build attempt in the database (for re-build testing)
  forceRebuild: []  // e.g. [{ appId: 'com.example.wallet', version: '1.2.3' }]
};

export function shouldForceRebuild(appId, version) {
  return (DEBUG_APP_IDS.forceRebuild || []).some(
    entry => entry.appId === appId && entry.version === version
  );
}

export function shouldProcessAppId(appId) {
  if (DEBUG_APP_IDS.exclude.includes(appId)) return false;
  if (DEBUG_APP_IDS.include.length === 0) return true;
  return DEBUG_APP_IDS.include.includes(appId);
}

export const BUILD_DIR = '/opt/build-server-builds';

// Resolves to external/build_server/build_server_build_dir when running in debug mode,
// and to BUILD_DIR in production. Kept here (rather than in index.mjs) so it can be
// imported by verifications.mjs and utils.mjs without creating a circular dependency.
const BUILD_SERVER_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const BUILD_DIR_DEBUG = path.join(BUILD_SERVER_ROOT, 'build_server_build_dir');
export const BUILD_DIR_PREFIX = isDebugEnv() ? BUILD_DIR_DEBUG : BUILD_DIR;

export const BLOSSOM_SERVER_URL = 'https://files.nostr.info';