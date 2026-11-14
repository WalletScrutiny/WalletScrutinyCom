import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { buildTree, childrenOf, searchNodes, pathTo, placeOf } from '../../src/dependencies-tree-model.mjs';
import { treeElement, registryUrl } from '../../src/dependencies-tree.mjs';

const dep = (name, version, extra = {}) => ({ ecosystem: 'npm', lockfile: 'yarn.lock', name, version, direct: false, scope: 'app', dependants: [], ...extra });
const names = (list) => list.map(c => `${c.node.name}@${c.node.version}`);

// app -> a -> {b, shared}; app2(build) -> shared; shared -> shared2 -> shared (cycle);
// lone has a parent that is not in the lockfile; dup is locked at two versions and both have children.
const DEPS = [
  dep('a', '1.0.0', { direct: true }),
  dep('b', '1.0.0', { dependants: ['a'] }),
  dep('shared', '2.0.0', { dependants: ['a', 'tool'] }),
  dep('tool', '3.0.0', { direct: true, scope: 'build' }),
  dep('shared2', '1.0.0', { dependants: ['shared'] }),
  dep('lone', '1.0.0', { dependants: ['ghost'] }),
  dep('orphan', '1.0.0'),
  dep('dup', '1.0.0', { direct: true }),
  dep('dup', '2.0.0', { direct: true }),
  dep('kid', '1.0.0', { dependants: ['dup'] }),
];
DEPS[2].dependants.push('shared2'); // closes the cycle: shared -> shared2 -> shared

describe('dependency tree model', () => {
  const tree = buildTree(DEPS, [{ ecosystem: 'npm', package: 'b', version: '1.0.0', id: 'GHSA-x', severity: 'high', repo: 'https://github.com/o/b' }]);

  test('direct dependencies are grouped by scope', () => {
    assert.deepEqual(tree.products.map(p => p.id), ['this']);
    assert.deepEqual(tree.products[0].groups.map(g => [g.scope, g.roots.map(r => r.name)]), [['app', ['a', 'dup', 'dup']], ['build', ['tool']]]);
  });

  test('children come from the dependants fields, reversed', () => {
    const a = [...tree.nodes.values()].find(n => n.name === 'a');
    assert.deepEqual(names(childrenOf(a)), ['b@1.0.0', 'shared@2.0.0']);
  });

  test('a shared package appears under every parent', () => {
    const tool = [...tree.nodes.values()].find(n => n.name === 'tool');
    assert.deepEqual(names(childrenOf(tool)), ['shared@2.0.0']);
  });

  test('a parent locked at two versions: the child sits under both, flagged ambiguous', () => {
    const dups = [...tree.nodes.values()].filter(n => n.name === 'dup');
    for (const d of dups) {
      const kids = childrenOf(d);
      assert.deepEqual(names(kids), ['kid@1.0.0']);
      assert.equal(kids[0].ambiguous, true);
    }
    const a = [...tree.nodes.values()].find(n => n.name === 'a');
    assert.equal(childrenOf(a)[0].ambiguous, false);
  });

  test('a cycle is flagged where it closes', () => {
    const shared2 = [...tree.nodes.values()].find(n => n.name === 'shared2');
    const shared = [...tree.nodes.values()].find(n => n.name === 'shared');
    const a = [...tree.nodes.values()].find(n => n.name === 'a');
    const kids = childrenOf(shared2, [a.key, shared.key, shared2.key]);
    assert.deepEqual(kids.map(k => [k.node.name, k.cycle]), [['shared', true]]);
  });

  test('packages no direct dependency reaches are listed, not dropped', () => {
    assert.deepEqual(tree.unreachable.map(n => n.name), ['lone', 'orphan']);
    assert.equal(tree.missingParents, 1);
  });

  test('advisories attach by ecosystem, name and version, and carry the repository link', () => {
    const b = [...tree.nodes.values()].find(n => n.name === 'b');
    assert.equal(b.advisories[0].id, 'GHSA-x');
    assert.equal(b.repo, 'https://github.com/o/b');
  });

  test('search finds a package and a shortest path to a direct dependency', () => {
    const { matches } = searchNodes(tree, 'SHARED2');
    assert.deepEqual(matches.map(m => m.name), ['shared2']);
    assert.deepEqual(pathTo(matches[0]).map(n => n.name), ['a', 'shared', 'shared2']);
    assert.equal(pathTo(tree.unreachable[0]), null);
  });

  test('search by advisory id', () => {
    assert.deepEqual(searchNodes(tree, 'ghsa-x').matches.map(m => m.name), ['b']);
  });

  test('every displayed edge is in the dependency records', () => {
    for (const n of tree.nodes.values()) {
      for (const { node: c } of n.children) assert.ok(c.row.dependants.includes(n.name), `${n.name} -> ${c.name}`);
    }
  });
});

describe('dependency tree view', () => {
  const advisories = [{ ecosystem: 'npm', package: 'b', version: '1.0.0', id: 'GHSA-x', severity: 'high', summary: 's' }];
  const open = () => treeElement({ dependencies: DEPS, advisories, wallet: 'Test Wallet v1' });

  test('starts collapsed: only the wallet and its groups', () => {
    const view = open();
    const items = view.querySelectorAll('[role="treeitem"]');
    assert.equal(items.length, 4);
    assert.match(view.querySelector('.dpt-wallet').textContent, /Test Wallet v1/);
    assert.equal(view.querySelector('.dpt-item--group').getAttribute('aria-expanded'), 'false');
  });

  test('a package no other wallet uses is marked "only this wallet", with or without an advisory (issue 1020 P17)', () => {
    const view = treeElement({ dependencies: [dep('a', '1.0.0', { direct: true, products: 1 }), dep('c', '1.0.0', { direct: true, products: 9 }), dep('d', '1.0.0', { direct: true })], wallet: 'W' });
    const flag = (name) => view.querySelector(`[data-package="${name}"] .dp-only-here`);
    assert.equal(flag('a')?.textContent, 'only this wallet');
    assert.match(flag('a').getAttribute('title'), /No other wallet we checked uses this package/);
    assert.equal(flag('c'), null, 'shared with other wallets');
    assert.equal(flag('d'), null, 'an export without the count says nothing');
  });

  test('+ expands a group and a package, − collapses', () => {
    const view = open();
    view.querySelector('.dpt-item--group .dpt-toggle').click();
    assert.equal(view.querySelector('.dpt-item--group').getAttribute('aria-expanded'), 'true');
    const a = view.querySelector('[data-package="a"]');
    a.querySelector('.dpt-toggle').click();
    const opened = view.querySelector('[data-package="a"]');
    assert.equal(opened.getAttribute('aria-expanded'), 'true');
    assert.ok(opened.querySelector('[data-package="b"]'));
    assert.match(opened.querySelector('.dpt-toggle').textContent, /−/);
  });

  test('search opens the ancestor path and marks the hit; collapse all resets', () => {
    const view = open();
    const search = view.querySelector('.dpt-search');
    search.value = 'shared2';
    search.dispatchEvent(new window.Event('input'));
    const hit = view.querySelector('.dpt-item--hit');
    assert.equal(hit.dataset.package, 'shared2');
    assert.ok(hit.closest('[data-package="shared"]'));
    assert.ok(hit.closest('[data-package="a"]'));
    view.querySelector('.dpt-collapse').click();
    assert.equal(view.querySelectorAll('[role="treeitem"]').length, 4);
  });

  test('a cycle is shown and not expanded', () => {
    const view = open();
    const search = view.querySelector('.dpt-search');
    search.value = 'shared2';
    search.dispatchEvent(new window.Event('input'));
    const shared2 = view.querySelector('[data-package="shared2"]');
    shared2.querySelector('.dpt-toggle').click();
    const again = view.querySelector('[data-package="shared2"]');
    const loop = again.querySelector('[data-package="shared"]');
    assert.match(loop.textContent, /cycle, not expanded/);
    assert.equal(loop.querySelector('.dpt-toggle'), null);
  });

  test('advisory shown as a badge and as a linked leaf under its package', () => {
    const view = open();
    const search = view.querySelector('.dpt-search');
    search.value = 'b';
    search.dispatchEvent(new window.Event('input'));
    const b = view.querySelector('[data-package="b"]');
    assert.match(b.textContent, /1 published advisory/);
    b.querySelector('.dpt-toggle').click();
    const link = view.querySelector('[data-package="b"] a[href*="osv.dev"]');
    assert.equal(link.textContent, 'GHSA-x');
  });

  test('ambiguous parents are marked; unreachable packages have their own group', () => {
    const view = open();
    assert.match(view.querySelector('.dp-notices').textContent, /2 packages are listed under/);
    assert.ok([...view.querySelectorAll('.dpt-group')].some(g => /Not reachable/.test(g.textContent)));
    const search = view.querySelector('.dpt-search');
    search.value = 'kid';
    search.dispatchEvent(new window.Event('input'));
    assert.match(view.textContent, /parent version unclear/);
  });

  test('registry links: fixed patterns per ecosystem', () => {
    assert.equal(registryUrl('npm', '@babel/core'), 'https://www.npmjs.com/package/@babel/core');
    assert.equal(registryUrl('gradle', 'org.x:y'), 'https://mvnrepository.com/artifact/org.x/y');
    assert.equal(registryUrl('pub', 'bdk_dart'), 'https://pub.dev/packages/bdk_dart');
    assert.equal(registryUrl('nuget', 'NBitcoin'), 'https://www.nuget.org/packages/NBitcoin');
    assert.equal(registryUrl('other', 'x'), null);
  });
});

// One repository, four products (issue 996): an Android page counts the shared and phone files.
// desktop/ is only a folder name, no rule: it counts here, as the page's numbers do.
const PRODUCT_OF_FILE = { 'electron/yarn.lock': 'desktop', 'server/yarn.lock': 'server', 'phonegap/yarn.lock': 'mobile' };
const productOf = row => PRODUCT_OF_FILE[row.lockfile] || 'shared';
const ANDROID = ['shared', 'mobile', 'android'];
const at = (lockfile, part) => (name, version, extra = {}) => dep(name, version, { lockfile, ...(part ? { part } : {}), ...extra });
const [own, desk, srv, phone, guess] = [at('yarn.lock'), at('electron/yarn.lock', 'desktop'), at('server/yarn.lock', 'server'), at('phonegap/yarn.lock'), at('desktop/yarn.lock', 'desktop')];
const REPO = [
  own('lodash', '4.0.0', { direct: true }), own('lodash-es', '4.0.0', { dependants: ['lodash'] }), own('stray', '1.0.0'),
  desk('electron', '30.0.0', { direct: true, scope: 'build' }), desk('lodash', '4.1.0', { dependants: ['electron'] }), desk('lone', '1.0.0'),
  srv('express', '5.0.0', { direct: true }), srv('lodash', '4.2.0', { dependants: ['express'] }), srv('lodash.merge', '4.6.0', { dependants: ['express'] }),
  phone('cordova', '12.0.0', { direct: true }), phone('lodash', '4.3.0', { dependants: ['cordova'] }),
  guess('tauri', '2.0.0', { direct: true }),
];

describe('dependency tree split by product (issue 996)', () => {
  const tree = buildTree(REPO, [], { productOf, counted: ANDROID });
  const reach = (roots) => {
    const seen = new Set();
    const stack = [...roots];
    while (stack.length) { const n = stack.pop(); if (seen.has(n.key)) continue; seen.add(n.key); stack.push(...n.children.map(c => c.node)); }
    return seen;
  };

  test('this app first, then the other products, biggest first', () => {
    assert.deepEqual(tree.products.map(p => [p.id, p.label, p.total]), [['this', 'In this app', 6], ['desktop', 'desktop app', 3], ['server', 'server', 3]]);
  });

  test('every library lands in exactly one product, and is shown there', () => {
    const where = new Map();
    for (const p of tree.products) {
      const shown = reach(p.groups.flatMap(g => g.roots));
      for (const n of p.unreachable) shown.add(n.key);
      for (const key of shown) {
        assert.equal(where.has(key), false, `${key} in ${where.get(key)} and ${p.id}`);
        where.set(key, p.id);
      }
    }
    assert.equal(where.size, REPO.length);
    assert.equal(tree.products.reduce((n, p) => n + p.total, 0), REPO.length);
  });

  test('a folder-name guess is not a product: tauri stays in this app\'s app libraries', () => {
    const own = tree.products[0];
    assert.deepEqual(own.groups.map(g => [g.scope, g.roots.map(r => r.name)]), [['app', ['cordova', 'lodash', 'tauri']]]);
    assert.deepEqual(tree.products[1].groups.map(g => [g.scope, g.roots.map(r => r.name)]), [['build', ['electron']]]);
  });

  test('"not reachable" is split the same way', () => {
    assert.deepEqual(tree.products.map(p => p.unreachable.map(n => n.name)), [['stray'], ['lone'], []]);
  });

  test('without a sorting, everything is this app', () => {
    const flat = buildTree(REPO, []);
    assert.deepEqual(flat.products.map(p => [p.id, p.total]), [['this', REPO.length]]);
  });

  test('search counts only the places it is asked to show', () => {
    const all = searchNodes(tree, 'lodash');
    assert.deepEqual([all.total, all.elsewhere], [6, 3]);
    const own = searchNodes(tree, 'lodash', place => place.product === 'this');
    assert.deepEqual([own.total, own.elsewhere, own.matches.map(m => m.version)], [3, 0, ['4.0.0', '4.3.0', '4.0.0']]);
    assert.deepEqual(placeOf(own.matches[1]).chain.map(n => n.name), ['cordova', 'lodash']);
  });
});

describe('dependency tree view split by product (issue 996)', () => {
  const open = () => treeElement({ dependencies: REPO, wallet: 'Coin v6', productOf, counted: ANDROID });
  const find = (view, value) => {
    const search = view.querySelector('.dpt-search');
    search.value = value;
    search.dispatchEvent(new window.Event('input'));
  };
  // The distinct packages marked as hits: the last key of each row's path.
  const hitPackages = view => new Set([...view.querySelectorAll('.dpt-item--hit')].map(li => li.dataset.id.split('>').at(-1)));
  const groups = view => [...view.querySelectorAll(':scope .dpt-group')].map(g => g.textContent);

  test('two top branches; the other products sit under the second', () => {
    const view = open();
    assert.deepEqual(groups(view), ['In this app', 'Other products']);
    view.querySelector('[data-id="p:other"] .dpt-toggle').click();
    assert.deepEqual(groups(view), ['In this app', 'Other products', 'desktop app', 'server']);
  });

  test('the search count equals the packages it opens, and names the other products', () => {
    const view = open();
    find(view, 'lodash');
    assert.match(view.querySelector('.dpt-status').textContent, /^6 matches, 3 of them in other products\./);
    assert.equal(hitPackages(view).size, 6);
    assert.ok(view.querySelector('[data-id="p:desktop"] .dpt-item--hit[data-package="lodash"]'));
  });

  test('the scope menu lists the new groups, and the count follows it', () => {
    const view = open();
    const select = view.querySelector('.dpt-scope');
    assert.deepEqual([...select.options].map(o => o.textContent), [
      'All scopes', 'In this app', 'In this app: App libraries', `In this app: Not reachable from a direct dependency`,
      'Other products', 'Other products: desktop app', 'Other products: server',
    ]);
    find(view, 'lodash');
    for (const [value, count] of [['p:this', 3], ['p:other', 3], ['p:server', 2], ['p:this|g:unreachable', 0]]) {
      for (const o of select.options) o.toggleAttribute('selected', o.value === value); // linkedom: value has no setter
      assert.equal(select.value, value);
      select.dispatchEvent(new window.Event('change'));
      const text = view.querySelector('.dpt-status').textContent;
      assert.equal(hitPackages(view).size, count, `${value}: ${text}`);
      if (count) assert.match(text, new RegExp(`^${count} matches`));
      else assert.match(text, /No package matches "lodash" in what is shown/);
    }
  });

  test('a repository with one product keeps the flat tree', () => {
    const view = treeElement({ dependencies: REPO, wallet: 'One', productOf: () => 'shared', counted: ANDROID });
    assert.deepEqual(groups(view), ['App libraries', 'Build tools', 'Not reachable from a direct dependency']);
  });
});
