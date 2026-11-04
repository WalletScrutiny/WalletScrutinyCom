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
// file's target. Each entry was checked against the wallet's repository.
// "mobile" is both phone apps but not the rest of the repository.
const ANDROID_FOLDER = [/^android\//, 'android'];
const HAND_MADE = {
  'app.zeusln.zeus': [ANDROID_FOLDER],
  'co.edgesecure.app': [ANDROID_FOLDER],
  'com.foundationdevices.envoy': [ANDROID_FOLDER],
  'im.adamant.adamantmessengerpwa': [ANDROID_FOLDER],
  'io.bluewallet.bluewallet': [ANDROID_FOLDER],
  'io.muun.apollo': [ANDROID_FOLDER, [/^linters\/findbugs\/check-android\.gradle$/, 'android']],
  'fr.acinq.phoenix.mainnet': [[/^phoenix-android\//, 'android']],
  'it.airgap.vault': [ANDROID_FOLDER, [/^electron\//, 'desktop']],
  'keystone3.pro': [[/^external\/lvgl\/docs\//, 'docs']],
  'bitcoin.safe': [[/flathub_flatpak\/|requirements-build[-_]mac/, 'desktop']],
  // web/ holds the wallet libraries of every app and CI builds it for them all;
  // phonegap/ is the Cordova wrapper of the two phone apps.
  'com.coinspace.app': [[/^web\//, 'shared'], [/^phonegap\//, 'mobile'], [/^electron\//, 'desktop'], [/^server\//, 'server']],
  // contrib/android reads only build-base and build-android (it pins its own PyQt6
  // in p4a_recipes); make_appimage.sh reads hw and binaries.
  'org.electrum.electrum': [
    [/requirements-build-android\.txt$/, 'android'],
    [/requirements-(binaries-mac|binaries|build-mac|build-appimage|build-wine|hw)\.txt$/, 'desktop'],
  ],
  'world.bitkey.app': [
    // Its README: firmware is the device's, the others run the servers.
    [/^firmware\//, 'firmware'],
    [/^(server|terraform|datadog)\//, 'server'],
    // One file per library, named after it, so the words in the name say nothing
    // about a target (ktor-client-darwin is an iPhone library) except these suffixes.
    [/^app\/gradle-lock\/.*-android\.json$/, 'android'],
    [/^app\/gradle-lock\/.*-ios(arm64|x64|simulatorarm64)\.json$/, 'iphone'],
    // Its README: app/ holds the Android app, the iPhone app and the code they share.
    [/^app\//, 'mobile'],
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
