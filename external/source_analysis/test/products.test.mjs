import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guessOfLockfile, targetOfLockfile, targetsOfLockfiles, unlistedFiles } from '../products.mjs';

test('folder names give a guess, top folder first', () => {
  assert.equal(guessOfLockfile('electron/package-lock.json'), 'desktop');
  assert.equal(guessOfLockfile('server/package-lock.json'), 'server');
  assert.equal(guessOfLockfile('webapp/package-lock.json'), 'web');
  assert.equal(guessOfLockfile('external/lvgl/docs/requirements.txt'), 'docs');
  assert.equal(guessOfLockfile('android/app/build.gradle'), 'android');
  assert.equal(guessOfLockfile('phoenix-android/build.gradle.kts'), 'android');
  assert.equal(guessOfLockfile('ios/Podfile.lock'), 'iphone');
  assert.equal(guessOfLockfile('tools/build_linux/flathub_flatpak/requirements-runtime.txt'), 'desktop');
});

test('file names give a guess when the folders say nothing', () => {
  const dir = 'contrib/deterministic-build';
  assert.equal(guessOfLockfile(`${dir}/requirements-build-android.txt`), 'android');
  assert.equal(guessOfLockfile(`${dir}/requirements-build-wine.txt`), 'desktop');
  assert.equal(guessOfLockfile(`${dir}/requirements-hw.txt`), 'shared');
});

test('a word only counts whole: names that merely contain one are no guess', () => {
  for (const file of ['package-lock.json', 'phoenix-shared/build.gradle.kts', 'twin/requirements.txt', 'biometrics/yarn.lock', 'machine/Cargo.lock', 'scripts/requirements.txt']) {
    assert.equal(guessOfLockfile(file), 'shared', file);
  }
});

test('a guess never takes a file off a page: only the hand-made list does', () => {
  for (const file of ['electron/package-lock.json', 'web/package-lock.json', 'android/build.gradle', 'firmware/requirements.txt']) {
    assert.equal(targetOfLockfile(file, 'not.on.the.list'), 'shared', file);
  }
});

test('Coin Wallet: web/ is the app, phonegap/ the phone wrapper', () => {
  const coin = 'com.coinspace.app';
  assert.equal(targetOfLockfile('web/package-lock.json', coin), 'shared');
  assert.equal(targetOfLockfile('phonegap/package-lock.json', coin), 'mobile');
  assert.equal(targetOfLockfile('electron/package-lock.json', coin), 'desktop');
  assert.equal(targetOfLockfile('server/package-lock.json', coin), 'server');
});

test('Electrum: the files its Android build does not read are the desktop app\'s', () => {
  const electrum = 'org.electrum.electrum';
  for (const dir of ['contrib/requirements', 'contrib/deterministic-build']) {
    for (const name of ['binaries-mac', 'binaries', 'build-mac', 'build-appimage', 'build-wine', 'hw']) {
      assert.equal(targetOfLockfile(`${dir}/requirements-${name}.txt`, electrum), 'desktop', name);
    }
    assert.equal(targetOfLockfile(`${dir}/requirements-build-android.txt`, electrum), 'android');
    assert.equal(targetOfLockfile(`${dir}/requirements-build-base.txt`, electrum), 'shared');
    assert.equal(targetOfLockfile(`${dir}/requirements.txt`, electrum), 'shared');
  }
});

test('Bitkey: firmware, servers, and app/ for the phones', () => {
  const bitkey = 'world.bitkey.app';
  assert.equal(targetOfLockfile('firmware/requirements.txt', bitkey), 'firmware');
  assert.equal(targetOfLockfile('terraform/aws/firmware-signer/requirements.txt', bitkey), 'server');
  assert.equal(targetOfLockfile('datadog/package-lock.json', bitkey), 'server');
  assert.equal(targetOfLockfile('server/Cargo.lock', bitkey), 'server');
  assert.equal(targetOfLockfile('core/Cargo.lock', bitkey), 'shared');
  assert.equal(targetOfLockfile('app/rust/Cargo.lock', bitkey), 'mobile');
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

test('unlistedFiles names what looks like another product and has no rule', () => {
  assert.deepEqual(unlistedFiles(['webapp/package-lock.json', 'yarn.lock', 'webapp/package-lock.json'], 'arcbtc.lnbits.hww'), ['webapp/package-lock.json']);
  assert.deepEqual(unlistedFiles(['web/package-lock.json', 'server/package-lock.json', 'phonegap/package-lock.json'], 'com.coinspace.app'), []);
});

test('targetsOfLockfiles says nothing when every file is shared', () => {
  assert.equal(targetsOfLockfiles(['package-lock.json', 'yarn.lock'], 'it.airgap.vault'), undefined);
  assert.equal(targetsOfLockfiles([], 'it.airgap.vault'), undefined);
  assert.deepEqual(targetsOfLockfiles(['electron/package-lock.json', 'yarn.lock', 'android/build.gradle'], 'it.airgap.vault'), ['android', 'desktop', 'shared']);
  assert.equal(targetsOfLockfiles(['electron/package-lock.json', 'android/build.gradle'], 'not.on.the.list'), undefined);
});
