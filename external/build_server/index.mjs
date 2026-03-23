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
import { verifyAssetsFromRegistry, processNewReleaseVerification, queue } from './verifications.mjs';
import {
  shouldProcessAppId,
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
    const appInfo = await fetchAppInfo();

    await connectToNostr(wsBotNostrPrivateKey);
    const allVerificationsRaw = await getAllVerifications([WS_BOT_NOSTR_PUBKEY_HEX, ...APPROVED_VERIFIERS_PUBKEY_HEX]);

    await verifyAssetsFromRegistry(allVerificationsRaw, appInfo, githubToken);

    appLog.info('[QUEUE_INFO] Waiting for queue to drain...');
    await queue.onIdle();
    appLog.info('[QUEUE_INFO] Queue idle - all jobs completed.');

    // For now, we'll try to reproduce only assets from the Asset Registry (android, hardware, desktop)
    return;

    // Refresh desktop and hardware apps to get latest versions
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

let githubToken;
let wsBotNostrPrivateKey;

try {
  if (process.env.GITHUB_TOKEN_FILE) {
    githubToken = fs.readFileSync(process.env.GITHUB_TOKEN_FILE, 'utf8').trim();
  } else if (args.githubToken) {
    console.warn('Warning: Using GITHUB_TOKEN from argv (dev only)');
    githubToken = args.githubToken;
  } else {
    throw new Error('GITHUB_TOKEN not provided');
  }

  if (process.env.WS_BOT_PK_FILE) {
    wsBotNostrPrivateKey = fs.readFileSync(process.env.WS_BOT_PK_FILE, 'utf8').trim();
  } else if (args.wsBotNostrPrivateKey) {
    console.warn('Warning: Using WS_BOT_PK from argv (dev only)');
    wsBotNostrPrivateKey = args.wsBotNostrPrivateKey;
  } else {
    throw new Error('WS_BOT_PK not provided');
  }
} catch (error) {
  appLog.error('Error loading required secrets:', error);
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