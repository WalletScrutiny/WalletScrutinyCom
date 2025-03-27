import NDK, {NDKEvent, NDKNip07Signer, NDKPrivateKeySigner, NDKPublishError} from "@nostr-dev-kit/ndk";
import { nip19 } from 'nostr-tools';
import DOMPurify from 'dompurify';
import {
  assetRegistrationKind,
  verificationKind,
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
  ALLOWED_TAGS: [], // No HTML tags allowed
  ALLOWED_ATTR: [], // No attributes allowed
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  RETURN_TRUSTED_TYPE: false
};

let ndk;

const connectTimeout = 2000;

const nostrConnect = async function (nostrPrivateKey) {
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
  } catch (e) {
    console.error("ndk connect failed", e);

    if (hasBrowserExtension) {
      console.log("Trying to connect again without using a signer");
      ndk.signer = null;
      await ndk.connect(connectTimeout);
      return;
    }

    throw e;
  }
}

const getUserPubkey = async function() {
  const signer = await nip07signer.user();
  return signer.pubkey;
}

const userHasBrowserExtension = function() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
    }
    if (window.nostr) {
      resolve(true);
    }

    // Wait a bit for the extension to load
    setTimeout(() => {
      console.debug("Browser extension:", Boolean(window.nostr));
      resolve(Boolean(window.nostr));
    }, 100);
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
  const user = ndk.getUser({ pubkey });
  return await user.fetchProfile();
}

const getNpubFromPubkey = function (pubkey) {
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
  validateSHA256([sha256]);

  if (!appId || !version || !description) {
    throw new Error("Missing required parameters");
  }

  // Limit length of parameters
  if (appId && appId.length > 50) {
    throw new Error("App ID must be 50 characters or less");
  }
  if (version && version.length > 15) {
    throw new Error("Version must be 15 characters or less");
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
                                             createdAt = null
                                           }) {
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
  if (version && version.length > 15) {
    throw new Error("Version must be 15 characters or less");
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

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = verificationKind;
  ndkEvent.created_at = getCreatedAt(createdAt);
  ndkEvent.content = JSON.stringify({
    description: description || '',
    content: content,
  });

  ndkEvent.tags = [
    ["status", status],
    getWSClientTag()
  ];

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

  eventSanitize(ndkEvent);

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.log(`published verification to ${publishedToRelays.size} relays`);
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
      sanitizedTag = sanitizedTag.substring(0, 15);
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

const getAllAssetInformation = async function({
                                                months,
                                                pubkey,
                                                appId,
                                                sha256
                                              }) {
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
    kinds: [verificationKind],  // TODO: Add endorsementKind
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

  const assets = Array.from(events).filter(event => event.kind === assetRegistrationKind);
  const verifications = Array.from(events).filter(event => event.kind === verificationKind);
  //const endorsements = Array.from(events).filter(event => event.kind === endorsementKind);

  const assetsMap = new Map();
  const verificationsMap = new Map();
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

function isDebug() {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.location.hostname.includes('localhost') || window.location.hostname.includes('beta') || window.location.hostname.includes('old');
}

if (typeof window !== 'undefined') {
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
  isDebug
};
