// The wallet page's "Dependencies" panel: what the source analysis
// (external/source_analysis) found in the release's lockfiles, drawn from the
// per-app file of its static export. Loaded on demand, one small file per
// wallet; the full dependency list is only fetched for the CSV download.
// Measurement only, not part of the verdict, and labelled so.

import * as nip19 from 'nostr-tools/nip19';
import { el } from './html-utils.mjs';
import {
  panelModel, releaseForVersion, whereOf, whereLabel, safeName, csvOf, SEVERITY_ORDER, SEVERITY_LABEL,
} from './dependencies-panel-model.mjs';
import { TRIAGE_LABEL, JUSTIFICATION_LABEL, DELETION_KIND, triageStateOf, withStatement, mergeLiveTriage, triageForApp } from './dependency-triage.mjs';
import { dependencyTriageKind, mainRelayUrl, eventRelayUrls } from './nostr-constants.mjs';
import { fetchEvents } from './nostr-client.mjs';
import { openTriageDialog } from './dependencies-triage-form.mjs';
import { treeElement } from './dependencies-tree.mjs';
import { epssTrigger, tipTrigger } from './dependencies-epss-tip.mjs';
import { showAnalysedReleases } from './build-verifications.mjs';

// Where the export is served from: the analyser copies it to the web server
// after each pass (external/source_analysis/publish.mjs), no site build involved.
export const EXPORT_BASE = (typeof window !== 'undefined' && window.WS_SOURCE_ANALYSIS_BASE) || '/api/source-analysis';
// The triage statements the site build saw and the trusted list
// (scripts/build-dependency-triage.mjs); the relay adds the newer ones.
export const TRIAGE_BASE = (typeof window !== 'undefined' && window.WS_DEPENDENCY_TRIAGE_BASE) || '/api/dependency-triage';
const TRIAGE_RELAY_WAIT_MS = 4000;

const OSV_URL = 'https://osv.dev/vulnerability/';

const dateOf = (s) => (s ? String(s).slice(0, 10) : null);

async function fetchJson(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { Accept: 'application/json' } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

// The app's export file, following one alias hop (results are stored under
// the first app id of a repository; the other ids get a stub pointing at it).
export async function loadApp(appId, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  const first = await fetchJson(`${base}/apps/${safeName(appId)}.json`, fetchImpl);
  if (!first) return null;
  if (first.alias && first.appId && first.appId !== appId) {
    return fetchJson(`${base}/apps/${safeName(first.appId)}.json`, fetchImpl);
  }
  return first;
}

// statements.json (scripts/build-dependency-triage.mjs): every statement the
// site build saw, its deletion requests, the trusted authors and the listed
// maintainers; fetched once per base. Empty lists when it cannot be read.
const triageCache = new Map();
export function loadTriage({ triageBase = TRIAGE_BASE, fetchImpl = globalThis.fetch } = {}) {
  if (!triageCache.has(triageBase)) {
    triageCache.set(triageBase, fetchJson(`${triageBase}/statements.json`, fetchImpl).then(doc => ({
      trusted: Array.isArray(doc?.trusted) ? doc.trusted : [],
      maintainers: doc?.maintainers && typeof doc.maintainers === 'object' ? doc.maintainers : {},
      statements: Array.isArray(doc?.statements) ? doc.statements : [],
      deletions: Array.isArray(doc?.deletions) ? doc.deletions : [],
    }), () => ({ trusted: [], maintainers: {}, statements: [], deletions: [] })));
  }
  return triageCache.get(triageBase);
}

// The trusted authors and listed maintainers, `{ trusted, maintainers }`: the
// statement dialog says whether the signer's statement settles rows.
export async function loadTrusted(opts = {}) {
  const { trusted, maintainers } = await loadTriage(opts);
  return { trusted, maintainers };
}

// What the relays have now: every statement and every deletion request for
// the statement kind (a few dozen events; the page filters per wallet). The
// same relays the site build reads: the project relay does not accept the
// statement kind yet. After the first paint, so a slow relay only delays the
// repaint. [] when none answers in time.
export async function liveTriageEvents() {
  try {
    const events = await fetchEvents([{ kinds: [dependencyTriageKind] }, { kinds: [DELETION_KIND], '#k': [String(dependencyTriageKind)] }], { relayUrls: [...new Set([mainRelayUrl, ...eventRelayUrls])], maxWait: TRIAGE_RELAY_WAIT_MS });
    return [...events];
  } catch (error) {
    console.warn('Dependencies panel: relay not reachable for triage statements', error);
    return [];
  }
}

// The released APK's check (apk/<appId>.json), or null.
export async function loadApk(appIds, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  for (const id of [...new Set(appIds.filter(Boolean))]) {
    try {
      const doc = await fetchJson(`${base}/apk/${safeName(id)}.json`, fetchImpl);
      if (doc) return doc;
    } catch {
      return null;
    }
  }
  return null;
}

// The wallet's harvested ignore-file entries (upstream/<appId>.json, from the
// source-analysis export), or null; the same id order as loadTriage.
export async function loadUpstream(appIds, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  for (const id of [...new Set(appIds.filter(Boolean))]) {
    try {
      const doc = await fetchJson(`${base}/upstream/${safeName(id)}.json`, fetchImpl);
      if (doc) return doc;
    } catch {
      return null; // hints are optional; the panel paints without them
    }
  }
  return null;
}

// Public per-CVE signals (scripts/build-advisory-signals.mjs), or null when the build had none.
export async function loadSignals({ base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  try {
    return await fetchJson(`${base}/signals.json`, fetchImpl);
  } catch (error) {
    console.warn('Dependencies panel: signals not reachable', error);
    return null;
  }
}

function severityPill(severity) {
  return el('span', { className: `dp-sev dp-sev--${SEVERITY_ORDER.includes(severity) ? severity : 'unknown'}` }, SEVERITY_LABEL[severity] || severity);
}

// The severity pill, with what the world knows about the advisory itself
// under it: "exploited in the wild" when CISA lists it, and the EPSS
// probability of exploitation. Says nothing about this wallet.
export function severityCell(a) {
  const bits = [severityPill(a.severity)];
  if (a.exploited) bits.push(el('span', { className: 'dp-kev', title: `On CISA's Known Exploited Vulnerabilities list${a.exploited.added ? ` since ${a.exploited.added}` : ''}` }, 'exploited in the wild'));
  if (a.epss != null) bits.push(epssTrigger(a.epss, a.epssPercentile));
  if (a.published) bits.push(el('span', { className: 'dp-published', title: 'When the advisory became public (OSV.dev, or NVD when that was earlier)' }, `public since ${a.published}`));
  return el('div', { className: 'dp-sev-cell' }, bits);
}

// "via @babel/core, @babel/helpers" or "imported by the wallet" under the
// package name: the direct users, which is what a triage statement is keyed
// by. Nothing when the files do not record the graph.
const VIA_SHOWN = 3;
export function viaLine(a) {
  const parts = [];
  let title = null;
  if (a.direct) parts.push('imported by the wallet');
  if (Array.isArray(a.dependants) && a.dependants.length) {
    const d = a.dependants;
    const shown = d.slice(0, VIA_SHOWN).join(', ');
    parts.push(d.length > VIA_SHOWN ? `via ${shown} and ${d.length - VIA_SHOWN} more` : `via ${shown}`);
    if (d.length > VIA_SHOWN) title = `via ${d.join(', ')}`;
  }
  if (!parts.length) return null;
  return el('div', { className: 'dp-via', ...(title ? { title } : {}) }, parts.join(' · '));
}

// "github.com/o/r" under the package name: where the source lives, or nothing
// when the registry names no repository (never a guess).
export function repoLine(a) {
  if (typeof a.repo !== 'string' || !/^https:\/\//.test(a.repo)) return null;
  const label = a.repo.replace(/^https:\/\//, '');
  return el('div', { className: 'dp-repo' }, el('a', { href: a.repo, rel: 'noopener', target: '_blank', title: `Source repository of ${a.package}` }, label));
}

// A package name with break opportunities after ':' and '/' (gradle
// group:artifact, npm @scope/name), so a long coordinate wraps at its joints.
function breakableName(name) {
  const out = [];
  String(name || '').split(/(?<=[:/])/).forEach((piece, i) => { if (i) out.push(el('wbr')); out.push(piece); });
  return out;
}

function tile(value, label, { tone = '', sub = null, extra = null } = {}) {
  return el('div', { className: `dp-tile${tone ? ` dp-tile--${tone}` : ''}` },
    el('div', { className: 'dp-tile__value' }, value == null ? '–' : typeof value === 'object' ? value : String(value)),
    el('div', { className: 'dp-tile__label' }, label),
    [sub].flat().some(Boolean) ? el('div', { className: 'dp-tile__sub' }, sub) : null,
    extra,
  );
}

// The y axis around the counts, a little wider than their range, so a rise or
// a drop shows instead of a flat line far above zero: round ends, about four
// steps of 1, 2 or 5 times a power of ten, never below zero.
export function historyScale(min, max) {
  const span = max - min || max * 0.1 || 1;
  const lo = min - span * 0.15;
  const hi = max + span * 0.15;
  const raw = (hi - lo) / 4;
  const pow = 10 ** Math.max(0, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map(m => m * pow).find(v => v >= raw);
  return { bottom: Math.max(0, Math.floor(lo / step) * step), top: Math.ceil(hi / step) * step, step };
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
};

const fmt = (v) => v.toLocaleString('en-US');
export const historyPointText = (p, key = 'total') => (key === 'direct'
  ? `${p.ref}: ${fmt(p.direct)} direct dependencies (${fmt(p.total)} in all)`
  : `${p.ref}: ${fmt(p.total)} dependencies${p.direct != null ? ` (${fmt(p.direct)} direct)` : ''}`);

const HISTORY_SERIES = [['total', 'All'], ['direct', 'Direct']];

// The count of every analysed release as a line, oldest left, with tabs for
// all dependencies or only the direct ones. Hovering (or the arrow keys) shows
// one release's version and count; the release the panel shows has its own
// colour and a "Currently selected" label. Positions are percentages, so the
// chart follows the tile's width; the line is the only SVG.
export function historyChart(history) {
  if (!history || history.length < 2) return null;
  const series = HISTORY_SERIES.map(([key, name]) => ({ key, name, points: history.filter(p => p[key] != null) }))
    .filter(sr => sr.points.length >= 2);
  const slot = el('div', { className: 'dp-history__slot' });
  const tabs = series.map((sr, i) => {
    const tab = el('button', { type: 'button', className: 'dp-history__tab', role: 'tab', 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1' }, sr.name);
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const j = (i + 1) % tabs.length;
      select(j); tabs[j].focus(); e.preventDefault();
    });
    return tab;
  });
  const chart = el('div', { className: 'dp-history' },
    el('div', { className: 'dp-history__head' },
      el('span', { className: 'dp-history__title' }, 'Dependencies per version'),
      tabs.length > 1 ? el('span', { className: 'dp-history__tabs', role: 'tablist', 'aria-label': 'Which dependencies' }, tabs) : null,
    ),
    slot,
  );
  function select(i) {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    slot.replaceChildren(historyPlot(series[i].points, series[i].key, chart));
  }
  select(0);
  return chart;
}

function historyPlot(history, key, chart) {
  const n = history.length;
  const totals = history.map(p => p[key]);
  const { bottom, top, step } = historyScale(Math.min(...totals), Math.max(...totals));
  const xOf = (i) => (i / (n - 1)) * 100;
  const yOf = (v) => 100 - ((v - bottom) / (top - bottom)) * 100;

  const svg = svgEl('svg', { class: 'dp-history__lines', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  const yLabels = [];
  for (let v = bottom; v <= top; v += step) {
    svg.appendChild(svgEl('line', { x1: 0, x2: 100, y1: yOf(v), y2: yOf(v), class: 'dp-history__grid', 'vector-effect': 'non-scaling-stroke' }));
    yLabels.push(el('span', { className: 'dp-history__ylabel', style: { top: `${yOf(v)}%` } }, v.toLocaleString('en-US')));
  }
  svg.appendChild(svgEl('polyline', {
    points: history.map((p, i) => `${xOf(i)},${yOf(p[key])}`).join(' '),
    class: 'dp-history__line', 'vector-effect': 'non-scaling-stroke',
  }));
  const dots = history.map((p, i) => el('span', {
    className: `dp-history__dot${p.current ? ' dp-history__dot--current' : ''}`,
    style: { left: `${xOf(i)}%`, top: `${yOf(p[key])}%` },
  }));
  // the release the panel shows, named next to its dot: below it when the dot is near the top
  const at = history.findIndex(p => p.current);
  const currentLabel = at < 0 ? null : el('span', {
    className: 'dp-history__current',
    style: { left: `${xOf(at)}%`, top: `${yOf(history[at][key])}%` },
    dataset: { edge: xOf(at) < 20 ? 'start' : xOf(at) > 80 ? 'end' : '', side: yOf(history[at][key]) < 40 ? 'below' : 'above' },
  }, 'Currently', el('br'), 'selected');
  const cross = el('span', { className: 'dp-history__cross', hidden: true });
  const tip = el('span', { className: 'dp-history__tip', role: 'status', hidden: true });

  const first = history[0];
  const last = history[n - 1];
  const plot = el('div', {
    className: 'dp-history__plot',
    tabindex: '0',
    'aria-label': `${key === 'direct' ? 'Direct dependencies' : 'Dependencies'} per version, ${n} versions, from ${first[key]} in ${first.ref} to ${last[key]} in ${last.ref}. Use the arrow keys to read each version.`,
  }, svg, cross, dots, currentLabel, tip);

  let shown = -1;
  const show = (i) => {
    if (i === shown) return;
    if (shown >= 0) dots[shown].classList.remove('dp-history__dot--hover');
    shown = i;
    if (i < 0) { cross.hidden = true; tip.hidden = true; return; }
    const x = xOf(i);
    dots[i].classList.add('dp-history__dot--hover');
    cross.hidden = false;
    cross.style.left = `${x}%`;
    tip.hidden = false;
    tip.textContent = historyPointText(history[i], key);
    // centred on the point but kept inside the chart, over the axis labels if need be
    const p = plot.getBoundingClientRect();
    const c = chart.getBoundingClientRect();
    const tw = tip.offsetWidth;
    tip.style.left = `${Math.max(Math.min((x / 100) * p.width - tw / 2, c.right - p.left - tw), c.left - p.left)}px`;
  };
  const indexAt = (clientX) => {
    const r = plot.getBoundingClientRect();
    if (!r.width) return -1;
    return Math.max(0, Math.min(n - 1, Math.round(((clientX - r.left) / r.width) * (n - 1))));
  };
  plot.addEventListener('pointermove', (e) => show(indexAt(e.clientX)));
  plot.addEventListener('pointerdown', (e) => show(indexAt(e.clientX)));
  plot.addEventListener('pointerleave', () => { if (document.activeElement !== plot) show(-1); });
  plot.addEventListener('focus', () => show(shown >= 0 ? shown : (at >= 0 ? at : n - 1)));
  plot.addEventListener('blur', () => show(-1));
  plot.addEventListener('keydown', (e) => {
    const next = e.key === 'ArrowLeft' ? shown - 1 : e.key === 'ArrowRight' ? shown + 1
      : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : null;
    if (next == null) return;
    e.preventDefault();
    show(Math.max(0, Math.min(n - 1, next)));
  });

  return el('div', { className: 'dp-history__body' },
    el('div', { className: 'dp-history__yaxis', 'aria-hidden': 'true' }, yLabels),
    plot,
    el('div', { className: 'dp-history__xaxis', 'aria-hidden': 'true' }, el('span', {}, first.ref), el('span', {}, last.ref)),
  );
}

// One line per severity, "50 critical · 40 cleared": cleared counts the
// rows settled as fixed or not affected; everything else (undecided, under
// investigation, affected) is still potentially affected.
export function severityTally(model, rows = model.advisories || [], { explain = false } = {}) {
  const total = {};
  const cleared = {};
  for (const a of rows) {
    const sev = SEVERITY_ORDER.includes(a.severity) ? a.severity : 'unknown';
    if (sev === 'malicious') continue;
    total[sev] = (total[sev] || 0) + 1;
    const state = triageStateOf(a);
    if (state === 'not_affected' || state === 'fixed') cleared[sev] = (cleared[sev] || 0) + 1;
  }
  const out = SEVERITY_ORDER.filter(s => total[s] > 0).map(s => ({ severity: s, total: total[s], cleared: cleared[s] || 0 }));
  const worstOpen = out.find(r => r.total > r.cleared)?.severity || null;
  const lines = out.map(r => el('div', { className: 'dp-tally' },
    el('span', { className: `dp-tally__count dp-tally__count--${r.severity}` }, `${r.total} ${SEVERITY_LABEL[r.severity].toLowerCase()}`),
    ` · ${r.cleared || 'none'} `, explain ? tipTrigger('cleared', clearedTip) : 'cleared'));
  return { lines: lines.length ? lines : null, worstOpen };
}

// The ecosystem only appears when the release mixes several (npm next to
// gradle next to pip); a wallet with one ecosystem would repeat it on every row.
function advisoryRow(a, { mixedEcosystems = false, onJudge = null, freshId = null } = {}) {
  const where = whereOf(a);
  const fresh = Boolean(freshId) && statementsOf(a).some(s => s.id === freshId);
  return el('tr', { className: fresh ? 'dp-row--fresh' : null, dataset: { advisory: a.id, package: a.package } },
    el('td', { className: 'dp-td-package', dataset: { label: 'Package' } }, ...breakableName(a.package), mixedEcosystems && a.ecosystem ? el('span', { className: 'dp-eco' }, a.ecosystem) : null, repoLine(a), viaLine(a)),
    el('td', { className: 'dp-td-version', dataset: { label: 'Version' } }, a.version),
    el('td', { className: 'dp-td-advisory', dataset: { label: 'Advisory' } }, el('a', { href: `${OSV_URL}${encodeURIComponent(a.id)}`, target: '_blank', rel: 'noopener noreferrer', title: a.summary || '' }, a.id)),
    el('td', { className: 'dp-td-severity', dataset: { label: 'Severity' } }, severityCell(a)),
    el('td', { className: 'dp-td-where', dataset: { label: 'Where?' } }, el('span', { className: `dp-where dp-where--${where}` }, whereLabel(a)), inApkLine(a)),
    el('td', { className: 'dp-td-products', dataset: { label: 'Used by' } }, usedBy(a)),
    el('td', { className: 'dp-td-decision', dataset: { label: 'Decision' } }, decisionCell(a, { onJudge, freshId })),
  );
}

// Under "Where?": what the released APK says about the package, when it was checked.
const IN_APK_LABEL = {
  present: 'in the APK',
  absent: 'not in the APK',
  'cant-tell': 'APK: can\'t tell',
  'not-fetched': 'APK: not checked',
};
function inApkLine(a) {
  const x = a.inApk;
  if (!x) return null;
  const text = x.status === 'other-version-shipped' || (x.shipped && x.status === 'present')
    ? `APK has ${x.shipped || 'another version'}`
    : IN_APK_LABEL[x.status];
  if (!text) return null;
  return el('div', { className: `dp-inapk dp-inapk--${x.status}`, title: 'From the released APK: whether this package\'s code is in it (class names, native libraries, META-INF version files)' }, text);
}

// Every statement a row's decision rests on or has collected so far, what
// others say included.
function statementsOf(a) {
  return [...(a.decision?.basis || []), ...(a.triage?.partial || []), ...(a.triage?.others || [])].map(b => b.statement);
}

// "via npm:@babel/core" / "this wallet" / "the package": what a statement's need reads as.
function needLabel(need) {
  if (need.startsWith('via:')) return `via ${need.slice(4).replace(/^[a-z]+:/, '')}`;
  if (need.startsWith('app:')) return 'this wallet';
  return 'the package';
}

const AVATAR_PLACEHOLDER = '/images/profile-placeholder.svg';

// A signer as a link to their Nostr profile on njump.me: picture and name
// once nameSigners() has their profile, a placeholder and a short npub until
// then (and for a signer without one).
export function signerLink(pubkey) {
  let npub = null;
  try {
    npub = nip19.npubEncode(pubkey);
  } catch {
    return el('span', { className: 'dp-signer' }, `${String(pubkey).slice(0, 8)}…`);
  }
  return el('a', { className: 'dp-signer', href: `https://njump.me/${npub}`, target: '_blank', rel: 'noopener noreferrer', title: 'Nostr profile', 'data-pubkey': pubkey },
    el('img', { className: 'dp-signer__pic', src: AVATAR_PLACEHOLDER, alt: '', width: 16, height: 16, loading: 'lazy' }),
    el('span', { className: 'dp-signer__name' }, `${npub.slice(0, 10)}…${npub.slice(-4)}`));
}

// Profile names for every signer link under `root`, from kind-0 events
// (nostr-profile.mjs, loaded on first use). A signer without a profile keeps
// the short npub; a failure leaves them all as they are.
export async function nameSigners(root, getProfiles = defaultProfiles) {
  const links = [...root.querySelectorAll('a.dp-signer[data-pubkey]')];
  if (!links.length || !getProfiles) return;
  let profiles;
  try {
    profiles = await getProfiles([...new Set(links.map(a => a.dataset.pubkey))]);
  } catch (error) {
    console.debug('Dependencies panel: signer profiles not loaded', error);
    return;
  }
  for (const a of links) {
    const p = profiles?.get(a.dataset.pubkey);
    const name = p && String(p.name || p.displayName || p.display_name || '').trim();
    const picture = p && String(p.image || p.picture || '').trim();
    if (name) {
      a.querySelector('.dp-signer__name').textContent = name;
      a.title = `${name}'s profile`;
    }
    const img = a.querySelector('.dp-signer__pic');
    if (picture && /^https:\/\//.test(picture) && img) {
      img.addEventListener('error', () => { img.src = AVATAR_PLACEHOLDER; }, { once: true });
      img.src = picture;
    }
  }
}

async function defaultProfiles(pubkeys) {
  if (typeof indexedDB === 'undefined') return new Map();
  const { getNostrProfiles } = await import('./nostr-profile.mjs');
  return getNostrProfiles(pubkeys);
}

// Whose statements settle rows on this site (the trusted list), each linked
// to their profile, so a reader can see who answers for the decisions.
function trustedLine(trusted) {
  if (!trusted?.length) return null;
  const links = [];
  trusted.forEach((pk, i) => { if (i) links.push(', '); links.push(signerLink(pk)); });
  return el('p', { className: 'dp-trusted' }, 'Statements settle rows on this site when signed by ', ...links, '. Anyone else\'s are shown under "What others say".');
}

// One statement as a line: who it is about, what it says (linked to its
// evidence when the author gave some), who signed. The one just published
// from this page is marked. `onEdit(statement)` adds an "Edit" button.
function statementLine({ need, statement: s, label = null }, { freshId = null, onEdit = null, adopt = false } = {}) {
  let editButton = null;
  if (onEdit) {
    editButton = adopt
      ? el('button', { type: 'button', className: 'dp-edit', title: 'Start this wallet\'s statement from it: you check it against this wallet and sign it as yours' }, 'Adopt')
      : el('button', { type: 'button', className: 'dp-edit', title: 'Change this statement (yours), or start yours from it' }, 'Edit');
    editButton.addEventListener('click', () => onEdit(s));
  }
  const why = JUSTIFICATION_LABEL[s.justification] || s.content || TRIAGE_LABEL[s.status];
  return el('div', { className: `dp-decision__why${s.id === freshId ? ' dp-decision__why--fresh' : ''}`, title: s.content || '' },
    el('span', { className: 'dp-decision__need' }, `${label || needLabel(need)}: `),
    s.evidence ? el('a', { href: s.evidence, target: '_blank', rel: 'noopener noreferrer' }, why) : why,
    el('span', { className: 'dp-decision__who' }, ` (${TRIAGE_LABEL[s.status]}, `, signerLink(s.pubkey), ')'),
    s.id === freshId ? el('span', { className: 'dp-decision__fresh' }, ' just published') : null,
    editButton ? ' ' : null,
    editButton,
  );
}

// Where a statement that does not settle this row comes from
// (statementScope in dependency-triage.mjs), as the start of its line.
function otherScopeLabel({ statement: s, scope }) {
  const via = s.via ? `via ${s.via.replace(/^[a-z]+:/, '')}` : '';
  if (scope === 'elsewhere') return `in ${s.app}${via ? `, ${via}` : ''}`;
  if (scope === 'unproven') return `${via || 'the package'}, every wallet (signer not listed as maintainer)`;
  if (scope === 'unused') return `${via}, no longer a direct user in this release`;
  if (s.app) return `community, ${via || 'this wallet'}`;
  return `community, ${via || 'the package'}`;
}

// What others say: statements that concern the row without settling it here,
// made for another wallet, claimed for every wallet by someone not listed as
// the library's maintainer, or signed outside the trusted list. They fold out
// under their count so a reviewer of this wallet can read them and start
// from one ("Adopt" opens the dialog filled from it). The one just published
// from this page starts unfolded.
function othersLine(t, { freshId = null, onEdit = null, upstream = [] } = {}) {
  const list = t.others || [];
  const label = `What others say (${list.length + upstream.length})`;
  return el('details', { className: 'dp-decision__others', open: list.some(o => o.statement.id === freshId) },
    el('summary', { title: 'Statements made for other wallets or by authors whose word does not settle this row, and what scanner ignore files say; shown, not applied' }, label),
    list.map(o => statementLine({ need: null, statement: o.statement, label: otherScopeLabel(o) }, { freshId, onEdit, adopt: o.scope === 'elsewhere' || o.scope === 'unproven' })),
    upstream.map(upstreamLine),
  );
}

// A harvested ignore-file entry: whose file, the reason written next to the
// id (or that there is none), linked to the line. Nobody signed it.
function upstreamLine(h) {
  const repo = String(h.repo || '').replace(/^https:\/\/(github|gitlab)\.com\//, '');
  const whose = h.kind === 'own' ? `this wallet's ${h.file}` : `${h.file} of ${String(h.package || repo).replace(/^[a-z]+:/, '')}`;
  return el('div', { className: 'dp-decision__why dp-decision__upstream', title: `${repo} at ${h.ref}, line ${h.line}` },
    el('span', { className: 'dp-decision__need' }, `${whose}: `),
    el('a', { href: h.url, target: '_blank', rel: 'noopener noreferrer' }, h.reason || 'listed as ignored, no reason given'),
    el('span', { className: 'dp-decision__who' }, ' (ignore file, unsigned)'),
  );
}

// The row's state from the statements of its direct users, each with its
// reason; "Not assessed" while one is still missing, saying how many are in.
// With `onJudge`, a button opens the dialog that writes a statement for the row.
export function decisionCell(a, { onJudge = null, freshId = null } = {}) {
  const state = triageStateOf(a);
  const d = a.decision;
  const t = a.triage || { needs: [], covered: [], others: [], partial: [] };
  const bits = [];
  const onEdit = onJudge ? (s) => onJudge(a, s) : null;
  if (!d) {
    bits.push(el('span', { className: 'dp-decision dp-decision--undecided', title: 'No trusted statement settles this advisory for this wallet yet' }, 'Not assessed'));
    if (t.covered.length) bits.push(el('div', { className: 'dp-decision__why' }, `${t.covered.length} of ${t.needs.length} direct users assessed`));
    for (const b of t.partial || []) bits.push(statementLine(b, { freshId, onEdit }));
  } else {
    bits.push(el('span', { className: `dp-decision dp-decision--${state}` }, TRIAGE_LABEL[state]));
    for (const b of d.basis) bits.push(statementLine(b, { freshId, onEdit }));
  }
  if (t.others?.length || a.upstream?.length) bits.push(othersLine(t, { freshId, onEdit, upstream: a.upstream || [] }));
  if (onJudge) {
    const judge = el('button', { type: 'button', className: 'dp-judge', title: 'Publish a signed statement on whether this advisory affects the wallet' }, 'Add statement');
    judge.addEventListener('click', () => onJudge(a));
    bits.push(judge);
  }
  return el('div', { className: 'dp-decision-cell' }, bits);
}

// What "cleared" on the severity lines means.
export const CLEARED_TIP_LINES = [
  'Cleared means a reviewer this site trusts looked at the report and signed a statement that it does not apply to this app.',
  'That is either “not affected” (the app does not use the part of the package the report is about) or “fixed” (the app already has the fix). Each row below shows the reason and who signed it.',
  'A report that is not cleared has either not been reviewed yet, or was found to apply; the Decision column says which. On its own it does not mean there is a problem in your app.',
];

function clearedTip() {
  return CLEARED_TIP_LINES.map(line => el('p', {}, line));
}

// What the vulnerability tile's number counts, how it was found, and what it
// says about the app a visitor has installed.
export function vulnerabilityTipLines(model) {
  const date = model.analysedAt ? `, on ${dateOf(model.analysedAt)}` : '';
  return [
    'This counts published security reports (advisories) that list as affected a package version this app’s source code uses. Every package counts the same, whether it goes into the app or is used to build or test it: a build tool can change the app too. The Where? column on each row says which.',
    `How we counted: we took the package list from the app’s public source code for ${model.ref} and looked up each package version in OSV.dev, a public database of these reports${date}. One report can match several packages, so the number of distinct reports is shown below.`,
    `What it means for your app: it is about ${model.ref}. A report tells us the package version is affected, not whether the affected part is used. ${model.apk ? 'Each row below says whether we found the package in the released app.' : 'We have not checked the released app itself for these packages.'}`,
    'The colour shows the highest severity among reports not yet cleared.',
  ];
}

// The vulnerability tile counts every match alike, app, build and tests
// (Leo, 2026-10-26: a build dependency can carry a backdoor too). Matches in
// another product's lockfile from the same repository get their own line.
function vulnerabilityTile(model) {
  const rows = (model.advisories || []).filter(a => a.severity !== 'malicious');
  const tally = severityTally(model, rows, { explain: true });
  // The number takes the colour of the worst severity still open; once every
  // advisory is cleared it turns green.
  // An incomplete package list cannot show a green "0": it is a lower bound.
  const incomplete = model.lockCoverage && model.lockCoverage.verdict !== 'locked';
  const tone = tally.worstOpen ? `sev-${tally.worstOpen}` : (incomplete ? '' : 'good');
  const byPart = {};
  for (const a of rows) if (a.part) byPart[a.part] = (byPart[a.part] || 0) + 1;
  const parts = Object.entries(byPart).map(([p, n]) => `${n} of them only in the ${whereLabel({ part: p })}`);
  const distinct = new Set(rows.map(a => a.id)).size;
  // Where the matches sit, muted: the total above stays the headline.
  const sc = model.vulnerabilitiesByScope;
  const split = sc ? [[sc.app, 'in the app'], [sc.build, 'in build tooling'], [sc.tests, 'only in tests'], [sc.unknown, 'unclear']]
    .filter(([n]) => n).map(([n, l]) => `${n} ${l}`).join(' · ') : '';
  const lines = vulnerabilityTipLines(model);
  const value = tipTrigger(String(rows.length), () => lines.map(line => el('p', {}, line)), { className: 'dp-term dp-term--value' });
  return tile(value, 'advisory matches', { tone, sub: [
    tally.lines,
    rows.length ? el('div', { className: 'dp-tile__line' }, `${distinct} distinct advisories`) : null,
    rows.length && split ? el('div', { className: 'dp-tile__line dp-tile__line--muted' }, split) : null,
    parts.length ? el('div', { className: 'dp-tile__line', title: 'From lockfiles of other products in the same repository; not in this app' }, parts.join(' · ')) : null,
    rows.length ? el('div', { className: 'dp-tile__caveat' }, model.apk
      ? 'A match means a package version is listed as affected, not that the affected part is used.'
      : 'A match means a package version is listed as affected, not that the affected part is used. The released app itself was not checked for these packages.') : null,
    incomplete ? el('div', { className: 'dp-tile__caveat' }, 'At least this many: part of the build was not checked (see the note above).') : null,
    triageLine(model),
  ] });
}

// "3 decided · 3 under investigation · 409 still to look at" in the
// vulnerability tile: the triage work queue, so a long list is never mistaken for a finished one.
function triageLine(model) {
  const t = model.triage;
  if (!t || !t.total) return null;
  const parts = [`${t.decided} decided`];
  if (t.affected) parts.push(`${t.affected} affected`);
  if (t.not_affected) parts.push(`${t.not_affected} not affected`);
  if (t.fixed) parts.push(`${t.fixed} fixed`);
  if (t.under_investigation) parts.push(`${t.under_investigation} under investigation`);
  parts.push(t.undecided ? `${t.undecided} still to look at${t.partial ? ` (${t.partial} partly)` : ''}` : 'nothing left to look at');
  return el('div', { className: 'dp-triage-line' }, parts.join(' · '));
}

// "25 · 3 this version": how many of the checked wallets ship the package at
// all, and how many this exact version. A package only this wallet ships
// says so instead of "1".
export function usedBy(a) {
  if (a.products == null) return '–';
  if (a.products <= 1) return el('span', { className: 'dp-products-sub' }, 'only this wallet');
  const same = a.productsSameVersion;
  return el('span', {}, String(a.products), same != null ? el('span', { className: 'dp-products-sub' }, ` · ${same} this version`) : null);
}

// The worst rows, or every row with `showAll` (after a publish, so the judged
// row stays in sight wherever it re-sorts to).
function advisoryTable(model, { onJudge = null, freshId = null, showAll = false } = {}) {
  if (!model.advisories.length) return null;
  const shown = showAll ? model.advisories : model.worst;
  const rest = model.advisories.slice(shown.length);
  const rowOptions = { mixedEcosystems: model.ecosystems.length > 1, onJudge, freshId };
  const body = el('tbody', {}, shown.map(a => advisoryRow(a, rowOptions)));
  const table = el('table', { className: 'dp-table' },
    el('thead', {}, el('tr', {},
      ['Package', 'Version', 'Advisory', 'Severity', 'Where?', 'Used by', 'Decision'].map(h => el('th', {}, h)),
    )),
    body,
  );
  const wrap = el('div', { className: 'dp-table-wrap' }, table);
  if (rest.length) {
    const more = el('button', { type: 'button', className: 'btn-small dp-more' }, `Show all ${model.advisories.length} advisories`);
    more.addEventListener('click', () => {
      for (const a of rest) body.appendChild(advisoryRow(a, rowOptions));
      more.remove();
    });
    wrap.appendChild(more);
  }
  return wrap;
}

function headline(model) {
  const bits = [
    el('span', {}, 'Checked release ', el('b', {}, model.ref), model.commit ? ` (source tag, commit ${model.commit})` : ' (source tag)'),
  ];
  if (model.analysedAt) bits.push(el('span', {}, 'Checked on ', el('b', {}, dateOf(model.analysedAt))));
  const line = el('p', { className: 'dp-headline' });
  bits.forEach((b, i) => { if (i) line.append(' · '); line.append(b); });
  return line;
}

// Lock coverage (external/source_analysis/plugins/lock-coverage.mjs): what
// this check could not see, said to the reader, with what would fix it in a
// toggletip. "0 advisories" must not read as "nothing wrong" when the list
// of packages is incomplete.
const LOCKFILE_KIND = {
  pub: 'Flutter (pubspec.lock)', go: 'Go (go.sum)', cocoapods: 'CocoaPods (Podfile.lock)',
  swiftpm: 'Swift (Package.resolved)', carthage: 'Carthage (Cartfile.resolved)', npm: 'npm (pnpm or bun lockfile)',
  pip: 'Python (poetry, uv, Pipfile or pdm lockfile)', 'esp-idf': 'ESP-IDF (dependencies.lock)', 'c/c++': 'C/C++ build',
};
const fileList = (files, count) => {
  const out = [];
  files.forEach((f, i) => { if (i) out.push(', '); out.push(el('code', {}, f)); });
  if (count > files.length) out.push(` and ${count - files.length} more`);
  return out;
};

// What could not be seen, in words: "2 manifests without a lockfile, 1 download without a hash check".
export function coverageGaps(c) {
  const gaps = [];
  if (c.missingCount) gaps.push(plural(c.missingCount, 'dependency file without a lockfile', 'dependency files without a lockfile'));
  if (c.floating) gaps.push(plural(c.floating, 'version range', 'version ranges'));
  if (c.downloadCount) gaps.push(plural(c.downloadCount, 'download without a hash check', 'downloads without a hash check'));
  if (c.binaryCount) gaps.push(plural(c.binaryCount, 'committed binary', 'committed binaries'));
  const kinds = [...new Set(c.unread.map(u => LOCKFILE_KIND[u.ecosystem] || u.ecosystem))];
  if (kinds.length) gaps.push(`the ${kinds.join(', ')} part${kinds.length > 1 ? 's' : ''}, which this check does not read yet`);
  return gaps;
}

// The toggletip: what the wallet team can do, item by item, and what a reader can do.
export function coverageTipLines(c) {
  const lines = [el('p', {}, el('b', {}, 'What would fix it'))];
  if (c.missingCount) lines.push(el('p', {}, 'Wallet team: commit the lockfile your package manager writes for ', ...fileList(c.missing.map(m => m.manifest), c.missingCount), '.'));
  const rangeFiles = c.floatingFiles?.length ? [' in ', ...fileList(c.floatingFiles, c.floatingFiles.length)] : [];
  if (c.floating) lines.push(el('p', {}, 'Wallet team: replace version ranges (like ', el('code', {}, '1.+'), ' or ', el('code', {}, '^2.0'), ') with exact versions', ...rangeFiles, ', or add a lockfile.'));
  if (c.downloadCount) lines.push(el('p', {}, 'Wallet team: check the hash of what the build downloads (', el('code', {}, 'sha256sum -c'), ', or an image ', el('code', {}, '@sha256:'), ' digest) in ', ...fileList(c.downloads.map(d => `${d.file}:${d.line}`), c.downloadPlaceCount ?? c.downloadCount), '.'));
  if (c.binaryCount) lines.push(el('p', {}, 'Wallet team: build these from source, or say where each comes from with its hash: ', ...fileList(c.binaries, c.binaryCount), '.'));
  const native = c.unread.filter(u => u.ecosystem === 'c/c++');
  const unread = c.unread.filter(u => u.ecosystem !== 'c/c++');
  if (native.length) lines.push(el('p', {}, 'Wallet team: C and C++ have no lockfile. Bring each library in as a git submodule, which this check follows, or list its version and hash next to the build.'));
  const unreadCount = c.unreadCount - native.length;
  if (unread.length) lines.push(el('p', {}, 'Nothing for the wallet team here: ', ...fileList(unread.map(u => u.lockfile), unreadCount), unreadCount === 1 ? ' exists, but this check cannot read it yet.' : ' exist, but this check cannot read them yet.', ' That is on us.'));
  // Something only the wallet team can fix: a reader can pass it on.
  const forTheTeam = c.missingCount || c.floating || c.downloadCount || c.binaryCount || native.length;
  lines.push(el('p', {}, forTheTeam
    ? 'Using this wallet? Send the list above to its team. Until then, treat the advisory count as a lower bound.'
    : 'Using this wallet? Treat the advisory count as a lower bound until this check reads those files.'));
  return lines;
}

function coverageNotice(model) {
  const c = model.lockCoverage;
  if (!c || c.verdict === 'locked') return null;
  // A release with only submodules already says so in its status notice.
  if (c.verdict === 'none') return model.submodules ? null : el('span', { className: 'dp-coverage' }, 'This check found no dependency files in this release, so its dependencies are unknown, not absent.');
  const gaps = coverageGaps(c);
  const lead = c.verdict === 'unknown'
    ? 'This check could read only part of this release\'s dependencies'
    : 'Part of this release\'s build is not pinned to exact versions, so it can pull different code without any change to its source';
  return el('span', { className: 'dp-coverage' },
    el('b', {}, 'Incomplete check: '), `${lead}${gaps.length ? `: ${gaps.join(', ')}` : ''}. Those parts were not checked for advisories. `,
    tipTrigger('What would fix it?', () => coverageTipLines(c)));
}

function notices(model) {
  const items = [];
  // A package OSV lists as malicious outranks everything else on the panel:
  // it is checked by hand (the registry package, not a workspace or an alias)
  // and the team is alerted (external/source_analysis/alerts.mjs).
  const malicious = (model.advisories || []).filter(a => a.severity === 'malicious');
  if (malicious.length) {
    items.push(el('span', { className: 'dp-malware' }, el('b', {}, 'Possible malware: '),
      malicious.map(a => `${a.package}@${a.version} (${a.id})`).join(', '),
      ` is listed on OSV.dev as malicious. A person is checking whether the lockfile really installs that registry package; until then this is a lead, not a finding. It matters even when only the build uses it: build code can change the app.`));
  }
  for (const f of model.selectedVersion ? [] : model.newerFailed) {
    items.push(`The check of ${f.ref} failed${f.error ? ` (${f.error})` : ''}; showing the last release that was checked.`);
  }
  const coverage = coverageNotice(model);
  if (coverage) items.push(coverage);
  if (model.sameRepositoryAs.length) {
    items.push(`Built from the same source repository as ${model.sameRepositoryAs.join(', ')}, which shares this analysis.`);
  }
  if (model.unchecked) {
    const why = model.uncheckedBreakdown.map(u => `${u.count} ${u.label}`).join(', ');
    items.push(`${model.unchecked} of the ${model.packages} packages could not be checked for advisories${why ? ` (${why})` : ''}; that is not the same as "no problems".`);
  }
  if (model.status === 'unsupported' && model.submodules) {
    items.push('No lockfile this check reads was found in this release, so only its git submodules were checked.');
  } else if (model.status === 'unsupported' && coverage) {
    // the coverage notice already says what was not read, in words
  } else if (model.status !== 'ok') {
    items.push(`This check ended with status "${model.status}"${model.error ? `: ${model.error}` : ''}.`);
  }
  if (model.apk) {
    const k = model.apk;
    const parts = [`Checked against the released APK${k.name ? ` ${k.name}` : ''}${k.sha256 ? ` (sha256 ${k.sha256.slice(0, 12)}…)` : ''}: ${k.present} of the ${k.declared} declared Maven/Gradle packages are in it${k.cantTell ? `, ${k.cantTell} can't be told` : ''}`];
    if (k.native) parts.push(`${k.nativeIdentical} of ${k.native} native libraries are the same code as the published packages${k.nativeDiffers ? `, ${k.nativeDiffers} differ` : ''}`);
    if (k.undeclaredNative.length) parts.push(`no dependency declares ${k.undeclaredNative.join(', ')}`);
    if (k.undeclaredClasses) parts.push(`${k.undeclaredClasses} classes come from no declared package (${k.undeclaredPackages.join(', ')}${k.undeclaredPackages.length < 5 ? '' : ', …'}), the wallet's own code among them`);
    items.push(`${parts.join('; ')}.`);
  }
  return items.length ? el('ul', { className: 'dp-notices' }, items.map(t => el('li', {}, t))) : null;
}

function howToRead(model) {
  const parts = [el('b', {}, 'How to read this. ')];
  parts.push('"Direct" dependencies are the packages the wallet imports itself; "transitive" ones arrive through them, and the line under a package name says through which. ');
  if (model.unchecked) parts.push('A package "could not be checked" when it has no exact registry version to look up (a version range, a git reference, no version recorded). ');
  parts.push('Results are a snapshot from the check date; new advisories may appear later. ');
  parts.push('A listed advisory is not a defect in the wallet: it says that a version with a published advisory is present, nothing more. Leaving such a version in place can be the right call, when the vulnerable code is never reached or the flaw needs a position an attacker does not have here; that is a decision per advisory. ');
  const t = model.triage;
  if (t && t.total) {
    parts.push('A decision is keyed by the advisory and the package\'s direct user (the line under the package name), and made for this wallet: a row is settled once every direct user has a statement, the wallet itself counting as one when it imports the package. What another wallet concluded about the same direct user is listed under "What others say" and can be adopted after a look, but it never settles a row here; only a statement by the direct user\'s listed maintainer holds for every wallet. ');
    parts.push(t.decided
      ? `The "Decision" column shows ${t.decided} of ${t.total} advisories settled that way, each with its reasons and signers; the rest nobody has judged yet. `
      : 'Nobody has made those statements for this wallet\'s advisories yet, which is what the empty "Decision" column says. ');
    parts.push('"Add statement" on a row writes one: signed with your Nostr browser extension, published to the relays, shown here at once and on every wallet page after the next site build. Anyone can publish; whose statements settle rows is a list the site keeps, the others are shown. ');
  }
  if (model.signals) {
    parts.push('Under the severity, "exploited in the wild" means CISA lists the advisory as exploited somewhere, EPSS is the published probability that it gets exploited anywhere within 30 days, and "public since" is when the advisory was published; all three are about the advisory, not this wallet. ');
  }
  parts.push('We do not rank wallets by this number. ');
  if (model.byScope) {
    const b = model.byScope;
    parts.push(`"Where?" says where a package ends up: ${b.app} in the app, ${b.build} in the build tooling, ${b.tests} only in tests`);
    parts.push(b.unknown ? `, and ${b.unknown} the files do not say ("?"). ` : '. ');
    parts.push('A build or test dependency can still hurt the product (an install script runs on the developer\'s machine), so every advisory needs its own look. ');
  } else if (model.whereUnknown) {
    parts.push(`"?" in the Where? column means the files do not say whether the package ends up in the app, the build tooling or the tests (${model.whereUnknown} packages). `);
  }
  parts.push('"Used by" counts how many of the wallets we have checked ship the package in any version, and how many this exact version: a package shared by many wallets is a shared risk, not a problem with this one. ');
  if (model.lockfiles.length) {
    parts.push('Files read: ');
    model.lockfiles.forEach((l, i) => { if (i) parts.push(', '); parts.push(el('code', {}, l)); });
    parts.push('. ');
  }
  if (model.diff) {
    const d = model.diff;
    parts.push(`Since ${d.ref}: ${d.added} packages added, ${d.removed} removed, ${d.changed} updated`);
    parts.push(d.integrityChangedAtSameVersion.length
      ? `, and ${d.integrityChangedAtSameVersion.length} changed content at the same version (${d.integrityChangedAtSameVersion.join(', ')}). `
      : ', none changed content at the same version. ');
  }
  return el('div', { className: 'dp-note' }, parts);
}

function actions(model, { appId, base, fetchImpl }) {
  const csv = el('button', { type: 'button', className: 'btn-small dp-csv' }, 'Download CSV');
  csv.addEventListener('click', async () => {
    csv.disabled = true;
    try {
      const data = await fetchJson(`${base}/apps/${safeName(appId)}/${safeName(model.ref)}/dependencies.json`, fetchImpl);
      const text = csvOf(data?.dependencies || [], model.advisories);
      const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
      const a = el('a', { href: url, download: `${appId}-${model.ref}-dependencies.csv` });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Dependencies CSV download failed', error);
    } finally {
      csv.disabled = false;
    }
  });
  return el('div', { className: 'dp-actions' }, csv);
}

// The panel element for a model; exported for tests. `onJudge(advisory)`
// puts a Judge button on every row; after a publish, `flash` is the line
// above the table saying so, `freshId` the statement to mark, and every row
// is shown so the judged one stays in sight wherever it re-sorts to.
// Below the tiles everything starts folded behind one link; `expanded` opens
// it, `onToggle(open)` hears the reader open or close it.
export function panelElement(model, { appId, wallet = appId, base = EXPORT_BASE, fetchImpl = globalThis.fetch, onJudge = null, flash = null, freshId = null, showAll = false, trusted = [], expanded = false, onToggle = null } = {}) {
  // No lockfile was read (a C/C++ release with only submodules, or a Flutter one): zeros here would read as clean.
  const tiles = !model.packages && (model.submodules || model.status === 'unsupported') ? null : el('div', { className: 'dp-tiles' },
    tile(model.packages, 'dependencies', { sub: `${model.direct} direct · ${model.transitive} transitive`, extra: historyChart(model.history) }),
    vulnerabilityTile(model),
    model.malware
      ? tile(model.malware, 'possible malware', { tone: 'bad', sub: 'being checked by a person; see the note above' })
      : tile(model.malware, 'known malware', { tone: 'good' }),
  );
  const rest = [
    treeTabs(model, advisoryTable(model, { onJudge, freshId, showAll }), { appId, base, fetchImpl, label: `${wallet} ${model.ref}` }),
    model.advisories.length ? trustedLine(trusted) : null,
    submodulesSection(model, { appId, base, fetchImpl }),
    howToRead(model),
    actions(model, { appId, base, fetchImpl }),
  ];
  return el('div', { className: 'dp-panel' },
    el('div', { className: 'dp-top' },
      headline(model),
      el('span', { className: 'dp-badge' }, 'Measurement only · not part of the verdict'),
    ),
    notices(model),
    flash ? el('p', { className: 'dp-flash', role: 'status' }, flash) : null,
    tiles,
    // without the tiles there is nothing to fold under
    tiles ? foldedDetails(model, rest, { expanded: expanded || showAll, onToggle }) : rest,
  );
}

// "See 38 Advisories and Dependency Tree": the count is the advisory tile's.
export function detailsLinkText(model, open = false) {
  const n = (model.advisories || []).filter(a => a.severity !== 'malicious').length;
  const what = !model.packages ? 'Details'
    : n ? `${open ? '' : `${n} `}${n === 1 ? 'Advisory' : 'Advisories'} and Dependency Tree` : 'Dependency Tree';
  return `${open ? 'Hide' : 'See'} ${what}`;
}

function foldedDetails(model, rest, { expanded, onToggle }) {
  const body = el('div', { className: 'dp-details', id: `dp-details-${Math.random().toString(36).slice(2, 8)}` }, rest);
  const link = el('button', { type: 'button', className: 'dp-details-link', 'aria-controls': body.id });
  const set = (open) => {
    body.hidden = !open;
    link.setAttribute('aria-expanded', String(open));
    link.textContent = detailsLinkText(model, open);
  };
  set(expanded);
  link.addEventListener('click', () => {
    const open = body.hidden;
    set(open);
    onToggle?.(open);
  });
  return [link, body];
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// Submodule rows (external/source_analysis/submoduleIdentity.mjs), as words.
export function submoduleIdentityText(r) {
  const id = r.identity || {};
  if (r.error) return `Could not be checked: ${r.error}`;
  if (r.firstParty) return "The wallet's own code";
  switch (id.status) {
    case 'upstream-tag': return `Upstream release ${id.tag}, unmodified${id.viaTree ? ' (same files, other history)' : ''}`;
    case 'upstream-commit': return id.base ? `Upstream code, ${plural(id.ahead, 'commit')} after ${id.base}, unmodified` : 'Upstream code, unmodified';
    case 'derived': return `Modified: ${id.base} plus ${plural(id.ahead, 'commit')} upstream does not have${id.files ? ` (${plural(id.files.length, 'file')} changed)` : ''}`;
    case 'unknown-origin': return 'No upstream release in its history';
    default: return 'Unknown';
  }
}

export function submoduleScopeText(r) {
  const s = r.scope;
  if (!s || s.status === 'assumed') return 'May be';
  return `${s.status === 'test-only' ? 'No, tests only' : 'No'}: ${s.why}`;
}

const HINT_TEXT = {
  'fix-in-history': 'fix commit present',
  'fix-patch-present': 'fix patch present',
  'fix-patch-absent': 'fix patch applies, so likely missing',
  'cant-tell': "can't tell",
};

function osvLinks(ids) {
  const out = [];
  ids.forEach((id, i) => { if (i) out.push(', '); out.push(el('a', { href: `${OSV_URL}${encodeURIComponent(id)}`, target: '_blank', rel: 'noopener noreferrer' }, id)); });
  return out;
}

function submoduleAdvisoryCell(r) {
  const a = r.advisories;
  if (!a) return '';
  if (a.status === 'affected') return el('span', {}, `${a.applies.length} listed: `, osvLinks(a.applies));
  if (a.status === 'none-listed') return 'None listed';
  if (a.status === 'none-listed-for-base') return `None listed for ${a.base}; the changes on top are unreviewed`;
  if (a.unknown?.length) {
    return el('span', {}, `Status unknown: ${a.unknown.length} listed for ${a.base}, OSV cannot tell for a modified copy.`,
      el('ul', { className: 'dp-sub-hints' }, a.unknown.map(u => el('li', {}, osvLinks([u.id]), `: ${HINT_TEXT[u.hint] || u.hint}`))));
  }
  return 'Unknown';
}

export function submodulesSummaryText(s) {
  const mayBe = s.total - s.notInApp - s.errors;
  const parts = [plural(s.total, 'library', 'libraries')];
  if (s.firstParty) parts.push(`${s.firstParty} of them the wallet's own`);
  if (s.notInApp) parts.push(`${s.notInApp} not in the app (tests, or folders the build does not use)`);
  if (s.errors) parts.push(`${s.errors} could not be checked`);
  let text = `${parts.join(', ')}. `;
  text += `Of the ${mayBe} that may be in the app, ${s.affected ? `${plural(s.affected, 'unmodified upstream copy', 'unmodified upstream copies')} ${s.affected === 1 ? 'has' : 'have'} ${plural(s.advisories, 'listed advisory', 'listed advisories')}` : 'no unmodified upstream copy has listed advisories'}`;
  if (s.derived) text += `; ${plural(s.derived, 'is a modified copy', 'are modified copies')}, where upstream advisories may or may not apply${s.advisoriesUnknown ? ` (${s.advisoriesUnknown} to check)` : ''}`;
  if (s.unknownOrigin) text += `; ${s.unknownOrigin} with no upstream release found`;
  return `${text}.`;
}

// The release's git submodules: a summary line, and the rows (submodules.json) when opened.
function submodulesSection(model, { appId, base, fetchImpl }) {
  const s = model.submodules;
  if (!s) return null;
  const body = el('div', { className: 'dp-sub-body' }, el('p', { className: 'dpt-intro' }, 'Loading…'));
  const details = el('details', { className: 'dp-submodules' },
    el('summary', {}, el('b', {}, 'Libraries pinned as git submodules. '), submodulesSummaryText(s)),
    body);
  let loaded = false;
  details.addEventListener('toggle', () => {
    if (!details.open || loaded) return;
    loaded = true;
    fetchJson(`${base}/apps/${safeName(appId)}/${safeName(model.ref)}/submodules.json`, fetchImpl).then((data) => {
      if (!data?.rows?.length) throw new Error('empty');
      body.replaceChildren(
        el('p', { className: 'dpt-intro' }, 'Each row is three separate claims. "What it is" compares the pinned commit with the library\'s upstream repository. Advisories are those OSV.dev lists for that upstream commit, so they only carry over to an unmodified copy; for a modified one the fix hints are leads, and reading the changes is code review. "In the app" is read from the build files; "May be" is not proof that the code is compiled in. The release\'s reproducible-build status covers whatever is built in.'),
        el('table', { className: 'dp-table dp-sub-table' },
          el('thead', {}, el('tr', {}, ['Library', 'Pinned at', 'What it is', 'In the app', 'Advisories'].map(h => el('th', {}, h)))),
          el('tbody', {}, data.rows.map(r => el('tr', { className: r.scope && r.scope.status !== 'assumed' ? 'dp-sub-out' : '' },
            el('td', {}, el('a', { href: (r.url || '').replace(/\.git$/, ''), target: '_blank', rel: 'noopener noreferrer', title: r.path }, r.path.split('/').pop()),
              el('div', { className: 'dp-via' }, r.path), r.upstream ? el('div', { className: 'dp-via' }, `fork of ${r.upstream.replace(/\.git$/, '')}`) : null),
            el('td', {}, el('code', {}, r.identity?.tag || String(r.commit).slice(0, 10))),
            el('td', {}, submoduleIdentityText(r)),
            el('td', {}, submoduleScopeText(r)),
            el('td', {}, submoduleAdvisoryCell(r)),
          )))));
    }).catch((error) => {
      console.warn('Submodules not available', error);
      loaded = false;
      body.replaceChildren(el('p', { className: 'dpt-intro' }, 'The submodule list for this release could not be loaded.'));
    });
  });
  return details;
}

// "Advisories" (the table) and "Dependency tree" tabs. The tree's file (the
// release's full dependency list) is fetched when its tab is first opened.
function treeTabs(model, table, { appId, base, fetchImpl, label }) {
  if (!model.packages) return table;
  const tabs = [];
  const panes = [];
  let loaded = false;
  const treePane = el('div', { className: 'dp-tabpanel', role: 'tabpanel', hidden: true }, el('p', { className: 'dpt-intro' }, 'Loading the dependency list…'));
  const tablePane = el('div', { className: 'dp-tabpanel', role: 'tabpanel' }, table || el('p', { className: 'dpt-intro' }, 'No published advisories found for this release.'));
  const select = (i) => {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; panes[j].hidden = i !== j; });
    if (i === 1 && !loaded) {
      loaded = true;
      fetchJson(`${base}/apps/${safeName(appId)}/${safeName(model.ref)}/dependencies.json`, fetchImpl).then((data) => {
        if (!data?.dependencies?.length) throw new Error('empty');
        treePane.replaceChildren(treeElement({ dependencies: data.dependencies, advisories: model.advisories, wallet: label }));
      }).catch((error) => {
        console.warn('Dependency tree not available', error);
        loaded = false;
        treePane.replaceChildren(el('p', { className: 'dpt-intro' }, 'The dependency list for this release could not be loaded.'));
      });
    }
  };
  [['Advisories', tablePane], ['Dependency tree', treePane]].forEach(([name, pane], i) => {
    const tab = el('button', { type: 'button', className: 'dp-tab', role: 'tab', 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1' }, name);
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const j = (i + 1) % 2; select(j); tabs[j].focus(); e.preventDefault(); }
    });
    tabs.push(tab); panes.push(pane);
  });
  return el('div', { className: 'dp-tabs' }, el('div', { className: 'dp-tablist', role: 'tablist' }, tabs), tablePane, treePane);
}

// "Your statement on GHSA-… is published (3 of 6 relays): this page shows it now, every wallet page after the next site build."
export function publishedFlash(statement, summary) {
  const where = summary?.settles === false ? 'shown under "What others say" here' : 'this page shows it now';
  return `Your statement on ${statement.vulns[0]} is published (${summary?.successful ?? '?'} of ${summary?.total ?? '?'} relays accepted it): ${where}, every wallet page after the next site build.`;
}

/**
 * Fetch the app's export file and paint the panel into `host`. The host stays
 * hidden when the app has no analysed release or the export is unreachable:
 * a wallet nobody analysed shows no empty box. Resolves to the model or null.
 * `nostr` overrides the dialog's signer and relays, `profiles(pubkeys)` the
 * signer-name lookup (tests).
 */
// Shown instead of the panel when the version picked in "Every version" has no
// analysis: which releases do, each a button that picks its stone when the
// river has one.
function notAnalysedElement(version, app, platform, failed) {
  const river = typeof document !== 'undefined' ? document.getElementById(`buildVerifications-${platform}`) : null;
  const analysed = (app.releases || []).filter(r => (r.status || 'ok') === 'ok');
  const refs = analysed.map((r) => {
    const stone = river && [...river.querySelectorAll('.bv-stone[data-version-key]')]
      .find(b => releaseForVersion({ releases: [r] }, b.dataset.versionKey));
    if (!stone) return el('b', {}, r.ref);
    const pick = el('button', { type: 'button', className: 'dp-pick-version' }, r.ref);
    pick.addEventListener('click', () => stone.click());
    return pick;
  });
  const list = el('span', {});
  refs.forEach((r, i) => { if (i) list.append(', '); list.append(r); });
  return el('div', { className: 'dp-panel dp-panel--not-analysed' },
    el('p', { className: 'dp-headline' },
      failed
        ? `The dependency check of version ${version} (${failed.ref}) failed${failed.error ? ` (${failed.error})` : ''}.`
        : `Version ${version} has not been checked for dependencies.`),
    refs.length ? el('p', {}, analysed.length === 1 ? 'Checked: ' : 'Checked releases: ', list, '.') : null,
  );
}

// A release the panel can show: analysed, or failed with something still read from it.
function hasAnalysis(release) {
  return (release.status || 'ok') === 'ok' || Boolean(release.submodules) || Boolean(release.lockCoverage);
}

// The version picked in "Every version" (src/build-verifications.mjs keeps it
// on its host), or null before that section is painted.
function pickedVersion(platform) {
  if (typeof document === 'undefined') return null;
  const river = document.getElementById(`buildVerifications-${platform}`);
  return (river && !river.hidden && river.dataset.selectedVersion) || null;
}

/**
 * Paints the panel into [host] for the release the "Every version" section of
 * [platform] has picked, and follows it when another version is picked
 * (`buildVersionSelected`); the newest analysed release until that section is
 * painted, or when the page has none. `selectedVersion` overrides the pick.
 */
export async function renderDependenciesPanel({ host, appId, platform = 'app', selectedVersion = undefined, title = '', base = EXPORT_BASE, triageBase = TRIAGE_BASE, liveEvents = liveTriageEvents, fetchImpl = globalThis.fetch, nostr = undefined, profiles = undefined }) {
  if (!host || !appId) return null;
  let selected = selectedVersion === undefined ? pickedVersion(platform) : selectedVersion;
  let ready = false;
  if (selectedVersion === undefined && typeof document !== 'undefined') {
    // Listening before the export loads: a pick made meanwhile is not lost.
    document.addEventListener('buildVersionSelected', (event) => {
      if (event.detail?.platform !== platform || event.detail.version === selected) return;
      selected = event.detail.version || null;
      if (ready) paint();
    });
  }
  let app = null;
  let published = null;
  let triage = null;
  let signals = null;
  let upstream = null;
  let apk = null;
  try {
    app = await loadApp(appId, { base, fetchImpl });
    if (app) {
      published = await loadTriage({ triageBase, fetchImpl });
      triage = triageForApp(app, published);
      signals = await loadSignals({ base, fetchImpl });
      upstream = await loadUpstream([app.appId, appId], { base, fetchImpl });
      apk = await loadApk([app.appId, appId], { base, fetchImpl });
    }
  } catch (error) {
    console.warn('Dependencies panel: export not reachable', error);
    return null;
  }
  const analysisId = app?.appId || appId;
  let model = null;
  // Every release the panel can show gets a stone in "Every version", verified or not.
  if (selectedVersion === undefined && typeof document !== 'undefined') {
    const shown = (app?.releases || []).filter(r => r.ref && hasAnalysis(r));
    showAnalysedReleases(document.getElementById(`buildVerifications-${platform}`), shown.map(r => r.ref));
  }

  // Repainted after a statement is published, with the statement merged in,
  // and when the relay has statements the site build did not see.
  const lists = { trusted: published?.trusted || [], maintainers: published?.maintainers || {} };
  // whether the reader opened the advisories and tree; kept across repaints and version picks
  let expanded = false;
  const paint = (extra = {}) => {
    if (extra.showAll) expanded = true;
    const release = selected ? releaseForVersion(app, selected) : null;
    if (selected && (!release || !hasAnalysis(release)) && app?.releases?.length) {
      model = { ref: release?.ref || null, selectedVersion: selected, notAnalysed: true };
      host.replaceChildren(notAnalysedElement(selected, app, platform, release));
      return model;
    }
    model = panelModel(app, { release: release?.ref || null, selectedVersion: release ? selected : null, triage, signals, upstream, apk, platform, appId });
    if (!model) return null;
    host.replaceChildren(panelElement(model, { appId: analysisId, wallet: title || analysisId, base, fetchImpl, onJudge, trusted: lists.trusted, expanded, onToggle: (open) => { expanded = open; }, ...extra }));
    nameSigners(host, profiles === undefined ? defaultProfiles : profiles);
    return model;
  };
  async function onJudge(advisory, edit = null) {
    openTriageDialog({
      advisory,
      edit,
      appId: analysisId,
      triage,
      trusted: lists.trusted,
      maintainers: lists.maintainers,
      ...(nostr ? { nostr } : {}),
      onPublished: (statement, summary) => {
        triage = withStatement(triage, statement, { appId: analysisId, trusted: lists.trusted, maintainers: lists.maintainers });
        paint({ flash: publishedFlash(statement, summary), freshId: statement.id, showAll: true });
        (host.querySelector('.dp-row--fresh') || host.querySelector('.dp-flash'))?.scrollIntoView?.({ block: 'center' });
      },
      onDeleted: (statement, summary) => {
        // every version of that subject by that author: an earlier one still in the page's list must not come back
        triage = triage ? { ...triage, statements: triage.statements.filter(s => !(s.pubkey === statement.pubkey && s.d === statement.d)) } : triage;
        paint({ flash: `Your statement on ${statement.vulns[0]} is deleted (${summary.text}): gone from this page and, once the relay has the request, from every wallet page.`, showAll: true });
        host.querySelector('.dp-flash')?.scrollIntoView?.({ block: 'center' });
      },
    });
  }

  ready = true;
  if (!paint()) {
    host.hidden = true;
    return null;
  }
  host.hidden = false;
  const step = host.closest('.dependencies-step');
  if (step) step.hidden = false;
  // The relay's statements, after the first paint: a statement made since the
  // last site build shows now, a deleted one goes. A dialog the reader has open
  // keeps working on the rows it was opened from.
  if (app?.releases?.some(r => r.advisories?.length)) {
    const events = await liveEvents();
    const merged = triageForApp(app, mergeLiveTriage(published, events));
    const ids = (t) => JSON.stringify((t?.statements || []).map(st => st.id).sort());
    if (ids(merged) !== ids(triage)) {
      triage = merged;
      paint();
    }
  }
  return model;
}

if (typeof window !== 'undefined') {
  window.renderDependenciesPanel = renderDependenciesPanel;
}
