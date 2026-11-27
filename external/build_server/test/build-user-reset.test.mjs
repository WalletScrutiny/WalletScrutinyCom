import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { resetBuildUser } from '../build-users.mjs';

// Runs the real reset (sudo, kill, systemctl), so it needs root, systemd and a
// lingering abs-runner user: a throwaway machine or Dan's lab, not CI. As root,
// sudo needs no rules. Skipped elsewhere.
const USER = 'abs-runner';
const PATH_WITH_SBIN = `/usr/local/sbin:/usr/sbin:/sbin:${process.env.PATH}`;
const userExists = spawnSync('id', ['-u', USER]).status === 0;
const skip = process.getuid?.() !== 0 || !userExists || spawnSync('systemctl', ['--version']).status !== 0
  ? 'needs root, systemd and a lingering abs-runner user'
  : false;

const run = (args, options = {}) => execFileSync(args[0], args.slice(1), { encoding: 'utf8', env: { ...process.env, PATH: PATH_WITH_SBIN }, ...options });
const tryRun = (args) => spawnSync(args[0], args.slice(1), { encoding: 'utf8', env: { ...process.env, PATH: PATH_WITH_SBIN } });

describe('resetBuildUser', { skip }, () => {
  test('clears transient and saved user units and stray processes, and starts user systemd again', async () => {
    const uid = run(['id', '-u', USER]).trim();
    const home = run(['getent', 'passwd', USER]).trim().split(':')[5];
    const asUser = (script) => run(['runuser', '-u', USER, '--', '/bin/bash', '-c', `export XDG_RUNTIME_DIR=/run/user/${uid} DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/${uid}/bus; cd ~; ${script}`]);

    // Start clean: a failed earlier run leaves its leftovers.
    assert.equal(await resetBuildUser(USER), true);
    // What a build could leave behind:
    // a transient unit that restarts itself,
    asUser('systemd-run --user --unit=abs-leftover-transient -p Restart=always -p RestartSec=1 sleep 4242');
    // a saved unit enabled to start with the user manager,
    asUser(`mkdir -p ~/.config/systemd/user && printf '[Service]\\nExecStart=/bin/sleep 4343\\nRestart=always\\n[Install]\\nWantedBy=default.target\\n' > ~/.config/systemd/user/abs-leftover-saved.service && systemctl --user daemon-reload && systemctl --user enable --now abs-leftover-saved.service`);
    // and a process detached from both.
    asUser('setsid sleep 4444 </dev/null >/dev/null 2>&1 &');
    let before = '';
    for (let i = 0; i < 50 && !/sleep 4242[\s\S]*sleep 4343|sleep 4343[\s\S]*sleep 4242/.test(before); i++) {
      spawnSync('sleep', ['0.1']);
      before = run(['ps', '-u', uid, '-o', 'args=']);
    }
    assert.match(before, /sleep 4242/);
    assert.match(before, /sleep 4343/);
    assert.match(before, /sleep 4444/);

    assert.equal(await resetBuildUser(USER), true);

    // Give a restarting unit the time to come back if it could.
    spawnSync('sleep', ['3']);
    const after = tryRun(['ps', '-u', uid, '-o', 'args=']).stdout;
    assert.doesNotMatch(after, /sleep 4[234]4[234]/);
    assert.equal(fs.existsSync(path.join(home, '.config', 'systemd')), false);
    assert.equal(run(['systemctl', 'is-active', `user@${uid}.service`]).trim(), 'active');
  });
});
