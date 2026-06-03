import NDK, { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import fs from "fs";
import WebSocket from "ws";

global.WebSocket = WebSocket;

const RELAYS = [
  "wss://relay.nostr.info/",
  "wss://nostr.mom/",
  "wss://relay.primal.net/",
  "wss://relay.damus.io/",
];

// Private key for signing (hex format, without 'nsec' prefix)
const PRIVATE_KEY = "";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node publishEvent.mjs <event-file.json>");
  process.exit(1);
}

async function main() {
  try {
    // Read event from file
    let eventJson;
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      eventJson = JSON.parse(content);
    } catch (e) {
      console.error(`Error reading file: ${filePath}`);
      console.error(e.message);
      process.exit(1);
    }

    console.log(`Publishing event: ${eventJson.id}`);
    console.log(`Kind: ${eventJson.kind}`);
    console.log(`Relays: ${RELAYS.join(", ")}`);

    const signer = PRIVATE_KEY ? new NDKPrivateKeySigner(PRIVATE_KEY) : undefined;
    const ndk = new NDK({ explicitRelayUrls: RELAYS, signer });
    
    console.log("\nConnecting to relays...");
    await ndk.connect(5000);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const ndkEvent = new NDKEvent(ndk, eventJson);

    // Sign with private key if provided
    if (PRIVATE_KEY) {
      await ndkEvent.sign();
      console.log("Event signed with provided private key");
    }

    console.log("\nPublishing...");
    const publishedTo = await ndkEvent.publish();
    
    const relaySet = Array.from(publishedTo || []);
    if (relaySet.length > 0) {
      console.log(`\nPublished successfully to ${relaySet.length} relay(s):`);
      relaySet.forEach(r => console.log(`  - ${r.url}`));
    } else {
      console.log("\nEvent published (no confirmation from relays)");
    }

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
