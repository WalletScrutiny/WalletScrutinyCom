// The wallet page's "Dependencies" panel: what the source analysis
// (external/source_analysis) found in the release's lockfiles, drawn from the
// per-app file of its static export. Loaded on demand, one small file per
// wallet; the full dependency list is only fetched for the CSV download.
// Separate from the verdict and the score, and labelled so.

import { el } from './html-utils.mjs';
import {
  panelModel, whereOf, whereLabel, safeName, csvOf, SEVERITY_ORDER, SEVERITY_LABEL,
} from './dependencies-panel-model.mjs';

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

function severityPill(severity) {
  return el('span', { className: `dp-sev dp-sev--${SEVERITY_ORDER.includes(severity) ? severity : 'unknown'}` }, SEVERITY_LABEL[severity] || severity);
}

function tile(value, label, { tone = '', sub = null } = {}) {
  return el('div', { className: `dp-tile${tone ? ` dp-tile--${tone}` : ''}` },
    el('div', { className: 'dp-tile__value' }, value == null ? '–' : String(value)),
    el('div', { className: 'dp-tile__label' }, label),
    sub ? el('div', { className: 'dp-tile__sub' }, sub) : null,
  );
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
  );
}

function advisoryTable(model) {
  if (!model.advisories.length) return null;
  const rest = model.advisories.slice(model.worst.length);
  const rowOptions = { mixedEcosystems: model.ecosystems.length > 1 };
  const body = el('tbody', {}, model.worst.map(a => advisoryRow(a, rowOptions)));
  const table = el('table', { className: 'dp-table' },
    el('thead', {}, el('tr', {},
      ['Package', 'Version', 'Advisory', 'Severity', 'Where?'].map(h => el('th', {}, h)),
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
  if (model.byScope) {
    const b = model.byScope;
    parts.push(`"Where?" says where a package ends up: ${b.app} in the app, ${b.build} in the build tooling, ${b.tests} only in tests`);
    parts.push(b.unknown ? `, and ${b.unknown} the files do not say ("?"). ` : '. ');
    parts.push('A build or test dependency can still hurt the product (an install script runs on the developer\'s machine), so every advisory needs its own look. ');
  } else if (model.whereUnknown) {
    parts.push(`"?" in the last column means the files do not say whether the package ends up in the app, the build tooling or the tests (${model.whereUnknown} packages). `);
  }
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
      el('span', { className: 'dp-badge' }, 'Separate from our verdict and score'),
    ),
    notices(model),
    el('div', { className: 'dp-tiles' },
      tile(model.packages, 'packages found'),
      tile(model.unchecked, 'could not be checked', { tone: model.unchecked ? 'muted' : '' }),
      tile(model.vulnerabilities, 'known vulnerabilities', { tone: model.vulnerabilities ? 'bad' : 'good', sub: vulnSub }),
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
  try {
    app = await loadApp(appId, { base, fetchImpl });
  } catch (error) {
    console.warn('Dependencies panel: export not reachable', error);
    return null;
  }
  const model = panelModel(app, { storeVersion });
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
