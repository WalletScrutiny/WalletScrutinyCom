#!/usr/bin/env node

// Debug array: If it has elements, it will only process these appIds. If it is empty, it will process all.
const DEBUG_APP_IDS = [
  // Example: 'com.example.app',
  // Example: 'org.bitcoin.wallet',
  'bitcoinknots'
];

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import NDK from '@nostr-dev-kit/ndk';
import WebSocket from 'ws';

// Configure WebSocket globally for NDK
global.WebSocket = WebSocket;

// Import constants from the main project
import { 
  assetRegistrationKind,
  verificationKind,
  verificationDraftKind,
  explicitRelayUrls,
  verificationEventsSinceTS
} from '../../src/nostr-constants.mjs';

import { getFirstTagValue } from '../../src/verifications_common.mjs';
import { refreshApps } from './refresh_apps.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPTS_DIR = path.join(__dirname, 'scripts');

// Create scripts directory if it doesn't exist
if (!fs.existsSync(SCRIPTS_DIR)) {
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

let ndk;

async function connectToNostr() {
  ndk = new NDK({
    explicitRelayUrls: explicitRelayUrls
  });
  
  console.log('Connecting to Nostr relays...');
  await ndk.connect(2000);
  console.log('Successfully connected to Nostr');
}

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

async function getAllAssetInformation() {
  console.log('Getting wallet information from Nostr...');
  
  const filter_assets = {
    kinds: [assetRegistrationKind],
    since: verificationEventsSinceTS
  };

  const filter_verifications = {
    kinds: [verificationKind, verificationDraftKind],
    since: verificationEventsSinceTS
  };

  const events = await ndk.fetchEvents([filter_assets, filter_verifications]);
  
  const assets = Array.from(events).filter(event => 
    event.kind === assetRegistrationKind && 
    getFirstTagValue(event, 'client') === 'WalletScrutiny.com'
  );
  
  const verifications = Array.from(events).filter(event => 
    event.kind === verificationKind && 
    getFirstTagValue(event, 'client') === 'WalletScrutiny.com'
  );

  const assetsMap = new Map();
  const verificationsMap = new Map();

  assets.forEach(asset => {
    const sha256FromEventTag = getFirstTagValue(asset, 'x', null);
    if (sha256FromEventTag) {
      if (!assetsMap.has(sha256FromEventTag)) {
        assetsMap.set(sha256FromEventTag, []);
      }
      assetsMap.get(sha256FromEventTag).push(asset);
    }
  });

  verifications.forEach(verification => {
    const sha256FromEventTag = getFirstTagValue(verification, 'x', null);
    if (sha256FromEventTag) {
      if (!verificationsMap.has(sha256FromEventTag)) {
        verificationsMap.set(sha256FromEventTag, []);
      }
      verificationsMap.get(sha256FromEventTag).push(verification);
    }
  });

  console.log('Information retrieved successfully');
  
  return {
    assets: assetsMap,
    verifications: verificationsMap
  };
}

function getFileAttachmentIDsForVerificationEvent(event) {
  return event.getMatchingTags("file-attachment").map(tag => tag[1]) || [];
}

async function getEventsFromEventIds(eventIds) {
  if (!eventIds || eventIds.length === 0) {
    return [];
  }

  return await ndk.fetchEvents({
    ids: eventIds
  });
}

function cleanupNdkConnections() {
  if (ndk) {
    try {
      let closedConnections = 0;
      for (const relay of ndk.pool.relays.values()) {
        if (relay.connectivity.status === 5) { // Connected
          relay.disconnect();
          closedConnections++;
        }
      }
      ndk.pool.relays.clear();
      console.log(`Connections closed: ${closedConnections}`);
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
    ndk = null;
  }
}

/**
 * Main function to process reproducible verifications
 */
async function processReproducibleVerifications(githubToken) {
  console.log('=== Build Server App ===');
  console.log(`Starting process: ${new Date().toISOString()}\n`);

  try {
    // First, refresh desktop and hardware apps to get latest versions
    const refreshResults = await refreshApps(githubToken);
    console.log(`Refreshed ${refreshResults.total} apps (${Object.keys(refreshResults.desktop).length} desktop, ${Object.keys(refreshResults.hardware).length} hardware)\n`);

    await connectToNostr();
    console.log('');

    // Get all asset information
    const assetInfo = await getAllAssetInformation();
    console.log('');

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

    console.log(`=== Reproducible Verifications ===`);
    console.log(`Total found: ${reproducibleVerifications.length}\n`);

    if (reproducibleVerifications.length === 0) {
      console.log('No reproducible verifications found.');
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
    let totalSkipped = 0;

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
        // console.log(`Found wallet in desktop refreshResults: ${appId} -> ${walletInfo.latestVersion}`);
      } else if (legacyPlatform === 'hardware' && refreshResults.hardware[appId]) {
        walletInfo = refreshResults.hardware[appId];
        // console.log(`Found wallet in hardware refreshResults: ${appId} -> ${walletInfo.latestVersion}`);
      } else {
        console.log(`Wallet ${appId} not found in refreshResults for platform ${legacyPlatform}`);
      }

      if (compareVersions(walletInfo.latestVersion, "v29.1.knots20251010") > 0) {
        console.log(`Wallet ${appId} has a newer version: ${walletInfo.latestVersion} (wallet repo) > ${highestVersion.version} (latest verification)`);
        await processVerification(highestVersion.verification, walletInfo.latestVersion);
      } else {
        console.log(`Wallet ${appId} doesn't have a newer version: ${walletInfo.latestVersion} (wallet repo) <= ${highestVersion.version} (latest verification). Skipping...`);
        continue;
      }
    }

    console.log('\n=== Process completed ===');

  } catch (error) {
    console.error('Error during process:', error);
    throw error;
  } finally {
    // Clean up NDK connections
    console.log('\nCleaning up connections...');
    cleanupNdkConnections();
  }
}

async function processVerification(verification, newWalletVersion) {
  try {
    const appId = getFirstTagValue(verification, 'i');
    const version = getFirstTagValue(verification, 'version');
    const platform = getFirstTagValue(verification, 'platform');

    // Get file attachment IDs
    const fileAttachmentIds = getFileAttachmentIDsForVerificationEvent(verification);
    
    if (fileAttachmentIds.length === 0) {
      console.log(`${appId} | ${version} | ${platform} | No attachments`);
      return;
    }

    // Get file events
    const fileEvents = await getEventsFromEventIds(fileAttachmentIds);
    
    let scriptsFound = 0;
    let scriptsList = [];
    let outputPaths = [];
    
    for (const fileEvent of fileEvents) {
      const fileName = getFirstTagValue(fileEvent, 'name');
      const extension = getFirstTagValue(fileEvent, 'extension');
      
      // Only process .sh files
      if (extension === 'sh') {
        scriptsFound++;
        
        // Create unique filename
        const safeAppId = appId.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeVersion = version.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const outputFileName = `${safeAppId}_${safeVersion}_${safeFileName}.sh`;
        const outputPath = path.join(SCRIPTS_DIR, outputFileName);

        // Decode and save the file
        const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
        //fs.writeFileSync(outputPath, fileContent, 'utf8');
        
        // Temporary bash content that randomly returns exit code 0 or -1
        const tempBashContent = `#!/bin/bash
# Temporary script that randomly returns exit code 0 or -1
RANDOM_EXIT_CODE=$((RANDOM % 2))
if [ $RANDOM_EXIT_CODE -eq 0 ]; then
    echo "Random success (exit code 0)"
    exit 0
else
    echo "Random failure (exit code 6)"
    exit 6
fi`;
        
        fs.writeFileSync(outputPath, tempBashContent, 'utf8');

        // Make the file executable
        fs.chmodSync(outputPath, 0o755);
        

        scriptsList.push({fileName: `${fileName}.${extension}`, outputFileName: outputFileName});
        outputPaths.push(outputPath);
      }
    }

    if (scriptsFound === 0) {
      console.log(`${appId} | ${version} | ${platform} | No .sh scripts`);
    } else {
      console.log(`${appId} | ${version} | ${platform} | ${scriptsFound} script(s): ${scriptsList.map(s => s.outputFileName).join(', ')}`);

      // Execute each script
      for (let i = 0; i < outputPaths.length; i++) {
        const outputPath = outputPaths[i];
        console.log(`Running script: ${outputPath} with new wallet version: ${newWalletVersion}`);
        const result = await execScript(outputPath, newWalletVersion, { 
          env: { 
            ...process.env, 
            NEW_WALLET_VERSION: newWalletVersion,
            PATH: process.env.PATH || '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
          } 
        });
        console.debug(`Script execution result: ${result}`);

        // ¿Hay que hacer cat al fichero .cast para ver el resultado?
        const castFile = outputPath.replace(/\.sh$/, '.cast');
        const castFileContent = fs.readFileSync(castFile, 'utf8');
        console.debug(`Cast file content: ${castFileContent}`);

        let status = 'not_reproducible';
        if (castFileContent.includes('scriptrc=0')) {
          status = 'reproducible';
        }

        // Upload the asciicast file to Blossom


        // Extract data from verification event
        const verificationDescription = getFirstTagValue(verification, 'description') || '';
        const verificationContent = verification.content || '';
        const verificationIssueTrackerUrl = getFirstTagValue(verification, 'issue-tracker-url') || '';
        
        const formData = {
          // Values changed
          version: newWalletVersion, // Use the new wallet version
          status: status,
          hashes: [],
          description: verificationDescription,
          content: verificationContent,
          uploadedFileData: [],
          reusedFileIds: fileAttachmentIds,
          outputFiles: [],
          // Values not changed
          appId: appId,
          platform: platform,
          isDraft: false,
          basedOn: verification.id
        };

        console.log(`Creating verification for ${appId}:`, formData);
    
        try {
          // await createVerification(formData);
        } catch (error) {
          console.error(`Error creating verification for ${appId}:`, error);
        }

      }
    }
  } catch (error) {
    console.error(`Error processing verification ${verification.id}:`, error);
  }
}

async function execScript(script, newWalletVersion, env) {
  return new Promise((resolve, reject) => {
    // Ensure PATH includes standard system directories for rootless container tools
    const fullEnv = {
      ...env,
      PATH: env.PATH || '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      HOME: env.HOME || process.env.HOME || '/tmp',
      XDG_CONFIG_HOME: env.XDG_CONFIG_HOME || process.env.XDG_CONFIG_HOME || '/tmp/.config',
      ASCIINEMA_CONFIG_HOME: env.ASCIINEMA_CONFIG_HOME || process.env.ASCIINEMA_CONFIG_HOME || '/tmp/.config'
    };
    
    // Create cast file path with same name as script but with .cast extension
    console.log(`Script: ${script}`);
    const castFile = script.replace(/\.sh$/, '.cast');
    console.log(`Cast file: ${castFile}`);
    
    // Execute script with asciinema recording
    const asciinemaCommand = `asciinema rec --overwrite -c "sleep 2; ${script} ${newWalletVersion} ; echo scriptrc=\\$?" ${castFile}`;
    console.log(`Executing script: ${asciinemaCommand}`);
    exec(asciinemaCommand, { 
      env: fullEnv,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large script outputs
    }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(`Script execution recorded to: ${castFile}`);
      }
    });
  });
}

// Get GitHub token from command line arguments or environment
const githubToken = process.argv[2] || process.env.GITHUB_TOKEN;

if (!githubToken) {
  console.error('Error: GitHub token is required');
  console.error('Usage: node index.mjs <github_token>');
  console.error('Or set GITHUB_TOKEN environment variable');
  process.exit(1);
}

try {
  await processReproducibleVerifications(githubToken);
  process.exit(0);
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}