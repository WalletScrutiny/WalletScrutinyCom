// Which release tags of a native library's upstream repository contain a commit.
//
// NVD writes a fix as "< 3.13.13" and OSV.dev as the fixing commits, so
// neither sees that Python 3.11.16 already has a fix backported to its own
// release line (issue 1016). The release tag answers that: a fixing commit
// that is an ancestor of the shipped tag means the release is fixed, and the
// first tag on the shipped line that contains one is the release that fixed it.
//
// The repositories are kept as treeless bare clones (commits and tags, no
// files: cpython 84 MB, openssl 24 MB, sqlite 11 MB) under UPSTREAM_GIT_DIR,
// cloned on first use and fetched once per FETCH_EVERY_MS, so nothing is asked
// of GitHub per advisory and no API rate limit applies. A repository that
// cannot be cloned answers null (not known); one that cannot be fetched
// answers from what it has.
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { UPSTREAM_GIT_DIR } from './config.mjs';

const run = promisify(execFile);
const FETCH_EVERY_MS = 6 * 3600 * 1000;
const GIT_TIMEOUT_MS = 10 * 60 * 1000;
// Never ask the remote for a missing object: a fix commit of a fork is not in
// the clone, and a treeless clone would otherwise go and fetch it.
const GIT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_NO_LAZY_FETCH: '1' };

const git = (dir, args, timeout = GIT_TIMEOUT_MS) =>
  run('git', dir ? ['-C', dir, ...args] : args, { env: GIT_ENV, timeout, maxBuffer: 64 * 1024 * 1024 });

/** "https://github.com/python/cpython.git/" and "https://github.com/Python/cpython" are the same repository. */
export function sameRepo(a, b) {
  const norm = u => String(u || '').trim().toLowerCase().replace(/\/+$/, '').replace(/\.git$/, '');
  return norm(a) === norm(b);
}

// The clone's directory name: the URL without its scheme, readable and unique.
export const cloneName = repo => `${String(repo).replace(/^[a-z]+:\/\//i, '').replace(/\.git$/, '').replace(/[^A-Za-z0-9._-]+/g, '_')}.git`;

/**
 * An upstream git store: `tagsContaining(repo, commit)` resolves to the tags
 * that contain the commit (a Set, empty when the clone does not have the
 * commit), or null when the repository could not be cloned. Answers are kept
 * until the repository is fetched again. `tagsPointingAt(repo, commit)` is
 * the tags of the commit itself.
 */
export function upstreamGit({ dir = UPSTREAM_GIT_DIR, fetchEveryMs = FETCH_EVERY_MS, now = Date.now, log = console } = {}) {
  const repos = new Map(); // repo -> { at, ready: Promise<string|null>, contains: Map }

  async function update(repo, cloneDir, fresh) {
    try {
      if (fresh) {
        fs.mkdirSync(dir, { recursive: true });
        // into a temporary name first: a clone cut short must not look like one
        const tmp = `${cloneDir}.tmp-${process.pid}`;
        fs.rmSync(tmp, { recursive: true, force: true });
        await git(null, ['clone', '--quiet', '--bare', '--filter=tree:0', repo, tmp]);
        fs.renameSync(tmp, cloneDir);
      } else {
        // by remote name, so the clone's tree:0 filter applies to the fetch too
        await git(cloneDir, ['fetch', '--quiet', '--tags', '--force', 'origin']);
      }
    } catch (error) {
      if (fresh) {
        log.log(`Upstream git: cloning ${repo} failed: ${String(error.stderr || error.message).trim()}`);
        return null;
      }
      log.log(`Upstream git: fetching ${repo} failed, using the tags it already has: ${String(error.stderr || error.message).trim()}`);
    }
    // the commit graph makes `tag --contains` take milliseconds instead of a second
    await git(cloneDir, ['commit-graph', 'write', '--reachable']).catch(() => {});
    return cloneDir;
  }

  function ready(repo) {
    const known = repos.get(repo);
    if (known && now() - known.at < fetchEveryMs) return known;
    const cloneDir = path.join(dir, cloneName(repo));
    const entry = { at: now(), ready: update(repo, cloneDir, !fs.existsSync(cloneDir)), contains: new Map() };
    repos.set(repo, entry);
    return entry;
  }

  async function tagsContaining(repo, commit) {
    const entry = ready(repo);
    const cloneDir = await entry.ready;
    if (!cloneDir) {
      repos.delete(repo); // try cloning again next time
      return null;
    }
    if (!/^[0-9a-f]{7,40}$/i.test(commit)) return new Set();
    if (!entry.contains.has(commit)) {
      entry.contains.set(commit, git(cloneDir, ['tag', '--contains', commit], 60000)
        .then(({ stdout }) => new Set(stdout.split('\n').map(t => t.trim()).filter(Boolean)))
        .catch(() => new Set())); // not in this repository (a fork's commit, or a garbled id)
    }
    return entry.contains.get(commit);
  }

  // The tags that point at the commit itself: a release commit ("Python
  // 3.11.18"), which OSV.dev lists among the fixing commits next to the fix.
  async function tagsPointingAt(repo, commit) {
    const cloneDir = await ready(repo).ready;
    if (!cloneDir || !/^[0-9a-f]{7,40}$/i.test(commit)) return new Set();
    return git(cloneDir, ['tag', '--points-at', commit], 60000)
      .then(({ stdout }) => new Set(stdout.split('\n').map(t => t.trim()).filter(Boolean)))
      .catch(() => new Set());
  }

  return { tagsContaining, tagsPointingAt };
}

let shared = null;
/** The process's store, under UPSTREAM_GIT_DIR. */
export function defaultUpstreamGit() {
  shared ||= upstreamGit();
  return shared;
}
