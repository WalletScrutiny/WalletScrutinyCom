import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  parseGitmodules, parseGitlinks, resolveSubmoduleUrl, identityStatus, fixCommitsOf, advisoryStatus, checkSubmodules,
  referencedParts, scopeStatus, isFirstParty,
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

describe('submodule identity: build scope', () => {
  test('which parts of a child the build files name', () => {
    const cmake = 'add_library(t STATIC\n  "contrib/trezor/crypto/bip39.c"\n  "${PROJECT_SOURCE_DIR}/contrib/trezor/crypto/sha2.c")\n';
    assert.deepEqual(referencedParts([cmake], 'contrib/trezor'), { referenced: true, whole: false, parts: ['crypto'] });
    assert.deepEqual(referencedParts([cmake, 'add_subdirectory(contrib/trezor)\n'], 'contrib/trezor'), { referenced: true, whole: true });
    assert.deepEqual(referencedParts(['include_directories(contrib/trezor/${PLATFORM})'], 'contrib/trezor'), { referenced: true, whole: true });
    // a longer name with the same prefix is another directory
    assert.deepEqual(referencedParts(['add_subdirectory(contrib/trezor-firmware)'], 'contrib/trezor'), { referenced: false });
  });

  test('not built when the grandparent picks other folders; test folders and known test suites; inherited', () => {
    const refs = { referenced: true, whole: false, parts: ['crypto'] };
    assert.equal(scopeStatus({ path: 'c/t/vendor/mp', parentPath: 'c/t', parentRefs: refs }).status, 'not-built');
    assert.equal(scopeStatus({ path: 'c/t/crypto/sub', parentPath: 'c/t', parentRefs: refs }).status, 'assumed');
    assert.equal(scopeStatus({ path: 'c/t/vendor/mp', parentPath: 'c/t', parentRefs: { referenced: false } }).status, 'assumed');
    assert.equal(scopeStatus({ path: 'c/t/crypto/tests/wp', parentPath: 'c/t', parentRefs: refs }).status, 'test-only');
    assert.equal(scopeStatus({ path: 'c/ossl/krb5', parentPath: 'c/ossl', parentUpstream: 'https://github.com/openssl/openssl.git' }).status, 'test-only');
    assert.equal(scopeStatus({ path: 'c/other/krb5', parentPath: 'c/other', parentUpstream: 'https://github.com/x/other' }).status, 'assumed');
    const inherited = { status: 'not-built', why: 'x' };
    assert.deepEqual(scopeStatus({ path: 'c/t/vendor/mp/lib/s', parentPath: 'c/t/vendor/mp', inherited }), { status: 'not-built', why: 'x', via: 'c/t/vendor/mp' });
  });

  test('first party: same owner on the same host', () => {
    assert.equal(isFirstParty('https://github.com/nunchuk-io/libnunchuk.git', 'https://github.com/nunchuk-io/nunchuk-desktop'), true);
    assert.equal(isFirstParty('https://github.com/openssl/openssl.git', 'https://github.com/nunchuk-io/nunchuk-desktop'), false);
    assert.equal(isFirstParty('https://gitlab.com/nunchuk-io/x', 'https://github.com/nunchuk-io/nunchuk-desktop'), false);
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

  test('a library whose app compiles only some folders: its other submodules are not built', async () => {
    const vendor = repo('vendor');
    write(vendor, 'v.c', 'int v;\n');
    const vsha = commit(vendor, 'vendor');
    const big = repo('big');
    fs.mkdirSync(path.join(big, 'crypto'));
    write(big, 'crypto/h.c', 'int h;\n');
    write(big, '.gitmodules', `[submodule "mp"]\n\tpath = vendor/mp\n\turl = file://${vendor}\n[submodule "vectors"]\n\tpath = crypto/tests/vectors\n\turl = file://${vendor}\n`);
    g(big, 'add', '-A');
    g(big, 'update-index', '--add', '--cacheinfo', `160000,${vsha},vendor/mp`);
    g(big, 'update-index', '--add', '--cacheinfo', `160000,${vsha},crypto/tests/vectors`);
    g(big, 'commit', '-q', '-m', 'big'); // not commit(): add -A would drop the gitlinks, which have no checkout
    const bsha = g(big, 'rev-parse', 'HEAD');
    const app2 = repo('app2');
    write(app2, 'CMakeLists.txt', 'add_library(h STATIC "contrib/big/crypto/h.c")\n');
    write(app2, '.gitmodules', `[submodule "big"]\n\tpath = contrib/big\n\turl = file://${big}\n`);
    g(app2, 'add', '-A');
    g(app2, 'update-index', '--add', '--cacheinfo', `160000,${bsha},contrib/big`);
    g(app2, 'commit', '-q', '-m', 'app2');
    const asha = g(app2, 'rev-parse', 'HEAD');

    const rows = await checkSubmodules(`file://${app2}`, asha, { cacheDir: path.join(root, 'cache2'), upstreamOf: async (u) => u, osv: async () => [] });
    const byPath = Object.fromEntries(rows.map(r => [r.path, r]));
    assert.deepEqual(byPath['contrib/big'].scope, { status: 'assumed' });
    assert.deepEqual(byPath['contrib/big'].buildRefs, { referenced: true, whole: false, parts: ['crypto'] });
    assert.equal(byPath['contrib/big/vendor/mp'].scope.status, 'not-built');
    assert.equal(byPath['contrib/big/crypto/tests/vectors'].scope.status, 'test-only');
  });
});
