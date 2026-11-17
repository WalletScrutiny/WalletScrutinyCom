// The "Dependency tree" tab's data: which package pulls in which, built from
// one release's dependencies.json (rows with `direct`, `scope`, `dependants`)
// and the panel model's advisories. Pure functions, no DOM.
//
// Source analysis, not an inspection of the installed binary. A row's
// `dependants` names its parents without versions, so when a parent name is
// locked at several versions of the same lockfile the edge is "name-level":
// the child is listed under every version of that parent and flagged
// `ambiguous`, never attributed to one of them.
//
// A repository can hold other products than this app (issue 996): a row's
// product comes from the same file sorting as the page's counts (issue 994), and
// every row sits in exactly one product, this app's or another one's.

import { whereOf } from './dependency-triage.mjs';
import { TARGET_LABELS } from './dependencies-panel-model.mjs';

export const GROUPS = [
  { scope: 'app', label: 'App libraries' },
  { scope: 'build', label: 'Build tools' },
  { scope: 'tests', label: 'Tests' },
  { scope: 'unknown', label: 'Not placed (files do not say)' },
];

export const UNREACHABLE_LABEL = 'Not reachable from a direct dependency';
export const THIS_APP = 'this';
export const THIS_APP_LABEL = 'In this app';
export const OTHER_PRODUCTS_LABEL = 'Other products';

export const MAX_MATCHES = 60;

export const nodeKey = (d) => `${d.ecosystem}\u0000${d.lockfile}\u0000${d.name}\u0000${d.version}`;
const advisoryKey = (ecosystem, name, version) => `${ecosystem}\u0000${name}\u0000${version}`;

// The group a package's row goes in. `part` is the folder-name guess at another
// product; here the product comes from the file sorting, so only the scope counts.
const scopeOf = (row) => whereOf({ ...row, part: undefined });

const byName = (a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version, undefined, { numeric: true });

/**
 * @param {Array} dependencies rows of dependencies.json
 * @param {Array} advisories   panel model advisories (ecosystem, package, version, id, severity, repo)
 * @param {Function} productOf a row's product ("shared", "desktop", ...), or null when nothing says
 * @param {Array} counted      the products this page counts as its own app; null for all of them
 */
export function buildTree(dependencies = [], advisories = [], { productOf = null, counted = null } = {}) {
  const productIn = (row) => {
    const p = productOf ? productOf(row) : null;
    return !p || !counted || counted.includes(p) ? THIS_APP : p;
  };
  const nodes = new Map();
  const versionsOf = new Map(); // ecosystem+lockfile+name -> nodes
  for (const d of dependencies) {
    if (!d || !d.name) continue;
    const key = nodeKey(d);
    if (nodes.has(key)) continue; // identical coordinates twice: one node
    const node = { key, row: d, name: d.name, version: d.version || '', ecosystem: d.ecosystem, lockfile: d.lockfile, scope: scopeOf(d), product: productIn(d), direct: d.direct === true, advisories: [], repo: null, children: [], parents: [] };
    nodes.set(key, node);
    const nk = `${d.ecosystem}\u0000${d.lockfile}\u0000${d.name}`;
    if (!versionsOf.has(nk)) versionsOf.set(nk, []);
    versionsOf.get(nk).push(node);
  }

  const adv = new Map();
  for (const a of advisories) {
    const k = advisoryKey(a.ecosystem, a.package, a.version);
    if (!adv.has(k)) adv.set(k, []);
    adv.get(k).push(a);
  }
  for (const node of nodes.values()) {
    node.advisories = adv.get(advisoryKey(node.ecosystem, node.name, node.version)) || [];
    node.repo = node.advisories.map(a => a.repo).find(r => typeof r === 'string' && /^https:\/\//.test(r)) || null;
  }

  // Edges: parent name -> every locked version of that name in the same lockfile.
  let missingParents = 0;
  for (const child of nodes.values()) {
    const dependants = Array.isArray(child.row.dependants) ? child.row.dependants : [];
    for (const parentName of new Set(dependants)) {
      const parents = versionsOf.get(`${child.ecosystem}\u0000${child.lockfile}\u0000${parentName}`);
      if (!parents) { missingParents += 1; continue; }
      for (const parent of parents) {
        parent.children.push({ node: child, ambiguous: parents.length > 1 });
        child.parents.push({ node: parent, ambiguous: parents.length > 1 });
      }
    }
  }
  for (const node of nodes.values()) node.children.sort((a, b) => byName(a.node, b.node));

  const roots = [...nodes.values()].filter(n => n.direct).sort(byName);

  // Whatever no direct dependency reaches (parents unnamed or missing): said, not hidden.
  const reached = new Set();
  const stack = [...roots];
  while (stack.length) {
    const n = stack.pop();
    if (reached.has(n.key)) continue;
    reached.add(n.key);
    for (const c of n.children) stack.push(c.node);
  }
  const unreachable = [...nodes.values()].filter(n => !reached.has(n.key)).sort(byName);

  // A parent is in the child's lockfile, so a product's packages reach only its own:
  // this app first, then the other products, biggest first.
  const sizes = new Map();
  for (const n of nodes.values()) sizes.set(n.product, (sizes.get(n.product) || 0) + 1);
  const ids = [...sizes.keys()].sort((x, y) => (y === THIS_APP) - (x === THIS_APP) || sizes.get(y) - sizes.get(x) || x.localeCompare(y));
  const products = ids.map(id => ({
    id,
    label: id === THIS_APP ? THIS_APP_LABEL : TARGET_LABELS[id] || id,
    total: sizes.get(id),
    groups: GROUPS.map(g => ({ ...g, roots: roots.filter(n => n.product === id && n.scope === g.scope) })).filter(g => g.roots.length),
    unreachable: unreachable.filter(n => n.product === id),
  }));

  return { nodes, products, unreachable, missingParents, total: nodes.size };
}

// A node's children given the keys on the way down to it; a child already on
// that path is a cycle and comes back flagged, so the view does not expand it.
export function childrenOf(node, path = []) {
  return node.children.map(({ node: child, ambiguous }) => ({ node: child, ambiguous, cycle: child.key === node.key || path.includes(child.key) }));
}

// Where the view opens a package: its product, the group of the direct
// dependency at the top of one shortest path (or "unreachable"), and that path.
export function placeOf(node) {
  const chain = pathTo(node);
  return { product: node.product, group: chain ? chain[0].scope : 'unreachable', chain };
}

// Packages whose name or advisory id contains `query` (case-insensitive), in the
// places `visible` keeps (the view's scope menu), so `total` counts only what the
// view can open. `elsewhere` is how many of them are in other products.
export function searchNodes(tree, query, visible = () => true) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return { matches: [], places: new Map(), truncated: false, total: 0, elsewhere: 0 };
  const all = [];
  for (const n of tree.nodes.values()) {
    if (n.name.toLowerCase().includes(q) || n.advisories.some(a => a.id.toLowerCase().includes(q))) all.push(n);
  }
  all.sort(byName);
  const places = new Map();
  for (const n of all) {
    const place = placeOf(n);
    if (visible(place)) places.set(n.key, place);
  }
  const shown = all.filter(n => places.has(n.key));
  return {
    matches: shown.slice(0, MAX_MATCHES),
    places,
    truncated: shown.length > MAX_MATCHES,
    total: shown.length,
    elsewhere: shown.filter(n => n.product !== THIS_APP).length,
  };
}

// One shortest chain of nodes from a direct dependency down to `node`
// (breadth-first up the parents), or null when no direct dependency reaches it.
export function pathTo(node) {
  if (node.direct) return [node];
  const seen = new Set([node.key]);
  let frontier = [[node]];
  while (frontier.length) {
    const next = [];
    for (const chain of frontier) {
      for (const { node: parent } of chain[0].parents) {
        if (seen.has(parent.key)) continue;
        seen.add(parent.key);
        const up = [parent, ...chain];
        if (parent.direct) return up;
        next.push(up);
      }
    }
    frontier = next;
  }
  return null;
}
