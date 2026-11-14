// The Dependencies panel's "Dependency tree" tab: the wallet at the top, its
// direct dependencies grouped by where they end up (app / build / tests), each
// package expandable to the packages it pulls in. A repository with other
// products splits first into "In this app" and "Other products" (issue 996).
// Branches render when opened, so a few thousand packages stay responsive.
// Source analysis of the release's lockfiles, not an inspection of the
// installed binary; informational, not part of any verdict.

import { el } from './html-utils.mjs';
import { whereLabel, WHERE_UNKNOWN_TIP, SEVERITY_ORDER, SEVERITY_LABEL } from './dependencies-panel-model.mjs';
import { rebuildBadge, rebuildKey } from './dependencies-rebuilds.mjs';
import { onlyHereFlag } from './dependencies-advisories.mjs';
import { buildTree, childrenOf, searchNodes, GROUPS, UNREACHABLE_LABEL, MAX_MATCHES, THIS_APP, THIS_APP_LABEL, OTHER_PRODUCTS_LABEL } from './dependencies-tree-model.mjs';

const OSV_URL = 'https://osv.dev/vulnerability/';

// The package's page on its registry: a fixed URL pattern per ecosystem, not a guess.
export function registryUrl(ecosystem, name) {
  const n = encodeURIComponent(name).replace(/%2F/g, '/').replace(/%40/g, '@');
  switch (ecosystem) {
    case 'npm': return `https://www.npmjs.com/package/${n}`;
    case 'cargo': return `https://crates.io/crates/${encodeURIComponent(name)}`;
    case 'pip': return `https://pypi.org/project/${encodeURIComponent(name)}/`;
    case 'pub': return `https://pub.dev/packages/${encodeURIComponent(name)}`;
    case 'gradle': {
      const [group, artifact] = String(name).split(':');
      return group && artifact ? `https://mvnrepository.com/artifact/${encodeURIComponent(group)}/${encodeURIComponent(artifact)}` : null;
    }
    default: return null;
  }
}

const worstSeverity = (advisories) => SEVERITY_ORDER.find(s => advisories.some(a => a.severity === s)) || 'unknown';

const ID = { next: 0 };

/**
 * The tab's content for one release. `dependencies` are dependencies.json rows,
 * `advisories` the panel model's advisories, `wallet` the heading line,
 * `productOf` and `counted` the page's file sorting (buildTree).
 */
export function treeElement({ dependencies, advisories = [], wallet, rebuilds = null, productOf = null, counted = null }) {
  const tree = buildTree(dependencies, advisories, { productOf, counted });
  // Only this app: the groups sit right under the wallet, as before issue 996.
  const own = tree.products.find(p => p.id === THIS_APP);
  const others = tree.products.filter(p => p.id !== THIS_APP);
  const split = others.length > 0;
  const groupId = (product, group) => `p:${product}|g:${group}`;
  const expanded = new Set();
  const uid = `dpt-${ID.next++}`;
  let query = '';
  let scope = 'all';
  let hits = new Map(); // node key -> true for the current search

  const status = el('p', { className: 'dpt-status', role: 'status' });
  const treeEl = el('ul', { className: 'dpt-tree', role: 'tree', 'aria-label': `Dependency tree of ${wallet}` });

  // ----- rendering -----
  function nodeLabel(node) {
    const url = node.repo || registryUrl(node.ecosystem, node.name);
    return url
      ? el('a', { className: 'dpt-name', href: url, target: '_blank', rel: 'noopener noreferrer', title: node.repo ? `Source repository of ${node.name}` : `${node.name} on its registry` }, node.name)
      : el('span', { className: 'dpt-name' }, node.name);
  }

  function advisoryBadge(node) {
    if (!node.advisories.length) return null;
    const sev = worstSeverity(node.advisories);
    const n = node.advisories.length;
    return el('span', { className: `dpt-adv dp-sev dp-sev--${sev}`, title: node.advisories.map(a => a.id).join(', ') }, `${n} published ${n === 1 ? 'advisory' : 'advisories'}`);
  }

  function advisoryItems(node, level) {
    return node.advisories.map(a => el('li', { className: 'dpt-item dpt-item--advisory', role: 'treeitem', 'aria-level': level, tabindex: '-1' },
      el('div', { className: 'dpt-row' },
        el('span', { className: 'dpt-spacer' }),
        el('span', { className: `dp-sev dp-sev--${SEVERITY_ORDER.includes(a.severity) ? a.severity : 'unknown'}` }, SEVERITY_LABEL[a.severity] || a.severity),
        el('a', { href: `${OSV_URL}${encodeURIComponent(a.id)}`, target: '_blank', rel: 'noopener noreferrer', title: a.summary || '' }, a.id),
        el('span', { className: 'dpt-note' }, 'published advisory'))));
  }

  // One package row. `pathIds` are the keys from the group down to and including this node.
  function nodeItem(node, pathIds, level, { ambiguous = false, cycle = false } = {}) {
    const id = pathIds.join('>');
    const kids = cycle ? [] : childrenOf(node, pathIds.slice(0, -1));
    const expandable = !cycle && (kids.length > 0 || node.advisories.length > 0);
    const isOpen = expandable && expanded.has(id);
    const li = el('li', { className: `dpt-item${hits.has(node.key) ? ' dpt-item--hit' : ''}`, role: 'treeitem', 'aria-level': level, 'aria-expanded': expandable ? String(isOpen) : null, tabindex: '-1', dataset: { id, package: node.name } });
    const toggle = expandable
      ? el('button', { type: 'button', className: 'dpt-toggle', tabindex: '-1', 'aria-label': `${isOpen ? 'Collapse' : 'Expand'} ${node.name} ${node.version}` }, isOpen ? '−' : '+')
      : el('span', { className: 'dpt-spacer' });
    if (expandable) toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(li, node, pathIds, level, !expanded.has(id)); });
    li.appendChild(el('div', { className: 'dpt-row' },
      toggle,
      nodeLabel(node),
      el('span', { className: 'dpt-version' }, node.version),
      // The group already says where its packages end up; label only a row that differs.
      node.scope === pathIds[0].split('|g:')[1] ? null
        : el('span', { className: `dp-where dp-where--${node.scope}`, title: node.scope === 'unknown' ? WHERE_UNKNOWN_TIP : null }, whereLabel(node.row)),
      advisoryBadge(node),
      rebuilds ? rebuildBadge(rebuilds.get(rebuildKey(node.ecosystem, node.name, node.version))) : null,
      // "Used by" for the rows without an advisory too: a package no other wallet uses
      node.row.products != null && node.row.products <= 1 ? onlyHereFlag() : null,
      kids.length ? el('span', { className: 'dpt-count' }, `${kids.length} ${kids.length === 1 ? 'dependency' : 'dependencies'}`) : null,
      ambiguous ? el('span', { className: 'dpt-flag', title: 'The parent is locked at several versions in this lockfile and the file does not say which one needs this package, so it is listed under each of them.' }, 'parent version unclear') : null,
      cycle ? el('span', { className: 'dpt-flag', title: 'This package is already above on this path; expansion stops here.' }, 'cycle, not expanded') : null,
    ));
    if (isOpen) li.appendChild(childList(node, pathIds, level));
    return li;
  }

  function childList(node, pathIds, level) {
    const ul = el('ul', { role: 'group', className: 'dpt-children' });
    ul.append(...advisoryItems(node, level + 1));
    for (const c of childrenOf(node, pathIds.slice(0, -1))) {
      ul.appendChild(nodeItem(c.node, [...pathIds, c.node.key], level + 1, { ambiguous: c.ambiguous, cycle: c.cycle }));
    }
    return ul;
  }

  function setOpen(li, node, pathIds, level, open) {
    const id = pathIds.join('>');
    if (open) expanded.add(id); else expanded.delete(id);
    const fresh = nodeItem(node, pathIds, level);
    li.replaceWith(fresh);
    fresh.querySelector('.dpt-toggle')?.focus?.();
  }

  // A branch above the packages: a product or a group. `content(level)` gives its children.
  function branchItem(id, label, count, level, content) {
    const open = expanded.has(id);
    const li = el('li', { className: 'dpt-item dpt-item--group', role: 'treeitem', 'aria-level': String(level), 'aria-expanded': String(open), tabindex: '-1', dataset: { id } });
    const toggle = el('button', { type: 'button', className: 'dpt-toggle', tabindex: '-1', 'aria-label': `${open ? 'Collapse' : 'Expand'} ${label}` }, open ? '−' : '+');
    toggle.addEventListener('click', (e) => { e.stopPropagation(); if (open) expanded.delete(id); else expanded.add(id); paint(); });
    li.appendChild(el('div', { className: 'dpt-row' }, toggle, el('span', { className: 'dpt-group' }, label), el('span', { className: 'dpt-count' }, `${count} ${count === 1 ? 'package' : 'packages'}`)));
    if (open) li.appendChild(el('ul', { role: 'group', className: 'dpt-children' }, content(level + 1)));
    return li;
  }

  function groupItem(id, label, roots, level) {
    return branchItem(id, label, roots.length, level, kids => roots.map(n => nodeItem(n, [id, n.key], kids)));
  }

  // What the scope menu keeps: everything, one group, one product, or every other product.
  const visible = (product, group) => scope === 'all' || scope === groupId(product, group) || scope === `p:${product}`
    || (scope === 'p:other' && product !== THIS_APP);

  function groupsOf(product, level) {
    const items = [];
    for (const g of product.groups) {
      if (visible(product.id, g.scope)) items.push(groupItem(groupId(product.id, g.scope), g.label, g.roots, level));
    }
    if (product.unreachable.length && visible(product.id, 'unreachable')) items.push(groupItem(groupId(product.id, 'unreachable'), UNREACHABLE_LABEL, product.unreachable, level));
    return items;
  }

  const shows = product => visible(product.id, 'unreachable') || product.groups.some(g => visible(product.id, g.scope));

  function paint() {
    const focused = document.activeElement?.closest?.('[data-id]')?.dataset?.id;
    const items = [];
    if (!split) items.push(...tree.products.flatMap(p => groupsOf(p, 2)));
    else {
      if (own && shows(own)) items.push(branchItem(`p:${THIS_APP}`, THIS_APP_LABEL, own.total, 2, level => groupsOf(own, level)));
      const otherShown = others.filter(shows);
      if (otherShown.length) {
        items.push(branchItem('p:other', OTHER_PRODUCTS_LABEL, others.reduce((n, p) => n + p.total, 0), 2,
          level => otherShown.map(p => branchItem(`p:${p.id}`, p.label, p.total, level, inner => groupsOf(p, inner)))));
      }
    }
    const root = el('li', { className: 'dpt-item dpt-item--wallet', role: 'treeitem', 'aria-level': '1', 'aria-expanded': 'true', tabindex: '0' },
      el('div', { className: 'dpt-row' }, el('span', { className: 'dpt-toggle dpt-toggle--static' }, '−'), el('span', { className: 'dpt-wallet' }, wallet)),
      el('ul', { role: 'group', className: 'dpt-children' }, items));
    treeEl.replaceChildren(root);
    if (focused) treeEl.querySelector(`[data-id="${CSS.escape(focused)}"]`)?.querySelector('.dpt-toggle')?.focus?.();
  }

  // ----- controls -----
  const search = el('input', { type: 'search', className: 'dpt-search', placeholder: 'Find a package or advisory', 'aria-label': 'Find a package or advisory in the tree' });
  // The menu names every group this app has; another product is one entry with all its groups.
  const groupOptions = (p, prefix) => [
    ...GROUPS.filter(g => p.groups.some(x => x.scope === g.scope)).map(g => el('option', { value: groupId(p.id, g.scope) }, `${prefix}${g.label}`)),
    p.unreachable.length ? el('option', { value: groupId(p.id, 'unreachable') }, `${prefix}${UNREACHABLE_LABEL}`) : null,
  ];
  const scopeOptions = !split ? tree.products.flatMap(p => groupOptions(p, '')) : [
    own ? [el('option', { value: `p:${THIS_APP}` }, THIS_APP_LABEL), groupOptions(own, `${THIS_APP_LABEL}: `)] : [],
    el('option', { value: 'p:other' }, OTHER_PRODUCTS_LABEL),
    others.map(p => el('option', { value: `p:${p.id}` }, `${OTHER_PRODUCTS_LABEL}: ${p.label}`)),
  ].flat(2);
  const scopeSelect = el('select', { className: 'dpt-scope', 'aria-label': 'Show only' }, el('option', { value: 'all' }, 'All scopes'), scopeOptions);
  const collapse = el('button', { type: 'button', className: 'btn-small dpt-collapse' }, 'Collapse all');

  function runSearch() {
    query = search.value.trim();
    hits = new Map();
    if (!query) { status.textContent = ''; paint(); return; }
    // Only matches in what the scope menu shows are counted: each one is opened.
    const { matches, places, truncated, total, elsewhere } = searchNodes(tree, query, place => visible(place.product, place.group));
    for (const m of matches) {
      const { product, group, chain } = places.get(m.key);
      const id = groupId(product, group);
      hits.set(m.key, true);
      if (split) expanded.add(product === THIS_APP ? `p:${THIS_APP}` : 'p:other').add(`p:${product}`);
      expanded.add(id);
      const keys = chain ? chain.map(n => n.key) : [m.key];
      // Open every ancestor so the match is visible; the match itself stays as found.
      for (let i = 1; i <= keys.length - 1; i++) expanded.add([id, ...keys.slice(0, i)].join('>'));
    }
    status.textContent = total
      ? `${total} ${total === 1 ? 'match' : 'matches'}${elsewhere ? `, ${elsewhere} of them in other products` : ''}${truncated ? `, showing the first ${MAX_MATCHES}` : ''}. One path to each is opened; a shared package can sit under other parents too.`
      : `No package matches "${query}"${scope === 'all' ? '' : ' in what is shown'}.`;
    paint();
    treeEl.querySelector('.dpt-item--hit')?.scrollIntoView?.({ block: 'nearest' });
  }
  search.addEventListener('input', runSearch);
  scopeSelect.addEventListener('change', () => { scope = scopeSelect.value; runSearch(); });
  collapse.addEventListener('click', () => { expanded.clear(); hits = new Map(); search.value = ''; query = ''; status.textContent = ''; paint(); });

  // ----- keyboard: arrows move, right opens, left closes or goes to the parent, Enter/Space toggles -----
  treeEl.addEventListener('keydown', (e) => {
    const item = e.target.closest?.('[role="treeitem"]');
    if (!item) return;
    const visible = [...treeEl.querySelectorAll('[role="treeitem"]')];
    const i = visible.indexOf(item);
    const focus = (t) => { if (!t) return; visible.forEach(v => v.setAttribute('tabindex', '-1')); t.setAttribute('tabindex', '0'); t.focus(); };
    const toggle = item.querySelector(':scope > .dpt-row > .dpt-toggle:not(.dpt-toggle--static)');
    const open = item.getAttribute('aria-expanded') === 'true';
    switch (e.key) {
      case 'ArrowDown': focus(visible[i + 1]); break;
      case 'ArrowUp': focus(visible[i - 1]); break;
      case 'ArrowRight':
        if (item.hasAttribute('aria-expanded') && !open) toggle?.click();
        else if (open) focus(item.querySelector(':scope > ul > [role="treeitem"]'));
        break;
      case 'ArrowLeft':
        if (open && toggle) toggle.click();
        else focus(item.parentElement?.closest?.('[role="treeitem"]'));
        break;
      case 'Enter': case ' ': toggle?.click(); break;
      case 'Home': focus(visible[0]); break;
      case 'End': focus(visible[visible.length - 1]); break;
      default: return;
    }
    e.preventDefault();
  });
  treeEl.addEventListener('focusin', (e) => {
    const item = e.target.closest?.('[role="treeitem"]');
    if (!item) return;
    treeEl.querySelectorAll('[role="treeitem"][tabindex="0"]').forEach(v => v.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');
  });

  const limits = [];
  if (tree.unreachable.length) limits.push(`${tree.unreachable.length} packages are listed under "${UNREACHABLE_LABEL}": the files name no parent for them, or the parent they name is not in the lockfile${tree.missingParents ? ` (${tree.missingParents} such references)` : ''}.`);

  // A tree with a single group opens it: there is nothing to choose between.
  const groupIds = tree.products.flatMap(p => [...p.groups.map(g => groupId(p.id, g.scope)), ...(p.unreachable.length ? [groupId(p.id, 'unreachable')] : [])]);
  if (!split && groupIds.length === 1) expanded.add(groupIds[0]);

  paint();
  return el('div', { className: 'dpt' },
    el('p', { className: 'dpt-intro' },
      'Which package pulls in which, read from the release\'s lockfiles (source analysis, not an inspection of the installed app). ',
      'A published advisory says a version with a known flaw is present; it does not establish that the wallet can be exploited. This view is informational and not part of any verdict.'),
    el('p', { className: 'dpt-intro' },
      'The lockfiles name each package\'s parents without versions. When a parent is locked at several versions, its dependencies are listed under each of them and marked "parent version unclear". A shared package appears under every parent that needs it.'),
    limits.length ? el('ul', { className: 'dp-notices' }, limits.map(t => el('li', {}, t))) : null,
    el('div', { className: 'dpt-controls' }, search, scopeSelect, collapse),
    status,
    treeEl,
  );
}
