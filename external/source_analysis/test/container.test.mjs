// The sandbox around every repository: how the container is started (nothing
// secret inside, hardened, limited), how its result comes back, what happens
// on failure and timeout, and the cache cap. docker is a stub script here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { buildRunArgs, containerEnv, runInContainer, pruneCache, dirSizeBytes, ANALYSIS_DIR } from '../containerRunner.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

// A fake docker: records its argv, then behaves as `body` says (bash).
function stubDocker(body) {
  const dir = tmp('sa-docker-');
  const file = path.join(dir, 'docker');
  fs.writeFileSync(file, `#!/usr/bin/env bash
printf '%s\\n' "$@" > "${dir}/argv.$1"
${body}
`);
  fs.chmodSync(file, 0o755);
  return { cli: file, argv: (sub) => fs.readFileSync(path.join(dir, `argv.${sub}`), 'utf8').trim().split('\n') };
}

// Path of the host dir mounted at /work, taken from the recorded argv.
const workMount = 'for a in "$@"; do case "$a" in *:/work:rw) echo "${a%:/work:rw}";; esac; done';

test('buildRunArgs: hardened, limited, no secrets, our folder read-only, entry args last', () => {
  const args = buildRunArgs({ image: 'img@sha256:abc', name: 'sa-x', workDir: '/w', cacheDir: '/c', uid: 1000, gid: 1000, entryArgs: ['--name', 'x', '--repo', 'https://github.com/o/r', '--ref', 'v1'] });
  const flat = args.join(' ');
  for (const needed of ['--rm', '--user 1000:1000', '--cap-drop ALL', '--security-opt no-new-privileges', '--read-only', '--pids-limit', '--memory', '--cpus']) {
    assert.ok(flat.includes(needed), `missing ${needed}: ${flat}`);
  }
  assert.ok(args.includes(`${path.resolve(ANALYSIS_DIR)}:/analysis:ro`));
  assert.ok(args.includes('/w:/work:rw'));
  assert.ok(args.includes('/c:/cache:rw'));
  assert.ok(!flat.includes('docker.sock'));
  const envArgs = args.filter((a, i) => args[i - 1] === '-e');
  assert.ok(!envArgs.some(a => /TOKEN|SECRET|GITHUB_/i.test(a)), `no token reaches the container: ${envArgs}`);
  assert.ok(args.indexOf('img@sha256:abc') > args.lastIndexOf('-e'), 'image comes after every option');
  assert.deepEqual(args.slice(-4), ['--repo', 'https://github.com/o/r', '--ref', 'v1']);
  const env = containerEnv();
  assert.equal(env.npm_config_ignore_scripts, 'true');
  assert.equal(env.GIT_TERMINAL_PROMPT, '0');
  assert.ok(env.GRADLE_USER_HOME.startsWith('/cache/') && env.npm_config_cache.startsWith('/cache/'));
  assert.equal(env.PIP_USER, '1');
});

test('ensureImage: a missing image is pulled once; an unavailable one fails every call without re-pulling', async () => {
  const { ensureImage } = await import('../containerRunner.mjs');
  const ok = stubDocker('[ "$1" = image ] && exit 1; exit 0');
  ensureImage('img-a', ok.cli);
  ensureImage('img-a', ok.cli);
  assert.equal(ok.argv('pull')[1], 'img-a');
  const bad = stubDocker('exit 1');
  assert.throws(() => ensureImage('img-b', bad.cli), /not available/);
  fs.unlinkSync(bad.cli); // no docker at all from now on: the memoised failure must answer
  assert.throws(() => ensureImage('img-b', bad.cli), /not available/);
});

test('runInContainer: returns the result the entry point leaves in /work', async () => {
  const stub = stubDocker(`[ "$1" = run ] || exit 0
W=$(${workMount})
echo '{"ok":true,"appType":"npm","pinning":[{"ecosystem":"npm","entries":[]}]}' > "$W/result.json"`);
  const workDir = tmp('sa-work-');
  const result = await runInContainer({ name: 'app', repoUrl: 'https://github.com/o/r', ref: 'v2', workDir, cli: stub.cli, cacheDir: tmp('sa-cache-'), timeoutMs: 10000 });
  assert.equal(result.ok, true);
  assert.equal(result.appType, 'npm');
  const argv = stub.argv('run');
  assert.equal(argv[0], 'run');
  assert.deepEqual(argv.slice(-6), ['--name', 'app', '--repo', 'https://github.com/o/r', '--ref', 'v2']);
  assert.ok(fs.existsSync(path.join(workDir, 'home')), 'HOME inside the container is prepared on the host side');
});

test('runInContainer: a container that leaves no result is an error with its exit status', async () => {
  const stub = stubDocker('[ "$1" = run ] && exit 3; exit 0');
  await assert.rejects(
    runInContainer({ name: 'app', repoUrl: 'u', workDir: tmp('sa-work-'), cli: stub.cli, cacheDir: tmp('sa-cache-'), timeoutMs: 10000 }),
    /exited with 3 and left no result/);
});

test('runInContainer: a run past the timeout is killed and reported as such', async () => {
  const stub = stubDocker('[ "$1" = run ] && sleep 20; exit 0');
  const started = Date.now();
  await assert.rejects(
    runInContainer({ name: 'slow', repoUrl: 'u', workDir: tmp('sa-work-'), cli: stub.cli, cacheDir: tmp('sa-cache-'), timeoutMs: 500 }),
    /timed out/);
  assert.ok(Date.now() - started < 10000, 'did not wait for the stub to finish');
  assert.equal(stub.argv('kill')[0], 'kill', 'the container was asked to stop by name');
});

test('containerEntry: clone + checks on a repository without a known manifest, result.json written', () => {
  // A local repository: no package.json etc., so nothing is installed and no
  // network is needed; the file-only checks still run.
  const repo = tmp('sa-repo-');
  execFileSync('git', ['-C', repo, 'init', '-q', '-b', 'main']);
  fs.writeFileSync(path.join(repo, 'README.md'), 'hello\n');
  execFileSync('git', ['-C', repo, '-c', 'user.name=t', '-c', 'user.email=t@t', 'add', '.']);
  execFileSync('git', ['-C', repo, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'init']);
  execFileSync('git', ['-C', repo, 'tag', 'v1']);
  const workDir = tmp('sa-work-');
  const out = execFileSync('node', [path.join(here, '..', 'containerEntry.mjs'), '--name', 'local', '--repo', `file://${repo}`, '--ref', 'v1'],
    { env: { ...process.env, SOURCE_ANALYSIS_WORK_DIR: workDir, HOME: path.join(workDir, 'home') }, encoding: 'utf8' });
  assert.match(out, /Detected app type: unknown/);
  const result = JSON.parse(fs.readFileSync(path.join(workDir, 'result.json'), 'utf8'));
  assert.equal(result.ok, true);
  assert.equal(result.appType, 'unknown');
  assert.deepEqual(result.pinning, []);
  assert.ok(fs.existsSync(path.join(workDir, 'repo', 'README.md')), 'checkout left for the host (Semgrep) to use');
});

test('containerEntry: a failing clone leaves ok:false and exits 1', () => {
  const workDir = tmp('sa-work-');
  assert.throws(() => execFileSync('node', [path.join(here, '..', 'containerEntry.mjs'), '--name', 'x', '--repo', `file://${workDir}/nope`],
    { env: { ...process.env, SOURCE_ANALYSIS_WORK_DIR: workDir, HOME: path.join(workDir, 'home') }, stdio: 'pipe' }));
  const result = JSON.parse(fs.readFileSync(path.join(workDir, 'result.json'), 'utf8'));
  assert.equal(result.ok, false);
  assert.match(result.error, /clone failed/);
});

test('containerEntry loads without the database module', () => {
  // The analysis folder is mounted read-only in the container with the host's
  // node_modules; better-sqlite3 is native and must not be on the entry point's import path.
  const trace = execFileSync('node', ['--input-type=module', '-e',
    `import { createRequire } from 'module';
     const seen = [];
     const { default: Module } = await import('module');
     const orig = Module._load;
     Module._load = function (req, ...rest) { seen.push(req); return orig.call(this, req, ...rest); };
     await import('${path.join(here, '..', 'appAnalysis.mjs').replace(/\\\\/g, '/')}');
     console.log(JSON.stringify(seen));`], { encoding: 'utf8', cwd: path.join(here, '..') });
  assert.ok(!trace.includes('better-sqlite3'), `better-sqlite3 loaded: ${trace}`);
});

test('pruneCache: wipes the caches only past the cap', () => {
  const cacheDir = tmp('sa-cache-');
  fs.mkdirSync(path.join(cacheDir, 'npm'));
  fs.writeFileSync(path.join(cacheDir, 'npm', 'blob'), Buffer.alloc(10000));
  assert.equal(pruneCache({ cacheDir, maxBytes: 1e9 }), false);
  assert.ok(fs.existsSync(path.join(cacheDir, 'npm', 'blob')));
  assert.ok(dirSizeBytes(cacheDir) >= 10000);
  assert.equal(pruneCache({ cacheDir, maxBytes: 100 }), true);
  assert.deepEqual(fs.readdirSync(cacheDir), []);
  assert.equal(dirSizeBytes(path.join(cacheDir, 'missing')), 0);
});
