// Which app of a repository each dependency file builds (issue 994). One
// repository can hold an Android app, an iPhone app, a desktop app, a server, a
// website and the docs; a wallet page counts only its own app's files and the
// shared ones.
//
// Only the hand-made list below takes a file off a page. Folder and file names
// are guesses and a wrong guess hides libraries that are in the app: Coin
// Wallet's web/ folder is its phone and desktop app's code. So a file not on the
// list counts as shared, and a guess only names it for someone to review
// (unlistedFiles). A page may count too much until then, never too little.

// Another product built from the same repository, by folder name. A row's
// `part` in the export (the tree's "Where?") comes from this list alone.
const PRODUCT_PARTS = [
  ['desktop', /^(electron|desktop|electron-app|app-electron)$/i],
  ['server', /^(server|backend|api|services?)$/i],
  ['web', /^(web|website|webapp|site|landing)$/i],
  ['extension', /^(extension|browser-extension|chrome-extension|webextension)$/i],
  ['docs', /^(docs?|documentation)$/i],
];

// Words inside a folder or file name: phoenix-android, requirements-build-mac.txt.
const TARGET_WORDS = new Map([
  ...['android'].map(w => [w, 'android']),
  ...['ios', 'iphone'].map(w => [w, 'iphone']),
  ...['mac', 'macos', 'osx', 'darwin', 'windows', 'win', 'win32', 'wine', 'linux', 'appimage', 'flatpak'].map(w => [w, 'desktop']),
]);

// The hand-made list, by the analysed app id: the first matching rule gives a
// file's target. Each rule is [path, target, links to the evidence at a pinned
// release]. The rules were made by reading those files, so far by AI agents;
// nobody built the apps to confirm them, and a person should review them.
// "mobile" is both phone apps but not the rest of the repository.
const github = (repo, ref, path) => `https://github.com/${repo}/blob/${ref}/${path}`;
const androidFolder = (repo, ref, path = 'android/build.gradle') => [/^android\//, 'android', [github(repo, ref, path)]];
const COIN = (path) => github('CoinSpace/CoinSpace', 'v6.31.0', path);
const ELECTRUM = (path) => github('spesmilo/electrum', '4.8.3', path);
const BITKEY = (path, ref = 'app/2026.16.1') => github('proto-at-block/bitkey', ref, path);
export const HAND_MADE = {
  'app.zeusln.zeus': [androidFolder('ZeusLN/zeus', 'v13.2.4')],
  'co.edgesecure.app': [androidFolder('EdgeApp/edge-react-gui', 'v4.52.2')],
  'com.foundationdevices.envoy': [androidFolder('Foundation-Devices/envoy', 'v2.3.7', 'android/app/build.gradle')],
  'im.adamant.adamantmessengerpwa': [androidFolder('Adamant-im/adamant-im', 'v4.12.0')],
  'io.bluewallet.bluewallet': [androidFolder('BlueWallet/BlueWallet', 'v8.0.2')],
  'io.muun.apollo': [
    androidFolder('muun/apollo', 'v55.12', 'android/apolloui/build.gradle'),
    [/^linters\/findbugs\/check-android\.gradle$/, 'android', [github('muun/apollo', 'v55.12', 'linters/findbugs/check-android.gradle')]],
  ],
  'fr.acinq.phoenix.mainnet': [[/^phoenix-android\//, 'android', [github('ACINQ/phoenix', 'android-v2.6.2', 'phoenix-android/build.gradle.kts')]]],
  'it.airgap.vault': [
    androidFolder('airgap-it/airgap-vault', 'v3.35.0'),
    [/^electron\//, 'desktop', [github('airgap-it/airgap-vault', 'v3.35.0', 'electron/package.json#L48')]],
  ],
  'keystone3.pro': [[/^external\/lvgl\/docs\//, 'docs', [github('KeystoneHQ/keystone3-firmware', '3.2.0', 'external/lvgl/docs/requirements.txt#L3')]]],
  'bitcoin.safe': [[/flathub_flatpak\/|requirements-build[-_]mac/, 'desktop', [
    github('andreasgriffin/bitcoin-safe', '2.2.1', 'tools/build_linux/flathub_flatpak/requirements-runtime.txt'),
    github('andreasgriffin/bitcoin-safe', '2.2.1', 'tools/deterministic-build/requirements-build_mac_x86_64.txt'),
  ]]],
  'com.coinspace.app': [
    // The wallet libraries of every app; CI installs and builds them for the build job.
    [/^web\//, 'shared', [COIN('web/package.json#L30'), COIN('.github/workflows/ci.yml#L182'), COIN('.github/workflows/ci.yml#L326')]],
    // The Cordova wrapper of the two phone apps.
    [/^phonegap\//, 'mobile', [COIN('phonegap/package.json#L18-L19')]],
    [/^electron\//, 'desktop', [COIN('electron/package.json#L41')]],
    [/^server\//, 'server', [COIN('server/package.json#L43')]],
  ],
  'org.electrum.electrum': [
    [/requirements-build-android\.txt$/, 'android', [ELECTRUM('contrib/android/Dockerfile#L191-L196')]],
    // The Android build reads only build-base and build-android, and pins its own
    // PyQt6 in p4a_recipes; the desktop builds read these.
    [/requirements-(binaries-mac|binaries|build-mac|build-appimage|build-wine|hw)\.txt$/, 'desktop', [
      ELECTRUM('contrib/android/Dockerfile#L191-L196'),
      ELECTRUM('contrib/build-linux/appimage/make_appimage.sh#L151-L153'),
      ELECTRUM('contrib/osx/make_osx.sh#L196-L202'),
      ELECTRUM('contrib/build-wine/build-electrum-git.sh#L45-L49'),
    ]],
  ],
  'world.bitkey.app': [
    [/^firmware\//, 'firmware', [BITKEY('README.md#L22')]],
    [/^server\//, 'server', [BITKEY('README.md#L24')]],
    [/^terraform\//, 'server', [BITKEY('README.md#L25')]],
    // Gone from the newer releases; infrastructure code for Datadog monitoring.
    [/^datadog\//, 'server', [BITKEY('datadog/package.json#L23', 'app/2026.2.1')]],
    // One file per library, named after it, so the words in the name say nothing
    // about a target (ktor-client-darwin is an iPhone library) except these suffixes.
    [/^app\/gradle-lock\/.*-android\.json$/, 'android', [BITKEY('app/gradle-lock/androidx.compose.animation:animation-android.json')]],
    [/^app\/gradle-lock\/.*-ios(arm64|x64|simulatorarm64)\.json$/, 'iphone', [BITKEY('app/gradle-lock/co.touchlab:sqliter-driver-iosarm64.json')]],
    // The Android app, the iPhone app and the code they share.
    [/^app\//, 'mobile', [BITKEY('README.md#L15-L18')]],
  ],
};

// The targets each page counts. Platforms not listed (bearer, others) get no
// filter: nothing says which of a repository's files they build.
// src/dependencies-panel-model.mjs keeps the same map for the wallet page.
export const COUNTED_TARGETS = {
  android: ['shared', 'mobile', 'android'],
  iphone: ['shared', 'mobile', 'iphone'],
  desktop: ['shared', 'desktop'],
  hardware: ['shared', 'firmware'],
};

const wordsOf = name => name.toLowerCase().split(/[-_.]/);
const targetOfWords = name => wordsOf(name).map(w => TARGET_WORDS.get(w)).find(Boolean) || null;

export function productPartOf(lockfile) {
  for (const dir of String(lockfile || '').split('/').slice(0, -1)) {
    const hit = PRODUCT_PARTS.find(([, re]) => re.test(dir));
    if (hit) return hit[0];
  }
  return null;
}

const ruleFor = (file, appId) => (HAND_MADE[appId] || []).find(([re]) => re.test(file));

// What the file's name suggests, for review; never takes a file off a page.
export function guessOfLockfile(lockfile) {
  const segments = String(lockfile || '').split('/');
  for (const dir of segments.slice(0, -1)) {
    const hit = PRODUCT_PARTS.find(([, re]) => re.test(dir));
    if (hit) return hit[0];
    const word = targetOfWords(dir);
    if (word) return word;
  }
  // "foo.txt" splits into foo and txt: harmless, no extension is a target word.
  return targetOfWords(segments.at(-1)) || 'shared';
}

// android | iphone | mobile | desktop | server | web | extension | docs | firmware | shared
export function targetOfLockfile(lockfile, appId = null) {
  return ruleFor(String(lockfile || ''), appId)?.[1] || 'shared';
}

// The files that look like another product's but are not on the hand-made list:
// they count on every page until someone checks them and adds a rule.
export function unlistedFiles(lockfiles, appId = null) {
  return [...new Set(lockfiles)].filter(f => !ruleFor(f, appId) && guessOfLockfile(f) !== 'shared').sort();
}

// The targets a row's lockfiles build, or undefined when all are shared, the
// case every single-product wallet is in, so its export stays as it was.
export function targetsOfLockfiles(lockfiles, appId = null) {
  const targets = [...new Set(lockfiles.map(l => targetOfLockfile(l, appId)))].sort();
  return targets.some(t => t !== 'shared') ? targets : undefined;
}
