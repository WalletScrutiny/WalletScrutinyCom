#!/usr/bin/env node
// Standalone runner for the supply-chain pinning analysis (Tests 10-12).
// Clones the repo shallowly at the given ref, analyzes lock/manifest files,
// prints the report. Nothing from the repository is executed or installed.
//
// Usage: node pinning-cli.mjs --repo https://github.com/user/repo --ref v1.2.3
//        [--json]         also emit a machine-readable blob at the end
//        [--follow-deps]  run Test 12 against source dependencies too
//                         (network: one blob-filtered clone per dependency)

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { cloneRepository } from './appAnalysis.mjs';
import { analyzePinning } from './pinningAnalysis.mjs';
import { analyzeOobDownloads } from './oobDownloadAnalysis.mjs';
import { analyzeCommittedBinaries, analyzeDependencyBinaries } from './committedBinaryAnalysis.mjs';
import { DEFAULT_TEMP_DIR } from './config.mjs';

const argv = minimist(process.argv.slice(2));
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
