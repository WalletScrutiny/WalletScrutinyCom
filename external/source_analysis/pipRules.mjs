// Direct or transitive for pip rows, from a repository's rules file (issue 1027).
// A pip file says so only in pip-compile's "# via" lines (plugins/pinning.mjs
// viaOf); every other pip row is unknown until a person proves otherwise in the
// rules file (products.mjs):
//
//   direct_files   files typed by hand that list only what the app asks for:
//                  every row in them is direct.
//   pinned_pairs   a folder of hand-written files and the folder a script
//                  writes their pinned versions to, under the same file name
//                  (Electrum's freeze_packages.sh). In the pinned file, a
//                  package its source file names is direct, any other is
//                  transitive. The source file's own rows (ranges such as
//                  `tomli<=2.0.2`) are then not counted apart: their package is
//                  the pinned row. Safeguards: the script must be one a person
//                  reviewed (its sha256), and every package of the source file
//                  must be pinned inside its range, or both files stay unknown.
//
// Runs on the host, before the rows are stored and checked for advisories.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { foldName } from './packageKey.mjs';

/* ------------------------------ PEP 440 ------------------------------ */

// 1!2.0.3rc1.post2.dev3+local: epoch, release, pre, post, dev. Local versions
// are ignored, as pip does when comparing against a range without one.
const VERSION = /^v?(?:(\d+)!)?(\d+(?:\.\d+)*)(?:[-_.]?(a|alpha|b|beta|c|rc|pre|preview)[-_.]?(\d*))?(?:(?:-(\d+))|(?:[-_.]?(post|rev|r)[-_.]?(\d*)))?(?:[-_.]?dev[-_.]?(\d*))?(?:\+[a-z0-9.]+)?$/i;
const PRE_KIND = { a: 0, alpha: 0, b: 1, beta: 1, c: 2, rc: 2, pre: 2, preview: 2 };

export function parseVersion(text) {
  const m = VERSION.exec(String(text).trim());
  if (!m) return null;
  return {
    epoch: Number(m[1] || 0),
    release: m[2].split('.').map(Number),
    pre: m[3] ? [PRE_KIND[m[3].toLowerCase()], Number(m[4] || 0)] : null,
    post: m[5] !== undefined ? Number(m[5]) : m[6] ? Number(m[7] || 0) : null,
    dev: m[8] !== undefined ? Number(m[8] || 0) : null,
  };
}

const compareReleases = (x, y) => {
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return d;
  }
  return 0;
};

// PEP 440 order: 1.0.dev0 < 1.0a1 < 1.0 < 1.0.post1.
export function compareVersions(x, y) {
  if (x.epoch !== y.epoch) return x.epoch - y.epoch;
  const r = compareReleases(x.release, y.release);
  if (r) return r;
  // a dev release without pre or post comes before every pre-release
  const preKey = v => (v.pre ? v.pre : v.post === null && v.dev !== null ? [-1, 0] : [Infinity, 0]);
  const [px, py] = [preKey(x), preKey(y)];
  if (px[0] !== py[0]) return px[0] < py[0] ? -1 : 1;
  if (px[1] !== py[1]) return px[1] - py[1];
  const post = v => (v.post === null ? -1 : v.post);
  if (post(x) !== post(y)) return post(x) - post(y);
  const dev = v => (v.dev === null ? Infinity : v.dev);
  return dev(x) === dev(y) ? 0 : dev(x) < dev(y) ? -1 : 1;
}

// Whether a pinned version is inside a requirement's range (">=3.4,<4",
// "!=6.6.3", "~=2.1", "==1.*", or "" for any). Anything this cannot read
// answers false, so a range it does not understand keeps the rows unknown.
export function satisfies(version, range) {
  const v = parseVersion(version);
  if (!v) return false;
  const clauses = String(range || '').split(',').map(c => c.trim()).filter(Boolean);
  return clauses.every(clause => {
    const m = /^(===|==|!=|~=|>=|<=|>|<)\s*(\S+)$/.exec(clause);
    if (!m) return false;
    const [, op, target] = m;
    if (op === '===') return String(version).trim() === target;
    if ((op === '==' || op === '!=') && target.endsWith('.*')) {
      const prefix = parseVersion(target.slice(0, -2));
      if (!prefix) return false;
      const same = v.epoch === prefix.epoch && prefix.release.every((n, i) => (v.release[i] ?? 0) === n);
      return op === '==' ? same : !same;
    }
    const t = parseVersion(target);
    if (!t) return false;
    const c = compareVersions(v, t);
    switch (op) {
      case '==': return c === 0;
      case '!=': return c !== 0;
      case '>=': return c >= 0;
      case '<=': return c <= 0;
      // >1.7 does not take 1.7.post1, <1.7 does not take 1.7rc1 (PEP 440)
      case '>': return c > 0 && !(t.post === null && v.post !== null && compareReleases(v.release, t.release) === 0);
      case '<': return c < 0 && !(t.pre === null && v.pre !== null && compareReleases(v.release, t.release) === 0);
      case '~=': {
        if (t.release.length < 2) return false;
        const upper = { epoch: t.epoch, release: [...t.release.slice(0, -2), t.release.at(-2) + 1], pre: null, post: null, dev: 0 };
        return c >= 0 && compareVersions(v, upper) < 0;
      }
      default: return false;
    }
  });
}

/* ------------------------------- rules ------------------------------- */

const fileSha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

// The analyses (plugins/pinning.mjs), with the pip rows' `direct` set from the
// rules, the source rows of a trusted pair taken out, and a note for each pair
// left unknown. `rules` is products.mjs pipRulesOfRepository's answer; the
// checkout is read only for the pairing script's hash.
export function applyPipRules(analyses, rules, repoPath) {
  const pip = analyses?.find(a => a.ecosystem === 'pip');
  if (!pip || !rules) return analyses;
  const dropped = new Set();
  for (const pair of rules.pinnedPairs) applyPinnedPair(pip, pair, repoPath, dropped);
  for (const rule of rules.directFiles) {
    for (const e of pip.entries) if (!dropped.has(e) && rule.patterns.some(re => re.test(e.lockfile))) e.direct = true;
  }
  if (dropped.size) pip.entries = pip.entries.filter(e => !dropped.has(e));
  return analyses;
}

function applyPinnedPair(pip, pair, repoPath, dropped) {
  const inFolder = (lockfile, folder) => lockfile.startsWith(folder) && !lockfile.slice(folder.length).includes('/');
  const sourceFiles = [...new Set(pip.entries.map(e => e.lockfile).filter(f => inFolder(f, pair.source)))];
  if (!sourceFiles.length) return;
  let hash = null;
  try { hash = fileSha256(path.join(repoPath, pair.script)); } catch { /* no script: not trusted */ }
  if (!pair.scriptSha256.has(hash)) {
    pip.resolutionNotes.push(`${pair.script} is ${hash ? 'not the reviewed version' : 'missing'}: direct and transitive in ${pair.pinned} stay unknown`);
    return;
  }
  const always = new Set(pair.alwaysDirect.map(n => foldName('pip', n)));
  for (const source of sourceFiles) {
    const pinnedFile = pair.pinned + source.slice(pair.source.length);
    const sourceRows = pip.entries.filter(e => e.lockfile === source);
    const pinnedRows = pip.entries.filter(e => e.lockfile === pinnedFile);
    if (!pinnedRows.length) continue; // no pinned partner (requirements-ci.txt): its rows stay unknown
    const pinnedByName = new Map();
    for (const e of pinnedRows) {
      const name = foldName('pip', e.name);
      if (!pinnedByName.has(name)) pinnedByName.set(name, []);
      pinnedByName.get(name).push(e);
    }
    const outside = sourceRows.filter(s => !(pinnedByName.get(foldName('pip', s.name)) || []).some(p => satisfies(p.version, s.version)));
    if (outside.length) {
      const names = outside.slice(0, 3).map(s => `${s.name}${s.version}`).join(', ') + (outside.length > 3 ? ` and ${outside.length - 3} more` : '');
      pip.resolutionNotes.push(`${pinnedFile} does not pin ${names} from ${source} inside its range: direct and transitive in both stay unknown`);
      continue;
    }
    const asked = new Set(sourceRows.map(s => foldName('pip', s.name)));
    for (const e of pinnedRows) {
      const name = foldName('pip', e.name);
      e.direct = asked.has(name) || always.has(name);
    }
    // The source row is the same package as its pinned row, which now carries its "direct".
    for (const s of sourceRows) dropped.add(s);
  }
}
