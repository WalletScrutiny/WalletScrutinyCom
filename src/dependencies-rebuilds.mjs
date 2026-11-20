// Who has rebuilt each dependency from source (issue 992 part G), from the
// export's rebuilds.json (external/source_analysis/rebuildClaims.mjs and
// rebuildNpm.mjs). Our own rebuilds carry the Nostr event we will sign once
// its kind is picked; other projects' claims are imported and always shown
// under their name with a link, never as our check. Nothing here changes a
// wallet's verdict.

import { el } from './html-utils.mjs';
import { wsIcon } from './icon.mjs';
import { tipTrigger, refreshTip } from './dependencies-epss-tip.mjs';

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

const RECIPES = {
  npm_pack_build: 'npm pack',
  npm_custom_build: 'the package\'s own npm build script',
  pypi_pure_wheel_build: 'a Python wheel build',
  cratesio_cargo_package: 'cargo package',
};
const OSS_STORAGE_DOCS = 'https://docs.oss-rebuild.dev/storage';

function commitLink(repo, commit) {
  const base = repo.replace(/\.git$/, '').replace(/\/$/, '');
  return /^https:\/\/(github\.com|gitlab\.com|codeberg\.org)\//.test(base) ? `${base}/commit/${commit}` : null;
}

const link = (href, text) => el('a', { href, target: '_blank', rel: 'noopener noreferrer' }, text);

/** The tip of one OSS Rebuild claim: `details` from rebuild-details.json, undefined while loading, null when missing. */
export function ossDetailLines(c, details) {
  const proof = el('p', {}, link(c.url, 'The signed attestation'), ' (JSON) · ', link(OSS_STORAGE_DOCS, 'what it is'));
  if (details === undefined) return [el('p', {}, 'Loading what Google\'s rebuild says…')];
  if (!details) return [el('p', {}, 'No summary of this rebuild yet.'), proof];
  const lines = [];
  if (details.repo) {
    const href = details.commit && commitLink(details.repo, details.commit);
    lines.push(el('p', {}, 'Built from ', link(details.repo, details.repo.replace(/^https:\/\//, '')),
      details.commit ? [' at ', href ? link(href, details.commit.slice(0, 12)) : details.commit.slice(0, 12)] : null,
      details.dir ? ` (folder ${details.dir})` : null, '.'));
  }
  if (details.exact != null) {
    lines.push(el('p', {}, details.exact
      ? 'The rebuilt file is byte for byte the one the registry serves.'
      : 'The rebuilt file matches the registry\'s after Google set aside details that differ between builds, such as timestamps and file order.'));
  }
  if (details.recipe) lines.push(el('p', {}, `Built with ${RECIPES[details.recipe] || details.recipe}${details.tools ? ` (${details.tools})` : ''}${details.built ? `, ${details.built}` : ''}.`));
  else if (details.built) lines.push(el('p', {}, `Rebuilt ${details.built}.`));
  return [...lines, proof];
}

// The info icon after "Google OSS Rebuild": the release's rebuild-details.json is fetched on first open.
function ossInfo(c, name, loadDetails) {
  const trigger = tipTrigger(el('span', { html: wsIcon('circle-info') }), () => {
    const file = loadDetails();
    if (file.doc === undefined) {
      file.ready.then(() => refreshTip(trigger));
      return ossDetailLines(c, undefined);
    }
    return ossDetailLines(c, file.doc?.details?.[c.url] || null);
  }, { className: 'dp-products-info' });
  trigger.setAttribute('aria-label', `What Google's rebuild of ${name} says`);
  return trigger;
}

function claimLine(c, name, loadDetails) {
  const who = CLAIMANTS[c.by] || { label: c.by };
  return el('div', { className: `dp-rb-claim dp-rb-claim--${c.result}` },
    el('span', { className: `dp-rb dp-rb--${c.result}` }, c.result === 'reproduced' ? 'reproduced' : 'failed'),
    ' ',
    // their claim links to its source (attestation, buildspec); ours to the repository we built from, after the name
    who.url ? el('a', { href: (c.by !== 'ws' && c.url) || who.url, target: '_blank', rel: 'noopener noreferrer' }, who.label) : who.label,
    c.by === 'oss-rebuild' && c.url && loadDetails ? ossInfo(c, name, loadDetails) : null,
    c.by === 'ws' ? null : el('span', { className: 'dp-rb-theirs' }, ' (their claim)'),
    c.date ? el('span', { className: 'dpt-note' }, ` · ${c.date}`) : null,
    c.note ? el('div', { className: 'dp-via' }, c.note) : null,
    c.event ? eventPreview(c) : null);
}

const FILTERS = [
  ['none', 'Nobody tried yet'],
  ['all', 'Rebuilt or tried'],
  ['ws', 'By us'],
  ['oss-rebuild', 'By OSS Rebuild'],
  ['reproducible-central', 'By Reproducible Central'],
  ['failed', 'Failed'],
];
const MAX_ROWS = 200;
const FIRST_ROWS = 6;

/**
 * The "Rebuilds" tab for one release: `data` is rebuilds.json, `dependencies` dependencies.json rows.
 * `loadDetails()` returns { doc, ready } for the release's rebuild-details.json, doc undefined until ready.
 */
export function rebuildsElement(data, dependencies = [], { loadDetails = null } = {}) {
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
  let expanded = false;
  const body = el('tbody');
  const status = el('p', { className: 'dpt-status', role: 'status' });
  const more = el('button', { type: 'button', className: 'dp-note-more dp-rb-more' });
  more.addEventListener('click', () => { expanded = true; paint(); });

  const shared = (d) => (d.productsSameVersion ? `${d.productsSameVersion} ${d.productsSameVersion === 1 ? 'wallet' : 'wallets'}` : '');
  function paint() {
    let list;
    if (filter === 'none') list = packages.filter(p => !p.row);
    else if (filter === 'failed') list = tried.filter(p => rebuildState(p.row) === 'failed');
    else if (filter === 'all') list = tried;
    else list = tried.filter(p => p.row.claims.some(c => c.by === filter));
    list = [...list].sort((a, b) => (b.d.productsSameVersion || 0) - (a.d.productsSameVersion || 0) || a.d.name.localeCompare(b.d.name));
    status.textContent = `${list.length.toLocaleString('en-US')} ${list.length === 1 ? 'package' : 'packages'}${list.length > MAX_ROWS ? `, showing the ${MAX_ROWS} used by most wallets` : ''}.`;
    const shown = Math.min(list.length, MAX_ROWS);
    const rows = expanded ? shown : Math.min(shown, FIRST_ROWS);
    more.hidden = rows === shown;
    more.textContent = `Show ${(shown - rows).toLocaleString('en-US')} more`;
    // on phones the version sits after the name and the wallets count beside it
    body.replaceChildren(...list.slice(0, rows).map(({ d, row }) => el('tr', {},
      el('td', { className: 'dp-rb-name' }, d.name, el('span', { className: 'dp-m-only dp-m-version' }, d.version), d.ecosystem ? el('span', { className: 'dp-rb-eco' }, d.ecosystem) : null),
      el('td', { className: 'dp-rb-center dp-rb-version' }, d.version),
      el('td', { className: 'dp-rb-center dp-rb-shared' }, shared(d)),
      el('td', { className: 'dp-rb-claims' }, row ? ORDER.flatMap(by => row.claims.filter(c => c.by === by)).map(c => claimLine(c, d.name, loadDetails)) : el('span', { className: 'dpt-note' }, 'Nobody has tried yet')),
    )));
  }

  const buttons = FILTERS.map(([key, label]) => {
    const n = key === 'none' ? untried
      : key === 'all' ? tried.length
        : key === 'failed' ? tried.filter(p => rebuildState(p.row) === 'failed').length
          : tried.filter(p => p.row.claims.some(c => c.by === key)).length;
    const b = el('button', { type: 'button', className: 'dp-history__tab dp-rb-filter', 'aria-pressed': String(key === filter) },
      label, el('span', { className: 'dp-rb-filter-count' }, n.toLocaleString('en-US')));
    b.addEventListener('click', () => { filter = key; expanded = false; buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b))); paint(); });
    return b;
  });
  paint();
  return el('div', { className: 'dp-rb-pane' },
    el('p', { className: 'dpt-intro' },
      'Who has rebuilt each dependency from source and got the same file the registry serves. Some of these results are other projects\' claims rather than our own checks, and none of them affect any verdict.'),
    el('div', { className: 'dpt-controls' }, el('span', { className: 'dp-history__tabs dp-rb-filters', role: 'group', 'aria-label': 'Show' }, buttons)),
    status,
    el('table', { className: 'dp-table dp-rb-table' },
      el('thead', {}, el('tr', {}, ['Package', 'Version', 'Same version in', 'Rebuilt by'].map((h, i) => el('th', { className: i === 1 || i === 2 ? 'dp-rb-center' : null }, h)))),
      body),
    more);
}
