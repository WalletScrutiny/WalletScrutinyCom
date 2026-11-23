// "Known vulnerabilities" step of a wallet page (issue 1022): the advisories
// filed against the wallet itself, not its dependencies, for the version the
// review covers and, below, the ones that affect other versions. Painted from
// the source analysis export (own-vulnerabilities-model.mjs); the step stays
// hidden unless an advisory affects the reviewed version, so a clean wallet
// adds nothing to the page. Not part of the verdict.
// Shares the dependencies panel's chunk (source-analysis-export.mjs).
import { el } from './html-utils.mjs';
import { wsIcon } from './icon.mjs';
import { loadApp } from './dependencies-panel.mjs';
import { EXPORT_BASE } from './source-analysis-export.mjs';
import { SEVERITY_LABEL } from './dependencies-panel-model.mjs';
import { ownVulnerabilitiesModel, fixedText, cveOf } from './own-vulnerabilities-model.mjs';

const OSV_URL = 'https://osv.dev/vulnerability/';

function advisoryTable(rows) {
  return el('table', { className: 'ov-table' },
    el('thead', {}, el('tr', {},
      el('th', {}, 'Vulnerability'), el('th', {}, 'Severity'), el('th', {}, 'What it is'),
      el('th', {}, 'Published'), el('th', {}, 'Fixed in'))),
    el('tbody', {}, ...rows.map(a => el('tr', {},
      el('td', {}, el('a', { href: `${OSV_URL}${encodeURIComponent(a.id)}`, target: '_blank', rel: 'noopener' }, cveOf(a))),
      el('td', {}, el('span', { className: `ov-sev ov-sev--${a.severity}` }, SEVERITY_LABEL[a.severity] || a.severity)),
      el('td', {}, a.summary || ''),
      el('td', { className: 'ov-date' }, a.published || ''),
      el('td', {}, fixedText(a)),
    ))));
}

// The step's content for a model with hits; exported for tests.
export function ownVulnerabilitiesElement(model) {
  const { version, hits, others } = model;
  const other = others.length
    ? el('details', { className: 'ov-others' },
      el('summary', {}, `${others.length} more in other versions of the wallet`),
      advisoryTable(others))
    : null;
  return el('div', { className: 'ov-box ov-box--bad' },
    el('p', { className: 'ov-lead ov-lead--bad' }, el('span', { html: wsIcon('triangle-exclamation') }),
      ` ${hits.length} published ${hits.length === 1 ? 'vulnerability affects' : 'vulnerabilities affect'} ${version}, the version reviewed here.`),
    advisoryTable(hits),
    other,
    el('p', { className: 'ov-source' },
      'Advisories filed against the wallet\'s own code, from OSV.dev by its repository. ',
      'Advisories OSV.dev does not map to the repository are not shown. Not part of the verdict.'),
  );
}

// `version` is the page's own; the step is about that or the newest version
// reproduced for the listing (`appId`, `platform`), whichever is greater.
export async function renderOwnVulnerabilities({ host, appId, platform = null, version = null, base = EXPORT_BASE, fetchImpl = globalThis.fetch }) {
  if (!host || !appId) return null;
  let model = null;
  try {
    model = ownVulnerabilitiesModel(await loadApp(appId, { base, fetchImpl }), version, { appId, platform });
  } catch (error) {
    console.warn('Known vulnerabilities: export not reachable', error);
    return null;
  }
  if (!model?.hits.length) return null;
  host.replaceChildren(ownVulnerabilitiesElement(model));
  host.hidden = false;
  const step = host.closest('.own-vulnerabilities-step');
  if (step) step.hidden = false;
  return model;
}
