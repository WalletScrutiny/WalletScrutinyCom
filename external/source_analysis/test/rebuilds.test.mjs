import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import Database from 'better-sqlite3';
import { ossRebuildPrefix, parseOssListing, listOssRebuild, rcClaims, rcCompareName, readReproducibleCentral, importRebuildClaims, importOssDetails, parseOssAttestation, pypiName } from '../rebuildClaims.mjs';
import { tgzFiles, compareTarballs, explainDiff, diffNote, reproducedNote, failureLine, nodeImage, npmVersionFacts, rebuildEvent, rebuildRunArgs } from '../rebuildNpm.mjs';
import { rebuildCandidates } from '../rebuild-npm-cli.mjs';
import { initDatabase, getRebuildClaims, getOssRebuildDetails } from '../ddbbUtils.mjs';
import { releaseRebuilds, releaseRebuildDetails } from '../export.mjs';

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

  // the lines that matter of content/com/google/guava/guava-33.4.1-jre.buildspec upstream
  const guava = 'groupId=com.google.guava\nartifactId=guava\nversion=33.4.1-jre\n\ndisplay=${groupId}:${artifactId}\n'
    + 'command="mvn clean verify -DskipTests"\nbuildinfo=target/${artifactId}-parent-${version}.buildinfo\n';
  test('the buildcompare is named after the buildinfo the buildspec names', () => {
    assert.equal(rcCompareName(guava), 'guava-parent-33.4.1-jre.buildcompare');
    assert.equal(rcCompareName(spec + 'buildinfo=target/${artifactId}-${version}.buildinfo\n'), 'okio-3.9.0.buildcompare');
    assert.equal(rcCompareName(spec + 'buildinfo=okio/target/okio-root-${version}.buildinfo # renamed by hand\n'), 'okio-root-3.9.0.buildcompare');
    assert.equal(rcCompareName(spec), null, 'no buildinfo line');
    assert.equal(rcCompareName(spec + 'buildinfo=target/$artifactId-$version.buildinfo\n'), null, 'shell variables are not resolved');
    assert.equal(rcCompareName(spec + 'buildinfo=target/${artifactId}-${other}.buildinfo\n'), null, 'a value the buildspec does not have');
    assert.equal(rcCompareName(spec + 'buildinfo="CANNOT BUILD"\n'), null);
  });

  test('reads a checkout: a release compared under another name than its buildspec', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-'));
    const d = path.join(dir, 'content/com/google/guava');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'guava-33.4.1-jre.buildspec'), guava);
    fs.writeFileSync(path.join(d, 'guava-parent-33.4.1-jre.buildcompare'), 'version=33.4.1-jre\nokFiles="guava-parent-33.4.1-jre.pom guava-33.4.1-jre.jar"\nkoFiles="guava-testlib-33.4.1-jre.jar"\n');
    // another release in the same directory: each buildspec gets its own comparison
    fs.writeFileSync(path.join(d, 'guava-33.4.0-jre.buildspec'), guava.replace('33.4.1', '33.4.0'));
    fs.writeFileSync(path.join(d, 'guava-parent-33.4.0-jre.buildcompare'), 'version=33.4.0-jre\nokFiles=""\nkoFiles="guava-33.4.0-jre.jar"\n');
    // a buildspec whose named comparison is not there falls back to its own name; one without any is skipped
    fs.writeFileSync(path.join(d, 'guava-33.3.0-jre.buildspec'), guava.replace('33.4.1', '33.3.0'));
    fs.writeFileSync(path.join(d, 'guava-33.3.0-jre.buildcompare'), 'version=33.3.0-jre\nokFiles="guava-33.3.0-jre.jar"\nkoFiles=""\n');
    fs.writeFileSync(path.join(d, 'guava-33.2.0-jre.buildspec'), guava.replace('33.4.1', '33.2.0'));
    const m = readReproducibleCentral(dir);
    assert.deepEqual([...m].map(([k, c]) => [k.replace('\u0000', ' '), c.result]).sort(), [
      ['com.google.guava:guava 33.3.0-jre', 'reproduced'],
      ['com.google.guava:guava 33.4.0-jre', 'failed'],
      ['com.google.guava:guava 33.4.1-jre', 'reproduced'],
      ['com.google.guava:guava-parent 33.4.1-jre', 'reproduced'],
      ['com.google.guava:guava-testlib 33.4.1-jre', 'failed'],
    ]);
    assert.equal(m.get('com.google.guava:guava\u000033.4.1-jre').url, 'https://github.com/jvm-repo-rebuild/reproducible-central/blob/master/content/com/google/guava/guava-33.4.1-jre.buildspec');
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

const attestation = fs.readFileSync(new URL('./fixtures/oss-rebuild-buffer-6.0.3.intoto.jsonl', import.meta.url), 'utf8');

describe('OSS Rebuild attestations', () => {
  test('a real attestation: source, recipe, toolchain, date, and a match only after normalization', () => {
    assert.deepEqual(parseOssAttestation(attestation), {
      repo: 'https://github.com/feross/buffer',
      commit: 'f52dffd9df0445b93c0c9065c2f8f0f46b2c729a',
      recipe: 'npm_pack_build',
      tools: 'npm 6.14.8',
      built: '2025-12-13',
      exact: false,
    });
  });

  test('no Rebuild statement, or not an envelope at all: null', () => {
    assert.equal(parseOssAttestation(attestation.split('\n')[0]), null);
    assert.equal(parseOssAttestation('<html>Not found</html>'), null);
  });

  test('downloads stop at the first refusal and resume next pass; a 404 is skipped', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbdet-'));
    const db = initDatabase(path.join(dir, 'a.db'));
    const claim = db.prepare(`INSERT INTO package_rebuilds (ecosystem, name, version, claimant, result, url) VALUES ('npm', ?, '1', 'oss-rebuild', 'reproduced', ?)`);
    for (let i = 0; i < 10; i++) claim.run(`p${i}`, `https://x/p${i}/rebuild.intoto.jsonl`);
    claim.run('gone', 'https://x/gone/rebuild.intoto.jsonl');
    let refuse = true, calls = 0;
    const fetchImpl = async (url) => {
      calls++;
      if (url.includes('/gone/')) return { ok: false, status: 404 };
      if (refuse && url.includes('/p5/')) return { ok: false, status: 429 };
      return { ok: true, status: 200, text: async () => attestation };
    };
    const first = await importOssDetails(db, { fetchImpl });
    assert.equal(first.stopped, true);
    assert.ok(first.downloaded < 10 && calls < 11, `stopped early: ${first.downloaded} downloaded, ${calls} asked`);
    refuse = false;
    const second = await importOssDetails(db, { fetchImpl });
    assert.equal(second.stopped, false);
    assert.equal(getOssRebuildDetails(db).size, 10);
    calls = 0;
    await importOssDetails(db, { fetchImpl });
    assert.equal(calls, 1, 'only the 404 is asked again');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('release details: only the release\'s OSS Rebuild claims with a stored summary', () => {
    const details = new Map([['u1', { commit: 'a' }], ['u3', { commit: 'c' }]]);
    const rows = [
      { claims: [{ by: 'oss-rebuild', url: 'u1' }, { by: 'reproducible-central', url: 'u3' }] },
      { claims: [{ by: 'oss-rebuild', url: 'u2' }] },
    ];
    assert.deepEqual(releaseRebuildDetails(rows, details), { u1: { commit: 'a' } });
    assert.equal(releaseRebuildDetails([rows[1]], details), null);
  });
});

describe('importing claims into the database', () => {
  test('OSS claims only for versions we hold; each name looked up once per day; RC by version', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbdb-'));
    const db = initDatabase(path.join(dir, 'a.db'));
    const pkg = db.prepare(`INSERT INTO packages (ecosystem, name, version) VALUES (?, ?, ?)`);
    pkg.run('npm', 'buffer', '6.0.3'); pkg.run('gradle', 'com.squareup.okio:okio', '3.9.0');
    let asked = 0, read = 0;
    const fetchImpl = async (url) => {
      if (url.endsWith('rebuild.intoto.jsonl')) { read++; return { ok: true, status: 200, text: async () => attestation }; }
      asked++;
      return { ok: true, json: async () => ({ items: [{ name: 'npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl' }, { name: 'npm/buffer/9.9.9/buffer-9.9.9.tgz/rebuild.intoto.jsonl' }] }) };
    };
    const rc = path.join(dir, 'rc');
    fs.mkdirSync(path.join(rc, 'content/okio'), { recursive: true });
    fs.writeFileSync(path.join(rc, 'content/okio/okio-3.9.0.buildspec'), 'groupId=com.squareup.okio\n');
    fs.writeFileSync(path.join(rc, 'content/okio/okio-3.9.0.buildcompare'), 'version=3.9.0\nokFiles=""\nkoFiles="okio-3.9.0.jar"\n');
    const s = await importRebuildClaims(db, { fetchImpl, rcDir: rc });
    assert.deepEqual(s, { ossNames: 1, ossClaims: 1, ossDetails: 1, rcClaims: 1, wsClaims: 0, failed: 0 });
    await importRebuildClaims(db, { fetchImpl });
    await importRebuildClaims(db, { fetchImpl, all: true });
    assert.equal(asked, 2);
    const lookedAt = db.prepare(`UPDATE rebuild_lookups SET checked_at = datetime('now', ?)`);
    lookedAt.run('-20 hours');
    await importRebuildClaims(db, { fetchImpl });
    assert.equal(asked, 2, 'asked 20 hours ago: not again');
    lookedAt.run('-25 hours');
    await importRebuildClaims(db, { fetchImpl });
    assert.equal(asked, 3, 'asked more than a day ago: again');
    assert.equal(read, 1, 'an attestation is downloaded once, even after its claim is replaced');
    assert.equal(getOssRebuildDetails(db).get('https://storage.googleapis.com/google-rebuild-attestations/npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl').commit, 'f52dffd9df0445b93c0c9065c2f8f0f46b2c729a');
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

  test('line endings only count as reproduced, and the note says so; with any other difference they do not', () => {
    const crlf = compareTarballs(tgz({ ...reg, 'README.md': 'x\r\n' }), tgz({ ...reg, 'README.md': 'x\n' }));
    assert.equal(crlf.lineEndingsOnly, true);
    assert.equal(reproducedNote(crlf), `All ${crlf.files} files identical apart from line endings in 1 file`);
    const mixed = compareTarballs(tgz({ ...reg, 'README.md': 'x\r\n', 'CHANGES.md': 'a' }), tgz({ ...reg, 'README.md': 'x\n', 'CHANGES.md': 'b' }));
    assert.equal(mixed.lineEndingsOnly, false);
    assert.equal(reproducedNote(mixed), null);
    assert.equal(reproducedNote(compareTarballs(tgz(reg), tgz(reg))), 'Byte-identical tarball');
  });

  test('a missing .npmignore (packed by npm before 5) is explained; any other missing file is not', () => {
    const c = compareTarballs(tgz({ ...reg, '.npmignore': 'test/' }), tgz(reg));
    assert.equal(c.explainedOnly, true);
    assert.equal(diffNote(c), '1 missing (.npmignore); all explained: .npmignore only');
    assert.equal(compareTarballs(tgz({ ...reg, 'lib.js': '' }), tgz(reg)).explainedOnly, false);
  });
});

// Archives as a publisher could craft them: every entry spelled out. `e` gives { name, body, type, magic,
// prefix, size (the size field, when it is to say something else), sum (false = a wrong checksum), raw (a
// function that changes the header before the checksum is written) }.
function tarOf(entries, { end = Buffer.alloc(1024) } = {}) {
  const blocks = [];
  for (const e of entries) {
    if (Buffer.isBuffer(e)) { blocks.push(e); continue; }
    const h = Buffer.alloc(512), b = Buffer.from(e.body ?? '');
    h.write(e.name, 0, 100, 'utf8');
    h.write('0000644\0', 100); h.write('0000000\0', 108); h.write('0000000\0', 116);
    if (Buffer.isBuffer(e.size)) e.size.copy(h, 124); else h.write((e.size ?? b.length).toString(8).padStart(11, '0') + '\0', 124);
    h.write('00000000000\0', 136);
    h.write(e.type ?? '0', 156);
    h.write(e.magic ?? 'ustar\0' + '00', 257, 'latin1');
    if (e.prefix) h.write(e.prefix, 345, 155, 'utf8');
    e.raw?.(h);
    h.write('        ', 148);
    let sum = 0; for (const x of h) sum += x;
    h.write((e.sum === false ? sum + 7 : sum).toString(8).padStart(6, '0') + '\0 ', 148);
    blocks.push(h, b, Buffer.alloc((512 - (b.length % 512)) % 512));
  }
  return zlib.gzipSync(Buffer.concat([...blocks, end]));
}
const pax = (records) => Object.entries(records).map(([k, v]) => { const rest = ` ${k}=${v}\n`; let n = rest.length + 1; while (String(n).length + rest.length !== n) n++; return `${n}${rest}`; }).join('');

describe('our npm rebuild: an archive readers could disagree on is not compared', () => {
  const pj = { name: 'package/package.json', body: '{"name":"a","version":"1.0.0"}' };
  const good = { name: 'package/index.js', body: 'GOOD\n' }, evil = { name: 'package/index.js', body: 'EVIL\n' };
  const rebuilt = tarOf([pj, good]);
  const refused = (entries, why, opts) => {
    assert.throws(() => tgzFiles(tarOf(entries, opts)), (e) => e.message.startsWith('Not a plain tar archive: ') && why.test(e.message), `${why}`);
    assert.throws(() => compareTarballs(tarOf(entries, opts), rebuilt), /^Error: The registry's tarball: Not a plain tar archive/);
    assert.throws(() => compareTarballs(rebuilt, tarOf(entries, opts)), /^Error: The rebuilt tarball: Not a plain tar archive/);
  };
  const names = (entries, opts) => [...tgzFiles(tarOf(entries, opts)).keys()];

  test('the plain archive compares as before', () => {
    assert.equal(compareTarballs(tarOf([pj, good]), rebuilt).match, true);
    assert.equal(compareTarballs(tarOf([pj, evil]), rebuilt).match, false);
  });

  test('where the archive ends: nothing but zeros after the first block of zeros', () => {
    // npm's tar reads on after one block of zeros and installs the second index.js
    refused([pj, good, Buffer.alloc(512), evil], /data after the end/);
    refused([pj, good], /data after the end/, { end: Buffer.concat([Buffer.alloc(1024), Buffer.from('x')]) });
    assert.deepEqual(names([pj, good], { end: Buffer.alloc(0) }), ['package.json', 'index.js'], 'no end marker at all is still one reading');
    refused([], /no file in it/);
    refused([{ name: 'package/', type: '5' }], /no file in it/);
  });

  test('a header with a wrong checksum is not skipped and not taken', () => {
    // npm's tar skips it and installs the first index.js
    refused([pj, evil, { ...good, sum: false }], /wrong checksum/);
  });

  test('one path, two contents; the same content twice is one file', () => {
    refused([pj, good, evil], /two files of one path/);
    refused([pj, good, { name: 'package/./index.js', body: 'EVIL\n' }], /two files of one path/);
    assert.deepEqual(names([pj, good, { name: 'package/./index.js', body: 'GOOD\n' }]), ['package.json', 'index.js'], 'as some publish tools write it');
    assert.equal(compareTarballs(tarOf([pj, { name: 'package/./index.js', body: 'GOOD\n' }]), rebuilt).match, true, '"a/./b" is a/b to every reader');
  });

  test('paths: the first component is a name, the rest has no "..", no empty part', () => {
    for (const name of ['./package/index.js', '/package/index.js', '../index.js', 'package/../index.js', 'package//index.js', 'index.js', 'package/.']) refused([pj, { ...good, name }], /path is not <directory>\/<path>/);
    refused([pj, { ...good, raw: (h) => h.write('x', 30) }], /bytes after the end of a name/); // "package/index.js", NULs, then more
  });

  test('a path is a file or a directory or a link, never two of them', () => {
    // which of the two is on disk afterwards depends on the reader and on the order
    const lib = { name: 'package/lib', body: 'EVIL\n' }, below = { name: 'package/lib/x.js', body: 'GOOD\n' };
    refused([pj, lib, below], /file below a path that is no directory/);
    refused([pj, below, lib], /file below a path that is no directory/);
    refused([pj, { name: 'package/lib/', type: '5' }, lib], /a file and something else/);
    refused([pj, { name: 'package/index.js', type: '2' }, good], /a file and something else/);
    refused([pj, { name: 'package/lib', type: '2' }, below], /file below a path that is no directory/);
    refused([pj, { name: './package/lib/', type: '5' }, good], /path is not <directory>\/<path>/);
    assert.deepEqual(names([pj, { name: 'package/', type: '5' }, { name: 'package/lib/', type: '5' }, below, { name: 'package/other', type: '2' }]), ['package.json', 'lib/x.js']);
  });

  test('sizes: octal only, inside the archive, and none on what is no file', () => {
    const big = Buffer.alloc(12); big[0] = 0x80; big[11] = 5; // the base-256 form
    refused([pj, { ...good, size: big }], /size is not an octal number/);
    refused([pj, { ...good, size: 5000 }], /longer than the archive/);
    for (const type of ['1', '2', '5']) refused([pj, { name: 'package/x', body: 'body', type }, good], /with a size/);
    refused([pj, { name: 'package/dir/', body: 'body' }, good], /directory with a size/);
    assert.deepEqual(names([pj, { name: 'package/dir/' }, { name: 'package/link', type: '2' }, good]), ['package.json', 'index.js'], 'directories and links are no files');
  });

  test('extended headers: read by length and by line alike, or not at all', () => {
    const x = (body, more = {}) => ({ name: 'PaxHeader/x', type: 'x', body, ...more });
    const long = `package/${'d/'.repeat(60)}index.js`;
    assert.deepEqual(names([pj, x(pax({ path: long, mtime: '1' })), { name: 'package/short', body: 'GOOD\n' }]), ['package.json', long.slice(8)]);
    // a record that swallows the next line (by length: one odd path; by line: two paths, the last wins)
    refused([pj, x('40 path=package/a\n25 path=package/index.js\n'), good], /wrong length|not one "key=value" line/);
    refused([pj, x('30 path=package/index.js\n'), good], /wrong length/);
    refused([pj, x('path=package/index.js\n'), good], /wrong length/);
    refused([pj, x(pax({ size: '3' })), good], /another size than the entry/);
    assert.deepEqual(names([pj, x(pax({ size: '5', uid: '120012366' })), good]), ['package.json', 'index.js'], 'old npm versions wrote the size again');
    refused([pj, x(pax({ 'GNU.sparse.major': '1' })), good], /sparse/);
    refused([pj, x(pax({ path: 'package/a' })), x(pax({ path: 'package/b' })), good], /two extended headers/);
    refused([pj, { name: 'pax_global_header', type: 'g', body: pax({ path: 'package/index.js' }) }, good], /global extended header/);
    assert.deepEqual(names([{ name: 'pax_global_header', type: 'g', body: pax({ comment: 'a'.repeat(40) }) }, pj, good]), ['package.json', 'index.js'], 'as git archive writes it');
  });

  test('only the kinds of entry a package has, and no name or extended header too large for npm\'s tar to read', () => {
    // GNU tar makes a file of a type it does not know; npm's tar makes nothing
    for (const type of ['Y', 'S', 'N', '3', '4', '6']) refused([pj, { name: 'package/ghost.js', type }, good], /an entry of type/);
    // npm's tar ignores these above 1 MiB and installs GOOD.js under its short name
    const pad = 'x'.repeat(70000);
    refused([pj, { name: '././@LongLink', type: 'L', body: `package/EVIL.js\0${'\0'.repeat(70000)}` }, { name: 'package/GOOD.js', body: 'GOOD\n' }], /unusual size/);
    refused([pj, { name: 'PaxHeader/x', type: 'x', body: pax({ path: 'package/EVIL.js', comment: pad }) }, { name: 'package/GOOD.js', body: 'GOOD\n' }], /unusual size/);
    refused([{ name: 'pax_global_header', type: 'g', body: pax({ comment: pad }) }, pj, good], /unusual size/);
  });

  test('long names (GNU) and prefixes (POSIX): each only in its own format', () => {
    const L = (name) => ({ name: '././@LongLink', type: 'L', body: `${name}\0` });
    const long = `package/${'n'.repeat(150)}.js`;
    assert.deepEqual(names([pj, L(long), { name: 'package/short', body: 'GOOD\n' }]), ['package.json', long.slice(8)]);
    refused([pj, L(long), { name: 'PaxHeader/x', type: 'x', body: pax({ path: 'package/other.js' }) }, good], /long name and an extended header path/);
    refused([pj, L(long), L(long), good], /two long names/);
    // npm's tar decodes these piece by piece and garbles or drops a character that falls on a boundary
    refused([pj, L(`package/${'n'.repeat(120)}é.js`), good], /outside ASCII/);
    refused([pj, { name: 'PaxHeader/x', type: 'x', body: pax({ path: `package/${'n'.repeat(120)}é.js` }).replace(/^\d+/, (n) => String(Number(n) + 1)) }, good], /outside ASCII/);
    assert.deepEqual(names([pj, { ...good, name: 'package/é.js' }]), ['package.json', 'é.js'], 'in the header itself any name is read whole');
    refused([pj, { ...L(long), body: `${long}\0x` }, good], /bytes after the end of a long name/);
    assert.deepEqual(names([pj, { name: 'lib/index.js', prefix: 'package', body: 'GOOD\n' }]), ['package.json', 'lib/index.js']);
    // GNU headers have other things where POSIX has the prefix: no part of the name there
    assert.deepEqual(names([pj, { ...good, magic: 'ustar  \0', prefix: '12345670' }]), ['package.json', 'index.js']);
    refused([pj, { ...good, magic: 'ustar\0' + '01', prefix: 'x' }], /unknown ustar version/);
  });
});

describe('our npm rebuild: why a build failed', () => {
  test('the first real error, not npm\'s boilerplate', () => {
    assert.equal(failureLine('== npm ci\nnpm ERR! code 1\nnpm ERR! path /work/src\nError: failed to post to closure compiler\nnpm ERR! A complete log of this run can be found in:\nnpm ERR!     /x.log\n'), 'Error: failed to post to closure compiler');
    assert.equal(failureLine('npm ERR! Linux 7\nnpm ERR! argv "node"\nnpm ERR! node v5.12.0\nnpm ERR! npm  v3.8.6\nnpm ERR! code EMISSINGARG\nnpm ERR! typeerror Error: Missing required argument #1\n'), 'Error: Missing required argument #1');
    assert.equal(failureLine('fatal: You are not currently on a branch.\n'), 'fatal: You are not currently on a branch.');
    assert.equal(failureLine('== packed \nmv: cannot stat \'\': No such file or directory\n'), "mv: cannot stat '': No such file or directory");
  });
});

describe('our npm rebuild: toolchain, event, container', () => {
  test('Node image from the publisher\'s Node major; Debian 12 from Node 18', () => {
    assert.equal(nodeImage('v20.11.1'), 'docker.io/library/node:20-bookworm');
    assert.equal(nodeImage('10.16.0'), 'docker.io/library/node:10');
    assert.equal(nodeImage('0.12.7'), 'docker.io/library/node:4');
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
    const lockfile = db.prepare(`INSERT INTO app_lockfiles (app_id, version, lockfile) VALUES (?, 'v1', 'package-lock.json')`);
    const lockfileIds = Object.fromEntries(['w1', 'w2', 'w3'].map(app => [app, lockfile.run(app).lastInsertRowid]));
    const insert = db.prepare(`INSERT INTO lockfile_dependencies (lockfile_id, package_id, tier, scope) VALUES (?, ?, 'lock', ?)`);
    const dep = { run: (app, packageId, scope) => insert.run(lockfileIds[app], packageId, scope) };
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

  test('a verdict of ours that differs counts under its own name, and the package as not reproduced', () => {
    const claims = new Map([['npm\u0000a\u00001.0.0', [{ by: 'ws', result: 'not-reproducible' }]], ['npm\u0000b\u00001.0.0', [{ by: 'ws', result: 'almost' }]]]);
    const r = releaseRebuilds([{ ecosystem: 'npm', name: 'a', dep_version: '1.0.0' }, { ecosystem: 'npm', name: 'b', dep_version: '1.0.0' }], claims);
    assert.deepEqual(r.summary, { reproduced: 0, failed: 2, byClaimant: { ws: { reproduced: 0, failed: 0, 'not-reproducible': 1, almost: 1 } } });
  });
});
