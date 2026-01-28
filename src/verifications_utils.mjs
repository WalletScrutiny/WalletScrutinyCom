import NDK, {NDKEvent, NDKNip07Signer, NDKPrivateKeySigner, NDKPublishError, NDKZapper, zapInvoiceFromEvent, generateZapRequest, getNip57ZapSpecFromLud} from "@nostr-dev-kit/ndk";
import { nip19 } from 'nostr-tools';
import DOMPurify from 'dompurify';
import {
  assetRegistrationKind,
  verificationKind,
  endorsementKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  explicitRelayUrls,
  verificationEventsSinceTS,
  mainRelayUrl,
  nip89ClientTagD,
  wsBotPublicKey
} from "./nostr-constants.mjs";
import { userHasBrowserExtension, getFirstTagValue, isDebugEnv } from './verifications_common.mjs';
import { formatDate } from "./assets-table-utils.js";
import {decode} from "light-bolt11-decoder"
import WebSocket from "ws";

if (typeof global !== 'undefined') {
  global.WebSocket = WebSocket; // Make WebSocket available globally as NDK expects it
}

// Configure DOMPurify to be more restrictive
const purifyConfig = {
  ALLOWED_TAGS: ['div'], // No HTML tags allowed
  ALLOWED_ATTR: ['id'], // Allow id attribute
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  RETURN_TRUSTED_TYPE: false
};

let ndk;
let ndkConnectionPromise = null; // Promise to track NDK connection status
let resolveNostrConnectInitiated;
const nostrConnectInitiatedPromise = new Promise(resolve => {
  resolveNostrConnectInitiated = resolve;
});

const connectTimeout = 3;

const nostrConnect = function (nostrPrivateKey) {
  // Assign the connection logic to the promise immediately
  ndkConnectionPromise = (async () => {
    let signer;
    const hasBrowserExtension = await userHasBrowserExtension();

    if (hasBrowserExtension) {
      console.debug("Signer: Using browser extension");
      signer = new NDKNip07Signer();
    } else if (nostrPrivateKey) {
      console.debug("Signer: Using private key");
      signer = new NDKPrivateKeySigner(nostrPrivateKey);
    } else {
      console.debug("Signer: No signer available");
      signer = null;
    }

    ndk = new NDK({
      explicitRelayUrls: explicitRelayUrls,
      signer: signer
    });

    // Add event listeners for connection monitoring
    ndk.pool.on('relay:connect', (relay) => {
      console.debug(`✅ Connected to relay: ${relay.url}`);
    });

    ndk.pool.on('relay:disconnect', (relay) => {
      console.debug(`❌ Disconnected from relay: ${relay.url}`);
    });

    ndk.pool.on('relay:error', (relay, error) => {
      console.error(`🔥 Relay error (${relay.url}):`, error);
    });

    try {
      await ndk.connect(connectTimeout);
      console.log("NDK connected successfully.");
    } catch (e) {
      console.error("ndk connect failed", e);
      // Try reconnecting without signer only if browser extension was detected and signer was initially set
      if (hasBrowserExtension && ndk.signer) {
        console.log("Trying to connect again without using a signer");
        ndk.signer = null; // Modify the existing NDK instance's signer
        await ndk.connect(connectTimeout); // Re-attempt connection, will throw if fails again
        console.log("NDK connected successfully (without signer).");
      } else {
        // If no extension or connection failed even without signer, re-throw
        showToast('It was impossible to connect to Nostr. Please check your browser extension and try again.', 'error');
        throw e;
      }
    }
    // The promise resolves implicitly if connect succeeds, or throws/rejects if it fails
  })(); // Immediately invoke the async function

  // Signal that nostrConnect has been initiated and the promise is set
  resolveNostrConnectInitiated();
  console.debug("nostrConnect initiated, ndkConnectionPromise is set.");

  return ndkConnectionPromise; // Return the promise
};

// Helper function to ensure NDK is connected before proceeding
const ensureNdkConnected = async () => {
  if (!ndkConnectionPromise) {
    // nostrConnect hasn't been called yet, wait for it to be initiated
    console.debug("ensureNdkConnected: Waiting for nostrConnect to be initiated...");
    await nostrConnectInitiatedPromise;
    console.debug("ensureNdkConnected: nostrConnect initiated.");
  }
  // Now we know ndkConnectionPromise is set (or was already set). Wait for the connection attempt to complete.
  console.debug("ensureNdkConnected: Waiting for ndkConnectionPromise to resolve...");
  await ndkConnectionPromise;
  console.debug("ensureNdkConnected: ndkConnectionPromise resolved.");
  if (!ndk) {
    // Should not happen if nostrConnect was called and promise resolved, but as a safeguard
    throw new Error("NDK object not initialized after connection.");
  }
};

const getUserPubkey = async function() {
  await ensureNdkConnected();
  if (!ndk.signer) {
    throw new Error("No signer available");
  }
  const user = await ndk.signer.user();
  return user.pubkey;
}

const validateSHA256 = function(hashes) {
  if (!hashes || !Array.isArray(hashes) || hashes.length === 0) {
    throw new Error("You must add at least one SHA256 hash");
  }
  for (const hash of hashes) {
    if (!/^[0-9a-f]{64}$/i.test(hash)) {
      throw new Error("Invalid SHA256 hash: must be a 64-character hexadecimal string: " + hash);
    }
  }
}

/**
 * Save profile to IDB
 * @param {string} pubkey - User's public key
 * @param {Object} profile - Profile data
 */
const saveProfileToIDB = async (pubkey, profile) => {
  const db = await initDB().catch(() => null);
  if (!db) return;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([profilesStoreName], "readwrite");
    const objectStore = transaction.objectStore(profilesStoreName);

    const profileData = {
      pubkey,
      profile,
      cached_at: Math.floor(Date.now() / 1000)
    };

    const request = objectStore.put(profileData);
    request.onsuccess = () => resolve();
    request.onerror = () => reject("Error saving profile to IDB");
  });
};

/**
 * Get profile from IDB
 * @param {string} pubkey - User's public key
 * @returns {Promise<Object|null>} Profile data or null
 */
const getProfileFromIDB = async (pubkey) => {
  const db = await initDB().catch(() => null);
  if (!db) return null;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([profilesStoreName], "readonly");
    const objectStore = transaction.objectStore(profilesStoreName);

    const request = objectStore.get(pubkey);
    request.onsuccess = () => {
      const result = request.result;
      if (!result) {
        reject("There is no profile for this pubkey");
        return;
      }

      // Check if cached profile is still fresh
      const now = Math.floor(Date.now() / 1000);
      const age = now - result.cached_at;
      const MAX_AGE = 24 * 60 * 60; // 24 hours

      if (age > MAX_AGE) {
        reject("Expired");
      } else {
        resolve(result.profile || {});
      }
    };
    request.onerror = () => reject("Error reading profile");
  });
};

const getNostrProfile = async function (pubkey) {
  if (!pubkey) {
    return null;
  }

  // Try IDB first (fastest)
  try {
    const profileFromIDB = await getProfileFromIDB(pubkey);
    if (profileFromIDB) {
      console.debug(`Profile loaded from IDB for ${pubkey.substring(0, 8)}...`);
      return profileFromIDB;
    }
  } catch (e) {
    console.debug("Failed to load profile from IDB:", e);
  }

  // Fetch from network
  await ensureNdkConnected();
  const user = ndk.getUser({ pubkey });
  const profile = await user.fetchProfile();
  console.debug('🔄 Got profile from Nostr network for pubkey', pubkey, profile);

  // Save to IDB to cache
  saveProfileToIDB(pubkey, profile).catch(e => console.warn("Failed to save profile to IDB", e));

  return profile;
}

const getNpubFromPubkey = function (pubkey) {
  return nip19.npubEncode(pubkey);
}

const getWSClientTags = function() {
  return [
    ["client", "WalletScrutiny.com", `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl],
    ["c", "walletscrutiny"]
  ];
}

async function publishNdkEvent(ndkEvent, eventType = 'event') {
  try {
    const publishedToRelays = await ndkEvent.publish();
    console.debug(`Published ${eventType} (id: ${ndkEvent.id}) to ${publishedToRelays.size} relays`);
    return ndkEvent;
  } catch (error) {
    console.error(`Error publishing ${eventType} to relays`, error);

    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`Error publishing ${eventType} to relay ${relay.url}`, err);
      }
    }

    return null;
  }
}

function createNdkEvent(kind, content, tags = [], createdAt = null) {
  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = kind;
  ndkEvent.content = content;
  ndkEvent.created_at = getCreatedAt(createdAt);
  ndkEvent.tags = [...tags, getWSClientTags()];
  return ndkEvent;
}

function validateParameterLengths(params) {
  const validationRules = {
    appId: { maxLength: 75, name: 'App ID' },
    version: { maxLength: 30, name: 'Version' },
    platform: { maxLength: 10, name: 'Platform' },
    description: { maxLength: 120, name: 'Description' },
    content: { maxLength: 60000, name: 'Content' },
    issueTrackerUrl: { maxLength: 200, name: 'Issue tracker URL' }
  };

  for (const [paramName, value] of Object.entries(params)) {
    if (value && validationRules[paramName]) {
      const rule = validationRules[paramName];
      if (value.length > rule.maxLength) {
        throw new Error(`${rule.name} must be ${rule.maxLength} characters or less`);
      }
    }
  }
}

const createAssetRegistration = async function ({
                                                  sha256,
                                                  appId,
                                                  version,
                                                  platform,
                                                  description,
                                                  createdAt = null
                                                }) {
  await ensureNdkConnected();
  validateSHA256([sha256]);

  if (!appId || !version || !description) {
    throw new Error("Missing required parameters");
  }

  validateParameterLengths({ appId, version, platform, description });

  const tags = [
    ["x", sha256],
    ["ox", sha256],
    ["i", appId],
    ["version", version]
  ];
  if (platform) {
    tags.push(["platform", platform]);
  }

  const ndkEvent = createNdkEvent(assetRegistrationKind, description, tags, createdAt);
  eventSanitize(ndkEvent);

  await publishNdkEvent(ndkEvent, 'asset registration');
  return ndkEvent;
}

const createVerification = async function ({
                                             hashes,
                                             description,
                                             content,
                                             status,
                                             appId,
                                             version,
                                             platform,
                                             issueTrackerUrl = null,
                                             createdAt = null,
                                             isDraft = false,
                                             draftVerificationEventId = null,
                                             uploadedFileData = [],
                                             reusedFileIds = [],
                                             outputFiles = [],
                                             basedOn = null
                                           }) {
  await ensureNdkConnected();
  validateSHA256(hashes);

  if (!content || !status) {
    throw new Error("Missing required parameters");
  }

  if (!['reproducible', 'not_reproducible', 'ftbfs', 'spam', 'notag', 'nosource', 'warning', 'obfuscated'].includes(status)) {
    throw new Error("Invalid status");
  }

  validateParameterLengths({ appId, version, platform, description, content, issueTrackerUrl });

  // --- Upload Files Before Main Event Creation ---
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

  const fullContent = JSON.stringify({
    description: description || '',
    content: content,
  });

  const tags = [["status", status]];

  if (isDraft) {
    let draftKey = '';
    if (appId) {
      draftKey += `${appId}:`;
    }
    draftKey += `${version}:${platform}`;
    tags.push(["d", draftKey]);
  }

  if (appId) {
    tags.push(["i", appId]);
  }
  if (version) {
    tags.push(["version", version]);
  }
  if (platform) {
    tags.push(["platform", platform]);
  }
  hashes.forEach(hash => {
    tags.push(["x", hash]);
  });

  // Add file event IDs as tags
  if (fileEventIds.length > 0) {
    fileEventIds.forEach(fileEventId => {
      tags.push(["file-attachment", fileEventId]);
    });
  }
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

  if (issueTrackerUrl && issueTrackerUrl.trim()) {
    tags.push(["issue-tracker-url", issueTrackerUrl.trim()]);
  }

  if (basedOn) {
    tags.push(["based-on", basedOn]);
  }

  const ndkEvent = createNdkEvent(
    isDraft ? verificationDraftKind : verificationKind,
    fullContent,
    tags,
    createdAt
  );
  eventSanitize(ndkEvent);

  await publishNdkEvent(ndkEvent, 'verification');

  if (!isDraft && draftVerificationEventId) {
    const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
    if (draftVerificationEvent) {
      await draftVerificationEvent.delete('deleting draft, as verification was published', true);
    }
  }

  return ndkEvent;
}

const createEndorsement = async function ({validity = null, verificationEventId, endorserNpubkey}) {
  await ensureNdkConnected();
  console.debug("Creating attestation (endorsement) for verification: ", verificationEventId);

  if (validity !== null && typeof validity !== 'boolean') {
    throw new Error("Validity must be a boolean value");
  }

  if (!verificationEventId || !endorserNpubkey) {
    throw new Error("Missing required parameters");
  }

  const tags = [
    ["d", `${endorserNpubkey}:${verificationEventId}`],
    ["e", verificationEventId],
    ["validity", validity ? "valid" : "invalid"],
  ];

  const ndkEvent = createNdkEvent(endorsementKind, '', tags);
  await publishNdkEvent(ndkEvent, 'endorsement');
}

function getCreatedAt(createdAt) {
  return createdAt ? Math.floor(new Date(createdAt).getTime() / 1000) : Math.floor(new Date().getTime() / 1000);
}

const getTimestampMonthsAgo = function(months = 6) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
}

function isValidJSONObject(str) {
  try {
    const parsed = JSON.parse(str);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}

/**
 * Sanitizes HTML content by removing potentially dangerous tags.
 * This allows various formatting tags to be kept, which is useful for rich content,
 * while mitigating risks from tags that can execute scripts or handle form submissions.
 * @param {string} content The HTML string to sanitize.
 * @returns {string} The sanitized HTML string.
 */
function sanitizeDangerousHTML(content) {
  if (!content) {
    return content;
  }

  const forbiddenTags = [
    'script', 'iframe', 'object', 'embed', 'form', 'input',
    'textarea', 'select', 'button', 'img', 'style', 'link', 'image'
  ];

  let sanitizedContent = content;

  forbiddenTags.forEach(tag => {
    // This regex targets tags that enclose content, like <script>...</script>.
    // It's case-insensitive (i) and global (g) to catch all occurrences.
    // The 's' flag allows '.' to match newlines, to handle multi-line content.
    const contentTagRegex = new RegExp(`<${tag}\\b[^>]*>.*?<\\/${tag}>`, 'gis');
    sanitizedContent = sanitizedContent.replace(contentTagRegex, '');

    // This second regex is for self-closing or standalone tags like <img ...> or <link ...>.
    // It finds the tag and removes it. This is run after the first regex
    // to clean up any remaining opening tags that didn't have a matching closing tag.
    const selfClosingTagRegex = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    sanitizedContent = sanitizedContent.replace(selfClosingTagRegex, '');
  });

  return sanitizedContent;
}

function eventSanitize(event) {
  const isBrowser = typeof window !== 'undefined';

  // Sanitize content
  if (isValidJSONObject(event.content)) {
    const contentObject = JSON.parse(event.content);

    Object.keys(contentObject).forEach(key => {
      let sanitizedContent;
      if (key === 'content') {
        // For 'content', sanitize to remove dangerous tags
        // like <script>, but allow other (XML?) tags
        sanitizedContent = sanitizeDangerousHTML(contentObject[key]);
      } else {
        // For other fields like 'description', sanitize to strip any HTML.
        sanitizedContent = isBrowser ? DOMPurify.sanitize(contentObject[key], purifyConfig) : contentObject[key];
      }

      if (key === 'description') {
        sanitizedContent = sanitizedContent.substring(0, 120);
      } else if (key === 'content') {
        sanitizedContent = sanitizedContent.substring(0, 60000);
      }

      contentObject[key] = sanitizedContent;
    });

    event.content = JSON.stringify(contentObject);
  } else {
    event.content = isBrowser ? DOMPurify.sanitize(event.content, purifyConfig) : event.content;
    event.content = event.content.substring(0, 120);
  }

  // Sanitize tags
  event.tags.forEach(tag => {
    let sanitizedTag = isBrowser ? DOMPurify.sanitize(tag[1], purifyConfig) : tag[1];

    // Remove any remaining double quotes from the sanitized tag
    sanitizedTag = sanitizedTag.replace(/"/g, '');

    if (tag[0] === 'i') {
      sanitizedTag = sanitizedTag.substring(0, 75);
    } else if (tag[0] === 'version') {
      sanitizedTag = sanitizedTag.substring(0, 30);
    } else if (['x', 'ox'].includes(tag[0])) {
      sanitizedTag = sanitizedTag.substring(0, 64);
    } else if (tag[0] === 'platform') {
      sanitizedTag = sanitizedTag.substring(0, 10);
    } else if (tag[0] === 'status') {
      sanitizedTag = sanitizedTag.substring(0, 16);
    }

    tag[1] = sanitizedTag;
  });
}

const getFileAttachmentIDsForVerificationEvent = function(event) {
  return event.getMatchingTags("file-attachment").map(tag => tag[1]) || [];
}

const uploadFileAttachment = async function({ fileName, fileType, fileSize, base64Data }) {
  await ensureNdkConnected();

  if (!fileName || !fileType || !base64Data) {
    throw new Error("Missing required parameters for file upload");
  }

  if (fileSize > 60000) { // Double check size
    throw new Error(`File ${fileName} exceeds the 60KB limit`);
  }

  const name = fileName.split('.').slice(0, -1).join('.') ?? '';
  const extension = fileName.split('.').pop() ?? '';

  const tags = [
    ["name", name],
    ["extension", extension],
    ["content-type", fileType],
    ["size", fileSize.toString()]
  ];

  const ndkEvent = createNdkEvent(codeSnippetKind, base64Data, tags);

  try {
    await publishNdkEvent(ndkEvent, `file ${fileName}`);
    return { success: true, eventId: ndkEvent.id, fileName: fileName };
  } catch (error) {
    console.error(`Error uploading file ${fileName}`, error);
    return { success: false, error: error, fileName: fileName };
  }
}

const getEventsFromEventIds = async function(eventIds) {
  await ensureNdkConnected();

  if (!eventIds || eventIds.length === 0) {
    console.debug(`No event-ids found on verification event ${eventIds}.`);
    return [];
  }

  console.debug(`Fetching ${eventIds.length} events: ${eventIds.join(', ')}`);

  return await ndk.fetchEvents({
    ids: eventIds
  });
}

const getEndorsementsFromVerificationEventIds = async function(verificationEventIds) {
  await ensureNdkConnected();
  const endorsements = await ndk.fetchEvents({
    kinds: [endorsementKind],
    '#e': verificationEventIds
  });

  // Group endorsements by the value of the 'e' tag (verification event id)
  const grouped = {};
  for (const endorsement of endorsements) {
    const eTag = endorsement.tags.find(tag => tag[0] === 'e');
    if (eTag && eTag[1]) {
      if (!grouped[eTag[1]]) {
        grouped[eTag[1]] = [];
      }
      grouped[eTag[1]].push(endorsement);
    }
  }
  return grouped;
}

const getAllAttachmentsForAppId = async function(appId, appAssetInformation = null) {
  if (!appAssetInformation) {
    appAssetInformation = await getAllAssetInformation({
      appId
    });
  }

  const attachments = [];
  const promises = [];

  for (const sha256VerificationGroup of appAssetInformation.verifications.values()) {
    for (const verification of sha256VerificationGroup) {
      const fileEventIds = getFileAttachmentIDsForVerificationEvent(verification);
      if (fileEventIds.length > 0) {
        promises.push(
          getEventsFromEventIds(fileEventIds).then(fileAttachmentEvents => {
            // Process each fetched attachment event
            fileAttachmentEvents.forEach(attachmentEvent => {
              // Add the parent verification event to the attachment
              attachmentEvent.parentVerificationEvent = verification;
              attachments.push(attachmentEvent);
            });
          })
        );
      }
    }
  }

  await Promise.all(promises);  // Wait for all promises to resolve before continuing

  return attachments;
}

/**
 * Fetches events with pagination support for multiple filters
 * @param {Object} ndkInstance - NDK instance to use for fetching events
 * @param {Array<Object>} filters - Array of filter objects to fetch events for
 * @returns {Promise<Set>} - Set of events
 */
const fetchEventsWithPagination = async function(ndkInstance, filter) {
  const allEvents = new Set();
  let hasMoreEvents = true;
  let pageCount = 0;

  while (hasMoreEvents) {
    pageCount++;
    try {
      const pageEvents = await ndkInstance.fetchEvents(filter);

      if (pageEvents.size === 0) {
        hasMoreEvents = false;
        console.debug('No more events found.');
        break;
      }

      // Add events to the set and find the oldest created_at in the same loop
      let oldestCreatedAt = Infinity;
      pageEvents.forEach(event => {
        allEvents.add(event);
        if (event.created_at < oldestCreatedAt) {
          oldestCreatedAt = event.created_at;
        }
      });

      filter.until = oldestCreatedAt - 1;

      console.debug(`Fetched page ${pageCount}: ${pageEvents.size} events, oldest created_at: ${oldestCreatedAt}`);
    } catch (error) {
      console.error(`Error fetching page ${pageCount}:`, error);
      break;
    }
  }

  console.debug(`Total pages fetched: ${pageCount}, total events: ${allEvents.size}`);
  return allEvents;
};

// IndexedDB Helper Functions
const dbName = 'WalletScrutinyDB';
const dbVersion = 3;
const eventsStoreName = 'events';
const profilesStoreName = 'profiles';

const initDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onerror = (event) => reject("IndexedDB error: " + event.target.errorCode);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create events store with indexes
      if (!db.objectStoreNames.contains(eventsStoreName)) {
        const eventsStore = db.createObjectStore(eventsStoreName, { keyPath: 'id' });
        eventsStore.createIndex('created_at', 'created_at', { unique: false });
        eventsStore.createIndex('kind', 'kind', { unique: false });
        eventsStore.createIndex('kind_createdAt', ['kind', 'created_at'], { unique: false });
        eventsStore.createIndex('pubkey', 'pubkey', { unique: false });
        console.log('Created events object store with indexes');
      }

      // Create profiles store
      if (!db.objectStoreNames.contains(profilesStoreName)) {
        const profilesStore = db.createObjectStore(profilesStoreName, { keyPath: 'pubkey' });
        profilesStore.createIndex('cached_at', 'cached_at', { unique: false });
        console.log('Created profiles object store');
      }
    };
  });
};

/**
 * Save events to IDB - stores all events as-is
 * Deduplication is done application-side when reading (for verifications: by hash+pubkey)
 * @param {Array|Set} events - Events to save
 * @returns {Promise<number>} Number of events saved
 */
const saveEventsToIDB = async (events) => {
  const db = await initDB().catch(() => null);
  if (!db) return 0;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([eventsStoreName], "readwrite");
    const objectStore = transaction.objectStore(eventsStoreName);

    let savedCount = 0;
    const eventsArray = Array.isArray(events) ? events : Array.from(events);

    eventsArray.forEach(event => {
      const rawEvent = event.rawEvent ? event.rawEvent() : (event.toNostrEvent ? event.toNostrEvent() : event);
      const request = objectStore.put(rawEvent);
      request.onsuccess = () => savedCount++;
    });

    transaction.oncomplete = () => {
      console.debug(`Saved ${savedCount} events to IDB`);
      resolve(savedCount);
    };
    transaction.onerror = () => reject("Error saving events to IDB");
  });
};

/**
 * Get events from IDB with optional filtering
 * @param {Object} options - Filter options
 * @param {Array<number>} options.kinds - Event kinds to filter
 * @param {number} options.since - Timestamp to filter from (inclusive)
 * @param {number} options.until - Timestamp to filter until (inclusive)
 * @param {number} options.limit - Max number of events to return
 * @returns {Promise<Array>} Array of raw event objects sorted by created_at DESC (newest first)
 */
const getEventsFromIDB = async ({ kinds = null, since = null, until = null, limit = null } = {}) => {
  const db = await initDB().catch(() => null);
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([eventsStoreName], "readonly");
    const objectStore = transaction.objectStore(eventsStoreName);
    const results = [];

    // Use created_at index to iterate in descending order (newest first)
    const index = objectStore.index('created_at');

    // Build IDBKeyRange based on since/until
    let range = null;
    if (since !== null && until !== null) {
      range = IDBKeyRange.bound(since, until);
    } else if (since !== null) {
      range = IDBKeyRange.lowerBound(since);
    } else if (until !== null) {
      range = IDBKeyRange.upperBound(until);
    }

    // Open cursor in descending order (prev = newest first)
    const request = index.openCursor(range, 'prev');

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const eventData = cursor.value;

        // Apply kind filter
        let include = true;
        if (kinds && !kinds.includes(eventData.kind)) {
          include = false;
        }

        if (include) {
          results.push(eventData);

          // Stop if we've hit the limit
          if (limit && results.length >= limit) {
            resolve(results);
            return;
          }
        }

        cursor.continue();
      } else {
        // No more results, return what we have
        resolve(results);
      }
    };

    request.onerror = () => reject("Error reading events from IDB");
  });
};

/**
 * Get timestamp range of cached events in IDB
 * @param {Array<number>} kinds - Optional kinds to check
 * @returns {Promise<{oldest: number|null, newest: number|null, count: number}>}
 */
const getIDBEventRange = async (kinds = null) => {
  const db = await initDB().catch(() => null);
  if (!db) return { oldest: null, newest: null, count: 0 };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([eventsStoreName], "readonly");
    const objectStore = transaction.objectStore(eventsStoreName);
    const index = objectStore.index('created_at');

    let oldest = null;
    let newest = null;
    let count = 0;

    const countRequest = objectStore.count();
    countRequest.onsuccess = () => {
      count = countRequest.result;
    };

    // Get oldest
    const oldestRequest = index.openCursor(null, 'next');
    oldestRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const eventData = cursor.value;
        if (!kinds || kinds.includes(eventData.kind)) {
          oldest = eventData.created_at;
        } else {
          cursor.continue();
          return;
        }
      }

      // Get newest
      const newestRequest = index.openCursor(null, 'prev');
      newestRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const eventData = cursor.value;
          if (!kinds || kinds.includes(eventData.kind)) {
            newest = eventData.created_at;
          } else {
            cursor.continue();
            return;
          }
        }

        resolve({ oldest, newest, count });
      };
      newestRequest.onerror = () => reject("Error reading newest event");
    };
    oldestRequest.onerror = () => reject("Error reading oldest event");
  });
};


/**
 * Background sync to keep IDB cache fresh - fetches ALL relevant event kinds
 * Runs in background after page is idle
 */
const backgroundSyncEvents = async function() {
  try {
    await ensureNdkConnected();
    console.log('🔄 Background sync starting...');

    const SYNC_LIMIT = 500; // Max events per query (relay limit)
    const ALL_KINDS = [assetRegistrationKind, verificationKind, verificationDraftKind,
      endorsementKind, verificationCommentKind, codeSnippetKind];

    // 1. Sync verifications and drafts (newer events)
    const { newest: newestVerification } = await getIDBEventRange([verificationKind, verificationDraftKind]);

    if (newestVerification) {
      const newVerifications = await fetchEventsWithPagination(ndk, {
        kinds: [verificationKind, verificationDraftKind],
        since: newestVerification + 1,
        limit: SYNC_LIMIT
      });

      if (newVerifications.size > 0) {
        await saveEventsToIDB(newVerifications);
        console.log(`✅ Background sync: Saved ${newVerifications.size} new verifications`);
      }
    } else {
      // First time sync - fetch all verifications
      const allVerifications = await fetchEventsWithPagination(ndk, {
        kinds: [verificationKind, verificationDraftKind],
        since: verificationEventsSinceTS,
        limit: SYNC_LIMIT
      });

      if (allVerifications.size > 0) {
        await saveEventsToIDB(allVerifications);
        console.log(`✅ Background sync: Initial load of ${allVerifications.size} verifications`);
      }
    }

    // 2. Fill gaps (older events that might have been missed due to interruption)
    const { oldest: oldestVerification } = await getIDBEventRange([verificationKind, verificationDraftKind]);

    if (oldestVerification && oldestVerification > verificationEventsSinceTS) {
      const olderVerifications = await fetchEventsWithPagination(ndk, {
        kinds: [verificationKind, verificationDraftKind],
        since: verificationEventsSinceTS,
        until: oldestVerification - 1,
        limit: SYNC_LIMIT
      });

      if (olderVerifications.size > 0) {
        await saveEventsToIDB(olderVerifications);
        console.log(`✅ Background sync: Filled gap with ${olderVerifications.size} older verifications`);
      }
    }

    // 3. Get all appIds and verification event IDs from cached verifications
    const allCachedVerifications = await getEventsFromIDB({
      kinds: [verificationKind, verificationDraftKind]
    });

    const appIds = new Set();
    const verificationEventIds = [];
    allCachedVerifications.forEach(v => {
      const appId = v.tags?.find(t => t[0] === 'i')?.[1];
      if (appId) {
        appIds.add(appId);
      }
      verificationEventIds.push(v.id);
    });

    // 4. Sync asset registrations for these appIds only
    if (appIds.size > 0) {
      const { newest: newestAsset } = await getIDBEventRange([assetRegistrationKind]);

      const newAssets = await fetchEventsWithPagination(ndk, {
        kinds: [assetRegistrationKind],
        '#i': Array.from(appIds),
        since: newestAsset ? newestAsset + 1 : verificationEventsSinceTS,
        limit: SYNC_LIMIT
      });

      if (newAssets.size > 0) {
        await saveEventsToIDB(newAssets);
        console.log(`✅ Background sync: Saved ${newAssets.size} new asset registrations`);
      }

      // 5. Fill gaps for asset registrations
      const { oldest: oldestAsset } = await getIDBEventRange([assetRegistrationKind]);

      if (oldestAsset && oldestAsset > verificationEventsSinceTS) {
        const olderAssets = await fetchEventsWithPagination(ndk, {
          kinds: [assetRegistrationKind],
          '#i': Array.from(appIds),
          since: verificationEventsSinceTS,
          until: oldestAsset - 1,
          limit: SYNC_LIMIT
        });

        if (olderAssets.size > 0) {
          await saveEventsToIDB(olderAssets);
          console.log(`✅ Background sync: Filled gap with ${olderAssets.size} older assets`);
        }
      }
    }

    // 6. Fetch and cache profiles for all verifiers
    const uniquePubkeys = new Set();
    allCachedVerifications.forEach(v => {
      if (v.pubkey) uniquePubkeys.add(v.pubkey);
    });

    console.log(`🔄 Fetching profiles for ${uniquePubkeys.size} verifiers...`);
    for (const pubkey of uniquePubkeys) {
      try {
        await getNostrProfile(pubkey);
      } catch (e) {
        console.warn(`Failed to fetch profile for ${pubkey.substring(0, 8)}...`, e);
      }
    }

    // 7. Sync endorsements for cached verifications
    if (verificationEventIds.length > 0) {
      const { newest: newestEndorsement } = await getIDBEventRange([endorsementKind]);

      // Fetch in batches of 100 verification IDs (relay limit)
      const batchSize = 100;
      for (let i = 0; i < verificationEventIds.length; i += batchSize) {
        const batch = verificationEventIds.slice(i, i + batchSize);

        const newEndorsements = await ndk.fetchEvents({
          kinds: [endorsementKind],
          '#e': batch,
          since: newestEndorsement ? newestEndorsement + 1 : verificationEventsSinceTS,
          limit: SYNC_LIMIT
        });

        if (newEndorsements.size > 0) {
          await saveEventsToIDB(newEndorsements);
          console.log(`✅ Background sync: Saved ${newEndorsements.size} new endorsements (batch ${Math.floor(i/batchSize) + 1})`);
        }
      }
    }

    // 8. Sync comments for cached verifications (using 'v' tag)
    if (verificationEventIds.length > 0) {
      const { newest: newestComment } = await getIDBEventRange([verificationCommentKind]);

      // Comments use 'v' tag, not 'e' tag
      const batchSize = 100;
      for (let i = 0; i < verificationEventIds.length; i += batchSize) {
        const batch = verificationEventIds.slice(i, i + batchSize);

        const newComments = await ndk.fetchEvents({
          kinds: [verificationCommentKind],
          '#v': batch,
          since: newestComment ? newestComment + 1 : verificationEventsSinceTS,
          limit: SYNC_LIMIT
        });

        if (newComments.size > 0) {
          await saveEventsToIDB(newComments);
          console.log(`✅ Background sync: Saved ${newComments.size} new comments (batch ${Math.floor(i/batchSize) + 1})`);
        }
      }
    }

    // 9. Sync code snippets (file attachments) - these are referenced by verifications
    // We'll fetch them on-demand when verifications are loaded, but cache what we find
    const { newest: newestSnippet } = await getIDBEventRange([codeSnippetKind]);

    const newSnippets = await ndk.fetchEvents({
      kinds: [codeSnippetKind],
      since: newestSnippet ? newestSnippet + 1 : verificationEventsSinceTS,
      limit: SYNC_LIMIT
    });

    if (newSnippets.size > 0) {
      await saveEventsToIDB(newSnippets);
      console.log(`✅ Background sync: Saved ${newSnippets.size} new code snippets`);
    }

    console.log('✅ Background sync complete - ALL event kinds synced');
  } catch (error) {
    console.warn('Background sync error:', error);
  }
};

/**
 * Helper function to process raw NDK events into our application structure
 * Applies deduplication: For verifications, keeps only newest per (hash, pubkey) pair
 */
function processEventsToResult(events, oldestEventTimestamp) {
  events.forEach(event => {
    eventSanitize(event);
  });

  // Relaxed filtering: Accept verifications from any client to prevent data loss
  const assets = Array.from(events).filter(event => event.kind === assetRegistrationKind);

  const verifications = Array.from(events).filter(event => event.kind === verificationKind);

  const draftVerifications = Array.from(events).filter(event => event.kind === verificationDraftKind && getFirstTagValue(event, 'client') === 'WalletScrutiny.com');

  const assetsMap = new Map();
  const verificationsMap = new Map();
  const draftVerificationsMap = new Map();

  assets.forEach(asset => {
    const sha256FromEventTag = getFirstTagValue(asset, 'x', null);
    if (sha256FromEventTag) {
      if (!assetsMap.has(sha256FromEventTag)) {
        assetsMap.set(sha256FromEventTag, []);
      }
      assetsMap.get(sha256FromEventTag).push(asset);
    }
  });

  // Deduplicate verifications by (hash, pubkey) - keep only newest per user per hash
  const verificationDeduplicationMap = new Map(); // key: "hash:pubkey" -> newest event

  verifications.forEach(verification => {
    const sha256FromEventTag = getFirstTagValue(verification, 'x', null);
    if (sha256FromEventTag) {
      const dedupKey = `${sha256FromEventTag}:${verification.pubkey}`;
      const existing = verificationDeduplicationMap.get(dedupKey);

      if (!existing || verification.created_at > existing.created_at) {
        verificationDeduplicationMap.set(dedupKey, verification);
      }
    }
  });

  // Now group deduplicated verifications by hash
  verificationDeduplicationMap.forEach(verification => {
    const sha256FromEventTag = getFirstTagValue(verification, 'x', null);
    if (sha256FromEventTag) {
      if (!verificationsMap.has(sha256FromEventTag)) {
        verificationsMap.set(sha256FromEventTag, []);
      }
      verificationsMap.get(sha256FromEventTag).push(verification);
    }
  });

  console.debug(`Deduplicated ${verifications.length} verification events to ${verificationDeduplicationMap.size} unique (hash, pubkey) pairs`);

  draftVerifications.forEach(draftVerification => {
    const sha256FromEventTag = getFirstTagValue(draftVerification, 'x', null);
    if (sha256FromEventTag) {
      if (!draftVerificationsMap.has(sha256FromEventTag)) {
        draftVerificationsMap.set(sha256FromEventTag, []);
      }
      draftVerificationsMap.get(sha256FromEventTag).push(draftVerification);
    }
  });

  return {
    assets: assetsMap,
    verifications: verificationsMap,
    draftVerifications: draftVerificationsMap,
    oldestEventTimestamp: oldestEventTimestamp
  };
}

const getAllAssetInformation = async function({ months,
                                                pubkey,
                                                appId,
                                                sha256,
                                                since,
                                                until,
                                                singleBatch = false,
                                                kinds = null,
                                                limit = null,
                                                onCachedDataLoaded = null
                                              }) {
  const randomNumber = Math.floor(Math.random() * 100);
  console.time('getAllAssetInformation' + randomNumber);

  let events = new Set();
  let loadedFromIDB = false;
  let oldestEventTimestamp = null;
  let newestEventTimestamp = 0;

  const targetKinds = kinds || [assetRegistrationKind, verificationKind, verificationDraftKind];

  // 1. Load from IDB
  try {
    const cachedEvents = await getEventsFromIDB({ kinds: targetKinds });
    if (cachedEvents && cachedEvents.length > 0) {
      console.debug(`Loaded ${cachedEvents.length} events from IDB`);

      cachedEvents.forEach(eventData => {
        // Filter relevant events based on request parameters
        let includeEvent = true;

        // Filter by appId if specified
        if (appId) {
          const appIds = Array.isArray(appId) ? appId : [appId];
          const eventAppId = eventData.tags?.find(t => t[0] === 'i')?.[1];
          if (!eventAppId || !appIds.includes(eventAppId)) {
            includeEvent = false;
          }
        }

        // Filter by sha256 if specified
        if (includeEvent && sha256) {
          const eventHashes = eventData.tags?.filter(t => t[0] === 'x').map(t => t[1]) || [];
          if (!eventHashes.includes(sha256)) {
            includeEvent = false;
          }
        }

        // Filter by pubkey if specified
        if (includeEvent && pubkey && eventData.pubkey !== pubkey) {
          includeEvent = false;
        }

        if (includeEvent) {
          const ndkEvent = new NDKEvent(ndk, eventData);
          events.add(ndkEvent);

          if (eventData.created_at) {
            if (newestEventTimestamp < eventData.created_at) {
              newestEventTimestamp = eventData.created_at;
            }
            if (oldestEventTimestamp === null || eventData.created_at < oldestEventTimestamp) {
              oldestEventTimestamp = eventData.created_at;
            }
          }
        }
      });

      loadedFromIDB = events.size > 0;

      if (loadedFromIDB && onCachedDataLoaded) {
        console.debug('Triggering onCachedDataLoaded callback with IDB data');
        const result = processEventsToResult(new Set(events), oldestEventTimestamp);
        onCachedDataLoaded(result);
      }
    }
  } catch (e) {
    console.warn("Failed to load from IDB", e);
  }

  // 2. Determine what to fetch from network
  const filter = { kinds: targetKinds };
  let baseSince = verificationEventsSinceTS;

  if (months) {
    console.debug(`Getting events from last ${months} months`);
    baseSince = getTimestampMonthsAgo(months);
  } else if (since) {
    console.debug(`Getting events from ${since} onwards`);
    baseSince = since;
  }

  // Smart sync: fetch newer events
  if (loadedFromIDB && !until && !singleBatch) {
    // Fetch newer events (incremental sync)
    filter.since = newestEventTimestamp + 1;
    console.debug(`Incremental sync: Fetching events newer than ${newestEventTimestamp}`);

    // Also check if we need to fetch older events (gap filling)
    const DAY_IN_SECONDS = 86400;
    if (oldestEventTimestamp && oldestEventTimestamp > baseSince + DAY_IN_SECONDS) {
      console.debug(`Gap detected: IDB oldest=${oldestEventTimestamp}, expected=${baseSince}. Will fetch older events after new ones.`);
    }
  } else {
    filter.since = baseSince;
  }

  if (until) {
    filter.until = until;
  }
  if (limit) {
    filter.limit = limit;
  }
  if (pubkey) {
    filter.authors = [pubkey];
  }
  if (appId) {
    filter["#i"] = Array.isArray(appId) ? appId : [appId];
  }
  if (sha256) {
    filter["#x"] = [sha256];
  }

  // 3. Fetch from Network
  let newEvents = new Set();
  await ensureNdkConnected();

  // Strategy: First fetch verifications, then fetch related assets and other events
  // Only fetch assets for appIds that have verifications

  // Step 3a: Fetch verifications first
  if (!appId && !sha256 && !pubkey) {
    // General query - fetch verifications first, then assets for those appIds only
    const verificationFilter = {
      kinds: [verificationKind, verificationDraftKind],
      since: filter.since
    };
    if (filter.until) verificationFilter.until = filter.until;
    if (filter.limit) verificationFilter.limit = filter.limit;

    try {
      const newVerifications = singleBatch
        ? await ndk.fetchEvents(verificationFilter)
        : await fetchEventsWithPagination(ndk, verificationFilter);

      newVerifications.forEach(e => newEvents.add(e));
      console.log(`Fetched ${newVerifications.size} verifications from network`);

      // Extract appIds from these verifications
      const verificationAppIds = new Set();
      newVerifications.forEach(v => {
        const vAppId = v.tags?.find(t => t[0] === 'i')?.[1];
        if (vAppId) verificationAppIds.add(vAppId);
      });

      // Now fetch assets only for these appIds
      if (verificationAppIds.size > 0) {
        const assetFilter = {
          kinds: [assetRegistrationKind],
          '#i': Array.from(verificationAppIds),
          since: filter.since
        };
        if (filter.until) assetFilter.until = filter.until;

        const newAssets = singleBatch
          ? await ndk.fetchEvents(assetFilter)
          : await fetchEventsWithPagination(ndk, assetFilter);

        newAssets.forEach(e => newEvents.add(e));
        console.log(`Fetched ${newAssets.size} assets for ${verificationAppIds.size} appIds from network`);
      }
    } catch(e) {
      console.error("Error fetching events:", e);
      if (!loadedFromIDB) throw e;
    }
  } else {
    // Specific query with appId/sha256/pubkey filters - use original filter
    try {
      if (singleBatch) {
        console.debug(`Fetching single batch with filter:`, filter);
        newEvents = await ndk.fetchEvents(filter);
      } else {
        newEvents = await fetchEventsWithPagination(ndk, filter);
      }

      console.log(`Fetched ${newEvents.size} new events from network`);
    } catch(e) {
      console.error("Error fetching events:", e);
      if (!loadedFromIDB) throw e;
    }
  }

  // 4. Fetch older events to fill gaps (if needed and not limited by params)
  if (loadedFromIDB && !until && !singleBatch && !pubkey && !appId && !sha256 && !months && !since) {
    const DAY_IN_SECONDS = 86400;
    if (oldestEventTimestamp && oldestEventTimestamp > baseSince + DAY_IN_SECONDS) {
      console.debug(`Filling gap: fetching events between ${baseSince} and ${oldestEventTimestamp - 1}`);

      const gapFilter = {
        kinds: targetKinds,
        since: baseSince,
        until: oldestEventTimestamp - 1
      };

      try {
        const gapEvents = await fetchEventsWithPagination(ndk, gapFilter);
        console.log(`Gap fill: fetched ${gapEvents.size} older events`);
        gapEvents.forEach(e => newEvents.add(e));
      } catch(e) {
        console.warn("Error fetching gap events:", e);
      }
    }
  }

  // 5. Merge new events and update IDB
  if (newEvents.size > 0) {
    newEvents.forEach(e => {
      events.add(e);
      if (oldestEventTimestamp === null || e.created_at < oldestEventTimestamp) {
        oldestEventTimestamp = e.created_at;
      }
      if (newestEventTimestamp < e.created_at) {
        newestEventTimestamp = e.created_at;
      }
    });

    // Save to IDB
    try {
      await saveEventsToIDB(newEvents);
      console.debug(`Saved ${newEvents.size} new events to IDB`);
    } catch (e) {
      console.warn("Failed to save to IDB", e);
    }
  }

  console.debug(`Total unique events (IDB + Network): ${events.size}`);

  const finalResult = processEventsToResult(events, oldestEventTimestamp);

  console.log(`Final result: ${finalResult.verifications.size} verifications, ${finalResult.assets.size} assets`);
  console.timeEnd('getAllAssetInformation' + randomNumber);

  return finalResult;
}

function getAppInfoFromEventInfo(eventInfo) {
  const isAsset = eventInfo.kind === assetRegistrationKind;

  const createdAt = eventInfo.created_at;
  const description = isAsset ? '' : JSON.parse(eventInfo.content).description;
  const content = isAsset ? eventInfo.content : JSON.parse(eventInfo.content).content;
  const appId = getFirstTagValue(eventInfo, 'i');
  const version = getFirstTagValue(eventInfo, 'version');
  const platform = getFirstTagValue(eventInfo, 'platform');
  const status = getFirstTagValue(eventInfo, 'status');
  const url = getFirstTagValue(eventInfo, 'url');
  const gitRevision = getFirstTagValue(eventInfo, 'git_revision');
  const appHashes = eventInfo.tags.filter(tag => tag[0] === 'x').map(tag => tag[1]);

  return {
    isAsset,
    appId,
    version,
    createdAt,
    description,
    content,
    platform,
    status,
    url,
    gitRevision,
    appHashes,
  };
}

function showToast(message, type = 'success', duration = 4000) {
  return new Promise((resolve) => {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    let color;
    if (type === 'error') {
      duration = 6000;
      color = '#ff5861';
    } else if (type === 'success') {
      color = '#00a96e';
    } else if (type === 'warning') {
      color = '#ffbe00';
    } else if (type === 'info') {
      color = '#00b6ff';
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = color;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 250);

    // Hide and remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      toast.remove();
      resolve();
    }, duration);
  });
}

const createNostrNote = async function (message) {
  await ensureNdkConnected();
  if (!message) {
    throw new Error("Message is required");
  }

  const ndkEvent = createNdkEvent(1, message);
  await publishNdkEvent(ndkEvent, 'note');
  return ndkEvent.id;
}

const createNostrCommentToVerification = async function(verificationKey, comment, commentAuthorPubkeys, messageCounter) {
  await ensureNdkConnected();

  const ndkEvent = createNdkEvent(verificationCommentKind, comment);
  ndkEvent.tags.push(['v', verificationKey]);
  commentAuthorPubkeys.forEach(pubkey => {
    ndkEvent.tags.push(['p', pubkey]);
  });
  ndkEvent.tags.push(['d', verificationKey + '-' + messageCounter.toString()]);

  await publishNdkEvent(ndkEvent, 'comment to verification');

  return ndkEvent.id;
}

const getCommentsForVerification = async function(verificationKey) {
  await ensureNdkConnected();
  const comments = await ndk.fetchEvents({
    kinds: [verificationCommentKind],
    '#v': [verificationKey]
  });
  return Array.from(comments);
}

const sendPrivateMessageToVerifier = async function(verifierPubkey, commentText) {
  await ensureNdkConnected();

  if (!verifierPubkey || !commentText) {
    throw new Error("Missing required parameters: verifierPubkey and commentText are required");
  }

  // Validate pubkey format
  if (!/^[0-9a-f]{64}$/i.test(verifierPubkey)) {
    throw new Error("Invalid verifier pubkey format");
  }

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = 4;
  ndkEvent.pubkey = await getUserPubkey();
  ndkEvent.created_at = getCreatedAt();
  ndkEvent.tags = [['p', verifierPubkey]];
  ndkEvent.content = commentText;

  try {
    const recipient = ndk.getUser({ pubkey: verifierPubkey });
    await ndkEvent.encrypt(recipient, null, "nip04");
    await ndkEvent.sign();
    await publishNdkEvent(ndkEvent, 'private message to verifier');
    return ndkEvent.id;
  } catch (error) {
    console.error('Error encrypting or publishing private message:', error);
    throw new Error(`Failed to send private message: ${error.message}`);
  }
}

function setupAppIdAutocomplete(firstTime = true) {
  const appIdInput = document.getElementById('appId');
  const suggestionsContainer = document.getElementById('appIdSuggestions');

  function filterWallets(searchText) {
    if (!window.wallets) return [];
    return window.wallets.filter(wallet => {
      const searchLower = searchText.toLowerCase();
      return wallet.appId.toLowerCase().includes(searchLower) ||
        wallet.title.toLowerCase().includes(searchLower);
    });
  }

  // Helper function to decode HTML entities
  function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    const fragment = document.createDocumentFragment();

    suggestions.forEach(wallet => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      // Decode HTML entities in the title before displaying
      const decodedTitle = decodeHtmlEntities(wallet.title);
      div.textContent = `${decodedTitle}${wallet.folder ? ' (' + wallet.folder + ')' : ''} - ${wallet.appId}`;
      div.onclick = () => {
        appIdInput.value = wallet.appId;
        suggestionsContainer.style.display = 'none';
        appIdInput.dispatchEvent(new Event('input', { bubbles: true }));  // Manually trigger the input event after setting the value
      };
      fragment.appendChild(div);
    });

    suggestionsContainer.appendChild(fragment);

    suggestionsContainer.style.display = 'block';
  }

  if (firstTime) {
    appIdInput.addEventListener('input', (e) => {
      const searchText = e.target.value;
      if (searchText.length > 1) {
        const filteredWallets = filterWallets(searchText);
        showSuggestions(filteredWallets);
      } else {
        showSuggestions([]);
      }
    });

    document.addEventListener('click', (e) => {
      if (!appIdInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
  }
}

function getStatusText(status, short = false) {
  switch (status) {
    case 'reproducible':
      return 'Reproducible when tested';
    case 'not_reproducible':
      return short ? 'Not reproducible' : 'Not reproducible from source provided, or differences are significant';
    case 'ftbfs':
      return short ? 'Failed to build from source' : 'Failed to build from source provided';
    case 'notag':
      return short ? 'Git revision not clear' : 'The git revision to compile is not clear';
    case 'nosource':
      return short ? 'Source not found' : 'Source for this version was not found or repository was taken down';
    case 'obfuscated':
      return short ? 'Source obfuscated' : 'Source code is obfuscated';
    case 'warning':
      return 'Warning';
    default:
      return status;
  }
}

const getVerificationEvent = async function(verificationEventId) {
  if (!verificationEventId) {
    throw new Error('No verification event ID provided');
  }

  await ensureNdkConnected();
  return await ndk.fetchEvent(verificationEventId);
}

const deleteDraftVerification = async function(draftVerificationEventId, moveToURL = null, reason = 'user deleted draft verification') {
  if (!draftVerificationEventId) {
    showToast('No draft verification ID found', 'error');
    return;
  }

  if (confirm('Are you sure you want to delete this draft verification? This action cannot be undone.')) {
    try {
      const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
      if (draftVerificationEvent) {
        await draftVerificationEvent.delete(reason, true);
      }

      showToast('Draft verification deleted successfully');

      if (moveToURL) {
        window.location.href = moveToURL;
      } else {
        window.location.reload();
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
}

const loadDraftVerificationsNotifications = async function () {
  const myPubkey = await getUserPubkey();
  if (!myPubkey) {
    console.error('No pubkey found');
    return;
  }

  let myDraftVerifications = [];

  for (const draftVerification of window.allAssetInformation.draftVerifications) {
    const arrayDraftVerificationEventsForThisSha256 = draftVerification[1];
    for (const draftVerificationEvent of arrayDraftVerificationEventsForThisSha256) {
      if (draftVerificationEvent.pubkey === myPubkey) {
        myDraftVerifications.push(draftVerificationEvent);
      }
    }
  }

  if (myDraftVerifications && myDraftVerifications.length > 0) {
    myDraftVerifications.forEach(verification => {
      const identifier = getFirstTagValue(verification, 'i', 'Unknown');
      const version = getFirstTagValue(verification, 'version', null);
      const wallet = window.wallets?.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;
      const status = getFirstTagValue(verification, 'status');
      const statusIcon = '<span title="' + getStatusText(status) + '" style="margin-left: 4px;">' + (status === 'reproducible' ? '✅' : '❌') + ` ${getStatusText(status, true)}</span>`;

      addNotificationToIndicator('Unpublished Verification',
        `${walletTitle} - ${version ? version+' -' : ''} ${formatDate(verification.created_at)} ${statusIcon}
        <br>
        <button class="edit-button" onclick="doDraftVerificationAction('${verification.id}', 'edit')">Edit</button>
        <button class="delete-button" onclick="doDraftVerificationAction('${verification.id}', 'delete')">Delete</button>`,'info')
    });
  }
}

function doDraftVerificationAction(draftVerificationEventId, action) {
  if (action === 'edit') {
    window.location.href = `/new_verification?draftVerificationEventId=${draftVerificationEventId}&action=${action}`;
  } else if (action === 'delete') {
    let goToURL = null;

    if (window.location.pathname.includes('new_verification')) {
      goToURL = '/assets/';
    }

    deleteDraftVerification(draftVerificationEventId, goToURL);
  }
}

// Helper to compare semantic versions like "1.2.3"
function compareVersions(a, b) {
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

function getMaxAssetVersion(getAllAssetInformationResult, appId = null) {
  // Check if getAllAssetInformationResult.verifications is defined
  if (!getAllAssetInformationResult.verifications) {
    throw new Error('getAllAssetInformationResult.verifications is not defined');
  }

  let maxVersion = null;
  let maxDate = null;
  let verifiedVersion = null;
  let verifiedDate = null;

  const allAssetArrays = [...getAllAssetInformationResult.verifications.values(), ...getAllAssetInformationResult.assets.values()];
  for (const assetArray of allAssetArrays) {
    for (const asset of assetArray) {
      const version = getFirstTagValue(asset, 'version');
      const appIdFromTag = getFirstTagValue(asset, 'i');
      if (version && (!appId || appIdFromTag === appId)) {
        if (!maxVersion || compareVersions(version, maxVersion) > 0) {
          maxVersion = version;
          maxDate = formatDate(asset.created_at, true);
        }

        const status = getFirstTagValue(asset, 'status');
        if (status === 'reproducible' && (!verifiedVersion || compareVersions(version, verifiedVersion) > 0)) {
          verifiedVersion = version;
          verifiedDate = formatDate(asset.created_at, true);
        }
      }
    }
  }

  return {
    lastVersion: maxVersion,
    lastVersionDate: maxDate,
    lastVerifiedVersion: verifiedVersion,
    lastVerifiedVersionDate: verifiedDate
  };
}

function getLastVerificationStatusForAppId(getAllAssetInformationResult, appId, platform) {
  let verification = null;
  let maxVersion = null;

  const allAssetArrays = [...getAllAssetInformationResult.verifications.values(), ...getAllAssetInformationResult.assets.values()];

  for (const assetArray of allAssetArrays) {
    for (const asset of assetArray) {
      const version = getFirstTagValue(asset, 'version', null);
      const appIdFromTag = getFirstTagValue(asset, 'i');
      const platformFromTag = getFirstTagValue(asset, 'platform');
      if (version && (appIdFromTag === appId) && (platformFromTag === platform)) {
        if (!maxVersion || compareVersions(version, maxVersion) > 0) {
          verification = asset;
          maxVersion = version;
        }
      }
    }
  }

  if (verification) {
    return getFirstTagValue(verification, 'status');
  }

  return null;
}

function getWeightForAppFromAssetInformation(appId) {
  if (!window.allAssetInformation) {
    throw new Error('window.allAssetInformation is not defined yet');
  }

  const { lastVersion, lastVersionDate, lastVerifiedVersion, lastVerifiedVersionDate } = getMaxAssetVersion(window.allAssetInformation, appId);

  let numberOfVerifications = 0;
  let numberOfReproducibleVerifications = 0;

  for (const verifications of window.allAssetInformation.verifications.values()) {
    for (const verification of verifications) {
      const appIdCurrentVerification = getFirstTagValue(verification, 'i');
      const status = getFirstTagValue(verification, 'status');

      if (appIdCurrentVerification === appId) {
        numberOfVerifications += 1;

        if (status === 'reproducible') {
          numberOfReproducibleVerifications += 1;
        }
      }
    }
  }

  let weight = numberOfReproducibleVerifications / numberOfVerifications;
  if (isNaN(weight)) {
    weight = 0;
  }

  return {
    weight,
    lastVersionVerified: (lastVerifiedVersion && (lastVerifiedVersion === lastVersion)) ? 1 : -1
  };
}

const cleanupNdkConnections = function() {
  if (ndk) {
    try {
      // Close all relay connections
      let closedConnections = 0;
      for (const relay of ndk.pool.relays.values()) {
        if (relay.connectivity.status === 5) { // Connected
          console.warn(`🔌 Closing relay connection: ${relay.url}`);
          relay.disconnect();
          closedConnections++;
        }
      }

      console.warn(`🔌 Closed ${closedConnections} relay connections`);

      // Clear the pool
      ndk.pool.relays.clear();
      console.warn("🧹 NDK pool cleared");
    } catch (error) {
      console.error("❌ Error during NDK cleanup:", error);
    }
    ndk = null;
    ndkConnectionPromise = null;
    console.warn("✅ NDK cleanup completed");
  }
};

/**
 * Creates and sends a zap using NDKZapper
 * @param {Object} params
 * @param {Object} params.event - Nostr event object
 * @param {number} params.amount - Amount in sats
 * @param {string} [params.comment] - Optional comment
 * @returns {Promise<void>} - Promise that resolves when the zap is sent
 */
const createZap = async function ({ event, amount, comment = '' }) {
  const profile = await getNostrProfile(event.pubkey);
  if (!profile || (!profile.lud16 && !profile.lud06)) {
    throw new Error('The user doesn\'t have a nostr profile or a LN address to receive sats');
  }

  const lnurlSpec = await getNip57ZapSpecFromLud({lud06: profile.lud06, lud16: profile.lud16}, ndk);

  if (!lnurlSpec) {
    throw new Error('The user doesn\'t have a LN address to receive sats');
  }

  const zapper = new NDKZapper(event, amount * 1000, "msat", {
    comment,
    ndk,
    signer: ndk.signer,
    tags: [
      ["p", event.pubkey],
      ["e", event.id]
    ],
  });

  const relays = await zapper.relays(event.pubkey);

  const zapRequestEvent = await generateZapRequest(
    event,
    ndk,
    lnurlSpec,
    event.pubkey,
    amount * 1000,
    relays,
    comment,
    zapper.tags
  ).catch((err) => {
    console.log('Error: An error occurred in generating zap request!', err);
    return null;
  });
  if (!zapRequestEvent) throw new Error('Failed to generate zap request');
  zapRequestEvent.content = comment;
  console.debug('createZap - zapRequestEvent', zapRequestEvent);

  // Removing these tags to be more like Primal, as that makes the Zaps
  // work correctly for WalletOfSatoshi, where they were failing previously.
  // Then, we re-add the tag e with value event.id.
  zapRequestEvent.tags = zapRequestEvent.tags.filter(tag => tag[0] !== 'lnurl');
  zapRequestEvent.tags = zapRequestEvent.tags.filter(tag => tag[0] !== 'a');
  zapRequestEvent.tags = zapRequestEvent.tags.filter(tag => tag[0] !== 'e');
  zapRequestEvent.tags.push(['e', event.id]);

  const invoice = await zapper.getLnInvoice(zapRequestEvent, amount * 1000, lnurlSpec).catch((err) => {
    console.log('Error: An error occurred in getting LnInvoice!', err);
    return null;
  });
  if (!invoice) throw new Error('Failed to get LNInvoice');
  console.debug('createZap - invoice', invoice);

  return invoice;
}

const subscribeToZapReceipts = async function(zapEvent, currentZapInvoice, receiptReceivedCallback) {
  try {
    let filter = {
      kinds: [9735],
      ["#e"]: [zapEvent.id]
    }
    const sub = ndk.subscribe(filter);

    sub?.on("event", async (event) => {
      console.debug('subscribeToZapReceipts - Zap receipt event received:', event);
      if (currentZapInvoice) {
        if (event.tagValue("bolt11") === currentZapInvoice) {
          sub.stop()  // Only one zap receipt is expected, so close the subscription after receiving it
        } else {
          console.debug('    - subscribeToZapReceipts - a zap invoice was received that is not the current zap invoice we are waiting for, so skipping it');
          return;
        }
      }
      const zapReceiptInvoice = event.tagValue("bolt11")
      console.debug('    - subscribeToZapReceipts - zapReceiptInvoice', zapReceiptInvoice, 'currentZapInvoice', currentZapInvoice);
      if (zapReceiptInvoice) {
        const decodedInvoice = decode(zapReceiptInvoice)
        console.debug('    - subscribeToZapReceipts - decodedInvoice', decodedInvoice);
        const zapRequest = zapInvoiceFromEvent(event)
        event.zapRequest = zapRequest;
        console.debug('    - zapRequest (zapInvoiceFromEvent)', zapRequest);

        const amountSection = decodedInvoice.sections.find(
          (section) => section.name === "amount"
        )

        const amountPaid =
          amountSection && "value" in amountSection
            ? Math.floor(parseInt(amountSection.value) / 1000)
            : 0
        const amountRequested = zapRequest?.amount ? zapRequest.amount / 1000 : -1

        if (amountPaid === amountRequested) {
          receiptReceivedCallback(event);
          return;
        }

        receiptReceivedCallback(null);
      }
    })
  } catch (error) {
    console.warn("Unable to fetch zap receipt", error)
  }
}

const getNostrProfileEventFromProfileInfo = async function(profileInfo) {
  const profileEvent = JSON.parse(profileInfo.profileEvent);
  const ndkEvent = new NDKEvent(ndk, profileEvent);
  return ndkEvent;
}

if (typeof window !== 'undefined') {
  window.DOMPurify = DOMPurify;
  window.nostrConnect = nostrConnect;
  window.createAssetRegistration = createAssetRegistration;
  window.createVerification = createVerification;
  window.createEndorsement = createEndorsement;
  window.createNostrNote = createNostrNote;
  window.getNostrProfile = getNostrProfile;
  window.getAllAssetInformation = getAllAssetInformation;
  window.backgroundSyncEvents = backgroundSyncEvents;
  window.verificationKind = verificationKind;
  window.getUserPubkey = getUserPubkey;
  window.showToast = showToast;
  window.getNpubFromPubkey = getNpubFromPubkey;
  window.setupAppIdAutocomplete = setupAppIdAutocomplete;
  window.getAppInfoFromEventInfo = getAppInfoFromEventInfo;
  window.nip19 = nip19;
  window.purifyConfig = purifyConfig;
  window.getStatusText = getStatusText;
  window.loadDraftVerificationsNotifications = loadDraftVerificationsNotifications;
  window.doDraftVerificationAction = doDraftVerificationAction;
  window.getVerificationEvent = getVerificationEvent;
  window.deleteDraftVerification = deleteDraftVerification;
  window.getFileAttachmentIDsForVerificationEvent = getFileAttachmentIDsForVerificationEvent;
  window.uploadFileAttachment = uploadFileAttachment;
  window.getEventsFromEventIds = getEventsFromEventIds;
  window.getAllAttachmentsForAppId = getAllAttachmentsForAppId;
  window.getMaxAssetVersion = getMaxAssetVersion;
  window.getLastVerificationStatusForAppId = getLastVerificationStatusForAppId;
  window.getWeightForAppFromAssetInformation = getWeightForAppFromAssetInformation;
  window.cleanupNdkConnections = cleanupNdkConnections;
  window.createNostrCommentToVerification = createNostrCommentToVerification;
  window.getCommentsForVerification = getCommentsForVerification;
  window.sendPrivateMessageToVerifier = sendPrivateMessageToVerifier;
  window.getEndorsementsFromVerificationEventIds = getEndorsementsFromVerificationEventIds;
  window.createZap = createZap;
  window.getNostrProfileEventFromProfileInfo = getNostrProfileEventFromProfileInfo;
  window.subscribeToZapReceipts = subscribeToZapReceipts;

  window.addEventListener('beforeunload', () => {
    cleanupNdkConnections();
  });
}

export {
  nostrConnect,
  createAssetRegistration,
  createVerification,
  createEndorsement,
  createNostrNote,
  getNostrProfile,
  getAllAssetInformation,
  getUserPubkey,
  showToast,
  getNpubFromPubkey,
  setupAppIdAutocomplete,
  getAppInfoFromEventInfo,
  nip19,
  purifyConfig,
  getStatusText,
  loadDraftVerificationsNotifications,
  doDraftVerificationAction,
  getVerificationEvent,
  deleteDraftVerification,
  getFileAttachmentIDsForVerificationEvent,
  uploadFileAttachment,
  getEventsFromEventIds,
  getAllAttachmentsForAppId,
  getMaxAssetVersion,
  createNostrCommentToVerification,
  getCommentsForVerification,
  sendPrivateMessageToVerifier,
  getEndorsementsFromVerificationEventIds,
  createZap,
  subscribeToZapReceipts
};
