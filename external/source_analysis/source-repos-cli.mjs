#!/usr/bin/env node
// Resolve the source repository of every package in the database that has no
// cached lookup yet (plugins/source-repos.mjs) and store it in package_sources.
// Usage: node source-repos-cli.mjs [--all] [--limit N]   (SOURCE_ANALYSIS_DB_PATH selects the database)
import minimist from 'minimist';
import { initDatabase, packagesToResolve, savePackageSource } from './ddbbUtils.mjs';
import { resolveRepo } from './plugins/source-repos.mjs';

const CONCURRENCY = 8;

export async function resolveAll(db, { all = false, limit = Infinity, log = () => {} } = {}) {
  const todo = packagesToResolve(db, { all }).slice(0, limit);
  const stats = { total: todo.length, resolved: 0, unresolved: 0, failed: 0, bySource: {} };
  let next = 0;
  const worker = async () => {
    while (next < todo.length) {
      const pkg = todo[next++];
      try {
        const r = await resolveRepo(pkg);
        savePackageSource(db, pkg.ecosystem, pkg.name, r);
        if (r.url) stats.resolved++; else stats.unresolved++;
        stats.bySource[r.source] = (stats.bySource[r.source] || 0) + 1;
      } catch (e) {
        stats.failed++; // network trouble: left uncached so the next run retries
        log(`${pkg.ecosystem}:${pkg.name}: ${e.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return stats;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { boolean: ['all'] });
  const db = initDatabase();
  const stats = await resolveAll(db, { all: argv.all, limit: argv.limit ? Number(argv.limit) : Infinity, log: console.error });
  console.log(JSON.stringify(stats, null, 2));
  process.exit(stats.failed ? 2 : 0);
}
