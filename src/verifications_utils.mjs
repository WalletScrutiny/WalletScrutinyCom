import NDK, {NDKEvent, NDKNip07Signer, NDKPrivateKeySigner, NDKPublishError} from "@nostr-dev-kit/ndk";
import { nip19 } from 'nostr-tools';
import DOMPurify from 'dompurify';
import {
  assetRegistrationKind,
  verificationKind,
  verificationDraftKind,
  codeSnippetKind,
  endorsementKind,
  explicitRelayUrls,
  verificationEventsSinceTS,
  mainRelayUrl,
  nip89ClientTagD,
  wsBotPublicKey
} from "./nostr-constants.mjs";
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

const connectTimeout = 2000;

const nostrConnect = function (nostrPrivateKey) {
  // Assign the connection logic to the promise immediately
  ndkConnectionPromise = (async () => {
    let signer;
    let hasBrowserExtension = await userHasBrowserExtension();

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

const userHasBrowserExtension = function() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    if (window.nostr) {
      resolve(true);
      return;
    }

    // Retry system: 20 attempts every 20ms
    let attempts = 0;
    const maxAttempts = 20;
    const retryDelay = 20;

    const checkExtension = () => {
      attempts++;
      
      if (window.nostr) {
        console.debug("Browser extension found on attempt:", attempts);
        resolve(true);
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.debug("Browser extension not found after", maxAttempts, "attempts");
        resolve(false);
        return;
      }
      
      // Schedule next attempt
      setTimeout(checkExtension, retryDelay);
    };

    // Start the retry process
    setTimeout(checkExtension, retryDelay);
  });
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

const getNostrProfile = async function (pubkey) {
  if (!pubkey) {
    return null;
  }

  const cacheKey = 'profile-' + pubkey;

  const profileFromCache = getCachedResultIfNotExpired(cacheKey);
  if (profileFromCache) {
    return profileFromCache;
  }

  await ensureNdkConnected();
  const user = ndk.getUser({ pubkey });
  const profile = await user.fetchProfile();
  setCache(cacheKey, profile);
  return profile;
}

const getNpubFromPubkey = async function (pubkey) {
  await ensureNdkConnected();
  const user = ndk.getUser({ pubkey });
  return user.npub;
}

const getWSClientTag = function() {
  return ["client", "WalletScrutiny.com", `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl];
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

  // Limit length of parameters
  if (appId && appId.length > 50) {
    throw new Error("App ID must be 50 characters or less");
  }
  if (version && version.length > 30) {
    throw new Error("Version must be 30 characters or less");
  }
  if (platform && platform.length > 10) {
    throw new Error("Platform must be 10 characters or less");
  }
  if (description && description.length > 120) {
    throw new Error("Description must be 120 characters or less");
  }

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = assetRegistrationKind;
  ndkEvent.content = description;
  ndkEvent.created_at = getCreatedAt(createdAt);
  ndkEvent.tags = [
    ["x", sha256],
    ["ox", sha256],
    ["i", appId],
    ["version", version],
    getWSClientTag()
  ];
  if (platform) {
    ndkEvent.tags.push(["platform", platform]);
  }

  eventSanitize(ndkEvent);

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.log(`published to ${publishedToRelays.size} relays`)
    return ndkEvent;
  } catch (error) {
    console.error("error publishing to relays", error);

    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }

    throw error;
  }
}

const createVerification = async function ({
                                             hashes,
                                             description,
                                             content,
                                             status,
                                             appId,
                                             version,
                                             platform,
                                             createdAt = null,
                                             isDraft = false,
                                             draftVerificationEventId = null,
                                             uploadedFileData = [],
                                             reusedFileIds = [],
                                             outputFiles = []
                                           }) {
  await ensureNdkConnected();
  validateSHA256(hashes);

  if (!content || !status) {
    throw new Error("Missing required parameters");
  }

  if (!['reproducible', 'not_reproducible', 'ftbfs', 'spam', 'notag', 'nosource', 'warning', 'obfuscated'].includes(status)) {
    throw new Error("Invalid status");
  }

  // Limit length of parameters
  if (appId && appId.length > 50) {
    throw new Error("App ID must be 50 characters or less");
  }
  if (version && version.length > 30) {
    throw new Error("Version must be 30 characters or less");
  }
  if (platform && platform.length > 10) {
    throw new Error("Platform must be 10 characters or less");
  }
  if (description && description.length > 120) {
    throw new Error("Description must be 120 characters or less");
  }
  if (content && content.length > 60000) {
    throw new Error("Content must be 60000 characters or less");
  }

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

    // Handle potential upload failures (optional: decide if this should halt verification creation)
    const failedUploads = fileUploadResults.filter(r => !r.success);
    if (failedUploads.length > 0) {
      console.error("Some file uploads failed:", failedUploads);
      // Decide whether to throw an error or just log it
      // For now, let's throw an error if any upload fails
      throw new Error(`Failed to upload file(s): ${failedUploads.map(f => f.fileName).join(', ')}`);
    }
  }
  // --- End File Upload ---

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = isDraft ? verificationDraftKind : verificationKind;
  ndkEvent.created_at = getCreatedAt(createdAt);
  ndkEvent.content = JSON.stringify({
    description: description || '',
    content: content,
  });

  ndkEvent.tags = [
    ["status", status],
    getWSClientTag()
  ];

  if (isDraft) {
    let draftKey = '';

    if (appId) {
      draftKey += `${appId}:`;
    }

    draftKey += `${version}:${platform}`;

    ndkEvent.tags.push(["d", draftKey]);
  }

  if (appId) {
    ndkEvent.tags.push(["i", appId]);
  }
  if (version) {
    ndkEvent.tags.push(["version", version]);
  }
  if (platform) {
    ndkEvent.tags.push(["platform", platform]);
  }
  hashes.forEach(hash => {
    ndkEvent.tags.push(["x", hash]);
  });

  // Add file event IDs as tags if any files were successfully uploaded
  if (fileEventIds.length > 0) {
    fileEventIds.forEach(fileEventId => {
      ndkEvent.tags.push(["file-attachment", fileEventId]);
    });
  }
  if (reusedFileIds.length > 0) {
    reusedFileIds.forEach(fileEventId => {
      ndkEvent.tags.push(["file-attachment", fileEventId]);
    });
  }

  if (outputFiles.length > 0) {
    outputFiles.forEach(file => {
      ndkEvent.tags.push(["output-file", file.name, file.hash]);
    });
  }

  eventSanitize(ndkEvent); // Sanitize main event

  let mainEventId;

  try {
    const publishedToRelays = await ndkEvent.publish();
    mainEventId = ndkEvent.id; // Get the ID of the published event
    console.log(`Published verification (id: ${mainEventId}) to ${publishedToRelays.size} relays`);

    if (!isDraft && draftVerificationEventId) {
      const draftVerificationEvent = await getDraftVerificationEvent(draftVerificationEventId);
      if (draftVerificationEvent) {
        await draftVerificationEvent.delete('deleting draft, as verification was published', true);
      }
    }

    return ndkEvent;

  } catch (error) {
    console.error("error publishing verification to relays", error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }

    throw error;
  }
}

const createEndorsement = async function ({sha256, content, status, verificationEventId, createdAt = null}) {
  await ensureNdkConnected();
  console.debug("Creating endorsement for verification: ", verificationEventId);

  validateSHA256([sha256]);

  if (!content || !status || !verificationEventId) {
    throw new Error("Missing required parameters");
  }

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = endorsementKind;
  ndkEvent.content = content;
  ndkEvent.created_at = getCreatedAt(createdAt);
  ndkEvent.tags = [
    ["x", sha256],
    ["d", verificationEventId],
    ["status", status],
    getWSClientTag()
  ];

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.log(`published endorsement to ${publishedToRelays.size} relays`);
  } catch (error) {
    console.error("error publishing endorsement to relays", error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }

    throw error;
  }
}

function getCreatedAt(createdAt) {
  return createdAt ? Math.floor(new Date(createdAt).getTime() / 1000) : Math.floor(new Date().getTime() / 1000);
}

function getFirstTag(event, tagName) {
  const tags = event.getMatchingTags(tagName);
  return tags.length === 0 ? "" : tags[0][1];
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

function eventSanitize(event) {
  const isBrowser = typeof window !== 'undefined';

  // Sanitize content
  if (isValidJSONObject(event.content)) {
    const contentObject = JSON.parse(event.content);

    Object.keys(contentObject).forEach(key => {
      let sanitizedContent = isBrowser ? DOMPurify.sanitize(contentObject[key], purifyConfig) : contentObject[key];

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
      sanitizedTag = sanitizedTag.substring(0, 50);
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

const getFirstValueFromTag = function(event, tagName) {
  const tags = event.getMatchingTags(tagName);
  return tags.length === 0 ? null : tags[0][1];
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

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = codeSnippetKind;
  ndkEvent.content = base64Data;
  ndkEvent.created_at = getCreatedAt();
  ndkEvent.tags = [
    ["name", name],
    ["extension", extension],
    ["content-type", fileType],
    ["size", fileSize.toString()],
    getWSClientTag()
  ];

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.log(`Uploaded file ${fileName} (${fileSize} bytes) to ${publishedToRelays.size} relays`);
    return { success: true, eventId: ndkEvent.id, fileName: fileName };
  } catch (error) {
    console.error(`Error uploading file ${fileName} to relays`, error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`Error publishing file to relay ${relay.url}`, err);
      }
    }
    return { success: false, error: error, fileName: fileName };
  }
}

const getFileAttachmentEvents = async function(fileEventIds) {
  await ensureNdkConnected();

  if (!fileEventIds || fileEventIds.length === 0) {
    console.debug(`No file-event tags found on verification event ${fileEventIds}.`);
    return [];
  }

  console.debug(`Fetching ${fileEventIds.length} file attachments: ${fileEventIds.join(', ')}`);

  return await ndk.fetchEvents({
    kinds: [assetRegistrationKind, codeSnippetKind],  // See https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/729
    ids: fileEventIds
  });
}

const getAllAttachmentsForAppId = async function(appId) {
  const response = await getAllAssetInformation({
    appId
  });

  const attachments = [];
  const promises = [];

  for (const sha256VerificationGroup of response.verifications.values()) {
    for (const verification of sha256VerificationGroup) {
      const fileEventIds = getFileAttachmentIDsForVerificationEvent(verification);
      if (fileEventIds.length > 0) {
        promises.push(
          getFileAttachmentEvents(fileEventIds).then(fileAttachmentEvents => {
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

const getAllAssetInformation = async function({
                                                months,
                                                pubkey,
                                                appId,
                                                sha256
                                              }) {
  await ensureNdkConnected();
  console.time('getAllAssetInformation');
  const filter_assets = {
    kinds: [assetRegistrationKind],
  };
  if (months) {
    console.debug(`Getting events from last ${months} months`);
    filter_assets.since = getTimestampMonthsAgo(months);
  } else {
    console.debug(`Getting events from ${verificationEventsSinceTS} onwards`);
    filter_assets.since = verificationEventsSinceTS;
  }
  if (pubkey) {
    filter_assets.authors = [pubkey];
  }
  if (appId) {
    filter_assets["#i"] = Array.isArray(appId) ? appId : [appId];
  }
  if (sha256) {
    filter_assets["#x"] = [sha256];
  }


  const filter_verifications = {
    kinds: [verificationKind, verificationDraftKind],  // TODO: Add endorsementKind
  }
  if (months) {
    filter_verifications.since = getTimestampMonthsAgo(months);
  } else {
    filter_verifications.since = verificationEventsSinceTS;
  }
  if (pubkey) {
    filter_verifications.authors = [pubkey];
  }
  if (appId) {
    filter_verifications["#i"] = Array.isArray(appId) ? appId : [appId];
  }
  if (sha256) {
    filter_verifications["#x"] = [sha256];
  }

  const events = await ndk.fetchEvents([filter_assets, filter_verifications]);

  events.forEach(event => {
    eventSanitize(event);
  });

  const assets = Array.from(events).filter(event => event.kind === assetRegistrationKind && getFirstValueFromTag(event, 'client') === 'WalletScrutiny.com');
  const verifications = Array.from(events).filter(event => event.kind === verificationKind && getFirstValueFromTag(event, 'client') === 'WalletScrutiny.com');
  const draftVerifications = Array.from(events).filter(event => event.kind === verificationDraftKind && getFirstValueFromTag(event, 'client') === 'WalletScrutiny.com');
  //const endorsements = Array.from(events).filter(event => event.kind === endorsementKind);

  const assetsMap = new Map();
  const verificationsMap = new Map();
  const draftVerificationsMap = new Map();
  const endorsementsMap = new Map();

  assets.forEach(asset => {
    const sha256FromEventTag = getFirstTag(asset, 'x');
    if (sha256FromEventTag) {
      if (!assetsMap.has(sha256FromEventTag)) {
        assetsMap.set(sha256FromEventTag, []);
      }
      assetsMap.get(sha256FromEventTag).push(asset);
    }
  });

  verifications.forEach(verification => {
    const sha256FromEventTag = getFirstTag(verification, 'x');
    if (sha256FromEventTag) {
      if (!verificationsMap.has(sha256FromEventTag)) {
        verificationsMap.set(sha256FromEventTag, []);
      }
      verificationsMap.get(sha256FromEventTag).push(verification);
    }
  });

  draftVerifications.forEach(draftVerification => {
    const sha256FromEventTag = getFirstTag(draftVerification, 'x');
    if (sha256FromEventTag) {
      if (!draftVerificationsMap.has(sha256FromEventTag)) {
        draftVerificationsMap.set(sha256FromEventTag, []);
      }
      draftVerificationsMap.get(sha256FromEventTag).push(draftVerification);
    }
  });

  /*
  endorsements.forEach(endorsement => {
    const verificationEventId = getFirstTag(endorsement, 'd');
    if (verificationEventId) {
      if (!endorsementsMap.has(verificationEventId)) {
        endorsementsMap.set(verificationEventId, []);
      }
      endorsementsMap.get(verificationEventId).push(endorsement);
    }
  });
  */

  console.timeEnd('getAllAssetInformation');

  return {
    assets: assetsMap,
    verifications: verificationsMap,
    draftVerifications: draftVerificationsMap,
    endorsements: endorsementsMap
  };
}

function getAppInfoFromEventInfo(eventInfo) {
  const isAsset = eventInfo.kind === assetRegistrationKind;

  const createdAt = eventInfo.created_at;
  const description = isAsset ? '' : JSON.parse(eventInfo.content).description;
  const content = isAsset ? eventInfo.content : JSON.parse(eventInfo.content).content;
  const appId = eventInfo.tags.find(tag => tag[0] === 'i')?.[1];
  const version = eventInfo.tags.find(tag => tag[0] === 'version')?.[1];
  const platform = eventInfo.tags.find(tag => tag[0] === 'platform')?.[1];
  const status = eventInfo.tags.find(tag => tag[0] === 'status')?.[1];
  const url = eventInfo.tags.find(tag => tag[0] === 'url')?.[1];
  const gitRevision = eventInfo.tags.find(tag => tag[0] === 'git_revision')?.[1];
  const appHashes = eventInfo.tags.filter(tag => tag[0] === 'x').map(tag => tag[1]);

  return { isAsset, appId, version, createdAt, description, content, platform, status, url, gitRevision, appHashes };
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

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = 1;
  ndkEvent.content = message;
  ndkEvent.tags = [
    getWSClientTag()
  ];

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.debug(`published note to ${publishedToRelays.size} relays`);
    return ndkEvent.id;
  } catch (error) {
    console.error("error publishing note to relays", error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }
    throw error;
  }
}

function setupAppIdAutocomplete() {
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
      suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.style.display = 'block';
  }

  appIdInput.addEventListener('input', (e) => {
    const searchText = e.target.value;
    const filteredWallets = filterWallets(searchText);
    showSuggestions(filteredWallets);
  });

  document.addEventListener('click', (e) => {
    if (!appIdInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.style.display = 'none';
    }
  });
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

const getDraftVerificationEvent = async function(draftVerificationEventId) {
  await ensureNdkConnected();
  return await ndk.fetchEvent(draftVerificationEventId);
}

const deleteDraftVerification = async function(draftVerificationEventId, moveToURL = null, reason = 'user deleted draft verification') {
  if (!draftVerificationEventId) {
    showToast('No draft verification ID found', 'error');
    return;
  }

  if (confirm('Are you sure you want to delete this draft verification? This action cannot be undone.')) {
    try {
      const draftVerificationEvent = await getDraftVerificationEvent(draftVerificationEventId);
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
      const identifier = verification.tags?.find(tag => tag[0] === 'i')?.[1];
      const version = verification.tags?.find(tag => tag[0] === 'version')?.[1];
      const wallet = window.wallets?.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier ?? 'Unknown';

      const verificationDate = new Date(verification.created_at * 1000).toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const status = verification.tags.find(tag => tag[0] === 'status')?.[1] || '';
      const statusIcon = '<span title="' + getStatusText(status) + '" style="margin-left: 4px;">' + (status === 'reproducible' ? '✅' : '❌') + ` ${getStatusText(status, true)}</span>`;

      addNotificationToIndicator('Unpublished Verification',
        `${walletTitle} - ${version ? version+' -' : ''} ${verificationDate} ${statusIcon}
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
      const versionTag = asset.tags.find(tag => tag[0] === 'version');
      const appIdTag = asset.tags.find(tag => tag[0] === 'i');
      if (versionTag && (!appId || appIdTag[1] === appId)) {
        const version = versionTag[1];
        if (!maxVersion || compareVersions(version, maxVersion) > 0) {
          maxVersion = version;
          maxDate = new Date(asset.created_at * 1000).toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }

        const verifiedVersionTag = asset.tags.find(tag => tag[0] === 'status' && tag[1] === 'reproducible');
        if (verifiedVersionTag && (!verifiedVersion || compareVersions(version, verifiedVersion) > 0)) {
          verifiedVersion = version;
          verifiedDate = new Date(asset.created_at * 1000).toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
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
      const version = asset.tags.find(tag => tag[0] === 'version')?.[1];
      const appIdTag = asset.tags.find(tag => tag[0] === 'i')?.[1];
      const platformTag = asset.tags.find(tag => tag[0] === 'platform')?.[1];
      if (version && (appIdTag === appId) && (platformTag === platform)) {
        if (!maxVersion || compareVersions(version, maxVersion) > 0) {
          verification = asset;
          maxVersion = version;
        }
      }
    }
  }

  if (verification) {
    return verification.tags.find(tag => tag[0] === 'status')?.[1];
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
      const appIdCurrentVerification = verification.tags.find(tag => tag[0] === 'i')?.[1];
      const status = verification.tags.find(tag => tag[0] === 'status')?.[1];

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

////////////////////////////////////////////////////////////////////
// CACHE FUNCTIONS
////////////////////////////////////////////////////////////////////

function getCache(key) {
  try {
    const cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : {};
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

function setCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({
      value: value,
      timestamp: Date.now()
    }));
  } catch (error) {
      console.error('Error writing to cache:', error);
  }
}

function getCachedResultIfNotExpired(key) {
  const CACHE_EXPIRATION_TIME = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  const cache = getCache(key);
    
  if (cache) {
      const isExpired = Date.now() - cache.timestamp > CACHE_EXPIRATION_TIME;
      if (!isExpired) {
          return cache.value;
      }
  }

  return null;
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
  window.getFirstTag = getFirstTag;
  window.getUserPubkey = getUserPubkey;
  window.userHasBrowserExtension = userHasBrowserExtension;
  window.showToast = showToast;
  window.getNpubFromPubkey = getNpubFromPubkey;
  window.setupAppIdAutocomplete = setupAppIdAutocomplete;
  window.getAppInfoFromEventInfo = getAppInfoFromEventInfo;
  window.nip19 = nip19;
  window.purifyConfig = purifyConfig;
  window.getStatusText = getStatusText;
  window.loadDraftVerificationsNotifications = loadDraftVerificationsNotifications;
  window.doDraftVerificationAction = doDraftVerificationAction;
  window.getDraftVerificationEvent = getDraftVerificationEvent;
  window.deleteDraftVerification = deleteDraftVerification;
  window.getFileAttachmentIDsForVerificationEvent = getFileAttachmentIDsForVerificationEvent;
  window.uploadFileAttachment = uploadFileAttachment;
  window.getFileAttachmentEvents = getFileAttachmentEvents;
  window.getAllAttachmentsForAppId = getAllAttachmentsForAppId;
  window.getMaxAssetVersion = getMaxAssetVersion;
  window.getLastVerificationStatusForAppId = getLastVerificationStatusForAppId;
  window.getWeightForAppFromAssetInformation = getWeightForAppFromAssetInformation;
}

export {
  nostrConnect,
  createAssetRegistration,
  createVerification,
  createEndorsement,
  createNostrNote,
  getNostrProfile,
  getAllAssetInformation,
  getFirstTag,
  getUserPubkey,
  userHasBrowserExtension,
  showToast,
  getNpubFromPubkey,
  setupAppIdAutocomplete,
  getAppInfoFromEventInfo,
  nip19,
  purifyConfig,
  getStatusText,
  loadDraftVerificationsNotifications,
  doDraftVerificationAction,
  getDraftVerificationEvent,
  deleteDraftVerification,
  getFirstValueFromTag,
  getFileAttachmentIDsForVerificationEvent,
  uploadFileAttachment,
  getFileAttachmentEvents,
  getAllAttachmentsForAppId,
  getMaxAssetVersion
};
