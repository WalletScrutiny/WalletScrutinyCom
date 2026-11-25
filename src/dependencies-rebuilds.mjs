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
  ws: { label: 'WalletScrutiny', short: 'us', url: 'https://walletscrutiny.com', icon: 'walletscrutiny' },
  'oss-rebuild': { label: 'Google OSS Rebuild', short: 'OSS Rebuild', url: 'https://github.com/google/oss-rebuild', icon: 'google' },
  'reproducible-central': { label: 'Reproducible Central', short: 'Reproducible Central', url: 'https://github.com/jvm-repo-rebuild/reproducible-central', icon: 'reproducible-builds' },
};
const ORDER = ['ws', 'oss-rebuild', 'reproducible-central'];

// Where OSS Rebuild keeps the attestation of one rebuilt artifact; the same
// as external/source_analysis/rebuildClaims.mjs (ossRebuildUrl). PyPI names
// compare case- and separator-insensitively (PEP 503).
const OSS_ECOSYSTEMS = { npm: 'npm', pip: 'pypi', cargo: 'cratesio' };
export function ossRebuildUrl(ecosystem, name, version, artifact) {
  const eco = OSS_ECOSYSTEMS[ecosystem];
  if (!eco) return null;
  const pkg = ecosystem === 'pip' ? name.toLowerCase().replace(/[-_.]+/g, '-') : name;
  return `https://storage.googleapis.com/google-rebuild-attestations/${eco}/${pkg}/${version}/${artifact}/rebuild.intoto.jsonl`;
}

// rebuilds.json with every OSS Rebuild claim's `url`: the export stores only
// the artifact's name, the rest of the URL being the row's package
// (export.mjs, rebuildRowForReaders). A claim that has its URL keeps it.
export function withClaimUrls(data) {
  if (!Array.isArray(data?.rows)) return data;
  return { ...data, rows: data.rows.map(r => ({ ...r, claims: (r.claims || []).map((c) => {
    if (c.url || c.by !== 'oss-rebuild' || !c.artifact) return c;
    const url = ossRebuildUrl(r.ecosystem, r.name, r.version, c.artifact);
    return url ? { ...c, url } : c;
  }) })) };
}

export const rebuildKey = (ecosystem, name, version) => `${ecosystem}\u0000${name}\u0000${version}`;

export function rebuildIndex(data) {
  const map = new Map();
  for (const r of data?.rows || []) map.set(rebuildKey(r.ecosystem, r.name, r.version), r);
  return map;
}

// A claim's result in words. Besides reproduced and failed, ours carry the rebuilder's verdict
// (external/dep_rebuilder/db.mjs): almost (only docs or dev-only package.json fields differ),
// not-reproducible (the publisher's own build, written down as a recipe, differs) and
// unknown-command (our generic build differs: the command was our guess, not the publisher's).
const RESULT_WORDS = { reproduced: 'reproduced', almost: 'almost', 'not-reproducible': 'not reproducible', 'unknown-command': 'differs', failed: 'failed' };
const resultWords = (result) => RESULT_WORDS[result] || 'failed';
const resultClass = (result) => (RESULT_WORDS[result] ? result : 'failed');

// One word for a package, the most telling claim: reproduced by anyone beats almost, almost beats
// not reproducible and failed, and those beat a difference of our guessed build; any beats untried.
const STATE_ORDER = ['reproduced', 'almost', 'not-reproducible', 'failed', 'unknown-command'];
export function rebuildState(row) {
  if (!row?.claims?.length) return 'none';
  return STATE_ORDER.find(s => row.claims.some(c => resultClass(c.result) === s));
}

const BADGE_WORDS = { almost: 'almost reproduced', 'not-reproducible': 'not reproducible', failed: 'rebuild failed', 'unknown-command': 'differs from our build' };

function claimWords(c) {
  const who = CLAIMANTS[c.by]?.short || c.by;
  return c.result === 'reproduced' ? `reproduced by ${who}` : `${who}: ${resultWords(c.result)}`;
}

// The small pill next to a package in the tree.
export function rebuildBadge(row) {
  const state = rebuildState(row);
  if (state === 'none') return null;
  const claims = ORDER.flatMap(by => row.claims.filter(c => c.by === by));
  const text = state === 'reproduced'
    ? `rebuilt · ${claims.filter(c => c.result === 'reproduced').map(c => CLAIMANTS[c.by]?.short || c.by).join(', ')}`
    : BADGE_WORDS[state];
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
    summary.failed ? el('div', { className: 'dp-tile__line dp-tile__line--muted' }, `${summary.failed} not reproduced by any rebuild tried${share(summary.failed)}`) : null,
    by.ws?.['not-reproducible'] ? el('div', { className: 'dp-tile__line dp-tile__line--muted' }, `${by.ws['not-reproducible']} not reproducible with the publisher's build${share(by.ws['not-reproducible'])}`) : null,
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
    el('p', {}, 'Not signed or published until its kind number is picked. Replaceable by its d tag, so a newer rebuild of the same version replaces this one.'));
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

// What a rebuild of ours that differs says, above its note.
const WS_MEANING = {
  almost: 'Only docs or development-only package.json fields differ from the registry\'s file; the code is the same.',
  'not-reproducible': 'We ran the publisher\'s own release build, written down as a recipe, and what it packed differs from the registry\'s file.',
  'unknown-command': 'Our generic build differs from the registry\'s file. We guessed the build command; the publisher may build another way, so this does not show that the package cannot be reproduced.',
};

/** The tip of one of our rebuilds: the source, toolchain and file hash come from its unsigned event. */
export function wsDetailLines(c) {
  const tags = c.event?.tags || [];
  const tag = (name) => tags.find(t => t[0] === name);
  const lines = [];
  const [, repo, commit] = tag('source') || [];
  if (repo) {
    const href = commit && commitLink(repo, commit);
    lines.push(el('p', {}, 'Built from ', link(repo, repo.replace(/^https:\/\//, '')),
      commit ? [' at ', href ? link(href, commit.slice(0, 12)) : commit.slice(0, 12)] : null, '.'));
  }
  if (tag('toolchain')) lines.push(el('p', {}, `Built with ${tag('toolchain')[1]}.`));
  if (WS_MEANING[c.result]) lines.push(el('p', {}, WS_MEANING[c.result]));
  if (c.note) lines.push(el('p', {}, c.note.endsWith('.') ? c.note : `${c.note}.`));
  if (tag('x')) lines.push(el('p', {}, 'Same file as the registry\'s, sha256 ', el('code', {}, tag('x')[1]), '.'));
  if (c.date) lines.push(el('p', {}, `Rebuilt ${c.date}.`));
  if (c.event) lines.push(eventPreview(c));
  return lines.length ? lines : [el('p', {}, 'No details of this rebuild.')];
}

/** The tip of one Reproducible Central claim: what differs, where that is reported, and the build spec it comes from. */
export function rcDetailLines(c) {
  const lines = [];
  if (c.note) lines.push(el('p', {}, c.note.endsWith('.') ? c.note : `${c.note}.`));
  else if (c.result === 'reproduced') lines.push(el('p', {}, 'Every file of this release they compared matched.'));
  if (c.issue) lines.push(el('p', {}, 'Reported upstream: ', /^https?:\/\//.test(c.issue) ? link(c.issue, c.issue.replace(/^https?:\/\//, '')) : c.issue));
  if (c.url) lines.push(el('p', {}, link(c.url, 'Their build spec'), ' on GitHub'));
  return lines;
}

function infoTrigger(label, lines) {
  const trigger = tipTrigger(el('span', { html: wsIcon('circle-info') }), lines, { className: 'dp-products-info' });
  trigger.setAttribute('aria-label', label);
  return trigger;
}

// The info icon after "Google OSS Rebuild": the release's rebuild-details.json is fetched on first open.
function ossInfo(c, name, loadDetails) {
  const trigger = infoTrigger(`What Google's rebuild of ${name} says`, () => {
    const file = loadDetails();
    if (file.doc === undefined) {
      file.ready.then(() => refreshTip(trigger));
      return ossDetailLines(c, undefined);
    }
    return ossDetailLines(c, file.doc?.details?.[c.url] || null);
  });
  return trigger;
}

function claimInfo(c, name, loadDetails) {
  if (c.by === 'oss-rebuild') return c.url && loadDetails ? ossInfo(c, name, loadDetails) : null;
  if (c.by === 'ws') return infoTrigger(`Our rebuild of ${name}`, () => wsDetailLines(c));
  if (c.by === 'reproducible-central') {
    const lines = rcDetailLines(c);
    return lines.length ? infoTrigger(`What Reproducible Central says about ${name}`, () => lines) : null;
  }
  return null; // a claimant the panel does not know: its note stays in the line
}

function claimLine(c, name, loadDetails) {
  const who = CLAIMANTS[c.by] || { label: c.by };
  return el('div', { className: `dp-rb-claim dp-rb-claim--${c.result}` },
    who.icon ? el('span', { className: 'dp-rb-who-icon', html: wsIcon(who.icon) }) : null,
    who.label,
    el('span', { className: `dp-rb dp-rb--${resultClass(c.result)}` }, resultWords(c.result)),
    claimInfo(c, name, loadDetails),
    c.by === 'ws' ? null : el('span', { className: 'dp-rb-theirs' }, '(their claim)'),
    !CLAIMANTS[c.by] && c.note ? el('div', { className: 'dp-via' }, c.note) : null);
}

const FILTERS = [
  ['none', 'Nobody tried yet'],
  ['all', 'Rebuilt or tried'],
  ['ws', 'By us'],
  ['oss-rebuild', 'By OSS Rebuild'],
  ['reproducible-central', 'By Reproducible Central'],
  ['failed', 'Not reproduced'],
];
// counts that should stand out at first sight; "Nobody tried yet" stays neutral
const COUNT_TONE = { all: 'good', ws: 'good', 'oss-rebuild': 'good', 'reproducible-central': 'good', failed: 'bad' };
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
    else if (filter === 'failed') list = tried.filter(p => rebuildState(p.row) !== 'reproduced');
    else if (filter === 'all') list = tried;
    else list = tried.filter(p => p.row.claims.some(c => c.by === filter));
    list = [...list].sort((a, b) => (b.d.productsSameVersion || 0) - (a.d.productsSameVersion || 0) || a.d.name.localeCompare(b.d.name));
    status.textContent = `${list.length.toLocaleString('en-US')} ${list.length === 1 ? 'package' : 'packages'}${list.length > MAX_ROWS ? `, showing the ${MAX_ROWS} used by most wallets` : ''}.`;
    const shown = Math.min(list.length, MAX_ROWS);
    const rows = expanded ? shown : Math.min(shown, FIRST_ROWS);
    more.hidden = rows === shown;
    more.textContent = `Show ${(shown - rows).toLocaleString('en-US')} more`;
    // the version sits after the name; on phones the wallets count beside them
    body.replaceChildren(...list.slice(0, rows).map(({ d, row }) => el('tr', {},
      el('td', { className: 'dp-rb-name' }, d.name, el('span', { className: 'dp-pkg-version' }, d.version), d.ecosystem ? el('span', { className: 'dp-rb-eco' }, d.ecosystem) : null),
      el('td', { className: 'dp-rb-claims' }, row ? ORDER.flatMap(by => row.claims.filter(c => c.by === by)).map(c => claimLine(c, d.name, loadDetails)) : el('span', { className: 'dpt-note' }, 'Nobody has tried yet')),
      el('td', { className: 'dp-rb-center dp-rb-shared' }, shared(d)),
    )));
  }

  const buttons = FILTERS.map(([key, label]) => {
    const n = key === 'none' ? untried
      : key === 'all' ? tried.length
        : key === 'failed' ? tried.filter(p => rebuildState(p.row) !== 'reproduced').length
          : tried.filter(p => p.row.claims.some(c => c.by === key)).length;
    const b = el('button', { type: 'button', className: 'dp-history__tab dp-rb-filter', 'aria-pressed': String(key === filter) },
      label, el('span', { className: `dp-rb-filter-count${COUNT_TONE[key] ? ` dp-rb-filter-count--${COUNT_TONE[key]}` : ''}` }, n.toLocaleString('en-US')));
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
      el('thead', {}, el('tr', {}, ['Package', 'Rebuilt by', 'Same version in'].map((h, i) => el('th', { className: i === 2 ? 'dp-rb-center' : null }, h)))),
      body),
    more);
}
