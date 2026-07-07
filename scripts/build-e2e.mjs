#!/usr/bin/env node
/**
 * Site build for Playwright E2E: precompute -> webpack -> jekyll (no compress).
 */

import { spawn } from 'child_process';
import { rmSync } from 'fs';

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

async function main() {
  rmSync('dist', { recursive: true, force: true });

  await run('node', ['scripts/precompute-wallet-data.mjs']);
  await run('npx', ['webpack', '--mode', 'production', '--no-watch']);
  await run('bundle', ['exec', 'jekyll', 'build'], { JEKYLL_ENV: 'production' });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
