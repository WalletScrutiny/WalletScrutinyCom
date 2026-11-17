// GitHub release pagination: the 10000-result cap, a retried 502, a missing repo.
// No network; fetchGitHubAssets takes the GET function.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchGitHubAssets, releaseNotBefore } from '../utils.mjs';

const HASH = 'ab'.repeat(32);

function httpError(status, message, data) {
  const error = new Error(message || `Request failed with status code ${status}`);
  error.response = { status, data };
  return error;
}

function release(tag, name = 'app.apk') {
  return {
    tag_name: tag,
    author: { id: 1, login: 'alice' },
    assets: [{
      name,
      digest: `sha256:${HASH}`,
      size: 10,
      browser_download_url: `https://example.invalid/${name}`,
      created_at: '2026-01-01T00:00:00Z',
    }],
  };
}

test('releaseNotBefore is the same month and day, three years earlier', () => {
  assert.equal(releaseNotBefore(3, Date.parse('2026-10-26T12:00:00Z')), Date.parse('2023-10-26T12:00:00Z'));
});

test('fetchGitHubAssets stops at the first release older than the cutoff and does not ask for another page', async () => {
  let calls = 0;
  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  const notBefore = Date.parse('2023-10-26T00:00:00Z');
  try {
    const get = async () => {
      calls++;
      const recent = Array.from({ length: 98 }, (_, i) => ({ ...release(`v${i}`, `app-${i}.apk`), published_at: '2026-01-01T00:00:00Z' }));
      return {
        data: [
          ...recent,
          { ...release('v-boundary', 'boundary.apk'), published_at: '2023-10-26T00:00:00Z' },
          { ...release('v-old', 'old.apk'), published_at: '2020-01-01T00:00:00Z' },
        ],
      };
    };
    const assets = await fetchGitHubAssets('https://github.com/brave/brave-browser', 'token', { get, delayMs: 0, notBefore });
    assert.equal(assets.length, 99);
    assert.equal(assets.at(-1).version, 'v-boundary');
    assert.equal(calls, 1);
    assert.match(warnings.join('\n'), /stopped at v-old \(2020-01-01T00:00:00Z\): older than 2023-10-26/);
  } finally {
    console.warn = original;
  }
});

test('fetchGitHubAssets keeps releases already fetched when GitHub caps the list with 422', async () => {
  let calls = 0;
  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    const get = async () => {
      calls++;
      if (calls === 1) return { data: Array.from({ length: 100 }, (_, i) => release(`v${i}`, `app-${i}.apk`)) };
      throw httpError(422, 'Request failed with status code 422', { message: 'Only the first 10000 results are available.' });
    };
    const assets = await fetchGitHubAssets('https://github.com/brave/brave-browser', 'token', { get, delayMs: 0 });
    assert.equal(assets.length, 100);
    assert.equal(assets[0].version, 'v0');
    assert.equal(assets[0].sha256, HASH);
    assert.equal(calls, 2);
    assert.match(warnings.join('\n'), /brave\/brave-browser stopped at page 1: Only the first 10000 results are available/);
  } finally {
    console.warn = original;
  }
});

test('fetchGitHubAssets retries a 502 and returns the release', async () => {
  let calls = 0;
  const get = async () => {
    calls++;
    if (calls === 1) throw httpError(502);
    return { data: [release('v1')] };
  };
  const assets = await fetchGitHubAssets('https://github.com/BitMarketNetwork/client-desktop', null, { get, delayMs: 0 });
  assert.equal(calls, 2);
  assert.equal(assets.length, 1);
  assert.equal(assets[0].version, 'v1');
  assert.equal(assets[0].source, 'github');
});

test('fetchGitHubAssets still fails when the first page is a 422', async () => {
  const get = async () => {
    throw httpError(422, 'Request failed with status code 422', { message: 'Validation Failed' });
  };
  await assert.rejects(
    fetchGitHubAssets('https://github.com/brave/brave-browser', 'token', { get, delayMs: 0 }),
    /GitHub API error: Request failed with status code 422/
  );
});

test('fetchGitHubAssets does not retry a 404 and reports the repository missing', async () => {
  let calls = 0;
  const get = async () => {
    calls++;
    throw httpError(404);
  };
  await assert.rejects(
    fetchGitHubAssets('https://github.com/breez/breezmobile', 'token', { get, delayMs: 0 }),
    /Repository not found: https:\/\/github.com\/breez\/breezmobile/
  );
  assert.equal(calls, 1);
});

test('fetchGitHubAssets gives up after three 502s', async () => {
  let calls = 0;
  const get = async () => {
    calls++;
    throw httpError(502);
  };
  await assert.rejects(
    fetchGitHubAssets('https://github.com/BitMarketNetwork/client-desktop', null, { get, delayMs: 0 }),
    /GitHub API error: Request failed with status code 502/
  );
  assert.equal(calls, 3);
});
