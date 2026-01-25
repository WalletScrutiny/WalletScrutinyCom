import NDK, { NDKPrivateKeySigner, NDKEvent } from '@nostr-dev-kit/ndk';
import {
  verificationKind,
  explicitRelayUrls,
  verificationEventsSinceTS,
  wsBotPublicKey,
  nip89ClientTagD,
  mainRelayUrl
} from '../../src/nostr-constants.mjs';
import { appLog } from './logger.js';
import { calculateFileHash, isDebugEnv, getFirstTagValue } from './utils.mjs';

const blossomServerUrl = 'https://files.nostr.info';

let ndk;

export function getNdk() {
  return ndk;
}

export async function connectToNostr(nostrPrivateKey) {
  appLog.info('Connecting to Nostr relays...');

  ndk = new NDK({
    initialValidationRatio: 1.0,
    lowestValidationRatio: 1.0, // Validate signatures for all events
    explicitRelayUrls: explicitRelayUrls,
    signer: new NDKPrivateKeySigner(nostrPrivateKey)
  });

  await ndk.connect(2000);
  appLog.info('Successfully connected to Nostr');
}

export async function createAuthorizationEvent(ndkInstance, verb, content, xTags = [], serverUrl = '', tags = []) {
  if (!ndkInstance) {
    throw new Error('NDK instance is required for createAuthorizationEvent');
  }

  const event = new NDKEvent(ndkInstance, {
    kind: 24242,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ['t', verb],
      ['expiration', (Math.floor(Date.now() / 1000) + 3600).toString()],
    ],
    content: content,
  });

  tags.forEach(tag => {
    const [key, value] = tag;
    event.tags.push([key, value]);
  });

  xTags.forEach(x => {
    event.tags.push(['x', x]);
  });

  if (serverUrl) {
    event.tags.push(['server', serverUrl]);
  }

  event.sig = await event.sign();

  return event;
}

export async function createAuthorizationHeader(ndkInstance, verb, content, xTags = [], serverUrl = '', tags = []) {
  const signedEvent = await createAuthorizationEvent(ndkInstance, verb, content, xTags, serverUrl, tags);
  const eventJson = JSON.stringify(signedEvent);
  const eventBase64 = btoa(eventJson);
  return 'Nostr ' + eventBase64;
}

export async function uploadBlobToBlossomServer(file, ndkInstance = null) {
  const ndkToUse = ndkInstance || ndk;
  if (!ndkToUse) {
    throw new Error('NDK instance is not initialized. Call connectToNostr() first or pass ndkInstance parameter.');
  }
  const hash = await calculateFileHash(file);
  appLog.info(`Uploading cast file to Blossom: ${hash}`);

  const tags = [
    ['name', file.name],
    ['size', file.size.toString()],
  ];

  const authHeader = await createAuthorizationHeader(ndkToUse, 'upload', `Upload blob ${hash}`, [hash], blossomServerUrl, tags);

  const headers = {
    'Content-Type': file.type || 'application/octet-stream',
    'Authorization': authHeader,
  };

  try {
    const response = await fetch(`${blossomServerUrl}/upload`, {
      method: 'PUT',
      headers: headers,
      body: file
    });

    if (!response.ok) {
      const errorText = await response.text();
      appLog.error('**** error response body:', errorText);
      throw new Error(errorText);
    }

    appLog.info(`Cast file uploaded to Blossom successfully: ${hash}`);
    return hash;

  } catch (error) {
    if (error.message.includes('HTTP Error')) {
      throw error;
    }
    throw new Error('Network error: ' + error.message);
  }
}

export async function getAllVerifications(authorPubkeys = []) {
  appLog.info('Getting wallet information from Nostr...');

  const events = await ndk.fetchEvents({
    kinds: [verificationKind],
    since: verificationEventsSinceTS,
    authors: authorPubkeys,
  });

  const verifications = Array.from(events).filter(event =>
    getFirstTagValue(event, 'client') === 'WalletScrutiny.com'
  );

  const verificationsMap = new Map();

  verifications.forEach(verification => {
    const sha256FromEventTag = getFirstTagValue(verification, 'x', null);
    if (sha256FromEventTag) {
      if (!verificationsMap.has(sha256FromEventTag)) {
        verificationsMap.set(sha256FromEventTag, []);
      }
      verificationsMap.get(sha256FromEventTag).push(verification);
    }
  });

  appLog.info('Information retrieved successfully');

  return verificationsMap;
}

export function getFileAttachmentIDsForVerificationEvent(event) {
  return event.getMatchingTags("file-attachment").map(tag => tag[1]) || [];
}

export async function getEventsFromEventIds(eventIds) {
  if (!eventIds || eventIds.length === 0) {
    return [];
  }

  return await ndk.fetchEvents({
    ids: eventIds
  });
}

// Simplified version of the createVerification function from verifications_utils.mjs
export async function createVerification(ndkInstance, {
  hashes,
  description,
  content,
  status,
  appId,
  version,
  platform,
  createdAt = null,
  reusedFileIds = [],
  outputFiles = [],
  basedOn = null
}) {
  await ndkInstance.connect(2000);

  const fullContent = JSON.stringify({
    description: description || '',
    content: content,
  });

  const tags = [
    ["status", status],
    ["i", appId],
    ["version", version],
    ["platform", platform],
    ["client", "WalletScrutiny.com", `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl],
    ["c", "walletscrutiny"]
  ];

  hashes.forEach(hash => {
    tags.push(["x", hash]);
  });

  // Add file event IDs as tags
  if (reusedFileIds.length > 0) {
    reusedFileIds.forEach(fileEventId => {
      tags.push(["file-attachment", fileEventId]);
    });
  }

  if (outputFiles.length > 0) {
    outputFiles.forEach(file => {
      tags.push(["output-file", file.name, file.hash]);
    });
  }

  if (basedOn) {
    tags.push(["based-on", basedOn]);
  }

  const ndkEvent = new NDKEvent(ndkInstance);
  ndkEvent.kind = 30301;
  ndkEvent.content = fullContent;
  ndkEvent.created_at = Math.floor(new Date(createdAt).getTime() / 1000);
  ndkEvent.tags = tags;

  appLog.info(`Sending verification to Nostr... ${JSON.stringify(ndkEvent.rawEvent())}`);
  return await publishNdkEvent(ndkEvent);
}

async function publishNdkEvent(ndkEvent) {
  try {
    const publishedToRelays = await ndkEvent.publish();
    appLog.info(`Published verification (id: ${ndkEvent.id}) to ${publishedToRelays.size} relays`);
    return ndkEvent;
  } catch (error) {
    appLog.error(`Error publishing verification to relays`, error);
    
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        appLog.error(`Error publishing verification to relay ${relay.url}`, err);
      }
    }

    return null;
  }
}
