import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'node:stream';

import { readComparisonResults, downloadFileFromBlossom } from '../verifications.mjs';

const debugBuildDir = fileURLToPath(new URL('../build_server_build_dir', import.meta.url));
const tempDirs = [];
const originalFetch = globalThis.fetch;

function makeTempDir(label) {
  const dir = path.join(debugBuildDir, `test-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(dir, { recursive: true });
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  globalThis.fetch = originalFetch;

  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('readComparisonResults', () => {
  test('returns undefined when COMPARISON_RESULTS.yaml is missing', () => {
    const buildDir = makeTempDir('comparison-missing');
    assert.equal(readComparisonResults(buildDir, 'x86_64', 'com.example', '1.0.0', 'release'), undefined);
  });

  test('parses verdict, script_version and notes from a nested yaml file', () => {
    const buildDir = makeTempDir('comparison-found');
    const nested = path.join(buildDir, 'output', 'artifacts');
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(
      path.join(nested, 'COMPARISON_RESULTS.yaml'),
      [
        'verdict: reproducible',
        'script_version: 2.1.0',
        'notes: all good'
      ].join('\n')
    );

    assert.deepEqual(
      readComparisonResults(buildDir, 'x86_64', 'com.example', '1.0.0', 'release'),
      {
        verdict: 'reproducible',
        scriptVersion: '2.1.0',
        notes: 'all good'
      }
    );
  });

  test('falls back to results[0].status when verdict is missing', () => {
    const buildDir = makeTempDir('comparison-fallback');
    fs.writeFileSync(
      path.join(buildDir, 'COMPARISON_RESULTS.yaml'),
      [
        'results:',
        '  - status: not_reproducible'
      ].join('\n')
    );

    assert.deepEqual(
      readComparisonResults(buildDir, null, 'com.example', '1.0.0', null),
      {
        verdict: 'not_reproducible',
        scriptVersion: null,
        notes: null
      }
    );
  });
});

describe('downloadFileFromBlossom', () => {
  test('returns an HTTP error when Blossom responds with a non-2xx status', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 404,
      body: { cancel: async () => {} }
    });

    const result = await downloadFileFromBlossom('deadbeef', path.join(makeTempDir('download-404'), 'file.apk'));

    assert.deepEqual(result, {
      success: false,
      error: 'HTTP 404: file not found'
    });
  });

  test('streams the response body to disk on success', async () => {
    const dir = makeTempDir('download-ok');
    const destination = path.join(dir, 'downloaded.apk');
    const payload = 'binary-payload-for-test';

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      body: Readable.toWeb(Readable.from([payload]))
    });

    const result = await downloadFileFromBlossom('abc123', destination);

    assert.deepEqual(result, { success: true });
    assert.equal(fs.readFileSync(destination, 'utf8'), payload);
  });

  test('cleans up a partial file when streaming fails', async () => {
    const dir = makeTempDir('download-stream-error');
    const destination = path.join(dir, 'partial.apk');
    const failingStream = new Readable({
      read() {
        this.destroy(new Error('stream broke'));
      }
    });

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      body: Readable.toWeb(failingStream)
    });

    const result = await downloadFileFromBlossom('abc123', destination);

    assert.equal(result.success, false);
    assert.match(result.error, /^Stream failed:/);
    assert.equal(fs.existsSync(destination), false);
  });
});
