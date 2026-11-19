import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// scripts/rb/lib/ws-rb-core-1.1.0.sh: sourcing without side effects, the
// container mount, ws_run_gradle and ws_gradle_failure_kind (GitLab #1023).

const here = path.dirname(fileURLToPath(import.meta.url));
const libDir = path.resolve(here, '../../scripts/rb/lib');
const lib = path.join(libDir, 'ws-rb-core-1.1.0.sh');
const loader = path.join(libDir, 'ws-rb-loader.snippet.sh');
const libSha = crypto.createHash('sha256').update(fs.readFileSync(lib)).digest('hex');

const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));
const bash = (script, opts = {}) => spawnSync('bash', ['-c', script, 'bash', lib], { encoding: 'utf8', ...opts });

// Fake commands that record any call: sourcing must call none of them.
function fakeBin() {
  const dir = tmp('rblib-bin-');
  const calls = path.join(dir, 'calls');
  for (const cmd of ['curl', 'wget', 'podman', 'docker', 'git', 'nc', 'flock', 'mkdir', 'touch', 'tee']) {
    fs.writeFileSync(path.join(dir, cmd), `#!/bin/sh\necho ${cmd} >> '${calls}'\nexit 1\n`, { mode: 0o755 });
  }
  return { dir, calls };
}

test('sourcing defines functions and variables only: no output, files, traps, commands or exit', () => {
  const cwd = tmp('rblib-src-');
  const home = tmp('rblib-home-');
  const { dir, calls } = fakeBin();
  const r = bash(`set -euo pipefail
    before="$(trap -p)"
    . "$1"
    [[ "$(trap -p)" == "$before" ]] || { echo "TRAPS: $(trap -p)"; exit 3; }
    for f in ws_run_gradle ws_gradle_failure_kind ws_lib_mount ws_no_verdict; do
      declare -F "$f" >/dev/null || { echo "missing $f"; exit 4; }
    done
    [[ "$WS_LIB_LOADED_VERSION" == 1.1.0 && -z "$WS_ENGINE" ]] || exit 5
    exit 0`, { cwd, env: { PATH: `${dir}:/usr/bin:/bin`, HOME: home, TMPDIR: home } });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.stdout, '');
  assert.equal(r.stderr, '');
  assert.deepEqual(fs.readdirSync(cwd), []);
  assert.deepEqual(fs.readdirSync(home), []);
  assert.equal(fs.existsSync(calls), false, fs.existsSync(calls) ? fs.readFileSync(calls, 'utf8') : '');
});

test('ws_lib_mount appends a read-only mount and the hash; a missing file is no verdict', () => {
  const r = bash(`. "$1"; WS_LIB_PATH="$1" WS_LIB_SHA256=${libSha}
    a=(--rm); ws_lib_mount a; printf '%s\\n' "\${a[@]}"`);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.stdout.trim().split('\n'),
    ['--rm', '-v', `${lib}:/ws-rb/ws-rb-core.sh:ro`, '-e', `WS_LIB_SHA256=${libSha}`]);

  const gone = bash(`. "$1"; WS_LIB_PATH=/nonexistent WS_LIB_SHA256=${libSha}; a=(); ws_lib_mount a; echo reached`);
  assert.equal(gone.status, 1);
  assert.doesNotMatch(gone.stdout, /reached/);
  assert.match(gone.stderr, /library file is gone/);
});

// The container side as a build script writes it: check the hash, source, build.
const containerSide = (gradleBody, logPath) => `set -euo pipefail
  echo "$WS_LIB_SHA256  $LIBFILE" | sha256sum -c --quiet - || exit 91
  . "$LIBFILE"
  gradle() { ${gradleBody}; }
  ws_run_gradle '${logPath}' clean assembleRelease
  echo after-gradle`;

function runContainerSide(gradleBody, { logPath, libFile = lib, sha = libSha } = {}) {
  const dir = tmp('rblib-run-');
  const log = logPath ?? path.join(dir, 'gradle.log');
  const r = spawnSync('bash', ['-c', containerSide(gradleBody, log)], {
    encoding: 'utf8', env: { PATH: '/usr/bin:/bin', LIBFILE: libFile, WS_LIB_SHA256: sha },
  });
  return { r, log };
}

for (const code of [0, 1, 42, 137]) {
  test(`ws_run_gradle with a working log keeps Gradle's exit code ${code}`, () => {
    const { r, log } = runContainerSide(`echo "gradle $*"; return ${code}`);
    assert.equal(r.status, code, r.stderr);
    assert.match(fs.readFileSync(log, 'utf8'), /^gradle clean assembleRelease --no-daemon$/m);
    assert.match(r.stdout, /gradle clean assembleRelease --no-daemon/); // live output too
    assert.equal(fs.existsSync(`${log}.ok`), code === 0);
    assert.equal(r.stdout.includes('after-gradle'), code === 0);
  });
}

for (const code of [0, 42]) {
  test(`ws_run_gradle exits 90 when the log cannot be written (Gradle ${code})`, () => {
    const { r } = runContainerSide(`echo out; return ${code}`, { logPath: '/dev/full' });
    assert.equal(r.status, 90, r.stdout + r.stderr);
    assert.match(r.stdout, /Gradle log not written/);
  });
}

test('ws_run_gradle leaves the caller without set -e as it was', () => {
  const r = bash(`. "$1"; set +e; gradle() { return 0; }
    d="$(mktemp -d)"; ws_run_gradle "$d/g.log" build >/dev/null; rm -rf "$d"
    [[ $- == *e* ]] && echo errexit-on || echo errexit-off`);
  assert.equal(r.stdout.trim(), 'errexit-off', r.stderr);
});

test('the container side refuses an altered library with exit 91, before running anything', () => {
  const dir = tmp('rblib-alt-');
  const altered = path.join(dir, 'ws-rb-core.sh');
  fs.writeFileSync(altered, fs.readFileSync(lib, 'utf8') + '\necho injected\n');
  const { r } = runContainerSide('echo should-not-run; return 0', { libFile: altered });
  assert.equal(r.status, 91);
  assert.doesNotMatch(r.stdout, /should-not-run|injected/);
});

const kinds = {
  source: [
    'e: file:///app/src/main/java/A.kt:12:5 Unresolved reference: foo',
    'e: /app/src/main/java/A.kt: (12, 5): Unresolved reference: foo',
    '/app/src/main/java/A.java:7: error: cannot find symbol',
    "Execution failed for task ':app:compileReleaseKotlin'.\n> Compilation error. See log for more details\nCompilation failed; see the compiler error output for details.",
    'Script compilation error:\n  Line 3: plugins {',
    'ERROR: /app/res/values/strings.xml:4: AAPT: error: resource string/x not found.',
    "Execution failed for task ':app:processReleaseResources'.\n> Android resource linking failed",
  ],
  unknown: [
    "Execution failed for task ':app:mergeReleaseResources'.\n> java.nio.file.AccessDeniedException: /app/build/x",
    "Execution failed for task ':app:compileReleaseKotlin'.\n> A failure occurred while executing org.gradle.workers.internal.WorkerDaemon",
    "FAILURE: Build failed with an exception.\n* What went wrong:\nExecution failed for task ':app:lintVitalRelease'.",
    'Gradle build daemon disappeared unexpectedly (it may have been killed or may have crashed)',
    '',
    // The daemon's own command line names these JVM flags in every --info run.
    "Starting process 'Gradle build daemon'. Command: java -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Xmx8g\nExecution failed for task ':app:x'.",
    'The Daemon will expire after the build after running out of JVM Metaspace.',
  ],
  infra: [
    'Connect to repo.maven.apache.org:443 failed: Connection timed out',
    "> Could not GET 'https://jitpack.io/x.pom'. Received status code 502 from server: Bad Gateway",
    "> Could not resolve all files for configuration ':app:releaseRuntimeClasspath'.",
    'java.io.IOException: No space left on device',
    'Exception in thread "main" java.lang.OutOfMemoryError: Metaspace',
    "Execution failed for task ':app:x'.\n> Java heap space",
    "Execution failed for task ':app:x'.\n> Metaspace",
    // Infra wins over a diagnostic in the same log.
    "e: /app/A.kt: (1, 1): x\n> Could not resolve com.example:lib:1.0.",
  ],
};

for (const [want, logs] of Object.entries(kinds)) {
  logs.forEach((text, i) => {
    test(`ws_gradle_failure_kind: ${want} #${i + 1}`, () => {
      const f = path.join(tmp('rblib-kind-'), 'gradle.log');
      fs.writeFileSync(f, text ? `${text}\n` : '');
      const out = spawnSync('bash', ['-c', '. "$1"; ws_gradle_failure_kind "$2"', 'bash', lib, f], { encoding: 'utf8' });
      assert.equal(out.status, 0, out.stderr);
      const kind = out.stdout.trim();
      if (want === 'infra') assert.match(kind, /^infra: /);
      else assert.equal(kind, want);
    });
  });
}

test('ws_gradle_failure_kind: a missing log is unknown', () => {
  const out = spawnSync('bash', ['-c', '. "$1"; ws_gradle_failure_kind /nonexistent/gradle.log', 'bash', lib], { encoding: 'utf8' });
  assert.equal(out.stdout.trim(), 'unknown');
});

test('the loader records the verified file for the mount and keeps a temporary copy until exit', () => {
  const dir = tmp('rblib-ldr-');
  const script = path.join(dir, 'x_build.sh');
  const body = fs.readFileSync(loader, 'utf8').replace('__SHA256__', libSha).replace('__COMMIT__', 'deadbeef');
  fs.writeFileSync(script, `${body}\necho "path=$WS_LIB_PATH tmp=$WS_LIB_TMP"\n`);
  const r = spawnSync('bash', [script], { encoding: 'utf8', env: { PATH: '/usr/bin:/bin', WS_LIB_FILE: lib } });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, new RegExp(`path=${lib} tmp=$`, 'm'));

  // An exit trap removes a temporary folder the loader had to use.
  const t = tmp('rblib-t-');
  const r2 = bash(`. "$1"; WS_LIB_TMP='${t}'; ws_install_traps; exit 0`);
  assert.equal(r2.status, 0, r2.stderr);
  assert.equal(fs.existsSync(t), false);
});
