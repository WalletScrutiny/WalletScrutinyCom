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
    'const c = await import("./config.mjs"); console.log(JSON.stringify({ db: c.DB_PATH, backup: c.BACKUP_DIR, temp: c.DEFAULT_TEMP_DIR }));'],
    { cwd: folder, env: { PATH: process.env.PATH, ...env }, encoding: 'utf8' });
  return JSON.parse(out);
}

test('defaults: everything inside the source_analysis folder', () => {
  const p = paths({});
  assert.equal(p.db, path.join(folder, 'assets.db'));
  assert.equal(p.backup, path.join(folder, 'backup'));
  assert.equal(p.temp, path.join(folder, 'temp_repos'));
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
