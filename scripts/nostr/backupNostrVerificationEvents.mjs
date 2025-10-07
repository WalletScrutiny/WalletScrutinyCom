#!/usr/bin/env node
/**
 * backupNostrVerificationEvents.mjs v0.1.0
 *
 * Backs up WalletScrutiny verification and opinion events from Nostr relays
 * to local JSON files organized by event kind.
 *
 * Usage:
 *   node backupNostrVerificationEvents.mjs [options]
 *
 * Options:
 *   -d, --days <number>    Number of days to look back (default: 60)
 *   -h, --help             Show this help message
 *
 * Examples:
 *   node backupNostrVerificationEvents.mjs           # Backup last 60 days
 *   node backupNostrVerificationEvents.mjs -d 30     # Backup last 30 days
 *   node backupNostrVerificationEvents.mjs -d 180    # Backup last 180 days
 *
 * Output:
 *   Events are saved to ./backup/nostr-verification-events/ and
 *   ./backup/nostr-opinion-events/ organized by event kind.
 */

import NDK from "@nostr-dev-kit/ndk";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { assetRegistrationKind, verificationKind, verificationDraftKind, verificationCommentKind, codeSnippetKind, endorsementKind, opinionKind, explicitRelayUrls } from "../../src/nostr-constants.mjs";
import { getFirstTagValue } from "../../src/verifications_common.mjs";

global.WebSocket = WebSocket;

const KINDS = [assetRegistrationKind, verificationKind, verificationDraftKind, verificationCommentKind, codeSnippetKind, endorsementKind, opinionKind];
const VERIFICATION_KINDS = KINDS.filter(kind => kind !== opinionKind);
const BASE_DIR = path.join(process.cwd(), "backup");
const DEFAULT_DAYS = 60;

function showHelp() {
  console.log(`
backupNostrVerificationEvents.mjs v0.1.0

Backs up WalletScrutiny verification and opinion events from Nostr relays.

Usage:
  node backupNostrVerificationEvents.mjs [options]

Options:
  -d, --days <number>    Number of days to look back (default: ${DEFAULT_DAYS})
  -h, --help             Show this help message

Examples:
  node backupNostrVerificationEvents.mjs           # Backup last ${DEFAULT_DAYS} days
  node backupNostrVerificationEvents.mjs -d 30     # Backup last 30 days
  node backupNostrVerificationEvents.mjs -d 180    # Backup last 180 days

Output:
  Events are saved to ./backup/nostr-verification-events/ and
  ./backup/nostr-opinion-events/ organized by event kind.
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let days = DEFAULT_DAYS;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      showHelp();
      process.exit(0);
    } else if (arg === '-d' || arg === '--days') {
      const nextArg = args[i + 1];
      if (!nextArg || isNaN(nextArg)) {
        console.error(`Error: -d/--days requires a numeric argument`);
        console.error(`Try 'node backupNostrVerificationEvents.mjs --help' for more information.`);
        process.exit(1);
      }
      days = parseInt(nextArg, 10);
      if (days <= 0) {
        console.error(`Error: days must be a positive number`);
        process.exit(1);
      }
      i++; // Skip next arg since we consumed it
    } else {
      console.error(`Error: Unknown option '${arg}'`);
      console.error(`Try 'node backupNostrVerificationEvents.mjs --help' for more information.`);
      process.exit(1);
    }
  }

  return { days };
}

function getTimestamp(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
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
    const { days } = parseArgs();

    const ndk = new NDK({ explicitRelayUrls });

    console.log("Connecting to relays...");
    await ndk.connect(2000);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const since = getTimestamp(days);
    console.log(`Fetching events from the last ${days} days (since ${new Date(since * 1000).toISOString()})...`);
    
    const [verificationEvents, opinionEvents] = await Promise.all([
      ndk.fetchEvents({ kinds: VERIFICATION_KINDS, since }),
      ndk.fetchEvents({ kinds: [opinionKind], "#t": ["nostrOpinion"] })
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
      
      fs.writeFileSync(filePath, JSON.stringify(event.rawEvent(), null, 2));
      console.log(`Saved event ${event.id}`);
      saved++;
    }

    console.log(`Done! Saved ${saved} new events, skipped ${skipped} already existing or non-WalletScrutiny events.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

main();