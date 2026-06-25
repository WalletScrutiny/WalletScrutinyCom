import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { assetRegistrationKind, assetBundleRegistrationKind, verificationKind, verificationDraftKind, verificationCommentKind, codeSnippetKind, endorsementKind, opinionKind, explicitRelayUrls } from "../../src/nostr-constants.mjs";
import { getFirstTagValue } from "../../src/verifications_common.mjs";
import {
  setupWebSocketForNode,
  connectNostr,
  fetchEvents,
} from "../../src/nostr-client.mjs";

setupWebSocketForNode(WebSocket);

const KINDS = [assetRegistrationKind, assetBundleRegistrationKind, verificationKind, verificationDraftKind, verificationCommentKind, codeSnippetKind, endorsementKind, opinionKind];
const VERIFICATION_KINDS = KINDS.filter(kind => kind !== opinionKind);
const BASE_DIR = path.join(process.cwd(), "backup");

function getTimestamp(months = 2) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return Math.floor(date.getTime() / 1000);
}

function createDirectories() {
  fs.mkdirSync(BASE_DIR, { recursive: true });

  VERIFICATION_KINDS.forEach(kind => {
    fs.mkdirSync(path.join(BASE_DIR, "nostr-verification-events", kind.toString()), { recursive: true });
  });

  fs.mkdirSync(path.join(BASE_DIR, "nostr-opinion-events", opinionKind.toString()), { recursive: true });
}

function isValidEvent(event) {
  if (event.kind === opinionKind) {
    const hasNostrOpinion = event.tags.some(tag => tag[0] === 't' && tag[1] === 'nostrOpinion');
    const hasWalletScrutiny = event.tags.some(tag => tag[0] === 't' && (tag[1] === 'WalletScrutiny' || tag[1] === 'WalletScrutiny.com'));
    return hasNostrOpinion && hasWalletScrutiny;
  }

  const clientTag = getFirstTagValue(event, 'client');
  return clientTag === 'WalletScrutiny.com';
}

function getEventPath(event) {
  const eventTypeDir = event.kind === opinionKind ? "nostr-opinion-events" : "nostr-verification-events";
  return path.join(BASE_DIR, eventTypeDir, event.kind.toString(), `${event.id}.json`);
}

async function main() {
  try {
    console.log("Connecting to relays...");
    await connectNostr({ relayUrls: explicitRelayUrls, connectTimeoutMs: 2000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    const since = getTimestamp();
    console.log(`Fetching events since ${new Date(since * 1000).toISOString()}...`);

    const [verificationEvents, opinionEvents] = await Promise.all([
      fetchEvents({ kinds: VERIFICATION_KINDS, since }),
      fetchEvents({ kinds: [opinionKind], "#t": ["nostrOpinion"] }),
    ]);

    const events = [...verificationEvents, ...opinionEvents];

    console.log("Creating output directories if they don't exist...");
    createDirectories();

    console.log("Saving events to files...");
    let saved = 0, skipped = 0;

    for (const event of events) {
      if (!isValidEvent(event)) {
        skipped++;
        continue;
      }

      const filePath = getEventPath(event);
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }

      fs.writeFileSync(filePath, JSON.stringify(event, null, 2));
      console.log(`Saved event ${event.id}`);
      saved++;
    }

    console.log(`Done! Saved ${saved} new events, skipped ${skipped} already existing or non-WalletScrutiny events.`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
