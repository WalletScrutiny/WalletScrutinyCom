import './setup.mjs';
import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildUserCommand, buildUserResetCommands, createBuildUserGate, lockBuildDir, prepareBuildDirForUser, resetBuildUser } from '../build-users.mjs';
import { buildUserFor, buildUserAppIdsProblem, BUILD_USER, TOKEN_BUILD_USER, BUILD_USER_APP_IDS, GITHUB_TOKEN_APP_IDS } from '../config/config.mjs';
import { createVerificationQueue, startCompilationJob, readComparisonResults } from '../verifications.mjs';

const tempDirs = [];
function makeTempDir(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `abs-build-users-${label}-`));
  tempDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true });
});

// Stand-ins on PATH: asciinema runs the command without its sleeps and writes
// its output to the cast file; sudo records its own arguments and runs the
// command after "--", keeping GITHUB_TOKEN only when told to preserve it.
function installFakes() {
  const binDir = makeTempDir('bin');
  fs.writeFileSync(path.join(binDir, 'asciinema'), [
    '#!/bin/sh',
    'cmd=$(printf "%s" "$4" | sed -e "s/sleep [0-9]* *;//g")',
    'sh -c "$cmd" > "$5" 2>&1',
    '',
  ].join('\n'), { mode: 0o755 });
  fs.writeFileSync(path.join(binDir, 'sudo'), [
    '#!/bin/bash',
    `printf '%s\\n' "$@" > ${binDir}/sudo-args`,
    'keep=',
    'while [ $# -gt 0 ] && [ "$1" != "--" ]; do case "$1" in --preserve-env=*GITHUB_TOKEN*) keep=1;; esac; shift; done',
    'shift',
    '[ -n "$keep" ] || unset GITHUB_TOKEN',
    'exec "$@"',
    '',
  ].join('\n'), { mode: 0o755 });
  const originalPath = process.env.PATH;
  process.env.PATH = `${binDir}:${originalPath}`;
  return { binDir, restore: () => { process.env.PATH = originalPath; } };
}

describe('buildUserFor', () => {
  test('listed token apps run as the token user, other listed apps as the build user', () => {
    const listed = [...GITHUB_TOKEN_APP_IDS, 'world.bitkey.app'];
    for (const appId of GITHUB_TOKEN_APP_IDS) assert.equal(buildUserFor(appId, listed), TOKEN_BUILD_USER);
    assert.equal(buildUserFor('world.bitkey.app', listed), BUILD_USER);
  });

  test('an app that is not listed still runs as the ABS user', () => {
    assert.equal(buildUserFor('com.tangem.wallet', ['world.bitkey.app']), null);
    assert.equal(buildUserFor('liana', ['world.bitkey.app']), null);
    assert.equal(buildUserFor(null, ['world.bitkey.app']), null);
  });
});

describe('buildUserAppIdsProblem', () => {
  test('refuses a plain app while a token app is missing from the list', () => {
    const problem = buildUserAppIdsProblem(['world.bitkey.app', 'to.bitkit'], ['to.bitkit', 'com.tangem.wallet']);
    assert.match(problem, /world\.bitkey\.app/);
    assert.match(problem, /com\.tangem\.wallet/);
    assert.doesNotMatch(problem, /to\.bitkit;/);
  });

  test('accepts an empty list, token apps alone, and plain apps after every token app', () => {
    assert.equal(buildUserAppIdsProblem([], GITHUB_TOKEN_APP_IDS), null);
    assert.equal(buildUserAppIdsProblem(['to.bitkit'], GITHUB_TOKEN_APP_IDS), null);
    assert.equal(buildUserAppIdsProblem([...GITHUB_TOKEN_APP_IDS, 'world.bitkey.app'], GITHUB_TOKEN_APP_IDS), null);
  });

  // The deploy runs these tests first, so a bad list stops it before ABS restarts.
  test('the shipped list passes', () => {
    assert.equal(buildUserAppIdsProblem(BUILD_USER_APP_IDS, GITHUB_TOKEN_APP_IDS), null);
  });
});

describe('buildUserCommand', () => {
  test('runs the script as the user through sudo -n, passing on only GITHUB_TOKEN', () => {
    const command = buildUserCommand({ user: 'abs-token', buildDir: "/b/it's", scriptInvocation: "'/b/s.sh'", envPath: '/usr/bin', passEnv: ['GITHUB_TOKEN', 'NIX_SSL_CERT_FILE'] });
    assert.match(command, /^'sudo' '-n' '-H' '-u' 'abs-token' '--preserve-env=GITHUB_TOKEN,NIX_SSL_CERT_FILE' '--' '\/bin\/bash' '-c' /);
    assert.doesNotMatch(buildUserCommand({ user: 'abs-runner', buildDir: '/b', scriptInvocation: 's', envPath: '/usr/bin' }), /preserve-env/);
  });
});

describe('startCompilationJob as a build user', () => {
  test('the script runs through sudo in its build folder, and the cast is written outside it', async () => {
    const { binDir, restore } = installFakes();
    try {
      const buildDir = makeTempDir('job');
      const castDir = makeTempDir('casts');
      const script = path.join(buildDir, 'test_build.sh');
      fs.writeFileSync(script, '#!/bin/sh\necho "token=${GITHUB_TOKEN:-none} cwd=$(pwd)"\nprintf "verdict: reproducible\\n" > COMPARISON_RESULTS.yaml\n', { mode: 0o755 });

      const result = await startCompilationJob(buildDir, script, '1.0.0', null, null, null, 'android', 'world.bitkey.app', 'ghp_real', { buildUser: 'abs-runner', castDir });

      assert.equal(path.dirname(result.castFileName), path.join(castDir, path.basename(buildDir)));
      assert.equal(fs.statSync(path.dirname(result.castFileName)).mode & 0o777, 0o700);
      assert.deepEqual(fs.readdirSync(buildDir).sort(), ['COMPARISON_RESULTS.yaml', 'test_build.sh']);
      assert.equal(readComparisonResults(buildDir).verdict, 'reproducible');
      const cast = fs.readFileSync(result.castFileName, 'utf8');
      assert.match(cast, new RegExp(`cwd=${buildDir}`));
      // Not a token app: the real token never reaches it.
      assert.doesNotMatch(cast, /ghp_real/);
      const sudoArgs = fs.readFileSync(path.join(binDir, 'sudo-args'), 'utf8').split('\n');
      assert.deepEqual(sudoArgs.slice(0, 4), ['-n', '-H', '-u', 'abs-runner']);
    } finally {
      restore();
    }
  });

  test('a token app gets the real token passed through sudo', async () => {
    const { restore } = installFakes();
    try {
      const buildDir = makeTempDir('job-token');
      const script = path.join(buildDir, 'test_build.sh');
      fs.writeFileSync(script, '#!/bin/sh\necho "token=${GITHUB_TOKEN:-none}"\n', { mode: 0o755 });
      const result = await startCompilationJob(buildDir, script, '1.0.0', null, null, null, 'android', 'to.bitkit', 'ghp_real', { buildUser: 'abs-token', castDir: makeTempDir('casts-token') });
      assert.match(fs.readFileSync(result.castFileName, 'utf8'), /token=ghp_real/);
    } finally {
      restore();
    }
  });
});

describe('createBuildUserGate', () => {
  const tick = () => new Promise(resolve => setTimeout(resolve, 20));

  test('resets a user only once its last build ends, never under a running neighbour', async () => {
    const resets = [];
    const gate = createBuildUserGate({ reset: async user => { resets.push(user); return true; } });
    assert.equal(gate.tryClaim('abs-runner'), true);
    assert.equal(gate.tryClaim('abs-runner'), true);
    assert.equal(gate.running('abs-runner'), 2);
    await gate.release('abs-runner');
    assert.deepEqual(resets, []);
    await gate.release('abs-runner');
    assert.deepEqual(resets, ['abs-runner']);
    assert.equal(gate.tryClaim('abs-token'), true);
    await gate.release('abs-token');
    assert.deepEqual(resets, ['abs-runner', 'abs-token']);
  });

  test('a token build may start only once plain builds have ended and abs-runner was cleared', async () => {
    let finishReset;
    const gate = createBuildUserGate({ reset: () => new Promise(resolve => { finishReset = resolve; }) });
    assert.equal(gate.tryClaim('abs-runner'), true);
    assert.equal(gate.tryClaim('abs-token'), false, 'a token build started next to a running plain build');
    const reset = gate.release('abs-runner');
    assert.equal(gate.tryClaim('abs-token'), false, 'a token build started before abs-runner was cleared');
    await tick();
    finishReset(true);
    await reset;
    assert.equal(gate.tryClaim('abs-token'), true);
  });

  test('a failed reset keeps the other user out until a retry succeeds', async () => {
    let resetOk = false;
    const events = [];
    const gate = createBuildUserGate({ retryMs: 30, reset: async user => { events.push(`reset ${user} ${resetOk ? 'ok' : 'failed'}`); return resetOk; } });
    assert.equal(gate.tryClaim('abs-token'), true);
    assert.equal(await gate.release('abs-token'), false);
    await tick();
    await tick();
    assert.equal(gate.tryClaim('abs-runner'), false, 'a plain build started next to an uncleared token user');
    assert.ok(events.filter(e => e === 'reset abs-token failed').length >= 2, 'the failed reset was not retried');
    resetOk = true;
    await tick();
    await tick();
    assert.equal(events.at(-1), 'reset abs-token ok');
    assert.equal(gate.tryClaim('abs-runner'), true);
  });

  test('a queued token build holds back new plain builds, so it cannot starve', async () => {
    const gate = createBuildUserGate({ reset: async () => true });
    assert.equal(gate.tryClaim('abs-runner'), true);
    // No token build waiting: more plain builds may join.
    assert.equal(gate.tryClaim('abs-runner', ['abs-runner']), true);
    assert.equal(gate.tryClaim('abs-runner', ['abs-runner', 'abs-token']), false);
    await gate.release('abs-runner');
    await gate.release('abs-runner');
    assert.equal(gate.tryClaim('abs-token', ['abs-runner']), true);
  });

  test('a reset at start that fails keeps the other user out', async () => {
    let resetOk = false;
    const gate = createBuildUserGate({ retryMs: 30, reset: async () => resetOk });
    await gate.resetIfIdle('abs-runner');
    assert.equal(gate.tryClaim('abs-token'), false);
    resetOk = true;
    await tick();
    await tick();
    assert.equal(gate.tryClaim('abs-token'), true);
  });

  test('a build of the same user waits for its reset that is still running', async () => {
    let finishReset;
    const gate = createBuildUserGate({ reset: () => new Promise(resolve => { finishReset = resolve; }) });
    assert.equal(gate.tryClaim('abs-runner'), true);
    const reset = gate.release('abs-runner');
    assert.equal(gate.tryClaim('abs-runner'), false);
    await tick();
    finishReset(true);
    await reset;
    assert.equal(gate.tryClaim('abs-runner'), true);
    assert.equal(gate.running('abs-runner'), 1);
  });

  test('tells its listeners once a reset has ended, never from inside a claim', async () => {
    const gate = createBuildUserGate({ reset: async () => true });
    let calls = 0;
    gate.onChange(() => { calls += 1; });
    gate.tryClaim('abs-runner');
    assert.equal(calls, 0);
    await gate.release('abs-runner');
    await tick();
    assert.equal(calls, 1);
  });
});

describe('createVerificationQueue with build users', () => {
  const until = async (condition) => {
    for (let i = 0; i < 100 && !condition(); i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.ok(condition(), 'timed out waiting');
  };

  // Bob's test from his round 2 on !2080 (f24daddb), rewritten for addJob.
  test('a job that waits for the other user is not timed out by the queue', async () => {
    const gate = createBuildUserGate({ reset: async () => true });
    const queue = createVerificationQueue({ gate, concurrency: 3, timeout: 300 });
    // A plain build that outlasts the queue timeout.
    assert.equal(gate.tryClaim('abs-runner'), true);
    let tokenStarted = false;
    const token = queue.addJob(async () => { tokenStarted = true; return 'token done'; }, { appId: 'to.bitkit', buildUser: 'abs-token', id: 'token' });
    await new Promise(resolve => setTimeout(resolve, 450));
    assert.equal(tokenStarted, false, 'the token build started next to a plain build');
    assert.equal(queue.size, 1);
    assert.equal(queue.pending, 0);
    await gate.release('abs-runner');
    assert.equal(await token, 'token done');
  });

  test('a held-back job takes no slot: other apps run meanwhile', async () => {
    const gate = createBuildUserGate({ reset: async () => true });
    const queue = createVerificationQueue({ gate, concurrency: 2, timeout: 5000 });
    let finishPlain;
    const plain = queue.addJob(() => new Promise(resolve => { finishPlain = resolve; }), { appId: 'world.bitkey.app', buildUser: 'abs-runner', id: 'plain' });
    await until(() => gate.running('abs-runner') === 1);
    const token = queue.addJob(async () => 'token', { appId: 'to.bitkit', buildUser: 'abs-token', id: 'token' });
    // An app that still builds as the ABS user does not wait behind it.
    assert.equal(await queue.addJob(async () => 'unlisted', { appId: 'io.example', id: 'unlisted' }), 'unlisted');
    assert.equal(queue.size, 1);
    finishPlain('plain');
    await plain;
    assert.equal(await token, 'token');
  });

  test('plain jobs queued before a token job join the running plain build; later ones wait for it', async () => {
    const events = [];
    const gate = createBuildUserGate({ reset: async user => { events.push(`reset ${user}`); return true; } });
    const queue = createVerificationQueue({ gate, concurrency: 3, timeout: 5000 });
    const finish = {};
    const job = (name, buildUser) => queue.addJob(
      () => new Promise(resolve => { events.push(`${name} starts`); finish[name] = resolve; }),
      { appId: `app.${name}`, buildUser, id: name });
    const jobs = [job('a0', 'abs-runner'), job('a1', 'abs-runner'), job('a2', 'abs-runner'), job('a3', 'abs-runner'), job('b1', 'abs-token')];
    await until(() => events.length === 3);
    jobs.push(job('a4', 'abs-runner'));
    finish.a0();
    await until(() => events.includes('a3 starts'));
    for (const name of ['a1', 'a2', 'a3']) finish[name]();
    await until(() => events.includes('b1 starts'));
    finish.b1();
    await until(() => events.includes('a4 starts'));
    finish.a4();
    await Promise.all(jobs);
    await until(() => events.length === 9);
    assert.deepEqual(events, ['a0 starts', 'a1 starts', 'a2 starts', 'a3 starts', 'reset abs-runner', 'b1 starts', 'reset abs-token', 'a4 starts', 'reset abs-runner']);
  });

  test('a held-back job starts once a failed reset is retried successfully', async () => {
    let resetOk = false;
    const gate = createBuildUserGate({ retryMs: 30, reset: async () => resetOk });
    const queue = createVerificationQueue({ gate, concurrency: 3, timeout: 5000 });
    await queue.addJob(async () => 'plain', { appId: 'world.bitkey.app', buildUser: 'abs-runner', id: 'plain' });
    let tokenStarted = false;
    const token = queue.addJob(async () => { tokenStarted = true; return 'token'; }, { appId: 'to.bitkit', buildUser: 'abs-token', id: 'token' });
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(tokenStarted, false, 'the token build started next to an uncleared abs-runner');
    resetOk = true;
    assert.equal(await token, 'token');
  });

  test('a job that fails still releases its user', async () => {
    const resets = [];
    const gate = createBuildUserGate({ reset: async user => { resets.push(user); return true; } });
    const queue = createVerificationQueue({ gate, concurrency: 3, timeout: 5000 });
    await assert.rejects(queue.addJob(async () => { throw new Error('download failed'); }, { appId: 'to.bitkit', buildUser: 'abs-token', id: 'failing' }));
    await until(() => resets.length === 1);
    assert.equal(gate.running('abs-token'), 0);
    assert.deepEqual(resets, ['abs-token']);
  });
});

describe('prepareBuildDirForUser', () => {
  test('gives the folder the user group, rwxrws---, and no ACL', () => {
    const buildDir = makeTempDir('prep');
    const hasSetfacl = spawnSync('setfacl', ['--version']).status === 0;
    if (hasSetfacl) {
      execFileSync('setfacl', ['-m', 'u:nobody:rwx', '-d', '-m', 'u:nobody:rwx', buildDir]);
    }
    const gid = process.getgid();
    prepareBuildDirForUser(buildDir, 'abs-runner', { gidOf: () => gid });
    const stat = fs.statSync(buildDir);
    assert.equal(stat.gid, gid);
    assert.equal(stat.mode & 0o7777, 0o2770);
    if (hasSetfacl) {
      assert.doesNotMatch(execFileSync('getfacl', ['-p', buildDir], { encoding: 'utf8' }), /nobody|default:/);
    }
  });
});

describe('build user reset', () => {
  // Each command must match a sudoers rule from the README exactly: anything as
  // the build user, and as root only the fixed systemctl restart.
  test('runs everything as the user except one fixed systemctl restart', () => {
    const commands = buildUserResetCommands('abs-token', '116').map(c => c.args);
    const asRoot = commands.filter(args => args[2] !== '-H');
    assert.deepEqual(asRoot, [['sudo', '-n', '/usr/bin/systemctl', 'restart', 'user@116.service']]);
    for (const args of commands.filter(a => a[2] === '-H')) {
      assert.deepEqual(args.slice(0, 5), ['sudo', '-n', '-H', '-u', 'abs-token']);
    }
    assert.deepEqual(commands[0].slice(5), ['/usr/bin/kill', '-KILL', '--', '-1']);
  });

  test('stops at a failed step and reports false, ignoring steps that may fail', async () => {
    const seen = [];
    assert.equal(await resetBuildUser('root', { runCommand: async (args) => { seen.push(args); return { code: 0, output: '' }; } }), false);
    assert.deepEqual(seen, []);
    const ok = await resetBuildUser('abs-token', {
      uid: '116',
      runCommand: async (args) => {
        seen.push(args.join(' '));
        if (args.includes('/usr/bin/kill')) return { code: 1, output: '' };
        if (args.includes('/usr/bin/systemctl')) return { code: 1, output: 'denied' };
        return { code: 0, output: '' };
      },
    });
    assert.equal(ok, false);
    assert.equal(seen.length, 3);
  });
});

describe('lockBuildDir', () => {
  test('closes the folder to everyone but ABS and removes an inherited ACL', () => {
    const buildDir = makeTempDir('lock');
    fs.chmodSync(buildDir, 0o2775);
    const hasSetfacl = spawnSync('setfacl', ['--version']).status === 0;
    if (hasSetfacl) {
      execFileSync('setfacl', ['-m', 'u:nobody:rwx', '-d', '-m', 'u:nobody:rwx', buildDir]);
    }
    lockBuildDir(buildDir);
    assert.equal(fs.statSync(buildDir).mode & 0o777, 0o700);
    if (hasSetfacl) {
      assert.doesNotMatch(execFileSync('getfacl', ['-p', buildDir], { encoding: 'utf8' }), /nobody|default:/);
    }
  });
});
