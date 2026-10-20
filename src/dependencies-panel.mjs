// The wallet page's "Dependencies" panel: what the source analysis
// (external/source_analysis) found in the release's lockfiles, drawn from the
// per-app file of its static export. Loaded on demand, one small file per
// wallet; the full dependency list is only fetched for the CSV download.
// Measurement only, not part of the verdict, and labelled so.

import { el } from './html-utils.mjs';
import {
  panelModel, whereOf, whereLabel, safeName, csvOf, SEVERITY_ORDER, SEVERITY_LABEL,
} from './dependencies-panel-model.mjs';
import { TRIAGE_LABEL, JUSTIFICATION_LABEL, triageStateOf, withStatement } from './dependency-triage.mjs';
import { openTriageDialog } from './dependencies-triage-form.mjs';
import { treeElement } from './dependencies-tree.mjs';
import { epssTrigger } from './dependencies-epss-tip.mjs';

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

// The wallet's triage file (scripts/build-dependency-triage.mjs output: the
// statements that concern it, and the trusted authors), or null when nobody
// has said anything about its advisories. Tried for the page's own app id
// first, then the id the analysis is stored under (the alias hop in loadApp).
export async function loadTriage(appIds, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  for (const id of [...new Set(appIds.filter(Boolean))]) {
    const triage = await fetchJson(`${base}/triage/${safeName(id)}.json`, fetchImpl);
    if (triage) return triage;
  }
  return null;
}

// The trusted authors and listed maintainers on their own
// (triage/_trusted.json), `{ trusted, maintainers }`, for a wallet whose file
// does not exist yet: the statement dialog says whether the signer's
// statement will settle rows or be shown as what others say. Fetched once.
const trustedCache = new Map();
export function loadTrusted({ base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  if (!trustedCache.has(base)) {
    trustedCache.set(base, fetchJson(`${base}/triage/_trusted.json`, fetchImpl).then(doc => ({
      trusted: Array.isArray(doc?.trusted) ? doc.trusted : [],
      maintainers: doc?.maintainers && typeof doc.maintainers === 'object' ? doc.maintainers : {},
    }), () => ({ trusted: [], maintainers: {} })));
  }
  return trustedCache.get(base);
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

function tile(value, label, { tone = '', sub = null } = {}) {
  return el('div', { className: `dp-tile${tone ? ` dp-tile--${tone}` : ''}` },
    el('div', { className: 'dp-tile__value' }, value == null ? '–' : String(value)),
    el('div', { className: 'dp-tile__label' }, label),
    [sub].flat().some(Boolean) ? el('div', { className: 'dp-tile__sub' }, sub) : null,
  );
}

// One line per severity, "50 critical · 40 cleared": cleared counts the
// rows settled as fixed or not affected; everything else (undecided, under
// investigation, affected) is still potentially affected.
export function severityTally(model) {
  const cleared = {};
  for (const a of model.advisories || []) {
    const state = triageStateOf(a);
    if (state !== 'not_affected' && state !== 'fixed') continue;
    const sev = SEVERITY_ORDER.includes(a.severity) ? a.severity : 'unknown';
    cleared[sev] = (cleared[sev] || 0) + 1;
  }
  const rows = SEVERITY_ORDER.filter(s => s !== 'malicious' && model.bySeverity[s] > 0).map(s => ({ severity: s, total: model.bySeverity[s], cleared: Math.min(cleared[s] || 0, model.bySeverity[s]) }));
  const worstOpen = rows.find(r => r.total > r.cleared)?.severity || null;
  const lines = rows.map(r => el('div', { className: 'dp-tally' },
    el('span', { className: `dp-tally__count dp-tally__count--${r.severity}` }, `${r.total} ${SEVERITY_LABEL[r.severity].toLowerCase()}`),
    ` · ${r.cleared || 'none'} cleared`));
  return { lines: lines.length ? lines : null, worstOpen };
}

// The ecosystem only appears when the release mixes several (npm next to
// gradle next to pip); a wallet with one ecosystem would repeat it on every row.
function advisoryRow(a, { mixedEcosystems = false, onJudge = null, freshId = null } = {}) {
  const where = whereOf(a);
  const fresh = Boolean(freshId) && statementsOf(a).some(s => s.id === freshId);
  return el('tr', { className: fresh ? 'dp-row--fresh' : null, dataset: { advisory: a.id, package: a.package } },
    el('td', { className: 'dp-td-package' }, ...breakableName(a.package), mixedEcosystems && a.ecosystem ? el('span', { className: 'dp-eco' }, a.ecosystem) : null, repoLine(a), viaLine(a)),
    el('td', {}, a.version),
    el('td', {}, el('a', { href: `${OSV_URL}${encodeURIComponent(a.id)}`, target: '_blank', rel: 'noopener noreferrer', title: a.summary || '' }, a.id)),
    el('td', {}, severityCell(a)),
    el('td', {}, el('span', { className: `dp-where dp-where--${where}` }, whereLabel(a))),
    el('td', { className: 'dp-td-products' }, usedBy(a)),
    el('td', { className: 'dp-td-decision' }, decisionCell(a, { onJudge, freshId })),
  );
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

const shortKey = (pubkey) => `${pubkey.slice(0, 8)}…`;

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
    el('span', { className: 'dp-decision__who' }, ` (${TRIAGE_LABEL[s.status]}, ${shortKey(s.pubkey)})`),
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
  if (s.app) return `community, ${via || 'this wallet'}`;
  return `community, ${via || 'the package'}`;
}

// What others say: statements that concern the row without settling it here,
// made for another wallet, claimed for every wallet by someone not listed as
// the library's maintainer, or signed outside the trusted list. They fold out
// under their count so a reviewer of this wallet can read them and start
// from one ("Adopt" opens the dialog filled from it). The one just published
// from this page starts unfolded.
function othersLine(t, { freshId = null, onEdit = null } = {}) {
  const list = t.others || [];
  const label = `What others say (${list.length})`;
  return el('details', { className: 'dp-decision__others', open: list.some(o => o.statement.id === freshId) },
    el('summary', { title: 'Statements made for other wallets or by authors whose word does not settle this row; shown, not applied' }, label),
    list.map(o => statementLine({ need: null, statement: o.statement, label: otherScopeLabel(o) }, { freshId, onEdit, adopt: o.scope === 'elsewhere' || o.scope === 'unproven' })),
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
  if (t.others?.length) bits.push(othersLine(t, { freshId, onEdit }));
  if (onJudge) {
    const judge = el('button', { type: 'button', className: 'dp-judge', title: 'Publish a signed statement on whether this advisory affects the wallet' }, 'Add statement');
    judge.addEventListener('click', () => onJudge(a));
    bits.push(judge);
  }
  return el('div', { className: 'dp-decision-cell' }, bits);
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
  if (model.unchecked) {
    const why = model.uncheckedBreakdown.map(u => `${u.count} ${u.label}`).join(', ');
    items.push(`${model.unchecked} of the ${model.packages} packages could not be checked for advisories${why ? ` (${why})` : ''}; that is not the same as "no problems".`);
  }
  if (model.status !== 'ok') {
    items.push(`This check ended with status "${model.status}"${model.error ? `: ${model.error}` : ''}.`);
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
    parts.push('Under the severity, "exploited in the wild" means CISA lists the advisory as exploited somewhere, and EPSS is the published probability that it gets exploited anywhere within 30 days; both are about the advisory, not this wallet. ');
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

// The panel element for a model; exported for tests. `onJudge(advisory)`
// puts a Judge button on every row; after a publish, `flash` is the line
// above the table saying so, `freshId` the statement to mark, and every row
// is shown so the judged one stays in sight wherever it re-sorts to.
export function panelElement(model, { appId, wallet = appId, base = EXPORT_BASE, fetchImpl = globalThis.fetch, onJudge = null, flash = null, freshId = null, showAll = false } = {}) {
  const tally = severityTally(model);
  // The number takes the colour of the worst severity still potentially
  // affecting the wallet; once every advisory is cleared it turns green.
  const vulnTone = !model.vulnerabilities ? 'good' : tally.worstOpen ? `sev-${tally.worstOpen}` : 'good';
  return el('div', { className: 'dp-panel' },
    el('div', { className: 'dp-top' },
      headline(model),
      el('span', { className: 'dp-badge' }, 'Measurement only · not part of the verdict'),
    ),
    notices(model),
    flash ? el('p', { className: 'dp-flash', role: 'status' }, flash) : null,
    el('div', { className: 'dp-tiles' },
      tile(model.direct, 'direct dependencies'),
      tile(model.transitive, 'transitive dependencies'),
      tile(model.vulnerabilities, 'known vulnerabilities', { tone: vulnTone, sub: [tally.lines, triageLine(model)] }),
      tile(model.malware, 'known malware', { tone: model.malware ? 'bad' : 'good' }),
    ),
    treeTabs(model, advisoryTable(model, { onJudge, freshId, showAll }), { appId, base, fetchImpl, label: `${wallet} ${model.ref}` }),
    howToRead(model),
    actions(model, { appId, base, fetchImpl }),
  );
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
 * `nostr` overrides the dialog's signer and relays (tests).
 */
export async function renderDependenciesPanel({ host, appId, storeVersion = '', title = '', base = EXPORT_BASE, fetchImpl = globalThis.fetch, nostr = undefined }) {
  if (!host || !appId) return null;
  let app = null;
  let triage = null;
  let signals = null;
  try {
    app = await loadApp(appId, { base, fetchImpl });
    if (app) {
      triage = await loadTriage([appId, app.appId], { base, fetchImpl });
      signals = await loadSignals({ base, fetchImpl });
    }
  } catch (error) {
    console.warn('Dependencies panel: export not reachable', error);
    return null;
  }
  const analysisId = app?.appId || appId;
  let model = null;

  // Repainted after a statement is published, with the statement merged in.
  const paint = (extra = {}) => {
    model = panelModel(app, { storeVersion, triage, signals });
    if (!model) return null;
    host.replaceChildren(panelElement(model, { appId: analysisId, wallet: title || analysisId, base, fetchImpl, onJudge, ...extra }));
    return model;
  };
  async function onJudge(advisory, edit = null) {
    const lists = triage?.trusted?.length ? { trusted: triage.trusted, maintainers: triage.maintainers || {} } : await loadTrusted({ base, fetchImpl });
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
    });
  }

  if (!paint()) {
    host.hidden = true;
    return null;
  }
  host.hidden = false;
  const step = host.closest('.dependencies-step');
  if (step) step.hidden = false;
  return model;
}

if (typeof window !== 'undefined') {
  window.renderDependenciesPanel = renderDependenciesPanel;
}
