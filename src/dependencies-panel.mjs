// The wallet page's "Dependencies" panel: what the source analysis
// (external/source_analysis) found in the release's lockfiles, drawn from the
// per-app file of its static export. Loaded on demand, one small file per
// wallet; the full dependency list is only fetched for the CSV download.
// Measurement only, not part of the verdict, and labelled so.

import { el } from './html-utils.mjs';
import {
  panelModel, whereOf, whereLabel, safeName, csvOf, SEVERITY_ORDER, SEVERITY_LABEL,
} from './dependencies-panel-model.mjs';
import { TRIAGE_LABEL, triageStateOf } from './dependency-triage.mjs';

// Where the export is served from. The transport (proxy on walletscrutiny.com,
// Blossom blobs, rsync) is decided outside this module; only this constant moves.
export const EXPORT_BASE = (typeof window !== 'undefined' && window.WS_SOURCE_ANALYSIS_BASE) || '/api/source-analysis';

const OSV_URL = 'https://osv.dev/vulnerability/';
const ISSUE_URL = 'https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/978';

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

// The wallet's triage file (scripts/build-dependency-triage.mjs output), or
// null when nobody has decided anything for it. Tried for the page's own app
// id first, then the id the analysis is stored under (the alias hop in loadApp).
export async function loadTriage(appIds, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  for (const id of [...new Set(appIds.filter(Boolean))]) {
    const triage = await fetchJson(`${base}/triage/${safeName(id)}.json`, fetchImpl);
    if (triage) return triage;
  }
  return null;
}

function severityPill(severity) {
  return el('span', { className: `dp-sev dp-sev--${SEVERITY_ORDER.includes(severity) ? severity : 'unknown'}` }, SEVERITY_LABEL[severity] || severity);
}

function tile(value, label, { tone = '', sub = null, sub2 = null } = {}) {
  return el('div', { className: `dp-tile${tone ? ` dp-tile--${tone}` : ''}` },
    el('div', { className: 'dp-tile__value' }, value == null ? '–' : String(value)),
    el('div', { className: 'dp-tile__label' }, label),
    sub ? el('div', { className: 'dp-tile__sub' }, sub) : null,
    sub2 ? el('div', { className: 'dp-tile__sub dp-tile__sub--where' }, sub2) : null,
  );
}

// "35 in the app · 377 in build tooling": where the vulnerable packages end up.
function whereLine(byScope) {
  if (!byScope) return null;
  const parts = [];
  if (byScope.app) parts.push(`${byScope.app} in the app`);
  if (byScope.build) parts.push(`${byScope.build} in build tooling`);
  if (byScope.tests) parts.push(`${byScope.tests} only in tests`);
  if (byScope.unknown) parts.push(`${byScope.unknown} unplaced`);
  return parts.length ? parts.join(' · ') : null;
}

function severityLine(bySeverity) {
  const parts = SEVERITY_ORDER.filter(s => s !== 'malicious' && bySeverity[s] > 0).map(s => `${bySeverity[s]} ${SEVERITY_LABEL[s].toLowerCase()}`);
  return parts.length ? parts.join(' · ') : null;
}

// The ecosystem only appears when the release mixes several (npm next to
// gradle next to pip); a wallet with one ecosystem would repeat it on every row.
function advisoryRow(a, { mixedEcosystems = false } = {}) {
  const where = whereOf(a);
  return el('tr', {},
    el('td', { className: 'dp-td-package' }, a.package, mixedEcosystems && a.ecosystem ? el('span', { className: 'dp-eco' }, a.ecosystem) : null),
    el('td', {}, a.version),
    el('td', {}, el('a', { href: `${OSV_URL}${encodeURIComponent(a.id)}`, target: '_blank', rel: 'noopener noreferrer', title: a.summary || '' }, a.id)),
    el('td', {}, severityPill(a.severity)),
    el('td', {}, el('span', { className: `dp-where dp-where--${where}` }, whereLabel(a))),
    el('td', { className: 'dp-td-products' }, usedBy(a)),
    el('td', { className: 'dp-td-decision' }, decisionCell(a)),
  );
}

// Our call on the advisory, with the one-line reason under it; "–" while
// nobody has looked. A developer's own statement is shown beside ours.
export function decisionCell(a) {
  const state = triageStateOf(a);
  const d = a.decision;
  if (!d) return el('span', { className: 'dp-decision dp-decision--undecided', title: 'Nobody has looked at this advisory for this wallet yet' }, '–');
  const bits = [el('span', { className: `dp-decision dp-decision--${state}` }, TRIAGE_LABEL[state])];
  if (d.developer?.status) {
    bits.push(el('span', { className: 'dp-decision__dev', title: d.developer.justification || '' },
      ' developer: ',
      d.developer.url ? el('a', { href: d.developer.url, target: '_blank', rel: 'noopener noreferrer' }, TRIAGE_LABEL[d.developer.status]) : TRIAGE_LABEL[d.developer.status],
    ));
  }
  bits.push(el('div', { className: 'dp-decision__why' }, d.justification, d.by || d.date ? el('span', { className: 'dp-decision__who' }, ` (${[d.by, d.date].filter(Boolean).join(', ')})`) : null));
  return el('div', {}, bits);
}

// "412 advisories · 0 decided · 412 to look at" above the table: the triage
// work queue, so a long list is never mistaken for a finished one.
function triageLine(model) {
  const t = model.triage;
  if (!t || !t.total) return null;
  const parts = [`${t.total} ${t.total === 1 ? 'advisory' : 'advisories'}`, `${t.decided} decided`];
  if (t.affected) parts.push(`${t.affected} affected`);
  if (t.not_affected) parts.push(`${t.not_affected} not affected`);
  if (t.fixed) parts.push(`${t.fixed} fixed`);
  if (t.under_investigation) parts.push(`${t.under_investigation} under investigation`);
  parts.push(t.undecided ? `${t.undecided} still to look at` : 'nothing left to look at');
  return el('p', { className: 'dp-triage-line' }, parts.join(' · '));
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

function advisoryTable(model) {
  if (!model.advisories.length) return null;
  const rest = model.advisories.slice(model.worst.length);
  const rowOptions = { mixedEcosystems: model.ecosystems.length > 1 };
  const body = el('tbody', {}, model.worst.map(a => advisoryRow(a, rowOptions)));
  const table = el('table', { className: 'dp-table' },
    el('thead', {}, el('tr', {},
      ['Package', 'Version', 'Advisory', 'Severity', 'Where?', 'Used by', 'Decision'].map(h => el('th', {}, h)),
    )),
    body,
  );
  const wrap = el('div', { className: 'dp-table-wrap' }, triageLine(model), table);
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
  if (model.storeVersion) bits.push(el('span', {}, 'Store version ', el('b', {}, model.storeVersion)));
  if (model.analysedAt) bits.push(el('span', {}, 'Checked on ', el('b', {}, dateOf(model.analysedAt))));
  const line = el('p', { className: 'dp-headline' });
  bits.forEach((b, i) => { if (i) line.append(' · '); line.append(b); });
  return line;
}

function notices(model) {
  const items = [];
  if (model.storeVersion && model.versionMatches === false) {
    items.push(`The store version ${model.storeVersion} has not been checked yet; ${model.ref} is the newest release the source analysis looked at.`);
  }
  for (const f of model.newerFailed) {
    items.push(`The check of ${f.ref} failed${f.error ? ` (${f.error})` : ''}; showing the last release that was checked.`);
  }
  if (model.sameRepositoryAs.length) {
    items.push(`Same source repository as ${model.sameRepositoryAs.join(', ')}: one analysis covers both.`);
  }
  if (model.status !== 'ok') {
    items.push(`This check ended with status "${model.status}"${model.error ? `: ${model.error}` : ''}.`);
  }
  return items.length ? el('ul', { className: 'dp-notices' }, items.map(t => el('li', {}, t))) : null;
}

function howToRead(model) {
  const parts = [el('b', {}, 'How to read this. ')];
  parts.push('"Could not be checked" means the package has no exact registry version to look up');
  if (model.uncheckedBreakdown.length) parts.push(` (${model.uncheckedBreakdown.map(u => `${u.count} ${u.label}`).join(', ')})`);
  parts.push(', so it is not the same as "no problems". Results are a snapshot from the check date; new advisories may appear later. ');
  parts.push('A listed advisory is not a defect in the wallet: it says that a version with a published advisory is present, nothing more. Leaving such a version in place can be the right call, when the vulnerable code is never reached or the flaw needs a position an attacker does not have here; that is a decision per advisory. ');
  const t = model.triage;
  if (t && t.total) {
    parts.push(t.decided
      ? `The "Decision" column is our call so far, ${t.decided} of ${t.total} advisories, each with its reason; the rest nobody has looked at yet. `
      : 'Nobody has made those decisions for this wallet yet, which is what the empty "Decision" column says. ');
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
  return el('div', { className: 'dp-actions' },
    csv,
    el('a', { className: 'btn-small', href: ISSUE_URL, target: '_blank', rel: 'noopener noreferrer' }, 'What is this?'),
  );
}

// The panel element for a model; exported for tests.
export function panelElement(model, { appId, base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  const vulnSub = severityLine(model.bySeverity);
  return el('div', { className: 'dp-panel' },
    el('div', { className: 'dp-top' },
      headline(model),
      el('span', { className: 'dp-badge' }, 'Measurement only · not part of the verdict'),
    ),
    notices(model),
    el('div', { className: 'dp-tiles' },
      tile(model.packages, 'packages found'),
      tile(model.unchecked, 'could not be checked', { tone: model.unchecked ? 'muted' : '' }),
      tile(model.vulnerabilities, 'known vulnerabilities', { tone: model.vulnerabilities ? 'bad' : 'good', sub: vulnSub, sub2: model.vulnerabilities ? whereLine(model.vulnerabilitiesByScope) : null }),
      tile(model.malware, 'known malware', { tone: model.malware ? 'bad' : 'good' }),
    ),
    advisoryTable(model),
    howToRead(model),
    actions(model, { appId, base, fetchImpl }),
  );
}

/**
 * Fetch the app's export file and paint the panel into `host`. The host stays
 * hidden when the app has no analysed release or the export is unreachable:
 * a wallet nobody analysed shows no empty box. Resolves to the model or null.
 */
export async function renderDependenciesPanel({ host, appId, storeVersion = '', base = EXPORT_BASE, fetchImpl = globalThis.fetch }) {
  if (!host || !appId) return null;
  let app = null;
  let triage = null;
  try {
    app = await loadApp(appId, { base, fetchImpl });
    if (app) triage = await loadTriage([appId, app.appId], { base, fetchImpl });
  } catch (error) {
    console.warn('Dependencies panel: export not reachable', error);
    return null;
  }
  const model = panelModel(app, { storeVersion, triage });
  if (!model) {
    host.hidden = true;
    return null;
  }
  host.replaceChildren(panelElement(model, { appId: app.appId || appId, base, fetchImpl }));
  host.hidden = false;
  const step = host.closest('.dependencies-step');
  if (step) step.hidden = false;
  return model;
}

if (typeof window !== 'undefined') {
  window.renderDependenciesPanel = renderDependenciesPanel;
}
