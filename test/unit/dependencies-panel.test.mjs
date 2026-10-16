import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { loadApp, renderDependenciesPanel, panelElement } from '../../src/dependencies-panel.mjs';
import { panelModel } from '../../src/dependencies-panel-model.mjs';

const advisory = (id, severity, extra = {}) => ({ id, severity, aliases: [], fixed: [], summary: 's', ecosystem: 'npm', package: 'pkg', version: '1.0.0', direct: true, dev: false, ...extra });

const APP = {
  schema: 1, appId: 'app.android',
  aliases: [{ appId: 'app.android', platform: 'android' }, { appId: 'app.ios', platform: 'iphone' }],
  releases: [{
    kind: 'release', ref: 'v1.4.0', commit: 'a1b2c3d4', analysedAt: '2026-10-01 00:00:00', status: 'ok',
    lockfiles: ['package-lock.json'],
    osv: { checked: 398, skipped: { floating: 14 } },
    dependencies: { total: 412, direct: 40, dev: 100, devUnknown: 0, byScope: { app: 300, build: 90, tests: 10, unknown: 12 }, byEcosystem: { npm: 412 }, tiers: {}, lockfiles: ['package-lock.json'] },
    vulnerabilities: { total: 13, bySeverity: { malicious: 0, critical: 1, high: 2, moderate: 10, low: 0, unknown: 0 }, packages: 13 },
    advisories: [advisory('GHSA-crit', 'critical'), advisory('GHSA-high', 'high', { dev: true }), advisory('GHSA-test', 'high', { dev: true, scope: 'tests' }), ...Array.from({ length: 10 }, (_, i) => advisory(`GHSA-mod-${i}`, 'moderate', { dev: null }))],
    diffFrom: { ref: 'v1.3.0', added: 12, removed: 3, changed: 40, integrityChangedAtSameVersion: ['npm:left-pad'] },
  }],
  defaultBranch: null,
};

function fakeFetch(files) {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    const body = files[url];
    if (body === undefined) return { ok: false, status: 404, json: async () => null };
    return { ok: true, status: 200, json: async () => body };
  };
  return { fetchImpl, calls };
}

describe('dependencies panel', () => {
  test('loadApp follows one alias stub to the repository\'s first app id', async () => {
    const { fetchImpl, calls } = fakeFetch({
      '/x/apps/app.ios.json': { schema: 1, appId: 'app.android', alias: true },
      '/x/apps/app.android.json': APP,
    });
    const app = await loadApp('app.ios', { base: '/x', fetchImpl });
    assert.equal(app.appId, 'app.android');
    assert.deepEqual(calls, ['/x/apps/app.ios.json', '/x/apps/app.android.json']);
    assert.equal(await loadApp('app.none', { base: '/x', fetchImpl }), null);
  });

  test('renderDependenciesPanel paints tiles, worst rows, notes and keeps the host hidden without data', async () => {
    const { fetchImpl } = fakeFetch({ '/x/apps/app.android.json': APP });
    const step = document.createElement('div');
    step.className = 'step dependencies-step';
    step.hidden = true;
    const host = document.createElement('div');
    host.hidden = true;
    step.appendChild(host);
    document.body.appendChild(step);

    const model = await renderDependenciesPanel({ host, appId: 'app.android', storeVersion: '1.4.2', base: '/x', fetchImpl });
    assert.equal(model.ref, 'v1.4.0');
    assert.equal(host.hidden, false);
    assert.equal(step.hidden, false);
    const values = [...host.querySelectorAll('.dp-tile__value')].map(e => e.textContent);
    assert.deepEqual(values, ['412', '14', '13', '0']);
    assert.equal(host.querySelector('.dp-tile__sub').textContent, '1 critical · 2 high · 10 medium');
    assert.equal(host.querySelectorAll('tbody tr').length, 10);
    assert.equal(host.querySelector('tbody tr td a').textContent, 'GHSA-crit');
    assert.equal(host.querySelector('tbody tr td a').getAttribute('href'), 'https://osv.dev/vulnerability/GHSA-crit');
    assert.equal(host.querySelector('.dp-more').textContent, 'Show all 13 advisories');
    assert.deepEqual([...host.querySelectorAll('thead th')].map(e => e.textContent), ['Package', 'Version', 'Advisory', 'Severity', 'Where?']);
    assert.equal(host.querySelector('.dp-eco'), null, 'one ecosystem: no tag on the package');
    assert.match(host.querySelector('.dp-note').textContent, /300 in the app, 90 in the build tooling, 10 only in tests, and 12 the files do not say/);
    const notices = [...host.querySelectorAll('.dp-notices li')].map(e => e.textContent);
    assert.match(notices[0], /store version 1\.4\.2 has not been checked yet/);
    assert.match(notices[1], /Same source repository as app\.ios/);
    assert.match(host.querySelector('.dp-note').textContent, /Since v1\.3\.0: 12 packages added, 3 removed, 40 updated, and 1 changed content at the same version \(npm:left-pad\)/);
    assert.match(host.querySelector('.dp-headline').textContent, /Checked release v1\.4\.0 \(source tag, commit a1b2c3d\) · Store version 1\.4\.2 · Checked on 2026-10-01/);
    assert.deepEqual([...host.querySelectorAll('.dp-where')].slice(0, 4).map(e => e.textContent), ['app', 'build', 'tests', '?']);

    const empty = document.createElement('div');
    empty.hidden = true;
    assert.equal(await renderDependenciesPanel({ host: empty, appId: 'app.none', base: '/x', fetchImpl }), null);
    assert.equal(empty.hidden, true);
  });

  test('an unreachable export leaves the host untouched', async () => {
    const fetchImpl = async () => { throw new Error('offline'); };
    const host = document.createElement('div');
    host.hidden = true;
    const warn = console.warn;
    console.warn = () => {};
    try {
      assert.equal(await renderDependenciesPanel({ host, appId: 'app.android', base: '/x', fetchImpl }), null);
    } finally {
      console.warn = warn;
    }
    assert.equal(host.hidden, true);
    assert.equal(host.childElementCount, 0);
  });

  test('a release mixing ecosystems tags each package with its ecosystem', () => {
    const mixed = { ...APP, releases: [{ ...APP.releases[0], dependencies: { ...APP.releases[0].dependencies, byEcosystem: { npm: 400, gradle: 12 } } }] };
    const node = panelElement(panelModel(mixed), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    assert.equal(node.querySelector('tbody tr .dp-eco').textContent, 'npm');
  });

  test('panelElement without advisories has no table and green tiles', () => {
    const clean = { ...APP, releases: [{ ...APP.releases[0], advisories: [], vulnerabilities: { bySeverity: {} }, diffFrom: null }] };
    const node = panelElement(panelModel(clean), { appId: 'app.android', base: '/x', fetchImpl: async () => null });
    assert.equal(node.querySelector('table'), null);
    assert.equal(node.querySelectorAll('.dp-tile--good').length, 2);
  });
});
