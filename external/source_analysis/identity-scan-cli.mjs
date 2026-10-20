#!/usr/bin/env node
// Identity check of one checkout, for the reproducible-build step
// (scripts/rb/ws-depcheck.sh): the packages osv-scanner found in the lockfiles,
// each looked up the way identity-cli.mjs does it for the database, but with
// no database. Needs Node 18+ and git; nothing else, so the build step can
// fetch this file and the two modules it imports by commit and run them.
// Usage: node identity-scan-cli.mjs <osv-scanner.json> <identity.json>
import { readFileSync, writeFileSync } from 'fs';
import { resolveRepo } from './sourceRepos.mjs';
import { lsRemoteTags, identityOf, npmProvenance, isRange } from './sourceIdentity.mjs';

const CONCURRENCY = 8;
const ECOSYSTEMS = { 'npm': 'npm', 'crates.io': 'cargo', 'PyPI': 'pip', 'Maven': 'gradle' };

/** Distinct (ecosystem, name, version) of an osv-scanner report; unsupported ecosystems kept with ecosystem null. */
export function packagesOf(report) {
  const seen = new Map();
  for (const r of report.results || []) {
    for (const p of r.packages || []) {
      const { name, version = '', ecosystem: osv } = p.package || {};
      if (!name) continue;
      const key = `${osv}\0${name}\0${version}`;
      if (!seen.has(key)) seen.set(key, { ecosystem: ECOSYSTEMS[osv] || null, osvEcosystem: osv, name, version });
    }
  }
  return [...seen.values()];
}

/**
 * Identity of every package: one registry lookup per (ecosystem, name), one
 * tag listing per repository, one npm lookup per exact npm version. Statuses
 * are identityOf's plus `no-repo` (the registry names none) and `unsupported`
 * (an ecosystem without a resolver: RubyGems, Go, CocoaPods, ...).
 */
export async function identifyPackages(pkgs, { resolve = resolveRepo, listTags = lsRemoteTags, npm = npmProvenance, log = () => {} } = {}) {
  const repoOf = new Map(), tagsOf = new Map();
  const once = (cache, key, make) => { if (!cache.has(key)) cache.set(key, make()); return cache.get(key); };
  const out = [];
  const queue = [...pkgs];
  const worker = async () => {
    while (queue.length) {
      const p = queue.shift();
      const row = { ecosystem: p.osvEcosystem, name: p.name, version: p.version, repo: null, status: null, tag: null, commit: null, provenance: null };
      out.push(row);
      if (!p.ecosystem) { row.status = 'unsupported'; continue; }
      if (isRange(p.ecosystem, p.version)) { row.status = 'range'; continue; }
      const repo = await once(repoOf, `${p.ecosystem}\0${p.name}`, () => resolve(p).then(r => r.url, e => { log(`${p.name}: ${e.message}`); return null; }));
      row.repo = repo;
      if (!repo) { row.status = 'no-repo'; continue; }
      const tags = await once(tagsOf, repo, () => listTags(repo).catch(e => { log(`${repo}: ${e.message}`); return null; }));
      let reg = null;
      if (p.ecosystem === 'npm') reg = await npm(p.name, p.version).catch(e => { log(e.message); return null; });
      const id = identityOf(p, tags, reg);
      Object.assign(row, { status: id.status, tag: id.tag, commit: id.commit, provenance: id.provenance });
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const byStatus = {};
  for (const r of out) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  return { packages: out.sort((a, b) => `${a.ecosystem}${a.name}${a.version}`.localeCompare(`${b.ecosystem}${b.name}${b.version}`)), byStatus };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) { console.error('usage: identity-scan-cli.mjs <osv-scanner.json> <identity.json>'); process.exit(2); }
  const result = await identifyPackages(packagesOf(JSON.parse(readFileSync(input, 'utf8'))), { log: console.error });
  writeFileSync(output, JSON.stringify(result, null, 1));
  console.log(JSON.stringify(result.byStatus));
}
