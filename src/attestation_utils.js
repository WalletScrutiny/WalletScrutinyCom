import NDK, {NDKEvent, NDKNip07Signer, NDKPublishError} from "@nostr-dev-kit/ndk";

const assetRegistrationKind = 106300; // 1063
const attestationKind = 303010; // 30301
const endorsementKind = 303020; // 30302

const connectTimeout = 2000;

const nip07signer = new NDKNip07Signer();
const ndk = new NDK({
  explicitRelayUrls: [
    "wss://relay.zapstore.dev",
    "wss://relay.primal.net/",
    "wss://relay.damus.io",
    "wss://relay.nostr.net"
  ],
  signer: nip07signer
});

const validateSHA256 = function(sha256) {
  if (!sha256 || typeof sha256 !== 'string' || sha256.length !== 64) {
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
  await user.fetchProfile();

  return user.profile;
}

const getAttestators = async function () {
  console.debug("Getting attestators from Nostr");

  const attestators = await ndk.fetchEvents({
    kinds: [attestationKind]
  });

  for (const binary of binaries) {
    console.debug(binary.rawEvent());
  }
}

const createAssetRegistration = async function ({
  sha256,
  appId,
  url,
  version,
  mimeType,
  platform,
  name
}) {
  console.debug("Creating asset: ", name);

  validateSHA256(sha256);
  validateUrl(url);

  if (!appId || !url || !version || !mimeType || !platform || !name) {
    throw new Error("Missing required parameters");
  }

  await ndk.connect(connectTimeout);
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = assetRegistrationKind;
  ndkEvent.content = name;
  ndkEvent.tags = [
    ["x", sha256],
    ["ox", sha256],
    ["i", appId],
    ["url", url],
    ["version", version],
    ["m", mimeType],
    ["platform", platform]
  ];

  try {
    const publishedToRelays = await ndkEvent.publish();
    console.log(`published to ${publishedToRelays.size} relays`)

  } catch (error) {
    console.error("error publishing to relays", error);

    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }
  }
}

const createAttestation = async function ({sha256, content, status, assetEventId}) {
  console.debug("Creating attestation for asset: ", assetEventId);

  validateSHA256(sha256);

  if (!content || !status || !assetEventId) {
    throw new Error("Missing required parameters");
  }

  await ndk.connect(connectTimeout);
  await new Promise(resolve => setTimeout(resolve, 5000));

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
  } catch (error) {
    console.error("error publishing attestation to relays", error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`error publishing to relay ${relay.url}`, err);
      }
    }
  }
}

const createEndorsement = async function ({sha256, content, result, attestationEventId}) {
  console.debug("Creating endorsement for attestation: ", attestationEventId);

  validateSHA256(sha256);

  if (!content || !result || !attestationEventId) {
    throw new Error("Missing required parameters");
  }

  await ndk.connect(connectTimeout);
  await new Promise(resolve => setTimeout(resolve, 5000));

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = endorsementKind;
  ndkEvent.content = content;

  ndkEvent.tags = [
    ["x", sha256],
    ["d", attestationEventId],
    ["result", result]
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
  }
}

const getBinariesWithSHA256 = async function (sha256) {
  console.debug("Getting binaries for: ", sha256);

  await ndk.connect(connectTimeout);

  const binaries = await ndk.fetchEvents({
    kinds: [assetRegistrationKind],
    "#x": [sha256]
  });

  for (const binary of binaries) {
    console.debug(binary.rawEvent());
  }
}

/* OLD VERSION, CHAINED EVENTS */
const getBinaries = async function (limit = 10) {
  console.debug(`Getting last ${limit} binaries`);

  await ndk.connect(connectTimeout);

  const binaries = await ndk.fetchEvents({
    kinds: [assetRegistrationKind],
    limit: limit
  });

  for (const binary of binaries) {
    console.log(binary.rawEvent());
  }

  console.log('binaries:', binaries);

  return binaries;
}

/* OLD VERSION, CHAINED EVENTS */
const getAttestationInfoForAppId = async function (appId, assetLimit = 10) {
  console.debug("Getting attestation info for: ", appId);

  await ndk.connect(connectTimeout);

  const binaries = await ndk.fetchEvents({
    kinds: [assetRegistrationKind],
    "#i": [appId],
    limit: assetLimit
  });

  if (binaries.length === 0) {
    console.debug("No binaries found for: ", appId);
    return [];
  }

  let binaryIds = [];
  for (const binary of binaries) {
    console.debug(binary.rawEvent());
    binaryIds.push(binary.id);
  }

  const attestationsAndEndorsements = await ndk.fetchEvents({
    kinds: [attestationKind, endorsementKind],
    "#d": binaryIds
  });

  return {
    binaries: binaries,
    attestations: attestationsAndEndorsements.filter(event => event.kind === attestationKind),
    endorsements: attestationsAndEndorsements.filter(event => event.kind === endorsementKind)
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

const getAttestationInfoLastMonths = async function(months = 6) {
  console.debug(`Getting events from last ${months} months`);

  await ndk.connect(connectTimeout);

  const events = await ndk.fetchEvents({
    kinds: [assetRegistrationKind, attestationKind, endorsementKind],
    since: getTimestampMonthsAgo(months)
  });

  const attestationsMap = new Map();
  const attestations = Array.from(events).filter(event => event.kind === attestationKind);
  
  attestations.forEach(attestation => {
    const sha256 = getFirstTag(attestation, 'x');
    if (sha256) {
      if (!attestationsMap.has(sha256)) {
        attestationsMap.set(sha256, []);
      }
      attestationsMap.get(sha256).push(attestation);
    }
  });

  return {
    assets: Array.from(events).filter(event => event.kind === assetRegistrationKind),
    attestations: attestationsMap,
    endorsements: Array.from(events).filter(event => event.kind === endorsementKind)
  };
}

window.getNostrProfile = getNostrProfile;
window.getBinariesWithSHA256 = getBinariesWithSHA256;
window.getBinaries = getBinaries;
window.createAssetRegistration = createAssetRegistration;
window.createAttestation = createAttestation;
window.createEndorsement = createEndorsement;
window.getAttestationInfoLastMonths = getAttestationInfoLastMonths;

export {
  getNostrProfile,
  getBinariesWithSHA256,
  getAttestationInfoForAppId,
  createAssetRegistration,
  createAttestation,
  createEndorsement,
  getAttestationInfoLastMonths
};
