// Service paths come from the environment (set by the systemd unit); dev runs
// default to this folder. config.mjs reads the environment at import time, so
// each case runs in a child process.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const folder = path.resolve(here, '..');

function paths(env) {
  const out = execFileSync(process.execPath, ['--input-type=module', '-e',
    'const c = await import("./config.mjs"); console.log(JSON.stringify({ db: c.DB_PATH, backup: c.BACKUP_DIR, temp: c.DEFAULT_TEMP_DIR, cache: c.CACHE_DIR, cacheMax: c.CACHE_MAX_BYTES, image: c.ANALYSIS_IMAGE, cli: c.CONTAINER_CLI, timeout: c.CONTAINER_TIMEOUT_MS }));'],
    { cwd: folder, env: { PATH: process.env.PATH, ...env }, encoding: 'utf8' });
  return JSON.parse(out);
}

test('defaults: everything inside the source_analysis folder', () => {
  const p = paths({});
  assert.equal(p.db, path.join(folder, 'assets.db'));
  assert.equal(p.backup, path.join(folder, 'backup'));
  assert.equal(p.temp, path.join(folder, 'temp_repos'));
  assert.equal(p.cache, path.join(folder, 'cache'));
  assert.match(p.image, /^docker\.io\/.+@sha256:[0-9a-f]{64}$/, 'analysis image pinned by digest');
  assert.equal(p.cli, 'docker');
});

test('service: SOURCE_ANALYSIS_DB_PATH and SOURCE_ANALYSIS_TEMP_DIR win, backups sit next to the database', () => {
  const p = paths({
    SOURCE_ANALYSIS_DB_PATH: '/var/lib/walletscrutiny-source-analysis/assets.db',
    SOURCE_ANALYSIS_TEMP_DIR: '/var/cache/walletscrutiny-source-analysis/repos'
  });
  assert.equal(p.db, '/var/lib/walletscrutiny-source-analysis/assets.db');
  assert.equal(p.backup, '/var/lib/walletscrutiny-source-analysis/backup');
  assert.equal(p.temp, '/var/cache/walletscrutiny-source-analysis/repos');
});

test('service: container settings come from the environment too', () => {
  const p = paths({
    SOURCE_ANALYSIS_CACHE_DIR: '/var/cache/walletscrutiny-source-analysis/cache',
    SOURCE_ANALYSIS_CACHE_MAX_GB: '5',
    SOURCE_ANALYSIS_IMAGE: 'docker.io/library/node:22',
    SOURCE_ANALYSIS_CONTAINER_CLI: 'podman',
    SOURCE_ANALYSIS_CONTAINER_TIMEOUT_MIN: '3',
  });
  assert.equal(p.cache, '/var/cache/walletscrutiny-source-analysis/cache');
  assert.equal(p.cacheMax, 5e9);
  assert.equal(p.image, 'docker.io/library/node:22');
  assert.equal(p.cli, 'podman');
  assert.equal(p.timeout, 180000);
});
