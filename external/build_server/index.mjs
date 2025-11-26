#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PQueue from 'p-queue';
import minimist from 'minimist';
import WebSocket from 'ws';
global.WebSocket = WebSocket; // For NDK
import {
  connectToNostr,
  getAllVerifications,
  getFileAttachmentIDsForVerificationEvent,
  getEventsFromEventIds,
  uploadBlobToBlossomServer,
  createVerification,
  getNdk
} from './nostr-utils.mjs';
import { refreshApps } from './refresh_apps.mjs';
import { appLog, verificationsLog } from './logger.js';
import { compareVersions, fetchAppInfo, startCompilationJob, getFirstTagValue, readComparisonResults } from './utils.mjs';
import {
  DEBUG_APP_IDS,
  HOURS_BETWEEN_EXECUTIONS,
  APPROVED_VERIFIERS_PUBKEY_HEX,
  QUEUE_TIMEOUT_HOURS,
  QUEUE_CONCURRENCY
} from './config/config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_DIR_PREFIX = path.join(__dirname, '..', 'build_server_build_dir');
let buildDirForThisVerification = null;

const queue = new PQueue({
  concurrency: QUEUE_CONCURRENCY,
  timeout: QUEUE_TIMEOUT_HOURS * 60 * 60 * 1000,
  throwOnTimeout: true
});
queue.on('active', logQueueInfo);
queue.on('next', logQueueInfo);
queue.on('error', error => {
	appLog.error(error);
  // TODO: We can potentially send a Nostr notification to the user to inform them about the error
});
function logQueueInfo() {
  appLog.info(`**** Queue info - Waiting (${queue.size})  Running (${queue.pending}): ${JSON.stringify(queue.runningTasks)}`);
}

async function mainProcess(githubToken, wsBotNostrPrivateKey) {
  appLog.info('------- Starting mainProcess -------');

  try {
    // First, refresh desktop and hardware apps to get latest versions
    const refreshResults = await refreshApps(githubToken);
    appLog.info(`Refreshed ${refreshResults.total} apps (${Object.keys(refreshResults.desktop).length} desktop, ${Object.keys(refreshResults.hardware).length} hardware)`);

    // Fetch app info for build server
    const appInfo = await fetchAppInfo();

    await connectToNostr(wsBotNostrPrivateKey);

    const verifications = await getAllVerifications(APPROVED_VERIFIERS_PUBKEY_HEX);

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
          ['hardware', 'desktop', 'linux', 'windows'].includes(getFirstTagValue(verification, 'platform'))
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
        await processVerification(highestVersionVerification.verification, walletInfo.latestVersion, appInfo);
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

async function createVerificationAfterCompilation(returnParamsFromCompilationJob, verification, newWalletVersion, appId, platform, ndkInstance, architecture, type, fileEventIdsForSHFiles) {
  const {castFileName, finalScriptExecutionCommand, buildDirForThisVerification} = returnParamsFromCompilationJob;

  const comparisonResults = readComparisonResults(buildDirForThisVerification, architecture, appId, newWalletVersion, type);
  if (!comparisonResults) {
    appLog.error(`COMPARISON_RESULTS.yaml or COMPARISON_RESULTS.txt not found, or error found reading it in ${buildDirForThisVerification}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | file COMPARISON_RESULTS.yaml or COMPARISON_RESULTS.txt not found ${architecture ? architecture : ''} ${type ? type : ''} ${buildDirForThisVerification}`);
    return;
  }
  const { hashes, matches } = comparisonResults;

  // Upload the asciicast file to Blossom server
  const castFileContent = fs.readFileSync(castFileName, 'utf8');
  const castFile = new File([castFileContent], path.basename(castFileName), { type: 'application/x-asciicast' });
  let castFileHash = null;
  try {
    castFileHash = await uploadBlobToBlossomServer(castFile, ndkInstance);
  } catch (error) {
    appLog.error(`************* Error uploading cast file to Blossom: ${error} *************\n`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error uploading cast file to Blossom: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
    return;
  }

  let description = [
    architecture && `architecture: ${architecture}`,
    type && `type: ${type}`
  ]
  .filter(Boolean)
  .join(' - ');

  let content = `Automatic verification for wallet version ${newWalletVersion} with ${architecture ? ` architecture: ${architecture}` : '' } ${type ? `   type ${type}` : ''}, based on verification ${verification.id}. `;
  content += `The script was executed with these parameters: ${finalScriptExecutionCommand}.`;

  const formData = {
    // Changed values
    basedOn: verification.id,
    version: newWalletVersion,
    status: matches ? 'reproducible' : 'not_reproducible',
    hashes: hashes,
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

    verificationsLog.info(`+++ ${appId} ${newWalletVersion} | Verification created: ${architecture ? architecture : ''} ${type ? type : ''} ${matches ? 'reproducible' : 'not_reproducible'} ${hashes.join(', ')}`);

    if (buildDirForThisVerification && fs.existsSync(buildDirForThisVerification)) {
      fs.rmSync(buildDirForThisVerification, { recursive: true, force: true });
      appLog.info(`Deleted build directory: ${buildDirForThisVerification}`);
    }
  } catch (error) {
    appLog.error(`Error creating verification for ${appId}:`, error);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error creating verification: ${architecture ? architecture : ''} ${type ? type : ''} ${matches ? 'reproducible' : 'not_reproducible'} ${hashes.join(', ')}`);
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
    
    let anyFileTried = false;

    for (const fileEvent of fileEvents) {
      const fileName = getFirstTagValue(fileEvent, 'name');
      const extension = getFirstTagValue(fileEvent, 'extension');

      const scriptName = fileName + '.' + extension;
      if (!scriptName.endsWith('build.sh')) {
        continue;
      }

      anyFileTried = true;

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
          const safeVersion = newWalletVersion.replace(/[^a-zA-Z0-9.-]/g, '_');
          const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const outputFileName = `${safeAppId}_${safeVersion}_${safeFileName}.sh`;
          buildDirForThisVerification = path.join(BUILD_DIR_PREFIX, appId + '_' + newWalletVersion + (architecture ? '_' + architecture : '') + (type ? '_' + type : ''));
          
          fs.mkdirSync(buildDirForThisVerification, { recursive: true });

          const scriptWithPath = path.join(buildDirForThisVerification, outputFileName);

          // Save the file and make it executable
          const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
          fs.writeFileSync(scriptWithPath, fileContent, 'utf8');
          fs.chmodSync(scriptWithPath, 0o755);

          appLog.info(`${appId} | ${version} | ${platform} | sh script found: ${scriptWithPath}`);

          appLog.info(`   ** Add job to queue: architecture: ${architecture}, type: ${type}, new wallet version: ${newWalletVersion} - ${scriptWithPath} ***`);

          const job = queue.add(() => startCompilationJob(buildDirForThisVerification, scriptWithPath, newWalletVersion, architecture, type));
          job.catch(err => {
            appLog.error('Script execution job failed:', err);
            verificationsLog.info(`--- ${appId} ${newWalletVersion} | Script execution job failed: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(err)}`);
          });
          job.then(async returnParamsFromCompilationJob => {
            appLog.info('Script execution job completed. Creating verification...', returnParamsFromCompilationJob);
            await createVerificationAfterCompilation(
              returnParamsFromCompilationJob,
              verification,
              newWalletVersion,
              appId,
              platform,
              ndkInstance,
              architecture,
              type,
              fileEventIdsForSHFiles
            );
          });
        }
      }
    }

    if (!anyFileTried) {
      appLog.info(`   ** There are no files ending in .build.sh in the latest verification. Skipping... **`);
      verificationsLog.info(`--- ${appId} ${newWalletVersion} | There are no files ending in .build.sh in the latest verification. Skipping...`);
      return;
    }

  } catch (error) {
    appLog.error(`Error processing verification ${verification.id}:`, error);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error processing verification: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
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

fs.mkdirSync(BUILD_DIR_PREFIX, { recursive: true });

appLog.info('======= Starting Build Server App =======');

while (true) {
  try {
    await mainProcess(githubToken, wsBotNostrPrivateKey);
  } catch (error) {
    appLog.error('Error during execution:', error);
  }
  
  appLog.info(`======= Waiting ${HOURS_BETWEEN_EXECUTIONS} hours until next execution... =======\n`);
  await new Promise(resolve => setTimeout(resolve, HOURS_BETWEEN_EXECUTIONS * 60 * 60 * 1000));
}