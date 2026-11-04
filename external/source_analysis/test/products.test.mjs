import { test } from 'node:test';
import assert from 'node:assert/strict';
import { targetOfLockfile, targetsOfLockfiles } from '../products.mjs';

test('folder names place a file, top folder first', () => {
  assert.equal(targetOfLockfile('electron/package-lock.json'), 'desktop');
  assert.equal(targetOfLockfile('server/package-lock.json'), 'server');
  assert.equal(targetOfLockfile('webapp/package-lock.json'), 'web');
  assert.equal(targetOfLockfile('external/lvgl/docs/requirements.txt'), 'docs');
  assert.equal(targetOfLockfile('android/app/build.gradle'), 'android');
  assert.equal(targetOfLockfile('phoenix-android/build.gradle.kts'), 'android');
  assert.equal(targetOfLockfile('ios/Podfile.lock'), 'iphone');
  assert.equal(targetOfLockfile('tools/build_linux/flathub_flatpak/requirements-runtime.txt'), 'desktop');
});

test('file names place a file when the folders say nothing', () => {
  const dir = 'contrib/deterministic-build';
  assert.equal(targetOfLockfile(`${dir}/requirements-build-android.txt`), 'android');
  for (const name of ['binaries-mac', 'build-mac', 'build-appimage', 'build-wine']) {
    assert.equal(targetOfLockfile(`${dir}/requirements-${name}.txt`), 'desktop', name);
  }
  for (const name of ['binaries', 'build-base', 'hw']) {
    assert.equal(targetOfLockfile(`${dir}/requirements-${name}.txt`), 'shared', name);
  }
});

test('a word only counts whole: names that merely contain one stay shared', () => {
  for (const file of ['package-lock.json', 'phoenix-shared/build.gradle.kts', 'twin/requirements.txt', 'biometrics/yarn.lock', 'machine/Cargo.lock', 'scripts/requirements.txt']) {
    assert.equal(targetOfLockfile(file), 'shared', file);
  }
});

test('the hand-made list wins, and only for its own wallet', () => {
  const bitkey = 'world.bitkey.app';
  assert.equal(targetOfLockfile('firmware/requirements.txt', bitkey), 'firmware');
  assert.equal(targetOfLockfile('firmware/requirements.txt', 'other.wallet'), 'shared');
  assert.equal(targetOfLockfile('terraform/aws/firmware-signer/requirements.txt', bitkey), 'server');
  assert.equal(targetOfLockfile('datadog/package-lock.json', bitkey), 'server');
  assert.equal(targetOfLockfile('server/Cargo.lock', bitkey), 'server');
  assert.equal(targetOfLockfile('core/Cargo.lock', bitkey), 'shared');
  assert.equal(targetOfLockfile('contrib/requirements/requirements-hw.txt', 'org.electrum.electrum'), 'desktop');
  assert.equal(targetOfLockfile('contrib/deterministic-build/requirements-binaries.txt', 'org.electrum.electrum'), 'desktop');
  assert.equal(targetOfLockfile('contrib/deterministic-build/requirements.txt', 'org.electrum.electrum'), 'shared');
});

test("Bitkey's per-library files are not read for words: only the variant suffix counts", () => {
  const lock = name => targetOfLockfile(`app/gradle-lock/${name}.json`, 'world.bitkey.app');
  assert.equal(lock('androidx.compose.animation:animation-android'), 'android');
  assert.equal(lock('io.ktor:ktor-client-darwin-iosarm64'), 'iphone');
  assert.equal(lock('co.touchlab:sqliter-driver-iossimulatorarm64'), 'iphone');
  assert.equal(lock('io.ktor:ktor-client-darwin'), 'mobile');
  assert.equal(lock('org.jetbrains.skiko:skiko-awt-runtime-linux-arm64'), 'mobile');
  assert.equal(lock('androidx.activity:activity'), 'mobile');
});

test('targetsOfLockfiles says nothing when every file is shared', () => {
  assert.equal(targetsOfLockfiles(['package-lock.json', 'yarn.lock']), undefined);
  assert.equal(targetsOfLockfiles([]), undefined);
  assert.deepEqual(targetsOfLockfiles(['electron/package-lock.json', 'yarn.lock', 'server/yarn.lock']), ['desktop', 'server', 'shared']);
});
