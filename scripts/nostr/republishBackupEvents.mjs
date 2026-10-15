/**
 * Re-publishes backup Nostr events to the relays that no longer hold them.
 *
 * Reads the local backup written by backupNostrVerificationEvents.mjs
 * (backup/, gitignored), asks every target relay which of the backed-up ids it
 * stores, and publishes each event to exactly the relays that miss it. The
 * events are sent as stored, with their original signatures; nothing is
 * re-signed. Events whose signature does not verify are reported and skipped.
 *
 * Dry run by default: prints what is missing where. Pass --publish to send.
 *
 *   node scripts/nostr/republishBackupEvents.mjs [--publish] [--kinds 30023,30301|all] [--grep <text>]
 *
 *   --kinds   backup kinds to process (default: 30023, the community opinions).
 *   --grep    only events whose d tag, i tag or content contains <text>
 *             (case-insensitive), e.g. --grep zeus.
 *
 * Opinions (kind 30023) target the opinion widget's relay set; every other
 * kind targets eventRelayUrls. Unlike checkBackupEventsOnRelays.mjs there is no
 * created_at cutoff: the opinions worth restoring are precisely the old ones
 * that only ever lived on public relays and were dropped there.
 */

import { verifyEvent } from "nostr-tools/pure";
import {
  connectNostr,
  disconnectNostr,
  fetchEvents,
  getPool,
  publishEvent,
} from "../../src/nostr-client.mjs";
import { eventRelayUrls, opinionKind } from "../../src/nostr-constants.mjs";
import { opinionRelayUrls } from "../../src/opinions/constants.mjs";
import { getFirstTagValue } from "../../src/verifications_common.mjs";
import { printRefreshSubsection } from "../refresh-ui.mjs";
import { BACKUP_BASE_DIR, BACKUP_KINDS, loadAllBackupEvents } from "./backupEvents.mjs";

global.WebSocket = WebSocket;

const CONNECT_TIMEOUT_MS = 5000;
/** Per-relay EOSE wait for one id batch. */
const QUERY_EOSE_MS = 8000;
/** Hard ceiling per id batch, in case a relay never sends EOSE. */
const FETCH_TIMEOUT_MS = 15000;
const ID_BATCH_SIZE = 250;
/** Pause between publishes; nostr.mom rate-limits bursts. */
const PUBLISH_PAUSE_MS = 100;
const MAX_LISTED_PER_RELAY = 60;

function parseArgs(argv) {
  const args = { publish: false, kinds: [opinionKind], grep: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--publish") {
      args.publish = true;
    } else if (arg === "--kinds") {
      const value = argv[++i] ?? "";
      args.kinds = value === "all"
        ? BACKUP_KINDS
        : value.split(",").map(s => Number(s.trim())).filter(Number.isInteger);
      if (args.kinds.length === 0) {
        throw new Error(`--kinds needs a comma-separated kind list or "all", got "${value}"`);
      }
    } else if (arg === "--grep") {
      args.grep = (argv[++i] ?? "").toLowerCase();
      if (!args.grep) {
        throw new Error("--grep needs a text argument");
      }
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function relayUrlsForKind(kind) {
  return kind === opinionKind ? opinionRelayUrls : eventRelayUrls;
}

function matchesGrep(event, needle) {
  if (!needle) {
    return true;
  }
  const haystack = [
    getFirstTagValue(event, "d"),
    getFirstTagValue(event, "i"),
    event.content,
  ].filter(Boolean).join("\n").toLowerCase();
  return haystack.includes(needle);
}

function describeEvent(event) {
  const date = event.created_at
    ? new Date(event.created_at * 1000).toISOString().split("T")[0]
    : "unknown-date";
  const parts = [event.id.slice(0, 16), `kind ${event.kind}`, date];
  const subject = getFirstTagValue(event, "d") || getFirstTagValue(event, "i");
  if (subject) {
    parts.push(subject);
  }
  return parts.join("  ");
}

async function fetchIdsOnRelay(url, eventIds) {
  const found = new Set();
  for (let i = 0; i < eventIds.length; i += ID_BATCH_SIZE) {
    const batch = eventIds.slice(i, i + ID_BATCH_SIZE);
    const events = await Promise.race([
      fetchEvents({ ids: batch }, { relayUrls: [url], maxWait: QUERY_EOSE_MS }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("fetch timeout")), FETCH_TIMEOUT_MS)
      ),
    ]);
    for (const event of events) {
      found.add(event.id);
    }
  }
  return found;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  printRefreshSubsection("Backup events to re-publish");
  console.log(`  mode   : ${args.publish ? "PUBLISH" : "dry run (pass --publish to send)"}`);
  console.log(`  kinds  : ${args.kinds.join(", ")}`);
  if (args.grep) {
    console.log(`  grep   : ${args.grep}`);
  }

  const loaded = loadAllBackupEvents(args.kinds);
  const selected = loaded.filter(event => matchesGrep(event, args.grep));
  const valid = [];
  const invalid = [];
  for (const event of selected) {
    (verifyEvent(event) ? valid : invalid).push(event);
  }
  console.log(`  backup : ${loaded.length} event(s) under ${BACKUP_BASE_DIR}, ${selected.length} selected, ${valid.length} with a valid signature`);
  for (const event of invalid) {
    console.log(`  SKIP invalid signature  ${describeEvent(event)}`);
  }
  if (valid.length === 0) {
    console.log("\nNothing to do.");
    return 0;
  }

  const targetUrls = [...new Set(valid.flatMap(event => relayUrlsForKind(event.kind)))];
  console.log("\nConnecting to relays...");
  await connectNostr({ relayUrls: targetUrls, readRelayUrls: targetUrls, connectTimeoutMs: CONNECT_TIMEOUT_MS });
  const status = getPool().listConnectionStatus();
  const connectedUrls = targetUrls.filter(url => status.get(url));
  const unreachableUrls = targetUrls.filter(url => !status.get(url));
  for (const url of unreachableUrls) {
    console.warn(`  unreachable: ${url} (skipped)`);
  }
  if (connectedUrls.length === 0) {
    throw new Error("Could not connect to any target relay");
  }
  console.log(`  connected ${connectedUrls.length}/${targetUrls.length} relay(s)`);

  // relay url -> events the relay should hold but does not
  const missingByRelay = new Map();
  const ids = valid.map(event => event.id);
  for (const url of connectedUrls) {
    const wanted = valid.filter(event => relayUrlsForKind(event.kind).includes(url));
    process.stdout.write(`  ${url}: querying ${wanted.length} id(s)...`);
    let present;
    try {
      present = await fetchIdsOnRelay(url, ids);
    } catch (error) {
      console.log(` FAILED (${error.message}); skipped`);
      continue;
    }
    const missing = wanted.filter(event => !present.has(event.id));
    missingByRelay.set(url, missing);
    console.log(` holds ${wanted.length - missing.length}, missing ${missing.length}`);
  }

  printRefreshSubsection("Missing per relay");
  const toPublish = new Map(); // event id -> { event, urls }
  for (const [url, missing] of missingByRelay) {
    console.log(`\n  ${url}: ${missing.length} missing`);
    missing
      .slice()
      .sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
      .slice(0, MAX_LISTED_PER_RELAY)
      .forEach(event => console.log(`    - ${describeEvent(event)}`));
    if (missing.length > MAX_LISTED_PER_RELAY) {
      console.log(`    ... and ${missing.length - MAX_LISTED_PER_RELAY} more`);
    }
    for (const event of missing) {
      const entry = toPublish.get(event.id) ?? { event, urls: [] };
      entry.urls.push(url);
      toPublish.set(event.id, entry);
    }
  }
  console.log(`\n  ${toPublish.size} event(s) are missing from at least one reachable relay.`);

  if (!args.publish) {
    console.log("  Dry run: nothing published. Re-run with --publish to send them.");
    return 0;
  }
  if (toPublish.size === 0) {
    return 0;
  }

  printRefreshSubsection("Publishing");
  const okByRelay = new Map(connectedUrls.map(url => [url, 0]));
  const failures = [];
  for (const { event, urls } of toPublish.values()) {
    const summary = await publishEvent(event, urls);
    for (const url of urls) {
      if (!summary.failures.some(failure => failure.url === url)) {
        okByRelay.set(url, okByRelay.get(url) + 1);
      }
    }
    for (const failure of summary.failures) {
      failures.push({ event, ...failure });
    }
    await sleep(PUBLISH_PAUSE_MS);
  }
  for (const [url, count] of okByRelay) {
    const attempted = missingByRelay.get(url)?.length ?? 0;
    if (attempted > 0) {
      console.log(`  ${url}: accepted ${count}/${attempted}`);
    }
  }
  if (failures.length > 0) {
    console.log(`\n  ${failures.length} rejection(s):`);
    for (const { event, url, error } of failures) {
      console.log(`    - ${url}  ${describeEvent(event)}  ${error}`);
    }
  }

  // Ask again: an OK is a promise, the relay's answer to a REQ is the proof.
  printRefreshSubsection("Verification after publish");
  let stillMissing = 0;
  for (const [url, missing] of missingByRelay) {
    if (missing.length === 0) {
      continue;
    }
    let present;
    try {
      present = await fetchIdsOnRelay(url, missing.map(event => event.id));
    } catch (error) {
      console.log(`  ${url}: re-check failed (${error.message})`);
      stillMissing += missing.length;
      continue;
    }
    const absent = missing.filter(event => !present.has(event.id));
    stillMissing += absent.length;
    console.log(`  ${url}: now holds ${missing.length - absent.length}/${missing.length}`);
  }
  return stillMissing === 0 ? 0 : 2;
}

main()
  .then(async code => {
    await disconnectNostr();
    process.exit(code);
  })
  .catch(async error => {
    console.error(`Error: ${error.message}`);
    await disconnectNostr();
    process.exit(1);
  });
