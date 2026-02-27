#!/usr/bin/env node
/**
 * checkRelay.mjs - Quick count of WalletScrutiny kind 30301 events on any relay
 *
 * Usage:
 *   node scripts/verifications/tools/checkRelay.mjs wss://relay.example.com
 *   node scripts/verifications/tools/checkRelay.mjs  (checks all relays in nostr-constants.mjs)
 */

import NDK from "@nostr-dev-kit/ndk";
import WebSocket from "ws";
import { explicitRelayUrls, verificationKind } from "../../../src/nostr-constants.mjs";

global.WebSocket = WebSocket;

const CONNECT_TIMEOUT_MS = 5000;
const FETCH_TIMEOUT_MS   = 20000;

const args = process.argv.slice(2);
const relaysToCheck = args.length > 0 ? args : [...explicitRelayUrls, "wss://relay.nostr.info"];

console.log(`\nChecking ${relaysToCheck.length} relay(s) for kind ${verificationKind} WalletScrutiny.com events...\n`);
console.log("=".repeat(70));

for (const relayUrl of relaysToCheck) {
  process.stdout.write(`  ${relayUrl.padEnd(45)} `);

  const ndk = new NDK({ explicitRelayUrls: [relayUrl] });

  try {
    await ndk.connect(CONNECT_TIMEOUT_MS);

    const raw = await Promise.race([
      ndk.fetchEvents({ kinds: [verificationKind], "#client": ["WalletScrutiny.com"] }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("fetch timeout")), FETCH_TIMEOUT_MS)
      ),
    ]);

    const all = Array.from(raw);
    const ws  = all; // already filtered by #client tag in the REQ filter

    if (ws.length === 0) {
      console.log(`0 WS events  (${all.length} total kind ${verificationKind})`);
    } else {
      const sorted  = ws.sort((a, b) => b.created_at - a.created_at);
      const newest  = new Date(sorted[0].created_at * 1000).toISOString().split("T")[0];
      const oldest  = new Date(sorted[sorted.length - 1].created_at * 1000).toISOString().split("T")[0];
      console.log(`${String(ws.length).padStart(3)} WS events   oldest: ${oldest}  newest: ${newest}`);
    }

  } catch (err) {
    console.log(`FAILED — ${err.message}`);
  } finally {
    await Promise.all(
      Array.from(ndk.pool.relays.values()).map(r =>
        new Promise(resolve => { r.disconnect(); setTimeout(resolve, 100); })
      )
    );
  }
}

console.log("=".repeat(70));
console.log("Done.\n");
