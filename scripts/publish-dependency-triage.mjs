#!/usr/bin/env node
/**
 * Publish one dependency triage statement (src/dependency-triage.mjs) from
 * the command line, signed with the key in DEPENDENCY_TRIAGE_NSEC:
 *
 *   DEPENDENCY_TRIAGE_NSEC=nsec1… node scripts/publish-dependency-triage.mjs \
 *     --vuln GHSA-67hx-6x53-jw92 --vuln CVE-2023-45133 \
 *     --package npm:@babel/traverse --via npm:@babel/core \
 *     --status not_affected --justification vulnerable_code_not_in_execute_path \
 *     --content "babel/core only compiles the project's own sources"
 *
 * `--via <ecosystem:name>` is the direct user the statement is about,
 * `--app <appId>` a wallet's own use, neither the package itself. `--dry-run`
 * prints the signed event instead of publishing. Relays: the project relay
 * (which stores the kind once external/configs/strfry/kind-policy.py is
 * deployed) and the site's public relays; one acceptance is enough.
 */

import { SimplePool, finalizeEvent, nip19, getPublicKey } from 'nostr-tools';
import { triageTemplate, TRIAGE_STATUSES, TRIAGE_JUSTIFICATIONS } from '../src/dependency-triage.mjs';
import { eventRelayUrls, mainRelayUrl } from '../src/nostr-constants.mjs';

const RELAYS = [...new Set([mainRelayUrl, ...eventRelayUrls])];

function parseArgs(argv) {
  const out = { vulns: [], dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => { if (i + 1 >= argv.length) throw new Error(`${a} needs a value`); return argv[++i]; };
    if (a === '--vuln') out.vulns.push(next());
    else if (a === '--package') out.pkg = next();
    else if (a === '--via') out.via = next();
    else if (a === '--app') out.app = next();
    else if (a === '--status') out.status = next();
    else if (a === '--justification') out.justification = next();
    else if (a === '--versions') out.versions = next();
    else if (a === '--content') out.content = next();
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`unknown argument ${a}`);
  }
  return out;
}

function usage() {
  return `usage: publish-dependency-triage.mjs --vuln <id> [--vuln <alias>] --package <eco:name> [--via <eco:name> | --app <appId>] --status <${TRIAGE_STATUSES.join('|')}> [--justification <${TRIAGE_JUSTIFICATIONS.join('|')}>] [--versions <text>] --content <prose> [--dry-run]`;
}

export function secretKeyFromEnv(env = process.env) {
  const raw = (env.DEPENDENCY_TRIAGE_NSEC || '').trim();
  if (!raw) throw new Error('DEPENDENCY_TRIAGE_NSEC is not set (an nsec1… key)');
  const decoded = nip19.decode(raw);
  if (decoded.type !== 'nsec') throw new Error('DEPENDENCY_TRIAGE_NSEC is not an nsec');
  return decoded.data;
}

export async function publishStatement(fields, { secretKey, relays = RELAYS, dryRun = false, timeoutMs = 10_000, log = console } = {}) {
  const event = finalizeEvent(triageTemplate(fields), secretKey);
  if (dryRun) {
    log.log(JSON.stringify(event, null, 2));
    return { event, accepted: [], rejected: [] };
  }
  const pool = new SimplePool();
  try {
    const results = await Promise.allSettled(pool.publish(relays, event).map((p, i) => Promise.race([
      p.then(() => relays[i]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ])));
    const accepted = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const rejected = results.map((r, i) => (r.status === 'rejected' ? `${relays[i]}: ${r.reason?.message || r.reason}` : null)).filter(Boolean);
    for (const r of rejected) log.warn(`  rejected ${r}`);
    log.log(`${event.id} (${nip19.npubEncode(getPublicKey(secretKey))}) accepted by ${accepted.length} of ${relays.length} relay(s): ${accepted.join(' ')}`);
    if (!accepted.length) throw new Error('no relay accepted the statement');
    return { event, accepted, rejected };
  } finally {
    pool.close(relays);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  await publishStatement(args, { secretKey: secretKeyFromEnv(), dryRun: args.dryRun });
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  // open relay sockets would keep the process alive after the result is in
  main().then(() => process.exit(0), (err) => {
    console.error(err.message);
    console.error(usage());
    process.exit(1);
  });
}
