// Who has rebuilt each dependency from source (issue 992 part G), from the
// export's rebuilds.json (external/source_analysis/rebuildClaims.mjs and
// rebuildNpm.mjs). Our own rebuilds carry the Nostr event we will sign once
// its kind is picked; other projects' claims are imported and always shown
// under their name with a link, never as our check. Nothing here changes a
// wallet's verdict.

import { el } from './html-utils.mjs';

export const CLAIMANTS = {
  ws: { label: 'WalletScrutiny', short: 'us', url: 'https://walletscrutiny.com' },
  'oss-rebuild': { label: 'Google OSS Rebuild', short: 'OSS Rebuild', url: 'https://github.com/google/oss-rebuild' },
  'reproducible-central': { label: 'Reproducible Central', short: 'Reproducible Central', url: 'https://github.com/jvm-repo-rebuild/reproducible-central' },
};
const ORDER = ['ws', 'oss-rebuild', 'reproducible-central'];

export const rebuildKey = (ecosystem, name, version) => `${ecosystem}\u0000${name}\u0000${version}`;

export function rebuildIndex(data) {
  const map = new Map();
  for (const r of data?.rows || []) map.set(rebuildKey(r.ecosystem, r.name, r.version), r);
  return map;
}

// One word for a package: reproduced by anyone beats failed; failed beats untried.
export function rebuildState(row) {
  if (!row?.claims?.length) return 'none';
  if (row.claims.some(c => c.result === 'reproduced')) return 'reproduced';
  return 'failed';
}

function claimWords(c) {
  const who = CLAIMANTS[c.by]?.short || c.by;
  return c.result === 'reproduced' ? `reproduced by ${who}` : `${who}: failed`;
}

// The small pill next to a package in the tree.
export function rebuildBadge(row) {
  const state = rebuildState(row);
  if (state === 'none') return null;
  const claims = ORDER.flatMap(by => row.claims.filter(c => c.by === by));
  const text = state === 'reproduced'
    ? `rebuilt · ${claims.filter(c => c.result === 'reproduced').map(c => CLAIMANTS[c.by]?.short || c.by).join(', ')}`
    : 'rebuild failed';
  return el('span', { className: `dp-rb dp-rb--${state}`, title: claims.map(c => `${claimWords(c)}${c.note ? ` (${c.note})` : ''}`).join('; ') }, text);
}

// n as a share of total: one decimal below 10%, never rounded to 0% or 100%.
export function percentOf(n, total) {
  if (!total) return '';
  const p = (n / total) * 100;
  if (n && p < 0.1) return '<0.1%';
  if (n < total && p > 99.9) return '>99.9%';
  return `${p < 10 ? Math.round(p * 10) / 10 : Math.round(p)}%`;
}

// The tile under the counts: how many of this release's dependencies someone rebuilt.
export function rebuildTile(summary, packages, tile) {
  if (!summary) return null;
  const by = summary.byClaimant || {};
  const share = (n) => (packages ? ` (${percentOf(n, packages)})` : '');
  const parts = ORDER.filter(k => by[k]?.reproduced).map(k => `${by[k].reproduced} ${CLAIMANTS[k].short === 'us' ? 'by us' : CLAIMANTS[k].short}${share(by[k].reproduced)}`);
  return tile(summary.reproduced, 'rebuilt from source', { sub: [
    el('div', { className: 'dp-tile__line' }, `${packages ? `${percentOf(summary.reproduced, packages)} ` : ''}of ${packages.toLocaleString('en-US')} dependencies`),
    parts.length ? el('div', { className: 'dp-tile__line' }, parts.join(' · ')) : null,
    summary.failed ? el('div', { className: 'dp-tile__line dp-tile__line--muted' }, `${summary.failed} failed every rebuild tried${share(summary.failed)}`) : null,
    el('div', { className: 'dp-tile__caveat' }, 'Others\' results are their claims, linked; we did not repeat them.'),
  ] });
}

// The result as we will publish it on the relays.
// One tag per line, so the event reads at a glance.
function eventText(ev) {
  const lines = Object.entries(ev).map(([k, v]) => (k === 'tags'
    ? ` "tags": [\n${v.map(t => `  ${JSON.stringify(t)}`).join(',\n')}\n ]`
    : ` ${JSON.stringify(k)}: ${JSON.stringify(v)}`));
  return `{\n${lines.join(',\n')}\n}`;
}

function eventPreview(c) {
  const bytes = new TextEncoder().encode(JSON.stringify(c.event)).length;
  return el('details', { className: 'dp-rb-event' },
    el('summary', {}, `Our Nostr event (${bytes} bytes, not published yet)`),
    el('pre', {}, eventText(c.event)),
    el('p', { className: 'dpt-intro' }, 'Not signed or published until its kind number is picked. Replaceable by its d tag, so a newer rebuild of the same version replaces this one.'));
}

function claimLine(c) {
  const who = CLAIMANTS[c.by] || { label: c.by };
  return el('div', { className: `dp-rb-claim dp-rb-claim--${c.result}` },
    el('span', { className: `dp-rb dp-rb--${c.result}` }, c.result === 'reproduced' ? 'reproduced' : 'failed'),
    ' ',
    // their claim links to its source (attestation, buildspec); ours to the repository we built from, after the name
    who.url ? el('a', { href: (c.by !== 'ws' && c.url) || who.url, target: '_blank', rel: 'noopener noreferrer' }, who.label) : who.label,
    c.by === 'ws' ? null : el('span', { className: 'dp-rb-theirs' }, ' (their claim)'),
    c.date ? el('span', { className: 'dpt-note' }, ` · ${c.date}`) : null,
    c.note ? el('div', { className: 'dp-via' }, c.note) : null,
    c.event ? eventPreview(c) : null);
}

const FILTERS = [
  ['all', 'Rebuilt or tried'],
  ['ws', 'By us'],
  ['oss-rebuild', 'By OSS Rebuild'],
  ['reproducible-central', 'By Reproducible Central'],
  ['failed', 'Failed'],
  ['none', 'Nobody tried yet'],
];
const MAX_ROWS = 200;

/** The "Rebuilds" tab for one release: `data` is rebuilds.json, `dependencies` dependencies.json rows. */
export function rebuildsElement(data, dependencies = []) {
  const index = rebuildIndex(data);
  const seen = new Set();
  const packages = [];
  for (const d of dependencies) {
    const key = rebuildKey(d.ecosystem, d.name, d.version);
    if (seen.has(key)) continue;
    seen.add(key);
    packages.push({ d, row: index.get(key) || null });
  }
  const tried = packages.filter(p => p.row);
  const untried = packages.length - tried.length;
  let filter = 'all';
  const body = el('tbody');
  const status = el('p', { className: 'dpt-status', role: 'status' });

  const shared = (d) => (d.productsSameVersion ? `${d.productsSameVersion} ${d.productsSameVersion === 1 ? 'wallet' : 'wallets'}` : '');
  function paint() {
    let list;
    if (filter === 'none') list = packages.filter(p => !p.row);
    else if (filter === 'failed') list = tried.filter(p => rebuildState(p.row) === 'failed');
    else if (filter === 'all') list = tried;
    else list = tried.filter(p => p.row.claims.some(c => c.by === filter));
    list = [...list].sort((a, b) => (b.d.productsSameVersion || 0) - (a.d.productsSameVersion || 0) || a.d.name.localeCompare(b.d.name));
    status.textContent = `${list.length.toLocaleString('en-US')} ${list.length === 1 ? 'package' : 'packages'}${list.length > MAX_ROWS ? `, showing the ${MAX_ROWS} used by most wallets` : ''}.`;
    body.replaceChildren(...list.slice(0, MAX_ROWS).map(({ d, row }) => el('tr', {},
      el('td', {}, el('b', {}, d.name), d.ecosystem ? el('div', { className: 'dp-via' }, d.ecosystem) : null),
      el('td', {}, el('code', {}, d.version)),
      el('td', {}, shared(d)),
      el('td', {}, row ? ORDER.flatMap(by => row.claims.filter(c => c.by === by)).map(claimLine) : el('span', { className: 'dpt-note' }, 'Nobody has tried yet')),
    )));
  }

  const buttons = FILTERS.map(([key, label]) => {
    const n = key === 'none' ? untried
      : key === 'all' ? tried.length
        : key === 'failed' ? tried.filter(p => rebuildState(p.row) === 'failed').length
          : tried.filter(p => p.row.claims.some(c => c.by === key)).length;
    const b = el('button', { type: 'button', className: 'btn-small dp-rb-filter', 'aria-pressed': String(key === filter) }, `${label} (${n.toLocaleString('en-US')})`);
    b.addEventListener('click', () => { filter = key; buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b))); paint(); });
    return b;
  });
  paint();
  return el('div', { className: 'dp-rb-pane' },
    el('p', { className: 'dpt-intro' },
      'Who has rebuilt each dependency from its source and got the same file the registry serves. Results from other projects are imported and shown under their name: they are their claims, not our checks. ',
      'Where nobody else has, we rebuild the versions most wallets share, starting with npm. A failed rebuild does not mean the package is bad, only that nobody has shown it matches its source. Not part of any verdict.'),
    el('div', { className: 'dpt-controls dp-rb-filters' }, buttons),
    status,
    el('table', { className: 'dp-table dp-rb-table' },
      el('thead', {}, el('tr', {}, ['Package', 'Version', 'Same version in', 'Rebuilt by'].map(h => el('th', {}, h)))),
      body));
}
