// Runs the per-repository work (clone, dependency install, every check that
// executes or parses the repository) inside a throwaway container, so nothing
// from an analysed repository ever runs on the host. The host keeps the
// orchestration, the app list and the database.
//
// The container gets: this folder read-only at /analysis (code + node_modules),
// a per-repository scratch dir at /work (clone, result.json), the shared
// package caches at /cache. It gets no GitHub token, no database and no docker
// socket, runs as the calling user with all capabilities dropped, a read-only
// root, memory/cpu/pid limits and a hard timeout.
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { spawn, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
  ANALYSIS_IMAGE, CONTAINER_CLI, CONTAINER_MEMORY, CONTAINER_CPUS, CONTAINER_PIDS,
  CONTAINER_TIMEOUT_MS, CACHE_DIR, CACHE_MAX_BYTES,
} from './config.mjs';

export const ANALYSIS_DIR = path.dirname(fileURLToPath(import.meta.url));
// JDK the repositories' gradle/maven run with (the image also ships 8, 11 and 21
// behind jenv, whose shims need a writable JENV_ROOT; a fixed JAVA_HOME avoids them).
export const CONTAINER_JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64';

// Environment of the process inside the container. Everything that writes goes
// to /work (per repository, deleted afterwards) or /cache (shared, size-capped).
export function containerEnv() {
  return {
    HOME: '/work/home',
    CI: 'true',
    GIT_TERMINAL_PROMPT: '0',
    JAVA_HOME: CONTAINER_JAVA_HOME,
    GRADLE_USER_HOME: '/cache/gradle',
    npm_config_cache: '/cache/npm',
    npm_config_ignore_scripts: 'true', // never run the repositories' npm lifecycle scripts
    npm_config_fund: 'false',
    npm_config_update_notifier: 'false',
    YARN_CACHE_FOLDER: '/cache/yarn',
    PIP_CACHE_DIR: '/cache/pip',
    PIP_USER: '1', // the image's site-packages are read-only; installs go to ~/.local under /work
    PIP_DISABLE_PIP_VERSION_CHECK: '1',
    PYTHONDONTWRITEBYTECODE: '1',
  };
}

export function buildRunArgs({
  image = ANALYSIS_IMAGE, name, workDir, cacheDir = CACHE_DIR, analysisDir = ANALYSIS_DIR,
  uid = process.getuid(), gid = process.getgid(),
  memory = CONTAINER_MEMORY, cpus = CONTAINER_CPUS, pids = CONTAINER_PIDS,
  entryArgs = [],
}) {
  const args = [
    'run', '--rm', '--name', name,
    '--user', `${uid}:${gid}`,
    '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges',
    '--read-only',
    '--tmpfs', '/tmp:rw,exec,nosuid,size=2g',
    '--memory', memory,
    '--cpus', String(cpus),
    '--pids-limit', String(pids),
    '-v', `${path.resolve(analysisDir)}:/analysis:ro`,
    '-v', `${path.resolve(workDir)}:/work:rw`,
    '-v', `${path.resolve(cacheDir)}:/cache:rw`,
    '--workdir', '/work',
  ];
  for (const [k, v] of Object.entries(containerEnv())) args.push('-e', `${k}=${v}`);
  args.push(image,
    // Put the chosen JDK first on the image's PATH, then hand over to the entry point.
    'bash', '-c', 'export PATH="$JAVA_HOME/bin:$PATH"; exec node /analysis/containerEntry.mjs "$@"', '--',
    ...entryArgs);
  return args;
}

export function containerName(appName) {
  return `sa-${appName.replace(/[^a-zA-Z0-9.-]/g, '_')}-${process.pid}`;
}

// Pull the image once per process if it is not present. The deploy pulls it
// too; this covers dev runs and a manually removed image.
const imagesChecked = new Map(); // image -> null (present) | Error (unavailable, do not retry this run)
export function ensureImage(image = ANALYSIS_IMAGE, cli = CONTAINER_CLI) {
  if (imagesChecked.has(image)) {
    const failure = imagesChecked.get(image);
    if (failure) throw failure;
    return;
  }
  try {
    try {
      execFileSync(cli, ['image', 'inspect', image], { stdio: 'pipe', timeout: 60000 });
    } catch {
      console.log(`Pulling analysis image ${image} (once)...`);
      execFileSync(cli, ['pull', image], { stdio: 'inherit', timeout: 30 * 60 * 1000 });
    }
    imagesChecked.set(image, null);
  } catch (error) {
    const failure = new Error(`analysis image ${image} is not available (${error.message.split('\n')[0]})`);
    imagesChecked.set(image, failure);
    throw failure;
  }
}

// Run containerEntry.mjs for one repository. Output streams through to our
// stdout/stderr (the journal for the service) line by line via console, so
// the job's log tag (pool.mjs) applies to it too; the structured result comes
// back through <workDir>/result.json. Rejects when the container fails, is
// killed on timeout, or leaves no result.
export function runInContainer({
  name, repoUrl, ref = null, includeTestFiles = false, workDir,
  cli = CONTAINER_CLI, image = ANALYSIS_IMAGE, cacheDir = CACHE_DIR, analysisDir = ANALYSIS_DIR,
  timeoutMs = CONTAINER_TIMEOUT_MS, uid, gid,
}) {
  fs.mkdirSync(path.join(workDir, 'home'), { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });
  const resultPath = path.join(workDir, 'result.json');
  fs.rmSync(resultPath, { force: true });

  const entryArgs = ['--name', name, '--repo', repoUrl];
  if (ref) entryArgs.push('--ref', ref);
  if (includeTestFiles) entryArgs.push('--include-test-files');
  const cname = containerName(name);
  const args = buildRunArgs({ image, name: cname, workDir, cacheDir, analysisDir, uid, gid, entryArgs });

  return new Promise((resolve, reject) => {
    const child = spawn(cli, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    readline.createInterface({ input: child.stdout, crlfDelay: Infinity }).on('line', line => console.log(line));
    readline.createInterface({ input: child.stderr, crlfDelay: Infinity }).on('line', line => console.error(line));
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      console.error(`Container ${cname} exceeded ${Math.round(timeoutMs / 60000)} min, killing it`);
      try { execFileSync(cli, ['kill', cname], { stdio: 'pipe', timeout: 60000 }); } catch { /* already gone */ }
      child.kill('SIGKILL');
      // Whatever still holds the pipes must not keep 'close' from firing.
      child.stdout.destroy();
      child.stderr.destroy();
    }, timeoutMs);

    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      let result = null;
      try {
        result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
      } catch { /* no result: the container never got that far */ }
      if (timedOut) {
        reject(new Error(`analysis of ${name} timed out after ${Math.round(timeoutMs / 60000)} min`));
      } else if (!result) {
        reject(new Error(`analysis container of ${name} exited with ${signal || code} and left no result`));
      } else {
        resolve(result);
      }
    });
  });
}

// Bytes used under a directory (du, follows nothing). 0 when it does not exist.
export function dirSizeBytes(dir) {
  if (!fs.existsSync(dir)) return 0;
  try {
    const out = execFileSync('du', ['-sb', dir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return parseInt(out.split('\t')[0], 10) || 0;
  } catch {
    return 0;
  }
}

// The npm/yarn/gradle/pip caches are only there to make the next pass faster.
// When they grow past the cap they are wiped entirely (partial pruning would
// have to understand four cache layouts); the next pass downloads again.
export function pruneCache({ cacheDir = CACHE_DIR, maxBytes = CACHE_MAX_BYTES } = {}) {
  const size = dirSizeBytes(cacheDir);
  const gb = (n) => (n / 1e9).toFixed(1);
  if (size <= maxBytes) {
    console.log(`Package caches: ${gb(size)} GB in ${cacheDir} (cap ${gb(maxBytes)} GB)`);
    return false;
  }
  console.log(`Package caches: ${gb(size)} GB in ${cacheDir} exceeds the ${gb(maxBytes)} GB cap, wiping them`);
  for (const entry of fs.readdirSync(cacheDir)) {
    fs.rmSync(path.join(cacheDir, entry), { recursive: true, force: true });
  }
  return true;
}
