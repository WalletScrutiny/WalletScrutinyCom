// Dependency triage: statements on Nostr, keyed by (direct user, advisory),
// saying whether an advisory on a package affects whoever uses it that way.
//
// Whether a flaw in blib matters is a property of how its direct user alib
// calls it, and that is the same in every wallet that ships alib (Leo,
// 2026-10-16). So a statement names the advisory and the direct user:
//
//   via:  "npm:alib"          alib's use of the package, holds for every
//                             wallet in which the package is reached via alib
//   app:  "it.airgap.vault"   this wallet's own, direct use of the package
//   (neither)                 the package itself, whoever uses it: the flaw
//                             needs a role nobody has in a wallet, say
//
// The analyser records each package's `dependants` (who requires it, one hop
// up) and `direct` (the wallet itself does). A wallet's row is settled when
// every one of its direct users has a statement: all not affected means not
// affected, one affected means affected, one missing means still open. The
// wallet's own `app` statement settles the row outright.
//
// Statements are addressable Nostr events (dependencyTriageKind), one per
// author and subject, signed by whoever makes them: WalletScrutiny, the
// direct user's maintainer, the wallet's developer, anyone. The site build
// (scripts/build-dependency-triage.mjs) pulls them, keeps the newest per
// (author, subject), and publishes the ones that concern a wallet next to its
// export, with the list of trusted authors; only trusted authors' statements
// settle a row, the others are counted. The states and the justification
// labels follow VEX (Vulnerability Exploitability eXchange, OpenVEX). "Where?"
// informs a statement but never makes one. See docs/dependency-check.md,
// "Triage".

import { dependencyTriageKind } from './nostr-constants.mjs';

export { dependencyTriageKind };

export const TRIAGE_STATUSES = ['affected', 'not_affected', 'fixed', 'under_investigation'];

export const TRIAGE_LABEL = {
  affected: 'affected',
  not_affected: 'not affected',
  fixed: 'fixed',
  under_investigation: 'investigating',
};

// OpenVEX justification labels for `not_affected` (the status_justification field).
export const TRIAGE_JUSTIFICATIONS = [
  'component_not_present',
  'vulnerable_code_not_present',
  'vulnerable_code_not_in_execute_path',
  'vulnerable_code_cannot_be_controlled_by_adversary',
  'inline_mitigations_already_exist',
];

export const JUSTIFICATION_LABEL = {
  component_not_present: 'component not present',
  vulnerable_code_not_present: 'vulnerable code not present',
  vulnerable_code_not_in_execute_path: 'vulnerable code never executed',
  vulnerable_code_cannot_be_controlled_by_adversary: 'input not attacker-controlled',
  inline_mitigations_already_exist: 'mitigated in place',
};

// Sort weight within one severity: what still needs attention comes first,
// what has been looked at and dismissed sinks.
export const TRIAGE_ORDER = { affected: 0, undecided: 1, under_investigation: 2, not_affected: 3, fixed: 4 };

// When several direct users are judged, the row takes the gravest call.
const WORST_FIRST = ['affected', 'under_investigation', 'fixed', 'not_affected'];

// Where a package ends up: "app" (reachable from the project's own
// dependencies, so bundled), "build" (its development tooling), "tests" (test
// frameworks and what only they pull in), or "unknown" when the files do not
// say. Rows exported before `scope` existed only carry the dev flag.
export const WHERE_LABELS = { app: 'app', build: 'build', tests: 'tests' };
export function whereOf(row) {
  if (row?.scope && WHERE_LABELS[row.scope]) return row.scope;
  if (row?.dev === true) return 'build';
  if (row?.dev === false) return 'app';
  return 'unknown';
}

// OSV-style identifiers: GHSA-xxxx-xxxx-xxxx, CVE-2023-45133, MAL-2026-1, RUSTSEC-2024-0001, PYSEC-...
export const ADVISORY_ID_RE = /^[A-Z][A-Z0-9]*-[A-Za-z0-9][A-Za-z0-9.-]*$/;
// "npm:@babel/core", "gradle:com.google.gms:google-services", "cargo:serde"
const PACKAGE_REF_RE = /^[a-z]+:\S+$/;

const text = (v) => (typeof v === 'string' ? v.trim() : '');

// An evidence link: the issue, pull request or code line a statement rests on. http(s) only.
export function evidenceUrl(v) {
  const t = text(v);
  if (!t) return null;
  try {
    const u = new URL(t);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

/**
 * The `d` tag of a statement: the advisory and the direct user it is about.
 * One of `via` (package reference of the direct user), `app` (wallet id), or
 * neither (the package itself).
 */
export function triageSubject({ vuln, via = null, app = null }) {
  if (via) return `${vuln}|via:${via}`;
  if (app) return `${vuln}|app:${app}`;
  return `${vuln}|package`;
}

/**
 * The unsigned event for a statement, for a NIP-07 signer or a key:
 * `vulns` the advisory id and its aliases (the first is the subject's),
 * `pkg` the package reference ("npm:@babel/traverse"), `via` or `app` the
 * direct user, `status` one of TRIAGE_STATUSES, `justification` an OpenVEX
 * label (optional), `versions` of the direct user the statement holds for
 * (optional, free text), `evidence` a link to the issue, pull request or
 * code line the statement rests on (optional), `content` the reasoning in prose.
 */
export function triageTemplate({ vulns, pkg, via = null, app = null, status, justification = null, versions = null, evidence = null, content = '', created_at = null }) {
  const ids = [...new Set((vulns || []).map(text).filter(Boolean))];
  if (!ids.length) throw new Error('a statement needs at least one advisory id');
  for (const id of ids) if (!ADVISORY_ID_RE.test(id)) throw new Error(`"${id}" is not an advisory id (GHSA-…, CVE-…, MAL-…)`);
  if (!PACKAGE_REF_RE.test(text(pkg))) throw new Error(`"${pkg}" is not a package reference (ecosystem:name)`);
  if (via && app) throw new Error('a statement is about one direct user: via or app, not both');
  if (via && !PACKAGE_REF_RE.test(text(via))) throw new Error(`"${via}" is not a package reference (ecosystem:name)`);
  if (!TRIAGE_STATUSES.includes(status)) throw new Error(`status "${status}" is not one of ${TRIAGE_STATUSES.join(', ')}`);
  if (justification && !TRIAGE_JUSTIFICATIONS.includes(justification)) throw new Error(`justification "${justification}" is not one of ${TRIAGE_JUSTIFICATIONS.join(', ')}`);
  if (text(evidence) && !evidenceUrl(evidence)) throw new Error(`"${evidence}" is not an http(s) link`);
  const tags = [
    ['d', triageSubject({ vuln: ids[0], via: text(via) || null, app: text(app) || null })],
    ...ids.map(id => ['vuln', id]),
    ['package', text(pkg)],
  ];
  if (text(via)) tags.push(['via', text(via)]);
  if (text(app)) tags.push(['app', text(app)]);
  tags.push(['status', status]);
  if (justification) tags.push(['justification', justification]);
  if (text(versions)) tags.push(['versions', text(versions)]);
  if (text(evidence)) tags.push(['evidence', evidenceUrl(evidence)]);
  // The project relay stores only events it recognises as WalletScrutiny traffic (external/configs/strfry/kind-policy.py).
  tags.push(['client', 'WalletScrutiny.com'], ['c', 'walletscrutiny']);
  return {
    kind: dependencyTriageKind,
    created_at: Number.isFinite(created_at) ? created_at : Math.floor(Date.now() / 1000),
    tags,
    content: String(content || ''),
  };
}

const tagValue = (event, name) => event.tags.find(t => Array.isArray(t) && t[0] === name && typeof t[1] === 'string')?.[1] ?? null;
const tagValues = (event, name) => event.tags.filter(t => Array.isArray(t) && t[0] === name && typeof t[1] === 'string').map(t => t[1]);

/**
 * A statement from a (verified) event, or null when the event is not a
 * well-formed statement: wrong kind, no advisory, bad status, both via and app.
 */
export function statementFromEvent(event, { kind = dependencyTriageKind } = {}) {
  if (!event || event.kind !== kind || !Array.isArray(event.tags)) return null;
  const d = tagValue(event, 'd');
  const vulns = [...new Set(tagValues(event, 'vuln').map(text).filter(v => ADVISORY_ID_RE.test(v)))];
  const status = tagValue(event, 'status');
  const via = text(tagValue(event, 'via')) || null;
  const app = text(tagValue(event, 'app')) || null;
  const pkg = text(tagValue(event, 'package')) || null;
  if (!d || !vulns.length || !TRIAGE_STATUSES.includes(status) || (via && app)) return null;
  if (pkg && !PACKAGE_REF_RE.test(pkg)) return null;
  if (via && !PACKAGE_REF_RE.test(via)) return null;
  const justification = tagValue(event, 'justification');
  return {
    id: event.id,
    pubkey: event.pubkey,
    created_at: event.created_at,
    d,
    vulns,
    package: pkg,
    via,
    app,
    status,
    justification: TRIAGE_JUSTIFICATIONS.includes(justification) ? justification : null,
    versions: text(tagValue(event, 'versions')) || null,
    evidence: evidenceUrl(tagValue(event, 'evidence')),
    content: typeof event.content === 'string' ? event.content : '',
  };
}

// Newest statement per (author, subject): an addressable event replaces its
// older versions, and a relay may still hand out both.
export function newestStatements(statements) {
  const byKey = new Map();
  for (const s of statements) {
    if (!s) continue;
    const key = `${s.pubkey}\0${s.d}`;
    const have = byKey.get(key);
    if (!have || s.created_at > have.created_at || (s.created_at === have.created_at && s.id < have.id)) byKey.set(key, s);
  }
  return [...byKey.values()];
}

// Advisory ids a release's rows answer to (ids and aliases).
export function advisoryIdsOf(releases = []) {
  const ids = new Set();
  for (const r of releases) {
    for (const a of r?.advisories || []) {
      if (a?.id) ids.add(a.id);
      for (const alias of a?.aliases || []) ids.add(alias);
    }
  }
  return ids;
}

// Whether a statement is about this advisory row (id or alias, and the
// package when the statement names one).
export function statementConcerns(statement, advisory) {
  const ids = new Set([advisory.id, ...(advisory.aliases || [])]);
  if (!statement.vulns.some(v => ids.has(v))) return false;
  if (statement.package && advisory.package && statement.package !== `${advisory.ecosystem}:${advisory.package}`) return false;
  return true;
}

// Among several trusted authors' statements on one subject, the newest.
function pick(list) {
  return list.reduce((best, s) => (!best || s.created_at > best.created_at ? s : best), null);
}

function worstOf(statuses) {
  return WORST_FIRST.find(s => statuses.includes(s)) || null;
}

/**
 * Resolve one advisory row of one wallet against the statements. Returns
 * `{ decision, needs, covered, community }`:
 *   decision   `{ status, basis: [{ need, statement }] }` or null while open
 *   needs      what has to be judged for this row: `app:<id>` when the wallet
 *              imports the package itself, `via:<pkg>` per direct user, or
 *              `package` when the files do not say who requires it
 *   covered    the needs a trusted statement answers (a subset of needs)
 *   community  statements by authors outside the trusted list (counted, not applied)
 */
export function resolveRow(advisory, statements = [], { appIds = [], trusted = new Set() } = {}) {
  const relevant = statements.filter(s => statementConcerns(s, advisory));
  const trustedOnes = relevant.filter(s => trusted.has(s.pubkey));
  const community = relevant.filter(s => !trusted.has(s.pubkey));
  const ids = new Set(appIds.filter(Boolean));
  const own = pick(trustedOnes.filter(s => s.app && ids.has(s.app)));
  const packageWide = pick(trustedOnes.filter(s => !s.app && !s.via));
  const eco = advisory.ecosystem || 'npm';

  const needs = [];
  if (advisory.direct) needs.push(`app:${appIds[0] || '?'}`);
  const dependants = Array.isArray(advisory.dependants) ? advisory.dependants : null;
  for (const d of dependants || []) needs.push(`via:${eco}:${d}`);
  if (!needs.length) needs.push('package'); // no graph (gradle), or nothing in the files requires it

  if (own) {
    return { decision: { status: own.status, basis: [{ need: `app:${own.app}`, statement: own }] }, needs, covered: needs, community };
  }
  const basis = [];
  const covered = [];
  for (const need of needs) {
    let s = null;
    if (need.startsWith('via:')) s = pick(trustedOnes.filter(t => t.via === need.slice(4))) || packageWide;
    else s = packageWide; // the wallet's own use, or an unknown graph: only a package-wide statement can answer without an `app` one
    if (s) {
      basis.push({ need, statement: s });
      covered.push(need);
    }
  }
  if (covered.length === needs.length) {
    return { decision: { status: worstOf(basis.map(b => b.statement.status)), basis }, needs, covered, community };
  }
  return { decision: null, needs, covered, community, partial: basis };
}

/**
 * Attach `decision` (or null) and `triage` (needs, covered, community) to
 * every advisory and count the states. `triage` is the wallet's published
 * file: `{ trusted: [pubkeys], statements: [...] }`, or null when nobody has
 * said anything yet. summary.undecided is the work queue.
 */
export function applyTriage(advisories = [], triage = null, { appIds = [] } = {}) {
  const statements = newestStatements(triage?.statements || []);
  const trusted = new Set(triage?.trusted || []);
  const summary = { total: advisories.length, decided: 0, undecided: 0, affected: 0, not_affected: 0, fixed: 0, under_investigation: 0, partial: 0, community: 0 };
  const out = advisories.map((a) => {
    const r = resolveRow(a, statements, { appIds, trusted });
    if (r.decision) {
      summary.decided += 1;
      summary[r.decision.status] += 1;
    } else {
      summary.undecided += 1;
      if (r.covered.length) summary.partial += 1;
    }
    if (r.community.length) summary.community += 1;
    return { ...a, decision: r.decision, triage: { needs: r.needs, covered: r.covered, community: r.community.length, partial: r.partial || [] } };
  });
  return { advisories: out, summary };
}

/**
 * What a statement about this row can be about, in the order the form offers
 * them: each direct user (`via`), this wallet's own use (`app`, which settles
 * the row outright), and the package itself, whoever uses it. `preferred`
 * marks the one to start from: the single direct user when there is exactly
 * one and the wallet does not import the package itself, else the wallet.
 */
export function statementChoices(advisory, { appId } = {}) {
  const eco = advisory?.ecosystem || 'npm';
  const name = advisory?.package || 'the package';
  const dependants = Array.isArray(advisory?.dependants) ? advisory.dependants : [];
  const choices = dependants.map(d => ({
    key: `via:${eco}:${d}`,
    via: `${eco}:${d}`,
    label: `how ${d} uses ${name}`,
    hint: `holds for every wallet in which ${name} is only reached via ${d}`,
  }));
  if (appId) {
    choices.push({
      key: `app:${appId}`,
      app: appId,
      label: advisory?.direct ? `this wallet's own use of ${name}` : 'this wallet, however it reaches the package',
      hint: 'settles the row for this wallet only',
    });
  }
  choices.push({ key: 'package', label: `${name} itself, whoever uses it`, hint: 'the flaw needs a role nobody has in a wallet, say; answers for every wallet and every direct user' });
  const preferredKey = dependants.length === 1 && !advisory?.direct ? choices[0].key : (appId ? `app:${appId}` : 'package');
  return choices.map(c => ({ ...c, preferred: c.key === preferredKey }));
}

/**
 * The wallet's triage file with one more statement, as the page sees it right
 * after publishing: newestStatements() lets it replace the author's older one
 * on the same subject. `trusted` fills in the list when the wallet had no file.
 */
export function withStatement(triage, statement, { appId = null, trusted = [] } = {}) {
  return {
    schema: 3,
    appId: triage?.appId || appId,
    trusted: triage?.trusted?.length ? triage.trusted : [...trusted],
    statements: [...(triage?.statements || []), statement],
  };
}

export function triageStateOf(advisory) {
  return advisory?.decision?.status || 'undecided';
}
