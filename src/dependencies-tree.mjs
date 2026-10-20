// The Dependencies panel's "Dependency tree" tab: the wallet at the top, its
// direct dependencies grouped by where they end up (app / build / tests), each
// package expandable to the packages it pulls in. Branches render when opened,
// so a few thousand packages stay responsive. Source analysis of the release's
// lockfiles, not an inspection of the installed binary; informational, not
// part of any verdict.

import { el } from './html-utils.mjs';
import { whereLabel, SEVERITY_ORDER, SEVERITY_LABEL } from './dependencies-panel-model.mjs';
import { buildTree, childrenOf, searchNodes, pathTo, GROUPS, UNREACHABLE_LABEL, MAX_MATCHES } from './dependencies-tree-model.mjs';

const OSV_URL = 'https://osv.dev/vulnerability/';

// The package's page on its registry: a fixed URL pattern per ecosystem, not a guess.
export function registryUrl(ecosystem, name) {
  const n = encodeURIComponent(name).replace(/%2F/g, '/').replace(/%40/g, '@');
  switch (ecosystem) {
    case 'npm': return `https://www.npmjs.com/package/${n}`;
    case 'cargo': return `https://crates.io/crates/${encodeURIComponent(name)}`;
    case 'pip': return `https://pypi.org/project/${encodeURIComponent(name)}/`;
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
 * `advisories` the panel model's advisories, `wallet` the heading line.
 */
export function treeElement({ dependencies, advisories = [], wallet }) {
  const tree = buildTree(dependencies, advisories);
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
      el('span', { className: `dp-where dp-where--${node.scope}` }, whereLabel(node.row)),
      advisoryBadge(node),
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

  function groupItem(id, label, roots) {
    const open = expanded.has(id);
    const li = el('li', { className: 'dpt-item dpt-item--group', role: 'treeitem', 'aria-level': '2', 'aria-expanded': String(open), tabindex: '-1', dataset: { id } });
    const toggle = el('button', { type: 'button', className: 'dpt-toggle', tabindex: '-1', 'aria-label': `${open ? 'Collapse' : 'Expand'} ${label}` }, open ? '−' : '+');
    toggle.addEventListener('click', (e) => { e.stopPropagation(); if (open) expanded.delete(id); else expanded.add(id); paint(); });
    li.appendChild(el('div', { className: 'dpt-row' }, toggle, el('span', { className: 'dpt-group' }, label), el('span', { className: 'dpt-count' }, `${roots.length} ${roots.length === 1 ? 'package' : 'packages'}`)));
    if (open) {
      const ul = el('ul', { role: 'group', className: 'dpt-children' });
      for (const n of roots) ul.appendChild(nodeItem(n, [id, n.key], 3));
      li.appendChild(ul);
    }
    return li;
  }

  function paint() {
    const focused = document.activeElement?.closest?.('[data-id]')?.dataset?.id;
    const items = [];
    for (const g of tree.groups) {
      if (scope !== 'all' && g.scope !== scope) continue;
      items.push(groupItem(`g:${g.scope}`, g.label, g.roots));
    }
    if (tree.unreachable.length && (scope === 'all' || scope === 'unreachable')) items.push(groupItem('g:unreachable', UNREACHABLE_LABEL, tree.unreachable));
    const root = el('li', { className: 'dpt-item dpt-item--wallet', role: 'treeitem', 'aria-level': '1', 'aria-expanded': 'true', tabindex: '0' },
      el('div', { className: 'dpt-row' }, el('span', { className: 'dpt-toggle dpt-toggle--static' }, '−'), el('span', { className: 'dpt-wallet' }, wallet)),
      el('ul', { role: 'group', className: 'dpt-children' }, items));
    treeEl.replaceChildren(root);
    if (focused) treeEl.querySelector(`[data-id="${CSS.escape(focused)}"]`)?.querySelector('.dpt-toggle')?.focus?.();
  }

  // ----- controls -----
  const search = el('input', { type: 'search', className: 'dpt-search', placeholder: 'Find a package or advisory', 'aria-label': 'Find a package or advisory in the tree' });
  const scopeSelect = el('select', { className: 'dpt-scope', 'aria-label': 'Show only' },
    el('option', { value: 'all' }, 'All scopes'),
    GROUPS.filter(g => tree.groups.some(x => x.scope === g.scope)).map(g => el('option', { value: g.scope }, g.label)),
    tree.unreachable.length ? el('option', { value: 'unreachable' }, UNREACHABLE_LABEL) : null);
  const collapse = el('button', { type: 'button', className: 'btn-small dpt-collapse' }, 'Collapse all');

  function runSearch() {
    query = search.value.trim();
    hits = new Map();
    if (!query) { status.textContent = ''; paint(); return; }
    const { matches, truncated, total } = searchNodes(tree, query);
    let shown = 0;
    for (const m of matches) {
      const chain = pathTo(m);
      const first = chain ? chain[0] : null;
      const groupId = first ? `g:${first.scope}` : 'g:unreachable';
      if (scope !== 'all' && !groupId.endsWith(scope)) continue;
      hits.set(m.key, true);
      shown += 1;
      expanded.add(groupId);
      const keys = chain ? chain.map(n => n.key) : [m.key];
      // Open every ancestor so the match is visible; the match itself stays as found.
      for (let i = 1; i <= keys.length - 1; i++) expanded.add([groupId, ...keys.slice(0, i)].join('>'));
    }
    status.textContent = shown
      ? `${total} ${total === 1 ? 'match' : 'matches'}${truncated ? `, showing the first ${MAX_MATCHES}` : ''}. One path to each is opened; a shared package can sit under other parents too.`
      : `No package matches "${query}".`;
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
