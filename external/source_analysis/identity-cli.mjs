#!/usr/bin/env node
// Identity check over the database (sourceIdentity.mjs): for every
// package version whose repository is known (source-repos-cli.mjs), list the
// repository's tags once and record whether the version exists there.
// Usage: node identity-cli.mjs [--all] [--limit N]   (SOURCE_ANALYSIS_DB_PATH selects the database)
import minimist from 'minimist';
import { initDatabase } from './ddbbUtils.mjs';
import { lsRemoteTags, identityOf, npmProvenance, isRange } from './sourceIdentity.mjs';

const CONCURRENCY = 6;

export async function checkIdentities(db, { all = false, limit = Infinity, log = () => {} } = {}) {
  const rows = db.prepare(`
    SELECT DISTINCT p.ecosystem, p.name, p.version, s.repo_url FROM packages p
    JOIN package_sources s ON s.ecosystem = p.ecosystem AND s.name = p.name AND s.repo_url IS NOT NULL
    WHERE p.version != '' ${all ? '' : `AND NOT EXISTS (SELECT 1 FROM package_identity i WHERE i.ecosystem = p.ecosystem AND i.name = p.name AND i.version = p.version)`}
    ORDER BY s.repo_url
  `).all().slice(0, limit);
  const byRepo = new Map();
  for (const r of rows) { if (!byRepo.has(r.repo_url)) byRepo.set(r.repo_url, []); byRepo.get(r.repo_url).push(r); }
  const save = db.prepare(`INSERT OR REPLACE INTO package_identity (ecosystem, name, version, status, tag, commit_sha, provenance, checked_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`);
  const stats = { versions: rows.length, repos: byRepo.size, failed: 0, byStatus: {}, provenance: 0, npmVersions: 0 };
  const queue = [...byRepo.entries()];
  const worker = async () => {
    while (queue.length) {
      const [repo, pkgs] = queue.shift();
      let tags = null;
      try { tags = await lsRemoteTags(repo); } catch (e) { log(`${repo}: ${e.message}`); }
      for (const p of pkgs) {
        let npm = null;
        if (p.ecosystem === 'npm' && !isRange(p.ecosystem, p.version)) {
          try { npm = await npmProvenance(p.name, p.version); } catch (e) { stats.failed++; log(e.message); continue; }
          stats.npmVersions++;
          if (npm.provenance) stats.provenance++;
        }
        const id = identityOf(p, tags, npm);
        save.run(p.ecosystem, p.name, p.version, id.status, id.tag, id.commit, id.provenance === null ? null : (id.provenance ? 1 : 0));
        stats.byStatus[id.status] = (stats.byStatus[id.status] || 0) + 1;
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return stats;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { boolean: ['all'] });
  const stats = await checkIdentities(initDatabase(), { all: argv.all, limit: argv.limit ? Number(argv.limit) : Infinity, log: console.error });
  console.log(JSON.stringify(stats, null, 2));
  process.exit(stats.failed ? 2 : 0);
}
