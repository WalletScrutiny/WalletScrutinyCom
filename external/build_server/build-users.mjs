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
 * Lets builds of only one user run at a time, and clears that user before a
 * build of the other one starts. A second user closes files, not command
 * lines: a script that passes the real token on a command line (podman run -e
 * GITHUB_TOKEN=...) shows it to every account on the host, so a plain build
 * must never run next to a token build. Up to QUEUE_CONCURRENCY builds of the
 * same user still run at once.
 *
 * A user that ran since its last successful reset is dirty, and the other
 * user's builds wait until a reset clears it. A failed reset leaves it dirty
 * and is retried every retryMs while that user has no build running, so the
 * other user keeps waiting rather than running next to its leftovers. While a
 * build of the other user waits, no new build of the running user starts, so
 * neither user can starve the other.
 */
export function createBuildUserGate({ reset = resetBuildUser, retryMs = 5 * 60 * 1000 } = {}) {
  const running = new Map();
  const waiting = new Map();
  const dirty = new Set();
  const resets = new Map();
  const retryTimers = new Map();
  let wakeWaiters = [];

  const count = (map, user) => map.get(user) ?? 0;
  const changed = () => {
    const toWake = wakeWaiters;
    wakeWaiters = [];
    for (const wake of toWake) wake();
  };
  const othersWaiting = (user) => [...waiting].some(([other, n]) => other !== user && n > 0);
  const canStart = (user) => {
    if (resets.has(user)) return false;
    for (const other of new Set([...running.keys(), ...dirty, ...resets.keys()])) {
      if (other === user) continue;
      if (count(running, other) > 0 || dirty.has(other) || resets.has(other)) return false;
    }
    // The other user goes first once this one has run since its last reset.
    return !(dirty.has(user) && othersWaiting(user));
  };

  const resetIfIdle = (user) => {
    if (count(running, user) > 0) {
      return Promise.resolve(false);
    }
    if (resets.has(user)) {
      return resets.get(user);
    }
    clearTimeout(retryTimers.get(user));
    retryTimers.delete(user);
    // Dirty until the reset succeeds: it may already have run (ABS restarted).
    dirty.add(user);
    const pending = Promise.resolve()
      .then(() => reset(user))
      .catch(() => false)
      .then(ok => {
        resets.delete(user);
        if (ok) {
          dirty.delete(user);
        } else if (count(running, user) === 0) {
          appLog.warn(`[BUILD_USERS] ${user} stays dirty; builds of the other user wait, retrying the reset in ${Math.round(retryMs / 1000)}s`);
          const timer = setTimeout(() => {
            retryTimers.delete(user);
            void resetIfIdle(user);
          }, retryMs);
          retryTimers.set(user, timer);
        }
        changed();
        return ok;
      });
    resets.set(user, pending);
    return pending;
  };

  return {
    async acquire(user) {
      waiting.set(user, count(waiting, user) + 1);
      try {
        while (!canStart(user)) {
          await new Promise(resolve => wakeWaiters.push(resolve));
        }
      } finally {
        waiting.set(user, count(waiting, user) - 1);
      }
      clearTimeout(retryTimers.get(user));
      retryTimers.delete(user);
      dirty.add(user);
      running.set(user, count(running, user) + 1);
      // Another waiter of the same user may now start too.
      changed();
    },
    release(user) {
      running.set(user, Math.max(0, count(running, user) - 1));
      return resetIfIdle(user);
    },
    resetIfIdle,
    running: (user) => count(running, user),
  };
}

export const buildUserGate = createBuildUserGate();

export const BUILD_USERS = [BUILD_USER, TOKEN_BUILD_USER];
