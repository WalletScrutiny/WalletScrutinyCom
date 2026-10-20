#!/usr/bin/env node
/**
 * Publish the dependency triage statements (src/dependency-triage.mjs: Nostr
 * events, one per author and (advisory, direct user), saying whether an
 * advisory affects whoever uses the package that way) next to the
 * source-analysis export, as _site/api/source-analysis/triage/<appId>.json
 * per wallet: the statements that concern one of the wallet's advisories,
 * plus the trusted authors and the listed maintainers per package
 * (_data/dependencyTriage.yml), and the two lists alone as
 * triage/_trusted.json. The wallet page's Dependencies panel
 * resolves each row from them.
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
 * Runs after copy-source-analysis-export.mjs, which recreates the target
 * directory; without an export there is nothing to publish per wallet.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { SimplePool, verifyEvent, nip19 } from 'nostr-tools';
import { dependencyTriageKind, statementFromEvent, newestStatements, advisoryIdsOf } from '../src/dependency-triage.mjs';
import { safeName } from '../src/dependencies-panel-model.mjs';
import { eventRelayUrls, mainRelayUrl } from '../src/nostr-constants.mjs';

const SITE_DIR = process.env.SITE_DIR || '_site';
const EXPORT_DIR = join(SITE_DIR, 'api', 'source-analysis');
const TARGET = join(EXPORT_DIR, 'triage');
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

const DELETION_KIND = 5;

// Signed deletion requests for statements (NIP-09 with a `k` tag naming the kind).
export function acceptDeletions(events, { kind = dependencyTriageKind, verify = verifyEvent } = {}) {
  return (events || []).filter(e => e?.kind === DELETION_KIND && Array.isArray(e.tags)
    && e.tags.some(t => t[0] === 'k' && t[1] === String(kind)) && verify(e));
}

// Whether a deletion request by the statement's own author removes it.
export function isDeleted(statement, deletions, { kind = dependencyTriageKind } = {}) {
  const coordinate = `${kind}:${statement.pubkey}:${statement.d}`;
  return deletions.some(del => del.pubkey === statement.pubkey && del.tags.some(t =>
    (t[0] === 'e' && t[1] === statement.id) || (t[0] === 'a' && t[1] === coordinate && del.created_at >= statement.created_at)));
}

// Signed, well-formed statements from a list of events; anything else is dropped and counted.
export function acceptEvents(events, { kind = dependencyTriageKind, verify = verifyEvent } = {}) {
  const accepted = [];
  let rejected = 0;
  for (const event of events || []) {
    const statement = statementFromEvent(event, { kind });
    if (!statement || !verify(event)) {
      rejected++;
      continue;
    }
    accepted.push({ event, statement });
  }
  return { accepted, rejected };
}

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

// The export's wallets and the advisory ids their analysed releases name; alias stubs are skipped.
function exportApps(appsDir) {
  const apps = new Map();
  if (!existsSync(appsDir)) return apps;
  for (const file of readdirSync(appsDir).filter(f => f.endsWith('.json'))) {
    let doc;
    try {
      doc = JSON.parse(readFileSync(join(appsDir, file), 'utf8'));
    } catch {
      continue;
    }
    if (!doc || doc.alias || !doc.appId || !Array.isArray(doc.releases)) continue;
    apps.set(doc.appId, { ids: advisoryIdsOf(doc.releases), aliases: (doc.aliases || []).map(a => a.appId).filter(Boolean) });
  }
  return apps;
}

/**
 * Merge snapshot and relay events, publish per wallet, update the snapshot.
 * Pure apart from the files it is given; `events` are the relay's.
 */
export function buildTriage({ events = [], snapshotFile = SNAPSHOT_FILE, trustedFile = TRUSTED_FILE, exportDir = EXPORT_DIR, target = join(exportDir, 'triage'), kind = dependencyTriageKind, verify = verifyEvent, writeSnapshot = true } = {}) {
  const isDeletion = e => e?.kind === DELETION_KIND;
  const snapshotEvents = readSnapshot(snapshotFile);
  const snapshot = acceptEvents(snapshotEvents.filter(e => !isDeletion(e)), { kind, verify });
  const fresh = acceptEvents(events.filter(e => !isDeletion(e)), { kind, verify });
  const deletionEvents = [...snapshotEvents, ...events].filter(isDeletion);
  const deletionsById = new Map(acceptDeletions(deletionEvents, { kind, verify }).map(e => [e.id, e]));
  const deletions = [...deletionsById.values()];
  // newest per (author, subject) across both sources, then what its author deleted
  const byId = new Map([...snapshot.accepted, ...fresh.accepted].map(x => [x.event.id, x]));
  const newest = newestStatements([...byId.values()].map(x => x.statement));
  const statements = newest.filter(s => !isDeleted(s, deletions, { kind }));
  const keep = new Set(statements.map(s => s.id));
  const kept = [...byId.values()].filter(x => keep.has(x.event.id)).map(x => x.event);
  const trusted = trustedAuthors(trustedFile);
  const maintainers = listedMaintainers(trustedFile);

  const rejectedDeletions = deletionEvents.filter(e => !deletionsById.has(e.id)).length;
  const result = { statements: statements.length, trusted: trusted.length, rejected: snapshot.rejected + fresh.rejected + rejectedDeletions, deleted: newest.length - statements.length, apps: 0, published: 0, snapshotChanged: false };
  const before = JSON.stringify(snapshotEvents.map(e => e.id).sort());
  const toWrite = [...kept, ...deletions];
  const after = JSON.stringify(toWrite.map(e => e.id).sort());
  if (writeSnapshot && before !== after) {
    toWrite.sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
    writeFileSync(snapshotFile, `${JSON.stringify(toWrite, null, 1)}\n`);
    result.snapshotChanged = true;
  }

  const apps = exportApps(join(exportDir, 'apps'));
  if (!apps.size) return result;
  mkdirSync(target, { recursive: true });
  // The trusted list on its own, for wallets without a file yet: the panel's
  // Judge dialog tells a signer whether their statement settles rows.
  writeFileSync(join(target, '_trusted.json'), JSON.stringify({ schema: 2, trusted, maintainers }));
  for (const [appId, { ids }] of apps) {
    const mine = statements.filter(s => s.vulns.some(v => ids.has(v)));
    if (!mine.length) continue;
    writeFileSync(join(target, `${safeName(appId)}.json`), JSON.stringify({ schema: 4, appId, trusted, maintainers, statements: mine }));
    result.apps += 1;
    result.published += mine.length;
  }
  return result;
}

async function main() {
  if (!existsSync(SITE_DIR)) throw new Error(`${SITE_DIR} does not exist; run after the Jekyll build`);
  const events = process.env.DEPENDENCY_TRIAGE_RELAYS === 'off' ? [] : await pullEvents();
  const r = buildTriage({ events });
  console.log(`dependency triage: ${r.statements} statement(s) by any author (${r.rejected} event(s) rejected, ${r.deleted} deleted by their author), ${r.trusted} trusted author(s); ${r.published} published for ${r.apps} wallet(s) -> ${TARGET}${r.snapshotChanged ? `; ${SNAPSHOT_FILE} updated` : ''}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  // open relay sockets would keep the process alive after the files are written
  main().then(() => process.exit(0), (err) => {
    console.error(err.message);
    process.exit(1);
  });
}
