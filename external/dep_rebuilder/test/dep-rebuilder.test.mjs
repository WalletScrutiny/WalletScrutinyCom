import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { openDb, saveCandidates, pending, saveRebuild, tally } from '../db.mjs';
import { collectCandidates } from '../candidates.mjs';
import { sandboxArgs } from '../sandbox.mjs';
import { serveLoop } from '../worker.mjs';
import { usedBytes } from '../sandbox.mjs';
import { feedRows, writeFeed, publishFeed } from '../site-export.mjs';
import zlib from 'zlib';
import { tgzFiles } from '../../source_analysis/rebuildNpm.mjs';

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

function serveFixture() {
  const db = openDb(':memory:');
  let t = 1_000_000_000_000;
  const events = [];
  let stop = false;
  const opts = {
    db, now: () => t, log: (m) => events.push(m), shouldStop: () => stop,
    sync: async () => { events.push('sync'); saveCandidates(db, [
      { ecosystem: 'npm', name: 'a', version: '1.0.0', wallets: 3, wallets_any: 3 },
      { ecosystem: 'npm', name: 'b', version: '1.0.0', wallets: 9, wallets_any: 9 },
    ]); return {}; },
    step: async (c) => { events.push(`build ${c.name}`); saveRebuild(db, { ecosystem: 'npm', name: c.name, version: c.version, result: 'reproduced', note: 'ok' }); },
    sleep: async (ms) => { events.push(`sleep ${ms}`); t += ms; },
  };
  return { db, opts, events, stop: () => { stop = true; }, advance: (ms) => { t += ms; } };
}

test('serve: syncs first, builds the most shared version first, sleeps when nothing is left, syncs again after a day', async () => {
  const f = serveFixture();
  let sleeps = 0;
  const sleep = f.opts.sleep;
  f.opts.sleep = async (ms) => { await sleep(ms); if (++sleeps === 25) f.stop(); };
  await serveLoop(f.opts);
  const log = f.events.filter(e => !e.startsWith('sync:'));
  assert.deepEqual(log.slice(0, 4), ['sync', 'build b', 'build a', `sleep ${3600 * 1000}`]);
  assert.equal(log.filter(e => e === 'sync').length, 2, 'the second sync comes after 24 hourly sleeps, not before');
  assert.equal(log.slice(1, log.lastIndexOf('sync')).filter(e => e.startsWith('sleep')).length, 24);
});

test('serve: a version that throws is deferred, not retried in a loop, and the next one is built', async () => {
  const f = serveFixture();
  f.opts.step = async (c) => { f.events.push(`build ${c.name}`); if (c.name === 'b') throw new Error('registry down'); saveRebuild(f.db, { ecosystem: 'npm', name: c.name, version: c.version, result: 'failed', note: 'x' }); };
  let sleeps = 0;
  const sleep = f.opts.sleep;
  f.opts.sleep = async (ms) => { await sleep(ms); if (++sleeps === 2) f.stop(); };
  await serveLoop(f.opts);
  assert.deepEqual(f.events.filter(e => e.startsWith('build')), ['build b', 'build a']);
});

test('serve: a failed sync is retried later and does not stop the loop', async () => {
  const f = serveFixture();
  let tries = 0;
  const ok = f.opts.sync;
  f.opts.sync = async () => { if (++tries === 1) throw new Error('offline'); return ok(); };
  let sleeps = 0;
  const sleep = f.opts.sleep;
  f.opts.sleep = async (ms) => { await sleep(ms); if (++sleeps === 3) f.stop(); };
  await serveLoop(f.opts);
  assert.equal(tries, 2);
  assert.ok(f.events.includes('build b'));
});

test('disk limit counts the output directory and the log, not only the work directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-du-'));
  const work = path.join(root, 'work'), out = path.join(root, 'out'), log = path.join(root, 'build.log');
  fs.mkdirSync(work); fs.mkdirSync(out);
  fs.writeFileSync(path.join(out, 'big.bin'), Buffer.alloc(300000));
  fs.writeFileSync(log, Buffer.alloc(200000));
  assert.ok(usedBytes([work, out, log]) >= 500000);
  assert.equal(usedBytes([path.join(root, 'missing')]), 0);
});

test('a gzip bomb in a rebuilt tarball is refused, not unpacked into memory', () => {
  const bomb = zlib.gzipSync(Buffer.alloc(1100 * 2 ** 20)); // ~1 MB compressed, 1.1 GB unpacked
  assert.throws(() => tgzFiles(bomb), /larger than|ERR_BUFFER_TOO_LARGE|Cannot create a Buffer/);
});

test('the website feed has outcomes and one-line reasons, no logs or paths, and skips what was not decided', () => {
  const db = openDb(':memory:');
  saveRebuild(db, { ecosystem: 'npm', name: 'a', version: '1.0.0', result: 'reproduced', note: 'Byte-identical tarball', repoUrl: 'https://github.com/x/a', commit: 'c'.repeat(40), toolchain: 'node:20 npm 10', log: '/var/lib/x/a.log', sandbox: 's' });
  saveRebuild(db, { ecosystem: 'npm', name: 'b', version: '2.0.0', result: 'failed', note: 'differs' });
  saveRebuild(db, { ecosystem: 'npm', name: 'c', version: '3.0.0', result: 'skipped', note: 'later' });
  saveRebuild(db, { ecosystem: 'npm', name: 'd', version: '4.0.0', result: 'unsupported', note: 'Member of a workspace, whose root build is not run here' });
  saveCandidates(db, [{ ecosystem: 'npm', name: 'a', version: '1.0.0', wallets: 8, wallets_any: 9 }]);
  const rows = feedRows(db);
  assert.deepEqual(rows.map(r => `${r.name}@${r.version} ${r.result}`), ['a@1.0.0 reproduced', 'b@2.0.0 failed']);
  assert.equal(rows[0].wallets, 8, 'how many wallets ship it');
  assert.ok(!('wallets' in rows[1]), 'no count for a version that is not a candidate');
  assert.match(rows[0].date, /^\d{4}-\d\d-\d\d$/);
  assert.ok(!JSON.stringify(rows).includes('/var/lib'), 'no local paths leave the machine');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-site-'));
  assert.equal(writeFeed(db, dir), 2);
  const feed = JSON.parse(fs.readFileSync(path.join(dir, 'rebuilds.json'), 'utf8'));
  assert.deepEqual([feed.schema, feed.claimant, feed.rows.length], [1, 'ws', 2]);
});

test('publishing copies the feed with brotli through rsync, and does nothing without a target', () => {
  const db = openDb(':memory:');
  saveRebuild(db, { ecosystem: 'npm', name: 'a', version: '1.0.0', result: 'reproduced', note: 'ok' });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-pub-'));
  assert.deepEqual(publishFeed(db, dir, { target: undefined }), { rows: 1, published: false });
  const calls = [];
  const r = publishFeed(db, dir, { target: 'u@h:/', ssh: 'ssh -i k', run: (cmd, args) => { calls.push([cmd, args]); return { status: 0 }; } });
  assert.equal(r.published, true);
  assert.equal(calls[0][0], 'rsync');
  assert.ok(calls[0][1].includes('u@h:/') && calls[0][1].includes('ssh -i k'));
  assert.ok(fs.existsSync(path.join(dir, 'rebuilds.json.br')));
});

test('serve: publishes what was built, after the interval and when idle, and a failed copy does not stop the loop', async () => {
  const f = serveFixture();
  let published = 0, failOnce = true;
  f.opts.publish = async () => { if (failOnce) { failOnce = false; throw new Error('rsync down'); } published++; return { rows: 2 }; };
  let sleeps = 0;
  const sleep = f.opts.sleep;
  f.opts.sleep = async (ms) => { await sleep(ms); if (++sleeps === 3) f.stop(); };
  await serveLoop(f.opts);
  assert.ok(f.events.some(e => e.startsWith('publish failed')));
  assert.ok(published >= 1, 'retried and succeeded');
  assert.equal(f.events.filter(e => e.startsWith('build')).length, 2);
});
