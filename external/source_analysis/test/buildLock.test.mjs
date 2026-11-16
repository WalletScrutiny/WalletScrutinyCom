// The build's own download list (plugins/build-lock.mjs, issue 1000 step 2):
// build-lock.json output files on verifications, fetched by sha256 and
// hash-checked, tied to their build, turned into rows for the OSV check. No
// network: files.nostr.info is a stub. fixtures/build-lock.json is a
// hand-made schema 2 file (scripts/rb/README.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { buildLockRefs, reproducibleVersions } from '../reproducible.mjs';
import { initDatabase, saveReproducibleVersions, getReproducibleVersions, getBuildLockRefs, saveVerifiedRef, recordAnalysis, getAnalyses } from '../ddbbUtils.mjs';
import buildLockPlugin, { buildLockForReaders, loadBuildLock, parseBuildLock, matchBuild, gradleModules, compareWithResolution, checkBuildLocks, BUILD_LOCK_LOCKFILE } from '../plugins/build-lock.mjs';
import { buildQueries } from '../plugins/osv.mjs';
import { summarizeResults } from '../appAnalysis.mjs';
import { DEFAULT_BRANCH_REF, BUILD_LOCK_VERIFIERS } from '../config.mjs';

// a verifier on the list: only their build-lock.json is used
const LISTED = [...BUILD_LOCK_VERIFIERS][0];
import { buildApp } from '../export.mjs';
import { targetOfLockfile, targetOfLockfileInRepository } from '../products.mjs';

const FIXTURE = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'build-lock.json'));
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const FIXTURE_SHA = sha256(FIXTURE);
const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'build-lock-'));
const tmpDb = () => initDatabase(path.join(tmpDir(), 'assets.db'));

// files.nostr.info, serving blobs by sha256 and counting the requests
function blossom(blobs) {
  const stub = async (url) => {
    stub.requests.push(url);
    const body = blobs[url.split('/').pop()];
    return body === undefined
      ? { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) }
      : { ok: true, status: 200, arrayBuffer: async () => Uint8Array.from(Buffer.from(body)).buffer };
  };
  stub.requests = [];
  return stub;
}

const verification = ({ pubkey = 'a', id = `ev-${pubkey}`, appId = 'com.example.wallet', version = '1.2.3', platform = 'android', status = 'reproducible', created_at = 100, files = [] } = {}) => ({
  id, pubkey, created_at, kind: 30301,
  tags: [['status', status], ['d', `${appId}:${version}:${platform}:x`], ['i', appId], ['version', version], ['platform', platform],
    ...files.map(([name, hash]) => ['output-file', name, hash])],
});

const ref = (over = {}) => ({ sha256: FIXTURE_SHA, eventId: 'ev-a', pubkey: LISTED, appId: 'com.example.wallet', version: '1.2.3', platform: 'android', ...over });

// pinning's gradle analysis after gradle-resolution: okhttp and kotlin-stdlib
// resolved, appcompat resolved but never downloaded, one floating declaration
const gradleRow = (name, version, extra = {}) => ({ ecosystem: 'gradle', lockfile: 'app/build.gradle (gradle resolution)', name, version, resolved: '', integrity: '', direct: true, dev: false, scope: 'app', dependants: null, tier: 'version-pinned', ...extra });
const pinning = () => [{
  ecosystem: 'gradle', lockfiles: ['app/build.gradle'], resolutionNotes: [],
  entries: [
    gradleRow('com.squareup.okhttp3:okhttp', '4.9.0'),
    gradleRow('org.jetbrains.kotlin:kotlin-stdlib', '1.9.24'),
    gradleRow('androidx.appcompat:appcompat', '1.7.0'),
    gradleRow('com.example:floating', '1.+', { tier: 'floating' }),
  ],
}];

test('buildLockRefs: the exact name with a sha256 is a lock, a near-miss name is misnamed, anything else is ignored', () => {
  const e = verification({ files: [
    ['build-lock.json', FIXTURE_SHA.toUpperCase()],
    ['build-lock (1).json', 'ab'.repeat(32)],
    ['Build-Lock.json', 'cd'.repeat(32)],
    ['build-lock.json', 'not-a-hash'],
    ['build-lock.json', `sha256:${'ef'.repeat(32)}`],
    ['app-release.apk', 'ef'.repeat(32)],
  ] });
  const { locks, misnamed } = buildLockRefs(e);
  assert.deepEqual(locks, [ref({ pubkey: 'a' }), ref({ pubkey: 'a', sha256: 'ef'.repeat(32) })], 'the hash is lowercased, a sha256: prefix dropped; the one with a broken hash is dropped');
  assert.deepEqual(misnamed.map(m => m.name), ['build-lock (1).json', 'Build-Lock.json']);
});

test('reproducibleVersions keeps every verifier\'s build-lock.json, and a revised verification\'s is gone', () => {
  const byApp = reproducibleVersions([
    verification({ pubkey: 'a', created_at: 100, files: [['build-lock.json', FIXTURE_SHA]] }),
    verification({ pubkey: 'b', created_at: 200, files: [['build-lock (1).json', 'ab'.repeat(32)]] }),
    verification({ pubkey: 'c', created_at: 50, files: [['build-lock.json', 'cd'.repeat(32)]] }),
    verification({ pubkey: 'c', created_at: 60, status: 'not_reproducible' }),
  ]);
  const [v] = byApp.get('com.example.wallet');
  assert.equal(v.verifiedAt, 200);
  assert.deepEqual(v.buildLocks.map(l => l.pubkey), ['a']);
  assert.deepEqual(v.misnamedLocks.map(m => m.pubkey), ['b']);
});

test('the cached verifications keep the build-lock references, and a version without one keeps its old shape', () => {
  const db = tmpDb();
  const byApp = reproducibleVersions([
    verification({ files: [['build-lock.json', FIXTURE_SHA]] }),
    verification({ version: '1.2.2', created_at: 50 }),
  ]);
  saveReproducibleVersions(db, byApp);
  assert.deepEqual(getReproducibleVersions(db), byApp);
  assert.deepEqual(getBuildLockRefs(db, 'com.example.wallet', '1.2.3').locks, [ref({ pubkey: 'a' })]);
  assert.deepEqual(getBuildLockRefs(db, 'com.example.wallet', '1.2.2'), { locks: [], misnamed: [] });
});

test('loadBuildLock: fetched by sha256 and kept when the hash matches, read from the kept copy next time', async () => {
  const dir = tmpDir();
  const server = blossom({ [FIXTURE_SHA]: FIXTURE });
  const first = await loadBuildLock(FIXTURE_SHA, { dir, fetchImpl: server });
  assert.equal(first.source, 'fetched');
  assert.equal(first.text, FIXTURE.toString('utf8'));
  assert.deepEqual(server.requests, [`https://files.nostr.info/${FIXTURE_SHA}`]);
  assert.ok(fs.existsSync(path.join(dir, `${FIXTURE_SHA}.json`)));
  const second = await loadBuildLock(FIXTURE_SHA, { dir, fetchImpl: server });
  assert.equal(second.source, 'kept');
  assert.equal(server.requests.length, 1, 'no second download');
});

test('loadBuildLock: other bytes under the hash are reported and never kept; a damaged kept copy is fetched again', async () => {
  const dir = tmpDir();
  const tampered = Buffer.from(FIXTURE.toString('utf8').replace('1.13.1', '1.13.2'));
  const bad = await loadBuildLock(FIXTURE_SHA, { dir, fetchImpl: blossom({ [FIXTURE_SHA]: tampered }) });
  assert.deepEqual(bad, { mismatch: sha256(tampered) });
  assert.deepEqual(fs.readdirSync(dir), []);

  fs.writeFileSync(path.join(dir, `${FIXTURE_SHA}.json`), tampered);
  const server = blossom({ [FIXTURE_SHA]: FIXTURE });
  assert.equal((await loadBuildLock(FIXTURE_SHA, { dir, fetchImpl: server })).source, 'fetched');
  assert.deepEqual(fs.readFileSync(path.join(dir, `${FIXTURE_SHA}.json`)), FIXTURE);
});

test('loadBuildLock: missing, refused or too large is reported; a server error fails the step, so the analysis runs again next pass', async () => {
  assert.deepEqual(await loadBuildLock(FIXTURE_SHA, { dir: tmpDir(), fetchImpl: blossom({}) }), { problem: 'not-found' });
  const answer = (status, extra = {}) => async () => ({ ok: status < 400, status, arrayBuffer: async () => new ArrayBuffer(0), ...extra });
  assert.deepEqual(await loadBuildLock(FIXTURE_SHA, { dir: tmpDir(), fetchImpl: answer(403) }), { problem: 'unavailable', status: 403 });
  await assert.rejects(loadBuildLock(FIXTURE_SHA, { dir: tmpDir(), fetchImpl: answer(502) }), /HTTP 502/);
  await assert.rejects(loadBuildLock(FIXTURE_SHA, { dir: tmpDir(), fetchImpl: answer(429) }), /HTTP 429/);
  const huge = answer(200, { headers: new Headers({ 'content-length': String(65 * 1024 * 1024) }), arrayBuffer: async () => { throw new Error('read past the limit'); } });
  assert.deepEqual(await loadBuildLock(FIXTURE_SHA, { dir: tmpDir(), fetchImpl: huge }), { problem: 'too-large' });
  // no length announced: the stream is cut at the limit
  const endless = answer(200, { headers: new Headers(), body: new ReadableStream({ pull(c) { c.enqueue(new Uint8Array(8 * 1024 * 1024)); } }) });
  assert.deepEqual(await loadBuildLock(FIXTURE_SHA, { dir: tmpDir(), fetchImpl: endless }), { problem: 'too-large' });
  const result = await checkBuildLocks({ locks: [ref()], misnamed: [] }, pinning(), { dir: tmpDir(), fetchImpl: blossom({}) });
  assert.equal(result.files[0].problem, 'not-found');
  assert.deepEqual(result.platforms, {});
});

test('parseBuildLock reads the schema 2 fixture; schema 1 says nothing about its build; other JSON is not a build lock', () => {
  const file = parseBuildLock(FIXTURE.toString('utf8'));
  assert.deepEqual({ ...file, artifacts: file.artifacts.length }, {
    schema: 2, toolVersion: '0.3.0', appId: 'com.example.wallet', appVersion: '1.2.3', platform: 'android',
    commit: '0123456789abcdef0123456789abcdef01234567', generatedAt: '2026-11-10T06:00:00Z', artifacts: 8,
  });
  const v1 = parseBuildLock(JSON.stringify({ schema: 1, tool: 'ws-buildlock', version: '0.2.0', generatedAt: 'x', lockfiles: [], artifacts: [], appId: 'ignored' }));
  assert.equal(v1.appId, null, 'schema 1 has no such field, whatever the file carries');
  assert.deepEqual(parseBuildLock('{"tool":"other","artifacts":[]}'), { problem: 'not-a-build-lock' });
  assert.deepEqual(parseBuildLock('not json'), { problem: 'not-a-build-lock' });
});

test('matchBuild: same app, version and platform; another build names what differs; a file that does not say is not tied', () => {
  const file = parseBuildLock(FIXTURE.toString('utf8'));
  assert.deepEqual(matchBuild(file, ref()), { match: 'ok' });
  assert.deepEqual(matchBuild(file, ref({ platform: 'Android' })), { match: 'ok' }, 'case does not count');
  assert.deepEqual(matchBuild(file, ref({ version: '1.2.4', platform: 'iphone' })), { match: 'another-build', differ: [
    { field: 'appVersion', file: '1.2.3', event: '1.2.4' },
    { field: 'platform', file: 'android', event: 'iphone' },
  ] });
  assert.deepEqual(matchBuild({ ...file, platform: null }, ref()), { match: 'not-tied' });
});

test('compareWithResolution: modules only the build downloaded become rows, listed ones are not doubled, both differences', () => {
  const modules = gradleModules(parseBuildLock(FIXTURE.toString('utf8')).artifacts);
  assert.equal(modules.size, 4, 'one module per group:artifact@version, the committed jar is not one');
  const { added, builtNotResolved, resolvedNotBuilt } = compareWithResolution(modules, pinning());
  assert.deepEqual(builtNotResolved, ['androidx.core:core@1.13.1', 'com.android.tools.build:gradle@8.5.2']);
  assert.deepEqual(resolvedNotBuilt, ['androidx.appcompat:appcompat@1.7.0'], 'the floating declaration has no exact version to compare');
  const core = added.find(r => r.name === 'androidx.core:core');
  assert.equal(core.lockfile, BUILD_LOCK_LOCKFILE);
  assert.equal(core.integrity, `sha256:${modules.get('androidx.core:core@1.13.1').files.find(f => f.file.endsWith('.aar')).sha256}`, 'the aar, not the pom');
  assert.equal(core.tier, 'hash-pinned');
  assert.equal(core.scope, 'build', 'resolution found the app\'s modules, so one only the build downloaded is a build tool');
  assert.equal(core.dev, true);
  const unresolved = compareWithResolution(modules, [{ ecosystem: 'gradle', lockfiles: [], entries: [gradleRow('com.example:plugin', '1.0', { scope: 'build' })] }]);
  assert.equal(unresolved.added[0].scope, null, 'without resolved app rows nothing says what ships');
  assert.equal(unresolved.added[0].dev, null);
});

test('compareWithResolution: a module downloaded only as .pom or .module becomes no row and is named; a program the build runs counts', () => {
  const art = (name, version, ...files) => files.map(file => ({ ecosystem: 'gradle', name, version, file, sha256: createHash('sha256').update(file).digest('hex') }));
  const modules = gradleModules([
    ...art('com.google.guava:guava', '29.0-android', 'guava-29.0-android.pom'),
    ...art('androidx.compose:compose-bom', '2024.06.00', 'compose-bom-2024.06.00.pom', 'compose-bom-2024.06.00.module'),
    ...art('com.google.protobuf:protoc', '3.25.3', 'protoc-3.25.3.pom', 'protoc-3.25.3-linux-x86_64.exe'),
    ...art('org.jetbrains.kotlinx:atomicfu', '0.23.1', 'atomicfu-0.23.1.module', 'atomicfu-0.23.1.klib'),
    ...art('org.apache.httpcomponents:httpclient', '4.5.6', 'httpclient-4.5.6.pom', 'httpclient-4.5.6.jar'),
    // listed: keeps its row whatever was downloaded
    ...art('com.squareup.okhttp3:okhttp', '4.9.0', 'okhttp-4.9.0.pom'),
  ]);
  const { added, builtNotResolved, descriptionsOnly } = compareWithResolution(modules, pinning());
  assert.deepEqual(descriptionsOnly, ['androidx.compose:compose-bom@2024.06.00', 'com.google.guava:guava@29.0-android']);
  assert.deepEqual(builtNotResolved, ['com.google.protobuf:protoc@3.25.3', 'org.apache.httpcomponents:httpclient@4.5.6', 'org.jetbrains.kotlinx:atomicfu@0.23.1']);
  assert.equal(added.length, 3);
  assert.equal(added.find(r => r.name === 'com.google.protobuf:protoc').scope, 'build', 'protoc is a build tool, not dropped');
});

test('compareWithResolution: a program-only module keeps the program\'s hash, whatever order its files are listed in', () => {
  const sha = (file) => createHash('sha256').update(file).digest('hex');
  const art = (name, version, ...files) => files.map(file => ({ ecosystem: 'gradle', name, version, file, sha256: sha(file) }));
  // the order of BitBanana 1.1.1's build-lock.json: the .pom first
  const exe = 'protoc-gen-grpc-java-1.80.0-linux-x86_64.exe';
  const modules = gradleModules([
    ...art('io.grpc:protoc-gen-grpc-java', '1.80.0', 'protoc-gen-grpc-java-1.80.0.pom', exe),
    ...art('org.jetbrains.kotlinx:atomicfu', '0.23.1', 'atomicfu-0.23.1.module', 'atomicfu-0.23.1.klib'),
  ]);
  const { added } = compareWithResolution(modules, pinning());
  assert.equal(added.find(r => r.name === 'io.grpc:protoc-gen-grpc-java').integrity, `sha256:${sha(exe)}`);
  assert.equal(added.find(r => r.name === 'org.jetbrains.kotlinx:atomicfu').integrity, `sha256:${sha('atomicfu-0.23.1.klib')}`);
});

test('checkBuildLocks adds the build\'s rows to pinning, and OSV looks them up like any other row', async () => {
  const rows = pinning();
  const result = await checkBuildLocks({ locks: [ref()], misnamed: [] }, rows, { dir: tmpDir(), fetchImpl: blossom({ [FIXTURE_SHA]: FIXTURE }) });
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[1].lockfiles, ['build-lock.json (android)']);
  assert.ok(rows[1].entries.every(e => e.lockfile === 'build-lock.json (android)'));
  const { queries } = buildQueries(rows);
  assert.ok(queries.some(q => q.name === 'androidx.core:core' && q.version === '1.13.1'));
  assert.equal(queries.filter(q => q.name === 'com.squareup.okhttp3:okhttp').length, 1);
  assert.deepEqual(result.files, [{ sha256: FIXTURE_SHA, eventId: 'ev-a', pubkey: LISTED, platform: 'android', verifier: 'listed', schema: 2, appId: 'com.example.wallet', appVersion: '1.2.3', platform: 'android',
    commit: '0123456789abcdef0123456789abcdef01234567', generatedAt: '2026-11-10T06:00:00Z', match: 'ok', modules: 4 }]);
  assert.deepEqual(result.platforms, { android: { modules: 4,
    builtNotResolved: { count: 2, names: ['androidx.core:core@1.13.1', 'com.android.tools.build:gradle@8.5.2'] },
    descriptionsOnly: { count: 0, names: [] },
    resolvedNotBuilt: { count: 1, names: ['androidx.appcompat:appcompat@1.7.0'] } } });
  assert.equal(summarizeResults({ pinning: rows, 'build-lock': result }, []).buildLock, result);
});

test('checkBuildLocks: a file of another build is reported and adds nothing; a misnamed one is reported and never downloaded', async () => {
  const rows = pinning();
  const server = blossom({ [FIXTURE_SHA]: FIXTURE });
  const result = await checkBuildLocks({ locks: [ref({ version: '1.2.4' })], misnamed: [{ name: 'build-lock (1).json', sha256: 'ab'.repeat(32), eventId: 'ev-b', pubkey: 'b' }] }, rows, { dir: tmpDir(), fetchImpl: server });
  assert.equal(rows.length, 1, 'no rows from last week\'s list');
  assert.equal(result.files[0].match, 'another-build');
  assert.deepEqual(result.files[0].differ, [{ field: 'appVersion', file: '1.2.3', event: '1.2.4' }]);
  assert.deepEqual(result.platforms, {});
  assert.deepEqual(result.misnamed, [{ name: 'build-lock (1).json', sha256: 'ab'.repeat(32), eventId: 'ev-b', platform: null }]);
  assert.deepEqual(server.requests, [`https://files.nostr.info/${FIXTURE_SHA}`], 'only the correctly named file');
});

test('checkBuildLocks: a file that does not say which build it is adds nothing', async () => {
  const rows = pinning();
  const v1 = Buffer.from(JSON.stringify({ schema: 1, tool: 'ws-buildlock', version: '0.2.0', generatedAt: 't', lockfiles: [],
    artifacts: [{ ecosystem: 'gradle', name: 'evil:mal', version: '1.0', file: 'mal-1.0.jar', sha1: 'x', sha256: 'y' }] }));
  const result = await checkBuildLocks({ locks: [ref({ sha256: sha256(v1) })], misnamed: [] }, rows, { dir: tmpDir(), fetchImpl: blossom({ [sha256(v1)]: v1 }) });
  assert.equal(result.files[0].match, 'not-tied');
  assert.deepEqual(result.platforms, {});
  assert.equal(rows.length, 1, 'no rows from it, so no advisory or alert either');
});

test('checkBuildLocks: a file from a verifier not on the list is reported, never downloaded, and adds nothing', async () => {
  const rows = pinning();
  const server = blossom({ [FIXTURE_SHA]: FIXTURE });
  const result = await checkBuildLocks({ locks: [ref({ pubkey: 'b'.repeat(64), eventId: 'ev-b' })], misnamed: [] }, rows, { dir: tmpDir(), fetchImpl: server });
  assert.deepEqual(result.files, [{ sha256: FIXTURE_SHA, eventId: 'ev-b', pubkey: 'b'.repeat(64), platform: 'android', verifier: 'unlisted' }]);
  assert.deepEqual(result.platforms, {});
  assert.equal(rows.length, 1, 'no rows from it, so no advisory or alert either');
  assert.deepEqual(server.requests, []);
  assert.equal(buildLockForReaders(result).files[0].verifier, 'unlisted');
});

test('checkBuildLocks: a hash mismatch is reported and nothing of the file is read; no build lock at all is null', async () => {
  const rows = pinning();
  const result = await checkBuildLocks({ locks: [ref()], misnamed: [] }, rows, { dir: tmpDir(), fetchImpl: blossom({ [FIXTURE_SHA]: 'something else' }) });
  assert.equal(result.files[0].problem, 'hash-mismatch');
  assert.equal(rows.length, 1);
  assert.equal(await checkBuildLocks({ locks: [], misnamed: [] }, rows), null);
});

test('checkBuildLocks: an Android and an iPhone verification of one version each get their own rows and differences', async () => {
  const fixture = JSON.parse(FIXTURE.toString('utf8'));
  const ios = Buffer.from(JSON.stringify({ ...fixture, platform: 'iphone',
    artifacts: [{ ecosystem: 'gradle', name: 'org.example:kmp-only', version: '2.0', file: 'kmp-only-2.0.jar', sha1: 'x', sha256: 'cd'.repeat(32) }] }));
  const rows = pinning();
  const result = await checkBuildLocks({ locks: [ref(), ref({ sha256: sha256(ios), eventId: 'ev-ios', platform: 'iphone' })], misnamed: [] }, rows,
    { dir: tmpDir(), fetchImpl: blossom({ [FIXTURE_SHA]: FIXTURE, [sha256(ios)]: ios }) });
  assert.deepEqual(rows.slice(1).map(a => [a.lockfiles[0], a.entries.map(e => e.name)]), [
    ['build-lock.json (android)', ['androidx.core:core', 'com.android.tools.build:gradle']],
    ['build-lock.json (iphone)', ['org.example:kmp-only']],
  ]);
  assert.deepEqual(Object.keys(result.platforms), ['android', 'iphone']);
  assert.equal(result.platforms.iphone.modules, 1);
  assert.equal(result.platforms.iphone.builtNotResolved.count, 1, 'Android\'s modules are not the iPhone build\'s');
});

test('a build-lock row counts on its own platform\'s page only, whatever the repository\'s rules say', () => {
  assert.equal(targetOfLockfile('build-lock.json (android)', 'world.bitkey.app'), 'android');
  assert.equal(targetOfLockfile('build-lock.json (iphone)'), 'iphone');
  assert.equal(targetOfLockfile('build-lock.json (hardware)'), 'firmware');
  assert.equal(targetOfLockfile('build-lock.json (bearer)'), 'shared', 'a platform no page filters counts like any shared file');
  assert.equal(targetOfLockfileInRepository('build-lock.json (desktop)', 'https://github.com/x/y'), 'desktop');
  assert.equal(targetOfLockfileInRepository('app/build.gradle', 'https://github.com/nobody/without-rules'), 'shared');
});

test('the plugin finds the build lock of a release by its verified version, and stays out of the default branch', async (t) => {
  const db = tmpDb();
  saveReproducibleVersions(db, reproducibleVersions([verification({ pubkey: LISTED, files: [['build-lock.json', FIXTURE_SHA]] })]));
  // the kept copy, so the step needs no server
  const dir = path.join(path.dirname(db.name), 'build-locks');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${FIXTURE_SHA}.json`), FIXTURE);
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('no network in tests'); });
  const plugin = buildLockPlugin;

  // the tag names the version (v1.2.3), before the pass mapped it
  const results = { pinning: pinning() };
  const found = await plugin.host({ name: 'com.example.wallet', version: 'v1.2.3', db, results });
  assert.equal(found.files[0].match, 'ok');
  assert.equal(results.pinning.length, 2);

  // a tag that does not name it, once the pass mapped it
  saveVerifiedRef(db, 'com.example.wallet', 'release-42', '1.2.3');
  assert.equal((await plugin.host({ name: 'com.example.wallet', version: 'release-42', db, results: { pinning: pinning() } })).files.length, 1);

  assert.equal(await plugin.host({ name: 'com.example.wallet', version: 'v1.2.2', db, results: { pinning: pinning() } }), undefined);
  // another product's tag of the same version is not guessed to be this verification's
  assert.equal(await plugin.host({ name: 'com.example.wallet', version: 'desktop-v1.2.3', db, results: { pinning: pinning() } }), undefined);
  assert.equal(await buildLockPlugin.host({ name: 'com.example.wallet', version: DEFAULT_BRANCH_REF, db, results: { pinning: pinning() } }), undefined);
});

test('the analyses row keeps the build-lock result', () => {
  const db = tmpDb();
  const buildLock = { files: [{ sha256: FIXTURE_SHA, platform: 'android', match: 'ok' }], misnamed: [], platforms: { android: { modules: 4, builtNotResolved: { count: 0, names: [] }, resolvedNotBuilt: { count: 0, names: [] } } } };
  recordAnalysis(db, { appId: 'com.example.wallet', kind: 'release', ref: 'v1.2.3', status: 'ok', analyser: 'test', buildLock });
  recordAnalysis(db, { appId: 'com.example.wallet', kind: 'release', ref: 'v1.2.2', status: 'ok', analyser: 'test' });
  const byRef = Object.fromEntries(getAnalyses(db, 'com.example.wallet').map(a => [a.ref, a.build_lock]));
  assert.deepEqual(byRef, { 'v1.2.3': buildLock, 'v1.2.2': null });
});

test('the export gives the wallet page each file\'s outcome, the misnamed names and at most 20 names per difference', () => {
  const db = tmpDb();
  const names = Array.from({ length: 25 }, (_, i) => `g:a${i}@1.0`);
  const buildLock = {
    files: [{ sha256: FIXTURE_SHA, eventId: 'ev-a', pubkey: 'a', schema: 2, appId: 'x', appVersion: '1', platform: 'android', commit: 'c0ffee', generatedAt: 't', match: 'ok', modules: 30 },
      { sha256: 'ab'.repeat(32), eventId: 'ev-b', pubkey: 'b', platform: 'iphone', schema: 2, match: 'another-build', differ: [{ field: 'appVersion', file: '1.2.2', event: '1.2.3' }] }],
    misnamed: [{ name: 'build-lock (1).json', sha256: null, eventId: 'ev-c', platform: 'android' }],
    platforms: { android: { modules: 30, builtNotResolved: { count: 25, names }, resolvedNotBuilt: { count: 0, names: [] } } },
  };
  recordAnalysis(db, { appId: 'com.example.wallet', kind: 'release', ref: 'v1.2.3', commit: 'c1', status: 'ok', appType: 'gradle', analyser: 't', buildLock });
  const shown = buildApp(db, 'com.example.wallet').releases[0].buildLock;
  assert.deepEqual(shown, buildLockForReaders(buildLock));
  assert.deepEqual(shown.files, [
    { platform: 'android', verifier: 'listed', match: 'ok', problem: null, differ: null, schema: 2, commit: 'c0ffee', modules: 30 },
    { platform: 'iphone', verifier: 'listed', match: 'another-build', problem: null, differ: [{ field: 'appVersion', file: '1.2.2', event: '1.2.3' }], schema: 2, commit: null, modules: null },
  ]);
  assert.deepEqual(shown.misnamed, [{ name: 'build-lock (1).json', platform: 'android' }]);
  assert.deepEqual(shown.platforms.android.builtNotResolved, { count: 25, names: names.slice(0, 20) });
  assert.equal(buildLockForReaders(null), null);
});
