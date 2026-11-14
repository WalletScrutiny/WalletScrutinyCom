// The Dependencies panel's advisory table: severity, where a package is
// used, the statements on each row and who signed them (dependencies-panel.mjs).

import * as nip19 from 'nostr-tools/nip19';
import { el } from './html-utils.mjs';
import { whereOf, whereLabel, WHERE_UNKNOWN_TIP, SEVERITY_ORDER, SEVERITY_LABEL } from './dependencies-panel-model.mjs';
import { TRIAGE_LABEL, JUSTIFICATION_LABEL, triageStateOf } from './dependency-triage.mjs';
import { epssTrigger, tipTrigger } from './dependencies-epss-tip.mjs';

export const OSV_URL = 'https://osv.dev/vulnerability/';

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
// by. A direct build row is a "build tool of the wallet", not imported by it.
// Nothing when the files do not record the graph.
const VIA_SHOWN = 3;
export function viaLine(a) {
  const parts = [];
  let title = null;
  if (a.direct) parts.push(whereOf(a) === 'build' ? 'build tool of the wallet' : 'imported by the wallet');
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
function advisoryRow(a, { mixedEcosystems = false, onJudge = null, freshId = null, defaultBranch = null, showWhere = true } = {}) {
  const where = whereOf(a);
  const fresh = Boolean(freshId) && statementsOf(a).some(s => s.id === freshId);
  return el('tr', { className: fresh ? 'dp-row--fresh' : null, dataset: { advisory: a.id, package: a.package } },
    el('td', { className: 'dp-td-package', dataset: { label: 'Package' } }, ...breakableName(a.package), mixedEcosystems && a.ecosystem ? el('span', { className: 'dp-eco' }, a.ecosystem) : null, repoLine(a), viaLine(a)),
    el('td', { className: 'dp-td-version', dataset: { label: 'Version' } }, a.version, fixedInMasterLine(a, defaultBranch)),
    el('td', { className: 'dp-td-advisory', dataset: { label: 'Advisory' } }, el('a', { href: `${OSV_URL}${encodeURIComponent(a.id)}`, target: '_blank', rel: 'noopener noreferrer', title: a.summary || '' }, a.id)),
    el('td', { className: 'dp-td-severity', dataset: { label: 'Severity' } }, severityCell(a)),
    showWhere ? el('td', { className: 'dp-td-where', dataset: { label: 'Where?' } }, el('span', { className: `dp-where dp-where--${where}`, title: where === 'unknown' ? WHERE_UNKNOWN_TIP : null }, whereLabel(a)), inApkLine(a)) : null,
    el('td', { className: 'dp-td-products', dataset: { label: 'Used by' } }, usedBy(a)),
    el('td', { className: 'dp-td-decision', dataset: { label: 'Decision' } }, decisionCell(a, { onJudge, freshId })),
  );
}

// Under the version: the advisory no longer matches the default branch's
// latest analysis, because the package is gone there or only at other versions.
export function fixedInMasterLine(a, defaultBranch = null) {
  const x = a.inDefaultBranch;
  if (!x || !['removed', 'updated'].includes(x.status)) return null;
  const at = defaultBranch?.commit ? ` at ${defaultBranch.commit.slice(0, 7)}${defaultBranch.analysedAt ? `, checked ${String(defaultBranch.analysedAt).slice(0, 10)}` : ''}` : '';
  const how = x.status === 'removed'
    ? `the package is not in any file read there`
    : `the package is there only at ${x.versions?.length ? x.versions.join(', ') : 'other versions'}, which this advisory does not list`;
  return el('div', { className: 'dp-master', title: `Already fixed in master (the default branch${at}): ${how}. Not in a release yet, unless a newer version here shows it gone.` }, 'Already fixed in master');
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
  return [...(a.decision?.basis || []), ...(a.triage?.partial || []), ...(a.triage?.stale || []), ...(a.triage?.others || [])].map(b => b.statement);
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
    el('img', { className: 'dp-signer__pic', referrerpolicy: 'no-referrer', src: AVATAR_PLACEHOLDER, alt: '', width: 16, height: 16, loading: 'lazy' }),
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
    const name = profileName(p);
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

// The name a kind-0 profile gives, or '' without one: the same for the
// rows, the trusted line and the statement form.
export function profileName(p) {
  return p ? String(p.name || p.displayName || p.display_name || '').trim() : '';
}

export async function defaultProfiles(pubkeys) {
  if (typeof indexedDB === 'undefined') return new Map();
  const { getNostrProfiles } = await import('./nostr-profile.mjs');
  return getNostrProfiles(pubkeys);
}

// Whose statements settle rows on this site (the trusted list), each linked
// to their profile, so a reader can see who answers for the decisions.
export function trustedLine(trusted) {
  if (!trusted?.length) return null;
  const links = [];
  trusted.forEach((pk, i) => { if (i) links.push(', '); links.push(signerLink(pk)); });
  return el('p', { className: 'dp-trusted' }, 'Decisions here count only from: ', ...links, '. Statements by anyone else are listed under "What others say".');
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

// "previously not affected in v3.35.0 (bn.js 5.2.2, now 5.2.1)": a decision
// judged on other versions than this row's (dependency-triage.mjs,
// versionChanges), shown on the reopened row so re-checking starts from it.
export function staleLabel({ statement: s, release, changes }) {
  const which = changes.find(c => c.what === 'which');
  const what = changes.filter(c => c.what !== 'release' && c.what !== 'which').map(c => `${c.what} ${c.was}, now ${c.now}`);
  const why = which ? ` (it shipped ${which.package} ${which.was} and the statement does not say which it judged, check again)`
    : what.length ? ` (${what.join('; ')})` : ' (versions not recorded there, check again)';
  return `previously ${TRIAGE_LABEL[s.status]}${release ? ` in ${release}` : ''}${why}`;
}

// The row's state from the statements of its direct users, each with its
// reason; "Not assessed" while one is still missing, saying how many are in.
// A row whose decision was made on other versions is open again, with the old one under it;
// a row another statement settles still shows it.
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
    for (const x of t.stale || []) bits.push(statementLine({ need: null, statement: x.statement, label: staleLabel(x) }, { freshId, onEdit }));
  } else {
    bits.push(el('span', { className: `dp-decision dp-decision--${state}` }, TRIAGE_LABEL[state]));
    for (const b of d.basis) bits.push(statementLine(b, { freshId, onEdit }));
    for (const x of t.stale || []) bits.push(statementLine({ need: null, statement: x.statement, label: staleLabel(x) }, { freshId, onEdit }));
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
  'Cleared means a reviewer we trust checked the report and signed that it does not affect this app, or that the app already has the fix.',
  'Most reports are not cleared only because nobody has checked them yet. That alone does not mean the app has a problem.',
];

function clearedTip() {
  return CLEARED_TIP_LINES.map(line => el('p', {}, line));
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

// What each column means, opened from its header. Where? bolds its own labels.
const bold = (text) => el('strong', {}, text);
const HEADER_TIPS = {
  Advisory: () => [el('p', {}, 'A published security warning for this library version. Source: OSV.dev, which gathers GitHub, PyPI, RustSec and others.')],
  Severity: () => [el('p', {}, 'How bad the flaw is if exploited. GitHub\'s reviewed rating, or else the CVSS score. Below it: whether CISA has seen it exploited, the chance of an attack within 30 days (EPSS), and when it became public.')],
  'Where?': () => [el('p', {},
    'Where this library ends up: ', bold('app'), ' (inside the wallet), ', bold('build'), ' (build tools only), ', bold('tests'),
    ' (test tools only), or another part of the repository, like the ', bold('server'), '. ', bold('Unknown'),
    ': the project\'s files don\'t say. The line below says whether the released APK contains it.')],
  Decision: () => [el('p', {}, 'Is this wallet affected? Answered by signed statements: affected, not affected, fixed or investigating. Anyone can add one; only reviewers WalletScrutiny trusts settle the row. \'Not assessed\' means none has yet.')],
};

// The worst rows, or every row with `showAll` (after a publish, so the judged
// row stays in sight wherever it re-sorts to). "Where?" is left out when no
// row has an answer for it (a Python wallet's requirements.txt says nothing).
// `onRowsAdded(tbody)` hears the rows "Show all" adds, so their signers get
// named like the first ones.
export function advisoryTable(model, { onJudge = null, freshId = null, showAll = false, onRowsAdded = null } = {}) {
  if (!model.advisories.length) return null;
  const shown = showAll ? model.advisories : model.worst;
  const rest = model.advisories.slice(shown.length);
  const showWhere = !allWhereUnknown(model);
  const rowOptions = { mixedEcosystems: model.ecosystems.length > 1, onJudge, freshId, defaultBranch: model.defaultBranch, showWhere };
  const body = el('tbody', {}, shown.map(a => advisoryRow(a, rowOptions)));
  const table = el('table', { className: 'dp-table' },
    el('thead', {}, el('tr', {},
      ['Package', 'Version', 'Advisory', 'Severity', showWhere ? 'Where?' : null, 'Used by', 'Decision'].filter(Boolean)
        .map(h => el('th', {}, HEADER_TIPS[h] ? tipTrigger(h, HEADER_TIPS[h], { className: 'dp-term dp-th-term' }) : h)),
    )),
    body,
  );
  const wrap = el('div', { className: 'dp-table-wrap' }, table);
  if (rest.length) {
    const more = el('button', { type: 'button', className: 'btn-small dp-more' }, `Show all ${model.advisories.length} advisories`);
    more.addEventListener('click', () => {
      for (const a of rest) body.appendChild(advisoryRow(a, rowOptions));
      more.remove();
      onRowsAdded?.(body);
    });
    wrap.appendChild(more);
  }
  return wrap;
}

// No advisory row says where its package ends up. The released-APK line
// also lives in that column, so a row with one keeps the column.
export function allWhereUnknown(model) {
  return model.advisories?.length > 0 && model.advisories.every(a => whereOf(a) === 'unknown' && !inApkLine(a));
}
