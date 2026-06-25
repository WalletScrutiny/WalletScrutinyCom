/**
 * Lists backup Nostr events that are not stored on any configured relay.
 * Read-only check for refresh.sh (re-publish is a separate future step).
 *
 * By default, missing events whose content includes
 * "uploaded by WalletScrutiny Android" are excluded from the detailed report.
 * Set WS_NOSTR_CHECK_INCLUDE_ANDROID_UPLOADS=1 to include them.
 *
 * Only events with created_at > MIN_CREATED_AT_EXCLUSIVE are queried and reported
 * (WalletScrutiny relay go-live; see constant comment below).
 */

import {
  setupWebSocketForNode,
  connectNostr,
  fetchEvents,
  getPool,
  disconnectNostr,
} from "../../src/nostr-client.mjs";
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
import { printRefreshSubsection } from "../refresh-ui.mjs";

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
const ID_BATCH_SIZE = 250;
const RELAY_SETTLE_MS = 2000;
/** Kind 1337 backup files above this size are omitted from the missing-events report. */
const CODE_SNIPPET_MAX_REPORT_BYTES = 42 * 1024;
const ANDROID_UPLOAD_CONTENT_MARKER = "uploaded by WalletScrutiny Android";
const FILTER_ANDROID_UPLOAD_CONTENT = !["1", "true"].includes(
  (process.env.WS_NOSTR_CHECK_INCLUDE_ANDROID_UPLOADS ?? "").toLowerCase()
);
/**
 * Unix timestamp cutoff for backup events checked and reported.
 * This is when the WalletScrutiny relay (relay.nostr.info) went into operation.
 */
const MIN_CREATED_AT_EXCLUSIVE = 1771538683;

function kindLabel(kind) {
  return KIND_LABELS[kind] ?? `Kind ${kind}`;
}

function isWithinCreatedAtWindow(event) {
  return (event.created_at ?? 0) > MIN_CREATED_AT_EXCLUSIVE;
}

function filterByCreatedAt(events) {
  return events.filter(isWithinCreatedAtWindow);
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

async function fetchIdsOnRelays(eventIds, { relayUrls, maxWait }) {
  const foundIds = new Set();

  for (let i = 0; i < eventIds.length; i += ID_BATCH_SIZE) {
    const batch = eventIds.slice(i, i + ID_BATCH_SIZE);
    const batchNum = Math.floor(i / ID_BATCH_SIZE) + 1;
    const batchCount = Math.ceil(eventIds.length / ID_BATCH_SIZE);

    let events;
    try {
      events = await Promise.race([
        fetchEvents({ ids: batch }, { relayUrls, maxWait }),
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

const CONTENT_COLUMN_MAX_CHARS = 300;

function formatEventContent(content) {
  if (content == null || content === "") {
    return "(no content)";
  }
  const oneLine = String(content).replace(/\s+/g, " ").trim();
  if (oneLine.length <= CONTENT_COLUMN_MAX_CHARS) {
    return oneLine;
  }
  return `${oneLine.slice(0, CONTENT_COLUMN_MAX_CHARS)}...`;
}

function describeEvent(event) {
  const date = event.created_at
    ? new Date(event.created_at * 1000).toISOString().split("T")[0]
    : "unknown-date";
  const pubkey = event.pubkey ? `${event.pubkey.slice(0, 16)}...` : "unknown-pubkey";
  const content = formatEventContent(event.content);
  const appId = getFirstTagValue(event, "i");
  const version = getFirstTagValue(event, "version");
  const platform = getFirstTagValue(event, "platform");
  const status = getFirstTagValue(event, "status");

  const parts = [`${event.id}`, `kind ${event.kind}`, date, pubkey, content];
  if (appId) parts.push(`app=${appId}`);
  if (version) parts.push(`version=${version}`);
  if (platform) parts.push(`platform=${platform}`);
  if (status) parts.push(`status=${status}`);
  return parts.join("  ");
}

function hasAndroidUploadContent(event) {
  return String(event.content ?? "").includes(ANDROID_UPLOAD_CONTENT_MARKER);
}

function isReportableMissing(event) {
  if (FILTER_ANDROID_UPLOAD_CONTENT && hasAndroidUploadContent(event)) {
    return false;
  }
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
  const excludedAndroidUploads = FILTER_ANDROID_UPLOAD_CONTENT
    ? allMissing.filter(hasAndroidUploadContent)
    : [];

  printRefreshSubsection("Backup events absent from all relays");
  console.log(`  created_at filter         : > ${MIN_CREATED_AT_EXCLUSIVE}`);
  console.log(`  Backup events checked     : ${backupEvents.length}`);
  console.log(
    `  Present on at least one   : ${backupEvents.length - allMissing.length}`
  );
  console.log(`  Absent from every relay   : ${allMissing.length}`);
  const exclusionNotes = [];
  if (excludedKind1337Large.length > 0) {
    exclusionNotes.push(
      `${excludedKind1337Large.length} kind ${codeSnippetKind} > 42 KiB`
    );
  }
  if (excludedAndroidUploads.length > 0) {
    exclusionNotes.push(
      `${excludedAndroidUploads.length} WalletScrutiny Android uploads`
    );
  }
  if (exclusionNotes.length > 0) {
    console.log(
      `  Reported as missing       : ${missing.length} (${exclusionNotes.join(", ")} excluded)`
    );
  }

  if (missing.length === 0) {
    if (allMissing.length === 0) {
      console.log("\nAll backup events are available on at least one configured relay.");
    } else {
      console.log("\nNo missing events to report (remaining absences match exclusion filters).");
    }
    printKind1337LargeSummary(excludedKind1337Large);
    printAndroidUploadSummary(excludedAndroidUploads);
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
  printAndroidUploadSummary(excludedAndroidUploads);
}

function printAndroidUploadSummary(excludedAndroidUploads) {
  if (!FILTER_ANDROID_UPLOAD_CONTENT) {
    return;
  }

  printRefreshSubsection(`Events with content containing "${ANDROID_UPLOAD_CONTENT_MARKER}"`);
  console.log(`  Total (absent from all relays, excluded from report): ${excludedAndroidUploads.length}`);
}

function printKind1337LargeSummary(excludedKind1337Large) {
  if (excludedKind1337Large.length === 0) {
    return;
  }

  printRefreshSubsection(`Events with kind=${codeSnippetKind} and size > 42 kb`);
  console.log(
    `  Count (absent from all relays, excluded from report above): ${excludedKind1337Large.length}`
  );
}

async function main() {
  console.log("Checking backup Nostr events against configured relays...\n");
  if (FILTER_ANDROID_UPLOAD_CONTENT) {
    console.log(
      `Excluding missing events whose content contains "${ANDROID_UPLOAD_CONTENT_MARKER}".`
    );
    console.log(
      "Set WS_NOSTR_CHECK_INCLUDE_ANDROID_UPLOADS=1 to include them in the report.\n"
    );
  }

  const allLoadedEvents = loadAllBackupEvents();
  const backupEvents = filterByCreatedAt(allLoadedEvents);
  const skippedByCreatedAt = allLoadedEvents.length - backupEvents.length;

  if (backupEvents.length === 0) {
    console.warn(`No backup events found under ${BASE_DIR} with created_at > ${MIN_CREATED_AT_EXCLUSIVE}.`);
    process.exit(0);
  }

  const minCreatedAtIso = new Date(MIN_CREATED_AT_EXCLUSIVE * 1000).toISOString();
  console.log(`Only events with created_at > ${MIN_CREATED_AT_EXCLUSIVE} (${minCreatedAtIso}).`);
  if (skippedByCreatedAt > 0) {
    console.log(`Skipped ${skippedByCreatedAt} older backup event(s).`);
  }

  const uniqueIds = [...new Set(backupEvents.map(event => event.id))];
  console.log(`Loaded ${backupEvents.length} backup event file(s) (${uniqueIds.length} unique ids).`);

  setupWebSocketForNode(WebSocket);

  console.log("\nConnecting to relays...");
  await connectNostr({ relayUrls: explicitRelayUrls, connectTimeoutMs: CONNECT_TIMEOUT_MS });
  await new Promise(resolve => setTimeout(resolve, RELAY_SETTLE_MS));

  const pool = getPool();
  const connectionStatus = pool.listConnectionStatus();
  const connectedUrls = new Set(
    [...connectionStatus.entries()].filter(([, connected]) => connected).map(([url]) => url)
  );
  const failedRelays = explicitRelayUrls.filter(url => !connectedUrls.has(url));

  if (connectedUrls.size === 0) {
    console.error("Could not connect to any configured relay:");
    for (const relayUrl of failedRelays) {
      console.error(`  unreachable: ${relayUrl}`);
    }
    throw new Error("Could not connect to any configured relay");
  }

  console.log(`Connected to ${connectedUrls.size}/${explicitRelayUrls.length} relay(s).`);
  if (failedRelays.length > 0) {
    console.warn(
      "WARNING: Not all relays connected. Events only on unreachable relays may be " +
        "reported as missing."
    );
    for (const relayUrl of failedRelays) {
      console.warn(`  unreachable: ${relayUrl}`);
    }
  }

  console.log("Querying relays for backup event ids...");
  const connectedRelayUrls = [...connectedUrls];
  const foundIds = await fetchIdsOnRelays(uniqueIds, {
    relayUrls: connectedRelayUrls,
    maxWait: FETCH_TIMEOUT_MS,
  });

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
