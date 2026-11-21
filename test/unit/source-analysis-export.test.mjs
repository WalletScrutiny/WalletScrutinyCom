import './setup.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { exportIndex, hasExport, renderDependenciesPanel, renderOwnVulnerabilities } from '../../src/source-analysis-export.mjs';

// A fetch over fixed files; every other URL is a 404. `asked` lists the URLs.
function fakeFetch(files) {
  const asked = [];
  const fetchImpl = async (url) => {
    asked.push(url);
    return url in files
      ? { ok: true, status: 200, json: async () => files[url] }
      : { ok: false, status: 404, json: async () => null };
  };
  return { fetchImpl, asked };
}

const INDEX = { schema: 1, complete: true, apps: [{ appId: 'app.android', aliases: ['app.ios'] }, { appId: 'app.other', aliases: [] }] };

test('hasExport: the analysed apps and their aliases, from one request', async () => {
  const { fetchImpl, asked } = fakeFetch({ '/a/index.json': INDEX });
  assert.deepEqual([...(await exportIndex({ base: '/a', fetchImpl })).ids], ['app.android', 'app.ios', 'app.other']);
  assert.equal(await hasExport('app.android', { base: '/a', fetchImpl }), true);
  assert.equal(await hasExport('app.ios', { base: '/a', fetchImpl }), true);
  assert.equal(await hasExport('app.none', { base: '/a', fetchImpl }), false);
  assert.deepEqual(asked, ['/a/index.json']);
});

test('hasExport: an index that cannot rule a listing out leaves it to the app file', async () => {
  // an exporter that does not list aliases yet: app.ios has a stub the index does not name
  const old = fakeFetch({ '/b/index.json': { schema: 1, apps: [{ appId: 'app.android' }] }, '/b/apps/app.ios.json': { appId: 'app.android', alias: true } });
  assert.equal(await hasExport('app.android', { base: '/b', fetchImpl: old.fetchImpl }), true);
  assert.equal(await hasExport('app.ios', { base: '/b', fetchImpl: old.fetchImpl }), true);
  assert.equal(await hasExport('app.none', { base: '/b', fetchImpl: old.fetchImpl }), false);
  assert.equal(await hasExport('app.none', { base: '/b', fetchImpl: old.fetchImpl }), false);
  assert.deepEqual(old.asked, ['/b/index.json', '/b/apps/app.ios.json', '/b/apps/app.none.json'], 'each app file asked for once');
  // an index exportApp started for one app after the export directory was lost: the others still have their files
  const started = fakeFetch({ '/s/index.json': { schema: 1, apps: [{ appId: 'app.android', aliases: ['app.ios'] }] }, '/s/apps/app.other.json': {} });
  assert.equal(await hasExport('app.other', { base: '/s', fetchImpl: started.fetchImpl }), true);
  // no index
  const none = fakeFetch({ '/c/apps/app.android.json': {} });
  assert.equal(await hasExport('app.android', { base: '/c', fetchImpl: none.fetchImpl }), true);
  assert.equal(await hasExport('app.none', { base: '/c', fetchImpl: none.fetchImpl }), false);
  // no network
  assert.equal(await hasExport('app.android', { base: '/d', fetchImpl: async () => { throw new Error('offline'); } }), false);
});

test('the steps of a listing without an export ask for nothing but the index', async () => {
  document.body.innerHTML = '<div class="step dependencies-step" hidden><div id="h" hidden></div></div>';
  const host = document.getElementById('h');
  const { fetchImpl, asked } = fakeFetch({ '/e/index.json': INDEX });
  assert.equal(await renderDependenciesPanel({ host, appId: 'app.none', base: '/e', fetchImpl }), null);
  assert.equal(await renderOwnVulnerabilities({ host, appId: 'app.none', base: '/e', fetchImpl }), null);
  assert.deepEqual(asked, ['/e/index.json']);
  assert.equal(document.querySelector('.dependencies-step').hidden, true);
});

test('the steps of a listed app are loaded and read its app file', async () => {
  document.body.innerHTML = '<div class="step own-vulnerabilities-step" hidden><div id="h" hidden></div></div>';
  const host = document.getElementById('h');
  const { fetchImpl, asked } = fakeFetch({ '/f/index.json': INDEX });
  const nostr = { waitExtension: async () => false };
  assert.equal(await renderDependenciesPanel({ host, appId: 'app.ios', base: '/f', triageBase: '/ft', liveEvents: async () => [], fetchImpl, nostr }), null);
  assert.equal(await renderOwnVulnerabilities({ host, appId: 'app.ios', base: '/f', fetchImpl }), null);
  assert.deepEqual(asked, ['/f/index.json', '/f/apps/app.ios.json', '/f/apps/app.ios.json']);
});
