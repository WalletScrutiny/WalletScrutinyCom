#!/usr/bin/env node
// Entry point that runs INSIDE the analysis container (see containerRunner.mjs):
// clone the repository into /work/repo, install its dependencies, run every
// check, and leave the structured result in /work/result.json. Logs go to
// stdout/stderr, which the host streams through.
//
// Imports nothing that needs the database or a native module: this folder is
// mounted read-only with the host's node_modules, and only pure-JS packages are
// loaded here.
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { execFileSync } from 'child_process';
import { cloneRepository, detectAppType, installDependencies, runChecksOnCheckout } from './appAnalysis.mjs';
import { APP_TYPES } from './config.mjs';

const argv = minimist(process.argv.slice(2), {
  string: ['name', 'repo', 'ref'],
  boolean: ['include-test-files'],
});
const workDir = process.env.SOURCE_ANALYSIS_WORK_DIR || '/work';
const repoPath = path.join(workDir, 'repo');
const resultPath = path.join(workDir, 'result.json');

const result = { ok: false, name: argv.name, repoUrl: argv.repo, ref: argv.ref || null, commit: null, appType: null, pinning: null, error: null };

try {
  if (!argv.name || !argv.repo) throw new Error('usage: containerEntry.mjs --name <appId> --repo <url> [--ref <tag>] [--include-test-files]');
  fs.mkdirSync(process.env.HOME || path.join(workDir, 'home'), { recursive: true });

  const cloned = await cloneRepository(argv.repo, repoPath, argv.ref || null);
  if (!cloned) throw new Error('clone failed');
  result.commit = execFileSync('git', ['-C', repoPath, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

  const appType = detectAppType(repoPath);
  result.appType = appType;
  console.log(`Detected app type: ${appType}`);

  if (appType === APP_TYPES.UNKNOWN) {
    console.log('Unknown app type. Skipping dependency checks...');
    const { pinning } = await runChecksOnCheckout(repoPath, appType, { includeTestFiles: argv['include-test-files'] });
    result.pinning = pinning;
  } else {
    // The install is off with the checks that need it (see runChecksOnCheckout):
    // test 10 reads lockfiles and the vulnerability lookup runs on the host.
    //await installDependencies(repoPath, appType);
    const { pinning } = await runChecksOnCheckout(repoPath, appType, { includeTestFiles: argv['include-test-files'] });
    result.pinning = pinning;
  }
  result.ok = true;
} catch (error) {
  result.error = error.message;
  console.error(`Analysis failed: ${error.message}`);
} finally {
  fs.writeFileSync(resultPath, JSON.stringify(result));
}

process.exit(result.ok ? 0 : 1);
