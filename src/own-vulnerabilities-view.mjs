// The tables of the wallet's own advisories (issue 1022), shared by the
// "Known vulnerabilities" step (own-vulnerabilities.mjs) and the Dependencies
// panel (dependencies-panel.mjs), which imports this and not the step so the
// two modules do not import each other.
import { el } from './html-utils.mjs';
import { SEVERITY_LABEL } from './dependencies-panel-model.mjs';
import { fixedText, cveOf } from './own-vulnerabilities-model.mjs';

const OSV_URL = 'https://osv.dev/vulnerability/';

export function advisoryTable(rows) {
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

// The "This wallet" box of the Dependencies panel (src/dependencies-panel.mjs)
// for the release shown there: the advisories filed against the wallet itself
// that affect it, kept apart from the dependency advisories and not counted in
// them. Null when the export has no lookup or none affects the release.
export function ownAdvisoriesBox(own, wallet) {
  if (!own?.hits?.length) return null;
  const n = own.hits.length;
  return el('div', { className: 'ov-panel-box' },
    el('div', { className: 'ov-panel-box__head' },
      el('b', {}, `${wallet}'s own code: ${n} known ${n === 1 ? 'vulnerability' : 'vulnerabilities'} in ${own.version}`),
      el('span', { className: 'ov-panel-box__tag' }, 'This wallet')),
    advisoryTable(own.hits),
    el('p', { className: 'ov-source' },
      `Filed against ${wallet} itself, not a library it uses, so not counted in the advisory matches below.`),
  );
}

