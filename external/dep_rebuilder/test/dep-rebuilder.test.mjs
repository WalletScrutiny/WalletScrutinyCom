import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { openDb, saveCandidates, pending, saveRebuild, tally } from '../db.mjs';
import { collectCandidates } from '../candidates.mjs';
import { sandboxArgs } from '../sandbox.mjs';

function exportDir(apps) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-'));
  fs.mkdirSync(path.join(dir, 'apps'));
  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify({ apps: Object.keys(apps).map(appId => ({ appId })) }));
  for (const [appId, rels] of Object.entries(apps)) {
    fs.writeFileSync(path.join(dir, 'apps', `${appId}.json`), JSON.stringify({ releases: Object.keys(rels).map(ref => ({ ref, status: 'ok' })) }));
    for (const [ref, deps] of Object.entries(rels)) {
      fs.mkdirSync(path.join(dir, 'apps', appId, ref), { recursive: true });
      fs.writeFileSync(path.join(dir, 'apps', appId, ref, 'dependencies.json'), JSON.stringify({ dependencies: deps }));
    }
  }
  return dir;
}
const d = (name, version, scope = 'app', ecosystem = 'npm') => ({ ecosystem, name, version, scope });

test('a wallet counts once per package version, however many releases list it', async () => {
  const dir = exportDir({
    a: { v2: [d('x', '1.0.0'), d('y', '2.0.0', 'build')], v1: [d('x', '1.0.0')] },
    b: { v1: [d('x', '1.0.0'), d('x', '1.0.0'), d('z', '^1', 'app'), d('g', '1.0.0', 'app', 'gradle')] },
  });
  const rows = await collectCandidates({ base: dir });
  const by = Object.fromEntries(rows.map(r => [`${r.name}@${r.version}`, r]));
  assert.equal(by['x@1.0.0'].wallets, 2);
  assert.equal(by['y@2.0.0'].wallets, 0);
  assert.equal(by['y@2.0.0'].wallets_any, 1);
  assert.equal(rows.length, 2, 'ranges and other ecosystems are not candidates');
});

test('latest releases only', async () => {
  const dir = exportDir({ a: { v2: [d('x', '2.0.0')], v1: [d('x', '1.0.0')] } });
  const rows = await collectCandidates({ base: dir, releases: 'latest' });
  assert.deepEqual(rows.map(r => r.version), ['2.0.0']);
});

test('pending: most wallets first, Google\'s and earlier results skipped, retry keeps failures', () => {
  const db = openDb(':memory:');
  saveCandidates(db, [
    { ecosystem: 'npm', name: 'few', version: '1.0.0', wallets: 1, wallets_any: 1 },
    { ecosystem: 'npm', name: 'most', version: '1.0.0', wallets: 5, wallets_any: 5 },
    { ecosystem: 'npm', name: 'google', version: '1.0.0', wallets: 9, wallets_any: 9 },
    { ecosystem: 'npm', name: 'done', version: '1.0.0', wallets: 7, wallets_any: 7 },
    { ecosystem: 'npm', name: 'bad', version: '1.0.0', wallets: 6, wallets_any: 6 },
  ]);
  db.prepare(`INSERT INTO google VALUES ('npm', 'google', '1.0.0')`).run();
  saveRebuild(db, { ecosystem: 'npm', name: 'done', version: '1.0.0', result: 'reproduced', note: 'ok' });
  saveRebuild(db, { ecosystem: 'npm', name: 'bad', version: '1.0.0', result: 'failed', note: 'no' });
  assert.deepEqual(pending(db).map(r => r.name), ['most', 'few']);
  assert.deepEqual(pending(db, { retry: true }).map(r => r.name), ['bad', 'most', 'few']);
  assert.deepEqual(pending(db, { minWallets: 5 }).map(r => r.name), ['most']);
  assert.deepEqual(tally(db).results, { reproduced: 1, failed: 1 });
});

test('the phase that runs package scripts has no network and no privileges', () => {
  const base = { image: 'img', name: 'n', workDir: '/w', outDir: '/o', env: { A: '1' }, uid: 1000, gid: 1000, cli: 'podman' };
  const build = sandboxArgs({ ...base, network: 'none' });
  assert.ok(build.join(' ').includes('--network none'));
  for (const flag of ['--cap-drop', '--read-only', '--security-opt']) assert.ok(build.includes(flag), flag);
  assert.ok(build.includes('no-new-privileges'));
  assert.ok(build.includes('--userns=keep-id'));
  const install = sandboxArgs({ ...base, outDir: null });
  assert.ok(!install.join(' ').includes('--network'), 'clone and install keep the default network');
  assert.ok(!install.some(a => a.endsWith(':/out:rw')), 'only the build phase gets /out');
  // nothing of the host beyond the work and output directories is mounted
  assert.equal(build.filter(a => a === '-v').length, 2);
});
