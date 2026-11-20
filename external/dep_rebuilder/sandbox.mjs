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
export const SCRIPT = fs.readFileSync(new URL('./npm-sandbox.sh', import.meta.url), 'utf8');

/** podman/docker arguments for one phase. network 'none' = offline. */
export function sandboxArgs({ image, name, workDir, outDir = null, env, network = 'default', cli = CONTAINER_CLI, uid = process.getuid(), gid = process.getgid(), limits = LIMITS }) {
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
  args.push(image, 'bash', '-c', SCRIPT);
  return args;
}

function dirBytes(dir) {
  const r = spawnSync('du', ['-sb', dir], { encoding: 'utf8' });
  return r.status === 0 ? Number(r.stdout.split('\t')[0]) : 0;
}

/**
 * Run a phase, output appended to logFile. Killed (container removed by name,
 * since a container's PID 1 ignores SIGTERM) on timeout or when the work
 * directory outgrows the disk limit. Returns { code, timedOut, tooBig }.
 */
export function runPhase({ cli = CONTAINER_CLI, args, name, logFile, workDir, limits = LIMITS }) {
  return new Promise((resolve) => {
    const log = fs.openSync(logFile, 'a');
    const child = spawn(cli, args, { stdio: ['ignore', log, log] });
    let timedOut = false, tooBig = false;
    const stop = () => { spawnSync(cli, ['rm', '-f', '-t', '0', name], { stdio: 'ignore' }); child.kill('SIGKILL'); };
    const timer = setTimeout(() => { timedOut = true; stop(); }, limits.phaseMs);
    const disk = setInterval(() => { if (dirBytes(workDir) > limits.diskBytes) { tooBig = true; stop(); } }, 5000);
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
