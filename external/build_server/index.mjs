#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';
import WebSocket from 'ws';
global.WebSocket = WebSocket; // For NDK
import {
  connectToNostr,
  getAllVerifications
} from './nostr-utils.mjs';
import { refreshApps } from './refresh_apps.mjs';
import { appLog, verificationsLog } from './logger.js';
import {
  compareVersions,
  fetchAppInfo,
  getFirstTagValue,
  isDebugEnv,
  groupVerificationsByAppIdAndSortByVersion,
  getFileAttachmentIDsForVerificationEvent
} from './utils.mjs';
import { verifyAssetsFromRegistry, processNewReleaseVerification } from './verifications.mjs';
import {
  DEBUG_APP_IDS,
  HOURS_BETWEEN_EXECUTIONS,
  APPROVED_VERIFIERS_PUBKEY_HEX,
  WS_BOT_NOSTR_PUBKEY_HEX,
  BUILD_DIR
} from './config/config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const BUILD_DIR_PREFIX = isDebugEnv() ? path.join(__dirname, 'build_server_build_dir') : BUILD_DIR;

async function mainProcess(githubToken, wsBotNostrPrivateKey) {
  appLog.info('------- Starting mainProcess -------');

  try {
    // Fetch app info for build server
    const appInfo = await fetchAppInfo();

    await connectToNostr(wsBotNostrPrivateKey);
    const verifications = await getAllVerifications([WS_BOT_NOSTR_PUBKEY_HEX, ...APPROVED_VERIFIERS_PUBKEY_HEX]);

    await verifyAssetsFromRegistry(verifications, appInfo);

    // Refresh desktop and hardware apps to get latest versions
    const refreshResults = await refreshApps(githubToken);
    appLog.info(`Refreshed ${refreshResults.total} apps (${Object.keys(refreshResults.desktop).length} desktop, ${Object.keys(refreshResults.hardware).length} hardware)`);

    const reproducibleVerifications = [];
    const wsBotVerifications = [];
    
    // Iterate over all verifications
    for (const [sha256, verificationEvents] of verifications) {
      for (const verification of verificationEvents) {
        const fileAttachmentIds = getFileAttachmentIDsForVerificationEvent(verification);
        if (fileAttachmentIds.length === 0) {
          continue;
        }

        // Debug filter: If DEBUG_APP_IDS has elements, it will only process those appIds. If it is empty, it will process all.
        if (DEBUG_APP_IDS.length > 0 && !DEBUG_APP_IDS.includes(getFirstTagValue(verification, 'i'))) {
          continue;
        }

        if (verification.pubkey === WS_BOT_NOSTR_PUBKEY_HEX) {
          wsBotVerifications.push(verification);
          continue;
        }

        if (['hardware', 'desktop', 'linux', 'windows'].includes(getFirstTagValue(verification, 'platform'))) {
          reproducibleVerifications.push(verification);
        }
      }
    }

    appLog.info(`=== Reproducible Verifications ===`);
    appLog.info(`Total found: ${reproducibleVerifications.length}`);

    if (reproducibleVerifications.length === 0) {
      appLog.info('No reproducible verifications found.');
      return;
    }

    const verificationsByAppId = groupVerificationsByAppIdAndSortByVersion(reproducibleVerifications);
    
    // Sort versions for each appId (highest first) and take only the first one
    for (const [appId, verifications] of verificationsByAppId) {
      // Sort by version (descending - highest first), then by created_at (descending - newest first)
      verifications.sort((a, b) => {
        // Simple version comparison - assumes semantic versioning
        const aParts = a.version.split('.').map(Number);
        const bParts = b.version.split('.').map(Number);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = aParts[i] || 0;
          const bPart = bParts[i] || 0;
          
          if (aPart !== bPart) {
            return bPart - aPart; // Descending order
          }
        }
        // If versions are equal, sort by created_at (descending - newest first)
        const aCreatedAt = a.verification.created_at || 0;
        const bCreatedAt = b.verification.created_at || 0;
        return bCreatedAt - aCreatedAt;
      });

      // Take only the first (highest) verification for the appId
      const highestVersionVerification = verifications[0];

      let platform = getFirstTagValue(highestVersionVerification.verification, 'platform');
      let legacyPlatform = ['linux', 'windows', 'macos'].includes(platform) ? 'desktop' : platform;

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
        await processNewReleaseVerification(highestVersionVerification.verification, walletInfo.latestVersion, appInfo, wsBotVerifications);
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
const githubToken = args.githubToken;
const wsBotNostrPrivateKey = args.wsBotNostrPrivateKey;

if (!githubToken) {
  appLog.error('Error: GitHub token is required - Usage: node index.mjs --githubToken <github_token> [--debug]');
  process.exit(1);
}

if (!wsBotNostrPrivateKey) {
  appLog.error('Error: WS_BOT_PK is required - Usage: node index.mjs --wsBotNostrPrivateKey <ws_bot_nostr_private_key> [--debug]');
  process.exit(1);
}

const isDebug = args.debug === true || args.debug === 'true';
if (isDebug) {
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