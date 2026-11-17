/**
 * Libraries a wallet pins as git submodules (C/C++ mostly: openssl, zlib,
 * bitcoin, secp256k1), checked as three separate claims (Leo, 2026-10-27):
 *
 *   1. RB         the product binary reproduces from this source tree. Keyed
 *                 by the artifact's hash; a statically linked submodule has no
 *                 artifact of its own, so it is covered by the product's claim.
 *   2. identity   this tree *is* upstream code, unmodified:
 *                   upstream-tag     the pinned commit is an upstream release tag
 *                   upstream-commit  an upstream commit between releases
 *                   derived          commits upstream does not have, on top of
 *                                    a release (a fork, a local patch)
 *                   unknown-origin   no upstream release in its history
 *   3. advisories which OSV entries apply. Only when identity holds: OSV indexes
 *                 upstream commits, so the commit of a fork returns nothing,
 *                 and that empty answer must not read as clean. A derived tree
 *                 gets its base release's advisories as "status unknown", each
 *                 with a hint from the advisory's upstream fix commit: in the
 *                 fork's history, its patch already in the tree, or not.
 *                 A hint is a lead, not a verdict: it cannot see a fork-only
 *                 bug or a backdoor. Reading the patch is code review.
 *
 * Nothing is built and nothing from the repositories runs: git fetches
 * commits (no blobs for history, one commit's trees for the listing) and
 * OSV is asked over HTTP.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { lsRemoteTags } from './sourceIdentity.mjs';
import { normaliseRepoUrl } from './sourceRepos.mjs';
import { OSV_API } from './plugins/osv.mjs';

const GIT_TIMEOUT_MS = 10 * 60 * 1000;
const MAX_DEPTH = 6;
const NO_LAZY = { GIT_NO_LAZY_FETCH: '1' };

// ---- pure parts ---------------------------------------------------------

/** `.gitmodules` text -> [{ name, path, url }] */
export function parseGitmodules(text) {
  const out = [];
  let cur = null;
  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith(';')) continue;
    const head = /^\[submodule\s+"(.+)"\]$/.exec(line);
    if (head) { cur = { name: head[1], path: null, url: null }; out.push(cur); continue; }
    if (line.startsWith('[')) { cur = null; continue; }
    const kv = /^(\w+)\s*=\s*(.*)$/.exec(line);
    if (cur && kv && (kv[1] === 'path' || kv[1] === 'url')) cur[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return out.filter(s => s.path && s.url);
}

/** `git ls-tree -r` output -> Map(path -> commit) of the gitlinks (mode 160000). */
export function parseGitlinks(text) {
  const links = new Map();
  for (const line of String(text).split('\n')) {
    const m = /^160000 commit ([0-9a-f]{40})\t(.+)$/.exec(line);
    if (m) links.set(m[2], m[1]);
  }
  return links;
}

/** A relative submodule url (`../lib.git`) resolved against its superproject's url. */
export function resolveSubmoduleUrl(url, parentUrl) {
  if (!/^\.\.?\//.test(url)) return url;
  const base = String(parentUrl).replace(/\/+$/, '').replace(/\.git$/, '');
  const parts = base.split('/');
  for (const seg of url.split('/')) {
    if (seg === '..') parts.pop();
    else if (seg !== '.') parts.push(seg);
  }
  return parts.join('/');
}

/** Same repository? Compared as browsable URLs where we know the host, else as given. */
export const sameRepo = (a, b) => (normaliseRepoUrl(a) || String(a).replace(/\.git$/, '')).toLowerCase()
  === (normaliseRepoUrl(b) || String(b).replace(/\.git$/, '')).toLowerCase();

/**
 * Claim 2 from the git facts:
 *   tagAtCommit  upstream tag pointing at the pinned commit, or null
 *   inUpstream   the commit is reachable from an upstream branch or tag
 *   base         { tag, commit, ahead, sameTree, files } nearest upstream release below it, or null
 */
export function identityStatus({ tagAtCommit, inUpstream, base }) {
  if (tagAtCommit) return { status: 'upstream-tag', tag: tagAtCommit };
  if (inUpstream) return { status: 'upstream-commit', base: base?.tag || null, ahead: base?.ahead ?? null };
  if (!base) return { status: 'unknown-origin' };
  // A fork commit whose tree equals a release is that release, whatever its history says.
  if (base.sameTree) return { status: 'upstream-tag', tag: base.tag, viaTree: true };
  return { status: 'derived', base: base.tag, baseCommit: base.commit, ahead: base.ahead, files: base.files };
}

/**
 * Fix commits an OSV entry names (GIT ranges, "fixed" events): [{ repo, commit }].
 * Any repository counts, not just upstream: a fix often lands in a
 * contributor's fork first, and a commit id names the same change wherever it is.
 */
export function fixCommitsOf(vuln) {
  const out = new Map();
  for (const a of vuln.affected || []) {
    for (const r of a.ranges || []) {
      if (r.type !== 'GIT' || !r.repo) continue;
      for (const e of r.events || []) if (/^[0-9a-f]{40}$/.test(e.fixed || '') && !out.has(e.fixed)) out.set(e.fixed, { repo: r.repo, commit: e.fixed });
    }
  }
  return [...out.values()];
}

const HINT_ORDER = ['fix-in-history', 'fix-patch-present', 'fix-patch-absent', 'cant-tell'];

/**
 * Claim 3. `vulns` are OSV entries for the commit itself (identity holds) or
 * for the base release (derived); `hints` maps an advisory id to the hint of
 * each of its fix commits.
 */
export function advisoryStatus(identity, vulns, hints = new Map()) {
  const ids = (vulns || []).map(v => v.id);
  switch (identity.status) {
    case 'upstream-tag':
    case 'upstream-commit':
      return { status: ids.length ? 'affected' : 'none-listed', applies: ids };
    case 'derived':
      return {
        status: ids.length ? 'unknown' : 'none-listed-for-base',
        base: identity.base,
        unknown: ids.map(id => {
          const hs = hints.get(id) || [];
          // one fix commit found is enough for "likely fixed"; otherwise the weakest signal wins
          const best = hs.length ? HINT_ORDER.find(h => hs.includes(h)) : 'cant-tell';
          return { id, hint: best };
        }),
      };
    default:
      return { status: 'unknown', applies: [] };
  }
}

// ---- build scope --------------------------------------------------------

/** Files that say what gets compiled (CMake, make, qmake, meson, autotools, scons, bazel, gradle, cargo, setup.py, build scripts). */
export const BUILD_FILE = /(^|\/)(CMakeLists\.txt|[^/]*\.cmake|(GNU)?[Mm]akefile[^/]*|[^/]*\.mk|[^/]*\.pr[oi]|meson\.build|configure\.ac|SConstruct|SConscript|BUILD(\.bazel)?|build\.gradle(\.kts)?|Cargo\.toml|setup\.py|[^/]*\.sh)$/;

const TEST_SEGMENT = /^(tests?|testing|fuzz(ing)?|bench(mark)?s?|docs?|examples?)$/i;

// Submodules an upstream pins for its own test suite only, keyed by the upstream's browsable url.
export const TEST_ONLY_SUBMODULES = new Map([
  // openssl-3.x: test/recipes/95-test_external_{pyca,krb5,gost_engine}.t, and wycheproof's test vectors
  ['https://github.com/openssl/openssl', { paths: ['pyca-cryptography', 'krb5', 'gost-engine', 'wycheproof'], why: "openssl's external test suites (test/recipes/95-test_external_*)" }],
]);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Which parts of the child at `childPath` the parent's build files name:
 *   { referenced: false }                     not named at all (a glob or variable may still pull it in)
 *   { referenced: true, whole: true }         the directory itself (add_subdirectory, an include root)
 *   { referenced: true, whole: false, parts } only files under these top-level folders of the child
 */
export function referencedParts(buildTexts, childPath) {
  const re = new RegExp(`(?<![\\w.-])${escapeRe(childPath)}(/[^\\s"'()\`;,]*)?(?![\\w.-])`, 'g');
  let referenced = false, whole = false;
  const parts = new Set();
  for (const text of buildTexts) {
    for (const m of String(text).matchAll(re)) {
      referenced = true;
      const rest = (m[1] || '').replace(/^\/+/, '');
      const first = rest.split('/')[0];
      if (!first || /[$*{]/.test(first)) whole = true;
      else parts.add(first);
    }
  }
  return referenced ? (whole ? { referenced, whole } : { referenced, whole, parts: [...parts].sort() }) : { referenced };
}

/**
 * Is a submodule part of the product? `inherited` is the parent's scope;
 * `parentRefs` what the grandparent's build files use of the parent.
 *   assumed     nothing says otherwise (not proof that it is compiled in)
 *   not-built   the grandparent builds only other folders of the parent
 *   test-only   a test, fuzz, bench, docs or examples folder, or a known test-suite submodule
 */
export function scopeStatus({ path: subPath, parentPath = null, parentUpstream = null, parentRefs = null, inherited = null }) {
  if (inherited && inherited.status !== 'assumed') return { status: inherited.status, why: inherited.why, via: inherited.via || parentPath };
  const rel = parentPath ? subPath.slice(parentPath.length + 1) : subPath;
  const known = parentUpstream && TEST_ONLY_SUBMODULES.get(normaliseRepoUrl(parentUpstream) || parentUpstream);
  if (known && known.paths.includes(rel)) return { status: 'test-only', why: known.why };
  if (rel.split('/').slice(0, -1).some(seg => TEST_SEGMENT.test(seg))) return { status: 'test-only', why: `under ${rel.split('/').slice(0, -1).find(seg => TEST_SEGMENT.test(seg))}/` };
  if (parentRefs?.referenced && !parentRefs.whole && parentRefs.parts.length && !parentRefs.parts.includes(rel.split('/')[0])) {
    return { status: 'not-built', why: `the build of ${parentPath} uses only ${parentRefs.parts.map(p => `${p}/`).join(', ')}` };
  }
  return { status: 'assumed' };
}

/** Same owner on the same host as the product's repository: the wallet's own code, not a third-party library. */
export function isFirstParty(url, productUrl) {
  const owner = (u) => {
    const n = normaliseRepoUrl(u) || String(u).replace(/\.git$/, '');
    const m = /^https:\/\/([^/]+)\/([^/]+)\//.exec(n);
    return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
  };
  const a = owner(url);
  return a !== null && a === owner(productUrl);
}

// ---- git ----------------------------------------------------------------

export function git(args, { cwd, env = {}, allowFail = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: 'true', ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), GIT_TIMEOUT_MS);
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0) resolve(out);
      else if (allowFail) resolve(null);
      else reject(new Error(`git ${args[0]}: ${err.trim().split('\n').pop() || `exit ${code}`}`));
    });
  });
}

const slug = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

async function bareRepo(cacheDir, kind, key) {
  const dir = path.join(cacheDir, `${kind}-${slug(key)}.git`);
  if (!fs.existsSync(path.join(dir, 'HEAD'))) {
    fs.mkdirSync(dir, { recursive: true });
    await git(['init', '-q', '--bare', dir]);
  }
  return dir;
}

/** The submodules a commit pins: [{ path, url, commit }]. Fetches that one commit's trees, no blobs but .gitmodules. */
export async function listSubmodules(url, commit, { cacheDir }) {
  const dir = await bareRepo(cacheDir, 'tree', `${url}\n${commit}`);
  if ((await git(['cat-file', '-e', `${commit}^{tree}`], { cwd: dir, env: NO_LAZY, allowFail: true })) === null) {
    await git(['fetch', '-q', '--depth=1', '--filter=blob:none', url, commit], { cwd: dir });
    await git(['config', 'remote.origin.url', url], { cwd: dir });
    await git(['config', 'remote.origin.promisor', 'true'], { cwd: dir });
    await git(['config', 'remote.origin.partialclonefilter', 'blob:none'], { cwd: dir });
  }
  const modules = await git(['show', `${commit}:.gitmodules`], { cwd: dir, allowFail: true });
  if (modules === null) return [];
  const links = parseGitlinks(await git(['ls-tree', '-r', commit], { cwd: dir }));
  return parseGitmodules(modules)
    .filter(m => links.has(m.path))
    .map(m => ({ path: m.path, url: resolveSubmoduleUrl(m.url, url), commit: links.get(m.path) }));
}

const MAX_BUILD_FILES = 400;

/**
 * Texts of the build files (BUILD_FILE) in one commit's tree, fetched by blob
 * id from the same tree repository listSubmodules filled: only those blobs,
 * in one request per chunk.
 */
export async function buildFileTexts(url, commit, { cacheDir }) {
  const dir = await bareRepo(cacheDir, 'tree', `${url}\n${commit}`);
  const blobs = (await git(['ls-tree', '-r', commit], { cwd: dir }))
    .split('\n')
    .map(line => /^100\d{3} blob ([0-9a-f]{40})\t(.+)$/.exec(line))
    .filter(m => m && BUILD_FILE.test(m[2]))
    .slice(0, MAX_BUILD_FILES)
    .map(m => m[1]);
  const has = async (oid) => (await git(['cat-file', '-e', oid], { cwd: dir, env: NO_LAZY, allowFail: true })) !== null;
  const missing = [];
  for (const oid of blobs) if (!(await has(oid))) missing.push(oid);
  for (let i = 0; i < missing.length; i += 100) {
    await git(['fetch', '-q', '--no-tags', '--no-write-fetch-head', '--filter=blob:none', url, ...missing.slice(i, i + 100)], { cwd: dir, allowFail: true });
  }
  const texts = [];
  for (const oid of blobs) {
    const text = await git(['cat-file', 'blob', oid], { cwd: dir, env: NO_LAZY, allowFail: true });
    if (text !== null) texts.push(text);
  }
  return texts;
}

/** GitHub's root of a fork network, or the url itself. */
export async function githubUpstream(url, { token = null, fetchImpl = fetch } = {}) {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+)$/.exec(normaliseRepoUrl(url) || '');
  if (!m) return url;
  const r = await fetchImpl(`https://api.github.com/repos/${m[1]}/${m[2]}`, {
    headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) return url;
  const doc = await r.json();
  return doc.fork && doc.source?.clone_url ? doc.source.clone_url : url;
}

/**
 * Git facts for claim 2 and the fix hints, from a history-only clone (commits,
 * no trees or blobs until a diff needs them) of the upstream, plus the pinned
 * commit fetched from wherever the submodule points.
 */
async function historyFacts({ url, upstream, commit, tags, cacheDir }) {
  const dir = await bareRepo(cacheDir, 'hist', upstream);
  if ((await git(['config', '--get', 'remote.origin.url'], { cwd: dir, allowFail: true })) === null) {
    await git(['remote', 'add', 'origin', upstream], { cwd: dir });
    await git(['config', 'remote.origin.promisor', 'true'], { cwd: dir });
    await git(['config', 'remote.origin.partialclonefilter', 'tree:0'], { cwd: dir });
    await git(['config', 'remote.origin.fetch', '+refs/heads/*:refs/upstream/*'], { cwd: dir });
    await git(['config', '--add', 'remote.origin.fetch', '+refs/tags/*:refs/tags/*'], { cwd: dir });
  }
  // Without GIT_NO_LAZY_FETCH a promisor repository fetches a missing commit to answer "do we have it".
  const has = async (sha) => (await git(['cat-file', '-e', `${sha}^{commit}`], { cwd: dir, env: NO_LAZY, allowFail: true })) !== null;
  const fetched = (await git(['for-each-ref', '--count=1', 'refs/upstream'], { cwd: dir })).trim() !== '';
  if (!fetched || !(await has(commit))) await git(['fetch', '-q', '--filter=tree:0', 'origin'], { cwd: dir });
  // A fork's commit is not in upstream; fetch it from the fork.
  if (!(await has(commit))) await git(['fetch', '-q', '--filter=tree:0', url, commit], { cwd: dir });
  const containing = await git(['for-each-ref', '--count=1', '--contains', commit, '--format=%(refname)', 'refs/upstream', 'refs/tags'], { cwd: dir });
  const inUpstream = containing.trim() !== '';
  const baseTag = (await git(['describe', '--tags', '--abbrev=0', commit], { cwd: dir, allowFail: true }))?.trim() || null;
  let base = null;
  if (baseTag && tags.has(baseTag)) {
    const baseCommit = tags.get(baseTag);
    const ahead = Number((await git(['rev-list', '--count', `${baseCommit}..${commit}`], { cwd: dir })).trim());
    const tree = async (c) => (await git(['rev-parse', `${c}^{tree}`], { cwd: dir })).trim();
    const sameTree = (await tree(baseCommit)) === (await tree(commit));
    let files = null;
    if (!inUpstream && !sameTree) {
      const names = await git(['diff', '--name-only', baseCommit, commit], { cwd: dir, allowFail: true });
      files = names === null ? null : names.split('\n').filter(Boolean);
    }
    base = { tag: baseTag, commit: baseCommit, ahead, sameTree, files };
  }
  return { dir, inUpstream, base };
}

/**
 * Hint for one upstream fix commit against the pinned tree: in its history;
 * else its patch reverse-applies (already in) or forward-applies (missing).
 */
export async function fixHint(dir, commit, { repo, commit: fix }) {
  if ((await git(['cat-file', '-e', `${fix}^{commit}`], { cwd: dir, env: NO_LAZY, allowFail: true })) === null) {
    if ((await git(['fetch', '-q', '--filter=tree:0', repo, fix], { cwd: dir, allowFail: true })) === null) return 'cant-tell';
  }
  if ((await git(['merge-base', '--is-ancestor', fix, commit], { cwd: dir, allowFail: true })) !== null) return 'fix-in-history';
  const patch = await git(['diff', '--binary', `${fix}^`, fix], { cwd: dir, allowFail: true });
  if (!patch) return 'cant-tell';
  const tmp = fs.mkdtempSync(path.join(dir, 'fixhint-'));
  try {
    const patchFile = path.join(tmp, 'fix.patch');
    fs.writeFileSync(patchFile, patch);
    const env = { GIT_INDEX_FILE: path.join(tmp, 'index') };
    await git(['read-tree', commit], { cwd: dir, env });
    const check = (reverse) => git(['apply', '--cached', '--check', ...(reverse ? ['-R'] : []), patchFile], { cwd: dir, env, allowFail: true });
    if ((await check(true)) !== null) return 'fix-patch-present';
    if ((await check(false)) !== null) return 'fix-patch-absent';
    return 'cant-tell';
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ---- OSV ----------------------------------------------------------------

export async function osvByCommit(commit, { fetchImpl = fetch } = {}) {
  const vulns = [];
  let pageToken;
  do {
    const r = await fetchImpl(`${OSV_API}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commit, ...(pageToken ? { page_token: pageToken } : {}) }),
      signal: AbortSignal.timeout(60000),
    });
    if (!r.ok) throw new Error(`OSV commit ${commit}: HTTP ${r.status}`);
    const doc = await r.json();
    vulns.push(...(doc.vulns || []));
    pageToken = doc.next_page_token;
  } while (pageToken);
  return vulns;
}

// ---- the walk -----------------------------------------------------------

/**
 * Every submodule under (url, commit), recursively, with claims 2 and 3.
 * Hooks (`upstreamOf`, `osv`, `listTags`) are injectable for tests.
 */
export async function checkSubmodules(url, commit, {
  cacheDir,
  upstreamOf = (u) => githubUpstream(u),
  osv = (c) => osvByCommit(c),
  listTags = lsRemoteTags,
  log = () => {},
  maxDepth = MAX_DEPTH,
} = {}) {
  const results = [];
  const texts = new Map();
  const buildTexts = async (u, c) => {
    if (!texts.has(`${u}\n${c}`)) texts.set(`${u}\n${c}`, await buildFileTexts(u, c, { cacheDir }).catch(() => null));
    return texts.get(`${u}\n${c}`);
  };
  // parent: the row of the submodule whose own submodules these are (null at the product);
  // parentRefs: what the grandparent's build files use of the parent.
  const walk = async (parentUrl, parentCommit, parent, parentRefs, depth) => {
    const subs = await listSubmodules(parentUrl, parentCommit, { cacheDir });
    for (const s of subs) {
      const where = parent ? `${parent.path}/${s.path}` : s.path;
      log(`${where} @ ${s.commit.slice(0, 10)}`);
      const row = { path: where, url: s.url, commit: s.commit, depth };
      if (isFirstParty(s.url, url)) row.firstParty = true;
      try {
        const upstream = await upstreamOf(s.url);
        row.upstream = sameRepo(upstream, s.url) ? null : upstream;
        row.scope = scopeStatus({ path: where, parentPath: parent?.path ?? null, parentUpstream: parent ? (parent.upstream || parent.url) : null, parentRefs, inherited: parent?.scope });
        const tags = await listTags(upstream);
        const tagAtCommit = [...tags].find(([, c]) => c === s.commit)?.[0] || null;
        let facts = { inUpstream: true, base: null, dir: null };
        if (!tagAtCommit) facts = await historyFacts({ url: s.url, upstream, commit: s.commit, tags, cacheDir });
        row.identity = identityStatus({ tagAtCommit, ...facts });
        const asked = row.identity.status === 'derived' ? row.identity.baseCommit
          : row.identity.status === 'upstream-tag' && row.identity.viaTree ? tags.get(row.identity.tag)
          : row.identity.status === 'unknown-origin' ? null : s.commit;
        const vulns = asked ? await osv(asked) : [];
        const hints = new Map();
        if (row.identity.status === 'derived') {
          for (const v of vulns) {
            const hs = [];
            for (const f of fixCommitsOf(v)) hs.push(await fixHint(facts.dir, s.commit, f)); // one git at a time per repository
            hints.set(v.id, hs);
          }
        }
        row.advisories = advisoryStatus(row.identity, vulns, hints);
      } catch (e) {
        row.error = e.message;
      }
      results.push(row);
      if (depth < maxDepth) {
        try {
          // Only a submodule with submodules of its own needs its parent's build files read.
          const refs = (await listSubmodules(s.url, s.commit, { cacheDir })).length
            ? referencedParts((await buildTexts(parentUrl, parentCommit)) || [], s.path) : null;
          if (refs) row.buildRefs = refs;
          await walk(s.url, s.commit, row, refs, depth + 1);
        } catch (e) { row.childrenError = e.message; }
      }
    }
  };
  await walk(url, commit, null, null, 0);
  return results;
}
