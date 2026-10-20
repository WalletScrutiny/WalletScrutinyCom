import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { buildTree, childrenOf, searchNodes, pathTo } from '../../src/dependencies-tree-model.mjs';
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
    assert.deepEqual(tree.groups.map(g => [g.scope, g.roots.map(r => r.name)]), [['app', ['a', 'dup', 'dup']], ['build', ['tool']]]);
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
    assert.equal(registryUrl('other', 'x'), null);
  });
});
