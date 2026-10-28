// Lock coverage (plugins/lock-coverage.mjs): a manifest without a lockfile,
// or an unlocked entry, must never look like a clean result.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { findManifests, lockCoverage, unlistedInputs, coverageForReaders, coverageByPlatform, platformOf } from '../plugins/lock-coverage.mjs';

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
  assert.equal(verdictOf({ 'go.mod': 'module x', 'go.sum': '' }), 'unknown');
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'pnpm-lock.yaml': '' }), 'unknown');
  assert.equal(verdictOf({ 'pyproject.toml': '[tool.poetry.dependencies]\nx = "1"\n', 'poetry.lock': '' }), 'unknown');
  // the ones pinning parses stay locked
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'yarn.lock': '' }), 'locked');
  assert.equal(verdictOf({ 'Cargo.toml': '[package]', 'Cargo.lock': '' }), 'locked');
  assert.equal(verdictOf({ 'pubspec.yaml': 'dependencies:', 'pubspec.lock': '' }), 'locked');
  // one unread lockfile is enough, and it is named
  const c = lockCoverage(findManifests(repo({ 'package.json': NPM_DEPS, 'package-lock.json': '{}', 'mobile/go.mod': 'module x', 'mobile/go.sum': '' })));
  assert.equal(c.verdict, 'unknown');
  assert.deepEqual(c.unread, [{ ecosystem: 'go', manifest: 'mobile/go.mod', lockfile: 'mobile/go.sum' }]);
  // a missing lockfile still beats an unread one
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'go.mod': 'module x', 'go.sum': '' }), 'unlocked');
  // a sample app's unread lockfile does not count
  assert.equal(verdictOf({ 'package.json': NPM_DEPS, 'yarn.lock': '', 'example/go.mod': 'module x', 'example/go.sum': '' }), 'locked');
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

test('a pub workspace member is locked by the workspace root (Bull Bitcoin v6.15.0)', () => {
  const m = findManifests(repo({
    'pubspec.yaml': 'workspace:\n  - packages/ui\ndependencies:', 'pubspec.lock': '',
    'packages/ui/pubspec.yaml': 'name: ui\nresolution: workspace\ndependencies:',
    'packages/lone/pubspec.yaml': 'name: lone\ndependencies:',
  }));
  const lockOf = (rel) => m.find(x => x.manifest === rel).lockfile;
  assert.equal(lockOf('packages/ui/pubspec.yaml'), 'pubspec.lock');
  assert.equal(lockOf('packages/lone/pubspec.yaml'), null, 'not a workspace member: it needs its own lockfile');
});

test('readers see a shared unread lockfile once', () => {
  const files = { 'pubspec.yaml': 'workspace:\n  - a\n  - b\ndependencies:', 'pubspec.lock': '',
    'a/pubspec.yaml': 'resolution: workspace', 'b/pubspec.yaml': 'resolution: workspace' };
  // stored before pinning read pubspec.lock: no `read` flag, no rows
  const fresh = lockCoverage(findManifests(repo(files)));
  const stored = { ...fresh, manifests: fresh.manifests.map(({ read, ...m }) => m) };
  const r = coverageForReaders(stored);
  assert.deepEqual(r.unread.map(u => u.lockfile), ['pubspec.lock']);
  assert.equal(r.unreadCount, 1);
  // analysed since: read, so locked
  assert.equal(coverageForReaders(fresh).verdict, 'locked');
});

// AirGap Vault v3.35.0 (2026-10-28): a helper script's requirements.txt, the
// iPhone lockfiles on the Android page, and one Dockerfile line listed twice.
const AIRGAP = {
  'package.json': NPM_DEPS, 'yarn.lock': '',
  'scripts/requirements.txt': 'duckdb\n',
  'ios/App/Podfile': "pod 'X'", 'ios/App/Podfile.lock': '',
  'android/settings.gradle': '',
};
const airgapPinning = [{ entries: [{ ecosystem: 'pip', lockfile: 'scripts/requirements.txt', name: 'duckdb', tier: 'floating' }] }];
const airgapUnlisted = unlistedInputs({ downloads: [
  { kind: 'curl', target: 'https://dl-ssl.google.com/linux/linux_signing_key.pub', file: 'Dockerfile', line: 16, hashCheck: false },
  { kind: 'curl', target: 'http://dl.google.com/linux/chrome/deb/', file: 'Dockerfile', line: 16, hashCheck: false },
] });

test('a helper script is not the app: its manifest and version ranges do not count', () => {
  const c = lockCoverage(findManifests(repo(AIRGAP)), airgapPinning, airgapUnlisted);
  assert.equal(c.manifests.find(m => m.manifest === 'scripts/requirements.txt').product, false);
  assert.deepEqual(c.floatingRows, {});
  assert.deepEqual(c.floatingFiles, {});
  // a range in the app's own files is named by file
  const own = lockCoverage([], [{ entries: [{ ecosystem: 'gradle', lockfile: 'app/build.gradle', tier: 'floating' }, { ecosystem: 'gradle', lockfile: 'app/build.gradle', tier: 'floating' }] }]);
  assert.deepEqual(own.floatingFiles, { 'app/build.gradle': { ecosystem: 'gradle', count: 2 } });
  const r = coverageForReaders(own);
  assert.equal(r.floating, 2);
  assert.deepEqual(r.floatingFiles, ['app/build.gradle']);
});

test('readers re-grade a helper script stored as the app by an older analyser', () => {
  const stored = { manifests: [{ ecosystem: 'npm', manifest: 'package.json', lockfile: 'yarn.lock', product: true },
    { ecosystem: 'pip', manifest: 'scripts/requirements.txt', lockfile: 'scripts/requirements.txt', product: true }],
  floatingFiles: { 'scripts/requirements.txt': { ecosystem: 'pip', count: 1 } }, floatingRows: { pip: 1 } };
  assert.equal(coverageForReaders(stored).verdict, 'locked');
});

test('each app page sees only its own build', () => {
  assert.equal(platformOf('ios/App/Podfile', 'cocoapods'), 'iphone');
  assert.equal(platformOf('android/settings.gradle', 'gradle'), 'android');
  assert.equal(platformOf('android/app/build.sh'), 'android');
  assert.equal(platformOf('Dockerfile'), null);
  assert.equal(platformOf('linux/CMakeLists.txt', 'c/c++'), 'desktop', "Flutter's desktop target (Bull Bitcoin)");
  const stored = lockCoverage(findManifests(repo(AIRGAP)), airgapPinning, unlistedInputs());
  assert.equal(coverageForReaders(stored).verdict, 'unknown', 'the whole repository: the Podfile.lock is not read');
  const by = coverageByPlatform(stored);
  assert.equal(by.android.verdict, 'locked');
  assert.equal(by.android.unreadCount, 0);
  assert.equal(by.iphone, undefined);
});

test('one line that downloads twice is named once', () => {
  const stored = lockCoverage(findManifests(repo(AIRGAP)), airgapPinning, airgapUnlisted);
  const r = coverageForReaders(stored, 'android');
  assert.equal(r.downloadCount, 2);
  assert.deepEqual(r.downloads.map(d => `${d.file}:${d.line}`), ['Dockerfile:16']);
  assert.equal(r.downloadPlaceCount, 1);
});
