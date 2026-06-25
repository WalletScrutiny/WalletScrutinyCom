
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { explicitRelayUrls, verificationKind } from "../../../src/nostr-constants.mjs";
import {
  setupWebSocketForNode,
  withEphemeralPool,
} from "../../../src/nostr-client.mjs";

setupWebSocketForNode(WebSocket);

/**
 * Loads kind 30301 verification events from the local backup directory.
 * @returns {Promise<Array>} A promise that resolves to an array of event objects.
 */
export async function loadBackupEvents() {
  const projectRoot = process.cwd();
  const backupDir = path.join(projectRoot, 'backup', 'nostr-verification-events');
  const kind30301Dir = path.join(backupDir, verificationKind.toString());

  if (!fs.existsSync(kind30301Dir)) {
    console.warn(`Backup directory not found: ${kind30301Dir}`);
    return [];
  }

  const events = [];
  const files = fs.readdirSync(kind30301Dir);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(kind30301Dir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const event = JSON.parse(content);

      const isWalletScrutiny = event.tags.some(tag =>
        Array.isArray(tag) && tag[0] === 'client' && tag[1] === 'WalletScrutiny.com'
      );

      if (isWalletScrutiny) {
        events.push(event);
      }
    }
  }

  return events;
}

/**
 * Gathers kind 30301 verification events from all configured Nostr relays.
 * @returns {Promise<Object>} A promise that resolves to an object where keys are relay URLs
 * and values are arrays of event objects from that relay.
 */
export async function gatherRelayData() {
  const relayData = {};
  console.log("Gathering data from all relays...");

  for (const relayUrl of explicitRelayUrls) {
    console.log(`  Connecting to ${relayUrl}...`);

    try {
      await withEphemeralPool([relayUrl], async (pool, urls) => {
        const events = await Promise.race([
          pool.querySync(urls, { kinds: [verificationKind] }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Fetch timeout')), 10000)
          ),
        ]);

        process.stdout.write(`Fetching`);

        const walletScrutinyEvents = [];
        let currentCount = 0;

        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          const isWalletScrutiny = event.tags.some(tag =>
            Array.isArray(tag) && tag[0] === 'client' && tag[1] === 'WalletScrutiny.com'
          );

          if (isWalletScrutiny) {
            walletScrutinyEvents.push({
              id: event.id,
              pubkey: event.pubkey,
              created_at: event.created_at,
              tags: event.tags,
            });
            currentCount++;

            if (currentCount % 3 === 0 || i === events.length - 1) {
              process.stdout.write(`\r  Connecting to ${relayUrl}... Found ${currentCount} events`);
              if (events.length > 50) {
                await new Promise(resolve => setTimeout(resolve, 10));
              }
            }
          }
        }

        relayData[relayUrl] = walletScrutinyEvents;

        const shortUrl = relayUrl.replace('wss://', '').replace('/', '');
        console.log(`\r  ${shortUrl}: ${walletScrutinyEvents.length} events`);
      }, { connectTimeoutMs: 3000 });

    } catch (error) {
      console.log(`  ${relayUrl}: Failed to connect`);
      relayData[relayUrl] = [];
    }
  }

  return relayData;
}
