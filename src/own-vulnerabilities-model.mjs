// Advisories filed against the wallet itself (issue 1022), from the
// `ownAdvisories` of the source analysis export (external/source_analysis/
// ownAdvisories.mjs): every advisory OSV.dev lists for the wallet's
// repository, with the release tags it affects. No DOM here, so the unit
// tests can run it.
import { SEVERITY_ORDER } from './dependencies-panel-model.mjs';

// -1, 0 or 1; numbers compare as numbers (4.10.0 after 4.9.1).
export function compareVersions(a, b) {
  const parts = v => String(v).toLowerCase().match(/\d+|[a-z]+/g) || [];
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] === undefined) return -1;
    if (y[i] === undefined) return 1;
    const [nx, ny] = [/^\d/.test(x[i]), /^\d/.test(y[i])];
    if (nx && ny && Number(x[i]) !== Number(y[i])) return Number(x[i]) < Number(y[i]) ? -1 : 1;
    if (nx !== ny) return nx ? 1 : -1;
    if (!nx && x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  }
  return 0;
}

// Whether the advisory lists this version among the ones it affects. Tags and
// page versions agree with or without a leading v; otherwise exactly, so a page
// at 4.6.0 is not hit by an advisory that lists only the 4.6.0b1 beta.
const plain = v => String(v || '').trim().replace(/^v(?=\d)/i, '').toLowerCase();
export function affectsVersion(advisory, version) {
  const wanted = plain(version);
  if (!wanted) return false;
  return (advisory?.versions || []).some(v => plain(v) === wanted);
}

/**
 * What the page says about one version: `hits` the advisories that affect it,
 * `others` the ones that affect only other versions, both most severe first.
 * Null when the export has no own-advisory lookup for the wallet: that is not
 * "none known".
 */
export function ownVulnerabilitiesModel(app, version) {
  const own = app?.ownAdvisories;
  if (!own || !Array.isArray(own.advisories)) return null;
  const sorted = [...own.advisories].sort((x, y) => SEVERITY_ORDER.indexOf(x.severity) - SEVERITY_ORDER.indexOf(y.severity) || String(x.id).localeCompare(String(y.id)));
  const hits = version ? sorted.filter(a => affectsVersion(a, version)) : [];
  return {
    version: version || null,
    hits,
    others: sorted.filter(a => !hits.includes(a)),
    checkedAt: own.checkedAt || null,
    repository: own.repository || null,
  };
}

// "4.8.3", "4.7.2 or 4.6.4" (one fix per release line), or the last affected
// version when no fix is named.
export function fixedText(advisory) {
  const fixed = [...(advisory?.fixed || [])].sort(compareVersions);
  if (fixed.length) return fixed.join(' or ');
  const last = [...(advisory?.lastAffected || [])].sort(compareVersions);
  return last.length ? `no fix listed; ${last[last.length - 1]} and older affected` : 'no fix listed';
}

// The CVE id where the advisory has one, for the link and the label.
export function cveOf(advisory) {
  return [advisory?.id, ...(advisory?.aliases || [])].find(n => /^CVE-/.test(n || '')) || advisory?.id;
}
