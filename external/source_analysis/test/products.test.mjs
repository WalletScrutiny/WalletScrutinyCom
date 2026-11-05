import { test } from 'node:test';
import assert from 'node:assert/strict';
import { globToRegExp, guessOfLockfile, loadRuleFiles, parseRulesFile, partOfFile, sortingOf, targetOfLockfile, targetsOfLockfiles, unlistedFiles, useRepositories } from '../products.mjs';

const REPOS = {
  'app.zeusln.zeus': 'ZeusLN/zeus', 'co.edgesecure.app': 'EdgeApp/edge-react-gui', 'com.foundationdevices.envoy': 'Foundation-Devices/envoy',
  'im.adamant.adamantmessengerpwa': 'Adamant-im/adamant-im', 'io.bluewallet.bluewallet': 'bluewallet/bluewallet', 'io.muun.apollo': 'muun/apollo',
  'fr.acinq.phoenix.mainnet': 'ACINQ/phoenix', 'it.airgap.vault': 'airgap-it/airgap-vault', 'keystone3.pro': 'KeystoneHQ/keystone3-firmware',
  'bitcoin.safe': 'andreasgriffin/bitcoin-safe', 'com.coinspace.app': 'CoinSpace/CoinSpace', 'org.electrum.electrum': 'spesmilo/electrum',
  'world.bitkey.app': 'proto-at-block/bitkey',
};
useRepositories(Object.entries(REPOS).map(([appId, repo]) => ({ appId, repoUrl: `https://github.com/${repo}` })));

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
  assert.equal(targetOfLockfile('contrib/android/buildozer_qml.spec', electrum), 'android', 'recipe libraries stay off the desktop page');
});

test('Bitkey: firmware, servers, and app/ for the phones', () => {
  const bitkey = 'world.bitkey.app';
  assert.equal(targetOfLockfile('firmware/requirements.txt', bitkey), 'firmware');
  assert.equal(targetOfLockfile('firmware/third-party/libew/Cargo.lock', bitkey), 'none', 'a demo program');
  assert.equal(targetOfLockfile('firmware/tools/emulator-launcher/Cargo.lock', bitkey), 'none', 'runs the emulator on a computer');
  assert.equal(targetOfLockfile('terraform/aws/firmware-signer/requirements.txt', bitkey), 'server');
  assert.equal(targetOfLockfile('datadog/package-lock.json', bitkey), 'server');
  assert.equal(targetOfLockfile('server/Cargo.lock', bitkey), 'server');
  assert.equal(targetOfLockfile('core/Cargo.lock', bitkey), 'none', 'the phones read app/rust/Cargo.lock');
  assert.equal(targetOfLockfile('app/rust/Cargo.lock', bitkey), 'mobile');
  assert.equal(targetOfLockfile('app/rust/bdk-ffi/Cargo.lock', bitkey), 'none', 'a workspace member: Cargo reads app/rust/Cargo.lock');
  assert.equal(targetOfLockfile('app/trailblaze-tests/gradle/verification-metadata.xml', bitkey), 'tests', 'a separate build, not the app');
});

test("Bitkey's per-library files are not read for words: only the variant suffix counts", () => {
  const lock = name => targetOfLockfile(`app/gradle-lock/${name}.json`, 'world.bitkey.app');
  assert.equal(lock('androidx.compose.animation:animation-android'), 'android');
  assert.equal(lock('io.ktor:ktor-client-darwin-iosarm64'), 'iphone');
  assert.equal(lock('co.touchlab:sqliter-driver-iossimulatorarm64'), 'iphone');
  assert.equal(lock('org.jetbrains.compose.components:components-resources-iosArm64'), 'iphone', 'whatever the case of the suffix');
  assert.equal(lock('org.jetbrains.compose.components:components-resources-iosSimulatorArm64'), 'iphone');
  assert.equal(lock('org.jetbrains.compose.components:components-resources-iosX64'), 'iphone');
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

test('every rules file loads: fixed words, a why, and proof at a commit of its own repository', () => {
  assert.equal(loadRuleFiles().size, 13); // parseRulesFile throws on a broken file
});

const VALID = () => ({
  release: 'v1', rules: [{ files: 'a/**', belongs_to: 'desktop', why: 'x', proof: [`https://github.com/o/r/blob/${'a'.repeat(40)}/a#L1`] }],
});
const parse = (data) => parseRulesFile(JSON.stringify(data), 'github.com/o/r');
const broken = (change, why) => assert.throws(() => { const d = VALID(); change(d); parse(d); }, why);

test('a rules file is rejected for anything the format does not allow', () => {
  assert.equal(parse(VALID()).rules[0].target, 'desktop');
  broken(d => { d.rules[0].belongs_to = 'shared'; }, /belongs_to/);
  broken(d => { d.rules[0].belongs_to = 'toString'; }, /belongs_to/);
  broken(d => { delete d.rules[0].why; }, /why/);
  broken(d => { d.rules[0].proof = []; }, /proof/);
  broken(d => { d.rules[0].proof = ['https://github.com/o/r/blob/v1.0.0/a']; }, /commit hash/);
  broken(d => { d.rules[0].proof = [`https://github.com/x/y/blob/${'a'.repeat(40)}/a`]; }, /this repository/);
  broken(d => { d.reviewed_by = 'Danny'; }, /reviewed_on/);
  broken(d => { d.reviewed_by = 'Danny'; d.reviewed_on = 'today'; }, /YYYY-MM-DD/);
  broken(d => { d.reviewed_by = 'Danny'; d.reviewed_on = '2026-11-05'; }, /reviewed_files/);
  broken(d => { d.reviewed_files = ['a/x']; }, /reviewed_files/);
  broken(d => { d.reviewed_by = 'Danny'; d.reviewed_on = '2026-11-05'; d.reviewed_files = 'a/x'; }, /reviewed_files/);
  broken(d => { delete d.release; }, /release/);
  broken(d => { d.rules = []; }, /rules/);
});

test('both readable belongs_to words mean the code\'s target', () => {
  const words = (word) => { const d = VALID(); d.rules[0].belongs_to = word; return parse(d).rules[0].target; };
  assert.equal(words('all apps'), 'shared');
  assert.equal(words('both phones'), 'mobile');
});

test('file patterns: folders, any depth, one name part', () => {
  assert.ok(globToRegExp('web/**').test('web/a/package-lock.json'));
  assert.ok(!globToRegExp('web/**').test('webapp/package-lock.json'));
  assert.ok(globToRegExp('**/requirements-hw.txt').test('requirements-hw.txt'), 'no folder at all');
  assert.ok(globToRegExp('**/requirements-hw.txt').test('contrib/deep/requirements-hw.txt'));
  assert.ok(!globToRegExp('**/requirements-hw.txt').test('contrib/old-requirements-hw.txt'));
  assert.ok(globToRegExp('**/requirements-build?mac*').test('tools/requirements-build_mac_x86_64.txt'));
  assert.ok(globToRegExp('app/gradle-lock/**-iosarm64.json').test('app/gradle-lock/a:b-iosArm64.json'), 'case does not matter');
  assert.ok(!globToRegExp('a.b').test('axb'), 'a dot is a dot');
  assert.ok(!globToRegExp('a*').test('a/b'), 'one star stops at a slash');
});

test('the first matching rule wins', () => {
  assert.equal(targetOfLockfile('app/gradle-lock/a:b-android.json', 'world.bitkey.app'), 'android');
  assert.equal(targetOfLockfile('app/gradle-lock/a:b.json', 'world.bitkey.app'), 'mobile');
});

test('rules follow the repository: every id of it has them, an unknown id has none', () => {
  const coin = { repoUrl: 'https://github.com/coinspace/coinspace' };
  try {
    useRepositories([{ appId: 'some.new.record', aliases: [{ appId: 'some.new.record' }, { appId: 'com.coinspace.app' }], ...coin }]);
    assert.equal(targetOfLockfile('electron/package-lock.json', 'some.new.record'), 'desktop', 'repository names ignore case');
    assert.equal(targetOfLockfile('electron/package-lock.json', 'com.coinspace.app'), 'desktop', 'results stored under the old first record keep their rules');
    assert.equal(sortingOf(['electron/package-lock.json'], 'com.coinspace.app').status, 'pending');
    useRepositories([{ appId: 'some.new.record', ...coin }]);
    assert.deepEqual(sortingOf(['electron/package-lock.json'], 'com.coinspace.app'), { status: 'none' }, 'no longer this repository');
  } finally {
    useRepositories(Object.entries(REPOS).map(([appId, repo]) => ({ appId, repoUrl: `https://github.com/${repo}` })));
  }
});

const COIN_FILES = ['web/package-lock.json', 'phonegap/package-lock.json', 'electron/package-lock.json', 'server/package-lock.json'];

test('the sorting label comes from the rules file', () => {
  assert.deepEqual(sortingOf(['package-lock.json'], 'not.on.the.list'), { status: 'none' });
  assert.equal(sortingOf([], 'com.coinspace.app'), undefined, 'a release with no files says nothing');
  assert.deepEqual(sortingOf(COIN_FILES, 'com.coinspace.app'), { status: 'reviewed', by: 'Danny', on: '2026-11-05', release: 'v6.31.0' });
  const electrum = sortingOf(['contrib/deterministic-build/requirements.txt', 'contrib/deterministic-build/requirements-hw.txt'], 'org.electrum.electrum');
  assert.equal(electrum.status, 'pending', 'no reviewer yet');
  assert.equal(electrum.changedSince, undefined);
  assert.deepEqual(electrum.filesOutside, { android: 1, iphone: 1, desktop: 0, hardware: 1 });
});

test('a reviewed file rejects a rule that earlier rules hide', () => {
  const rule = (files) => ({ files, belongs_to: 'desktop', why: 'x', proof: VALID().rules[0].proof });
  const reviewed = (rules) => ({ release: 'v1', reviewed_by: 'Danny', reviewed_on: '2026-11-05', reviewed_files: ['app/tests/x', 'app/y'], rules });
  assert.throws(() => parse(reviewed([rule('app/**'), rule('app/tests/**')])), /rule 2 is hidden/);
  assert.equal(parse(reviewed([rule('app/tests/**'), rule('app/**')])).rules.length, 2, 'narrow above wide is fine');
  assert.equal(parse(reviewed([rule('app/**'), rule('terraform/**')])).rules.length, 2, 'a rule for another release\'s files is fine');
  assert.equal(parse({ release: 'v1', rules: [rule('app/**'), rule('app/tests/**')] }).rules.length, 2, 'no reviewed files to check against');
});

test('a review covers the exact files the person saw', () => {
  const coin = 'com.coinspace.app';
  const changed = { by: 'Danny', on: '2026-11-05', release: 'v6.31.0' };
  assert.equal(sortingOf([...COIN_FILES].reverse(), coin).status, 'reviewed', 'the order does not matter');
  assert.deepEqual(sortingOf([...COIN_FILES, 'tools/package-lock.json'], coin).changedSince, changed, 'a new file');
  assert.deepEqual(sortingOf(COIN_FILES.slice(1), coin).changedSince, changed, 'a file is gone');
  assert.deepEqual(sortingOf([...COIN_FILES, 'web/sub/package-lock.json'], coin).changedSince, changed, 'a new file under a wide rule');
  const bitkey = [...loadRuleFiles().get('github.com/proto-at-block/bitkey').reviewedFiles];
  assert.equal(sortingOf(bitkey, 'world.bitkey.app').status, 'reviewed');
  assert.equal(sortingOf([...bitkey, 'app/gradle-lock/new:lib.json'], 'world.bitkey.app').status, 'pending', 'a new library under app/**');
});

test('a rule can take a wrong guess off a row, but never adds a label', () => {
  const coin = 'com.coinspace.app';
  assert.equal(partOfFile('web/package-lock.json', coin), null, 'its web/ is the app');
  assert.equal(partOfFile('web/package-lock.json', 'not.on.the.list'), 'web', 'the guess stays without a rule');
  assert.equal(partOfFile('electron/package-lock.json', coin), 'desktop', 'the rule agrees');
  assert.equal(partOfFile('server/package-lock.json', coin), 'server');
  assert.equal(partOfFile('contrib/requirements/requirements-hw.txt', 'org.electrum.electrum'), null, 'a new label would hide the row in the Tree');
  assert.equal(partOfFile('firmware/requirements.txt', 'world.bitkey.app'), null);
});
