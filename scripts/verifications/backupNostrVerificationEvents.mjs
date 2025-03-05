import NDK from "@nostr-dev-kit/ndk";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { assetRegistrationKind, verificationKind, endorsementKind, explicitRelayUrls } from "../../src/nostr-constants.mjs";

global.WebSocket = WebSocket; // Make WebSocket available globally as NDK expects it

const connectTimeout = 2000;

const ndk = new NDK({
  explicitRelayUrls: explicitRelayUrls,
});

function getTimestampMonthsAgo(months = 2) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
}

async function fetchAndSaveEvents() {
  try {
    console.log("Connecting to relays...");
    await ndk.connect(connectTimeout);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const since = getTimestampMonthsAgo();
    console.log(`Fetching events since ${new Date(since * 1000).toISOString()}...`);
    const events = await ndk.fetchEvents({
      kinds: [assetRegistrationKind, verificationKind, endorsementKind],
      since: since
    });

    console.log("Creating output directories if they don't exist...");
    const baseDir = path.join(process.cwd(), "backup", "nostr-verification-events");
    const kinds = [assetRegistrationKind, verificationKind, endorsementKind];
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backup");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    for (const kind of kinds) {
      const kindDir = path.join(baseDir, kind.toString());
      if (!fs.existsSync(kindDir)) {
        fs.mkdirSync(kindDir, { recursive: true });
      }
    }

    console.log("Saving events to files...");
    let saved = 0;
    let skipped = 0;
    for (const event of events) {
      const eventId = event.id;
      const kind = event.kind;
      const filePath = path.join(baseDir, kind.toString(), `${eventId}.json`);
      
      if (fs.existsSync(filePath)) {
        console.log(`Skipping event ${eventId} (already exists)`);
        skipped++;
        continue;
      }
      
      fs.writeFileSync(filePath, JSON.stringify(event.rawEvent(), null, 2));
      console.log(`Saved event ${eventId}`);
      saved++;
    }

    console.log(`Done! Saved ${saved} new events, skipped ${skipped} existing events.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

fetchAndSaveEvents(); 