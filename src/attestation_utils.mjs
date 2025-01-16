import NDK, {NDKEvent, NDKNip07Signer, NDKPrivateKeySigner, NDKPublishError} from "@nostr-dev-kit/ndk";
import { assetRegistrationKind, attestationKind, endorsementKind, explicitRelayUrls } from "./nostr-constants.mjs";
import WebSocket from "ws";
if (typeof global !== 'undefined') {
  global.WebSocket = WebSocket; // Make WebSocket available globally as NDK expects it
}

let ndk;

const connectTimeout = 2000;

const nostrConnect = async function (nostrPrivateKey) {
  let signer;

  if (await userHasBrowserExtension()) {
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

const validateSHA256 = function(sha256) {
  if (!sha256 || !/^[0-9a-f]{64}$/i.test(sha256)) {
    throw new Error("Invalid SHA256 hash: must be a 64-character hexadecimal string");
  }
}

const validateUrl = function(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    throw new Error("Invalid URL format");
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

const createAssetRegistration = async function ({
  sha256,
  appId,
  url,
  version,
  platform,
  name
}) {
  validateSHA256(sha256);
  if (url) {
    validateUrl(url);
  }

  if (!appId || !version || !name) {
    throw new Error("Missing required parameters");
  }

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = assetRegistrationKind;
  ndkEvent.content = name;
  ndkEvent.tags = [
    ["x", sha256],
    ["ox", sha256],
    ["i", appId],
    ["url", url ?? ''],
    ["version", version],
    ["platform", platform ?? '']
  ];

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

const createAttestation = async function ({sha256, content, status, assetEventId}) {
  console.debug("Creating attestation for asset: ", assetEventId);

  validateSHA256(sha256);

  if (!content || !status || !assetEventId) {
    throw new Error("Missing required parameters");
  }

  if (!['reproducible', 'not_reproducible', 'ftbfs'].includes(status)) {
    throw new Error("Invalid status");
  }

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = attestationKind;
  ndkEvent.content = content;

  ndkEvent.tags = [
    ["x", sha256],
    ["status", status]
  ];

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.log(`published attestation to ${publishedToRelays.size} relays`);
    return ndkEvent;
  } catch (error) {
    console.error("error publishing attestation to relays", error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }

    throw error;
  }
}

const createEndorsement = async function ({sha256, content, status, attestationEventId}) {
  console.debug("Creating endorsement for attestation: ", attestationEventId);

  validateSHA256(sha256);

  if (!content || !status || !attestationEventId) {
    throw new Error("Missing required parameters");
  }

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = endorsementKind;
  ndkEvent.content = content;

  ndkEvent.tags = [
    ["x", sha256],
    ["d", attestationEventId],
    ["status", status]
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

const getAssetsWithSHA256 = async function (sha256) {
  console.debug("Getting assets for: ", sha256);

  const assets = await ndk.fetchEvents({
    kinds: [assetRegistrationKind],
    "#x": [sha256]
  });

  for (const asset of assets) {
    console.debug(asset.rawEvent());
  }
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

const getAllAssetInformation = async function({ months, assetsPubkey, attestationsPubkey, appId, sha256, getAssetsForMyAttestations }) {
  // Filter Assets
  const filter_assets = {
    kinds: [assetRegistrationKind],
  };
  if (months) {
    console.debug(`Getting events from last ${months} months`);
    filter_assets.since = getTimestampMonthsAgo(months);
  }
  if (assetsPubkey) {
    filter_assets.authors = [assetsPubkey];
  }
  if (appId) {
    filter_assets["#i"] = [appId];
  }
  if (sha256) {
    filter_assets["#x"] = [sha256];
  }

  // Filter Attestations + Endorsements
  const filter_attestations = {
    kinds: [attestationKind, endorsementKind],
  }
  if (months) {
    filter_attestations.since = getTimestampMonthsAgo(months);
  }
  if (attestationsPubkey) {
    filter_attestations.authors = [attestationsPubkey];
  }
  if (sha256) {
    filter_attestations["#x"] = [sha256];
  }

  const events = await ndk.fetchEvents([filter_assets, filter_attestations]);

  const assets = Array.from(events).filter(event => event.kind === assetRegistrationKind);
  const attestations = Array.from(events).filter(event => event.kind === attestationKind);
  const endorsements = Array.from(events).filter(event => event.kind === endorsementKind);

  const attestationsMap = new Map();
  const endorsementsMap = new Map();
  
  attestations.forEach(attestation => {
    const sha256 = getFirstTag(attestation, 'x');
    if (sha256) {
      if (!attestationsMap.has(sha256)) {
        attestationsMap.set(sha256, []);
      }
      attestationsMap.get(sha256).push(attestation);
    }
  });

  endorsements.forEach(endorsement => {
    const attestationEventId = getFirstTag(endorsement, 'd');
    if (attestationEventId) {
      if (!endorsementsMap.has(attestationEventId)) {
        endorsementsMap.set(attestationEventId, []);
      }
      endorsementsMap.get(attestationEventId).push(endorsement);
    }
  });

  if (getAssetsForMyAttestations) {
    // Iterates over all the attestations. For the ones matching the pubkey, check
    // if the asset they're referring to is already loaded. If it isn't, load those
    // assets from Nostr in a second step.

    const attestedAssetsToBeRequestedSet = new Set();
    const sha256OfAssetsAlreadyLoadedSet = new Set(assets.map(asset => getFirstTag(asset, 'x')));
    
    attestationsMap.forEach((attestations, sha256) => {
      attestations.forEach(attestation => {
        if (attestation.pubkey === assetsPubkey) {
          if (!sha256OfAssetsAlreadyLoadedSet.has(sha256)) {
            attestedAssetsToBeRequestedSet.add(sha256);
          }
        }
      });
    });

    if (attestedAssetsToBeRequestedSet.size > 0) {
      const extraAssetsToRequest = await ndk.fetchEvents({
        kinds: [assetRegistrationKind],
        "#x": Array.from(attestedAssetsToBeRequestedSet)
      });
      assets.push(...Array.from(extraAssetsToRequest));
    }
  }

  return {
    assets: assets,
    attestations: attestationsMap,
    endorsements: endorsementsMap
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
      duration = 5000;
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
    toast.textContent = message;
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

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.debug(`published note to ${publishedToRelays.size} relays`);
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

if (typeof window !== 'undefined') {
  window.nostrConnect = nostrConnect;
  window.createAssetRegistration = createAssetRegistration;
  window.createAttestation = createAttestation;
  window.createEndorsement = createEndorsement;
  window.createNostrNote = createNostrNote;
  window.getNostrProfile = getNostrProfile;
  window.getAssetsWithSHA256 = getAssetsWithSHA256;
  window.getAllAssetInformation = getAllAssetInformation;
  window.getFirstTag = getFirstTag;
  window.getUserPubkey = getUserPubkey;
  window.userHasBrowserExtension = userHasBrowserExtension;
  window.showToast = showToast;
  window.getNpubFromPubkey = getNpubFromPubkey;
}

export {
  nostrConnect,
  createAssetRegistration,
  createAttestation,
  createEndorsement,
  createNostrNote,
  getNostrProfile,
  getAssetsWithSHA256,
  getAllAssetInformation,
  getFirstTag,
  getUserPubkey,
  userHasBrowserExtension,
  showToast,
  getNpubFromPubkey
};
