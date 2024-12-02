import NDK, {NDKEvent, NDKNip07Signer, NDKPublishError} from "@nostr-dev-kit/ndk";

const assetRegistrationKind = 10630; // 1063
const attestationKind = 303010; // 30301
const endorsementKind = 303020; // 30302

const nip07signer = new NDKNip07Signer();
const ndk = new NDK({
  explicitRelayUrls: [
    //"wss://relay.zapstore.dev",
    "wss://relay.primal.net/"
  ],
  signer: nip07signer
});

const getAttestators = async function () {
  console.debug("Getting attestators from Nostr");

  const attestators = await ndk.fetchEvents({
    kinds: [attestationKind]
  });

  for (const binary of binaries) {
    console.debug(binary.rawEvent());
  }
}

const createAsset = async function (name, tags) {
  console.debug("Creating asset: ", name);

  await ndk.connect();

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = assetRegistrationKind;
  ndkEvent.content = name;
  ndkEvent.tags = tags;

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

const getBinariesWithSHA256 = async function (sha256) {
  console.debug("Getting binaries for: ", sha256);

  await ndk.connect();

  const binaries = await ndk.fetchEvents({
    kinds: [assetRegistrationKind],
    "#x": [sha256]
  });

  for (const binary of binaries) {
    console.debug(binary.rawEvent());
  }
}

const getBinaries = async function (limit = 10) {
  console.debug(`Getting last ${limit} binaries`);

  await ndk.connect();

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

const getAttestationInfoForAppId = async function (appId, assetLimit = 10) {
  console.debug("Getting attestation info for: ", appId);

  await ndk.connect();

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

window.getBinariesWithSHA256 = getBinariesWithSHA256;
window.getBinaries = getBinaries;
window.createAsset = createAsset;

export {
  getBinaries,
  getBinariesWithSHA256,
  getAttestationInfoForAppId,
  createAsset
};
