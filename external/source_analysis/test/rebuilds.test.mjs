import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import Database from 'better-sqlite3';
import { ossRebuildPrefix, parseOssListing, listOssRebuild, rcClaims, readReproducibleCentral, importRebuildClaims, pypiName } from '../rebuildClaims.mjs';
import { tgzFiles, compareTarballs, explainDiff, diffNote, nodeImage, npmVersionFacts, rebuildEvent, rebuildRunArgs } from '../rebuildNpm.mjs';
import { rebuildCandidates } from '../rebuild-npm-cli.mjs';
import { initDatabase, getRebuildClaims } from '../ddbbUtils.mjs';
import { releaseRebuilds } from '../export.mjs';

// A minimal ustar archive: one 512-byte header per file, body padded to 512.
function tgz(files, { prefix = 'package/', mtime = 0 } = {}) {
  const blocks = [];
  for (const [name, body] of Object.entries(files)) {
    const h = Buffer.alloc(512);
    h.write(prefix + name, 0, 100, 'utf8');
    h.write('0000644\0', 100); h.write('0000000\0', 108); h.write('0000000\0', 116);
    const b = Buffer.from(body);
    h.write(b.length.toString(8).padStart(11, '0') + '\0', 124);
    h.write(mtime.toString(8).padStart(11, '0') + '\0', 136);
    h.write('        ', 148); h.write('0', 156); h.write('ustar\0' + '00', 257);
    let sum = 0; for (const x of h) sum += x;
    h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148);
    blocks.push(h, b, Buffer.alloc((512 - (b.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return zlib.gzipSync(Buffer.concat(blocks), { level: mtime ? 1 : 9 });
}

describe('outside claims: OSS Rebuild', () => {
  test('bucket prefix per ecosystem; PyPI names normalised; Maven not covered', () => {
    assert.equal(ossRebuildPrefix('npm', '@adobe/lit-mobx'), 'npm/@adobe/lit-mobx/');
    assert.equal(ossRebuildPrefix('pip', 'Typing_Extensions'), 'pypi/typing-extensions/');
    assert.equal(ossRebuildPrefix('cargo', 'serde'), 'cratesio/serde/');
    assert.equal(ossRebuildPrefix('gradle', 'a:b'), null);
    assert.equal(pypiName('zope.interface'), 'zope-interface');
  });

  test('listing: version → attested files, other objects ignored', () => {
    const m = parseOssListing([
      'npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl',
      'npm/buffer/5.7.1/buffer-5.7.1.tgz/rebuild.intoto.jsonl',
      'npm/buffer/5.7.1/buffer-5.7.1.tgz/other.json',
      'npm/buffer-xor/1.0.3/buffer-xor-1.0.3.tgz/rebuild.intoto.jsonl',
    ], 'npm/buffer/');
    assert.deepEqual([...m.keys()], ['6.0.3', '5.7.1']);
    assert.equal(m.get('6.0.3')[0].url, 'https://storage.googleapis.com/google-rebuild-attestations/npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl');
  });

  test('listing follows pages', async () => {
    const pages = {
      '': { items: [{ name: 'npm/a/1.0.0/a-1.0.0.tgz/rebuild.intoto.jsonl' }], nextPageToken: 't2' },
      t2: { items: [{ name: 'npm/a/2.0.0/a-2.0.0.tgz/rebuild.intoto.jsonl' }] },
    };
    const fetchImpl = async (url) => ({ ok: true, json: async () => pages[new URL(url).searchParams.get('pageToken') || ''] });
    assert.deepEqual([...(await listOssRebuild('npm', 'a', fetchImpl)).keys()], ['1.0.0', '2.0.0']);
  });
});

describe('outside claims: Reproducible Central', () => {
  const spec = 'groupId=com.squareup.okio\nartifactId=okio\nversion=3.9.0\n';
  test('main file in okFiles = reproduced; other differing files noted', () => {
    const cmp = 'version=3.9.0\nok=2\nko=1\nokFiles="okio-3.9.0.jar okio-3.9.0.pom okio-jvm-3.9.0.pom"\nkoFiles="okio-3.9.0-sources.jar okio-jvm-3.9.0.jar"\n';
    const claims = rcClaims(spec, cmp, 'u');
    const by = Object.fromEntries(claims.map(c => [c.name, c]));
    assert.equal(by['com.squareup.okio:okio'].result, 'reproduced');
    assert.equal(by['com.squareup.okio:okio'].note, '1 other file of this release differ');
    assert.equal(by['com.squareup.okio:okio-jvm'].result, 'failed');
    assert.equal(by['com.squareup.okio:okio-jvm'].artifact, 'okio-jvm-3.9.0.jar');
  });

  test('an unresolved groupId or a missing version gives no claim', () => {
    assert.deepEqual(rcClaims('groupId=${x}\n', 'version=1\nokFiles="a-1.jar"\n', 'u'), []);
    assert.deepEqual(rcClaims(spec, 'okFiles="okio-3.9.0.jar"\n', 'u'), []);
  });

  test('reads a checkout: buildspec next to its buildcompare, link to the buildspec', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-'));
    const d = path.join(dir, 'content/com/squareup/okio');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'okio-3.9.0.buildspec'), spec);
    fs.writeFileSync(path.join(d, 'okio-3.9.0.buildcompare'), 'version=3.9.0\nokFiles="okio-3.9.0.jar"\nkoFiles=""\n');
    const m = readReproducibleCentral(dir);
    assert.equal(m.get('com.squareup.okio:okio\u00003.9.0').url, 'https://github.com/jvm-repo-rebuild/reproducible-central/blob/master/content/com/squareup/okio/okio-3.9.0.buildspec');
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('importing claims into the database', () => {
  test('OSS claims only for versions we hold; each name looked up once per week; RC by version', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbdb-'));
    const db = initDatabase(path.join(dir, 'a.db'));
    const pkg = db.prepare(`INSERT INTO packages (ecosystem, name, version) VALUES (?, ?, ?)`);
    pkg.run('npm', 'buffer', '6.0.3'); pkg.run('gradle', 'com.squareup.okio:okio', '3.9.0');
    let asked = 0;
    const fetchImpl = async () => { asked++; return { ok: true, json: async () => ({ items: [{ name: 'npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl' }, { name: 'npm/buffer/9.9.9/buffer-9.9.9.tgz/rebuild.intoto.jsonl' }] }) }; };
    const rc = path.join(dir, 'rc');
    fs.mkdirSync(path.join(rc, 'content/okio'), { recursive: true });
    fs.writeFileSync(path.join(rc, 'content/okio/okio-3.9.0.buildspec'), 'groupId=com.squareup.okio\n');
    fs.writeFileSync(path.join(rc, 'content/okio/okio-3.9.0.buildcompare'), 'version=3.9.0\nokFiles=""\nkoFiles="okio-3.9.0.jar"\n');
    const s = await importRebuildClaims(db, { fetchImpl, rcDir: rc });
    assert.deepEqual(s, { ossNames: 1, ossClaims: 1, rcClaims: 1, failed: 0 });
    await importRebuildClaims(db, { fetchImpl });
    assert.equal(asked, 1);
    const claims = getRebuildClaims(db);
    assert.deepEqual(claims.get('npm\u0000buffer\u00006.0.3').map(c => [c.by, c.result]), [['oss-rebuild', 'reproduced']]);
    assert.deepEqual(claims.get('gradle\u0000com.squareup.okio:okio\u00003.9.0').map(c => [c.by, c.result, c.note]), [['reproducible-central', 'failed', 'okio-3.9.0.jar differs']]);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('our npm rebuild: comparing tarballs', () => {
  const reg = { 'package.json': '{"name":"a","version":"1.0.0"}', 'index.js': 'module.exports = 1;\n' };

  test('tar metadata and gzip are ignored; identical bytes are noted', () => {
    const a = tgz(reg), b = tgz(reg, { mtime: 1234567 });
    assert.deepEqual([...tgzFiles(a).keys()].sort(), ['index.js', 'package.json']);
    const same = compareTarballs(a, b);
    assert.equal(same.match, true);
    assert.equal(same.identical, false);
    assert.equal(compareTarballs(a, tgz(reg)).identical, true);
  });

  test('the first path component is dropped, whatever it is called', () => {
    assert.equal(compareTarballs(tgz(reg), tgz(reg, { prefix: 'a-1.0.0/' })).match, true);
  });

  test('missing, extra and changed files', () => {
    const c = compareTarballs(tgz(reg), tgz({ 'package.json': reg['package.json'], 'index.js': 'module.exports = 2;\n', 'x.js': '' }));
    assert.deepEqual([c.missing, c.extra, c.changed], [[], ['x.js'], ['index.js']]);
    assert.equal(c.explainedOnly, false);
    assert.equal(diffNote(c), '1 of 2 files differ (index.js); 1 extra (x.js)');
  });

  test('explained differences: line endings, package.json dev fields, docs; a real change is not', () => {
    const b = (s) => Buffer.from(s);
    assert.equal(explainDiff('index.js', b('a\r\nb\r\n'), b('a\nb\n')), 'line-endings');
    assert.equal(explainDiff('package.json', b('{"name":"a","main":"i.js"}'), b('{"name":"a","main":"i.js","scripts":{"t":"x"},"devDependencies":{"y":"1"}}')), 'package-json-dev-fields');
    assert.equal(explainDiff('package.json', b('{"name":"a","main":"i.js"}'), b('{"name":"a","main":"j.js"}')), null);
    assert.equal(explainDiff('README.md', b('short'), b('long readme')), 'docs');
    assert.equal(explainDiff('index.js', b('a'), b('b')), null);
    const c = compareTarballs(tgz({ ...reg, 'README.md': 'x\r\n' }), tgz({ ...reg, 'README.md': 'x\n' }));
    assert.equal(c.explainedOnly, true);
    assert.match(diffNote(c), /all explained: line endings only$/);
  });

  test('a missing .npmignore (packed by npm before 5) is explained; any other missing file is not', () => {
    const c = compareTarballs(tgz({ ...reg, '.npmignore': 'test/' }), tgz(reg));
    assert.equal(c.explainedOnly, true);
    assert.equal(diffNote(c), '1 missing (.npmignore); all explained: .npmignore only');
    assert.equal(compareTarballs(tgz({ ...reg, 'lib.js': '' }), tgz(reg)).explainedOnly, false);
  });
});

describe('our npm rebuild: toolchain, event, container', () => {
  test('Node image from the publisher\'s Node version, at least 14, Debian 11 below 18', () => {
    assert.equal(nodeImage('v20.11.1'), 'docker.io/library/node:20-bookworm');
    assert.equal(nodeImage('10.16.0'), 'docker.io/library/node:14-bullseye');
    assert.equal(nodeImage('16.1.0'), 'docker.io/library/node:16-bullseye');
    assert.equal(nodeImage(null), 'docker.io/library/node:20-bookworm');
  });

  test('registry facts: repository as string or object, monorepo directory', () => {
    const f = npmVersionFacts({ dist: { tarball: 't', integrity: 'sha512-x' }, gitHead: 'abc', repository: { url: 'git+https://github.com/o/r.git', directory: 'packages/a' }, _nodeVersion: '18.0.0', _npmVersion: '9.1.0' });
    assert.deepEqual(f, { tarball: 't', integrity: 'sha512-x', gitHead: 'abc', repoUrl: 'git+https://github.com/o/r.git', directory: 'packages/a', nodeVersion: '18.0.0', npmVersion: '9.1.0' });
    assert.equal(npmVersionFacts({ repository: 'o/r' }).repoUrl, 'o/r');
  });

  test('event: d tag per package version, file hash, status, source; no kind until one is picked', () => {
    const e = rebuildEvent({ name: '@s/a', version: '1.0.0', sha256: 'f'.repeat(64), result: 'reproduced', repoUrl: 'https://github.com/s/a', commit: 'c'.repeat(40), toolchain: 'node:20-bookworm npm 10.2.0', createdAt: 1 });
    assert.equal(e.kind, null);
    assert.deepEqual(e.tags.slice(0, 4), [['d', 'npm:@s/a@1.0.0'], ['x', 'f'.repeat(64)], ['status', 'reproduced'], ['source', 'https://github.com/s/a', 'c'.repeat(40)]]);
    assert.ok(JSON.stringify(e).length < 600);
  });

  test('container: no capabilities, read-only root, limits, only the scratch and out dirs mounted', () => {
    const a = rebuildRunArgs({ image: 'node:20', name: 'n', workDir: '/w', outDir: '/o', env: { REPO: 'r' }, cli: 'docker', uid: 1000, gid: 1000 });
    for (const flag of ['--cap-drop', '--read-only', '--memory', '--pids-limit']) assert.ok(a.includes(flag), flag);
    assert.deepEqual(a.filter((x, i) => a[i - 1] === '-v'), ['/w:/work:rw', '/o:/out:rw']);
    assert.ok(!a.includes('--userns=keep-id'));
    assert.ok(rebuildRunArgs({ image: 'i', name: 'n', workDir: '/w', outDir: '/o', env: {}, cli: 'podman', uid: 1000, gid: 1000 }).includes('--userns=keep-id'));
  });
});

describe('candidates and export', () => {
  test('most-shared npm versions in the app first, skipping what anyone reproduced and what we tried', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbc-'));
    const db = initDatabase(path.join(dir, 'a.db'));
    const pkg = db.prepare(`INSERT INTO packages (ecosystem, name, version) VALUES ('npm', ?, ?)`);
    const dep = db.prepare(`INSERT INTO app_dependencies (app_id, version, package_id, lockfile, tier, scope) VALUES (?, 'v1', ?, 'package-lock.json', 'lock', ?)`);
    const ids = {};
    for (const [n, v] of [['a', '1.0.0'], ['b', '1.0.0'], ['c', '1.0.0'], ['d', '^1.0.0'], ['e', '1.0.0']]) ids[n] = pkg.run(n, v).lastInsertRowid;
    for (const app of ['w1', 'w2', 'w3']) { dep.run(app, ids.a, 'app'); dep.run(app, ids.b, 'app'); dep.run(app, ids.d, 'app'); dep.run(app, ids.e, 'build'); }
    dep.run('w1', ids.c, 'app');
    db.prepare(`INSERT INTO package_rebuilds (ecosystem, name, version, claimant, result) VALUES ('npm', 'a', '1.0.0', 'oss-rebuild', 'reproduced'), ('npm', 'b', '1.0.0', 'ws', 'failed')`).run();
    assert.deepEqual(rebuildCandidates(db, { top: 5 }).map(r => r.name), ['c']);
    assert.deepEqual(rebuildCandidates(db, { top: 5, retry: true }).map(r => r.name), ['b', 'c']);
    assert.deepEqual(rebuildCandidates(db, { top: 5, scope: 'any' }).map(r => r.name), ['e', 'c']);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('release summary: a package counts once, reproduced by anyone beats failed', () => {
    const claims = new Map([
      ['npm\u0000a\u00001.0.0', [{ by: 'ws', result: 'failed' }, { by: 'oss-rebuild', result: 'reproduced' }]],
      ['npm\u0000b\u00001.0.0', [{ by: 'ws', result: 'failed' }]],
    ]);
    const deps = [{ ecosystem: 'npm', name: 'a', dep_version: '1.0.0' }, { ecosystem: 'npm', name: 'a', dep_version: '1.0.0' }, { ecosystem: 'npm', name: 'b', dep_version: '1.0.0' }, { ecosystem: 'npm', name: 'z', dep_version: '1.0.0' }];
    const r = releaseRebuilds(deps, claims);
    assert.equal(r.rows.length, 2);
    assert.deepEqual(r.summary, { reproduced: 1, failed: 1, byClaimant: { ws: { reproduced: 0, failed: 2 }, 'oss-rebuild': { reproduced: 1, failed: 0 } } });
    assert.equal(releaseRebuilds([{ ecosystem: 'npm', name: 'z', dep_version: '1' }], claims), null);
  });
});
