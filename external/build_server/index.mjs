#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import {
  connectToNostr,
  getAllAssetInformation,
  getFileAttachmentIDsForVerificationEvent,
  getEventsFromEventIds,
  cleanupNdkConnections,
  uploadBlobToBlossomServer,
  createVerification,
  getNdk
} from './nostr-utils.mjs';
import { getFirstTagValue } from '../../src/verifications_common.mjs';
import { refreshApps } from './refresh_apps.mjs';
import PQueue from 'p-queue';
import { appLog, jobsLog } from './logger.js';
import WebSocket from 'ws';
global.WebSocket = WebSocket; // Configure WebSocket globally for NDK

// Debug array: If it has elements, it will only process these appIds. If it is empty, it will process all.
const DEBUG_APP_IDS = [
  // Example: 'com.example.app', 'org.bitcoin.wallet',
  'bitcoinknots'
];

const appInfoURL = 'http://localhost:4000/assets/js/json/buildServerInfo.json'; // TODO: https://walletscrutiny.com/assets/js/json/buildServerInfo.json

const HOURS_BETWEEN_EXECUTIONS = 24;

const nostrPrivateKey = process.env.NOSTR_PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000001';
if (!nostrPrivateKey) {
  appLog.error('Error: NOSTR_PRIVATE_KEY environment variable is required');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPTS_DIR = path.join(__dirname, 'scripts');

const queueTimeoutHours = 6;

const queue = new PQueue({
  concurrency: 3,
  timeout: queueTimeoutHours * 60 * 60 * 1000,
  throwOnTimeout: true
});
queue.on('active', () => {
  appLog.info(`Works in queue: ${queue.size} - pending: ${queue.pending} - running: ${JSON.stringify(queue.runningTasks)}`);
});
queue.on('error', error => {
	appLog.error(error);
  // TODO: We can potentially send a Nostr notification to the user to inform them about the error running the script
});

// Helper to compare semantic versions like "1.2.3"
function compareVersions(a, b) {
  a = a.replace(/^v/i, '');
  b = b.replace(/^v/i, '');
  if (!a || !b) {
    return 0;
  }
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

async function fetchAppInfo() {
  try {
    appLog.info(`Fetching app info from ${appInfoURL}...`);
    const response = await fetch(appInfoURL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const appInfo = await response.json();
    appLog.info('App info fetched successfully');
    return appInfo;
  } catch (error) {
    appLog.error(`Error fetching app info from ${appInfoURL}:`, error);
    throw error;
  }
}

async function mainProcess(githubToken) {
  appLog.info('=== Build Server App ===');

  try {
    // First, refresh desktop and hardware apps to get latest versions
    const refreshResults = await refreshApps(githubToken);
    appLog.info(`Refreshed ${refreshResults.total} apps (${Object.keys(refreshResults.desktop).length} desktop, ${Object.keys(refreshResults.hardware).length} hardware)`);

    // Fetch app info for build server
    const appInfo = await fetchAppInfo();
    appLog.info('');

    await connectToNostr(nostrPrivateKey);
    appLog.info('');

    // Get all asset information
    const assetInfo = await getAllAssetInformation();
    appLog.info('');

    // Process verifications
    const reproducibleVerifications = [];
    
    // Iterate over all verifications
    for (const [sha256, verificationEvents] of assetInfo.verifications) {
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
          getFirstTagValue(verification, 'platform') !== 'windows' &&
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
      const version = getFirstTagValue(verification, 'version');
      
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
      // Sort by version (descending - highest first)
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
        return 0;
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

        // Create unique filename
        const safeAppId = appId.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeVersion = version.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const outputFileName = `${safeAppId}_${safeVersion}_${safeFileName}.sh`;
        const scriptWithPath = path.join(SCRIPTS_DIR, outputFileName);

        // Decode and save the file
        const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
        //fs.writeFileSync(scriptWithPath, fileContent, 'utf8');
        
        // Temporary bash content that randomly returns exit code 0 or -1
        const tempBashContent = `#!/bin/bash

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --version) version="$2"; shift ;;
    --type) type="$2"; shift ;;
    --arch) arch="$2"; shift ;;
    --apk) apk="$2"; shift ;;
  esac
  shift
done
echo "version: $version, type: $type, arch: $arch, apk: $apk"

# Temporary script that randomly returns exit code 0 or -1
RANDOM_EXIT_CODE=$((RANDOM % 2))
if [ $RANDOM_EXIT_CODE -eq 0 ]; then
    echo "Random success (exit code 0)"
    exit 0
else
    echo "Random failure (exit code 6)"
    exit 6
fi`;
        fs.writeFileSync(scriptWithPath, tempBashContent, 'utf8');

        // Make the file executable
        fs.chmodSync(scriptWithPath, 0o755);

        appLog.info(`${appId} | ${version} | ${platform} | sh script found: ${scriptWithPath}`);

        const appInfoFromWS = appInfo[legacyPlatform][appId];
        const architectures = appInfoFromWS.architectures;
        const types = appInfoFromWS.types;
        appLog.info(`  *** architectures: ${architectures}`);
        appLog.info(`  *** types: ${types}`);

        // Ensure at least one iteration even if arrays are empty
        const architecturesToIterate = architectures && architectures.length > 0 ? architectures : [undefined];
        const typesToIterate = types && types.length > 0 ? types : [undefined];

        for (const architecture of architecturesToIterate) {
          for (const type of typesToIterate) {
            appLog.info(`  *** Add job to queue: architecture: ${architecture}, type: ${type}, new wallet version: ${newWalletVersion} - ${scriptWithPath} ***`);

            const job = queue.add(() => execScript(scriptWithPath, newWalletVersion, architecture, type));
            job.catch(err => appLog.error('Script execution job failed:', err));
            job.then(async res => {
              appLog.info('Script execution job finished successfully:', res);
              const {castFileName, finalScriptExecutionCommand} = res;

              // Upload the asciicast file to Blossom server
              const castFileContent = fs.readFileSync(castFileName, 'utf8');
              const castFile = new File([castFileContent], path.basename(castFileName), { type: 'application/x-asciicast' });
              let castFileHash = null;
              try {
                castFileHash = await uploadBlobToBlossomServer(castFile, ndkInstance);
              } catch (error) {
                appLog.error(`************* Error uploading cast file to Blossom: ${error} *************\n`);
                return;
              }

              let status = 'not_reproducible';
              if (castFileContent.includes('scriptrc=0')) {
                status = 'reproducible';
              }

              let description = ` ${architecture ? `architecture: ${architecture}` : ''} ${type ? ` ${architecture ? '-' : ''} type: ${type}` : ''}`;
              let content = `Automatic verification for wallet version ${newWalletVersion} with architecture ${architecture} and type ${type}, based on verification ${verification.id}. `;
              content += `The script was executed with these parameters: ${finalScriptExecutionCommand}.`;

              const formData = {
                // Changed values
                basedOn: verification.id,
                version: newWalletVersion,
                status: status,
                hashes: [],
                description: description,
                content: content,
                outputFiles: [{name: path.basename(castFileName), hash: castFileHash}],
                reusedFileIds: fileEventIdsForSHFiles,
                isDraft: false,
                // Original verification values
                appId: appId,
                platform: platform
              };

              // appLog.info(`Creating verification for ${appId}:`, formData);

              try {
                await createVerification(ndkInstance, formData);
              } catch (error) {
                appLog.error(`Error creating verification for ${appId}:`, error);
              }
            });
          }
        }
      }
    }

  } catch (error) {
    appLog.error(`Error processing verification ${verification.id}:`, error);
  }
}

async function execScript(script, newWalletVersion, architecture, type) {
  return new Promise((resolve, reject) => {
    // Execute script with asciinema recording
    const architectureFlag = architecture ? `--arch ${architecture}` : '';
    const typeFlag = type ? `--type ${type}` : '';
    const scriptArgs = [architectureFlag, typeFlag].filter(Boolean).join(' ');
    const argsString = scriptArgs ? ` ${scriptArgs}` : '';
    const finalScriptExecutionCommand = `${script} --version ${newWalletVersion}${argsString}`;

    let castFileName = script.replace(/\.sh$/, '');
    castFileName += `_${architecture}_${type}.cast`;

    const asciinemaCommand = `asciinema rec --overwrite -c "sleep 5; ${finalScriptExecutionCommand} ; echo scriptrc=\\$?" ${castFileName}`;
    jobsLog.info(`Recording and executing script... ${asciinemaCommand}`);
    exec(asciinemaCommand, {
      env: {
        // Ensure PATH includes standard system directories for rootless container tools
        PATH: process.env.PATH || '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        HOME: process.env.HOME || '/tmp',
        XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || '/tmp/.config',
        ASCIINEMA_CONFIG_HOME: process.env.ASCIINEMA_CONFIG_HOME || '/tmp/.config'
      },
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large script outputs
    }, (error, stdout, stderr) => {
      if (error) {
        jobsLog.error(`Error recording and executing script: ${error}`);
        reject(error);
      } else {
        jobsLog.info(`Script recorded and executed successfully: ${castFileName}`);
        resolve({castFileName: castFileName, finalScriptExecutionCommand: finalScriptExecutionCommand});
      }
    });
  });
}

// Get GitHub token from command line arguments or environment
const githubToken = process.argv[2] || process.env.GITHUB_TOKEN;

if (!githubToken) {
  appLog.error('Error: GitHub token is required');
  appLog.error('Usage: node index.mjs <github_token>');
  appLog.error('Or set GITHUB_TOKEN environment variable');
  process.exit(1);
}

if (!fs.existsSync(SCRIPTS_DIR)) {
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

while (true) {
  try {
    await mainProcess(githubToken);
  } catch (error) {
    appLog.error('Error during execution:', error);
  }
  
  appLog.info(`\n******** Waiting ${HOURS_BETWEEN_EXECUTIONS} hours until next execution...\n\n`);
  await new Promise(resolve => setTimeout(resolve, HOURS_BETWEEN_EXECUTIONS * 60 * 60 * 1000));
}