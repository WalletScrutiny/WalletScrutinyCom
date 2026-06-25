import fs from "fs";
import WebSocket from "ws";
import {
  setupWebSocketForNode,
  connectNostr,
  signEvent,
  publishEvent,
  setPrivateKey,
} from "../../src/nostr-client.mjs";

setupWebSocketForNode(WebSocket);

const RELAYS = [
  "wss://relay.nostr.info/",
  "wss://nostr.mom/",
  "wss://relay.primal.net/",
  "wss://relay.damus.io/",
];

const PRIVATE_KEY = "";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node publishEvent.mjs <event-file.json>");
  process.exit(1);
}

async function main() {
  try {
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

    if (PRIVATE_KEY) {
      setPrivateKey(PRIVATE_KEY);
    }

    console.log("\nConnecting to relays...");
    await connectNostr({ relayUrls: RELAYS, connectTimeoutMs: 5000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    let eventToPublish = eventJson;
    if (PRIVATE_KEY) {
      eventToPublish = await signEvent(eventJson);
      console.log("Event signed with provided private key");
    }

    console.log("\nPublishing...");
    const { successful } = await publishEvent(eventToPublish, RELAYS);

    if (successful > 0) {
      console.log(`\nPublished successfully to ${successful} relay(s)`);
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
