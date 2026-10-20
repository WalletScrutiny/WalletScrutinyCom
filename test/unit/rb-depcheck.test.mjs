import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// scripts/rb/ws-depcheck.sh against a small fake checkout and a fake scanner:
// the inventory, the YAML block and the failure path are the script's own
// logic; the real osv-scanner container is exercised by hand (scripts/rb/README.md).

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(here, '../../scripts/rb/ws-depcheck.sh');
const fakeScanner = path.join(here, 'fixtures/rb-depcheck/fake-scanner.sh');
const fakeIdentity = path.join(here, 'fixtures/rb-depcheck/fake-identity.sh');
const fakeApk = path.join(here, 'fixtures/rb-depcheck/fake-apk.sh');

function makeCheckout(root) {
  const files = {
    'package.json': '{}',
    'yarn.lock': '',
    'android/build.gradle': '',
    'android/app/build.gradle': '',
    'android/Gemfile': '',
    'android/Gemfile.lock': '',
    'ios/Podfile': '',
    'ios/Podfile.lock': '',
    'node_modules/dep/package.json': '{}',        // pruned
    'android/app/build/package.json': '{}',       // pruned
    'rust/Cargo.toml': '',
    'rust/Cargo.lock': '',
    'rust/sub/Cargo.toml': '',                    // locked by the workspace lock above it
  };
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.join(root, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), content);
  }
}

function run(args, env = {}) {
  return spawnSync('bash', [script, ...args], {
    encoding: 'utf8',
    env: { ...process.env, WS_DEPCHECK_SCANNER: fakeScanner, WS_DEPCHECK_IDENTITY_CMD: fakeIdentity, ...env },
  });
}

describe('ws-depcheck', () => {
  let tmp, src, out, resultsYaml;
  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-depcheck-'));
    src = path.join(tmp, 'checkout'); out = path.join(tmp, 'out'); resultsYaml = path.join(tmp, 'COMPARISON_RESULTS.yaml');
    makeCheckout(src);
    fs.writeFileSync(resultsYaml, 'script_version: v0.0.1\nverdict: reproducible\nnotes: |\n  demo\n');
  });
  after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  test('inventories lockfiles and unlocked manifests, pruning build and node_modules dirs', () => {
    const r = run(['--src', src, '--out', out, '--yaml', resultsYaml]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    const lockfiles = fs.readFileSync(path.join(out, 'lockfiles.txt'), 'utf8').trim().split('\n');
    assert.deepEqual(lockfiles, ['android/Gemfile.lock', 'ios/Podfile.lock', 'rust/Cargo.lock', 'yarn.lock']);
    const unlocked = fs.readFileSync(path.join(out, 'unlocked-manifests.txt'), 'utf8').trim().split('\n');
    assert.deepEqual(unlocked, ['android/app/build.gradle', 'android/build.gradle']);
  });

  test('appends a dependencies block the ABS yaml reader keeps alongside the verdict', () => {
    const data = yaml.load(fs.readFileSync(resultsYaml, 'utf8'));
    assert.equal(data.verdict, 'reproducible');
    const d = data.dependencies;
    assert.equal(d.status, 'ok');
    assert.equal(d.step, 'ws-depcheck 0.3.0');
    assert.deepEqual(d.apk, { status: 'skipped', note: 'no --apk given' });
    assert.equal(d.scanner, fakeScanner);
    assert.equal(d.packages, 4);
    assert.deepEqual(d.advisories, { malicious: 1, critical: 1, high: 0, moderate: 1, low: 0, unknown: 0 });
    assert.deepEqual(d.unlocked_manifests, ['android/app/build.gradle', 'android/build.gradle']);
    assert.deepEqual(d.lockfiles, [
      { path: 'android/Gemfile.lock', packages: 1, vulnerable: 1, advisories: 1 },
      { path: 'ios/Podfile.lock', scanned: false },
      { path: 'rust/Cargo.lock', scanned: false },
      { path: 'yarn.lock', packages: 3, vulnerable: 2, advisories: 2 },
    ]);
    assert.deepEqual(d.worst.map(w => [w.id, w.severity]), [
      ['MAL-2026-1', 'malicious'], ['GHSA-w7jw-789q-3m8p', 'critical'], ['GHSA-47m2-wp7j-p9vc', 'moderate'],
    ]);
    const json = JSON.parse(fs.readFileSync(path.join(out, 'dependency-check.json'), 'utf8'));
    assert.equal(json.status, 'ok');
    assert.equal(json.worst[0].package, 'evil@0.0.1');
  });

  test('the identity block counts per status and lists the versions not tied to a commit', () => {
    const d = yaml.load(fs.readFileSync(resultsYaml, 'utf8')).dependencies.identity;
    assert.equal(d.status, 'ok');
    assert.equal(d.counts['tag-found'], 2);
    assert.equal(d.counts['no-tag'], 1);
    assert.equal(d.counts.range, 0);
    assert.equal(d.npm_provenance, 1);
    assert.deepEqual(d.unverified, [{ package: 'evil@0.0.1', ecosystem: 'npm', status: 'no-tag' }]);
    assert.equal(d.report, 'identity.json');
  });

  test('a failed or disabled identity check says so instead of counting nothing', () => {
    const failed = path.join(tmp, 'out-idfail');
    assert.equal(run(['--src', src, '--out', failed], { FAKE_IDENTITY_MODE: 'fail' }).status, 0);
    const f = yaml.load(fs.readFileSync(path.join(failed, 'dependency-check.yaml'), 'utf8')).dependencies.identity;
    assert.equal(f.status, 'failed');
    assert.equal(f.counts, undefined);
    const off = path.join(tmp, 'out-idoff');
    assert.equal(run(['--src', src, '--out', off], { WS_DEPCHECK_IDENTITY: '0' }).status, 0);
    assert.equal(yaml.load(fs.readFileSync(path.join(off, 'dependency-check.yaml'), 'utf8')).dependencies.identity.status, 'skipped');
  });

  test('--apk compares the declared packages with the APK and reports it in the block', () => {
    const withApk = path.join(tmp, 'out-apk');
    const apkFile = path.join(tmp, 'app-release.apk');
    fs.writeFileSync(apkFile, 'PK');
    const r = run(['--src', src, '--out', withApk, '--apk', apkFile], { WS_DEPCHECK_APK_CMD: fakeApk });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /2 of 3 declared Maven packages in app-release\.apk/);
    assert.match(r.stdout, /native library no package declares: lib\/arm64-v8a\/libmystery\.so/);
    const a = yaml.load(fs.readFileSync(path.join(withApk, 'dependency-check.yaml'), 'utf8')).dependencies.apk;
    assert.deepEqual(a, { status: 'ok', file: 'app-release.apk', declared: 3, present: 2, absent: 1, cant_tell: 0, native: 2, native_identical: 1, undeclared_classes: 12, obfuscated_share: 0.01, native_differs: [], native_undeclared: ['lib/arm64-v8a/libmystery.so'], report: 'apk-contents.json' });
    assert.equal(run(['--src', src, '--out', withApk, '--apk', path.join(tmp, 'missing.apk')]).status, 2, 'a missing APK is a usage error');
  });

  test('the identity files the script fetches by commit have the hashes it checks', () => {
    const text = fs.readFileSync(script, 'utf8');
    const entries = [...text.matchAll(/^  "([\w.-]+\.mjs) ([0-9a-f]{64})"$/gm)];
    assert.equal(entries.length, 5);
    for (const [, file, sum] of entries) {
      const actual = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(here, '../../external/source_analysis', file))).digest('hex');
      assert.equal(sum, actual, `${file}: update IDENTITY_FILES in ws-depcheck.sh`);
    }
  });

  test('does not append a second block to a yaml that already has one', () => {
    const before = fs.readFileSync(resultsYaml, 'utf8');
    const r = run(['--src', src, '--out', out, '--yaml', resultsYaml]);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /already has a dependencies block/);
    assert.equal(fs.readFileSync(resultsYaml, 'utf8'), before);
  });

  test('a broken scanner is recorded as scanner-failed, exit code stays 0', () => {
    const out2 = path.join(tmp, 'out-fail');
    const r = run(['--src', src, '--out', out2], { FAKE_SCANNER_MODE: 'fail' });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /scan failed \(exit 2\)/);
    const block = yaml.load(fs.readFileSync(path.join(out2, 'dependency-check.yaml'), 'utf8')).dependencies;
    assert.equal(block.status, 'scanner-failed');
    assert.equal(block.packages, 0);
  });

  test('an empty checkout is no-lockfiles', () => {
    const empty = path.join(tmp, 'empty'); fs.mkdirSync(empty);
    const out3 = path.join(tmp, 'out-empty');
    const r = run(['--src', empty, '--out', out3]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /status: no-lockfiles/);
  });

  test('wrong invocation exits 2', () => {
    assert.equal(run(['--out', out]).status, 2);
    assert.equal(run(['--src', src]).status, 2);
  });
});
