import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { zipEntries, dexClasses, elfCodeHash, readApk, artifactContents, compare, outerClass, isGenerated } from '../apkContents.mjs';

// A zip archive with the given entries ({ name: Buffer|string }), deflated.
function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content);
    const packed = deflateRawSync(data);
    const n = Buffer.from(name);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(8, 8);
    local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(n.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(8, 10);
    central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(n.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, n, packed);
    centrals.push(central, n);
    offset += 30 + n.length + packed.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

// A dex file that defines the given classes (Java names); only the tables dexClasses reads.
function dex(classes) {
  const n = classes.length;
  const header = 0x70;
  const stringIds = header;
  const typeIds = stringIds + 4 * n;
  const classDefs = typeIds + 4 * n;
  let data = classDefs + 32 * n;
  const buf = Buffer.alloc(data + classes.reduce((s, c) => s + c.length + 4, 0));
  buf.write('dex\n035\0', 0, 'latin1');
  buf.writeUInt32LE(stringIds, 0x3c); buf.writeUInt32LE(typeIds, 0x44);
  buf.writeUInt32LE(n, 0x60); buf.writeUInt32LE(classDefs, 0x64);
  classes.forEach((c, i) => {
    const d = `L${c.replace(/\./g, '/')};`;
    buf.writeUInt32LE(data, stringIds + 4 * i);
    buf[data] = d.length; // uleb128, short names
    buf.write(d, data + 1, 'latin1');
    data += d.length + 2;
    buf.writeUInt32LE(i, typeIds + 4 * i);
    buf.writeUInt32LE(i, classDefs + 32 * i);
  });
  return buf;
}

// A 64-bit little-endian ELF with one PT_LOAD segment holding `code`, plus `tail` after it (symbols, say).
function elf(code, tail = '') {
  const c = Buffer.from(code);
  const buf = Buffer.alloc(64 + 56 + c.length + Buffer.byteLength(tail));
  buf.writeUInt32BE(0x7f454c46, 0); buf[4] = 2; buf[5] = 1;
  buf.writeBigUInt64LE(64n, 0x20); buf.writeUInt16LE(56, 0x36); buf.writeUInt16LE(1, 0x38);
  buf.writeUInt32LE(1, 64); buf.writeBigUInt64LE(120n, 64 + 8); buf.writeBigUInt64LE(BigInt(c.length), 64 + 32);
  c.copy(buf, 120);
  buf.write(tail, 120 + c.length);
  return buf;
}

describe('apk contents', () => {
  test('zip, dex and ELF readers', () => {
    const z = zip({ 'a.txt': 'hello', 'b/c.bin': 'xyz' });
    assert.deepEqual(zipEntries(z).map(e => [e.name, e.read().toString()]), [['a.txt', 'hello'], ['b/c.bin', 'xyz']]);
    assert.deepEqual(dexClasses(dex(['org.bouncycastle.Digest', 'a.b'])), ['org.bouncycastle.Digest', 'a.b']);
    assert.equal(elfCodeHash(elf('CODE', 'symbols')), elfCodeHash(elf('CODE')), 'stripping symbols outside the loaded segment changes nothing');
    assert.notEqual(elfCodeHash(elf('CODE')), elfCodeHash(elf('EVIL')));
    assert.equal(elfCodeHash(Buffer.from('not an elf at all, really not one')), null);
    assert.equal(outerClass('com.x.Foo$$ExternalSyntheticLambda0'), 'com.x.Foo');
    assert.ok(isGenerated('com.google.android.material.R$attr') && isGenerated('lib.BuildConfig') && !isGenerated('com.x.Router'));
  });

  test('compare: present, absent in an unobfuscated APK, the shipped version, native code, and what nothing declares', async () => {
    const apkBuf = zip({
      'classes.dex': dex(['org.lib.A', 'org.lib.A$$ExternalSyntheticLambda0', 'org.lib.R$string', 'com.vendored.Secret', 'app.own.Main']),
      'META-INF/org.lib_lib.version': '2.0.0',
      'lib/arm64-v8a/libnative.so': elf('CODE', 'stripped-away-symbols'),
      'lib/arm64-v8a/libmystery.so': elf('???'),
    });
    const apk = readApk(apkBuf);
    assert.equal(apk.versions.get('org.lib:lib'), '2.0.0');
    // artifacts as Maven would serve them: an aar with classes.jar and a jni library
    const aar = zip({ 'classes.jar': zip({ 'org/lib/A.class': '', 'org/lib/B.class': '' }), 'jni/arm64-v8a/libnative.so': elf('CODE', 'full-symbols') });
    const unused = zip({ 'org/unused/X.class': '' });
    const fetchImpl = async (url) => {
      const body = url.endsWith('/org/lib/lib/2.0.0/lib-2.0.0.aar') ? aar : url.endsWith('/org/unused/unused/1.0/unused-1.0.jar') ? unused : null;
      return body ? { ok: true, arrayBuffer: async () => body } : { ok: false };
    };
    const artifacts = new Map([
      ['org.lib:lib@2.0.0', await artifactContents('org.lib:lib', '2.0.0', { fetchImpl })],
      ['org.lib:lib@1.0.0', await artifactContents('org.lib:lib', '2.0.0', { fetchImpl })],
      ['org.unused:unused@1.0', await artifactContents('org.unused:unused', '1.0', { fetchImpl })],
    ]);
    const deps = [
      { ecosystem: 'gradle', name: 'org.lib:lib', version: '2.0.0', scope: 'app' },
      { ecosystem: 'gradle', name: 'org.lib:lib', version: '1.0.0', scope: 'app' },
      { ecosystem: 'gradle', name: 'org.unused:unused', version: '1.0', scope: 'build' },
      { ecosystem: 'gradle', name: 'org.gone:gone', version: '1.0', scope: 'app' },
    ];
    const r = compare(apk, deps, artifacts, { ownPrefixes: ['app.own.'] });
    assert.deepEqual(r.rows.map(x => [x.name, x.version, x.status]), [
      ['org.lib:lib', '2.0.0', 'present'],
      ['org.lib:lib', '1.0.0', 'other-version-shipped'],
      ['org.unused:unused', '1.0', 'absent'],
      ['org.gone:gone', '1.0', 'not-fetched'],
    ]);
    assert.deepEqual(r.rows[0].native, [{ lib: 'arm64-v8a/libnative.so', inApk: true, identical: true }], 'same code, though the APK copy is stripped');
    assert.deepEqual(r.undeclared, [{ package: 'com.vendored', classes: 1 }], 'lambdas belong to their class, R is generated, the app\'s own code is left out');
    assert.deepEqual(r.nativeUndeclared.map(n => n.path), ['lib/arm64-v8a/libmystery.so']);
    assert.equal(r.summary.nativeDiffers, 0);
    assert.deepEqual(r.nativeFiles.map(n => [n.path, n.verdict]), [['lib/arm64-v8a/libnative.so', 'identical'], ['lib/arm64-v8a/libmystery.so', 'undeclared']]);
  });

  test('compare: in an obfuscated APK a class that is not found is "can\'t tell", not absent', () => {
    const apk = readApk(zip({ 'classes.dex': dex(['a.a', 'a.b', 'b.a', 'org.kept.K']) }));
    const artifacts = new Map([['org.lib:lib@1', { classes: new Set(['org.lib.A']), native: new Map() }]]);
    const r = compare(apk, [{ ecosystem: 'gradle', name: 'org.lib:lib', version: '1' }], artifacts);
    assert.equal(r.rows[0].status, 'cant-tell');
    assert.equal(r.summary.obfuscatedShare, 0.75);
  });
});
