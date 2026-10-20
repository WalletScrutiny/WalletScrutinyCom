// Level 1 of "Checking the shipped app" (docs/dependency-check.md): what of
// the declared dependencies is really inside a released APK, and what is
// inside that nothing declares. No dependencies beyond Node, so the
// reproducible-build scripts can fetch it by commit and check its hash.
//
// Detectors, by kind of code:
//   - Java/Kotlin (classes*.dex): the classes the APK defines, by name. A
//     Maven/Gradle dependency is present when one of the classes in its
//     jar/aar is defined in the APK. R8 renames what no keep rule protects,
//     so in an obfuscated APK "no class found" is "can't tell", not absent.
//   - Versions: the META-INF/<group>_<artifact>.version files androidx and
//     other Google libraries ship say which version went in.
//   - Native (lib/<abi>/*.so): a library an aar declares is compared byte
//     for byte with the one in the APK; one no dependency declares is listed.
// JavaScript bundles are not read yet: their rows stay "can't tell".

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';

// ---- zip ----------------------------------------------------------------

/** The entries of a zip archive (an APK, a jar, an aar): `[{ name, read() }]`. */
export function zipEntries(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip archive (no end of central directory)');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('corrupt central directory');
    const method = buf.readUInt16LE(p + 10);
    const compressed = buf.readUInt32LE(p + 20);
    const size = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + commentLen;
    out.push({
      name,
      size,
      read() {
        const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
        const data = buf.subarray(start, start + compressed);
        if (method === 0) return data;
        if (method === 8) return inflateRawSync(data);
        throw new Error(`${name}: compression method ${method} not supported`);
      },
    });
  }
  return out;
}

// ---- dex ----------------------------------------------------------------

function uleb128(buf, p) {
  let result = 0;
  let shift = 0;
  let b;
  do {
    b = buf[p++];
    result |= (b & 0x7f) << shift;
    shift += 7;
  } while (b & 0x80);
  return [result, p];
}

/** The classes a dex file defines, as Java names ("org.bouncycastle.crypto.Digest"). */
export function dexClasses(buf) {
  if (buf.toString('latin1', 0, 4) !== 'dex\n') throw new Error('not a dex file');
  const stringIdsOff = buf.readUInt32LE(0x3c);
  const typeIdsOff = buf.readUInt32LE(0x44);
  const classDefsSize = buf.readUInt32LE(0x60);
  const classDefsOff = buf.readUInt32LE(0x64);
  const out = [];
  for (let i = 0; i < classDefsSize; i++) {
    const typeIdx = buf.readUInt32LE(classDefsOff + i * 32);
    const stringIdx = buf.readUInt32LE(typeIdsOff + typeIdx * 4);
    const dataOff = buf.readUInt32LE(stringIdsOff + stringIdx * 4);
    const [, start] = uleb128(buf, dataOff);
    const end = buf.indexOf(0, start);
    // MUTF-8; class names are ASCII in practice, and a stray multi-byte name only needs to compare equal to itself
    const descriptor = buf.toString('utf8', start, end);
    if (descriptor.startsWith('L') && descriptor.endsWith(';')) out.push(descriptor.slice(1, -1).replace(/\//g, '.'));
  }
  return out;
}

// ---- native ---------------------------------------------------------------

/**
 * A hash of what an ELF library loads: the bytes of its PT_LOAD segments.
 * The Android build strips debug symbols from every .so it packages, which
 * changes the file but not these bytes, so equal hashes mean the same code.
 * The first segment holds the ELF header, whose section-table fields
 * (e_shoff, e_shnum, e_shstrndx) stripping rewrites; those are zeroed first.
 * Null for anything that is not a little-endian ELF.
 */
export function elfCodeHash(buf) {
  if (buf.length < 52 || buf.readUInt32BE(0) !== 0x7f454c46 || buf[5] !== 1) return null;
  const is64 = buf[4] === 2;
  const phoff = is64 ? Number(buf.readBigUInt64LE(0x20)) : buf.readUInt32LE(0x1c);
  const phentsize = buf.readUInt16LE(is64 ? 0x36 : 0x2a);
  const phnum = buf.readUInt16LE(is64 ? 0x38 : 0x2c);
  const header = Buffer.from(buf.subarray(0, is64 ? 64 : 52));
  if (is64) { header.fill(0, 0x28, 0x30); header.fill(0, 0x3a, 0x40); } else { header.fill(0, 0x20, 0x24); header.fill(0, 0x2e, 0x34); }
  const h = createHash('sha256');
  let loads = 0;
  for (let i = 0; i < phnum; i++) {
    const p = phoff + i * phentsize;
    if (buf.readUInt32LE(p) !== 1) continue; // PT_LOAD
    const offset = is64 ? Number(buf.readBigUInt64LE(p + 8)) : buf.readUInt32LE(p + 4);
    const filesz = is64 ? Number(buf.readBigUInt64LE(p + 32)) : buf.readUInt32LE(p + 16);
    if (offset === 0 && filesz >= header.length) {
      h.update(header);
      h.update(buf.subarray(header.length, filesz));
    } else h.update(buf.subarray(offset, offset + filesz));
    loads++;
  }
  return loads ? h.digest('hex') : null;
}

// ---- the APK --------------------------------------------------------------

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

// A class R8 renamed: every segment of its package and its name is one or two letters.
const OBFUSCATED_RE = /^(?:[a-z]{1,2}\.)*[A-Za-z]{1,2}(?:\$\w+)?$/;

// Classes the app's build writes, not any library: D8's desugared lambdas
// and nest helpers belong to their outer class; R and BuildConfig are
// generated per app for every library with resources.
const SYNTHETIC_RE = /\$\$ExternalSynthetic|\$r8\$|-\$\$Nest\$|\$\$Lambda/;
const GENERATED_RE = /(?:^|\.)(?:R|BuildConfig|Manifest)(?:\$[\w$]+)?$|^j\$\./; // j$.*: D8's core library desugaring
export const outerClass = (c) => c.replace(/(\$\$ExternalSynthetic|\$r8\$|-\$\$Nest\$|\$\$Lambda).*$/, '');
export const isGenerated = (c) => GENERATED_RE.test(c);
const VERSION_RE = /^\d[\w.+-]*$/;

/**
 * What an APK contains: `{ classes: Set, obfuscatedShare, versions: Map
 * "group:artifact" -> version, native: [{ path, abi, name, size, sha256 }], js: [paths] }`.
 */
export function readApk(buf) {
  const classes = new Set();
  const versions = new Map();
  const native = [];
  const js = [];
  for (const e of zipEntries(buf)) {
    if (/^classes\d*\.dex$/.test(e.name)) for (const c of dexClasses(e.read())) classes.add(c);
    else if (/^META-INF\/[^/]+\.version$/.test(e.name)) {
      const m = e.name.match(/^META-INF\/(.+)_(.+)\.version$/);
      const v = m && e.read().toString('utf8').trim();
      // some androidx builds wrote a Gradle task description instead of the version
      if (m && VERSION_RE.test(v)) versions.set(`${m[1]}:${m[2]}`, v);
    } else if (/^lib\/[^/]+\/[^/]+\.so$/.test(e.name)) {
      const [, abi, name] = e.name.split('/');
      const data = e.read();
      native.push({ path: e.name, abi, name, size: e.size, sha256: sha256(data), code: elfCodeHash(data) });
    } else if (/^assets\/.*\.m?js$/.test(e.name)) js.push(e.name);
  }
  let obfuscated = 0;
  for (const c of classes) if (OBFUSCATED_RE.test(c)) obfuscated++;
  return { classes, obfuscatedShare: classes.size ? obfuscated / classes.size : 0, versions, native, js };
}

// ---- declared artifacts ----------------------------------------------------

export const MAVEN_REPOS = ['https://dl.google.com/dl/android/maven2', 'https://repo1.maven.org/maven2', 'https://jitpack.io'];

/**
 * The classes and native libraries of one Maven artifact version, from the
 * first repository that has its aar or jar: `{ url, classes: Set, native:
 * Map "abi/name" -> sha256 }`, or null when no repository has it.
 */
export async function artifactContents(coordinate, version, { fetchImpl = fetch, repos = MAVEN_REPOS } = {}) {
  const [group, artifact] = coordinate.split(':');
  const get = async (url) => {
    try {
      const res = await fetchImpl(url, { signal: AbortSignal.timeout(60_000) });
      return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
    } catch {
      return null;
    }
  };
  for (const repo of repos) {
    const dir = `${repo}/${group.replace(/\./g, '/')}/${artifact}/${version}`;
    const candidates = [`${artifact}-${version}.aar`, `${artifact}-${version}.jar`];
    // Gradle module metadata names the real file when it is not <artifact>-<version>.aar/jar
    // (nostr-sdk publishes -release.aar), or another module for the Android/JVM variant (Kotlin Multiplatform).
    const module = await get(`${dir}/${artifact}-${version}.module`);
    if (module) {
      try {
        const doc = JSON.parse(module.toString('utf8'));
        // runtime library variants only (not sources or javadoc), Android before JVM, release before debug
        const runtime = (doc.variants || []).filter(v => /runtime/i.test(v.attributes?.['org.gradle.usage'] || '')
          && (v.attributes?.['org.gradle.category'] ?? 'library') === 'library');
        const rank = (v) => (v.attributes?.['org.gradle.jvm.environment'] === 'android' || /android/i.test(v.name) ? 2 : 0) + (/debug/i.test(v.name) ? 0 : 1);
        // the best variant decides: its own file, or the module it points at
        for (const v of runtime.sort((x, y) => rank(y) - rank(x))) {
          const files = (v.files || []).map(f => f.url).filter(u => /\.(aar|jar)$/.test(u) && !/-(sources|javadoc)\.jar$/.test(u));
          if (files.length) {
            candidates.unshift(...files);
            break;
          }
          const at = v['available-at'];
          if (at?.group && at?.module && at?.version && at.module !== artifact) {
            const redirected = await artifactContents(`${at.group}:${at.module}`, at.version, { fetchImpl, repos });
            if (redirected) return redirected;
          }
        }
      } catch {
        // unreadable metadata: try the conventional names
      }
    }
    for (const file of [...new Set(candidates)]) {
      const buf = await get(`${dir}/${file}`);
      if (!buf) continue;
      const classes = new Set();
      const native = new Map();
      const addJar = (jar) => {
        for (const e of zipEntries(jar)) {
          if (e.name.endsWith('.class') && !e.name.startsWith('META-INF/')) classes.add(e.name.slice(0, -6).replace(/\//g, '.'));
          else if (/\.so$/.test(e.name)) native.set(nativeKey(e.name), elfCodeHash(e.read()));
        }
      };
      try {
        if (file.endsWith('.jar')) addJar(buf);
        else {
          for (const e of zipEntries(buf)) {
            if (e.name === 'classes.jar' || /^libs\/.+\.jar$/.test(e.name)) addJar(e.read());
            else if (/^jni\/[^/]+\/[^/]+\.so$/.test(e.name)) native.set(e.name.slice(4), elfCodeHash(e.read()));
          }
        }
      } catch {
        continue; // not a zip (an HTML error page from jitpack)
      }
      return { url: `${dir}/${file}`, classes, native };
    }
  }
  return null;
}

// A .so inside a jar (JNA keeps com/sun/jna/android-aarch64/libjnidispatch.so) by the APK's abi/name.
const JAR_ABI = { 'android-aarch64': 'arm64-v8a', 'android-arm': 'armeabi-v7a', 'android-armv7': 'armeabi-v7a', 'android-x86': 'x86', 'android-x86-64': 'x86_64' };
function nativeKey(path) {
  const parts = path.split('/');
  const name = parts.pop();
  const dir = parts.pop() || '';
  return `${JAR_ABI[dir] || dir}/${name}`;
}

const ARTIFACT_CONCURRENCY = 8;

/**
 * artifactContents() for every Maven/Gradle dependency in `deps`, as a Map
 * "name@version" -> contents; the ones no repository has are left out.
 * `cacheDir` keeps the class lists between runs (optional).
 */
export async function artifactsFor(deps, { cacheDir = null, log = () => {}, fetchImpl = fetch } = {}) {
  if (cacheDir) fs.mkdirSync(cacheDir, { recursive: true });
  const out = new Map();
  const queue = deps.filter(d => d.ecosystem === 'gradle' && d.version).map(d => `${d.name}@${d.version}`);
  const worker = async () => {
    while (queue.length) {
      const key = queue.shift();
      if (out.has(key)) continue;
      const file = cacheDir && path.join(cacheDir, `${key.replace(/[^A-Za-z0-9._@-]/g, '_')}.json`);
      if (file && fs.existsSync(file)) {
        const c = JSON.parse(fs.readFileSync(file, 'utf8'));
        out.set(key, c && { url: c.url, classes: new Set(c.classes), native: new Map(c.native) });
        continue;
      }
      const [name, version] = [key.slice(0, key.lastIndexOf('@')), key.slice(key.lastIndexOf('@') + 1)];
      const c = await artifactContents(name, version, { fetchImpl });
      if (!c) log(`not found in any repository: ${key}`);
      if (file) fs.writeFileSync(file, JSON.stringify(c && { url: c.url, classes: [...c.classes], native: [...c.native] }));
      out.set(key, c);
    }
  };
  await Promise.all(Array.from({ length: ARTIFACT_CONCURRENCY }, worker));
  for (const [k, v] of [...out]) if (!v) out.delete(k);
  return out;
}

/**
 * Compare the declared dependencies with the APK. `deps` are the export's
 * dependency rows (`{ ecosystem, name, version, scope }`); `artifacts` maps
 * "name@version" to artifactContents(). Returns `{ rows, undeclared,
 * nativeUndeclared, summary }`:
 *   rows        per declared gradle dependency: `status` present | absent |
 *               cant-tell | not-fetched | other-version-shipped (the APK
 *               says it carries another listed version of the artifact), `matched` classes, `shippedVersion`
 *               from META-INF when the APK says, `native` comparisons
 *   undeclared  packages (first three name segments) of APK classes no
 *               declared artifact provides, outside `ownPrefixes`
 *   nativeFiles per .so in the APK: identical (a declared provider has the
 *               same code), differs (providers exist, none matches),
 *               undeclared, or cant-tell
 *   nativeUndeclared  .so files no declared aar carries
 */
export function compare(apk, deps, artifacts, { ownPrefixes = [], obfuscatedAbove = 0.3 } = {}) {
  const gradle = deps.filter(d => d.ecosystem === 'gradle' || d.ecosystem === 'maven');
  const claimed = new Set();
  const obfuscated = apk.obfuscatedShare > obfuscatedAbove;
  const rows = gradle.map((d) => {
    const art = artifacts.get(`${d.name}@${d.version}`);
    const shippedVersion = apk.versions.get(d.name) ?? null;
    if (!art) return { name: d.name, version: d.version, scope: d.scope ?? null, status: 'not-fetched', matched: 0, shippedVersion };
    let matched = 0;
    for (const c of art.classes) if (apk.classes.has(c)) { matched++; claimed.add(c); }
    const owned = new Set(art.classes);
    for (const c of apk.classes) if (!claimed.has(c) && owned.has(outerClass(c))) claimed.add(c); // its desugared lambdas
    const native = [];
    for (const [key, hash] of art.native) {
      const [abi, name] = key.split('/');
      const inApk = apk.native.find(n => n.abi === abi && n.name === name);
      native.push({ lib: key, inApk: Boolean(inApk), identical: inApk && hash && inApk.code ? inApk.code === hash : null });
    }
    const nativeIn = native.some(n => n.inApk);
    let status;
    if (matched || nativeIn) status = 'present';
    else if (!art.classes.size && !art.native.size) status = 'cant-tell'; // nothing to look for (a BOM, an empty platform module)
    else status = obfuscated ? 'cant-tell' : 'absent';
    return { name: d.name, version: d.version, scope: d.scope ?? null, status, matched, of: art.classes.size, shippedVersion, versionMatches: shippedVersion ? shippedVersion === d.version : null, native };
  });
  // The lockfile lists every version anything asked for; the APK carries one.
  // A listed version next to the shipped one is "not this version", not a mismatch.
  const listed = new Map();
  for (const r of rows) listed.set(r.name, [...(listed.get(r.name) || []), r.version]);
  for (const r of rows) {
    if (r.versionMatches === false && listed.get(r.name).includes(r.shippedVersion)) {
      r.status = 'other-version-shipped';
      r.versionMatches = null;
    }
  }
  // Per native file in the APK: who declares one by that name, and whether
  // any of their copies is the same code. Several aars carry their own
  // libc++_shared.so and other versions of one library are listed too; only
  // one copy can be packaged, so a file differs only when no provider matches.
  const nativeFiles = apk.native.map((n) => {
    const providers = rows.flatMap(r => (r.native || []).filter(x => x.lib === `${n.abi}/${n.name}`).map(x => ({ name: r.name, version: r.version, identical: x.identical })));
    const verdict = !providers.length ? 'undeclared' : providers.some(p => p.identical) ? 'identical' : providers.some(p => p.identical === false) ? 'differs' : 'cant-tell';
    return { path: n.path, size: n.size, sha256: n.sha256, verdict, providers };
  });
  const undeclaredCounts = new Map();
  for (const c of apk.classes) {
    if (claimed.has(c) || isGenerated(c) || OBFUSCATED_RE.test(c) || ownPrefixes.some(p => c.startsWith(p))) continue;
    const pkg = c.split('.').slice(0, -1).slice(0, 3).join('.') || '(default package)';
    undeclaredCounts.set(pkg, (undeclaredCounts.get(pkg) || 0) + 1);
  }
  const undeclared = [...undeclaredCounts].sort((a, b) => b[1] - a[1]).map(([pkg, classes]) => ({ package: pkg, classes }));
  const nativeUndeclared = nativeFiles.filter(n => n.verdict === 'undeclared').map(({ path: p, size, sha256: h }) => ({ path: p, size, sha256: h }));
  const by = (s) => rows.filter(r => r.status === s).length;
  const summary = {
    classes: apk.classes.size,
    obfuscatedShare: Number(apk.obfuscatedShare.toFixed(3)),
    declared: rows.length,
    present: by('present'),
    absent: by('absent'),
    cantTell: by('cant-tell'),
    notFetched: by('not-fetched'),
    otherVersionShipped: by('other-version-shipped'),
    versionMismatches: rows.filter(r => r.versionMatches === false).length,
    native: nativeFiles.length,
    nativeIdentical: nativeFiles.filter(n => n.verdict === 'identical').length,
    nativeDiffers: nativeFiles.filter(n => n.verdict === 'differs').length,
    undeclaredClasses: undeclared.reduce((n, u) => n + u.classes, 0),
    nativeUndeclared: nativeUndeclared.length,
    js: apk.js.length,
  };
  return { rows, undeclared, nativeFiles, nativeUndeclared, summary };
}
