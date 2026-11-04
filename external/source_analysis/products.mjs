// Which app of a repository each dependency file builds (issue 994). One
// repository can hold an Android app, an iPhone app, a desktop app, a server, a
// website and the docs; a wallet page counts only its own app's files and the
// shared ones.
//
// The sorter goes by the file's path, nothing else: the hand-made list first,
// then folder names from the top down, then the file name. A file it cannot
// place is "shared", so a page can count too much but never hides a library
// that is in the app on a guess.

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

// What the two rules above cannot guess, by the analysed app id; a path not
// listed falls back to the rules. "mobile" is both phone apps but not the rest
// of the repository, which "shared" would include.
const HAND_MADE = {
  'world.bitkey.app': [
    // Its README: firmware is the device's, terraform and datadog run the servers.
    [/^firmware\//, 'firmware'],
    [/^(terraform|datadog)\//, 'server'],
    // One file per library, named after it, so the words in the name say nothing
    // about a target (ktor-client-darwin is an iPhone library) except these suffixes.
    [/^app\/gradle-lock\/.*-android\.json$/, 'android'],
    [/^app\/gradle-lock\/.*-ios(arm64|x64|simulatorarm64)\.json$/, 'iphone'],
    // Its README: app/ holds the Android app, the iPhone app and the code they share.
    [/^app\//, 'mobile'],
  ],
  // contrib/android does not read these two (it pins its own PyQt6 in p4a_recipes);
  // make_appimage.sh does. The names say nothing about it.
  'org.electrum.electrum': [[/\/requirements-(hw|binaries)\.txt$/, 'desktop']],
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

// android | iphone | mobile | desktop | server | web | extension | docs | firmware | shared
export function targetOfLockfile(lockfile, appId = null) {
  const file = String(lockfile || '');
  const manual = (HAND_MADE[appId] || []).find(([re]) => re.test(file));
  if (manual) return manual[1];
  const segments = file.split('/');
  for (const dir of segments.slice(0, -1)) {
    const hit = PRODUCT_PARTS.find(([, re]) => re.test(dir));
    if (hit) return hit[0];
    const word = targetOfWords(dir);
    if (word) return word;
  }
  // "foo.txt" splits into foo and txt: harmless, no extension is a target word.
  return targetOfWords(segments.at(-1)) || 'shared';
}

// The targets a row's lockfiles build, or undefined when all are shared, the
// case every single-product wallet is in, so its export stays as it was.
export function targetsOfLockfiles(lockfiles, appId = null) {
  const targets = [...new Set(lockfiles.map(l => targetOfLockfile(l, appId)))].sort();
  return targets.some(t => t !== 'shared') ? targets : undefined;
}
