import { NDKEvent, NDKPublishError } from "@nostr-dev-kit/ndk";
import { nostrConnect } from '../../src/verifications_utils.mjs';
import WebSocket from "ws";
import { assetRegistrationKind, verificationKind, endorsementKind, mainRelayUrl } from "../../src/nostr-constants.mjs";

if (typeof global !== 'undefined') {
  global.WebSocket = WebSocket;
}

let ndk;

const createNip89Events = async function () {
  const dIdentifier = Math.floor(Math.random() * 10000000000000);   // 13 digits random number
  const wsBotPublicKey = "168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335";

    // Handler information
    const capabilityEvent = new NDKEvent(ndk);
    capabilityEvent.kind = 31990;
    capabilityEvent.content = "";
    capabilityEvent.tags = [
      ["d", dIdentifier],
      ["k", assetRegistrationKind],
      ["k", verificationKind],
      ["k", endorsementKind],
      ["web", "https://beta.walletscrutiny.com/verifier/?pubkey=<bech-32>", "npub"]
      ["web", "https://beta.walletscrutiny.com/verifications/"]
    ];

  // Recommendation events
  const recommendationEvent_assetRegistration = new NDKEvent(ndk);
  recommendationEvent_assetRegistration.kind = 31989;
  recommendationEvent_assetRegistration.content = "";
  recommendationEvent_assetRegistration.tags = [
    ["d", assetRegistrationKind],
    ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
  ];

  const recommendationEvent_verification = new NDKEvent(ndk);
  recommendationEvent_verification.kind = 31989;
  recommendationEvent_verification.content = "";
  recommendationEvent_verification.tags = [
    ["d", verificationKind],
    ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
  ];

  const recommendationEvent_endorsement = new NDKEvent(ndk);
  recommendationEvent_endorsement.kind = 31989;
  recommendationEvent_endorsement.content = "";
  recommendationEvent_endorsement.tags = [
    ["d", endorsementKind],
    ["a", `31990:${wsBotPublicKey}:${dIdentifier}`, mainRelayUrl, "web"],
  ];

  try {
    // Publish events
    const publishedCapability = await capabilityEvent.publish();
    console.debug(`Published capability event to ${publishedCapability.size} relays`);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_assetRegistration = await recommendationEvent_assetRegistration.publish();
    console.debug(`Published recommendation event for assetRegistration to ${publishedRecommendation_assetRegistration.size} relays`);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_verification = await recommendationEvent_verification.publish();
    console.debug(`Published recommendation event for verification to ${publishedRecommendation_verification.size} relays`);
    await new Promise(resolve => setTimeout(resolve, 6000));

    const publishedRecommendation_endorsement = await recommendationEvent_endorsement.publish();
    console.debug(`Published recommendation event for endorsement to ${publishedRecommendation_endorsement.size} relays`);

    return {
      recommendationEventId_assetRegistration: publishedRecommendation_assetRegistration.id,
      recommendationEventId_verification: publishedRecommendation_verification.id,
      recommendationEventId_endorsement: publishedRecommendation_endorsement.id,
      capabilityEventId: publishedCapability.id
    };

  } catch (error) {
    console.error("Error publishing NIP-89 events to relays", error);
    if (error instanceof NDKPublishError) {
      for (const [relay, err] of error.errors) {
        console.error(`Error publishing to relay ${relay.url}`, err);
      }
    }
    throw error;
  }
}

// Direct execution check
if (import.meta.url === `file://${process.argv[1]}`) {
    // Get Nostr private key and directory paths from command-line arguments
    if (process.argv.length < 3) {
        console.log('Usage: node nip89_create.mjs <nostr_nsec_private_key>');
        process.exit(1);
    }

    const nostrNsecPrivateKey = process.argv[2];

    console.log('Connecting to Nostr relays...');
    await nostrConnect(nostrNsecPrivateKey);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const result = await createNip89Events();
    console.log('NIP-89 events created:', result);
    process.exit(0);
}