// The upstream git store (upstreamGit.mjs) against a small repository made
// here: a main line and a 3.11 release line with a backported fix, cloned
// over file://. Nothing here talks to the network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { upstreamGit, sameRepo, cloneName } from '../upstreamGit.mjs';

const quietLog = { log: () => {} };

// main: base, fix; 3.11: base, cherry-picked fix, tags v3.11.16 (before it) and v3.11.17 (after)
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'upstream-git-'));
  const src = path.join(root, 'src');
  const g = (...args) => execFileSync('git', ['-C', src, ...args], { env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } }).toString().trim();
  fs.mkdirSync(src);
  g('init', '--quiet', '--initial-branch=main');
  g('config', 'uploadpack.allowFilter', 'true');
  g('commit', '--quiet', '--allow-empty', '-m', 'base');
  g('tag', 'v3.11.0');
  g('branch', '3.11');
  g('commit', '--quiet', '--allow-empty', '-m', 'fix');
  const fix = g('rev-parse', 'HEAD');
  g('tag', 'v3.13.13');
  g('checkout', '--quiet', '3.11');
  g('commit', '--quiet', '--allow-empty', '-m', 'unrelated');
  g('tag', 'v3.11.16');
  g('commit', '--quiet', '--allow-empty', '-m', 'backported fix');
  const backport = g('rev-parse', 'HEAD');
  g('tag', 'v3.11.17');
  return { root, src, g, repo: `file://${src}`, fix, backport, dir: path.join(root, 'clones') };
}

test('tagsContaining: the tags that have a commit, from a clone made on first use', async () => {
  const f = fixture();
  const git = upstreamGit({ dir: f.dir, log: quietLog });
  assert.deepEqual([...await git.tagsContaining(f.repo, f.backport)], ['v3.11.17']);
  assert.deepEqual([...await git.tagsContaining(f.repo, f.fix)].sort(), ['v3.13.13']);
  assert.deepEqual([...await git.tagsContaining(f.repo, 'ffffffffffffffffffffffffffffffffffffffff')], [], 'a commit the repository does not have: no tags');
  assert.deepEqual([...await git.tagsPointingAt(f.repo, f.backport)], ['v3.11.17'], 'the tagged commit itself');
  assert.deepEqual([...await git.tagsPointingAt(f.repo, f.fix)], ['v3.13.13']);
  assert.deepEqual(fs.readdirSync(f.dir), [cloneName(f.repo)], 'one bare clone, no temporary left behind');
  assert.equal(execFileSync('git', ['-C', path.join(f.dir, cloneName(f.repo)), 'config', 'remote.origin.partialclonefilter']).toString().trim(), 'tree:0');
  fs.rmSync(f.root, { recursive: true, force: true });
});

test('tagsContaining: a new tag is seen after the next fetch, not before', async () => {
  const f = fixture();
  let now = 0;
  const git = upstreamGit({ dir: f.dir, log: quietLog, fetchEveryMs: 1000, now: () => now });
  assert.deepEqual([...await git.tagsContaining(f.repo, f.backport)], ['v3.11.17']);
  f.g('commit', '--quiet', '--allow-empty', '-m', 'later');
  f.g('tag', 'v3.11.18');
  assert.deepEqual([...await git.tagsContaining(f.repo, f.backport)], ['v3.11.17'], 'answers are kept until the next fetch');
  now = 1000;
  assert.deepEqual([...await git.tagsContaining(f.repo, f.backport)].sort(), ['v3.11.17', 'v3.11.18']);
  // a later process finds the clone and only fetches
  const again = upstreamGit({ dir: f.dir, log: quietLog });
  assert.deepEqual([...await again.tagsContaining(f.repo, f.backport)].sort(), ['v3.11.17', 'v3.11.18']);
  fs.rmSync(f.root, { recursive: true, force: true });
});

test('tagsContaining: a repository that cannot be cloned is not known (null); one that cannot be fetched answers from its clone', async () => {
  const f = fixture();
  const git = upstreamGit({ dir: f.dir, log: quietLog });
  assert.equal(await git.tagsContaining(`file://${f.root}/missing`, f.fix), null);
  assert.deepEqual(fs.readdirSync(f.dir), [], 'nothing left of the failed clone');
  let now = 0;
  const fetching = upstreamGit({ dir: f.dir, log: quietLog, fetchEveryMs: 1, now: () => now });
  await fetching.tagsContaining(f.repo, f.fix);
  fs.rmSync(f.src, { recursive: true, force: true });
  now = 10;
  assert.deepEqual([...await fetching.tagsContaining(f.repo, f.backport)], ['v3.11.17']);
  fs.rmSync(f.root, { recursive: true, force: true });
});

test('sameRepo ignores case, a trailing slash and .git', () => {
  assert.ok(sameRepo('https://github.com/Python/cpython.git/', 'https://github.com/python/cpython'));
  assert.ok(!sameRepo('https://github.com/kzalewski/openssl-1.1.1', 'https://github.com/openssl/openssl'));
});
