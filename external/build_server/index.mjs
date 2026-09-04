#!/usr/bin/env node

import fs from 'fs';
import { disconnectNostr } from '../../src/nostr-client.mjs';
import {
  connectToNostr,
  getAllVerifications
} from './nostr-utils.mjs';
import { refreshApps } from './refresh_apps.mjs';
import { appLog, verificationsLog } from './logger.mjs';
import {
  compareVersions,
  fetchAppInfo,
  findHighestVerificationInMajor,
  getFirstTagValue,
  groupVerificationsByAppIdAndSortByVersion,
  getFileAttachmentIDsForVerificationEvent,
  loadSecret,
  DEBUG,
  toLegacyPlatform,
  requestShutdown,
  isShutdownRequested
} from './utils.mjs';
import { verifyAssetsFromRegistry, processNewReleaseVerification, queue } from './verifications.mjs';
import { closeDb, markStaleQueuedAttemptsAsInterrupted } from './ddbbUtils.mjs';
import {
  shouldProcessAppId,
  HOURS_BETWEEN_EXECUTIONS,
  APPROVED_VERIFIERS_PUBKEY_HEX,
  WS_BOT_NOSTR_PUBKEY_HEX,
  BUILD_DIR_PREFIX,
  FEATURE_REFRESH_APPS
} from './config/config.mjs';

async function mainProcess(githubToken, wsBotNostrPrivateKey) {
  appLog.info('------- Starting mainProcess -------');

  try {
    const appInfo = await fetchAppInfo();

    await connectToNostr(wsBotNostrPrivateKey);
    const allVerificationsRaw = await getAllVerifications([WS_BOT_NOSTR_PUBKEY_HEX, ...APPROVED_VERIFIERS_PUBKEY_HEX]);

    await verifyAssetsFromRegistry(allVerificationsRaw, appInfo, githubToken);

    appLog.info('[QUEUE_INFO] Waiting for queue to drain...');
    await queue.onIdle();
    appLog.info('[QUEUE_INFO] Queue idle - all jobs completed.');

    if (isShutdownRequested()) {
      return;
    }

    if (!FEATURE_REFRESH_APPS) {
      // For now, we only reproduce assets from the Asset Registry (android, hardware, desktop).
      // The desktop/hardware refresh flow below is gated until it is fully validated.
      return;
    }

    const refreshResults = await refreshApps(githubToken);
    appLog.info(`Refreshed ${refreshResults.total} apps (${Object.keys(refreshResults.desktop).length} desktop, ${Object.keys(refreshResults.hardware).length} hardware)`);

    const verificationsWithAttachments = [];
    const wsBotVerifications = [];

    for (const [, verificationEvents] of allVerificationsRaw) {
      for (const verification of verificationEvents) {
        const fileAttachmentIds = getFileAttachmentIDsForVerificationEvent(verification);
        if (fileAttachmentIds.length === 0) {
          continue;
        }

        if (!shouldProcessAppId(getFirstTagValue(verification, 'i'))) {
          continue;
        }

        if (verification.pubkey === WS_BOT_NOSTR_PUBKEY_HEX) {
          wsBotVerifications.push(verification);
          continue;
        }

        if (['hardware', 'desktop', 'linux', 'windows'].includes(getFirstTagValue(verification, 'platform'))) {
          verificationsWithAttachments.push(verification);
        }
      }
    }

    appLog.info(`=== Verifications with attachments ===`);
    appLog.info(`Total found: ${verificationsWithAttachments.length}`);

    if (verificationsWithAttachments.length === 0) {
      appLog.info('No verifications with attachments found.');
      return;
    }

    const verificationsByAppId = groupVerificationsByAppIdAndSortByVersion(verificationsWithAttachments);

    for (const [appId, verifications] of verificationsByAppId) {
      const fallbackVerification = verifications[0];
      let platform = getFirstTagValue(fallbackVerification.verification, 'platform');
      let legacyPlatform = toLegacyPlatform(platform);

      let walletInfo = null;
      if (legacyPlatform === 'desktop' && refreshResults.desktop[appId]) {
        walletInfo = refreshResults.desktop[appId];
      } else if (legacyPlatform === 'hardware' && refreshResults.hardware[appId]) {
        walletInfo = refreshResults.hardware[appId];
      } else {
        appLog.error(`Wallet ${appId} not found in refreshResults for platform ${legacyPlatform}`);
        verificationsLog.info(`--- ${appId} ${fallbackVerification.version} | Wallet not found in refreshResults for platform ${legacyPlatform}`);
        continue;
      }

      const latestWalletVersion = walletInfo.latestVersion;
      const highestInMajor = findHighestVerificationInMajor(verifications, latestWalletVersion);
      const verificationForScript = highestInMajor ?? fallbackVerification;
      const verifiedVersionInMajor = highestInMajor?.version ?? null;

      const hasNewerVersion = verifiedVersionInMajor === null
        ? true
        : compareVersions(verifiedVersionInMajor, latestWalletVersion) > 0;

      if (hasNewerVersion) {
        const verifiedLabel = verifiedVersionInMajor ?? 'none in this major line';
        appLog.info(
          `Wallet ${appId} has a newer version: ${verifiedLabel} (latest verification in major line) ==> ${latestWalletVersion} (latest version in wallet repo)`
        );
        await processNewReleaseVerification(
          verificationForScript.verification,
          latestWalletVersion,
          appInfo,
          wsBotVerifications,
          githubToken
        );
      } else {
        appLog.info(
          `There is no newer version of ${appId}: ${verifiedVersionInMajor} (latest verification in major line) ==> ${latestWalletVersion} (latest version in wallet repo). Skipping...`
        );
        continue;
      }
    }

  } catch (error) {
    appLog.error('Error during process:', error);
    throw error;
  }
}

let githubToken;
let wsBotNostrPrivateKey;

try {
  githubToken = loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE', argName: 'githubToken' });
  wsBotNostrPrivateKey = loadSecret({ name: 'WS_BOT_PK', fileEnv: 'WS_BOT_PK_FILE', argName: 'wsBotNostrPrivateKey' });
} catch (error) {
  appLog.error('Error loading required secrets:', error);
  process.exit(1);
}

if (DEBUG) {
  appLog.info('======= DEBUG MODE ENABLED =======');
}

appLog.info('======= Starting Build Server App =======');

fs.mkdirSync(BUILD_DIR_PREFIX, { recursive: true });

const staleQueuedAttempts = markStaleQueuedAttemptsAsInterrupted();
if (staleQueuedAttempts > 0) {
  appLog.warn(`[QUEUE_INFO] ${staleQueuedAttempts} verification row(s) were still 'queued' from a previous run; marked as 'interrupted' so they can be retried.`);
}

let interruptSleep = null;
let mainProcessRunning = null;
let shutdownPromise = null;

async function gracefulShutdown(signal) {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    appLog.info(`Received ${signal}, shutting down gracefully...`);
    requestShutdown();
    interruptSleep?.();

    if (mainProcessRunning) {
      appLog.info('Waiting for current mainProcess cycle to finish...');
      await mainProcessRunning;
    }

    appLog.info('[QUEUE_INFO] Waiting for queue to drain before exit...');
    await queue.onIdle();

    closeDb();

    try {
      await disconnectNostr();
    } catch (error) {
      appLog.warn('Error disconnecting from Nostr during shutdown:', error);
    }

    appLog.info('Shutdown complete.');
    process.exit(0);
  })();

  return shutdownPromise;
}

process.on('SIGTERM', () => { void gracefulShutdown('SIGTERM'); });
process.on('SIGINT', () => { void gracefulShutdown('SIGINT'); });

async function sleepUntilNextCycle() {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, HOURS_BETWEEN_EXECUTIONS * 60 * 60 * 1000);
    interruptSleep = () => {
      clearTimeout(timer);
      resolve();
    };
  });
}

while (!isShutdownRequested()) {
  try {
    const run = mainProcess(githubToken, wsBotNostrPrivateKey);
    mainProcessRunning = run;
    await run;
  } catch (error) {
    appLog.error('Error during execution:', error);
  } finally {
    mainProcessRunning = null;
  }

  if (isShutdownRequested()) {
    break;
  }

  appLog.info(`======= Waiting ${HOURS_BETWEEN_EXECUTIONS} hours until next execution... =======\n`);
  await sleepUntilNextCycle();
}

if (shutdownPromise) {
  await shutdownPromise;
}