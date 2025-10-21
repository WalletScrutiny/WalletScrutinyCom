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
async function processReproducibleVerifications() {
  console.log('=== Build Server App - Fetching verification scripts ===');
  console.log(`Starting process: ${new Date().toISOString()}\n`);

  try {
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

        if (getFirstTagValue(verification, 'status') === 'reproducible' && getFirstTagValue(verification, 'platform') !== 'windows') {
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

      // Take only the first (highest) version
      const highestVersion = verifications[0];
      console.log(`${appId}: version ${highestVersion.version}`);
      await processVerification(highestVersion.verification);
    }

    console.log('\n=== Process completed ===');
    console.log(`Scripts saved in: ${SCRIPTS_DIR}`);

  } catch (error) {
    console.error('Error during process:', error);
    throw error;
  } finally {
    // Clean up NDK connections
    console.log('\nCleaning up connections...');
    cleanupNdkConnections();
  }
}

async function processVerification(verification) {
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
        fs.writeFileSync(outputPath, fileContent, 'utf8');

        scriptsList.push({fileName: `${fileName}.${extension}`, outputFileName: outputFileName});
      }
    }

    if (scriptsFound === 0) {
      console.log(`${appId} | ${version} | ${platform} | No .sh scripts`);
    } else {
      console.log(`${appId} | ${version} | ${platform} | ${scriptsFound} script(s): ${scriptsList.join(', ')}`);

      // Run the script in the outputFileName
      const script = fs.readFileSync(outputPath, 'utf8');
    }

  } catch (error) {
    console.error(`Error processing verification ${verification.id}:`, error);
  }
}

try {
  await processReproducibleVerifications();
  process.exit(0);
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}