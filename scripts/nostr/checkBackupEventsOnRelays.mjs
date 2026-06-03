/**
 * Lists backup Nostr events that are not stored on any configured relay.
 * Read-only check for refresh.sh (re-publish is a separate future step).
 */

import NDK from "@nostr-dev-kit/ndk";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import {
  explicitRelayUrls,
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  endorsementKind,
  opinionKind,
} from "../../src/nostr-constants.mjs";
import { getFirstTagValue } from "../../src/verifications_common.mjs";

global.WebSocket = WebSocket;

const BASE_DIR = path.join(process.cwd(), "backup");
const VERIFICATION_KINDS = [
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  endorsementKind,
];

const KIND_LABELS = {
  [assetRegistrationKind]: "Asset Registration",
  [assetBundleRegistrationKind]: "Asset Bundle Registration",
  [codeSnippetKind]: "Code Snippet",
  [verificationKind]: "Verification",
  [verificationDraftKind]: "Draft",
  [verificationCommentKind]: "Comment",
  [endorsementKind]: "Endorsement",
  [opinionKind]: "Opinion",
};

const CONNECT_TIMEOUT_MS = 5000;
const FETCH_TIMEOUT_MS = 30000;
const ID_BATCH_SIZE = 100;
const RELAY_SETTLE_MS = 2000;
/** Kind 1337 backup files above this size are omitted from the missing-events report. */
const CODE_SNIPPET_MAX_REPORT_BYTES = 42 * 1024;

function kindLabel(kind) {
  return KIND_LABELS[kind] ?? `Kind ${kind}`;
}

function loadEventsFromDir(kindDir) {
  if (!fs.existsSync(kindDir)) {
    return [];
  }

  const events = [];
  for (const file of fs.readdirSync(kindDir)) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const filePath = path.join(kindDir, file);
    const fileBytes = fs.statSync(filePath).size;
    const event = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (event?.id) {
      events.push({ ...event, backupFileSizeBytes: fileBytes });
    }
  }
  return events;
}

function loadAllBackupEvents() {
  const events = [];

  for (const kind of VERIFICATION_KINDS) {
    const kindDir = path.join(BASE_DIR, "nostr-verification-events", kind.toString());
    events.push(...loadEventsFromDir(kindDir));
  }

  const opinionDir = path.join(BASE_DIR, "nostr-opinion-events", opinionKind.toString());
  events.push(...loadEventsFromDir(opinionDir));

  return events;
}

async function fetchIdsOnRelays(ndk, eventIds) {
  const foundIds = new Set();

  for (let i = 0; i < eventIds.length; i += ID_BATCH_SIZE) {
    const batch = eventIds.slice(i, i + ID_BATCH_SIZE);
    const batchNum = Math.floor(i / ID_BATCH_SIZE) + 1;
    const batchCount = Math.ceil(eventIds.length / ID_BATCH_SIZE);

    let events;
    try {
      events = await Promise.race([
        ndk.fetchEvents({ ids: batch }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("fetch timeout")), FETCH_TIMEOUT_MS)
        ),
      ]);
    } catch (error) {
      throw new Error(`batch ${batchNum}/${batchCount}: ${error.message}`);
    }

    for (const event of events) {
      foundIds.add(event.id);
    }

    process.stdout.write(
      `\r  Queried ${Math.min(i + batch.length, eventIds.length)}/${eventIds.length} event ids on relays...`
    );
  }

  process.stdout.write("\n");
  return foundIds;
}

function describeEvent(event) {
  const date = event.created_at
    ? new Date(event.created_at * 1000).toISOString().split("T")[0]
    : "unknown-date";
  const pubkey = event.pubkey ? `${event.pubkey.slice(0, 16)}...` : "unknown-pubkey";
  const appId = getFirstTagValue(event, "i");
  const version = getFirstTagValue(event, "version");
  const platform = getFirstTagValue(event, "platform");
  const status = getFirstTagValue(event, "status");

  const parts = [`${event.id}`, `kind ${event.kind}`, date, pubkey];
  if (appId) parts.push(`app=${appId}`);
  if (version) parts.push(`version=${version}`);
  if (platform) parts.push(`platform=${platform}`);
  if (status) parts.push(`status=${status}`);
  return parts.join("  ");
}

function isReportableMissing(event) {
  if (event.kind !== codeSnippetKind) {
    return true;
  }
  return event.backupFileSizeBytes < CODE_SNIPPET_MAX_REPORT_BYTES;
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function printMissingReport(backupEvents, foundIds) {
  const allMissing = backupEvents
    .filter(event => !foundIds.has(event.id))
    .sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));

  const missing = allMissing.filter(isReportableMissing);
  const excludedKind1337Large = allMissing.filter(
    event =>
      event.kind === codeSnippetKind &&
      event.backupFileSizeBytes >= CODE_SNIPPET_MAX_REPORT_BYTES
  );

  console.log("\n" + "=".repeat(72));
  console.log("BACKUP EVENTS ABSENT FROM ALL RELAYS");
  console.log("=".repeat(72));
  console.log(`  Backup events checked     : ${backupEvents.length}`);
  console.log(
    `  Present on at least one   : ${backupEvents.length - allMissing.length}`
  );
  console.log(`  Absent from every relay   : ${allMissing.length}`);
  if (excludedKind1337Large.length > 0) {
    console.log(
      `  Reported as missing       : ${missing.length} ` +
        `(${excludedKind1337Large.length} kind ${codeSnippetKind} > 42 KiB excluded)`
    );
  }

  if (missing.length === 0) {
    if (allMissing.length === 0) {
      console.log("\nAll backup events are available on at least one configured relay.");
    } else {
      console.log(
        "\nNo missing events to report (remaining absences are kind 1337 files over 42 KiB)."
      );
    }
    printKind1337LargeSummary(excludedKind1337Large);
    return;
  }

  const byKind = new Map();
  for (const event of missing) {
    if (!byKind.has(event.kind)) {
      byKind.set(event.kind, []);
    }
    byKind.get(event.kind).push(event);
  }

  console.log("\nBy kind:");
  for (const kind of [...byKind.keys()].sort((a, b) => a - b)) {
    console.log(`  ${kind} (${kindLabel(kind)}): ${byKind.get(kind).length}`);
  }

  console.log("\nMissing events (newest first):");
  for (const event of missing) {
    console.log(`  - ${describeEvent(event)}`);
  }

  console.log(
    "\nThese events are candidates for a future re-publish step; this script does not upload."
  );

  printKind1337LargeSummary(excludedKind1337Large);
}

function printKind1337LargeSummary(excludedKind1337Large) {
  if (excludedKind1337Large.length === 0) {
    return;
  }

  console.log("\n" + "=".repeat(72));
  console.log(`Events with kind=${codeSnippetKind} and size > 42 kb`);
  console.log("=".repeat(72));
  console.log(
    `  Count (absent from all relays, excluded from report above): ${excludedKind1337Large.length}`
  );

  for (const event of excludedKind1337Large) {
    const date = event.created_at
      ? new Date(event.created_at * 1000).toISOString().split("T")[0]
      : "unknown-date";
    console.log(
      `  - ${event.id}  ${formatKiB(event.backupFileSizeBytes)}  ${date}`
    );
  }
}

async function main() {
  console.log("Checking backup Nostr events against configured relays...\n");

  const backupEvents = loadAllBackupEvents();
  if (backupEvents.length === 0) {
    console.warn(`No backup events found under ${BASE_DIR}. Run backup first or check paths.`);
    process.exit(0);
  }

  const uniqueIds = [...new Set(backupEvents.map(event => event.id))];
  console.log(`Loaded ${backupEvents.length} backup event file(s) (${uniqueIds.length} unique ids).`);
  console.log(`Relays (${explicitRelayUrls.length}):`);
  for (const relayUrl of explicitRelayUrls) {
    console.log(`  - ${relayUrl}`);
  }

  const ndk = new NDK({ explicitRelayUrls });

  console.log("\nConnecting to relays...");
  await ndk.connect(CONNECT_TIMEOUT_MS);
  await new Promise(resolve => setTimeout(resolve, RELAY_SETTLE_MS));

  const connectedRelays = [...ndk.pool.relays.values()].filter(relay => relay.connected);
  if (connectedRelays.length === 0) {
    throw new Error("Could not connect to any configured relay");
  }
  console.log(`Connected to ${connectedRelays.length}/${explicitRelayUrls.length} relay(s).`);
  if (connectedRelays.length < explicitRelayUrls.length) {
    const connectedUrls = new Set(connectedRelays.map(relay => relay.url));
    const failedRelays = explicitRelayUrls.filter(url => !connectedUrls.has(url));
    console.warn(
      "WARNING: Not all relays connected. Events only on unreachable relays may be " +
        "reported as missing."
    );
    for (const relayUrl of failedRelays) {
      console.warn(`  unreachable: ${relayUrl}`);
    }
  }

  console.log("Querying relays for backup event ids...");
  const foundIds = await fetchIdsOnRelays(ndk, uniqueIds);

  printMissingReport(backupEvents, foundIds);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
