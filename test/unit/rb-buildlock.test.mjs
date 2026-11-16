import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// scripts/rb/ws-buildlock.sh against a fake Gradle home and a fake post-build checkout.

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(here, '../../scripts/rb/ws-buildlock.sh');

function write(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.join(root, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), content);
  }
}

const run = (args) => spawnSync('bash', [script, ...args], { encoding: 'utf8' });

test('records every cached Gradle artifact with its hash, and the lockfiles the build left', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  const cache = 'gh/caches/modules-2/files-2.1';
  write(root, {
    [`${cache}/com.squareup.okio/okio/3.6.0/aaaa/okio-3.6.0.jar`]: 'jar bytes',
    [`${cache}/com.squareup.okio/okio/3.6.0/bbbb/okio-3.6.0.pom`]: 'pom bytes',
    'gh/caches/modules-2/metadata-2.106/descriptors/x': 'not an artifact',
    'src/node_modules/.package-lock.json': '{}',
    'src/node_modules/a/node_modules/.package-lock.json': '{}', // nested, not the tree's
    'src/app/pubspec.lock': '',
    'src/rust/Cargo.lock': '',
    'src/build/Cargo.lock': '', // build output
  });
  const out = path.join(root, 'out');
  const yamlFile = path.join(root, 'COMPARISON_RESULTS.yaml');
  const r = run(['--out', out, '--gradle-home', path.join(root, 'gh'), '--src', path.join(root, 'src'), '--yaml', yamlFile]);
  assert.equal(r.status, 0, r.stderr);
  const lock = JSON.parse(fs.readFileSync(path.join(out, 'build-lock.json'), 'utf8'));
  assert.deepEqual(lock.artifacts, [
    { ecosystem: 'gradle', name: 'com.squareup.okio:okio', version: '3.6.0', file: 'okio-3.6.0.jar', sha1: 'aaaa',
      sha256: crypto.createHash('sha256').update('jar bytes').digest('hex') },
    { ecosystem: 'gradle', name: 'com.squareup.okio:okio', version: '3.6.0', file: 'okio-3.6.0.pom', sha1: 'bbbb',
      sha256: crypto.createHash('sha256').update('pom bytes').digest('hex') },
  ]);
  assert.deepEqual(lock.lockfiles, ['app/pubspec.lock', 'node_modules/.package-lock.json', 'rust/Cargo.lock']);
  assert.ok(fs.existsSync(path.join(out, 'lockfiles/rust/Cargo.lock')));
  const yamlText = fs.readFileSync(yamlFile, 'utf8');
  assert.match(yamlText, /^build_lock:\n  tool_version: .*\n  status: ok\n  gradle_artifacts: 2\n/);
});

test('nothing to record is said out loud, and is still not a failure', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  fs.mkdirSync(path.join(root, 'src'));
  const yamlFile = path.join(root, 'y.yaml');
  const r = run(['--out', path.join(root, 'out'), '--src', path.join(root, 'src'), '--yaml', yamlFile]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /exact dependency versions are unknown/);
  assert.match(fs.readFileSync(yamlFile, 'utf8'), /status: empty/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'out/build-lock.json'), 'utf8')).artifacts, []);
});

test('a wrong invocation exits 2', () => {
  assert.equal(run([]).status, 2);
  assert.equal(run(['--out', '/tmp/x']).status, 2);
});

test('lists the binaries the checkout commits, with their hash, and not build output', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  const src = path.join(root, 'src');
  write(src, {
    'app/libs/vendor.aar': 'aar bytes',
    'app/src/main/jniLibs/arm64-v8a/libsecp.so': 'so bytes',
    'app/src/Main.kt': 'class Main',
    'app/build/out.jar': 'built, not committed',
  });
  const git = (...a) => spawnSync('git', ['-C', src, ...a], { encoding: 'utf8' });
  git('init', '-q');
  git('add', 'app/libs', 'app/src');
  const out = path.join(root, 'out');
  const r = run(['--out', out, '--src', src]);
  assert.equal(r.status, 0, r.stderr);
  const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, 'build-lock.json'), 'utf8')).artifacts, [
    { ecosystem: 'committed', name: 'app/libs/vendor.aar', sha256: sha('aar bytes') },
    { ecosystem: 'committed', name: 'app/src/main/jniLibs/arm64-v8a/libsecp.so', sha256: sha('so bytes') },
  ]);
  assert.match(r.stdout, /Binaries committed in the checkout: 2/);
});

test('schema 2: the flags and the checkout commit go into the file, and the upload block names it', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  const src = path.join(root, 'src');
  write(src, { 'README': 'x' });
  const git = (...a) => spawnSync('git', ['-C', src, ...a], { encoding: 'utf8' });
  git('init', '-q');
  git('add', 'README');
  git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'x');
  const head = git('rev-parse', 'HEAD').stdout.trim();
  const out = path.join(root, 'out');
  // a relative --out is printed in full
  const r = spawnSync('bash', [script, '--out', 'out', '--src', src, '--app-id', 'com.example.wallet', '--version', '1.2.3', '--platform', 'android'],
    { encoding: 'utf8', cwd: root });
  assert.equal(r.status, 0, r.stderr);
  const text = fs.readFileSync(path.join(out, 'build-lock.json'), 'utf8');
  const lock = JSON.parse(text);
  assert.deepEqual(Object.keys(lock), ['schema', 'tool', 'version', 'appId', 'appVersion', 'platform', 'commit', 'generatedAt', 'lockfiles', 'artifacts']);
  assert.equal(lock.schema, 2);
  assert.equal(lock.version, '0.3.0');
  assert.deepEqual([lock.appId, lock.appVersion, lock.platform, lock.commit], ['com.example.wallet', '1.2.3', 'android', head]);
  const sha = crypto.createHash('sha256').update(text).digest('hex');
  assert.ok(r.stdout.includes(`=== Upload this file with the verification ===
  file:     ${fs.realpathSync(out)}/build-lock.json
  sha256:   ${sha}
  app:      com.example.wallet
  version:  1.2.3
  platform: android
  commit:   ${head}
`), r.stdout);
  assert.doesNotMatch(r.stdout, /will not use/);
});

test('a missing flag leaves its field null and warns, and the run still succeeds', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  fs.mkdirSync(path.join(root, 'src'));
  const out = path.join(root, 'out');
  const r = run(['--out', out, '--src', path.join(root, 'src'), '--app-id', 'com.example.wallet']);
  assert.equal(r.status, 0);
  const lock = JSON.parse(fs.readFileSync(path.join(out, 'build-lock.json'), 'utf8'));
  assert.deepEqual([lock.appId, lock.appVersion, lock.platform, lock.commit], ['com.example.wallet', null, null, null]);
  assert.match(r.stdout, /\[WARN\] ws-buildlock: no --version --platform given; the dependency checker will not use this build-lock.json/);
  assert.match(r.stdout, /  version:  \(none\)\n/);
});

test('an old build-lock.json in --out is removed first, even when the run then fails', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  const out = path.join(root, 'out');
  // a file where the lockfiles directory goes: the run stops before writing
  write(out, { 'build-lock.json': 'last week', 'lockfiles': 'in the way' });
  fs.mkdirSync(path.join(root, 'src'));
  const r = run(['--out', out, '--src', path.join(root, 'src')]);
  assert.equal(r.status, 2);
  assert.ok(!fs.existsSync(path.join(out, 'build-lock.json')));
});

// a checkout at a known HEAD, for the --commit cases
function checkout() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  const src = path.join(root, 'src');
  write(src, { 'README': 'x' });
  const git = (...a) => spawnSync('git', ['-C', src, ...a], { encoding: 'utf8' });
  git('init', '-q');
  git('add', 'README');
  git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'x');
  return { root, src, head: git('rev-parse', 'HEAD').stdout.trim() };
}
const flags = ['--app-id', 'com.example.wallet', '--version', '1.2.3', '--platform', 'android'];
const readLock = (out) => JSON.parse(fs.readFileSync(path.join(out, 'build-lock.json'), 'utf8'));

test('--commit names the build when there is no checkout on the host', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'buildlock-'));
  write(root, { 'gh/caches/modules-2/files-2.1/g/a/1.0/aaaa/a-1.0.jar': 'jar' });
  const sha = '774b1b2bb492958091e835aafe20cef71cb6c44a';
  const out = path.join(root, 'out');
  const r = run(['--out', out, '--gradle-home', path.join(root, 'gh'), ...flags, '--commit', sha.toUpperCase()]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(readLock(out).commit, sha);
  assert.match(r.stdout, new RegExp(`  commit:   ${sha}\n`));
  assert.doesNotMatch(r.stdout, /WARN/);
});

test('a --commit that is not a full sha warns, leaves commit null, and does not fall back to --src', () => {
  for (const bad of ['v1.1.1', '774b1b2']) {
    const { root, src } = checkout();
    const out = path.join(root, 'out');
    const r = run(['--out', out, '--src', src, ...flags, '--commit', bad]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(readLock(out).commit, null);
    assert.ok(r.stdout.includes(`[WARN] ws-buildlock: --commit ${bad} is not a full 40-hex commit`), r.stdout);
    assert.match(r.stdout, /  commit:   \(none\)\n/);
  }
});

test('a --commit that differs from the HEAD of --src warns and is the one kept', () => {
  const { root, src, head } = checkout();
  const sha = 'a'.repeat(40);
  const out = path.join(root, 'out');
  const r = run(['--out', out, '--src', src, ...flags, '--commit', sha]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(readLock(out).commit, sha);
  assert.ok(r.stdout.includes(`[WARN] ws-buildlock: --commit ${sha} differs from the HEAD of --src (${head})`), r.stdout);
  // the same commit as --src is no warning
  const r2 = run(['--out', out, '--src', src, ...flags, '--commit', head]);
  assert.equal(readLock(out).commit, head);
  assert.doesNotMatch(r2.stdout, /differs from the HEAD/);
});
