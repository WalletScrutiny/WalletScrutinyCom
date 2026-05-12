#!/usr/bin/env node

import fs from 'fs';
import minimist from 'minimist';
import WebSocket from 'ws';
global.WebSocket = WebSocket; // For NDK
import {
  connectToNostr,
  getAllVerifications
} from './nostr-utils.mjs';
import { refreshApps } from './refresh_apps.mjs';
import { appLog, verificationsLog } from './logger.mjs';
import {
  compareVersions,
  fetchAppInfo,
  getFirstTagValue,
  groupVerificationsByAppIdAndSortByVersion,
  getFileAttachmentIDsForVerificationEvent,
  toLegacyPlatform
} from './utils.mjs';
import { verifyAssetsFromRegistry, processNewReleaseVerification, queue } from './verifications.mjs';
import {
  shouldProcessAppId,
  HOURS_BETWEEN_EXECUTIONS,
  APPROVED_VERIFIERS_PUBKEY_HEX,
  WS_BOT_NOSTR_PUBKEY_HEX,
  BUILD_DIR_PREFIX,
  FEATURE_REFRESH_APPS
} from './config/config.mjs';
import { DEBUG } from './config/env.mjs';

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
      // Take only the first (highest) verification for the appId
      const highestVersionVerification = verifications[0];

      let platform = getFirstTagValue(highestVersionVerification.verification, 'platform');
      let legacyPlatform = toLegacyPlatform(platform);

      let walletInfo = null;
      if (legacyPlatform === 'desktop' && refreshResults.desktop[appId]) {
        walletInfo = refreshResults.desktop[appId];
      } else if (legacyPlatform === 'hardware' && refreshResults.hardware[appId]) {
        walletInfo = refreshResults.hardware[appId];
      } else {
        appLog.error(`Wallet ${appId} not found in refreshResults for platform ${legacyPlatform}`);
        verificationsLog.info(`--- ${appId} ${highestVersionVerification.version} | Wallet not found in refreshResults for platform ${legacyPlatform}`);
        continue;
      }

      if (compareVersions(highestVersionVerification.version, walletInfo.latestVersion) > 0) {
        appLog.info(`Wallet ${appId} has a newer version: ${highestVersionVerification.version} (latest verification) ==> ${walletInfo.latestVersion} (latest version in wallet repo)`);
        await processNewReleaseVerification(highestVersionVerification.verification, walletInfo.latestVersion, appInfo, wsBotVerifications, githubToken);
      } else {
        appLog.info(`There is no newer version of ${appId}: ${highestVersionVerification.version} (latest verification) ==> ${walletInfo.latestVersion} (latest version in wallet repo). Skipping...`);
        continue;
      }
    }

  } catch (error) {
    appLog.error('Error during process:', error);
    throw error;
  }
}

const args = minimist(process.argv.slice(2));

/**
 * Load a secret from a file referenced by an env var, falling back to a CLI
 * argument for local development. Throws if neither source is provided.
 */
function loadSecret({ name, fileEnv, argName }) {
  const filePath = process.env[fileEnv];
  if (filePath) {
    return fs.readFileSync(filePath, 'utf8').trim();
  }
  const argValue = args[argName];
  if (argValue) {
    console.warn(`Warning: Using ${name} from argv (dev only)`);
    return argValue;
  }
  throw new Error(`${name} not provided`);
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

while (true) {
  try {
    await mainProcess(githubToken, wsBotNostrPrivateKey);
  } catch (error) {
    appLog.error('Error during execution:', error);
  }
  
  appLog.info(`======= Waiting ${HOURS_BETWEEN_EXECUTIONS} hours until next execution... =======\n`);
  await new Promise(resolve => setTimeout(resolve, HOURS_BETWEEN_EXECUTIONS * 60 * 60 * 1000));
}