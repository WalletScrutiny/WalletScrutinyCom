
import NDK from "@nostr-dev-kit/ndk";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { explicitRelayUrls, verificationKind } from "../../../src/nostr-constants.mjs";

global.WebSocket = WebSocket; // Make WebSocket available globally as NDK expects it

/**
 * Loads kind 30301 verification events from the local backup directory.
 * @returns {Promise<Array>} A promise that resolves to an array of event objects.
 */
export async function loadBackupEvents() {
  // Use current working directory as project root
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

      // Filter for WalletScrutiny.com client events
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
  console.log("🔄 Gathering data from all relays...");

  for (const relayUrl of explicitRelayUrls) {
    console.log(`  Connecting to ${relayUrl}...`);
    const ndk = new NDK({
      explicitRelayUrls: [relayUrl],
    });

    try {
      await ndk.connect(3000); // 3 second timeout

      // Add timeout to fetchEvents to prevent stalling
      const events = await Promise.race([
        ndk.fetchEvents({
          kinds: [verificationKind],
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 10000)
        )
      ]);

      // Show fetching status
      process.stdout.write(`📡 Fetching`);
      
      // Filter for WalletScrutiny.com client events with animated counting
      const allEvents = Array.from(events);
      const walletScrutinyEvents = [];
      let currentCount = 0;
      
      // Add small delay to show animation
      for (let i = 0; i < allEvents.length; i++) {
        const event = allEvents[i];
        const isWalletScrutiny = event.tags.some(tag => 
          Array.isArray(tag) && tag[0] === 'client' && tag[1] === 'WalletScrutiny.com'
        );
        
        if (isWalletScrutiny) {
          walletScrutinyEvents.push({
            id: event.id,
            pubkey: event.pubkey,
            created_at: event.created_at,
            tags: event.tags
          });
          currentCount++;
          
          // Update the counter every few events for animation effect
          if (currentCount % 3 === 0 || i === allEvents.length - 1) {
            process.stdout.write(`\r  Connecting to ${relayUrl}... 📡 Found ${currentCount} events`);
            // Small delay for visual effect only if we have many events
            if (allEvents.length > 50) {
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
        }
      }

      relayData[relayUrl] = walletScrutinyEvents;
      
      // Final success message
      const shortUrl = relayUrl.replace('wss://', '').replace('/', '');
      console.log(`\r  ✅ ${shortUrl}: ${walletScrutinyEvents.length} events`);

    } catch (error) {
      console.log(`  ❌ ${relayUrl}: Failed to connect`);
      relayData[relayUrl] = [];
    } finally {
      // Properly disconnect all relays and wait for cleanup
      await Promise.all(Array.from(ndk.pool.relays.values()).map(relay => {
        return new Promise(resolve => {
          relay.disconnect();
          setTimeout(resolve, 100);
        });
      }));
    }
  }

  return relayData;
}
