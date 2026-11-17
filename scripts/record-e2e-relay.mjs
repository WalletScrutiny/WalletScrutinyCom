#!/usr/bin/env node
/**
 * Refresh test/e2e/fixtures/relay-events.json from the live relays.
 * Runs the E2E suite once with E2E_RELAY=record, then merges every event the
 * pages received into the fixture (deduplicated by id, sorted newest first).
 * Usage: PLAYWRIGHT_SKIP_BUILD=1 node scripts/record-e2e-relay.mjs
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const recordDir = join('test-results', 'relay-record');
const fixturePath = join('test', 'e2e', 'fixtures', 'relay-events.json');

rmSync(recordDir, { recursive: true, force: true });
const run = spawnSync('npx', ['playwright', 'test'], {
  stdio: 'inherit',
  env: { ...process.env, E2E_RELAY: 'record' },
});

const events = new Map();
for (const name of readdirSync(recordDir)) {
  for (const line of readFileSync(join(recordDir, name), 'utf8').split('\n')) {
    if (line) {
      const event = JSON.parse(line);
      events.set(event.id, event);
    }
  }
}
// Verification events carry whole build logs (up to 57 KB each; 12 MB of the 13 MB
// recorded). Keep the small ones plus the events the tests open by id and what
// those reference (script attachments and the verification they are based on).
const MAX_CONTENT_BYTES = 4000;
const KEEP_IDS = new Set([
  'e0d4f6afce7bff841dd6ed6a4d158baf9c98a5a547581e0969087202e6b248c9', // zeus-verification.spec.mjs
]);
for (const id of [...KEEP_IDS]) {
  for (const tag of events.get(id)?.tags ?? []) {
    if (tag[0] === 'file-attachment' || tag[0] === 'based-on') {
      KEEP_IDS.add(tag[1]);
    }
  }
}
for (const [id, event] of events) {
  if (event.kind === 30301 && event.content.length > MAX_CONTENT_BYTES && !KEEP_IDS.has(id)) {
    events.delete(id);
  }
}
// Every event is signature-checked in the page, so the count sets the load time:
// keep the newest few verifications per app.
const MAX_VERIFICATIONS_PER_APP = 5;
const perApp = new Map();
for (const event of [...events.values()].sort((a, b) => b.created_at - a.created_at)) {
  if (event.kind !== 30301 || KEEP_IDS.has(event.id)) {
    continue;
  }
  const appId = event.tags.find((tag) => tag[0] === 'i')?.[1];
  const kept = perApp.get(appId) ?? 0;
  perApp.set(appId, kept + 1);
  if (kept >= MAX_VERIFICATIONS_PER_APP) {
    events.delete(event.id);
  }
}
const sorted = [...events.values()].sort((a, b) => b.created_at - a.created_at || (a.id < b.id ? -1 : 1));
writeFileSync(fixturePath, `${JSON.stringify(sorted)}\n`);
console.log(`Wrote ${sorted.length} events to ${fixturePath}`);
process.exit(run.status ?? 1);
