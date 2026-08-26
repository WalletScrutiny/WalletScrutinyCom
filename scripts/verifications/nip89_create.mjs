import { assetRegistrationKind, assetBundleRegistrationKind, verificationKind, endorsementKind, mainRelayUrl, explicitRelayUrls, wsBotPublicKey } from "../../src/nostr-constants.mjs";
import {
  connectNostr,
  createEventDraft,
  signEvent,
  publishEvent,
  setPrivateKey,
} from "../../src/nostr-client.mjs";


const dIdentifier = Math.floor(Math.random() * 10000000000000);

const nostrConnect = async function (nostrPrivateKey) {
  setPrivateKey(nostrPrivateKey);
  try {
    await connectNostr({ relayUrls: explicitRelayUrls, connectTimeoutMs: 5000, privateKey: nostrPrivateKey });
  } catch (e) {
    console.error("nostr connect failed", e);
    throw e;
  }
};

async function publishSignedEvent(draft) {
  const signed = await signEvent(draft);
  const { successful } = await publishEvent(signed);
  console.debug(`Published event (id: ${signed.id}) to ${successful} relays`);
  return signed;
}

const createNip89Events = async function () {
  const capabilityEvent = createEventDraft({
    kind: 31990,
    content: "",
    tags: [
      ["d", `${dIdentifier}`],
      ["k", `${assetRegistrationKind}`],
      ["k", `${assetBundleRegistrationKind}`],
      ["k", `${verificationKind}`],
      ["k", `${endorsementKind}`],
      ["web", "https://walletscrutiny.com/verifier/?pubkey=<bech-32>", "npub"],
      ["web", "https://walletscrutiny.com/verifier/?pubkey=<bech-32>", "nprofile"],
      ["web", "https://walletscrutiny.com/verifications/"],
    ],
  });

  const recommendationEvent_assetRegistration = createEventDraft({
    kind: 31989,
    content: "",
    tags: [
      ["d", `${assetRegistrationKind}`],
      ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
    ],
  });

  const recommendationEvent_assetBundleRegistration = createEventDraft({
    kind: 31989,
    content: "",
    tags: [
      ["d", `${assetBundleRegistrationKind}`],
      ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
    ],
  });

  const recommendationEvent_verification = createEventDraft({
    kind: 31989,
    content: "",
    tags: [
      ["d", `${verificationKind}`],
      ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
    ],
  });

  const recommendationEvent_endorsement = createEventDraft({
    kind: 31989,
    content: "",
    tags: [
      ["d", `${endorsementKind}`],
      ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
    ],
  });

  try {
    console.log('\n--------------------------------------------------------------------------- capabilityEvent:\n', capabilityEvent);
    console.log('\n--------------------------------------------------------------------------- recommendationEvent_assetRegistration:\n', recommendationEvent_assetRegistration);
    console.log('\n--------------------------------------------------------------------------- recommendationEvent_assetBundleRegistration:\n', recommendationEvent_assetBundleRegistration);
    console.log('\n--------------------------------------------------------------------------- recommendationEvent_verification:\n', recommendationEvent_verification);
    console.log('\n--------------------------------------------------------------------------- recommendationEvent_endorsement:\n', recommendationEvent_endorsement);

    const publishedCapability = await publishSignedEvent(capabilityEvent);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_assetRegistration = await publishSignedEvent(recommendationEvent_assetRegistration);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_assetBundleRegistration = await publishSignedEvent(recommendationEvent_assetBundleRegistration);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_verification = await publishSignedEvent(recommendationEvent_verification);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_endorsement = await publishSignedEvent(recommendationEvent_endorsement);

    return {
      recommendationEventId_assetRegistration: publishedRecommendation_assetRegistration.id,
      recommendationEventId_verification: publishedRecommendation_verification.id,
      recommendationEventId_endorsement: publishedRecommendation_endorsement.id,
      capabilityEventId: publishedCapability.id,
    };

  } catch (error) {
    console.error("Error publishing NIP-89 events to relays", error);
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.length < 3) {
    console.log('Usage: node nip89_create.mjs <nostr_nsec_private_key>');
    process.exit(1);
  }

  const nostrNsecPrivateKey = process.argv[2];

  console.log('Connecting to Nostr relays...');
  await nostrConnect(nostrNsecPrivateKey);
  await new Promise(resolve => setTimeout(resolve, 6000));

  await createNip89Events();
  console.log('\nNIP-89 events created.');
  console.log('\n************ <d-identifier> = ', dIdentifier);
  process.exit(0);
}

export { nostrConnect, createNip89Events };
