// "Known vulnerabilities" step of a wallet page (issue 1022): the advisories
// filed against the wallet itself, not its dependencies, for the version the
// review covers and, below, the ones that affect other versions. Painted from
// the source analysis export (own-vulnerabilities-model.mjs); the step stays
// hidden while the export has no lookup for the wallet. Not part of the verdict.
import { el } from './html-utils.mjs';
import { wsIcon } from './icon.mjs';
import { loadApp, EXPORT_BASE } from './dependencies-panel.mjs';
import { ownVulnerabilitiesModel } from './own-vulnerabilities-model.mjs';
import { advisoryTable } from './own-vulnerabilities-view.mjs';

// The step's content for a model; exported for tests.
export function ownVulnerabilitiesElement(model) {
  const { version, hits, others } = model;
  const head = hits.length
    ? el('p', { className: 'ov-lead ov-lead--bad' }, el('span', { html: wsIcon('triangle-exclamation') }),
      ` ${hits.length} published ${hits.length === 1 ? 'vulnerability affects' : 'vulnerabilities affect'} ${version}, the version reviewed here.`)
    : el('p', { className: 'ov-lead ov-lead--ok' }, el('span', { html: wsIcon('circle-check') }),
      version ? ` None known for ${version}, the version reviewed here.` : ' No version to check.');
  const other = others.length
    ? el('details', { className: 'ov-others', open: !hits.length || undefined },
      el('summary', {}, `${others.length} more in other versions of the wallet`),
      advisoryTable(others))
    : null;
  return el('div', { className: 'ov-box' + (hits.length ? ' ov-box--bad' : '') },
    head,
    hits.length ? advisoryTable(hits) : null,
    other,
    el('p', { className: 'ov-source' },
      'Advisories filed against the wallet\'s own code, from OSV.dev by its repository. ',
      'Advisories OSV.dev does not map to the repository are not shown. Not part of the verdict.'),
  );
}

export async function renderOwnVulnerabilities({ host, appId, version = null, base = EXPORT_BASE, fetchImpl = globalThis.fetch }) {
  if (!host || !appId) return null;
  let model = null;
  try {
    model = ownVulnerabilitiesModel(await loadApp(appId, { base, fetchImpl }), version);
  } catch (error) {
    console.warn('Known vulnerabilities: export not reachable', error);
    return null;
  }
  if (!model) return null;
  host.replaceChildren(ownVulnerabilitiesElement(model));
  host.hidden = false;
  const step = host.closest('.own-vulnerabilities-step');
  if (step) step.hidden = false;
  return model;
}

if (typeof window !== 'undefined') {
  window.renderOwnVulnerabilities = renderOwnVulnerabilities;
}
