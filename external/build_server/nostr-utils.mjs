import NDK, { NDKPrivateKeySigner, NDKEvent } from '@nostr-dev-kit/ndk';
import {
  assetRegistrationKind,
  verificationKind,
  verificationDraftKind,
  explicitRelayUrls,
  verificationEventsSinceTS
} from '../../src/nostr-constants.mjs';
import { getFirstTagValue } from '../../src/verifications_common.mjs';
import { blossomServerUrl } from '../../src/blossom-utils.js';
import { calculateFileHash } from '../../src/drag-and-drop-utils.js';

let ndk;

export async function connectToNostr(nostrPrivateKey) {
  ndk = new NDK({
    explicitRelayUrls: explicitRelayUrls,
    signer: new NDKPrivateKeySigner(nostrPrivateKey)
  });

  console.log('Connecting to Nostr relays...');
  await ndk.connect(2000);
  console.log('Successfully connected to Nostr');
}

export async function createAuthorizationEvent(verb, content, xTags = [], serverUrl = '', tags = []) {
  const event = new NDKEvent(ndk, {
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

  console.log('**** event:', event.toString());

  return await event.sign();
}

export async function createAuthorizationHeader(verb, content, xTags = [], serverUrl = '', tags = []) {
  const signedEvent = await createAuthorizationEvent(verb, content, xTags, serverUrl, tags);
  console.log('**** signedEvent:', signedEvent.toString());
  const eventJson = JSON.stringify(signedEvent);
  console.log('**** eventJson:', eventJson);
  const eventBase64 = btoa(eventJson);
  console.log('**** eventBase64:', eventBase64);
  return 'Nostr ' + eventBase64;
}

export async function uploadBlobToBlossomServer(file) {
  const hash = await calculateFileHash(file);
  console.log(`Uploading cast file to Blossom: ${hash}`);

  const tags = [
    ['name', file.name],
    ['size', file.size.toString()],
  ];

  const authHeader = await createAuthorizationHeader('upload', `Upload blob ${hash}`, [hash], blossomServerUrl, tags);
  console.log('**** authHeader:', authHeader);

  const headers = {
    'Content-Type': file.type || 'application/octet-stream',
    'Authorization': authHeader,
  };

  const url = `${blossomServerUrl}/upload`;
  console.log('**** url:', url);
  console.log('**** headers:', headers);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: file
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('**** error response body:', errorText);
      throw new Error(errorText);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('HTTP Error')) {
      throw error;
    }
    throw new Error('Network error: ' + error.message);
  }
}

export async function getAllAssetInformation() {
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

// Mini-version of the createVerification function from verifications_utils.mjs
export async function createVerification({
  hashes,
  description,
  content,
  status,
  appId,
  version,
  platform,
  createdAt = null,
  draftVerificationEventId = null,
  reusedFileIds = [],
  outputFiles = [],
  basedOn = null
}) {
  // validateParameterLengths({ appId, version, platform, description, content, issueTrackerUrl });

  // --- Upload Files Before Main Event Creation ---
  /*
  let fileUploadResults = [];
  let fileEventIds = [];
  if (uploadedFileData.length > 0) {
    console.log(`Uploading ${uploadedFileData.length} attached file(s) before creating verification...`);
    const uploadPromises = uploadedFileData.map(fileData =>
      uploadFileAttachment({
        fileName: fileData.name,
        fileType: fileData.type,
        fileSize: fileData.size,
        base64Data: fileData.base64Data
      })
    );
    fileUploadResults = await Promise.all(uploadPromises);
    console.log("File upload process completed.", fileUploadResults);

    // Collect successful file event IDs
    fileUploadResults.forEach(result => {
      if (result.success && result.eventId) {
        fileEventIds.push(result.eventId);
      }
    });

    // Handle potential upload failures
    const failedUploads = fileUploadResults.filter(r => !r.success);
    if (failedUploads.length > 0) {
      console.error("Some file uploads failed:", failedUploads);
      throw new Error(`Failed to upload file(s): ${failedUploads.map(f => f.fileName).join(', ')}`);
    }
  }
    */

  const fullContent = JSON.stringify({
    description: description || '',
    content: content,
  });

  const tags = [["status", status]];

  tags.push(["i", appId]);
  tags.push(["version", version]);
  tags.push(["platform", platform]);
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

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = verificationKind;
  ndkEvent.content = fullContent;
  ndkEvent.created_at = Math.floor(new Date(createdAt).getTime() / 1000);
  ndkEvent.tags = [...tags, ["client", "WalletScrutiny.com", `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl]];

  console.log('**** ndkEvent:', ndkEvent.rawEvent());

  return;

  await publishNdkEvent(ndkEvent, 'verification');

  if (!isDraft && draftVerificationEventId) {
    const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
    if (draftVerificationEvent) {
      await draftVerificationEvent.delete('deleting draft, as verification was published', true);
    }
  }

  return ndkEvent;
}

export function cleanupNdkConnections() {
  if (ndk) {
    try {
      let closedConnections = 0;
      for (const relay of ndk.pool.relays.values()) {
        if (relay.connectivity.status === 5) {
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


