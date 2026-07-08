#!/usr/bin/env node
/**
 * Build the site and serve _site/ for Playwright E2E tests.
 * Playwright's webServer keeps this process running for the test session.
 */

import { spawn } from 'node:child_process';

const port = process.env.PLAYWRIGHT_PORT || '4173';

function runAndWait(command, args, env = {}) {
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

function shutdown(child, signal = 'SIGTERM') {
  if (!child.killed) {
    child.kill(signal);
  }
}

await runAndWait('node', ['scripts/build-e2e.mjs']);

const serve = spawn(
  process.execPath,
  [
    './node_modules/http-server/bin/http-server',
    '_site',
    '-p',
    port,
    '-c-1',
    '--silent',
  ],
  {
    stdio: 'inherit',
    env: process.env,
  },
);

serve.on('exit', (code, signal) => {
  if (signal) {
    process.exit(0);
    return;
  }
  process.exit(code ?? 0);
});

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    shutdown(serve, signal);
  });
}
