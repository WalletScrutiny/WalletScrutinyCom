import { execFileSync, spawn, spawnSync } from 'child_process';
import fs from 'fs';
import { appLog } from './logger.mjs';
import { BUILD_USER, TOKEN_BUILD_USER } from './config/config.mjs';

// POSIX-safe single-quote escaping: wrap in '...' and turn embedded ' into '\''.
export const shQuote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;

export function groupIdOf(name) {
  const entry = execFileSync('getent', ['group', name], { encoding: 'utf8' }).trim();
  const gid = Number.parseInt(entry.split(':')[2], 10);
  if (!Number.isInteger(gid)) {
    throw new Error(`no group ${name}`);
  }
  return gid;
}

function removeAcl(buildDir) {
  const acl = spawnSync('setfacl', ['-b', '-k', buildDir], { encoding: 'utf8' });
  if (acl.error?.code !== 'ENOENT' && acl.status !== 0) {
    throw new Error(`setfacl -b -k ${buildDir} failed: ${acl.stderr || acl.error}`);
  }
}

/**
 * Close a fresh build folder to everyone but ABS while ABS fills it. The ACL
 * goes first: one inherited from the builds folder could let a build user in.
 */
export function lockBuildDir(buildDir) {
  removeAcl(buildDir);
  fs.chmodSync(buildDir, 0o700);
}

/**
 * Give a filled build folder to one build user: owned by ABS, group of that
 * user, rwxrws---. The user can write in it, ABS can read what it writes
 * (ABS is in both users' groups), and the other build user cannot enter it.
 * Any ACL is removed, so one inherited from the builds folder cannot open the
 * folder to the other user.
 */
export function prepareBuildDirForUser(buildDir, user, { gidOf = groupIdOf } = {}) {
  // ACL first: removing it puts the group bits back to the owning group's
  // entry, which would undo the chmod.
  removeAcl(buildDir);
  fs.chownSync(buildDir, process.getuid(), gidOf(user));
  fs.chmodSync(buildDir, 0o2770);
}

/**
 * The command asciinema records: the script run as `user` through sudo, in the
 * build folder. sudo resets the environment, so only the variables in passEnv
 * are passed on (sudoers needs SETENV for that); PATH, with the user's own Nix
 * profile, and the runtime dir that rootless podman needs are set again inside. -n makes a missing sudoers rule
 * fail the build at once instead of waiting for a password.
 */
export function buildUserCommand({ user, buildDir, scriptInvocation, envPath, passEnv = [] }) {
  const inner = [
    `export PATH="$HOME/.nix-profile/bin":${shQuote(envPath)}`,
    'export XDG_RUNTIME_DIR=/run/user/$(id -u)',
    'export DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus',
    `cd ${shQuote(buildDir)} || exit 97`,
    `exec ${scriptInvocation}`,
  ].join('; ');
  return [
    'sudo', '-n', '-H', '-u', user,
    ...(passEnv.length ? [`--preserve-env=${passEnv.join(',')}`] : []),
    '--', '/bin/bash', '-c', inner,
  ].map(shQuote).join(' ');
}

function run(args) {
  return new Promise(resolve => {
    const child = spawn(args[0], args.slice(1), { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    child.on('error', error => resolve({ code: null, output: error.message }));
    child.on('close', code => resolve({ code, output: output.trim() }));
  });
}

/**
 * The commands that clear what a build user left behind, so a later build as
 * the same user cannot be watched or tampered with by an earlier one. All but
 * one run as the user itself, so nothing a build planted in its home is ever
 * touched by root; root only restarts the user's systemd, which is a fixed
 * command in sudoers (Bob, 2026-11-27).
 */
export function buildUserResetCommands(user, uid) {
  const runtimeDir = `/run/user/${uid}`;
  const asUser = (...command) => ['sudo', '-n', '-H', '-u', user, ...command];
  const leftovers = [
    '~/.config/systemd', '~/.local/share/systemd', '~/.config/environment.d',
    // Podman quadlets, which the restart below would start again.
    '~/.config/containers/systemd',
    `${runtimeDir}/systemd/transient`, `${runtimeDir}/systemd/user`, `${runtimeDir}/systemd/user.control`,
  ].join(' ');
  return [
    // Everything the user can signal, its user systemd included. That covers
    // processes in user namespaces it created (containers under its sub-uids):
    // their owner holds CAP_KILL in them.
    { args: asUser('/usr/bin/kill', '-KILL', '--', '-1'), mayFail: true },
    // What would start again: units, quadlets and their environment, cron and
    // at jobs. A folder owned by one of its sub-uids (podman unshare) needs
    // podman unshare to delete; whatever is left fails the reset. The home goes
    // back to 0700: adduser --system makes it 0755, which would let the other
    // build user read files a token build leaves there.
    {
      args: asUser('/bin/sh', '-c', [
        'chmod 700 ~',
        `export XDG_RUNTIME_DIR=${runtimeDir}`,
        `rm -rf ${leftovers} 2>/dev/null`,
        `for f in ${leftovers}; do if [ -e "$f" ] || [ -L "$f" ]; then podman system migrate >/dev/null 2>&1; podman unshare rm -rf "$f"; fi; done`,
        `for f in ${leftovers}; do if [ -e "$f" ] || [ -L "$f" ]; then echo "cannot delete $f" >&2; exit 1; fi; done`,
        'if command -v crontab >/dev/null; then crontab -r 2>/dev/null; fi',
        'if command -v atq >/dev/null; then atq | cut -f1 | xargs -r atrm; fi',
        'true',
      ].join('; ')),
    },
    // Starts a fresh manager: rootless podman needs it for the next build.
    { args: ['sudo', '-n', '/usr/bin/systemctl', 'restart', `user@${uid}.service`] },
    // podman still lists the killed containers as running, and on 4.9.3 its
    // rm fails after the kill and leaves podman broken until a migrate (Dan's
    // lab, 2026-11-27).
    { args: asUser('/bin/sh', '-c', `cd ~ && if command -v podman >/dev/null; then export XDG_RUNTIME_DIR=${runtimeDir} && podman system migrate && podman rm -fa; fi`) },
  ];
}

const uidOf = (user) => execFileSync('id', ['-u', user], { encoding: 'utf8' }).trim();

/**
 * Stop everything a build user left behind and start its user systemd afresh.
 * Resolves to true on success; never rejects, because a failed reset must not
 * fail the build that ended.
 */
export async function resetBuildUser(user, { runCommand = run, uid = null } = {}) {
  // kill -1 as any other user would be a disaster.
  if (![BUILD_USER, TOKEN_BUILD_USER].includes(user)) {
    appLog.error(`[BUILD_USERS] refusing to reset ${user}: not a build user`);
    return false;
  }
  try {
    uid ??= uidOf(user);
  } catch (error) {
    appLog.warn(`[BUILD_USERS] could not reset ${user}: ${error.message}`);
    return false;
  }
  for (const { args, mayFail } of buildUserResetCommands(user, uid)) {
    const { code, output } = await runCommand(args);
    if (code !== 0 && !mayFail) {
      appLog.warn(`[BUILD_USERS] reset ${user} failed at "${args.join(' ')}" with code ${code}: ${output}`);
      return false;
    }
  }
  appLog.info(`[BUILD_USERS] reset ${user}`);
  return true;
}

/**
 * Counts the builds running as each user. A user's leftovers are cleared only
 * when it has no build running, because up to QUEUE_CONCURRENCY builds run at
 * once and clearing would kill the neighbours. A build waits for a reset that
 * is still running before it starts.
 */
export function createBuildUserGate({ reset = resetBuildUser } = {}) {
  const running = new Map();
  const resets = new Map();

  const resetIfIdle = (user) => {
    if ((running.get(user) ?? 0) > 0 || resets.has(user)) {
      return resets.get(user) ?? Promise.resolve(false);
    }
    const pending = Promise.resolve(reset(user)).finally(() => resets.delete(user));
    resets.set(user, pending);
    return pending;
  };

  return {
    async acquire(user) {
      while (resets.has(user)) {
        await resets.get(user);
      }
      running.set(user, (running.get(user) ?? 0) + 1);
    },
    release(user) {
      running.set(user, Math.max(0, (running.get(user) ?? 0) - 1));
      return resetIfIdle(user);
    },
    resetIfIdle,
    running: (user) => running.get(user) ?? 0,
  };
}

export const buildUserGate = createBuildUserGate();

export const BUILD_USERS = [BUILD_USER, TOKEN_BUILD_USER];
