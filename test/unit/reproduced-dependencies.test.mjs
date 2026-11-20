import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { dependencyRows, registryUrl } from '../../src/reproduced-dependencies-model.mjs';

const NOW = Date.UTC(2026, 10, 20) / 1000;
const feed = (rows) => ({ schema: 1, claimant: 'ws', rows });
const row = (name, version, result, date = '2026-11-20', extra = {}) => ({ ecosystem: 'npm', name, version, result, date, ...extra });

describe('dependencyRows', () => {
  test('reproduced versions newest first, more wallets first on a day; nothing else is listed or counted', () => {
    const r = dependencyRows(feed([
      row('a', '1.0.0', 'reproduced', '2026-11-18', { wallets: 9 }),
      row('b', '1.0.0', 'reproduced', '2026-11-20', { wallets: 2 }),
      row('c', '1.0.0', 'reproduced', '2026-11-20', { wallets: 8 }),
      row('d', '1.0.0', 'failed'),
      row('e', '1.0.0', 'skipped'),
    ]), NOW);
    assert.deepEqual(r.rows.map(x => x.name), ['c', 'b', 'a']);
    assert.deepEqual(r.summary, { reproduced: 3, packages: 3, recent: 3 });
  });

  test('versions of one package count once as a package; old rows are not "recent"', () => {
    const r = dependencyRows(feed([row('a', '1', 'reproduced', '2026-09-01'), row('a', '2', 'reproduced', '2026-11-19')]), NOW);
    assert.deepEqual([r.summary.packages, r.summary.reproduced, r.summary.recent], [1, 2, 1]);
  });

  test('a missing wallet count is null; a registry page is linked for npm only; odd rows are skipped', () => {
    const r = dependencyRows(feed([row('@scope/x', '1.0.0+b', 'reproduced'), { ecosystem: 'npm', result: 'reproduced' }, null]), NOW);
    assert.equal(r.rows.length, 1);
    assert.equal(r.rows[0].wallets, null);
    assert.equal(r.rows[0].url, 'https://www.npmjs.com/package/@scope/x/v/1.0.0%2Bb');
    assert.equal(registryUrl('cargo', 'serde', '1.0.0'), null);
  });

  test('a file that is not the expected shape gives null, so the tab says it could not be read', () => {
    assert.equal(dependencyRows({ schema: 2, rows: [] }), null);
    assert.equal(dependencyRows({ schema: 1 }), null);
    assert.equal(dependencyRows(null), null);
  });
});

describe('the Dependencies tab', () => {
  function page() {
    document.body.innerHTML = `
      <button data-reproduced-tab="wallets" aria-selected="true"></button>
      <button data-reproduced-tab="dependencies" aria-selected="false"></button>
      <div id="reproduced-panel-wallets"></div>
      <div id="reproduced-panel-dependencies" hidden><div id="reproducedDependencies"></div></div>`;
  }

  test('a failed read says so and can be tried again; then the list, a month heading and the wallet count show', async () => {
    const { loadDependencies, renderDependencies } = await import('../../src/reproduced-wallets.mjs');
    page();
    await loadDependencies(async () => ({ ok: false, status: 500 }));
    assert.match(document.getElementById('reproducedDependencies').textContent, /could not be read/);
    await loadDependencies(async () => ({ ok: true, status: 200, json: async () => feed([
      row('<img src=x onerror=alert(1)>', '1.0.0', 'reproduced', '2026-11-20', { wallets: 8 }),
      row('lodash', '4.17.21', 'reproduced', '2026-10-30', { wallets: 1 }),
      row('bad', '1', 'failed'),
    ]) }));
    const root = document.getElementById('reproducedDependencies');
    assert.equal(root.querySelectorAll('li').length, 2);
    assert.equal(root.querySelector('img'), null, 'a package name is text, never markup');
    assert.match(root.textContent, /2 versions of 2 packages rebuilt from source/);
    assert.doesNotMatch(root.textContent, /did not rebuild|failed|bad/, 'a version our build did not reproduce is not mentioned');
    assert.match(root.textContent, /used by 8 wallets/);
    assert.match(root.textContent, /used by 1 wallet\b/);
    assert.equal(root.querySelectorAll('h2').length, 2);
    renderDependencies(root, { rows: [], summary: {} });
    assert.match(root.textContent, /No dependency has been rebuilt yet/);
  });

  test('selecting a tab shows its panel and hides the other', async () => {
    const { selectTab } = await import('../../src/reproduced-wallets.mjs');
    page();
    selectTab('dependencies');
    assert.equal(document.getElementById('reproduced-panel-dependencies').hidden, false);
    assert.equal(document.getElementById('reproduced-panel-wallets').hidden, true);
    assert.equal(document.querySelector('[data-reproduced-tab="dependencies"]').getAttribute('aria-selected'), 'true');
    selectTab('wallets');
    assert.equal(document.getElementById('reproduced-panel-wallets').hidden, false);
    assert.equal(document.getElementById('reproduced-panel-dependencies').hidden, true);
  });
});
