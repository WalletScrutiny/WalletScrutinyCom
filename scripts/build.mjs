#!/usr/bin/env node
/**
 * Production build: precompute -> webpack -> jekyll -> compress.
 * Runs each step sequentially so compress never races ahead of Jekyll.
 */

import { spawn } from 'child_process';
import { rmSync } from 'fs';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
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
  await run('bundle', ['exec', 'jekyll', 'build']);
  await run('npm', ['run', 'compress']);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
