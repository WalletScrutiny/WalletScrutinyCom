/**
 * Generates _includes/allOpinions.json: per-product sentiment counts of the
 * Nostr opinions (kind 30023) published by the trusted authors.
 *
 * Sources, merged event by event (newest event per author + `d` tag wins):
 *   1. every relay in OPINION_RELAY_URLS
 *   2. the local backup written by backupNostrVerificationEvents.mjs
 *      (backup/nostr-opinion-events/30023/*.json, gitignored)
 * Products that have no event in any source keep the counts already committed
 * in _includes/allOpinions.json, so a relay dropping events (nos.lol did,
 * 2026-09-30) can never silently empty the file. Exits non-zero, without
 * writing, when no source returns a single opinion.
 */

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { verifyEvent } from 'nostr-tools/pure';
import {
  connectNostr,
  disconnectNostr,
  fetchEvents,
  nip19,
} from '../src/nostr-client.mjs';
import { explicitRelayUrls, opinionKind, profileRelayUrl } from '../src/nostr-constants.mjs';

const OUTPUT_FILE = '_includes/allOpinions.json';
const BACKUP_DIR = path.join('backup', 'nostr-opinion-events', String(opinionKind));
const RELAY_MAX_WAIT_MS = 15_000;

/** Site relays plus the nostr-opinion-plugin defaults (purplepag.es excluded: profiles only). */
const OPINION_RELAY_URLS = [
  ...explicitRelayUrls.filter((url) => url !== profileRelayUrl),
  'wss://relay.nostr.band/',
  'wss://offchain.pub/',
  'wss://nostr-pub.wellorder.net/',
  'wss://nostr.wine/',
];

// todo: shouldn't have to configure the trusted authors twice in this project
// (also in _includes/review/nostrOpinion.html)
const TRUSTED_AUTHORS = [
  'npub1gm7tuvr9atc6u7q3gevjfeyfyvmrlul4y67k7u7hcxztz67ceexs078rf6', // Leo
  'npub1r709glp0xx2zvgac45wswufjst5xgr7cear5a8me7x9vazhjzmksp2sf7d', // Danny
  'npub1mtd7s63xd85ykv09p7y8wvg754jpsfpplxknh5xr0pu938zf86fqygqxas', // The Bitcoin Hole
].map((npub) => nip19.decode(npub).data);

/**
 * Mobile pages use subject keys `mobile/{slug}`. Historical Nostr opinions still
 * use `android/{appId}` / `iphone/{appId}`. Aggregate all known aliases under the
 * canonical `mobile/{slug}` key that fewWallets.js / allWallets.js look up.
 */
async function mobileWalletTargets () {
  const targets = [];
  const dir = '_mobile';
  for (const file of await fsp.readdir(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = await fsp.readFile(path.join(dir, file), 'utf8');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    let doc;
    try {
      doc = yaml.load(m[1]);
    } catch {
      continue;
    }
    const keys = new Set([`mobile/${slug}`]);
    if (doc?.android?.appId) {
      keys.add(`android/${doc.android.appId}`);
    }
    if (doc?.iphone?.appId) {
      keys.add(`iphone/${doc.iphone.appId}`);
    }
    targets.push({ outKey: `mobile/${slug}`, keys: [...keys] });
  }
  return targets;
}

async function categoryTargets (category) {
  const dir = `_${category}`;
  return (await fsp.readdir(dir))
    .filter((n) => n.endsWith('.md'))
    .map((n) => {
      const id = n.replace(/\.md$/, '');
      const key = `${category}/${id}`;
      return { outKey: key, keys: [key] };
    });
}

const getTargets = async () => {
  const mobile = await mobileWalletTargets();
  const other = await Promise.all(
    ['hardware', 'bearer', 'desktop'].map(categoryTargets)
  );
  return [...mobile, ...other.flat()];
};

const tagValue = (event, name) => event.tags.find((t) => t[0] === name)?.[1];

function isTrustedOpinion (event) {
  return event.kind === opinionKind &&
    TRUSTED_AUTHORS.includes(event.pubkey) &&
    Boolean(tagValue(event, 'd'));
}

/** Keeps the newest event per author + `d` (kind 30023 is parameterized replaceable). */
function addOpinion (opinions, event) {
  const key = `${event.pubkey}:${tagValue(event, 'd')}`;
  const known = opinions.get(key);
  if (!known || known.created_at < event.created_at) {
    opinions.set(key, event);
  }
}

async function fetchRelayOpinions (opinions) {
  const filter = { kinds: [opinionKind], authors: TRUSTED_AUTHORS };
  const failed = [];
  await connectNostr({
    relayUrls: OPINION_RELAY_URLS,
    connectTimeoutMs: 5000,
    onRelayError: ({ url }) => failed.push(url),
  });
  let total = 0;
  for (const url of OPINION_RELAY_URLS) {
    if (failed.includes(url)) {
      console.log(`  ${url}: connection failed`);
      continue;
    }
    const events = await fetchEvents(filter, { relayUrls: [url], maxWait: RELAY_MAX_WAIT_MS });
    let accepted = 0;
    for (const event of events) {
      if (!isTrustedOpinion(event)) continue;
      addOpinion(opinions, event);
      accepted++;
    }
    console.log(`  ${url}: ${accepted} opinions`);
    total += accepted;
  }
  await disconnectNostr();
  return total;
}

async function loadBackupOpinions (opinions) {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log(`  no local backup at ${BACKUP_DIR}`);
    return 0;
  }
  let accepted = 0;
  let invalid = 0;
  for (const file of fs.readdirSync(BACKUP_DIR)) {
    if (!file.endsWith('.json')) continue;
    let event;
    try {
      event = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8'));
    } catch {
      invalid++;
      continue;
    }
    if (!isTrustedOpinion(event) || !verifyEvent(event)) {
      invalid++;
      continue;
    }
    addOpinion(opinions, event);
    accepted++;
  }
  console.log(`  ${BACKUP_DIR}: ${accepted} opinions (${invalid} skipped)`);
  return accepted;
}

function loadCommittedCounts () {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  } catch (error) {
    console.log(`  no usable ${OUTPUT_FILE} to carry over (${error.message})`);
    return {};
  }
}

const SENTIMENTS = { '1': 'positive', '0': 'neutral', '-1': 'negative' };

/** Sentiment counts for one output key; zero counts are omitted, as the widget expects. */
function countSentiments (opinions, keys) {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  for (const event of opinions.values()) {
    if (!keys.includes(tagValue(event, 'd'))) continue;
    const sentiment = SENTIMENTS[tagValue(event, 'sentiment')];
    if (sentiment) counts[sentiment]++;
  }
  return Object.fromEntries(Object.entries(counts).filter(([, n]) => n > 0));
}

// Format the JSON with one line per top-level key for better diffs
const formatJson = (obj) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '{}';

  const formattedEntries = entries.map(([key, value]) =>
    `  "${key}":${JSON.stringify(value)}`
  );

  return `{\n${formattedEntries.join(',\n')}\n}`;
};

async function main () {
  const targets = await getTargets();
  const opinions = new Map();

  console.log('Fetching opinions from relays...');
  const fromRelays = await fetchRelayOpinions(opinions);
  console.log('Loading opinions from the local backup...');
  const fromBackup = await loadBackupOpinions(opinions);
  console.log(`${opinions.size} distinct opinions (${fromRelays} from relays, ${fromBackup} from backup)`);

  if (opinions.size === 0) {
    console.error(`ERROR: no opinion events from any relay or backup; keeping ${OUTPUT_FILE} untouched`);
    process.exit(1);
  }

  const committed = loadCommittedCounts();
  const all = {};
  const carriedOver = [];
  for (const { outKey, keys } of targets) {
    const counts = countSentiments(opinions, keys);
    if (Object.keys(counts).length > 0) {
      all[outKey] = counts;
    } else if (committed[outKey]) {
      all[outKey] = committed[outKey];
      carriedOver.push(outKey);
    }
  }
  if (carriedOver.length > 0) {
    console.warn(`WARNING: no event found for ${carriedOver.length} products; keeping their committed counts: ${carriedOver.join(', ')}`);
  }

  await fsp.writeFile(OUTPUT_FILE, formatJson(all));
  console.log(`Wrote ${Object.keys(all).length} products to ${OUTPUT_FILE}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('ERROR:', error);
    process.exit(1);
  });
