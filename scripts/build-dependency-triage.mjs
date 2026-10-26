#!/usr/bin/env node
/**
 * Publish the dependency triage statements (src/dependency-triage.mjs: Nostr
 * events, one per author and (advisory, direct user), saying whether an
 * advisory affects whoever uses the package that way) for the wallet pages,
 * under _site/api/dependency-triage/:
 *
 *   statements.json  every statement seen so far (newest per author and
 *                    subject, parsed), the deletion requests, and the trusted
 *                    authors and listed maintainers per package
 *                    (_data/dependencyTriage.yml). The page merges in what
 *                    the relay has now (mergeLiveTriage), so the statements
 *                    here are the fallback for what a relay dropped, not the
 *                    freshness; only the two lists need a site build to change.
 *
 * Sources, merged, newest per (author, subject) wins:
 *   - the relays (dependencyTriageKind, every author: who signed decides the
 *     weight, not whether it is kept), 15 s per relay at most;
 *   - _data/dependencyTriageEvents.json, the committed snapshot of every
 *     statement seen so far, signed events verified on read, so a build
 *     without relay access still has them and a relay that drops events
 *     loses nothing. Rewritten after the pull when anything is new.
 *
 * A deletion request (NIP-09, kind 5, `k` tag the statement kind) by a
 * statement's author removes it: the request names the event (`e`) or the
 * subject (`a`, kind:pubkey:d; then every version up to the request's time).
 * Requests are kept in the snapshot too, so a relay that still serves the
 * statement does not bring it back.
 *
 * Kept apart from /api/source-analysis/, which the analyser publishes to the
 * web server itself (external/source_analysis/publish.mjs).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { SimplePool, verifyEvent, nip19 } from 'nostr-tools';
import { dependencyTriageKind, DELETION_KIND, acceptEvents, acceptDeletions, isDeleted, mergeTriageEvents } from '../src/dependency-triage.mjs';
import { eventRelayUrls, mainRelayUrl } from '../src/nostr-constants.mjs';

const SITE_DIR = process.env.SITE_DIR || '_site';
const TARGET = join(SITE_DIR, 'api', 'dependency-triage');
export const SNAPSHOT_FILE = join('_data', 'dependencyTriageEvents.json');
export const TRUSTED_FILE = join('_data', 'dependencyTriage.yml');
export const TRIAGE_RELAY_URLS = [...new Set([mainRelayUrl, ...eventRelayUrls])];
const RELAY_MAX_WAIT_MS = 15_000;

export function trustedAuthors(file = TRUSTED_FILE) {
  if (!existsSync(file)) return [];
  const doc = yaml.load(readFileSync(file, 'utf8'));
  return (doc?.trustedAuthors || []).map(npub => nip19.decode(String(npub).trim()).data);
}

// Listed maintainers per package reference ("npm:graphql-request": [hex]):
// their statement about how that package uses a dependency holds for every
// wallet (src/dependency-triage.mjs, statementScope).
export function listedMaintainers(file = TRUSTED_FILE) {
  if (!existsSync(file)) return {};
  const doc = yaml.load(readFileSync(file, 'utf8'));
  const out = {};
  for (const [pkg, npubs] of Object.entries(doc?.maintainers || {})) {
    const keys = (npubs || []).map(npub => nip19.decode(String(npub).trim()).data);
    if (keys.length) out[pkg] = keys;
  }
  return out;
}

export { acceptEvents, acceptDeletions, isDeleted };

export function readSnapshot(file = SNAPSHOT_FILE) {
  if (!existsSync(file)) return [];
  try {
    const list = JSON.parse(readFileSync(file, 'utf8'));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Every statement event from the relays; a relay that fails or stalls is skipped.
export async function pullEvents({ relayUrls = TRIAGE_RELAY_URLS, kind = dependencyTriageKind, maxWait = RELAY_MAX_WAIT_MS, log = console } = {}) {
  const pool = new SimplePool();
  try {
    const [events, deletions] = await Promise.all([
      pool.querySync(relayUrls, { kinds: [kind] }, { maxWait }),
      pool.querySync(relayUrls, { kinds: [DELETION_KIND], '#k': [String(kind)] }, { maxWait }),
    ]);
    events.push(...deletions);
    log.log(`dependency triage: ${events.length} event(s) from ${relayUrls.length} relay(s)`);
    return events;
  } catch (error) {
    log.warn(`dependency triage: relay pull failed (${error.message}); using the snapshot only`);
    return [];
  } finally {
    pool.close(relayUrls);
  }
}

/**
 * Merge snapshot and relay events, write statements.json, update the
 * snapshot. Pure apart from the files it is given; `events` are the relay's.
 */
export function buildTriage({ events = [], snapshotFile = SNAPSHOT_FILE, trustedFile = TRUSTED_FILE, target = TARGET, kind = dependencyTriageKind, verify = verifyEvent, writeSnapshot = true } = {}) {
  const snapshotEvents = readSnapshot(snapshotFile);
  const merged = mergeTriageEvents(snapshotEvents, events, { kind, verify });
  const trusted = trustedAuthors(trustedFile);
  const maintainers = listedMaintainers(trustedFile);
  const result = { statements: merged.statements.length, trusted: trusted.length, rejected: merged.rejected, deleted: merged.deleted, published: 0, snapshotChanged: false };
  const toWrite = [...merged.kept, ...merged.deletions].sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
  if (writeSnapshot && JSON.stringify(snapshotEvents.map(e => e.id).sort()) !== JSON.stringify(toWrite.map(e => e.id).sort())) {
    writeFileSync(snapshotFile, `${JSON.stringify(toWrite, null, 1)}\n`);
    result.snapshotChanged = true;
  }
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'statements.json'), JSON.stringify({ schema: 1, trusted, maintainers, statements: merged.statements, deletions: merged.deletions }));
  result.published = merged.statements.length;
  return result;
}

async function main() {
  if (!existsSync(SITE_DIR)) throw new Error(`${SITE_DIR} does not exist; run after the Jekyll build`);
  const events = process.env.DEPENDENCY_TRIAGE_RELAYS === 'off' ? [] : await pullEvents();
  const r = buildTriage({ events });
  console.log(`dependency triage: ${r.statements} statement(s) by any author (${r.rejected} event(s) rejected, ${r.deleted} deleted by their author), ${r.trusted} trusted author(s); ${r.published} published -> ${TARGET}${r.snapshotChanged ? `; ${SNAPSHOT_FILE} updated` : ''}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  // open relay sockets would keep the process alive after the files are written
  main().then(() => process.exit(0), (err) => {
    console.error(err.message);
    process.exit(1);
  });
}
