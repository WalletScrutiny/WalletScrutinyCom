// The sandbox: one throwaway rootless container per phase, no privileges, no
// host mounts but a work directory and an output directory, hard limits on
// memory, processes, disk and time. The phase that runs a package's own code
// has no network at all.
import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';

export const CONTAINER_CLI = process.env.DEP_REBUILDER_CLI || 'podman';
export const LIMITS = {
  memory: process.env.DEP_REBUILDER_MEMORY || '4g',
  cpus: process.env.DEP_REBUILDER_CPUS || '2',
  pids: process.env.DEP_REBUILDER_PIDS || '1024',
  diskBytes: Number(process.env.DEP_REBUILDER_DISK_GB || 8) * 2 ** 30,
  phaseMs: Number(process.env.DEP_REBUILDER_PHASE_MIN || 20) * 60 * 1000,
};
const MANIFEST_CHECK = fs.readFileSync(new URL('./manifest-check.js', import.meta.url), 'utf8');
if (MANIFEST_CHECK.includes("'")) throw new Error('manifest-check.js must not contain a single quote: it is passed to node -e in single quotes');
export const SCRIPT = fs.readFileSync(new URL('./npm-sandbox.sh', import.meta.url), 'utf8').replace('__MANIFEST_CHECK__', () => MANIFEST_CHECK);
// what the containers of a recipe run (rebuild-recipe.mjs)
export const RECIPE_SCRIPT = fs.readFileSync(new URL('./recipe-sandbox.sh', import.meta.url), 'utf8').replace('__MANIFEST_CHECK__', () => MANIFEST_CHECK);

/** podman/docker arguments for one phase. network 'none' = offline. */
export function sandboxArgs({ image, name, workDir, outDir = null, env, network = 'default', cli = CONTAINER_CLI, uid = process.getuid(), gid = process.getgid(), limits = LIMITS, script = SCRIPT }) {
  const args = [
    'run', '--rm', '--name', name,
    '--user', `${uid}:${gid}`,
    '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges',
    '--read-only',
    '--tmpfs', '/tmp:rw,exec,nosuid,size=2g',
    '--memory', limits.memory, '--memory-swap', limits.memory, '--cpus', limits.cpus, '--pids-limit', limits.pids,
    '--ulimit', 'nofile=4096:4096',
    '-v', `${path.resolve(workDir)}:/work:rw`,
    '--workdir', '/work',
  ];
  if (outDir) args.push('-v', `${path.resolve(outDir)}:/out:rw`);
  if (network === 'none') args.push('--network', 'none');
  if (cli === 'podman' && uid !== 0) args.splice(1, 0, '--userns=keep-id');
  for (const [k, v] of Object.entries(env)) args.push('-e', `${k}=${v}`);
  args.push(image, 'bash', '-c', script);
  return args;
}

/** Make a tree the container wrote readable and removable again: a build can chmod its own files to nothing. */
export function reclaim(dir) {
  spawnSync('chmod', ['-R', 'u+rwX', dir], { stdio: 'ignore' });
}

/** Removes a tree the container wrote, whatever modes it left on it. */
export function removeTree(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch { reclaim(dir); fs.rmSync(dir, { recursive: true, force: true }); }
}

function dirBytes(dir) {
  let r = spawnSync('du', ['-sb', dir], { encoding: 'utf8' });
  // du fails on a directory it may not enter, and then counts nothing below it
  if (r.status !== 0) { reclaim(dir); r = spawnSync('du', ['-sb', dir], { encoding: 'utf8' }); }
  return Number(String(r.stdout).split('\t')[0]) || 0; // a file vanishing mid-count also fails du: its total still stands
}

/** Everything the container can fill on the host: its work and output directories and the log of its output. */
export function usedBytes(paths) {
  return paths.reduce((sum, p) => sum + (fs.existsSync(p) ? dirBytes(p) : 0), 0);
}

/**
 * Run a phase, output appended to logFile. Killed (container removed by name,
 * since a container's PID 1 ignores SIGTERM) on timeout or when the work
 * directory outgrows the disk limit. Returns { code, timedOut, tooBig }.
 */
export function runPhase({ cli = CONTAINER_CLI, args, name, logFile, workDir, outDir = null, limits = LIMITS }) {
  return new Promise((resolve) => {
    const log = fs.openSync(logFile, 'a');
    const child = spawn(cli, args, { stdio: ['ignore', log, log] });
    let timedOut = false, tooBig = false;
    const stop = () => { spawnSync(cli, ['rm', '-f', '-t', '0', name], { stdio: 'ignore' }); child.kill('SIGKILL'); };
    const timer = setTimeout(() => { timedOut = true; stop(); }, limits.phaseMs);
    const watched = [workDir, logFile, ...(outDir ? [outDir] : [])];
    const disk = setInterval(() => { if (usedBytes(watched) > limits.diskBytes) { tooBig = true; stop(); } }, 1000);
    child.on('close', (code) => { clearTimeout(timer); clearInterval(disk); fs.closeSync(log); spawnSync(cli, ['rm', '-f', '-t', '0', name], { stdio: 'ignore' }); resolve({ code, timedOut, tooBig }); });
  });
}

/** Containers a killed or crashed earlier run left behind (ours are all named dr-*). */
export function removeStaleContainers(cli = CONTAINER_CLI) {
  const ls = spawnSync(cli, ['ps', '-a', '--filter', 'name=^dr-', '--format', '{{.Names}}'], { encoding: 'utf8' });
  const names = ls.status === 0 ? ls.stdout.split('\n').filter(Boolean) : [];
  for (const n of names) spawnSync(cli, ['rm', '-f', '-t', '0', n], { stdio: 'ignore' });
  return names.length;
}
