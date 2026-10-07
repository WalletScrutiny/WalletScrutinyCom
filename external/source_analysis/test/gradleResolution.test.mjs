// Test 7b: gradle dependency resolution. gradle itself is not run here; the
// init script's output and the fold into test 7's rows are.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  findGradleBuilds, wrapperGradleVersion, jdkForGradle, parseResolution, isShippedConfiguration, mergeResolved,
  RESOLVED_LOCKFILE_SUFFIX, resolveGradleDependencies,
} from '../plugins/gradle-resolution.mjs';
import { uncheckableReason } from '../plugins/osv.mjs';

function fixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gradle-res-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

const line = (o) => JSON.stringify({ project: ':app', direct: false, ...o });

test('builds are found where a wrapper sits beside the settings or build file', () => {
  const dir = fixture({
    'settings.gradle': '', gradlew: '', 'app/build.gradle': '',
    'android/settings.gradle.kts': '', 'android/gradlew': '', // a second build
    'lib/build.gradle': '', // no wrapper: not runnable
  });
  assert.deepEqual(findGradleBuilds(dir).map(d => path.relative(dir, d) || '.'), ['.']);
  const nested = fixture({ 'android/settings.gradle.kts': '', 'android/gradlew': '', 'tools/build.gradle': '', 'tools/gradlew': '' });
  assert.deepEqual(findGradleBuilds(nested).map(d => path.relative(nested, d)).sort(), ['android', 'tools']);
});

test('the JDK follows the wrapper gradle version', () => {
  const dir = fixture({ 'gradle/wrapper/gradle-wrapper.properties': 'distributionUrl=https\\://services.gradle.org/distributions/gradle-7.2-bin.zip\n' });
  assert.equal(wrapperGradleVersion(dir), '7.2');
  assert.equal(jdkForGradle('7.2'), 11);
  assert.equal(jdkForGradle('7.3'), 17);
  assert.equal(jdkForGradle('8.14.3'), 17);
  assert.equal(jdkForGradle('9.1.0'), 17);
  assert.equal(jdkForGradle('4.10.3'), 8);
  assert.equal(jdkForGradle(null), 17);
});

test('shipped configurations are release runtime classpaths', () => {
  for (const n of ['releaseRuntimeClasspath', 'runtimeClasspath', 'fdroidReleaseRuntimeClasspath', 'androidReleaseRuntimeClasspath', 'jvmRuntimeClasspath']) {
    assert.equal(isShippedConfiguration(n), true, n);
  }
  for (const n of ['debugRuntimeClasspath', 'releaseUnitTestRuntimeClasspath', 'releaseCompileClasspath', 'kapt', 'buildscript:classpath', 'testRuntimeClasspath']) {
    assert.equal(isShippedConfiguration(n), false, n);
  }
});

test('the init script output is folded per module across configurations', () => {
  const { modules, unresolved, errors } = parseResolution([
    line({ configuration: 'releaseRuntimeClasspath', group: 'com.squareup.okhttp3', module: 'okhttp', version: '4.12.0', direct: true }),
    line({ configuration: 'debugRuntimeClasspath', group: 'com.squareup.okhttp3', module: 'okhttp', version: '4.12.0' }),
    line({ configuration: 'releaseRuntimeClasspath', group: 'com.squareup.okio', module: 'okio', version: '3.6.0' }),
    line({ configuration: 'kapt', group: 'com.google.dagger', module: 'dagger-compiler', version: '2.50', direct: true }),
    line({ configuration: 'releaseRuntimeClasspath', unresolved: 'com.example:gone:1.0', reason: 'not found' }),
    line({ configuration: 'iosArm64CompileKlibraries', error: 'ambiguous variants' }),
    'not json',
  ].join('\n'));
  assert.equal(modules.size, 3);
  const okhttp = modules.get('com.squareup.okhttp3:okhttp:4.12.0');
  assert.equal(okhttp.direct, true);
  assert.equal(okhttp.shipped, true);
  assert.equal(modules.get('com.google.dagger:dagger-compiler:2.50').shipped, false);
  assert.deepEqual(unresolved, ['com.example:gone:1.0']);
  assert.equal(errors.length, 1);
});

test('resolved modules replace declarations, keep metadata hashes, leave unresolved declarations', () => {
  const row = (name, version, extra = {}) => ({
    ecosystem: 'gradle', lockfile: 'app/build.gradle', name, version, resolved: '', integrity: '', direct: true, dev: false, tier: 'version-pinned', ...extra,
  });
  const analysis = {
    entries: [
      row('com.squareup.okhttp3:okhttp', '4.9.0'), // declared, gradle picked 4.12.0
      row('org.bouncycastle:bcprov-jdk18on', '1.+', { tier: 'floating' }),
      row('com.android.tools.build:gradle', '8.5.0'), // a plugin: not in any resolved classpath here
      row('androidx.core:core', '1.13.1', { lockfile: 'gradle/verification-metadata.xml', integrity: 'sha256:abc', tier: 'hash-pinned', direct: false, dev: null }),
    ],
    resolutionNotes: [],
  };
  const { modules } = parseResolution([
    line({ configuration: 'releaseRuntimeClasspath', group: 'com.squareup.okhttp3', module: 'okhttp', version: '4.12.0', direct: true }),
    line({ configuration: 'releaseRuntimeClasspath', group: 'com.squareup.okio', module: 'okio', version: '3.6.0' }),
    line({ configuration: 'releaseRuntimeClasspath', group: 'org.bouncycastle', module: 'bcprov-jdk18on', version: '1.78.1', direct: true }),
    line({ configuration: 'releaseRuntimeClasspath', group: 'androidx.core', module: 'core', version: '1.13.1' }),
    line({ configuration: 'testRuntimeClasspath', group: 'junit', module: 'junit', version: '4.13.2', direct: true }),
  ].join('\n'));
  const lockfile = `.${RESOLVED_LOCKFILE_SUFFIX}`;
  assert.equal(mergeResolved(analysis, modules, lockfile), 4);
  const get = (name) => analysis.entries.filter(e => e.name === name);

  assert.deepEqual(get('com.squareup.okhttp3:okhttp').map(e => [e.version, e.tier, e.lockfile, e.direct, e.dev]),
    [['4.12.0', 'version-pinned', lockfile, true, false]]);
  assert.deepEqual(get('com.squareup.okio:okio').map(e => [e.version, e.direct, e.dev]), [['3.6.0', false, false]]);
  // still floating as declared, but now with the version gradle picked, so OSV can check it
  const bc = get('org.bouncycastle:bcprov-jdk18on');
  assert.deepEqual(bc.map(e => [e.version, e.tier]), [['1.78.1', 'floating']]);
  assert.equal(uncheckableReason(bc[0]), null);
  assert.equal(uncheckableReason({ ...bc[0], version: '1.+' }), 'floating');
  assert.deepEqual(get('com.android.tools.build:gradle').map(e => e.version), ['8.5.0']);
  assert.deepEqual(get('androidx.core:core').map(e => [e.integrity, e.tier, e.dev]), [['sha256:abc', 'hash-pinned', false]]);
  assert.deepEqual(get('junit:junit').map(e => e.dev), [true]);
});

test('a resolved build replaces the declaration-only JitPack note; a failed one keeps the declarations', async () => {
  // stands in for the wrapper: writes one module to the file named by -DwsDepsOut
  const gradlew = 'for a in "$@"; do case "$a" in -DwsDepsOut=*) out="${a#-DwsDepsOut=}";; esac; done\n' +
    `echo '${line({ configuration: 'releaseRuntimeClasspath', group: 'com.github.x', module: 'lib', version: 'abc123', direct: true })}' > "$out"\n`;
  const declaredNote = 'jitpack.io is in the resolution list, and this pass counts DECLARED dependencies only — JitPack coordinates pulled in transitively by other libraries never appear in a manifest and are not counted here';
  const pinning = () => [{ ecosystem: 'gradle', entries: [], resolutionNotes: [declaredNote] }];

  const ok = pinning();
  await resolveGradleDependencies(fixture({ 'settings.gradle': '', gradlew }), ok);
  assert.deepEqual(ok[0].entries.map(e => [e.name, e.version, e.dev]), [['com.github.x:lib', 'abc123', false]]);
  assert.equal(ok[0].resolutionNotes.some(n => n.includes('DECLARED')), false);

  const failed = pinning();
  await resolveGradleDependencies(fixture({ 'settings.gradle': '', gradlew: 'echo "NDK not configured" >&2; exit 1\n' }), failed);
  assert.equal(failed[0].entries.length, 0);
  assert.equal(failed[0].resolutionNotes[0], declaredNote);
  assert.match(failed[0].resolutionNotes[1], /gradle resolution failed/);
});
