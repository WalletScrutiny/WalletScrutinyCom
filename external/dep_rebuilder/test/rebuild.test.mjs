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
import { LIMITS, SCRIPT, usedBytes, removeTree } from '../sandbox.mjs';
import { execFileSync } from 'child_process';

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
  // the registry's document is JSON: a value need not be a string
  assert.match((await build('ok', { doc: { repository: { url: 'u', directory: ['p'] } } })).r.note, /not a plain path/);
  assert.equal((await build('ok', { doc: { _npmVersion: ['6.14.18'] } })).calls[1].NPMV, '');
});

test('a build that makes its files unreadable still counts against the disk limit and is cleaned up', async () => {
  const { r, root } = await build('locked');
  assert.deepEqual([r.result, r.phase], ['failed', 'build']);
  assert.deepEqual(fs.readdirSync(path.join(root, 'work', 'x@1.0.0')).sort(), ['build.log', 'out']);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-locked-'));
  fs.mkdirSync(path.join(dir, 'a'));
  fs.writeFileSync(path.join(dir, 'a', 'f'), 'x'.repeat(50000));
  fs.chmodSync(path.join(dir, 'a'), 0o000);
  assert.ok(usedBytes([dir]) >= 50000, 'what is below a closed directory is counted');
  fs.chmodSync(path.join(dir, 'a'), 0o000);
  removeTree(dir);
  assert.ok(!fs.existsSync(dir));
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
  for (const gitHead of ['--upload-pack=x', ['a'.repeat(40)]]) {
    const odd = await sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: async () => new Map(), provenance: async () => ({ gitHead, published: true }) });
    assert.deepEqual([odd.ref, odd.commit], [null, null], 'a gitHead that is not a commit id is never checked out');
  }
  await assert.rejects(sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: async () => new Map(), provenance: async () => { throw new Error('npm x@1.0.0: HTTP 503'); } }), /HTTP 503/, 'a registry that cannot be asked is not "no commit for this version"');
  const tagged = await sourceOf(db, 'x', '1.0.0', { resolve, lsRemote: async () => new Map([['v1.0.0', 'b'.repeat(40)]]), provenance: async () => null });
  assert.deepEqual([tagged.ref, tagged.commit, tagged.unlisted], ['v1.0.0', 'b'.repeat(40), null]);
});

test('a failure in a step that needs the network is tried once more, a day later; other failures and a second failure stand', () => {
  const db = openDb(':memory:');
  const c = (name) => ({ ecosystem: 'npm', name, version: '1.0.0', wallets: 1, wallets_any: 1 });
  saveCandidates(db, ['clone', 'install', 'source', 'build', 'compare', 'fresh', 'twice', 'nophase'].map(c));
  const fail = (name, phase) => saveRebuild(db, { ecosystem: 'npm', name, version: '1.0.0', result: 'failed', note: 'x', ...(phase ? { phase } : {}) });
  for (const p of ['clone', 'install', 'source', 'build', 'compare']) fail(p, p);
  fail('nophase'); // "no source repository": the phase is NULL in the database
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
  old.exec(`UPDATE rebuilds SET finished_at = datetime('now', '-3 days')`);
  old.close();
  const db = openDb(file);
  assert.deepEqual(db.prepare(`SELECT name, phase FROM rebuilds ORDER BY name`).all().map(r => `${r.name}:${r.phase}`), ['a:clone', 'b:install', 'c:null']);
  saveCandidates(db, ['a', 'b', 'c'].map(name => ({ ecosystem: 'npm', name, version: '1', wallets: 1, wallets_any: 1 })));
  assert.deepEqual(pending(db).map(r => r.name), ['a', 'b'], 'the old failures of the build itself are not built again');
});

// manifest-check.js as the sandbox runs it: the text between the quotes of `node -e`
const CHECK = /node -e '([^']*)'/.exec(SCRIPT)[1];
function check(mode, files, pkg = '.') {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-manifest-'));
  for (const [name, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(repo, name)), { recursive: true });
    fs.writeFileSync(path.join(repo, name), typeof body === 'string' ? body : JSON.stringify(body));
  }
  const args = mode === 'scripts' ? [path.join(repo, pkg)] : [repo, path.join(repo, pkg)];
  // FORCE_COLOR as `node --test` sets it in a terminal: the shell compares this output as plain text
  return execFileSync('node', ['-e', CHECK, mode, ...args], { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '1' } }).trim();
}

test('dependencies from a registry or the repository pass; a git repository, in any of npm\'s spellings, is named', () => {
  const deps = (dependencies, extra = {}) => ({ 'package.json': { name: 'x', dependencies, ...extra } });
  assert.equal(check('sources', deps({ a: '^1.0.0', b: 'npm:@s/c@1.0', c: 'file:../c', d: 'latest', e: '>=1 <2 || 3.x', f: '../sibling', g: './lib/g', h: 'workspace:*', i: '' })), '');
  for (const spec of ['github:u/r', 'u/r', 'u/r#semver:^1', 'git+https://github.com/u/r.git', 'git+ssh://git@github.com/u/r.git', 'git://github.com/u/r.git',
    'https://github.com/u/r.git', 'https://github.com/u/r', 'git@github.com:u/r.git', 'gist:11081aaa281', 'https://gitlab.com/u/r.git#x', 'gitlab:u/r', 'bitbucket:u/r', 'https://example.com/d.tgz']) {
    assert.equal(check('sources', deps({ dep: spec })), `dep@${spec}`, spec);
  }
  for (const field of ['devDependencies', 'optionalDependencies', 'peerDependencies']) assert.equal(check('sources', { 'package.json': { [field]: { dep: 'u/r' } } }), 'dep@u/r', field);
  assert.equal(check('sources', deps({}, { overrides: { a: { b: 'github:u/r' }, c: '$c' } })), 'override github:u/r');
  assert.equal(check('sources', deps({}, { resolutions: { 'a/**/b': 'u/r' } })), 'override u/r');
  assert.equal(check('sources', deps({}, { pnpm: { overrides: { a: 'u/r' } } })), 'override u/r');
  assert.equal(check('sources', deps({ dep: ['u/r'] })), 'dep@u/r', 'a value that is not a string is not a version');
});

test('a manifest the check cannot read is not installed; a byte order mark does not hide one', () => {
  assert.equal(check('sources', { 'package.json': `\uFEFF${JSON.stringify({ dependencies: { dep: 'github:u/r' } })}` }), 'dep@github:u/r');
  assert.equal(check('sources', { 'package.json': '{ not json' }), 'package.json cannot be read');
  assert.equal(check('sources', { 'packages/p/package.json': '{ not json' }, 'packages/p'), 'packages/p/package.json cannot be read');
  assert.equal(check('sources', { 'packages/p/package.json': { dependencies: { a: '1.0.0' } } }, 'packages/p'), '', 'a repository root without a manifest, above the package');
});

test('every member of a workspace is read, since the install is for all of them', () => {
  const member = { 'packages/b/package.json': { dependencies: { dep: 'u/r' } }, 'packages/a/package.json': { name: 'a' }, 'node_modules/z/package.json': { dependencies: { dep: 'u/r' } } };
  assert.equal(check('sources', { 'package.json': { workspaces: ['packages/*'] }, ...member }, 'packages/a'), 'packages/b/package.json: dep@u/r');
  assert.equal(check('sources', { 'package.json': {}, 'lerna.json': {}, ...member }, 'packages/a'), 'packages/b/package.json: dep@u/r');
  assert.equal(check('sources', { 'package.json': {}, ...member }, 'packages/a'), '', 'without a workspace, a manifest elsewhere in the repository (a test fixture) is not installed');
});

test('lockfiles: registry tarballs and workspace members pass; git and other sources are named', () => {
  const pj = { 'package.json': { name: 'x' } };
  const lock = (name, body) => check('sources', { ...pj, [name]: body });
  const reg = 'https://registry.npmjs.org';
  assert.equal(lock('package-lock.json', { packages: { 'node_modules/a': { version: '1.0.0', resolved: `${reg}/a/-/a-1.0.0.tgz`, funding: { url: 'https://github.com/sponsors/x' } }, 'node_modules/@s/b': { version: '2.0.0-rc.1', resolved: `${reg}/@s/b/-/b-2.0.0-rc.1.tgz` }, 'node_modules/w': { resolved: 'packages/w', link: true }, 'node_modules/f': { version: 'file:../f' } } }), '');
  assert.equal(lock('npm-shrinkwrap.json', { dependencies: { '@s/b': { version: '2.0.0', from: '@s/b@^2.0.0', resolved: `${reg}/@s/b/-/b-2.0.0.tgz` } } }), '', 'an old shrinkwrap names every package in "from"');
  assert.match(lock('package-lock.json', { packages: { 'node_modules/a': { version: '1.0.0', resolved: 'git+ssh://git@github.com/u/r.git#abc' } } }), /^package-lock.json: "resolved":"git\+ssh/);
  assert.match(lock('package-lock.json', { dependencies: { a: { version: 'github:u/r#abc', from: 'github:u/r' } } }), /^package-lock.json: "version":"github:u\/r#abc"/);
  assert.match(lock('package-lock.json', { dependencies: { a: { version: 'git+https://github.com/u/r.git#abc' } } }), /"version":"git\+https/);
  const yarn = (resolved) => lock('yarn.lock', `a@^1.0.0:\n  version "1.0.0"\n  resolved "${resolved}"\n  integrity sha512-x\n`);
  assert.equal(yarn('https://registry.yarnpkg.com/a/-/a-1.0.0.tgz#abc'), '');
  assert.equal(yarn(`${reg}/@s/b/-/b-1.0.0.tgz`), '');
  for (const r of ['git+https://github.com/u/r.git#abc', 'https://github.com/u/r.git#abc', 'https://codeload.github.com/u/r/tar.gz/abc', 'git://github.com/u/r.git#abc']) assert.match(yarn(r), /^yarn.lock: resolved "/, r);
  assert.equal(lock('pnpm-lock.yaml', `  /a@1.0.0:\n    resolution: {integrity: sha512-xx}\n  /@s/b@1.0.0:\n    resolution: {integrity: sha512-x, tarball: ${reg}/@s/b/-/b-1.0.0.tgz}\n`), '');
  assert.match(lock('pnpm-lock.yaml', '  github.com/u/r/abc:\n    resolution: {commit: abc, repo: https://github.com/u/r.git, type: git}\n'), /type: git/);
  assert.match(lock('pnpm-lock.yaml', '  x:\n    resolution: {tarball: https://codeload.github.com/u/r/tar.gz/abc}\n'), /codeload/);
});

test('build scripts are read from the manifest as data: a directory named package.json is not loaded as a module', () => {
  assert.equal(check('scripts', { 'package.json': { scripts: { build: 'tsc' } } }), '1');
  assert.equal(check('scripts', { 'package.json': { scripts: { test: 'x' } } }), '0');
  assert.equal(check('scripts', { 'package.json': `\uFEFF${JSON.stringify({ scripts: { prepare: 'x' } })}` }), '1');
  const marker = path.join(os.tmpdir(), `depreb-ran-${process.pid}`);
  assert.equal(check('scripts', { 'package.json/index.js': `require("fs").writeFileSync(${JSON.stringify(marker)}, "x"); module.exports = { scripts: { build: "x" } };` }), '0');
  assert.ok(!fs.existsSync(marker), 'the repository\'s file was not executed');
});
