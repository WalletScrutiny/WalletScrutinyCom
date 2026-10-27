import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  parseGitmodules, parseGitlinks, resolveSubmoduleUrl, identityStatus, fixCommitsOf, advisoryStatus, checkSubmodules,
} from '../submoduleIdentity.mjs';

describe('submodule identity: parsing', () => {
  test('.gitmodules: path and url per submodule, quotes and comments ignored', () => {
    const text = '# pinned\n[submodule "contrib/openssl"]\n\tpath = contrib/openssl\n\turl = https://github.com/openssl/openssl.git\n[submodule "z"]\n\tpath = "contrib/z lib"\n\turl = ../zlib.git\n\tbranch = main\n[core]\n\tpath = nope\n';
    assert.deepEqual(parseGitmodules(text), [
      { name: 'contrib/openssl', path: 'contrib/openssl', url: 'https://github.com/openssl/openssl.git' },
      { name: 'z', path: 'contrib/z lib', url: '../zlib.git' },
    ]);
  });

  test('ls-tree: only gitlinks', () => {
    const sha = 'a'.repeat(40), blob = 'b'.repeat(40);
    assert.deepEqual([...parseGitlinks(`100644 blob ${blob}\tREADME\n160000 commit ${sha}\tcontrib/openssl\n`)], [['contrib/openssl', sha]]);
  });

  test('relative urls resolve against the superproject', () => {
    assert.equal(resolveSubmoduleUrl('../zlib.git', 'https://github.com/o/app.git'), 'https://github.com/o/zlib.git');
    assert.equal(resolveSubmoduleUrl('./sub', 'https://github.com/o/app'), 'https://github.com/o/app/sub');
    assert.equal(resolveSubmoduleUrl('https://x/y', 'https://github.com/o/app'), 'https://x/y');
  });
});

describe('submodule identity: the three claims', () => {
  test('identity: tag, upstream commit, derived, same tree, unknown', () => {
    assert.deepEqual(identityStatus({ tagAtCommit: 'v1.0' }), { status: 'upstream-tag', tag: 'v1.0' });
    assert.equal(identityStatus({ inUpstream: true, base: { tag: 'v1.0', ahead: 3 } }).status, 'upstream-commit');
    const base = { tag: 'v1.0', commit: 'c'.repeat(40), ahead: 2, sameTree: false, files: ['a.c'] };
    assert.deepEqual(identityStatus({ inUpstream: false, base }), { status: 'derived', base: 'v1.0', baseCommit: base.commit, ahead: 2, files: ['a.c'] });
    assert.deepEqual(identityStatus({ inUpstream: false, base: { ...base, sameTree: true } }), { status: 'upstream-tag', tag: 'v1.0', viaTree: true });
    assert.equal(identityStatus({ inUpstream: false, base: null }).status, 'unknown-origin');
  });

  test('fix commits from GIT ranges of any repository, deduplicated', () => {
    const f1 = '1'.repeat(40), f2 = '2'.repeat(40);
    const vuln = { affected: [
      { ranges: [{ type: 'GIT', repo: 'https://github.com/up/lib', events: [{ introduced: '0' }, { fixed: f1 }] }] },
      { ranges: [{ type: 'GIT', repo: 'https://github.com/someone/lib', events: [{ fixed: f2 }, { fixed: f1 }] }, { type: 'ECOSYSTEM', events: [{ fixed: '1.2' }] }] },
    ] };
    assert.deepEqual(fixCommitsOf(vuln), [{ repo: 'https://github.com/up/lib', commit: f1 }, { repo: 'https://github.com/someone/lib', commit: f2 }]);
  });

  test('advisories apply only when identity holds; a fork gets its base release as unknown', () => {
    const vulns = [{ id: 'CVE-1' }, { id: 'CVE-2' }];
    assert.deepEqual(advisoryStatus({ status: 'upstream-tag' }, vulns), { status: 'affected', applies: ['CVE-1', 'CVE-2'] });
    assert.deepEqual(advisoryStatus({ status: 'upstream-commit' }, []), { status: 'none-listed', applies: [] });
    const hints = new Map([['CVE-1', ['cant-tell', 'fix-in-history']], ['CVE-2', []]]);
    assert.deepEqual(advisoryStatus({ status: 'derived', base: 'v1.0' }, vulns, hints), {
      status: 'unknown', base: 'v1.0', unknown: [{ id: 'CVE-1', hint: 'fix-in-history' }, { id: 'CVE-2', hint: 'cant-tell' }],
    });
    // no advisories for the base is not "clean": the fork's own changes are unreviewed
    assert.equal(advisoryStatus({ status: 'derived', base: 'v1.0' }, []).status, 'none-listed-for-base');
    assert.equal(advisoryStatus({ status: 'unknown-origin' }, vulns).status, 'unknown');
  });
});

// Fixture: an upstream library with releases and two later fixes, a fork that
// cherry-picked one fix and patched a file, and an app pinning both.
describe('submodule identity: walking real git repositories', () => {
  let root, sha = {};
  const g = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' } }).trim();
  const write = (dir, file, text) => fs.writeFileSync(path.join(dir, file), text);
  const repo = (name) => {
    const dir = path.join(root, name);
    fs.mkdirSync(dir);
    g(dir, 'init', '-q', '-b', 'main');
    g(dir, 'config', 'uploadpack.allowFilter', 'true');
    g(dir, 'config', 'uploadpack.allowAnySHA1InWant', 'true');
    return dir;
  };
  const commit = (dir, msg) => { g(dir, 'add', '-A'); g(dir, 'commit', '-q', '-m', msg); return g(dir, 'rev-parse', 'HEAD'); };

  before(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'submodule-identity-'));
    const up = repo('upstream');
    write(up, 'a.c', 'int a(void) { return 1; }\n');
    write(up, 'b.c', 'int b(int n) { return n; }\n');
    sha.v1 = commit(up, 'v1.0');
    g(up, 'tag', '-a', 'v1.0', '-m', 'v1.0');
    write(up, 'a.c', 'int a(void) { return 2; } /* fix A */\n');
    sha.fixA = commit(up, 'fix A');
    write(up, 'b.c', 'int b(int n) { return n > 0 ? n : 0; } /* fix B */\n');
    sha.fixB = commit(up, 'fix B');

    const fork = repo('fork');
    g(fork, 'fetch', '-q', up, 'refs/tags/v1.0:refs/tags/v1.0', 'main:refs/up/main');
    g(fork, 'checkout', '-q', '-B', 'main', 'v1.0');
    write(fork, 'c.c', 'int c(void) { return 3; }\n');
    commit(fork, 'fork-only change');
    g(fork, 'cherry-pick', sha.fixA); // same change on another parent, so a new commit id: only the patch says it is there
    sha.fork = g(fork, 'rev-parse', 'HEAD');
    g(fork, 'tag', '-d', 'v1.0');
    g(fork, 'update-ref', '-d', 'refs/up/main');
    g(fork, 'gc', '-q', '--prune=now'); // the fork holds none of upstream's later commits

    const app = repo('app');
    write(app, '.gitmodules', `[submodule "lib"]\n\tpath = contrib/lib\n\turl = file://${up}\n[submodule "forked"]\n\tpath = contrib/forked\n\turl = file://${fork}\n`);
    g(app, 'add', '.gitmodules');
    g(app, 'update-index', '--add', '--cacheinfo', `160000,${sha.v1},contrib/lib`);
    g(app, 'update-index', '--add', '--cacheinfo', `160000,${sha.fork},contrib/forked`);
    g(app, 'commit', '-q', '-m', 'pin libs');
    sha.app = g(app, 'rev-parse', 'HEAD');
  });

  after(() => fs.rmSync(root, { recursive: true, force: true }));

  test('an exact release gets its advisories; the fork gets its base release as unknown, with fix hints', async () => {
    const up = `file://${path.join(root, 'upstream')}`, fork = `file://${path.join(root, 'fork')}`;
    const osvAsked = [];
    const vulns = { [sha.v1]: [
      { id: 'CVE-A', affected: [{ ranges: [{ type: 'GIT', repo: up, events: [{ introduced: '0' }, { fixed: sha.fixA }] }] }] },
      { id: 'CVE-B', affected: [{ ranges: [{ type: 'GIT', repo: up, events: [{ introduced: '0' }, { fixed: sha.fixB }] }] }] },
    ] };
    const rows = await checkSubmodules(`file://${path.join(root, 'app')}`, sha.app, {
      cacheDir: path.join(root, 'cache'),
      upstreamOf: async (u) => (u === fork ? up : u),
      osv: async (c) => { osvAsked.push(c); return vulns[c] || []; },
    });
    const byPath = Object.fromEntries(rows.map(r => [r.path, r]));
    assert.deepEqual(Object.keys(byPath).sort(), ['contrib/forked', 'contrib/lib']);

    const lib = byPath['contrib/lib'];
    assert.deepEqual(lib.identity, { status: 'upstream-tag', tag: 'v1.0' });
    assert.deepEqual(lib.advisories, { status: 'affected', applies: ['CVE-A', 'CVE-B'] });

    const forked = byPath['contrib/forked'];
    assert.equal(forked.upstream, up);
    assert.equal(forked.identity.status, 'derived');
    assert.equal(forked.identity.base, 'v1.0');
    assert.equal(forked.identity.ahead, 2);
    assert.deepEqual(forked.identity.files.sort(), ['a.c', 'c.c']);
    assert.deepEqual(forked.advisories, {
      status: 'unknown', base: 'v1.0',
      unknown: [{ id: 'CVE-A', hint: 'fix-patch-present' }, { id: 'CVE-B', hint: 'fix-patch-absent' }],
    });
    // the fork's own commit is never asked: OSV does not know it, and "none" would read as clean
    assert.ok(!osvAsked.includes(sha.fork));
  });
});
