import './setup.mjs';
import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildUserCommand, buildUserResetCommands, createBuildUserGate, lockBuildDir, prepareBuildDirForUser, resetBuildUser } from '../build-users.mjs';
import { buildUserFor, BUILD_USER, TOKEN_BUILD_USER, GITHUB_TOKEN_APP_IDS } from '../config/config.mjs';
import { startCompilationJob, readComparisonResults } from '../verifications.mjs';

// Builds in these tests must not reach the real reset helper.
const resetsSeen = [];
const gate = createBuildUserGate({ reset: async user => { resetsSeen.push(user); return true; } });

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

      const result = await startCompilationJob(buildDir, script, '1.0.0', null, null, null, 'android', 'world.bitkey.app', 'ghp_real', { buildUser: 'abs-runner', castDir, gate });

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
      // Its only build ended, so its leftovers were cleared.
      assert.deepEqual(resetsSeen, ['abs-runner']);
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
      const result = await startCompilationJob(buildDir, script, '1.0.0', null, null, null, 'android', 'to.bitkit', 'ghp_real', { buildUser: 'abs-token', castDir: makeTempDir('casts-token'), gate });
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
    await gate.acquire('abs-runner');
    await gate.acquire('abs-runner');
    assert.equal(gate.running('abs-runner'), 2);
    await gate.release('abs-runner');
    assert.deepEqual(resets, []);
    await gate.release('abs-runner');
    assert.deepEqual(resets, ['abs-runner']);
    await gate.acquire('abs-token');
    await gate.release('abs-token');
    assert.deepEqual(resets, ['abs-runner', 'abs-token']);
  });

  test('a token build waits until plain builds have ended and abs-runner was cleared', async () => {
    const events = [];
    const gate = createBuildUserGate({ reset: async user => { events.push(`reset ${user}`); return true; } });
    await gate.acquire('abs-runner');
    const token = gate.acquire('abs-token').then(() => events.push('token build starts'));
    await tick();
    assert.deepEqual(events.filter(e => e === 'token build starts'), [], 'a token build started next to a running plain build');
    await gate.release('abs-runner');
    await token;
    assert.ok(events.indexOf('reset abs-runner') !== -1 && events.indexOf('reset abs-runner') < events.indexOf('token build starts'));
  });

  test('a failed reset keeps the other user waiting until a retry succeeds', async () => {
    let resetOk = false;
    const events = [];
    const gate = createBuildUserGate({ retryMs: 30, reset: async user => { events.push(`reset ${user} ${resetOk ? 'ok' : 'failed'}`); return resetOk; } });
    await gate.acquire('abs-token');
    const plain = gate.acquire('abs-runner').then(() => events.push('plain build starts'));
    assert.equal(await gate.release('abs-token'), false);
    await tick();
    await tick();
    assert.ok(!events.includes('plain build starts'), 'a plain build started next to an uncleared token user');
    assert.ok(events.filter(e => e === 'reset abs-token failed').length >= 2, 'the failed reset was not retried');
    resetOk = true;
    await plain;
    assert.equal(events.at(-2), 'reset abs-token ok');
    assert.equal(gate.running('abs-runner'), 1);
  });

  test('a waiting token build holds back new plain builds, so it cannot starve', async () => {
    const events = [];
    const gate = createBuildUserGate({ reset: async user => { events.push(`reset ${user}`); return true; } });
    await gate.acquire('abs-runner');
    const token = gate.acquire('abs-token').then(() => events.push('token build starts'));
    const laterPlain = gate.acquire('abs-runner').then(() => events.push('later plain build starts'));
    await tick();
    assert.deepEqual(events, []);
    await gate.release('abs-runner');
    await token;
    await tick();
    assert.deepEqual(events, ['reset abs-runner', 'token build starts']);
    await gate.release('abs-token');
    await laterPlain;
    assert.deepEqual(events, ['reset abs-runner', 'token build starts', 'reset abs-token', 'later plain build starts']);
  });

  test('a reset at start that fails keeps the other user waiting', async () => {
    let resetOk = false;
    const gate = createBuildUserGate({ retryMs: 30, reset: async () => resetOk });
    await gate.resetIfIdle('abs-runner');
    let started = false;
    const token = gate.acquire('abs-token').then(() => { started = true; });
    await tick();
    assert.equal(started, false);
    resetOk = true;
    await token;
  });

  test('a build waits for a reset that is still running', async () => {
    let finishReset;
    const order = [];
    const gate = createBuildUserGate({ reset: () => new Promise(resolve => { finishReset = () => { order.push('reset done'); resolve(true); }; }) });
    await gate.acquire('abs-runner');
    void gate.release('abs-runner');
    const next = gate.acquire('abs-runner').then(() => order.push('build starts'));
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.deepEqual(order, []);
    finishReset();
    await next;
    assert.deepEqual(order, ['reset done', 'build starts']);
    assert.equal(gate.running('abs-runner'), 1);
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
