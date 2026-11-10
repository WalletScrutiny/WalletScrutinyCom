/**
 * Test 7d: the build's own download list (issue 1000, step 2).
 *
 * A reproducible build verification may carry `build-lock.json` as an output
 * file (`["output-file", "build-lock.json", <sha256>]`, see
 * scripts/rb/README.md for the format): every artifact the verifier's Gradle
 * build downloaded, written by scripts/rb/ws-buildlock.sh. Gradle's own
 * resolution (test 7b) lists what the build files ask for; this file lists
 * what the build really fetched, so modules only it knows get the same
 * known-vulnerability check (test 10) as every other row.
 *
 * The file is fetched by its sha256 from files.nostr.info and read only when
 * the hash matches; a copy that matched is kept next to the database
 * (buildLockDir) and read first next time. Its app, version and platform must be the verification
 * event's: a file of another build is reported and not used, so an old list
 * can neither add nor hide advisories. Nor is a file that does not say which
 * build it is (schema 1, or a field left null): "not tied to a build". An output file named like one
 * (`build-lock (1).json`) is reported as misnamed and never downloaded.
 *
 * Runs on the host: it reads JSON, nothing of the repository runs.
 */
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { DEFAULT_BRANCH_REF } from '../config.mjs';
import { uncheckableReason } from './osv.mjs';

export const BLOSSOM_SERVER = 'https://files.nostr.info';
export const BUILD_LOCK_LOCKFILE = 'build-lock.json';
const REQUEST_TIMEOUT_MS = 30000;
const MAX_BYTES = 64 * 1024 * 1024;
// how many module names a stored difference keeps; the counts stay exact
const LIST_LIMIT = 200;

const sha256Of = (buf) => createHash('sha256').update(buf).digest('hex');

/** Where the hash-checked copies are kept: build-locks/ next to the database. */
export const buildLockDir = (db) => process.env.SOURCE_ANALYSIS_BUILD_LOCK_DIR || path.join(path.dirname(db.name), 'build-locks');

/**
 * The file with this sha256: the kept copy, else files.nostr.info. Returns
 * { text } when the bytes match, { mismatch: actual } when the server sent
 * something else (nothing of it is read or kept), { problem } when asking
 * again will not help and the release must not stay unchecked for it: the
 * server does not have it ('not-found'), refuses it (another 4xx,
 * 'unavailable'), or it is larger than MAX_BYTES ('too-large', not read
 * past the limit). Throws on a network error, 429 or 5xx: the analysis fails
 * and runs again next pass, rather than storing a result without the build's
 * rows.
 */
export async function loadBuildLock(sha256, { dir, fetchImpl = globalThis.fetch, server = BLOSSOM_SERVER } = {}) {
  const kept = path.join(dir, `${sha256}.json`);
  try {
    const buf = fs.readFileSync(kept);
    if (sha256Of(buf) === sha256) return { text: buf.toString('utf8'), source: 'kept' };
  } catch { /* not kept yet */ }
  const response = await fetchImpl(`${server}/${sha256}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (response.status === 404) return { problem: 'not-found' };
  if (response.status >= 400 && response.status < 500 && response.status !== 429) return { problem: 'unavailable', status: response.status };
  if (!response.ok) throw new Error(`build-lock.json ${sha256.slice(0, 12)}: ${server} answered HTTP ${response.status}`);
  const buf = await readCapped(response, MAX_BYTES);
  if (!buf) return { problem: 'too-large' };
  const actual = sha256Of(buf);
  if (actual !== sha256) return { mismatch: actual };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${kept}.tmp`, buf);
  fs.renameSync(`${kept}.tmp`, kept);
  return { text: buf.toString('utf8'), source: 'fetched' };
}

// The body, or null once it is larger than max (read no further).
async function readCapped(response, max) {
  if (Number(response.headers?.get?.('content-length')) > max) return null;
  if (!response.body?.getReader) {
    const buf = Buffer.from(await response.arrayBuffer());
    return buf.length > max ? null : buf;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) { await reader.cancel().catch(() => {}); return null; }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

/**
 * What a file says about itself, or { problem: 'not-a-build-lock' } when it
 * is not one ws-buildlock.sh wrote.
 */
export function parseBuildLock(text) {
  let doc;
  try { doc = JSON.parse(text); } catch { return { problem: 'not-a-build-lock' }; }
  if (!doc || typeof doc !== 'object' || doc.tool !== 'ws-buildlock' || !Array.isArray(doc.artifacts)) return { problem: 'not-a-build-lock' };
  const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  return {
    schema: Number(doc.schema) || null,
    toolVersion: str(doc.version),
    appId: doc.schema >= 2 ? str(doc.appId) : null,
    appVersion: doc.schema >= 2 ? str(doc.appVersion) : null,
    platform: doc.schema >= 2 ? str(doc.platform) : null,
    commit: doc.schema >= 2 ? str(doc.commit) : null,
    generatedAt: str(doc.generatedAt),
    artifacts: doc.artifacts.filter(a => a && typeof a === 'object'),
  };
}

/**
 * Whether a file belongs to the build its event verifies: 'ok', 'another-build'
 * with the fields that differ, or 'not-tied' when the file does not say
 * (schema 1, or a field the script did not pass).
 */
export function matchBuild(file, ref) {
  const fields = [['appId', 'appId'], ['appVersion', 'version'], ['platform', 'platform']];
  if (fields.some(([f]) => file[f] === null)) return { match: 'not-tied' };
  const differ = fields
    .filter(([f, r]) => String(file[f]).toLowerCase() !== String(ref[r] ?? '').trim().toLowerCase())
    .map(([f, r]) => ({ field: f, file: file[f], event: ref[r] ?? null }));
  return differ.length ? { match: 'another-build', differ } : { match: 'ok' };
}

/** group:artifact@version -> the module's artifacts (jar, aar, pom, module), from the gradle entries. */
export function gradleModules(artifacts) {
  const modules = new Map();
  for (const a of artifacts) {
    if (a.ecosystem !== 'gradle' || typeof a.name !== 'string' || !a.name.includes(':') || !a.version) continue;
    const key = `${a.name}@${a.version}`;
    if (!modules.has(key)) modules.set(key, { name: a.name, version: String(a.version), files: [] });
    modules.get(key).files.push({ file: a.file || null, sha256: a.sha256 || null });
  }
  return modules;
}

// The file whose hash a row keeps: the jar or aar, else the first one listed.
function mainFile(files) {
  return files.find(f => /\.(jar|aar)$/.test(f.file || '')) || files[0] || {};
}

/**
 * The rows this build adds and both differences with the gradle rows the
 * checkout gave (pinning + gradle-resolution): modules the build downloaded
 * that no row lists at that version (they become rows), and modules a row
 * lists at an exact version that the build never downloaded. A module the
 * rows already list keeps its row: the build confirms it, it is not counted
 * twice.
 */
export function compareWithResolution(modules, pinning) {
  const rows = (pinning || []).filter(a => a.ecosystem === 'gradle').flatMap(a => a.entries || []);
  const listed = new Set(rows.filter(e => e.ecosystem === 'gradle').map(e => `${e.name}@${e.version}`));
  const added = [];
  for (const [key, m] of modules) {
    if (listed.has(key)) continue;
    const f = mainFile(m.files);
    added.push({
      ecosystem: 'gradle',
      lockfile: BUILD_LOCK_LOCKFILE,
      name: m.name,
      version: m.version,
      resolved: '',
      integrity: f.sha256 ? `sha256:${f.sha256}` : '',
      direct: null,
      // the cache does not say whether a module ships in the app or only runs the build
      dev: null,
      scope: null,
      dependants: null,
      tier: f.sha256 ? 'hash-pinned' : 'version-pinned',
    });
  }
  const notBuilt = [...new Set(rows
    // only rows with an exact version, the ones test 10 can look up
    .filter(e => e.ecosystem === 'gradle' && uncheckableReason(e) === null && !modules.has(`${e.name}@${e.version}`))
    .map(e => `${e.name}@${e.version}`))].sort();
  return { added, builtNotResolved: added.map(r => `${r.name}@${r.version}`).sort(), resolvedNotBuilt: notBuilt };
}

// how many module names the wallet page gets per difference
const READER_LIMIT = 20;

/**
 * What the wallet page shows of a stored result (analyses.build_lock): per
 * file whether it was used and why not, the misnamed names, and both
 * differences with at most READER_LIMIT names each. Null when there is none.
 */
export function buildLockForReaders(stored) {
  if (!stored || !Array.isArray(stored.files)) return null;
  const diff = (d) => (d ? { count: d.count, names: (d.names || []).slice(0, READER_LIMIT) } : { count: 0, names: [] });
  return {
    files: stored.files.map(f => ({
      match: f.match || null, problem: f.problem || null, differ: f.differ || null,
      schema: f.schema ?? null, commit: f.commit || null, modules: f.modules ?? null,
    })),
    misnamed: (stored.misnamed || []).map(m => m.name),
    modules: stored.modules ?? null,
    builtNotResolved: diff(stored.builtNotResolved),
    resolvedNotBuilt: diff(stored.resolvedNotBuilt),
  };
}

const limited = (list) => (list.length > LIST_LIMIT ? list.slice(0, LIST_LIMIT) : list);

/**
 * Read every build-lock.json of a release and fold the usable ones into
 * pinning's result (a new gradle analysis, so test 10 checks its rows).
 * Returns what the analyses row keeps, or null when the release has none.
 */
export async function checkBuildLocks({ locks = [], misnamed = [] }, pinning, opts = {}) {
  if (!locks.length && !misnamed.length) return null;
  console.log('\n--- Test 7d: the build\'s own download list (build-lock.json) ---');
  const files = [];
  const modules = new Map();
  const seen = new Set();
  for (const ref of locks) {
    if (seen.has(`${ref.sha256}\n${ref.eventId}`)) continue;
    seen.add(`${ref.sha256}\n${ref.eventId}`);
    const entry = { sha256: ref.sha256, eventId: ref.eventId, pubkey: ref.pubkey };
    files.push(entry);
    const loaded = await loadBuildLock(ref.sha256, opts);
    if (loaded.problem) {
      entry.problem = loaded.problem;
      console.log(`  ${ref.sha256.slice(0, 12)}: ${loaded.problem}${loaded.status ? ` (HTTP ${loaded.status})` : ''}; not read`);
      continue;
    }
    if (loaded.mismatch) {
      Object.assign(entry, { problem: 'hash-mismatch', actual: loaded.mismatch });
      console.log(`  ${ref.sha256.slice(0, 12)}: files.nostr.info sent a file with sha256 ${loaded.mismatch.slice(0, 12)}; not read`);
      continue;
    }
    const file = parseBuildLock(loaded.text);
    if (file.problem) {
      entry.problem = file.problem;
      console.log(`  ${ref.sha256.slice(0, 12)}: not a file ws-buildlock.sh wrote; not read`);
      continue;
    }
    const { match, differ } = matchBuild(file, ref);
    Object.assign(entry, { schema: file.schema, appId: file.appId, appVersion: file.appVersion, platform: file.platform, commit: file.commit, generatedAt: file.generatedAt, match });
    if (match === 'another-build') {
      entry.differ = differ;
      console.log(`  ${ref.sha256.slice(0, 12)}: belongs to another build (${differ.map(d => `${d.field} ${d.file}, event ${d.event}`).join('; ')}); not used`);
      continue;
    }
    if (match === 'not-tied') {
      console.log(`  ${ref.sha256.slice(0, 12)}: not tied to a build (schema ${file.schema}: no app, version or platform); not used`);
      continue;
    }
    const own = gradleModules(file.artifacts);
    entry.modules = own.size;
    for (const [k, m] of own) {
      if (!modules.has(k)) modules.set(k, { ...m, files: [] });
      modules.get(k).files.push(...m.files);
    }
    console.log(`  ${ref.sha256.slice(0, 12)}: ${own.size} Gradle modules, commit ${file.commit || 'not recorded'}`);
  }
  for (const m of misnamed) console.log(`  misnamed output file "${m.name}": only "${BUILD_LOCK_LOCKFILE}" is read`);

  const used = files.some(f => f.modules !== undefined);
  let diff = { added: [], builtNotResolved: [], resolvedNotBuilt: [] };
  if (used) {
    diff = compareWithResolution(modules, pinning);
    if (diff.added.length && Array.isArray(pinning)) {
      pinning.push({ ecosystem: 'gradle', lockfiles: [BUILD_LOCK_LOCKFILE], resolutionNotes: [], entries: diff.added });
    }
    console.log(`  ${modules.size} modules downloaded, ${diff.builtNotResolved.length} not in the resolved rows (added for the vulnerability check), ` +
      `${diff.resolvedNotBuilt.length} resolved modules never downloaded`);
  }
  return {
    files,
    misnamed: misnamed.map(m => ({ name: m.name, sha256: m.sha256, eventId: m.eventId })),
    modules: used ? modules.size : null,
    builtNotResolved: { count: diff.builtNotResolved.length, names: limited(diff.builtNotResolved) },
    resolvedNotBuilt: { count: diff.resolvedNotBuilt.length, names: limited(diff.resolvedNotBuilt) },
  };
}

/**
 * The build-lock.json files of the verified version this tag is the check
 * of: the version the pass resolved to this tag (verified_refs, which saw
 * every tag of the repository and the platform). Before the pass mapped it
 * (a newest-release analysis runs first), only a tag that is the version
 * itself, or `v` and the version, counts: guessing from this one tag would
 * take `desktop-v2.8.2` for the Android verification of 2.8.2.
 */
export function buildLockRefsForTag(db, appId, tag, { getVerifiedRefs, getReproducibleVersions }) {
  const mapped = getVerifiedRefs(db, appId).get(tag);
  const out = { locks: [], misnamed: [] };
  for (const v of getReproducibleVersions(db).get(appId) || []) {
    if (mapped !== undefined ? v.version !== mapped : ![v.version, `v${v.version}`].includes(tag)) continue;
    out.locks.push(...(v.buildLocks || []));
    out.misnamed.push(...(v.misnamedLocks || []));
  }
  return out;
}

// Test 7d: reads the build-lock.json of a verified release and adds the
// modules only the build downloaded to pinning's rows, before test 10 looks
// them up. Nothing for the default branch, or a release without the file.
export default {
  description: 'Test 7d: the build\'s own download list (build-lock.json)',
  requires: ['pinning'],
  async host({ name, version, db, results }) {
    if (!db || !version || version === DEFAULT_BRANCH_REF) return undefined;
    const { getVerifiedRefs, getReproducibleVersions } = await import('../ddbbUtils.mjs');
    const refs = buildLockRefsForTag(db, name, version, { getVerifiedRefs, getReproducibleVersions });
    const result = await checkBuildLocks(refs, results.pinning, { dir: buildLockDir(db) });
    return result === null ? undefined : result;
  },
};
