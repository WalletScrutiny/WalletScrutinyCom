#!/usr/bin/env node
/**
 * Publish the dependency triage statements (src/dependency-triage.mjs: Nostr
 * events, one per author and (advisory, direct user), saying whether an
 * advisory affects whoever uses the package that way) next to the
 * source-analysis export, as _site/api/source-analysis/triage/<appId>.json
 * per wallet: the statements that concern one of the wallet's advisories,
 * plus the trusted-author list (_data/dependencyTriage.yml), and the list
 * alone as triage/_trusted.json. The wallet page's Dependencies panel
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
    const events = await pool.querySync(relayUrls, { kinds: [kind] }, { maxWait });
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
  const snapshot = acceptEvents(readSnapshot(snapshotFile), { kind, verify });
  const fresh = acceptEvents(events, { kind, verify });
  // newest per (author, subject) across both sources
  const byId = new Map([...snapshot.accepted, ...fresh.accepted].map(x => [x.event.id, x]));
  const statements = newestStatements([...byId.values()].map(x => x.statement));
  const keep = new Set(statements.map(s => s.id));
  const kept = [...byId.values()].filter(x => keep.has(x.event.id));
  const trusted = trustedAuthors(trustedFile);

  const result = { statements: statements.length, trusted: trusted.length, rejected: snapshot.rejected + fresh.rejected, apps: 0, published: 0, snapshotChanged: false };
  const before = JSON.stringify(readSnapshot(snapshotFile).map(e => e.id).sort());
  const after = JSON.stringify(kept.map(x => x.event.id).sort());
  if (writeSnapshot && before !== after) {
    kept.sort((a, b) => a.event.created_at - b.event.created_at || a.event.id.localeCompare(b.event.id));
    writeFileSync(snapshotFile, `${JSON.stringify(kept.map(x => x.event), null, 1)}\n`);
    result.snapshotChanged = true;
  }

  const apps = exportApps(join(exportDir, 'apps'));
  if (!apps.size) return result;
  mkdirSync(target, { recursive: true });
  // The trusted list on its own, for wallets without a file yet: the panel's
  // Judge dialog tells a signer whether their statement settles rows.
  writeFileSync(join(target, '_trusted.json'), JSON.stringify({ schema: 1, trusted }));
  for (const [appId, { ids }] of apps) {
    const mine = statements.filter(s => s.vulns.some(v => ids.has(v)));
    if (!mine.length) continue;
    writeFileSync(join(target, `${safeName(appId)}.json`), JSON.stringify({ schema: 3, appId, trusted, statements: mine }));
    result.apps += 1;
    result.published += mine.length;
  }
  return result;
}

async function main() {
  if (!existsSync(SITE_DIR)) throw new Error(`${SITE_DIR} does not exist; run after the Jekyll build`);
  const events = process.env.DEPENDENCY_TRIAGE_RELAYS === 'off' ? [] : await pullEvents();
  const r = buildTriage({ events });
  console.log(`dependency triage: ${r.statements} statement(s) by any author (${r.rejected} event(s) rejected), ${r.trusted} trusted author(s); ${r.published} published for ${r.apps} wallet(s) -> ${TARGET}${r.snapshotChanged ? `; ${SNAPSHOT_FILE} updated` : ''}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  // open relay sockets would keep the process alive after the files are written
  main().then(() => process.exit(0), (err) => {
    console.error(err.message);
    process.exit(1);
  });
}
