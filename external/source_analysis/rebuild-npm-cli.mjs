#!/usr/bin/env node
// Rebuild the npm package versions most wallets share that nobody has
// reproduced yet (rebuildNpm.mjs), and store each result as our claim (ws) in
// package_rebuilds. Not part of the pass: the builds run untrusted code and
// belong on a machine other than the build host (issue 992 part G).
// Usage: node rebuild-npm-cli.mjs [--top N] [--scope app|any] [--retry] [--list] [--package name@version]...
//   --top N      how many candidates (default 5)
//   --scope app  only versions that end up in a wallet's app (default); any = build tooling too
//   --retry      include versions we tried before
//   --list       print the candidates, build nothing
// SOURCE_ANALYSIS_DB_PATH selects the database, SOURCE_ANALYSIS_REBUILD_DIR the scratch dir.
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { initDatabase, savePackageSource } from './ddbbUtils.mjs';
import { resolveRepo } from './sourceRepos.mjs';
import { lsRemoteTags, identityOf, npmProvenance } from './sourceIdentity.mjs';
import { rebuildNpm } from './rebuildNpm.mjs';
import { CACHE_DIR } from './config.mjs';

/** Exact npm versions ranked by how many wallets ship them, without a reproduced claim from anyone. */
export function rebuildCandidates(db, { top = 5, scope = 'app', retry = false } = {}) {
  return db.prepare(`
    SELECT p.name, p.version, COUNT(DISTINCT d.app_id) AS wallets
    FROM packages p JOIN app_dependencies d ON d.package_id = p.id
    WHERE p.ecosystem = 'npm' AND p.version GLOB '[0-9]*'
      ${scope === 'app' ? `AND d.scope = 'app'` : ''}
      AND NOT EXISTS (SELECT 1 FROM package_rebuilds r WHERE r.ecosystem = 'npm' AND r.name = p.name AND r.version = p.version
        AND (r.result = 'reproduced' ${retry ? '' : `OR r.claimant = 'ws'`}))
    GROUP BY p.name, p.version
    ORDER BY wallets DESC, p.name, p.version
    LIMIT ?
  `).all(top);
}

/** Repository and ref to build from: the stored identity check, else asked now (and stored). */
export async function sourceOf(db, name, version) {
  let src = db.prepare(`SELECT repo_url FROM package_sources WHERE ecosystem = 'npm' AND name = ?`).get(name);
  if (!src) {
    const r = await resolveRepo({ ecosystem: 'npm', name, version });
    savePackageSource(db, 'npm', name, r);
    src = { repo_url: r.url };
  }
  if (!src.repo_url) return null;
  let id = db.prepare(`SELECT tag, commit_sha FROM package_identity WHERE ecosystem = 'npm' AND name = ? AND version = ?`).get(name, version);
  if (!id) {
    const tags = await lsRemoteTags(src.repo_url).catch(() => null);
    const npm = await npmProvenance(name, version).catch(() => null);
    const r = identityOf({ ecosystem: 'npm', name, version }, tags, npm);
    db.prepare(`INSERT OR REPLACE INTO package_identity (ecosystem, name, version, status, tag, commit_sha, provenance, checked_at) VALUES ('npm', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`)
      .run(name, version, r.status, r.tag, r.commit, r.provenance === null ? null : (r.provenance ? 1 : 0));
    id = { tag: r.tag, commit_sha: r.commit };
  }
  const ref = id.tag || id.commit_sha;
  return ref ? { repoUrl: src.repo_url, ref, commit: id.commit_sha } : { repoUrl: src.repo_url, ref: null, commit: null };
}

export function saveOurRebuild(db, r) {
  db.prepare(`INSERT OR REPLACE INTO package_rebuilds (ecosystem, name, version, claimant, result, artifact, sha256, commit_sha, url, note, event, checked_at)
    VALUES ('npm', ?, ?, 'ws', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`)
    .run(r.name, r.version, r.result, r.artifact, r.sha256, r.commit, r.repoUrl, r.note, JSON.stringify(r.event));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { boolean: ['retry', 'list'], string: ['package', 'scope'], default: { top: 5, scope: 'app' } });
  const db = initDatabase();
  const wanted = [].concat(argv.package || []).map(s => { const at = s.lastIndexOf('@'); return { name: s.slice(0, at), version: s.slice(at + 1) }; });
  const todo = wanted.length ? wanted : rebuildCandidates(db, { top: Number(argv.top), scope: argv.scope, retry: argv.retry });
  if (argv.list) { for (const c of todo) console.log(`${c.wallets ?? '-'}\t${c.name}@${c.version}`); process.exit(0); }
  const workRoot = process.env.SOURCE_ANALYSIS_REBUILD_DIR || path.join(CACHE_DIR, 'rebuilds');
  const logs = path.join(workRoot, 'logs');
  fs.mkdirSync(logs, { recursive: true });
  const tally = {};
  for (const c of todo) {
    const label = `${c.name}@${c.version}`;
    try {
      const source = await sourceOf(db, c.name, c.version);
      const r = await rebuildNpm({ name: c.name, version: c.version, source, workRoot });
      if (fs.existsSync(r.logFile)) fs.copyFileSync(r.logFile, path.join(logs, `${label.replace(/[^a-zA-Z0-9.@-]/g, '_')}.log`));
      saveOurRebuild(db, r);
      tally[r.result] = (tally[r.result] || 0) + 1;
      console.log(`${r.result === 'reproduced' ? '✓' : '✗'} ${label}${c.wallets ? ` (${c.wallets} wallets)` : ''}: ${r.note}`);
    } catch (e) {
      tally.error = (tally.error || 0) + 1;
      console.error(`! ${label}: ${e.message}`);
    }
  }
  console.log(JSON.stringify(tally));
}
