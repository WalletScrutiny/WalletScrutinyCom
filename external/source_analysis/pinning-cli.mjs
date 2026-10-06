#!/usr/bin/env node
// Standalone runner for the supply-chain pinning analysis (Tests 10-12).
// Clones the repo shallowly at the given ref, analyzes lock/manifest files,
// prints the report. Nothing from the repository is executed or installed.
//
// Usage: node pinning-cli.mjs --repo https://github.com/user/repo --ref v1.2.3
//        [--json]         also emit a machine-readable blob at the end
//        [--follow-deps]  run Test 12 against source dependencies too
//                         (network: one blob-filtered clone per dependency)
//        [--app-id <id> --version <v>]
//                         store the resolved dependency set in assets.db as
//                         (app-id, version); replaces an earlier run of the pair
//        [--diff <from-version>]
//                         with --app-id/--version: print the dependency delta
//                         from the stored <from-version> to this one
//
//        node pinning-cli.mjs --ships <ecosystem>:<name>[@<version>]
//                         no clone: list stored (app-id, version) pairs that
//                         ship that package (the lookup for a new advisory)

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { cloneRepository } from './appAnalysis.mjs';
import { analyzePinning } from './plugins/pinning.mjs';
import { analyzeOobDownloads } from './plugins/oob-downloads.mjs';
import { analyzeCommittedBinaries, analyzeDependencyBinaries } from './plugins/committed-binaries.mjs';
import { DEFAULT_TEMP_DIR } from './config.mjs';
import { backupDatabase, initDatabase, saveDependencies, diffDependencies, findAppsShipping } from './ddbbUtils.mjs';

const argv = minimist(process.argv.slice(2), { string: ['app-id', 'version', 'diff', 'ships', 'ref'] });

if (argv.ships) {
  const m = String(argv.ships).match(/^([^:]+):(.+?)(?:@([^@]+))?$/);
  if (!m) {
    console.error('Usage: node pinning-cli.mjs --ships <ecosystem>:<name>[@<version>]');
    process.exit(2);
  }
  const db = initDatabase();
  const rows = findAppsShipping(db, m[1], m[2], m[3] ?? null);
  db.close();
  for (const r of rows) {
    console.log(`${r.app_id} ${r.version}: ${m[2]}@${r.dep_version} (${r.direct ? 'direct' : 'transitive'}${r.dev ? ', dev' : ''}, ${r.lockfile})`);
  }
  if (!rows.length) console.log('no stored version ships that package');
  process.exit(0);
}

if (!argv.repo || !argv.ref) {
  console.error('Usage: node pinning-cli.mjs --repo <git-url> --ref <tag-or-branch> [--json] [--follow-deps]');
  process.exit(2);
}

const repoPath = path.join(DEFAULT_TEMP_DIR, 'pinning_' + argv.repo.replace(/[^a-zA-Z0-9.-]/g, '_'));
const cloned = await cloneRepository(argv.repo, repoPath, argv.ref);
if (!cloned) {
  console.error('Clone failed');
  process.exit(1);
}
const results = analyzePinning(repoPath);
const oob = analyzeOobDownloads(repoPath);
const committed = analyzeCommittedBinaries(repoPath);
const depBinaries = argv['follow-deps'] ? await analyzeDependencyBinaries(repoPath, DEFAULT_TEMP_DIR) : null;

if (argv['app-id'] && argv.version) {
  backupDatabase();
  const db = initDatabase();
  const stored = saveDependencies(db, argv['app-id'], argv.version, results);
  console.log(`\nStored ${stored} dependency rows for ${argv['app-id']} ${argv.version}`);
  if (argv.diff) {
    const delta = diffDependencies(db, argv['app-id'], argv.diff, argv.version);
    console.log(`\n--- Dependency delta ${argv.diff} -> ${argv.version}: ` +
      `${delta.added.length} added, ${delta.removed.length} removed, ${delta.changed.length} changed ---`);
    const tag = (r) => `${r.direct ? 'direct' : 'transitive'}${r.dev ? ', dev' : ''}` +
      (r.lockfile.includes('/') ? `, ${r.lockfile}` : '');
    for (const r of delta.added) console.log(`  + ${r.ecosystem} ${r.name}@${r.versions.join(',')} (${tag(r)})`);
    for (const r of delta.removed) console.log(`  - ${r.ecosystem} ${r.name}@${r.versions.join(',')} (${tag(r)})`);
    for (const r of delta.changed) {
      console.log(`  ~ ${r.ecosystem} ${r.name} ${r.from.join(',')} -> ${r.to.join(',')} (${tag(r)})` +
        (r.integrityChangedAtSameVersion.length ? `  !! same version, different bytes: ${r.integrityChangedAtSameVersion.join(',')}` : ''));
    }
  }
  db.close();
}
if (argv.json) {
  console.log('\n' + JSON.stringify({
    repo: argv.repo,
    ref: argv.ref,
    results,
    oob,
    committedBinaries: { artifacts: committed.artifacts, totals: committed.totals },
    dependencyBinaries: depBinaries,
  }, null, 2));
}
fs.rmSync(repoPath, { recursive: true, force: true });
