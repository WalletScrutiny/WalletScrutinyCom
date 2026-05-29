import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  toLegacyPlatform,
  compareVersions,
  groupVerificationsByAppIdAndSortByVersion,
  getFirstTagValue,
  getAppIdsFromVerifications,
  getFileAttachmentIDsForVerificationEvent,
  filterAssetsWithoutVerification,
  scriptContainsSudo,
  getCombinationsFromAppInfo,
  findArchAndTypeForFile,
  getScriptsToReproduce,
  sanitizeFilesystemSegment,
  findFileRecursively,
  calculateFileHash,
  saveScriptFromEventMakeExecutable,
  removeDirectoryRecursive,
  createCompilationDirectory
} from '../utils.mjs';
import { DEBUG_APP_IDS } from '../config/config.mjs';
import { assetBundleRegistrationKind } from '../nostr-constants.mjs';
import {
  getAssetFileEntries,
  pickScriptBinaryEntry,
  bundleHasFullVerification,
  getAssetBundleDedupKey,
} from '../asset-utils.mjs';

const debugBuildDir = fileURLToPath(new URL('../build_server_build_dir', import.meta.url));
const tempDirs = [];

function makeTempDir(label) {
  const dir = path.join(debugBuildDir, `test-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(dir, { recursive: true });
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

// ---- Helpers for building lightweight fixtures ---------------------------

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const HASH_C = 'c'.repeat(64);
const TOO_SHORT = 'd'.repeat(32);

function makeEvent({ id = 'evt', pubkey = 'pk', kind, tags = [], created_at = 0, content = '' } = {}) {
  return {
    id,
    pubkey,
    kind,
    tags,
    created_at,
    content,
    // Mirror NDKEvent's helper used by the production code.
    getMatchingTags(name) {
      return this.tags.filter(tag => tag[0] === name);
    }
  };
}

function makeAsset({ appId, platform, version = '1.0.0', hashes = [], fileName, kind }) {
  const tags = [
    ['i', appId],
    ['platform', platform],
    ['version', version],
  ];
  if (kind === assetBundleRegistrationKind) {
    const names = Array.isArray(fileName) ? fileName : hashes.map((_, i) => `file-${i}.bin`);
    hashes.forEach((hash, i) => tags.push(['x', hash, names[i] ?? `file-${i}.bin`]));
    return makeEvent({ kind, tags });
  }
  for (const hash of hashes) tags.push(['x', hash]);
  if (fileName) tags.push(['file-name', fileName]);
  return makeEvent({ tags });
}

function makeVerification({ appId, platform, version, created_at = 0, id = 'v', extraTags = [] }) {
  const tags = [
    ['i', appId],
    ['platform', platform],
    ['version', version],
    ...extraTags
  ];
  return makeEvent({ id, tags, created_at });
}

// ---- sanitizeFilesystemSegment -------------------------------------------

describe('sanitizeFilesystemSegment', () => {
  test('replaces spaces and parentheses in version strings', () => {
    assert.equal(sanitizeFilesystemSegment('1.28.0 (5)'), '1.28.0__5_');
  });

  test('preserves dots and hyphens', () => {
    assert.equal(sanitizeFilesystemSegment('1.2.3-rc1'), '1.2.3-rc1');
  });
});

// ---- toLegacyPlatform ----------------------------------------------------

describe('toLegacyPlatform', () => {
  test('collapses linux/windows/macos to "desktop"', () => {
    assert.equal(toLegacyPlatform('linux'), 'desktop');
    assert.equal(toLegacyPlatform('windows'), 'desktop');
    assert.equal(toLegacyPlatform('macos'), 'desktop');
  });

  test('passes through android, hardware and unknown values', () => {
    assert.equal(toLegacyPlatform('android'), 'android');
    assert.equal(toLegacyPlatform('hardware'), 'hardware');
    assert.equal(toLegacyPlatform('iphone'), 'iphone');
    assert.equal(toLegacyPlatform(undefined), undefined);
  });
});

// ---- compareVersions -----------------------------------------------------

describe('compareVersions', () => {
  test('returns 0 for identical versions', () => {
    assert.equal(compareVersions('1.2.3', '1.2.3'), 0);
  });

  test('returns 1 when b is newer than a', () => {
    assert.equal(compareVersions('1.0.0', '1.0.1'), 1);
    assert.equal(compareVersions('1.0.0', '1.1.0'), 1);
    assert.equal(compareVersions('1.0.0', '2.0.0'), 1);
  });

  test('returns -1 when a is newer than b', () => {
    assert.equal(compareVersions('2.0.0', '1.9.9'), -1);
    assert.equal(compareVersions('1.10.0', '1.9.0'), -1);
  });

  test('strips a leading "v" or "V" prefix', () => {
    assert.equal(compareVersions('v1.2.3', '1.2.3'), 0);
    assert.equal(compareVersions('V1.2.3', 'v1.2.4'), 1);
  });

  test('strips path-style version prefixes (refs/tags/...)', () => {
    assert.equal(compareVersions('refs/tags/v1.2.3', '1.2.3'), 0);
    assert.equal(compareVersions('refs/tags/1.0.0', 'refs/tags/2.0.0'), 1);
  });

  test('only considers the leading X.Y.Z block of the version string', () => {
    // The leading-semver capture (^\d+\.\d+\.\d+) trims any trailing characters
    // before the per-part comparison runs, so suffixes after the third number
    // are ignored.
    assert.equal(compareVersions('1.3.5', '1.3.5Q'), 0);
    assert.equal(compareVersions('1.2.3-beta', '1.2.3-rc'), 0);
  });

  test('compares partial versions component-by-component, missing parts default to 0', () => {
    assert.equal(compareVersions('1.2', '1.2.0'), 0);
    assert.equal(compareVersions('1.2', '1.2.1'), 1);
  });
});

// ---- getFirstTagValue ----------------------------------------------------

describe('getFirstTagValue', () => {
  test('returns the first matching tag value', () => {
    const event = makeEvent({ tags: [['x', 'first'], ['x', 'second']] });
    assert.equal(getFirstTagValue(event, 'x'), 'first');
  });

  test('returns the provided default when the tag is missing', () => {
    const event = makeEvent({ tags: [['i', 'foo']] });
    assert.equal(getFirstTagValue(event, 'x'), '');
    assert.equal(getFirstTagValue(event, 'x', null), null);
    assert.equal(getFirstTagValue(event, 'x', 'fallback'), 'fallback');
  });
});

// ---- groupVerificationsByAppIdAndSortByVersion --------------------------

describe('groupVerificationsByAppIdAndSortByVersion', () => {
  test('groups by appId and sorts each group by version desc', () => {
    const verifications = [
      makeVerification({ appId: 'a', platform: 'android', version: '1.0.0', created_at: 10 }),
      makeVerification({ appId: 'a', platform: 'android', version: '2.0.0', created_at: 5 }),
      makeVerification({ appId: 'b', platform: 'linux', version: 'v1.5.0', created_at: 1 }),
    ];

    const grouped = groupVerificationsByAppIdAndSortByVersion(verifications);

    assert.deepEqual([...grouped.keys()].sort(), ['a', 'b']);
    assert.equal(grouped.get('a')[0].version, '2.0.0');
    assert.equal(grouped.get('a')[1].version, '1.0.0');
    // "v" prefix is stripped on the stored .version field.
    assert.equal(grouped.get('b')[0].version, '1.5.0');
  });

  test('breaks version ties by created_at desc', () => {
    const older = makeVerification({ appId: 'a', platform: 'android', version: '1.0.0', created_at: 100, id: 'older' });
    const newer = makeVerification({ appId: 'a', platform: 'android', version: '1.0.0', created_at: 200, id: 'newer' });

    const grouped = groupVerificationsByAppIdAndSortByVersion([older, newer]);

    assert.equal(grouped.get('a')[0].verification.id, 'newer');
    assert.equal(grouped.get('a')[1].verification.id, 'older');
  });
});

// ---- getAppIdsFromVerifications ----------------------------------------

describe('getAppIdsFromVerifications', () => {
  test('returns a deduplicated list of appIds', () => {
    const wrapped = [
      { verification: makeVerification({ appId: 'a', platform: 'android', version: '1' }) },
      { verification: makeVerification({ appId: 'b', platform: 'android', version: '1' }) },
      { verification: makeVerification({ appId: 'a', platform: 'android', version: '2' }) },
    ];

    assert.deepEqual(getAppIdsFromVerifications(wrapped).sort(), ['a', 'b']);
  });

  test('returns an empty array when given an empty input', () => {
    assert.deepEqual(getAppIdsFromVerifications([]), []);
  });
});

// ---- getFileAttachmentIDsForVerificationEvent --------------------------

describe('getFileAttachmentIDsForVerificationEvent', () => {
  test('returns only 64-char ids', () => {
    const event = makeEvent({
      tags: [
        ['file-attachment', HASH_A],
        ['file-attachment', TOO_SHORT],
        ['file-attachment', HASH_B],
        ['other', HASH_C]
      ]
    });
    assert.deepEqual(getFileAttachmentIDsForVerificationEvent(event), [HASH_A, HASH_B]);
  });

  test('returns an empty array when no file-attachment tags exist', () => {
    const event = makeEvent({ tags: [['i', 'foo']] });
    assert.deepEqual(getFileAttachmentIDsForVerificationEvent(event), []);
  });
});

// ---- filterAssetsWithoutVerification -----------------------------------

describe('filterAssetsWithoutVerification', () => {
  test('keeps assets whose primary hash is missing from the verifications map', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A] });
    const verifications = new Map();

    assert.deepEqual(
      filterAssetsWithoutVerification([asset], verifications).map(a => a),
      [asset]
    );
  });

  test('skips assets that already have a verification by hash', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A] });
    const verifications = new Map([[HASH_A, [makeVerification({ appId: 'a', platform: 'linux', version: '1' })]]]);

    assert.deepEqual(filterAssetsWithoutVerification([asset], verifications), []);
  });

  test('deduplicates assets sharing the same primary hash', () => {
    const a1 = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A] });
    const a2 = makeAsset({ appId: 'a', platform: 'linux', hashes: [HASH_A] });

    const result = filterAssetsWithoutVerification([a1, a2], new Map());
    assert.equal(result.length, 1);
  });

  test('uses x[1] as primary hash for split Android assets and accepts both indexes as verified', () => {
    const splitAsset = makeAsset({ appId: 'a', platform: 'android', hashes: [HASH_A /* zip */, HASH_B /* apk */] });
    const verifiedByApkHash = new Map([[HASH_B, [makeVerification({ appId: 'a', platform: 'android', version: '1' })]]]);
    const verifiedByZipHash = new Map([[HASH_A, [makeVerification({ appId: 'a', platform: 'android', version: '1' })]]]);

    assert.deepEqual(filterAssetsWithoutVerification([splitAsset], verifiedByApkHash), []);
    assert.deepEqual(filterAssetsWithoutVerification([splitAsset], verifiedByZipHash), []);
  });

  test('honours DEBUG_APP_IDS.includeEvenWithVerification', () => {
    const asset = makeAsset({ appId: 'com.example', platform: 'linux', version: '1.2.3', hashes: [HASH_A] });
    const verifications = new Map([[HASH_A, [makeVerification({ appId: 'com.example', platform: 'linux', version: '1.2.3' })]]]);

    DEBUG_APP_IDS.includeEvenWithVerification = [{ appId: 'com.example', version: '1.2.3' }];
    try {
      assert.deepEqual(filterAssetsWithoutVerification([asset], verifications), [asset]);
    } finally {
      DEBUG_APP_IDS.includeEvenWithVerification = [];
    }
  });

  test('skips assets that have no usable 64-char hash', () => {
    const asset = makeAsset({ appId: 'a', platform: 'linux', hashes: [TOO_SHORT] });
    assert.deepEqual(filterAssetsWithoutVerification([asset], new Map()), []);
  });

  test('bundle is verified only when a verification lists every file hash', () => {
    const bundle = makeEvent({
      kind: assetBundleRegistrationKind,
      tags: [
        ['i', 'a'],
        ['platform', 'linux'],
        ['version', '1.0.0'],
        ['x', HASH_A, 'extra.bin'],
        ['x', HASH_B, 'main.bin'],
      ],
    });
    const partial = new Map([[HASH_B, [makeVerification({
      appId: 'a',
      platform: 'linux',
      version: '1',
      extraTags: [['x', HASH_B]],
    })]]]);
    const full = new Map([[HASH_A, [makeVerification({
      appId: 'a',
      platform: 'linux',
      version: '1',
      extraTags: [['x', HASH_A], ['x', HASH_B]],
    })]]]);

    assert.deepEqual(filterAssetsWithoutVerification([bundle], partial), [bundle]);
    assert.deepEqual(filterAssetsWithoutVerification([bundle], full), []);
  });
});

describe('getAssetFileEntries', () => {
  test('parses bundle x tags with filenames', () => {
    const bundle = makeAsset({
      kind: assetBundleRegistrationKind,
      appId: 'a',
      platform: 'linux',
      hashes: [HASH_A, HASH_B],
      fileName: ['a.apk', 'b.dat'],
    });
    assert.deepEqual(getAssetFileEntries(bundle), [
      { hash: HASH_A, fileName: 'a.apk' },
      { hash: HASH_B, fileName: 'b.dat' },
    ]);
  });
});

describe('pickScriptBinaryEntry', () => {
  test('picks apk by filename regardless of x tag order', () => {
    const bundle = makeEvent({
      kind: assetBundleRegistrationKind,
      tags: [
        ['i', 'a'],
        ['platform', 'android'],
        ['version', '1.0.0'],
        ['x', HASH_A, 'readme.txt'],
        ['x', HASH_B, 'app.apk'],
      ],
    });
    assert.equal(pickScriptBinaryEntry(bundle).hash, HASH_B);
  });
});

describe('getAssetBundleDedupKey', () => {
  test('is stable regardless of x tag order', () => {
    const forward = makeEvent({
      kind: assetBundleRegistrationKind,
      tags: [
        ['x', HASH_A, 'a.bin'],
        ['x', HASH_B, 'b.bin'],
      ],
    });
    const reverse = makeEvent({
      kind: assetBundleRegistrationKind,
      tags: [
        ['x', HASH_B, 'b.bin'],
        ['x', HASH_A, 'a.bin'],
      ],
    });
    assert.equal(getAssetBundleDedupKey(forward), getAssetBundleDedupKey(reverse));
  });
});

// ---- scriptContainsSudo ------------------------------------------------

describe('scriptContainsSudo', () => {
  const asEvent = (text) => ({ content: Buffer.from(text, 'utf8').toString('base64') });

  test('detects sudo as a standalone word', () => {
    assert.equal(scriptContainsSudo(asEvent('#!/bin/bash\nsudo apt update')), true);
    assert.equal(scriptContainsSudo(asEvent('echo done && sudo rm -rf /opt/foo')), true);
  });

  test('does not match sudo as a substring of another word', () => {
    assert.equal(scriptContainsSudo(asEvent('echo sudoku')), false);
    assert.equal(scriptContainsSudo(asEvent('PSEUDOSUDOX=1')), false);
  });

  test('returns false for a script with no sudo at all', () => {
    assert.equal(scriptContainsSudo(asEvent('echo hello world')), false);
  });
});

// ---- getCombinationsFromAppInfo ---------------------------------------

describe('getCombinationsFromAppInfo', () => {
  test('returns one entry per arch/type combination', () => {
    const appInfo = {
      desktop: {
        'com.example': {
          builds: [
            { arch: 'x86_64', types: { release: ['*.tar.gz'], debug: ['*.tar'] } },
            { arch: 'arm64', types: { release: ['*.tar.gz'] } }
          ]
        }
      }
    };
    const combos = getCombinationsFromAppInfo(appInfo, 'desktop', 'com.example');
    assert.equal(combos.length, 3);
    assert.deepEqual(combos[0], { architecture: 'x86_64', type: 'release', patterns: ['*.tar.gz'] });
  });

  test('emits a single combination with undefined type when "types" is missing', () => {
    const appInfo = { desktop: { 'com.example': { builds: [{ arch: 'x86_64' }] } } };
    const combos = getCombinationsFromAppInfo(appInfo, 'desktop', 'com.example');
    assert.deepEqual(combos, [{ architecture: 'x86_64', type: undefined, patterns: undefined }]);
  });

  test('returns null when the app has no builds config', () => {
    assert.equal(getCombinationsFromAppInfo({ desktop: {} }, 'desktop', 'missing'), null);
    assert.equal(getCombinationsFromAppInfo({}, 'desktop', 'missing'), null);
  });
});

// ---- findArchAndTypeForFile -------------------------------------------

describe('findArchAndTypeForFile', () => {
  test('returns the only combination directly when there is just one', () => {
    const appInfo = {
      desktop: {
        'com.example': {
          builds: [{ arch: 'x86_64', types: { release: ['*.tar.gz'] } }]
        }
      }
    };
    assert.deepEqual(
      findArchAndTypeForFile(appInfo, 'desktop', 'com.example', 'whatever.bin'),
      { architecture: 'x86_64', type: 'release' }
    );
  });

  test('disambiguates by glob pattern when multiple combinations exist', () => {
    const appInfo = {
      desktop: {
        'com.example': {
          builds: [
            { arch: 'x86_64', types: { release: ['*-x86_64.tar.gz'], debug: ['*-x86_64.zip'] } },
            { arch: 'arm64', types: { release: ['*-arm64.tar.gz'] } }
          ]
        }
      }
    };
    assert.deepEqual(
      findArchAndTypeForFile(appInfo, 'desktop', 'com.example', 'app-x86_64.zip'),
      { architecture: 'x86_64', type: 'debug' }
    );
    assert.deepEqual(
      findArchAndTypeForFile(appInfo, 'desktop', 'com.example', 'app-arm64.tar.gz'),
      { architecture: 'arm64', type: 'release' }
    );
  });

  test('returns null when no pattern matches', () => {
    const appInfo = {
      desktop: {
        'com.example': {
          builds: [
            { arch: 'x86_64', types: { release: ['*.tar.gz'] } },
            { arch: 'arm64', types: { release: ['*.zip'] } }
          ]
        }
      }
    };
    assert.equal(findArchAndTypeForFile(appInfo, 'desktop', 'com.example', 'app.exe'), null);
  });

  test('returns null when there is no build config at all', () => {
    assert.equal(findArchAndTypeForFile({}, 'desktop', 'missing', 'foo.tar'), null);
  });
});

// ---- getScriptsToReproduce / getNewerScriptToReproduce ----------------

describe('getScriptsToReproduce', () => {
  function makeCandidate({ appId, platform, version, created_at, id }) {
    return {
      verification: makeVerification({ appId, platform, version, created_at, id }),
      buildShFileEvent: makeEvent({ id: `bs-${id}` })
    };
  }

  test('filters by appId and platform, sorted by created_at desc, limited to 3', () => {
    const candidates = [
      makeCandidate({ appId: 'a', platform: 'linux', version: '1', created_at: 10, id: '1' }),
      makeCandidate({ appId: 'a', platform: 'linux', version: '2', created_at: 30, id: '2' }),
      makeCandidate({ appId: 'a', platform: 'linux', version: '3', created_at: 20, id: '3' }),
      makeCandidate({ appId: 'a', platform: 'linux', version: '4', created_at: 40, id: '4' }),
      makeCandidate({ appId: 'a', platform: 'android', version: '5', created_at: 99, id: 'wrong-platform' }),
      makeCandidate({ appId: 'b', platform: 'linux', version: '6', created_at: 99, id: 'wrong-app' }),
    ];

    const result = getScriptsToReproduce(candidates, 'a', 'linux');
    assert.equal(result.length, 3);
    assert.deepEqual(result.map(r => r.verification.id), ['4', '2', '3']);
  });

  test('returns an empty array when no candidate matches', () => {
    assert.deepEqual(getScriptsToReproduce([], 'a', 'linux'), []);
  });
});

// ---- findFileRecursively -------------------------------------------------

describe('findFileRecursively', () => {
  test('returns null when the directory does not exist', () => {
    assert.equal(findFileRecursively('/nonexistent/path/for/tests', 'foo.txt'), null);
  });

  test('finds a file in a nested subdirectory', () => {
    const root = makeTempDir('find-file');
    const nested = path.join(root, 'a', 'b');
    fs.mkdirSync(nested, { recursive: true });
    const target = path.join(nested, 'COMPARISON_RESULTS.yaml');
    fs.writeFileSync(target, 'verdict: reproducible\n');

    assert.equal(findFileRecursively(root, 'COMPARISON_RESULTS.yaml'), target);
    assert.equal(findFileRecursively(root, 'missing.yaml'), null);
  });
});

// ---- calculateFileHash ---------------------------------------------------

describe('calculateFileHash', () => {
  test('returns the SHA-256 hex digest of the file contents', async () => {
    const file = new File(['hello build server'], 'sample.txt', { type: 'text/plain' });
    const hash = await calculateFileHash(file);
    assert.equal(hash, '09034d0dcabb7c9ed525938a367580431837458d5c49b67b8a25101cc5f85526');
  });
});

// ---- saveScriptFromEventMakeExecutable -----------------------------------

describe('saveScriptFromEventMakeExecutable', () => {
  test('writes decoded script content and marks the file executable', () => {
    const dir = makeTempDir('save-script');
    const filePath = path.join(dir, 'build.sh');
    const scriptText = '#!/bin/bash\necho reproducible\n';
    const fileEvent = { content: Buffer.from(scriptText, 'utf8').toString('base64') };

    saveScriptFromEventMakeExecutable(fileEvent, filePath);

    assert.equal(fs.readFileSync(filePath, 'utf8'), scriptText);
    assert.equal(fs.statSync(filePath).mode & 0o777, 0o755);
  });
});

// ---- removeDirectoryRecursive / createCompilationDirectory ---------------

describe('removeDirectoryRecursive', () => {
  test('refuses to delete paths outside the allowed build directories', () => {
    const outsideDir = path.join('/tmp', `build-server-outside-${Date.now()}`);
    fs.mkdirSync(outsideDir, { recursive: true });
    try {
      removeDirectoryRecursive(outsideDir);
      assert.ok(fs.existsSync(outsideDir));
    } finally {
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  });

  test('refuses to delete the debug build base directory itself', () => {
    removeDirectoryRecursive(debugBuildDir);
    assert.ok(fs.existsSync(debugBuildDir));
  });

  test('deletes a nested directory under the debug build base', () => {
    const dir = makeTempDir('remove');
    const nested = path.join(dir, 'nested');
    fs.mkdirSync(nested);
    fs.writeFileSync(path.join(nested, 'artifact.bin'), 'data');

    removeDirectoryRecursive(nested);

    assert.equal(fs.existsSync(nested), false);
    assert.ok(fs.existsSync(dir));
  });
});

describe('createCompilationDirectory', () => {
  test('replaces an existing directory with a fresh empty one', () => {
    const dir = makeTempDir('compile');
    fs.writeFileSync(path.join(dir, 'old.txt'), 'stale');

    createCompilationDirectory(dir);

    assert.ok(fs.existsSync(dir));
    assert.deepEqual(fs.readdirSync(dir), []);
  });
});
