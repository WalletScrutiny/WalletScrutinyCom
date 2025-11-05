#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  connectToNostr,
  getAllVerifications,
  getFileAttachmentIDsForVerificationEvent,
  getEventsFromEventIds,
  uploadBlobToBlossomServer,
  createVerification,
  getNdk
} from './nostr-utils.mjs';
import { getFirstTagValue } from '../../src/verifications_common.mjs';
import { refreshApps } from './refresh_apps.mjs';
import PQueue from 'p-queue';
import { appLog, verificationsLog } from './logger.js';
import minimist from 'minimist';
import WebSocket from 'ws';
import { compareVersions, findFileRecursively, fetchAppInfo, execScript } from './utils.mjs';
global.WebSocket = WebSocket; // Configure WebSocket globally for NDK

// Debug array: If it has elements, it will only process these appIds. If it is empty, it will process all.
const DEBUG_APP_IDS = [
  // Example: 'com.example.app', 'org.bitcoin.wallet',
  'bitcoinknots'
];

const HOURS_BETWEEN_EXECUTIONS = 24;
const APPROVED_VERIFIERS_PUBKEY_HEX = [
  '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed', // danny
  '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45', // keraliss
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_DIR_PREFIX = path.join(__dirname, '..', 'build_server_build_dir');
let buildDirForThisVerification = null;

const queueTimeoutHours = 6;

const queue = new PQueue({
  concurrency: 3,
  timeout: queueTimeoutHours * 60 * 60 * 1000,
  throwOnTimeout: true
});
queue.on('active', () => logQueueInfo());
queue.on('next', () => logQueueInfo());
queue.on('error', error => {
	appLog.error(error);
  // TODO: We can potentially send a Nostr notification to the user to inform them about the error running the script
});
function logQueueInfo() {
  appLog.info(` ** Queue info - Waiting (${queue.size})  Running (${queue.pending}): ${JSON.stringify(queue.runningTasks)}`);
}

async function mainProcess(githubToken, wsBotNostrPrivateKey) {
  appLog.info('------- Starting mainProcess -------');

  try {
    // First, refresh desktop and hardware apps to get latest versions
    const refreshResults = await refreshApps(githubToken);
    appLog.info(`Refreshed ${refreshResults.total} apps (${Object.keys(refreshResults.desktop).length} desktop, ${Object.keys(refreshResults.hardware).length} hardware)`);

    // Fetch app info for build server
    const appInfo = await fetchAppInfo();
    appLog.info('');

    await connectToNostr(wsBotNostrPrivateKey);
    appLog.info('');

    const verifications = await getAllVerifications(APPROVED_VERIFIERS_PUBKEY_HEX);
    appLog.info('');

    const reproducibleVerifications = [];
    
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

        if (
          getFirstTagValue(verification, 'status') === 'reproducible' &&
          ['hardware', 'desktop', 'linux', 'windows', 'macos'].includes(getFirstTagValue(verification, 'platform'))
        ) {
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

    // Group verifications by appId and sort by version
    const verificationsByAppId = new Map();
    
    for (const verification of reproducibleVerifications) {
      const appId = getFirstTagValue(verification, 'i');
      let version = getFirstTagValue(verification, 'version');
      version = version.replace(/^v/i, '');
      
      if (!verificationsByAppId.has(appId)) {
        verificationsByAppId.set(appId, []);
      }
      
      verificationsByAppId.get(appId).push({
        verification,
        version
      });
    }

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
      const highestVersion = verifications[0];

      let platform = getFirstTagValue(highestVersion.verification, 'platform');
      let legacyPlatform = ['linux', 'windows', 'macos'].includes(platform) ? 'desktop' : platform;

      let walletInfo = null;
      if (legacyPlatform === 'desktop' && refreshResults.desktop[appId]) {
        walletInfo = refreshResults.desktop[appId];
        // appLog.info(`Found wallet in desktop refreshResults: ${appId} -> ${walletInfo.latestVersion}`);
      } else if (legacyPlatform === 'hardware' && refreshResults.hardware[appId]) {
        walletInfo = refreshResults.hardware[appId];
        // appLog.info(`Found wallet in hardware refreshResults: ${appId} -> ${walletInfo.latestVersion}`);
      } else {
        appLog.error(`Wallet ${appId} not found in refreshResults for platform ${legacyPlatform}`);
      }

      if (compareVersions(walletInfo.latestVersion, "v29.1.knots20251010") > 0) {
        appLog.info(`Wallet ${appId} has a newer version: ${walletInfo.latestVersion} (wallet repo) > ${highestVersion.version} (latest verification)`);
        await processVerification(highestVersion.verification, walletInfo.latestVersion, appInfo);
      } else {
        appLog.info(`Wallet ${appId} doesn't have a newer version: ${walletInfo.latestVersion} (wallet repo) <= ${highestVersion.version} (latest verification). Skipping...`);
        continue;
      }
    }

  } catch (error) {
    appLog.error('Error during process:', error);
    throw error;
  }
}

async function processVerification(verification, newWalletVersion, appInfo) {
  try {
    // Capture ndk instance at the start to ensure it's available in async callbacks
    const ndkInstance = getNdk();
    if (!ndkInstance) {
      throw new Error('NDK instance is not initialized');
    }

    const appId = getFirstTagValue(verification, 'i');
    const version = getFirstTagValue(verification, 'version');
    const platform = getFirstTagValue(verification, 'platform');
    const legacyPlatform = ['linux', 'windows', 'macos'].includes(platform) ? 'desktop' : platform;

    // Get file attachment IDs
    const fileAttachmentIds = getFileAttachmentIDsForVerificationEvent(verification);
    
    if (fileAttachmentIds.length === 0) {
      appLog.info(`${appId} | ${version} | ${platform} | No attachments, so no verification can be tried`);
      return;
    }

    // Get file events
    const fileEvents = await getEventsFromEventIds(fileAttachmentIds);

    let fileEventIdsForSHFiles = [];
    
    for (const fileEvent of fileEvents) {
      const fileName = getFirstTagValue(fileEvent, 'name');
      const extension = getFirstTagValue(fileEvent, 'extension');
      
      // Only process .sh files
      if (extension === 'sh') {
        fileEventIdsForSHFiles.push(fileEvent.id);

        const appInfoFromWS = appInfo[legacyPlatform][appId];
        const architectures = appInfoFromWS.architectures;
        const types = appInfoFromWS.types;
        appLog.info(` *** architectures: ${architectures}`);
        appLog.info(` *** types: ${types}`);

        // Ensure at least one iteration even if arrays are empty
        const architecturesToIterate = architectures && architectures.length > 0 ? architectures : [undefined];
        const typesToIterate = types && types.length > 0 ? types : [undefined];

        for (const architecture of architecturesToIterate) {
          for (const type of typesToIterate) {

            // Create unique filename
            const safeAppId = appId.replace(/[^a-zA-Z0-9.-]/g, '_');
            const safeVersion = version.replace(/[^a-zA-Z0-9.-]/g, '_');
            const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const outputFileName = `${safeAppId}_${safeVersion}_${safeFileName}.sh`;
            buildDirForThisVerification = path.join(BUILD_DIR_PREFIX, appId + '_' + version + (architecture ? '_' + architecture : '') + (type ? '_' + type : ''));
            if (!fs.existsSync(buildDirForThisVerification)) {
              fs.mkdirSync(buildDirForThisVerification, { recursive: true });
            }
            const scriptWithPath = path.join(buildDirForThisVerification, outputFileName);
        
            // Save the file and make it executable
            const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
            fs.writeFileSync(scriptWithPath, fileContent, 'utf8');
            fs.chmodSync(scriptWithPath, 0o755);
        
            appLog.info(`${appId} | ${version} | ${platform} | sh script found: ${scriptWithPath}`);

            appLog.info(`   ** Add job to queue: architecture: ${architecture}, type: ${type}, new wallet version: ${newWalletVersion} - ${scriptWithPath} ***`);

            const job = queue.add(() => execScript(buildDirForThisVerification, scriptWithPath, newWalletVersion, architecture, type));
            job.catch(err => {
              appLog.error('Script execution job failed:', err);
              verificationsLog.error(`-- Script execution job failed: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(err)}`);
            });
            job.then(async res => {
              const {castFileName, finalScriptExecutionCommand, buildDirForThisVerification} = res;

              const comparisonFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.txt');
              if (!comparisonFilePath) {
                appLog.error(`COMPARISON_RESULTS.txt not found in build directory: ${buildDirForThisVerification}`);
                verificationsLog.error(`-- COMPARISON_RESULTS.txt not found in build directory: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${buildDirForThisVerification}`);
                return;
              }

              // Upload the asciicast file to Blossom server
              const castFileContent = fs.readFileSync(castFileName, 'utf8');
              const castFile = new File([castFileContent], path.basename(castFileName), { type: 'application/x-asciicast' });
              let castFileHash = null;
              try {
                castFileHash = await uploadBlobToBlossomServer(castFile, ndkInstance);
              } catch (error) {
                appLog.error(`************* Error uploading cast file to Blossom: ${error} *************\n`);
                verificationsLog.error(`-- Error uploading cast file to Blossom: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
                return;
              }

              // Read COMPARISON_RESULTS.txt and extract hash and match status
              let hash = null;
              let matches = false;
              try {
                const content = fs.readFileSync(comparisonFilePath, 'utf8');
                const line = content.split('\n').find(l => l.includes(` - ${architecture} - `));
                if (line) {
                  const tokens = line.split(' - ');
                  hash = tokens[2];
                  matches = tokens[3]?.trim().startsWith('1');
                }
              } catch (error) {
                appLog.error(`Error reading COMPARISON_RESULTS.txt: ${error}`);
                verificationsLog.error(`-- Error reading COMPARISON_RESULTS.txt: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
              }

              let description = ` ${architecture ? `architecture: ${architecture}` : ''} ${type ? ` ${architecture ? '-' : ''} type: ${type}` : ''}`;
              let content = `Automatic verification for wallet version ${newWalletVersion} with ${architecture ? ` architecture: ${architecture}` : '' } ${type ? `   type ${type}` : ''}, based on verification ${verification.id}. `;
              content += `The script was executed with these parameters: ${finalScriptExecutionCommand}.`;

              const formData = {
                // Changed values
                basedOn: verification.id,
                version: newWalletVersion,
                status: matches ? 'reproducible' : 'not_reproducible',
                hashes: [hash],
                description: description,
                content: content,
                outputFiles: [{name: path.basename(castFileName), hash: castFileHash}],
                reusedFileIds: fileEventIdsForSHFiles,
                isDraft: false,
                // Original verification values
                appId: appId,
                platform: platform
              };

              try {
                await createVerification(ndkInstance, formData);

                verificationsLog.info(`++ Verification created: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${matches ? 'reproducible' : 'not_reproducible'} ${hash}`);

                if (buildDirForThisVerification && fs.existsSync(buildDirForThisVerification)) {
                  fs.rmSync(buildDirForThisVerification, { recursive: true, force: true });
                  appLog.info(`Deleted build directory: ${buildDirForThisVerification}`);
                }
              } catch (error) {
                appLog.error(`Error creating verification for ${appId}:`, error);
                verificationsLog.error(`-- Error creating verification: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${matches ? 'reproducible' : 'not_reproducible'} ${hash}`);
              }
            });
          }
        }
      }
    }

  } catch (error) {
    appLog.error(`Error processing verification ${verification.id}:`, error);
    verificationsLog.error(`-- Error processing verification: ${appId} ${newWalletVersion} ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
  }
}

const args = minimist(process.argv.slice(2));
const githubToken = args.githubToken;
const wsBotNostrPrivateKey = args.wsBotNostrPrivateKey;

if (!githubToken) {
  appLog.error('Error: GitHub token is required - Usage: node index.mjs --githubToken <github_token>');
  process.exit(1);
}

if (!wsBotNostrPrivateKey) {
  appLog.error('Error: WS_BOT_PK is required - Usage: node index.mjs --wsBotNostrPrivateKey <ws_bot_nostr_private_key>');
  process.exit(1);
}

if (!fs.existsSync(BUILD_DIR_PREFIX)) {
  fs.mkdirSync(BUILD_DIR_PREFIX, { recursive: true });
}

appLog.info('======= Starting Build Server App =======');

while (true) {
  try {
    await mainProcess(githubToken, wsBotNostrPrivateKey);
  } catch (error) {
    appLog.error('Error during execution:', error);
  }
  
  appLog.info('');
  appLog.info(`======= Waiting ${HOURS_BETWEEN_EXECUTIONS} hours until next execution... =======\n`);
  await new Promise(resolve => setTimeout(resolve, HOURS_BETWEEN_EXECUTIONS * 60 * 60 * 1000));
}