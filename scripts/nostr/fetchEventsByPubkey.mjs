import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { explicitRelayUrls, wsBotPublicKey, verificationKind } from "../../src/nostr-constants.mjs";
import {
  setupWebSocketForNode,
  connectNostr,
  fetchEvents,
} from "../../src/nostr-client.mjs";

setupWebSocketForNode(WebSocket);

const BASE_DIR = path.join(process.cwd(), "backup", "ws-bot-nostr-pubkey-events");

const PUBKEY = process.argv[2] || wsBotPublicKey;
const OUTPUT_DIR = path.join(BASE_DIR, PUBKEY);

async function main() {
  try {
    console.log(`Fetching all events for pubkey: ${PUBKEY}`);
    console.log(`Relays: ${explicitRelayUrls.join(", ")}`);

    console.log("\nConnecting to relays...");
    await connectNostr({ relayUrls: explicitRelayUrls, connectTimeoutMs: 2000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("Fetching events (this may take a while)...");

    const events = await fetchEvents({ authors: [PUBKEY], kinds: [verificationKind] });

    const eventsArray = Array.from(events);

    eventsArray.sort((a, b) => b.created_at - a.created_at);

    console.log(`\nFetched ${eventsArray.length} events`);

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    let saved = 0, skipped = 0;
    for (const event of eventsArray) {
      const filePath = path.join(OUTPUT_DIR, `${event.id}.json`);
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }
      fs.writeFileSync(filePath, JSON.stringify(event, null, 2));
      saved++;
    }

    console.log(`Saved ${saved} new events, skipped ${skipped} existing`);
    console.log(`Output directory: ${OUTPUT_DIR}`);

    const kindsCount = {};
    eventsArray.forEach(e => {
      kindsCount[e.kind] = (kindsCount[e.kind] || 0) + 1;
    });

    console.log("\nEvents by kind:");
    Object.entries(kindsCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([kind, count]) => {
        console.log(`  Kind ${kind}: ${count}`);
      });

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
