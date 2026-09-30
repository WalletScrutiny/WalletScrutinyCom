import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'node:child_process';

import {
  describeVersionOverride,
  extractPreferredApkFromZip,
  listAndroidApkCandidatePaths,
  parseApkVersionName,
  pickPreferredZipApkEntryName,
  resolveAndroidWalletVersion,
} from '../apk-version.mjs';

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

describe('listAndroidApkCandidatePaths', () => {
  test('returns a single apk file', () => {
    const dir = makeTempDir('single-apk');
    const apk = path.join(dir, 'app.apk');
    fs.writeFileSync(apk, 'not-an-apk');
    assert.deepEqual(listAndroidApkCandidatePaths(apk), [apk]);
  });

  test('ignores non-apk files', () => {
    const dir = makeTempDir('not-apk');
    const zip = path.join(dir, 'bundle.zip');
    fs.writeFileSync(zip, 'zip');
    assert.deepEqual(listAndroidApkCandidatePaths(zip), []);
  });

  test('prefers base.apk over split config apks in a directory', () => {
    const dir = makeTempDir('splits');
    const split = path.join(dir, 'split_config.arm64_v8a.apk');
    const extra = path.join(dir, 'split_config.xxhdpi.apk');
    const base = path.join(dir, 'base.apk');
    fs.writeFileSync(split, 's');
    fs.writeFileSync(extra, 'e');
    fs.writeFileSync(base, 'b');
    fs.writeFileSync(path.join(dir, 'notes.txt'), 'ignore');

    assert.deepEqual(
      listAndroidApkCandidatePaths(dir),
      [base, split, extra]
    );
  });
});

describe('pickPreferredZipApkEntryName', () => {
  test('prefers base.apk even when nested', () => {
    assert.equal(
      pickPreferredZipApkEntryName([
        'payload/split_config.arm64_v8a.apk',
        'payload/base.apk',
        'readme.txt',
      ]),
      'payload/base.apk'
    );
  });

  test('returns null when there are no apk entries', () => {
    assert.equal(pickPreferredZipApkEntryName(['readme.txt', 'folder/']), null);
  });
});

describe('describeVersionOverride', () => {
  test('returns null when versions match or are missing', () => {
    assert.equal(describeVersionOverride('0.50.1', '0.50.1'), null);
    assert.equal(describeVersionOverride(' 0.51.0 ', '0.51.0'), null);
    assert.equal(describeVersionOverride(null, '0.51.0'), null);
    assert.equal(describeVersionOverride('0.51.0', null), null);
  });

  test('explains a mismatch', () => {
    assert.equal(
      describeVersionOverride('0.50.1', '0.51.0'),
      'The asset registration listed version 0.50.1; the APK versionName is 0.51.0.'
    );
  });
});

describe('resolveAndroidWalletVersion', () => {
  test('uses the first apk that yields a versionName, preferring base.apk', async () => {
    const dir = makeTempDir('resolve-prefers-base');
    fs.writeFileSync(path.join(dir, 'split_config.arm64_v8a.apk'), 's');
    fs.writeFileSync(path.join(dir, 'base.apk'), 'b');

    const parsed = [];
    const version = await resolveAndroidWalletVersion({
      binaryPath: dir,
      claimedVersion: '0.50.1',
      parseApk: async (apkPath) => {
        parsed.push(path.basename(apkPath));
        return path.basename(apkPath) === 'base.apk' ? '0.51.0' : null;
      },
    });

    assert.equal(version, '0.51.0');
    assert.deepEqual(parsed, ['base.apk']);
  });

  test('falls back to the asset version when no apk can be parsed', async () => {
    const dir = makeTempDir('resolve-fallback');
    const apk = path.join(dir, 'app.apk');
    fs.writeFileSync(apk, 'not-an-apk');

    const version = await resolveAndroidWalletVersion({
      binaryPath: apk,
      claimedVersion: '0.50.1',
      parseApk: async () => null,
    });

    assert.equal(version, '0.50.1');
  });

  test('extracts base.apk from a zip and parses that file', async () => {
    const dir = makeTempDir('resolve-zip');
    const zipPath = path.join(dir, 'bundle.zip');
    execFileSync('python3', ['-c', `
import zipfile
z = zipfile.ZipFile(${JSON.stringify(zipPath)}, 'w')
z.writestr('split_config.arm64_v8a.apk', b'split')
z.writestr('base.apk', b'base-bytes')
z.close()
`]);

    const version = await resolveAndroidWalletVersion({
      binaryPath: zipPath,
      claimedVersion: '0.50.1',
      parseApk: async (apkPath) => {
        assert.equal(path.basename(apkPath), 'base.apk');
        assert.equal(fs.readFileSync(apkPath, 'utf8'), 'base-bytes');
        return '0.51.0';
      },
    });

    assert.equal(version, '0.51.0');
  });
});

describe('extractPreferredApkFromZip', () => {
  test('writes the preferred apk to the destination directory', async () => {
    const dir = makeTempDir('extract-zip');
    const zipPath = path.join(dir, 'bundle.zip');
    const outDir = path.join(dir, 'out');
    execFileSync('python3', ['-c', `
import zipfile
z = zipfile.ZipFile(${JSON.stringify(zipPath)}, 'w')
z.writestr('payload/base.apk', b'from-zip')
z.close()
`]);

    const extracted = await extractPreferredApkFromZip(zipPath, outDir);
    assert.equal(path.basename(extracted), 'base.apk');
    assert.equal(fs.readFileSync(extracted, 'utf8'), 'from-zip');
  });
});

describe('parseApkVersionName', () => {
  test('keeps spaces and parentheses in versionName', async () => {
    // Built with aapt2 from a manifest declaring android:versionName="2026.11.2 (1)" (Bitkey's format).
    const apk = fileURLToPath(new URL('./fixtures/versionname-with-spaces.apk', import.meta.url));
    assert.equal(await parseApkVersionName(apk), '2026.11.2 (1)');
  });

  test('returns null for a file that is not an APK', async () => {
    const dir = makeTempDir('not-apk-parse');
    const apk = path.join(dir, 'app.apk');
    fs.writeFileSync(apk, 'not-an-apk');
    assert.equal(await parseApkVersionName(apk), null);
  });
});
