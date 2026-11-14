// The Dependencies panel's git submodules section (dependencies-panel.mjs).

import { el } from './html-utils.mjs';
import { safeName } from './dependencies-panel-model.mjs';
import { evidenceUrl } from './dependency-triage.mjs';
import { fetchJson } from './dependencies-data.mjs';
import { plural } from './dependencies-tiles.mjs';
import { OSV_URL } from './dependencies-advisories.mjs';

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

// The submodule's name, linked to its repository. The URL is whatever the
// wallet's .gitmodules says, so only an http(s) one becomes a link.
function submoduleNameCell(r) {
  const name = r.path.split('/').pop();
  const href = evidenceUrl(String(r.url || '').replace(/\.git$/, ''));
  return href ? el('a', { href, target: '_blank', rel: 'noopener noreferrer', title: r.path }, name) : el('span', { title: r.path }, name);
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
export function submodulesSection(model, { appId, base, fetchImpl }) {
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
            el('td', {}, submoduleNameCell(r),
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
