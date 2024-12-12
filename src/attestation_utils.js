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
  await ndk.connect(connectTimeout);
  const user = ndk.getUser({ pubkey });
  return await user.fetchProfile();
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

const createEndorsement = async function ({sha256, content, status, attestationEventId}) {
  console.debug("Creating endorsement for attestation: ", attestationEventId);

  validateSHA256(sha256);

  if (!content || !status || !attestationEventId) {
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
  }
}

const getAssetsWithSHA256 = async function (sha256) {
  console.debug("Getting assets for: ", sha256);

  await ndk.connect(connectTimeout);

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

const getAttestationInfoLastMonths = async function({ months, pubkey }) {
  console.debug(`Getting events from last ${months} months`);

  await ndk.connect(connectTimeout);

  const filter = {
    kinds: [assetRegistrationKind, attestationKind, endorsementKind],
    since: getTimestampMonthsAgo(months)
  };

  if (pubkey) {
    filter.authors = [pubkey];
  }

  const events = await ndk.fetchEvents(filter);

  const attestationsMap = new Map();
  const endorsementsMap = new Map();
  const attestations = Array.from(events).filter(event => event.kind === attestationKind);
  const endorsements = Array.from(events).filter(event => event.kind === endorsementKind);
  
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

  return {
    assets: Array.from(events).filter(event => event.kind === assetRegistrationKind),
    attestations: attestationsMap,
    endorsements: endorsementsMap
  };
}

window.createAssetRegistration = createAssetRegistration;
window.createAttestation = createAttestation;
window.createEndorsement = createEndorsement;
window.getNostrProfile = getNostrProfile;
window.getAssetsWithSHA256 = getAssetsWithSHA256;
window.getAttestationInfoLastMonths = getAttestationInfoLastMonths;
window.getFirstTag = getFirstTag;
