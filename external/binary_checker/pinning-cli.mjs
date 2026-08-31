#!/usr/bin/env node
// Standalone runner for the supply-chain pinning analysis (Test 10).
// Clones the repo shallowly at the given ref, analyzes lock/manifest files,
// prints the report. Nothing from the repository is executed or installed.
//
// Usage: node pinning-cli.mjs --repo https://github.com/user/repo --ref v1.2.3

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { cloneRepository } from './appAnalysis.mjs';
import { analyzePinning } from './pinningAnalysis.mjs';
import { analyzeOobDownloads } from './oobDownloadAnalysis.mjs';
import { DEFAULT_TEMP_DIR } from './config.mjs';

const argv = minimist(process.argv.slice(2));
if (!argv.repo || !argv.ref) {
  console.error('Usage: node pinning-cli.mjs --repo <git-url> --ref <tag-or-branch> [--json]');
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
if (argv.json) {
  console.log('\n' + JSON.stringify({ repo: argv.repo, ref: argv.ref, results, oob }, null, 2));
}
fs.rmSync(repoPath, { recursive: true, force: true });
