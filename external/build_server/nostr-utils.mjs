import DOMPurify from 'isomorphic-dompurify';
import {
  connectNostr,
  getPool,
  fetchEvents,
  createEventDraft,
  signEvent,
  publishEvent,
  setPrivateKey,
} from '../../src/nostr-client.mjs';
import {
  verificationKind,
  assetRegistrationKind,
  assetBundleRegistrationKind,
  explicitRelayUrls,
  verificationEventsSinceTS,
  wsBotPublicKey,
  nip89ClientTagD,
  mainRelayUrl
} from './nostr-constants.mjs';
import { appLog } from './logger.mjs';
import { calculateFileHash, getFirstTagValue } from './utils.mjs';

const blossomServerUrl = 'https://files.nostr.info';

const purifyConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  RETURN_TRUSTED_TYPE: false
};

function isValidJSONObject(str) {
  if (typeof str !== 'string') return false;
  try {
    const parsed = JSON.parse(str);
    return parsed !== null && typeof parsed === 'object';
  } catch {
    return false;
  }
}

function sanitizeNostrEvent(event) {
  if (!event) return;

  const sanitizeString = (str) => {
    if (str == null || typeof str !== 'string') return str;
    return DOMPurify.sanitize(str, purifyConfig).replace(/"/g, '');
  };

  if (event.content) {
    if (isValidJSONObject(event.content)) {
      const contentObject = JSON.parse(event.content);
      Object.keys(contentObject).forEach(key => {
        if (typeof contentObject[key] === 'string') {
          contentObject[key] = sanitizeString(contentObject[key]);
        }
      });
      event.content = JSON.stringify(contentObject);
    } else {
      event.content = sanitizeString(event.content);
    }
  }

  if (event.tags && Array.isArray(event.tags)) {
    event.tags.forEach(tag => {
      for (let i = 1; i < tag.length; i++) {
        if (typeof tag[i] === 'string') {
          tag[i] = sanitizeString(tag[i]);
        }
      }
    });
  }
}

export function getNdk() {
  return getPool();
}

export function getPoolInstance() {
  return getPool();
}

export async function connectToNostr(nostrPrivateKey) {
  appLog.info('Connecting to Nostr relays...');

  setPrivateKey(nostrPrivateKey);

  await connectNostr({
    relayUrls: explicitRelayUrls,
    connectTimeoutMs: 2000,
    privateKey: nostrPrivateKey,
    onRelayConnect: (relay) => {
      appLog.info(`Connected to relay: ${relay.url}`);
    },
    onRelayDisconnect: (relay) => {
      appLog.info(`Disconnected from relay: ${relay.url}`);
    },
    onRelayError: (relay, error) => {
      appLog.error(`Relay error (${relay.url}):`, error);
    },
  });

  appLog.info('Successfully connected to Nostr');
}

export async function createAuthorizationEvent(_poolInstance, verb, content, xTags = [], serverUrl = '', tags = []) {
  const event = createEventDraft({
    kind: 24242,
    content,
    tags: [
      ['t', verb],
      ['expiration', (Math.floor(Date.now() / 1000) + 3600).toString()],
    ],
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

  return signEvent(event);
}

export async function createAuthorizationHeader(poolInstance, verb, content, xTags = [], serverUrl = '', tags = []) {
  const signedEvent = await createAuthorizationEvent(poolInstance, verb, content, xTags, serverUrl, tags);
  const eventJson = JSON.stringify(signedEvent);
  const eventBase64 = btoa(eventJson);
  return 'Nostr ' + eventBase64;
}

export async function uploadBlobToBlossomServer(file, poolInstance = null) {
  if (!getPool() && !poolInstance) {
    throw new Error('Nostr pool is not initialized. Call connectToNostr() first or pass poolInstance parameter.');
  }

  const hash = await calculateFileHash(file);
  appLog.info(`Uploading cast file to Blossom: ${hash}`);

  const tags = [
    ['name', file.name],
    ['size', file.size.toString()],
  ];

  const authHeader = await createAuthorizationHeader(poolInstance, 'upload', `Upload blob ${hash}`, [hash], blossomServerUrl, tags);

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

  const events = await fetchEvents({
    kinds: [verificationKind],
    since: verificationEventsSinceTS,
    authors: authorPubkeys,
  });

  const verifications = Array.from(events).filter(event =>
    getFirstTagValue(event, 'client') === 'WalletScrutiny.com'
  );

  verifications.forEach(verification => sanitizeNostrEvent(verification));

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

export async function getAllAssetsForTheseAppIds(appIds) {
  if (!appIds || appIds.length === 0) {
    return [];
  }
  appLog.info(`Getting assets for ${appIds.length} app ids...`);

  const events = await fetchEvents({
    kinds: [assetRegistrationKind, assetBundleRegistrationKind],
    since: verificationEventsSinceTS,
    '#i': appIds,
  });

  const assets = Array.from(events).filter(event =>
    getFirstTagValue(event, 'client') === 'WalletScrutiny.com'
  );
  assets.forEach(asset => sanitizeNostrEvent(asset));
  appLog.info(`   Found ${assets.length} assets`);

  return assets;
}

export async function getEventsFromEventIds(eventIds) {
  const MAX_BATCH_SIZE = 50;
  if (!eventIds || eventIds.length === 0) {
    return [];
  }

  const events = [];
  for (let i = 0; i < eventIds.length; i += MAX_BATCH_SIZE) {
    const batch = eventIds.slice(i, i + MAX_BATCH_SIZE);
    const batchEvents = await fetchEvents({ ids: batch });
    const batchArray = Array.from(batchEvents);
    batchArray.forEach(event => sanitizeNostrEvent(event));
    events.push(...batchArray);
  }
  return events;
}

export async function createVerification(_poolInstance, {
  hashes,
  description,
  content,
  status,
  appId,
  version,
  platform,
  createdAt,
  reusedFileIds = [],
  outputFiles = [],
  basedOn = null
}) {
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

  const draft = createEventDraft({
    kind: verificationKind,
    content: fullContent,
    created_at: Math.floor(new Date(createdAt).getTime() / 1000),
    tags,
  });

  appLog.info(`Sending verification to Nostr... ${JSON.stringify(draft)}`);
  return await publishSignedEvent(draft);
}

async function publishSignedEvent(draft) {
  try {
    const signed = await signEvent(draft);
    const { successful } = await publishEvent(signed);
    appLog.info(`Published verification (id: ${signed.id}) to ${successful} relays`);
    return signed.id;
  } catch (error) {
    appLog.error(`Error publishing verification to relays`, error);
    throw error;
  }
}
