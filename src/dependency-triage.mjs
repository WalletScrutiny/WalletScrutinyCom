// Dependency triage: our decision, per wallet and advisory, whether an
// advisory the source analysis lists affects the product. The decisions live
// in _data/dependencyTriage/<appId>.yml in this repository and are reviewed
// like any verdict change; scripts/build-dependency-triage.mjs validates them
// with `parseTriage` and publishes them next to the export, where the
// Dependencies panel reads them. The states and their meaning follow VEX
// (Vulnerability Exploitability eXchange, OpenVEX); "Where?" informs a
// decision but never makes one. See docs/dependency-check.md, "Triage".

export const TRIAGE_STATUSES = ['affected', 'not_affected', 'fixed', 'under_investigation'];

export const TRIAGE_LABEL = {
  affected: 'affected',
  not_affected: 'not affected',
  fixed: 'fixed',
  under_investigation: 'investigating',
};

// Sort weight within one severity: what still needs attention comes first,
// what has been looked at and dismissed sinks.
export const TRIAGE_ORDER = { affected: 0, undecided: 1, under_investigation: 2, not_affected: 3, fixed: 4 };

// OSV-style identifiers: GHSA-xxxx-xxxx-xxxx, CVE-2023-45133, MAL-2026-1, RUSTSEC-2024-0001, PYSEC-...
const ADVISORY_ID_RE = /^[A-Z][A-Z0-9]*-[A-Za-z0-9][A-Za-z0-9.-]*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function text(v) {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Validate one wallet's triage document (the parsed YAML). Returns
 * `{ decisions: [...] }` with normalised entries, or throws an Error whose
 * message lists every problem, so a build fails loudly on a typo in a status.
 */
export function parseTriage(doc, { source = 'triage' } = {}) {
  const problems = [];
  const decisions = [];
  const seen = new Map();
  const list = doc?.decisions;
  if (doc == null || list == null && typeof doc === 'object' && !Array.isArray(doc)) {
    // An empty file, or one without the list, is a valid "nothing decided yet".
  } else if (typeof doc !== 'object' || Array.isArray(doc)) {
    problems.push('the document must be a mapping with a "decisions" list');
  } else if (!Array.isArray(list)) {
    problems.push('"decisions" must be a list');
  } else {
    list.forEach((d, i) => {
      const at = `decisions[${i}]`;
      if (d == null || typeof d !== 'object' || Array.isArray(d)) {
        problems.push(`${at}: must be a mapping`);
        return;
      }
      const advisory = text(d.advisory);
      const status = text(d.status);
      const justification = text(d.justification);
      if (!advisory) problems.push(`${at}: "advisory" is required`);
      else if (!ADVISORY_ID_RE.test(advisory)) problems.push(`${at}: "${advisory}" is not an advisory id (GHSA-…, CVE-…, MAL-…)`);
      if (!status) problems.push(`${at} (${advisory || '?'}): "status" is required, one of ${TRIAGE_STATUSES.join(', ')}`);
      else if (!TRIAGE_STATUSES.includes(status)) problems.push(`${at} (${advisory || '?'}): status "${status}" is not one of ${TRIAGE_STATUSES.join(', ')}`);
      if (!justification) problems.push(`${at} (${advisory || '?'}): "justification" is required, one sentence on why`);
      if (d.date != null && !DATE_RE.test(String(d.date instanceof Date ? d.date.toISOString().slice(0, 10) : d.date))) problems.push(`${at} (${advisory || '?'}): "date" must be YYYY-MM-DD`);
      if (advisory) {
        if (seen.has(advisory)) problems.push(`${at}: ${advisory} already decided in decisions[${seen.get(advisory)}]`);
        seen.set(advisory, i);
      }
      const entry = { advisory, status, justification };
      if (text(d.package)) entry.package = text(d.package);
      if (d.date != null) entry.date = d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date);
      if (text(d.by)) entry.by = text(d.by);
      if (d.developer != null) {
        // What the wallet's developer says (from their OpenVEX or a reply), shown next to our call, never instead of it.
        const dev = d.developer;
        const devStatus = text(dev?.status);
        if (!devStatus || !TRIAGE_STATUSES.includes(devStatus)) problems.push(`${at} (${advisory || '?'}): developer.status must be one of ${TRIAGE_STATUSES.join(', ')}`);
        entry.developer = { status: devStatus };
        if (text(dev?.justification)) entry.developer.justification = text(dev.justification);
        if (text(dev?.url)) entry.developer.url = text(dev.url);
      }
      decisions.push(entry);
    });
  }
  if (problems.length) {
    throw new Error(`${source}: ${problems.length === 1 ? problems[0] : `\n  - ${problems.join('\n  - ')}`}`);
  }
  return { decisions };
}

// Decisions by advisory id, for lookup by id or alias (a decision recorded
// under the CVE applies to the GHSA that aliases it, and the other way round).
export function decisionIndex(triage) {
  const index = new Map();
  for (const d of triage?.decisions || []) index.set(d.advisory, d);
  return index;
}

export function decisionFor(advisory, index) {
  if (!index || !index.size || !advisory) return null;
  if (index.has(advisory.id)) return index.get(advisory.id);
  for (const alias of advisory.aliases || []) {
    if (index.has(alias)) return index.get(alias);
  }
  return null;
}

/**
 * Attach `decision` (or null) to every advisory and count the states.
 * Returns `{ advisories, summary }`; summary.undecided is the work queue.
 */
export function applyTriage(advisories = [], triage = null) {
  const index = decisionIndex(triage);
  const summary = { total: advisories.length, decided: 0, undecided: 0, affected: 0, not_affected: 0, fixed: 0, under_investigation: 0 };
  const out = advisories.map((a) => {
    const decision = decisionFor(a, index);
    if (decision) {
      summary.decided += 1;
      summary[decision.status] += 1;
    } else {
      summary.undecided += 1;
    }
    return { ...a, decision };
  });
  return { advisories: out, summary };
}

export function triageStateOf(advisory) {
  return advisory?.decision?.status || 'undecided';
}
