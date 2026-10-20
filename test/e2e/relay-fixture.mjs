/**
 * Playwright `test` with a fake Nostr relay behind every page WebSocket.
 *
 * The site still runs its real code (nostr-tools, subscriptions, signature
 * checks, rendering). Only the socket is answered from a checked-in event set
 * instead of the live relays, so tests no longer wait on relay latency.
 *
 *   (default)         replay fixtures/relay-events.json
 *   E2E_RELAY=live    pass every socket through to the real relay
 *   E2E_RELAY=record  pass through and append every received event to
 *                     test-results/relay-record/ (merge: scripts/record-e2e-relay.mjs)
 */

import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { test as base, expect } from '@playwright/test';

const FIXTURE_PATH = fileURLToPath(new URL('./fixtures/relay-events.json', import.meta.url));
const RECORD_DIR = join(process.cwd(), 'test-results', 'relay-record');

const mode = process.env.E2E_RELAY || 'replay';
/**
 * Answer delay of the fake relay. The ZEUS verification link opens its modal
 * from the URL hash before allWallets.js has set window.wallets; against an
 * instant relay the title then shows the app id instead of the wallet name.
 * Live relays always took longer than that script, so a short delay keeps the
 * order they produced.
 */
const REPLAY_DELAY_MS = Number(process.env.E2E_RELAY_DELAY_MS ?? 100);

let eventStore;
function loadEvents() {
  eventStore ??= JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));
  return eventStore;
}

/** NIP-01 filter match for the filter fields the site uses (ids, authors, kinds, since, until, #x tags). */
export function matchesFilter(event, filter) {
  if (filter.ids && !filter.ids.includes(event.id)) return false;
  if (filter.authors && !filter.authors.includes(event.pubkey)) return false;
  if (filter.kinds && !filter.kinds.includes(event.kind)) return false;
  if (filter.since !== undefined && event.created_at < filter.since) return false;
  if (filter.until !== undefined && event.created_at > filter.until) return false;
  for (const [key, values] of Object.entries(filter)) {
    if (key[0] !== '#') continue;
    const name = key.slice(1);
    if (!event.tags.some((tag) => tag[0] === name && values.includes(tag[1]))) return false;
  }
  return true;
}

/** Events answering a REQ: union over the filters, each filter newest-first and capped by its limit. */
export function queryEvents(events, filters) {
  const seen = new Set();
  const out = [];
  for (const filter of filters) {
    const hits = events.filter((event) => matchesFilter(event, filter));
    const capped = filter.limit === undefined ? hits : hits.slice(0, filter.limit);
    for (const event of capped) {
      if (!seen.has(event.id)) {
        seen.add(event.id);
        out.push(event);
      }
    }
  }
  return out;
}

function replay(ws) {
  const events = loadEvents();
  ws.onMessage(async (raw) => {
    let message;
    try {
      message = JSON.parse(String(raw));
    } catch {
      return;
    }
    const [type, ...rest] = message;
    if (REPLAY_DELAY_MS > 0 && type !== 'CLOSE') {
      await new Promise((resolve) => setTimeout(resolve, REPLAY_DELAY_MS));
    }
    if (type === 'REQ') {
      const [subId, ...filters] = rest;
      for (const event of queryEvents(events, filters)) {
        ws.send(JSON.stringify(['EVENT', subId, event]));
      }
      ws.send(JSON.stringify(['EOSE', subId]));
    } else if (type === 'COUNT') {
      const [subId, ...filters] = rest;
      ws.send(JSON.stringify(['COUNT', subId, { count: queryEvents(events, filters).length }]));
    } else if (type === 'EVENT') {
      // Publishes are accepted and dropped: nothing leaves the test.
      ws.send(JSON.stringify(['OK', rest[0]?.id, true, '']));
    } else if (type === 'NEG-OPEN') {
      ws.send(JSON.stringify(['NEG-ERR', rest[0], 'unsupported: negentropy']));
    }
    // CLOSE needs no answer.
  });
}

function record(ws) {
  const server = ws.connectToServer();
  mkdirSync(RECORD_DIR, { recursive: true });
  const file = join(RECORD_DIR, `${process.pid}.jsonl`);
  ws.onMessage((message) => server.send(message));
  server.onMessage((raw) => {
    ws.send(raw);
    try {
      const message = JSON.parse(String(raw));
      if (message[0] === 'EVENT' && message[2]?.id) {
        appendFileSync(file, `${JSON.stringify(message[2])}\n`);
      }
    } catch {
      // not JSON: nothing to record
    }
  });
}

export const test = base.extend({
  context: async ({ context }, use) => {
    if (mode !== 'live') {
      await context.routeWebSocket(/^wss?:\/\/(?!(127\.0\.0\.1|localhost)[:/])/, mode === 'record' ? record : replay);
    }
    await use(context);
  },
});

export { expect };
