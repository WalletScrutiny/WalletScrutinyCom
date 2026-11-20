// What the host does with a build's output. The container is faked
// (fake-container-cli.mjs): these are the paths a hostile package steers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { rebuildNpm, sourceOf, boundedLog } from '../rebuild.mjs';
import { openDb, saveCandidates, saveRebuild, pending } from '../db.mjs';
import { LIMITS } from '../sandbox.mjs';

const cli = fileURLToPath(new URL('./fake-container-cli.mjs', import.meta.url));

// A minimal ustar archive, as in source_analysis/test/rebuilds.test.mjs
function tgz(files) {
  const blocks = [];
  for (const [name, body] of Object.entries(files)) {
    const h = Buffer.alloc(512), b = Buffer.from(body);
    h.write(`package/${name}`, 0, 100, 'utf8');
    h.write(b.length.toString(8).padStart(11, '0') + '\0', 124);
    h.write('0', 156); h.write('ustar\0' + '00', 257);
    blocks.push(h, b, Buffer.alloc((512 - (b.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return zlib.gzipSync(Buffer.concat(blocks));
}

async function build(mode, { doc = {}, source = { repoUrl: 'https://github.com/x/x', ref: 'v1.0.0', commit: null } } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-build-'));
  const registry = tgz({ 'index.js': 'module.exports = 1;\n', 'package.json': '{"name":"x","version":"1.0.0"}' });
  fs.writeFileSync(path.join(root, 'registry.tgz'), registry);
  Object.assign(process.env, { FAKE_BUILD: mode, FAKE_TGZ: path.join(root, 'registry.tgz'), FAKE_CALLS: path.join(root, 'calls') });
  const fetchImpl = async (url) => (String(url).endsWith('.tgz')
    ? { ok: true, arrayBuffer: async () => registry }
    : { ok: true, json: async () => ({ dist: { tarball: 'https://registry.npmjs.org/x/-/x-1.0.0.tgz' }, _nodeVersion: '20.1.0', _npmVersion: '10.0.0', ...doc }) });
  const r = await rebuildNpm({ name: 'x', version: '1.0.0', source, workRoot: path.join(root, 'work'), fetchImpl, cli, limits: { ...LIMITS, phaseMs: 20000 } });
  const calls = fs.existsSync(path.join(root, 'calls')) ? fs.readFileSync(path.join(root, 'calls'), 'utf8').trim().split('\n').map(l => JSON.parse(l)) : [];
  return { r, root, calls };
}

test('a build that leaves the registry\'s tarball is reproduced, with the commit that was checked out', async () => {
  const { r, calls } = await build('ok');
  assert.equal(r.result, 'reproduced');
  assert.equal(r.commit, 'c'.repeat(40));
  assert.equal(r.phase, null);
  assert.deepEqual(calls.map(c => c.PHASE), ['clone', 'install', 'build']);
});

test('only a regular file is read as the tarball: not a pipe, which never ends, nor a link out of the directory', async () => {
  for (const mode of ['pipe', 'link']) {
    const { r } = await build(mode);
    assert.equal(r.result, 'failed', mode);
    assert.match(r.note, /something other than a file/, mode);
    assert.equal(r.phase, 'build');
  }
});

test('a tarball that cannot be unpacked is a failed build, not an error that is retried forever', async () => {
  const { r } = await build('garbage');
  assert.equal(r.result, 'failed');
  assert.match(r.note, /could not be compared/);
  assert.equal(r.phase, 'compare');
});

test('a flood of output is cut on disk and never read whole', async () => {
  const { r } = await build('flood');
  assert.equal(r.result, 'reproduced');
  const log = fs.readFileSync(r.log, 'utf8');
  assert.ok(log.length < 250000, `${log.length} bytes kept`);
  assert.match(log, /bytes left out/);
  assert.match(log, /^commit c{40}/m, 'the start of the log, where the commit is, is kept');
});

test('boundedLog keeps the first and last part of a large file', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-log-')), 'l');
  fs.writeFileSync(file, `start\n${'x'.repeat(5000)}\nend`);
  const text = boundedLog(file, 1000);
  assert.ok(text.startsWith('start\n') && text.endsWith('\nend') && text.length < 1100);
  assert.equal(fs.readFileSync(file, 'utf8'), text);
  fs.writeFileSync(file, 'short');
  assert.equal(boundedLog(file, 1000), 'short');
});

test('what the registry says about npm and the package directory is used only when it is plain', async () => {
  const hostile = await build('ok', { doc: { _npmVersion: 'https://example.com/npm.tgz' } });
  assert.equal(hostile.calls[1].NPMV, '', 'a URL is not handed to npm install -g npm@…');
  assert.equal((await build('ok', { doc: { _npmVersion: '6.14.18' } })).calls[1].NPMV, '6.14.18');
  const dir = await build('ok', { doc: { repository: { url: 'https://github.com/x/x', directory: `p\ncommit ${'a'.repeat(40)}` } } });
  assert.equal(dir.r.result, 'failed');
  assert.match(dir.r.note, /not a plain path/);
  assert.equal(dir.calls.length, 0, 'nothing ran');
  assert.equal((await build('ok', { doc: { repository: { url: 'u', directory: 'packages/x-y' } } })).calls[0].DIR, 'packages/x-y');
});

test('a failed clone names its step; a failure is cleaned up after; an error that is thrown leaves nothing on disk', async () => {
  const { r, root } = await build('clone-fails');
  assert.equal(r.result, 'failed');
  assert.equal(r.phase, 'clone');
  assert.match(r.note, /^clone failed: fatal: unable to access/);
  assert.ok(!fs.existsSync(path.join(root, 'work', 'x@1.0.0', 'work')));
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-throw-'));
  const fetchImpl = async (url) => (String(url).endsWith('.tgz') ? { ok: false, status: 503 } : { ok: true, json: async () => ({ dist: { tarball: 'https://r/x.tgz' } }) });
  await assert.rejects(rebuildNpm({ name: 'x', version: '1.0.0', source: null, workRoot: work, fetchImpl, cli }), /HTTP 503/);
  assert.deepEqual(fs.readdirSync(work), []);
});

test('source: a repository that cannot be listed falls back to the registry\'s commit, and says so when there is none', async () => {
  const db = openDb(':memory:');
  const resolve = async () => ({ url: 'https://github.com/x/x' });
  const down = async () => { throw new Error('fatal: unable to access: Could not resolve host'); };
  const withHead = await sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: down, provenance: async () => ({ gitHead: 'a'.repeat(40), published: true }) });
  assert.equal(withHead.ref, 'a'.repeat(40));
  const none = await sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: down, provenance: async () => ({ gitHead: null, published: true }) });
  assert.equal(none.ref, null);
  assert.match(none.unlisted, /Could not resolve host/);
  const { r } = await build('ok', { source: none });
  assert.deepEqual([r.result, r.phase], ['failed', 'source']);
  const odd = await sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: async () => new Map(), provenance: async () => ({ gitHead: '--upload-pack=x', published: true }) });
  assert.equal(odd.ref, null, 'a gitHead that is not a commit id is never checked out');
  const tagged = await sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: async () => new Map([['v1.0.0', 'b'.repeat(40)]]), provenance: async () => null });
  assert.deepEqual([tagged.ref, tagged.commit, tagged.unlisted], ['v1.0.0', 'b'.repeat(40), null]);
});

test('a failure in a step that needs the network is tried once more, a day later; other failures and a second failure stand', () => {
  const db = openDb(':memory:');
  const c = (name) => ({ ecosystem: 'npm', name, version: '1.0.0', wallets: 1, wallets_any: 1 });
  saveCandidates(db, ['clone', 'install', 'source', 'build', 'compare', 'fresh', 'twice'].map(c));
  const fail = (name, phase) => saveRebuild(db, { ecosystem: 'npm', name, version: '1.0.0', result: 'failed', note: 'x', phase });
  for (const p of ['clone', 'install', 'source', 'build', 'compare']) fail(p, p);
  fail('fresh', 'clone'); fail('twice', 'clone'); fail('twice', 'clone');
  assert.deepEqual(pending(db), [], 'nothing is retried on the day it failed');
  db.prepare(`UPDATE rebuilds SET finished_at = datetime('now', '-2 days') WHERE name != 'fresh'`).run();
  assert.deepEqual(pending(db).map(r => r.name), ['clone', 'install', 'source']);
  fail('clone', 'clone');
  db.prepare(`UPDATE rebuilds SET finished_at = datetime('now', '-2 days')`).run();
  assert.deepEqual(pending(db).map(r => r.name), ['fresh', 'install', 'source']);
});

test('a database from before the phase column gets it, read from the note', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-old-')), 'old.db');
  const old = openDb(file);
  old.exec(`ALTER TABLE rebuilds DROP COLUMN phase`);
  const ins = old.prepare(`INSERT INTO rebuilds (ecosystem, name, version, result, note) VALUES ('npm', ?, '1', 'failed', ?)`);
  ins.run('a', 'clone failed: fatal: x'); ins.run('b', 'The install step did not finish in 20 minutes'); ins.run('c', 'Rebuilt tarball differs: 1 missing');
  old.close();
  const db = openDb(file);
  assert.deepEqual(db.prepare(`SELECT name, phase FROM rebuilds ORDER BY name`).all().map(r => `${r.name}:${r.phase}`), ['a:clone', 'b:install', 'c:null']);
});
