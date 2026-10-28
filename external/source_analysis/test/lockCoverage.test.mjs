// Lock coverage (plugins/lock-coverage.mjs): a manifest without a lockfile,
// or an unlocked entry, must never look like a clean result.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { findManifests, lockCoverage, unlistedInputs } from '../plugins/lock-coverage.mjs';

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

test('gradle without a lockfile is locked by exact declarations, unlocked by a range', () => {
  const plain = repo({ 'settings.gradle': '', 'app/build.gradle': '' });
  assert.deepEqual(findManifests(plain), [{ ecosystem: 'gradle', manifest: 'settings.gradle', lockfile: null, product: true, exactDeclarations: true }]);
  assert.equal(lockCoverage(findManifests(plain)).verdict, 'locked');
  const ranged = [{ ecosystem: 'gradle', entries: [{ ecosystem: 'gradle', tier: 'floating', lockfile: 'app/build.gradle' }] }];
  assert.equal(lockCoverage(findManifests(plain), ranged).verdict, 'unlocked');
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

test('inputs no lockfile lists unlock a fully locked repository (Leo, 2026-10-26)', () => {
  const locked = [{ ecosystem: 'npm', manifest: 'package.json', lockfile: 'package-lock.json', product: true }];
  const download = (o) => ({ kind: 'wget', target: 'https://dl.google.com/sdk.zip', file: 'Dockerfile', line: 3, hashCheck: false, stability: 'unspecified', ...o });
  const artifact = (o) => ({ path: 'app/libs/x.aar', kind: 'aar', size: 10, category: 'build-input', ...o });
  const verdict = (downloads, artifacts) => lockCoverage(locked, [], unlistedInputs({ downloads, binaries: { artifacts } })).verdict;

  assert.equal(verdict([], []), 'locked');
  assert.equal(verdict([download()], []), 'unlocked');
  assert.equal(verdict([download({ kind: 'container-base-image', target: 'ubuntu:22.04' })], []), 'unlocked');
  assert.equal(verdict([], [artifact()]), 'unlocked');
  // a hash check next to the download, a test fixture, the gradle wrapper, a sample app: not hidden inputs
  assert.equal(verdict([download({ hashCheck: true })], []), 'locked');
  assert.equal(verdict([download({ file: 'examples/demo/Dockerfile' })], []), 'locked');
  assert.equal(verdict([], [artifact({ category: 'test-fixture' }), artifact({ category: 'build-tool-wrapper' })]), 'locked');
  // vendored binaries without any manifest are still something, not "unknown"
  assert.equal(lockCoverage([], [], unlistedInputs({ binaries: { artifacts: [artifact()] } })).verdict, 'unlocked');

  const c = lockCoverage(locked, [], unlistedInputs({ downloads: Array.from({ length: 60 }, (_, i) => download({ line: i })) }));
  assert.equal(c.unlisted.downloadCount, 60);
  assert.equal(c.unlisted.downloads.length, 50, 'the stored list is capped, the count is not');
});

test('a lockfile nothing reads is unknown, not locked (Danny, 2026-10-28)', () => {
  const verdictOf = (files) => lockCoverage(findManifests(repo(files))).verdict;
  assert.equal(verdictOf({ 'pubspec.yaml': 'dependencies:', 'pubspec.lock': '' }), 'unknown');
  assert.equal(verdictOf({ 'go.mod': 'module x', 'go.sum': '' }), 'unknown');
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'pnpm-lock.yaml': '' }), 'unknown');
  assert.equal(verdictOf({ 'pyproject.toml': '[tool.poetry.dependencies]\nx = "1"\n', 'poetry.lock': '' }), 'unknown');
  // the ones pinning parses stay locked
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'yarn.lock': '' }), 'locked');
  assert.equal(verdictOf({ 'Cargo.toml': '[package]', 'Cargo.lock': '' }), 'locked');
  // one unread lockfile is enough, and it is named
  const c = lockCoverage(findManifests(repo({ 'package.json': NPM_DEPS, 'package-lock.json': '{}', 'mobile/pubspec.yaml': 'dependencies:', 'mobile/pubspec.lock': '' })));
  assert.equal(c.verdict, 'unknown');
  assert.deepEqual(c.unread, [{ ecosystem: 'pub', manifest: 'mobile/pubspec.yaml', lockfile: 'mobile/pubspec.lock' }]);
  // a missing lockfile still beats an unread one
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'go.mod': 'module x', 'go.sum': '' }), 'unlocked');
  // a sample app's unread lockfile does not count
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'yarn.lock': '', 'example/pubspec.yaml': 'dependencies:', 'example/pubspec.lock': '' }), 'locked');
});

test('a C/C++ build is unknown: tooling manifests cannot make firmware look locked', () => {
  const firmware = repo({
    'CMakeLists.txt': 'project(fw)', 'components/wally/CMakeLists.txt': '', 'components/wally/upstream/configure.ac': '',
    'tools/fonts/package.json': NPM_DEPS, 'tools/fonts/package-lock.json': '{}',
  });
  const c = lockCoverage(findManifests(firmware));
  assert.equal(c.verdict, 'unknown');
  assert.deepEqual(c.unread, [{ ecosystem: 'c/c++', manifest: 'CMakeLists.txt', lockfile: null }], 'one record per build root');
  assert.equal(lockCoverage(findManifests(repo({ 'meson.build': '' }))).verdict, 'unknown');
  // ESP-IDF components: a range without dependencies.lock floats, with one it is unread
  const idf = 'dependencies:\n  espressif/button: "^3"\n';
  assert.equal(lockCoverage(findManifests(repo({ 'main/idf_component.yml': idf }))).verdict, 'unlocked');
  assert.equal(lockCoverage(findManifests(repo({ 'main/idf_component.yml': idf, 'dependencies.lock': '' }))).verdict, 'unknown');
});

test('development containers do not unlock the release', () => {
  const locked = [{ ecosystem: 'npm', manifest: 'package.json', lockfile: 'package-lock.json', product: true }];
  const verdict = (file) => lockCoverage(locked, [], unlistedInputs({ downloads: [{ kind: 'container-base-image', target: 'node:20', file, line: 1, hashCheck: false }] })).verdict;
  for (const file of ['.devcontainer/Dockerfile', 'docker-compose.yml', 'compose.dev.yaml', 'Dockerfile.dev', 'docker/Dockerfile-test', 'Dockerfile.e2e']) {
    assert.equal(verdict(file), 'locked', file);
  }
  for (const file of ['Dockerfile', 'Dockerfile.release', 'docker/Dockerfile.push-gateway', 'Dockerfile.developer-tools']) {
    assert.equal(verdict(file), 'unlocked', file);
  }
});
