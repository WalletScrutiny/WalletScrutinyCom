// What the systemd service relies on: secrets read from files, the database
// directory created on first run, and backups pruned to a fixed number.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadSecret } from '../utils.mjs';
import { initDatabase, backupDatabase } from '../ddbbUtils.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'sa-service-'));

test('loadSecret: file named by the environment wins, trimmed', () => {
  const dir = tmp();
  const file = path.join(dir, 'token');
  fs.writeFileSync(file, 'ghp_secret\n');
  const value = loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE', argValue: 'from-argv', env: { GITHUB_TOKEN_FILE: file } });
  assert.equal(value, 'ghp_secret');
});

test('loadSecret: argv fallback when no file is configured, null when nothing is set', () => {
  assert.equal(loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE', argValue: 'from-argv', env: {} }), 'from-argv');
  assert.equal(loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE', env: {} }), null);
});

test('loadSecret: a configured file that is missing is an error, not a silent fallback', () => {
  assert.throws(() => loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE', argValue: 'x', env: { GITHUB_TOKEN_FILE: '/nonexistent/token' } }), /ENOENT/);
});

test('initDatabase creates the state directory on first run', () => {
  const dbPath = path.join(tmp(), 'state', 'assets.db');
  const db = initDatabase(dbPath);
  db.close();
  assert.ok(fs.existsSync(dbPath));
});

test('backupDatabase keeps only the newest copies', async () => {
  const dir = tmp();
  const dbPath = path.join(dir, 'assets.db');
  const backupDir = path.join(dir, 'backup');
  initDatabase(dbPath).close();
  for (let i = 0; i < 5; i++) {
    backupDatabase(dbPath, backupDir, 3);
    await new Promise(r => setTimeout(r, 1100)); // backup names have second resolution
  }
  const left = fs.readdirSync(backupDir).sort();
  assert.equal(left.length, 3);
  assert.match(left[0], /^assets_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.db$/);
});
