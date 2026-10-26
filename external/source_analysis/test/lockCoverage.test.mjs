// Lock coverage (plugins/lock-coverage.mjs): a manifest without a lockfile,
// or an unlocked entry, must never look like a clean result.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { findManifests, lockCoverage } from '../plugins/lock-coverage.mjs';

function repo(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lockcov-'));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.join(dir, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  }
  return dir;
}

const NPM_DEPS = '{"dependencies":{"left-pad":"^1.0.0"}}';
const lockOf = (manifests) => Object.fromEntries(manifests.map(m => [m.manifest, m.lockfile]));

test('every ecosystem pairs its manifest with its lockfile, or with none', () => {
  const dir = repo({
    'package.json': NPM_DEPS, 'package-lock.json': '{}',
    'packages/core/package.json': NPM_DEPS, // workspace: the root lock covers it
    'rust/Cargo.toml': '[package]', // no Cargo.lock anywhere
    'mobile/pubspec.yaml': 'dependencies:', 'mobile/pubspec.lock': '',
    'ios/Podfile': "pod 'X'",
    'go.mod': 'module x', 'go.sum': '',
    'Package.swift': '', 'Package.resolved': '',
    'Cartfile': 'github "a/b"',
    'requirements.txt': 'requests==2.0',
  });
  assert.deepEqual(lockOf(findManifests(dir)), {
    'package.json': 'package-lock.json',
    'packages/core/package.json': 'package-lock.json',
    'rust/Cargo.toml': null,
    'mobile/pubspec.yaml': 'mobile/pubspec.lock',
    'ios/Podfile': null,
    'go.mod': 'go.sum',
    'Package.swift': 'Package.resolved',
    'Cartfile': null,
    'requirements.txt': 'requirements.txt',
  });
});

test('gradle is unlocked without gradle.lockfile, verification metadata or a lock directory', () => {
  const plain = repo({ 'settings.gradle': '', 'app/build.gradle': '' });
  assert.deepEqual(lockOf(findManifests(plain)), { 'settings.gradle': null });
  const verified = repo({ 'settings.gradle.kts': '', 'gradle/verification-metadata.xml': '' });
  assert.deepEqual(lockOf(findManifests(verified)), { 'settings.gradle.kts': 'gradle/verification-metadata.xml' });
  const locked = repo({ 'android/settings.gradle': '', 'android/app/gradle.lockfile': '' });
  assert.deepEqual(lockOf(findManifests(locked)), { 'android/settings.gradle': 'android/app/gradle.lockfile' });
  // no settings file: the topmost build file is the root
  const lone = repo({ 'build.gradle': '', 'lib/build.gradle': '' });
  assert.deepEqual(lockOf(findManifests(lone)), { 'build.gradle': null });
});

test('an Xcode project with packages needs a Package.resolved', () => {
  const pbx = 'objects = { XCRemoteSwiftPackageReference "x" }';
  assert.deepEqual(lockOf(findManifests(repo({ 'Wallet.xcodeproj/project.pbxproj': pbx }))), { 'Wallet.xcodeproj/project.pbxproj': null });
  assert.deepEqual(lockOf(findManifests(repo({
    'Wallet.xcodeproj/project.pbxproj': pbx,
    'Wallet.xcworkspace/xcshareddata/swiftpm/Package.resolved': '',
  }))), { 'Wallet.xcodeproj/project.pbxproj': 'Wallet.xcworkspace/xcshareddata/swiftpm/Package.resolved' });
  // a project without packages is no manifest
  assert.deepEqual(findManifests(repo({ 'Wallet.xcodeproj/project.pbxproj': 'objects = {}' })), []);
});

test('tooling-only files are not manifests', () => {
  const dir = repo({
    'package.json': '{"scripts":{"lint":"x"},"dependencies":{}}',
    'pyproject.toml': '[tool.black]\nline-length = 100\n',
  });
  assert.deepEqual(findManifests(dir), []);
  const real = repo({ 'pyproject.toml': '[project]\ndependencies = ["requests"]\n' });
  assert.deepEqual(lockOf(findManifests(real)), { 'pyproject.toml': null });
});

test('verdict: unlocked beats everything, examples do not count, nothing found is unknown', () => {
  const m = (manifest, lockfile, product = true) => ({ ecosystem: 'npm', manifest, lockfile, product });
  assert.equal(lockCoverage([]).verdict, 'none');
  assert.equal(lockCoverage([m('package.json', 'yarn.lock')]).verdict, 'locked');
  assert.equal(lockCoverage([m('package.json', null)]).verdict, 'unlocked');
  assert.equal(lockCoverage([m('package.json', 'yarn.lock'), m('example/package.json', null, false)]).verdict, 'locked');
  assert.equal(lockCoverage([m('example/package.json', null, false)]).verdict, 'none');
  // a locked manifest with a floating entry (gradle `1.+`, a pip range) is unlocked
  const pinning = [{ ecosystem: 'gradle', entries: [
    { ecosystem: 'gradle', tier: 'floating', lockfile: 'app/build.gradle' },
    { ecosystem: 'gradle', tier: 'version-pinned', lockfile: 'app/build.gradle' },
    { ecosystem: 'gradle', tier: 'floating', lockfile: 'sample/build.gradle' },
  ] }];
  const c = lockCoverage([m('package.json', 'yarn.lock')], pinning);
  assert.equal(c.verdict, 'unlocked');
  assert.deepEqual(c.floatingRows, { gradle: 1 });
});

test('example directories are listed but marked as not the product', () => {
  const dir = repo({ 'package.json': NPM_DEPS, 'yarn.lock': '', 'example/pubspec.yaml': 'dependencies:' });
  const ex = findManifests(dir).find(x => x.manifest === 'example/pubspec.yaml');
  assert.equal(ex.product, false);
  assert.equal(ex.lockfile, null);
});
