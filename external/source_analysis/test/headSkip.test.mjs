// Default-branch analyses are skipped while the branch has not moved: the
// remote HEAD is read without a checkout, and the analysed commit is kept per app.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { remoteHeadCommit } from '../appAnalysis.mjs';
import { initDatabase, getAnalysedCommit, saveAnalysedCommit } from '../ddbbUtils.mjs';

const git = (repo, ...args) => execFileSync('git', ['-C', repo, '-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { encoding: 'utf8' }).trim();

function repoWithCommit() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-head-'));
  git(repo, 'init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(repo, 'f'), '1\n');
  git(repo, 'add', '.');
  git(repo, 'commit', '-qm', 'one');
  return repo;
}

test('remoteHeadCommit: the commit the default branch points at, and it follows new commits', async () => {
  const repo = repoWithCommit();
  assert.equal(await remoteHeadCommit(`file://${repo}`), git(repo, 'rev-parse', 'HEAD'));
  fs.writeFileSync(path.join(repo, 'f'), '2\n');
  git(repo, 'commit', '-qam', 'two');
  assert.equal(await remoteHeadCommit(`file://${repo}`), git(repo, 'rev-parse', 'HEAD'));
});

test('remoteHeadCommit: refs ending in /HEAD (Forgejo pull requests) are not the default branch', async () => {
  const repo = repoWithCommit();
  const main = git(repo, 'rev-parse', 'HEAD');
  git(repo, 'commit', '-q', '--allow-empty', '-m', 'pr');
  git(repo, 'update-ref', 'refs/pull/1/HEAD', 'HEAD');
  git(repo, 'update-ref', 'refs/aaa/HEAD', 'HEAD'); // sorts before HEAD if the order were alphabetical
  git(repo, 'reset', '-q', '--hard', main);
  assert.equal(await remoteHeadCommit(`file://${repo}`), main);
});

test('remoteHeadCommit: null for a remote that cannot be read', async () => {
  assert.equal(await remoteHeadCommit(`file://${os.tmpdir()}/sa-no-such-repo`), null);
  assert.equal(await remoteHeadCommit('--upload-pack=touch /tmp/sa-pwned'), null);
  assert.ok(!fs.existsSync('/tmp/sa-pwned'), 'a URL is never parsed as an option');
});

test('analysed commit: none at first, then the latest one per app', () => {
  const db = initDatabase(':memory:');
  assert.equal(getAnalysedCommit(db, 'app'), null);
  saveAnalysedCommit(db, 'app', 'a'.repeat(40));
  saveAnalysedCommit(db, 'other', 'c'.repeat(40));
  saveAnalysedCommit(db, 'app', 'b'.repeat(40));
  assert.equal(getAnalysedCommit(db, 'app'), 'b'.repeat(40));
  assert.equal(getAnalysedCommit(db, 'other'), 'c'.repeat(40));
  db.close();
});
