/**
 * Our own rebuilds, rung "reproduced" for npm (issue 992 part G): rebuild one
 * package version from its source repository and compare the result with the
 * file the registry serves.
 *
 * Rules (first draft, to settle with Leo on the first rebuilds):
 *   source      the tag the identity check found (sourceIdentity.mjs), else the
 *               commit the registry names (gitHead); neither = not tried
 *   toolchain   the Node major and npm version the registry says the publisher
 *               used (_nodeVersion, _npmVersion); Node 20 / the image's npm when
 *               it says nothing
 *   build       install with the lockfile the repository has (npm ci, yarn
 *               --frozen-lockfile, pnpm --frozen-lockfile), run prepublishOnly,
 *               then npm pack, which runs prepack and prepare. Lifecycle
 *               scripts run: building is the point. Only inside the container.
 *   match       every file of the registry tarball, byte for byte, and no file
 *               more. Tar metadata (times, modes, order) and gzip are ignored,
 *               as OSS Rebuild does ("stabilized"); a byte-identical tarball is
 *               noted on top.
 *
 * Nothing runs on the host but git ls-remote, two registry downloads and the
 * comparison. The build gets a throwaway container: no token, no database, all
 * capabilities dropped, read-only root, memory/pid limits, a hard timeout.
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { createHash } from 'crypto';
import { spawn } from 'child_process';
import { CONTAINER_CLI } from './config.mjs';

export const REBUILD_TIMEOUT_MS = Number(process.env.SOURCE_ANALYSIS_REBUILD_TIMEOUT_MIN || 20) * 60 * 1000;
export const DEFAULT_NODE_MAJOR = 20;
// The clone runs in a current image: an old Node image's git and CA list can fail on today's hosts.
export const CLONE_IMAGE = `docker.io/library/node:22-bookworm`;
const LOG_LIMIT = 200000;

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

/** Registry facts the rebuild needs, from the version document. */
export function npmVersionFacts(doc) {
  const repo = doc.repository;
  return {
    tarball: doc.dist?.tarball || null,
    integrity: doc.dist?.integrity || null,
    gitHead: doc.gitHead || null,
    repoUrl: typeof repo === 'string' ? repo : repo?.url || null,
    directory: (typeof repo === 'object' && repo?.directory) || null,
    nodeVersion: doc._nodeVersion || null,
    npmVersion: doc._npmVersion || null,
  };
}

export async function fetchNpmVersion(name, version, fetchImpl = fetch) {
  const r = await fetchImpl(`https://registry.npmjs.org/${name.replace('/', '%2F')}/${encodeURIComponent(version)}`, { signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`npm ${name}@${version}: HTTP ${r.status}`);
  return npmVersionFacts(await r.json());
}

/**
 * Node image for the publisher's Node version: its major (npm before 5 does
 * not run on Node 14 and later); Debian 12 from Node 18, the major's default
 * image below, which is all there is for the old ones. Node 0.x reads as 4.
 */
export function nodeImage(nodeVersion) {
  const m = /^v?(\d+)/.exec(nodeVersion || '');
  const major = m ? Math.max(4, Number(m[1])) : DEFAULT_NODE_MAJOR;
  return `docker.io/library/node:${major}${major >= 18 ? '-bookworm' : ''}`;
}

/**
 * Regular files of a .tgz as Map path → sha256, the first path component
 * (`package/`) dropped. Parsed here rather than extracted, so nothing from a
 * tarball touches the host's file system.
 */
export function tgzFiles(buf, { bodies = false } = {}) {
  const tar = zlib.gunzipSync(buf);
  const files = new Map();
  let longName = null, pax = {};
  for (let off = 0; off + 512 <= tar.length;) {
    const h = tar.subarray(off, off + 512);
    if (h.every(b => b === 0)) break;
    const str = (a, b) => h.subarray(a, b).toString('utf8').replace(/\0.*$/s, '');
    const size = parseInt(str(124, 136).trim() || '0', 8);
    const type = String.fromCharCode(h[156] || 48);
    const body = tar.subarray(off + 512, off + 512 + size);
    off += 512 + Math.ceil(size / 512) * 512;
    if (type === 'L') { longName = body.toString('utf8').replace(/\0.*$/s, ''); continue; }
    if (type === 'x') {
      for (const rec of body.toString('utf8').split('\n')) { const m = /^\d+ ([^=]+)=(.*)$/.exec(rec); if (m) pax[m[1]] = m[2]; }
      continue;
    }
    if (type === 'g') continue;
    const prefix = str(345, 500);
    let name = longName || pax.path || (prefix ? `${prefix}/${str(0, 100)}` : str(0, 100));
    longName = null; pax = {};
    if (type !== '0' && type !== '\0' && type !== '7') continue;
    name = name.replace(/^\.?\/*/, '').split('/').slice(1).join('/');
    if (name) files.set(name, bodies ? Buffer.from(body) : sha256(body));
  }
  return files;
}

const DOC = /(^|\/)(readme|changelog|history|changes|authors|contributors)(\.[a-z]+)?$|\.md$/i;
// package.json fields that only matter to the package's own development or
// publishing; publish tools (clean-publish, pinst) strip or rewrite them.
const DEV_FIELDS = new Set(['scripts', 'devDependencies', 'publishConfig', 'files', 'directories', 'husky', 'lint-staged', 'prettier', 'eslintConfig', 'jest', 'c8', 'nyc', 'ava', 'size-limit', 'clean-publish', 'gitHead', '_id']);
const lf = (b) => b.toString('latin1').replace(/\r\n/g, '\n');

/**
 * Why one file differs, when the reason is harmless-looking: `line-endings`
 * (equal once CRLF reads as LF), `package-json-dev-fields` (package.json
 * differs only in fields that never run in a wallet), `docs` (a README or
 * changelog). Null = a real difference. Classified, not forgiven: the result
 * stays failed until Leo rules on which of these count.
 */
export function explainDiff(file, want, got) {
  if (lf(want) === lf(got)) return 'line-endings';
  if (file === 'package.json') {
    try {
      const a = JSON.parse(want), b = JSON.parse(got);
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      const real = [...keys].filter(k => !DEV_FIELDS.has(k) && JSON.stringify(a[k]) !== JSON.stringify(b[k]));
      if (!real.length) return 'package-json-dev-fields';
    } catch { /* not JSON on one side: a real difference */ }
  }
  if (DOC.test(file)) return 'docs';
  return null;
}

/** Compare the registry's tarball with ours: files missing, extra, changed, and why the changed ones differ. */
export function compareTarballs(registryBuf, rebuiltBuf) {
  const want = tgzFiles(registryBuf, { bodies: true }), got = tgzFiles(rebuiltBuf, { bodies: true });
  const missing = [...want.keys()].filter(f => !got.has(f)).sort();
  const extra = [...got.keys()].filter(f => !want.has(f)).sort();
  const changed = [...want.keys()].filter(f => got.has(f) && !got.get(f).equals(want.get(f))).sort();
  const explained = {};
  for (const f of changed) explained[f] = explainDiff(f, want.get(f), got.get(f));
  return {
    match: !missing.length && !extra.length && !changed.length,
    identical: sha256(registryBuf) === sha256(rebuiltBuf),
    files: want.size, missing, extra, changed, explained,
    // every difference has a harmless-looking reason; the only file missing or
    // extra is .npmignore, which npm before 5 packed and later versions drop
    explainedOnly: (changed.length + missing.length + extra.length) > 0
      && [...missing, ...extra].every(f => f === '.npmignore') && changed.every(f => explained[f]),
  };
}

// npm's error boilerplate: the command, paths, versions, where the log is
const NPM_NOISE = /^npm ERR! (code|errno|syscall|path|command|cwd|argv|node v|npm {1,2}v|Linux|os |A complete|If you need|Please include|Tell the author|not with npm|\s*\/|\s*$|\s+at )/;

/** The line of a build log that says why it failed: the first real error, else the last line. */
export function failureLine(log) {
  const lines = String(log).split('\n').map(l => l.trimEnd());
  const hit = lines.find(l => /^(Error:|fatal:|error |.*error TS\d+)/.test(l) || (/^npm ERR! /.test(l) && !NPM_NOISE.test(l)));
  return (hit || lines.filter(l => l && !/^npm (notice|WARN)/.test(l)).pop() || '').replace(/^npm ERR! (typeerror )?/, '');
}

const REASONS = { 'line-endings': 'line endings only', 'package-json-dev-fields': 'package.json dev fields only', docs: 'docs' };

/** One line on why a comparison failed, naming at most three files per kind. */
export function diffNote(cmp) {
  const list = (a) => a.slice(0, 3).join(', ') + (a.length > 3 ? ` and ${a.length - 3} more` : '');
  const parts = [];
  if (cmp.changed.length) {
    parts.push(`${cmp.changed.length} of ${cmp.files} files differ (${list(cmp.changed)})`);
  }
  if (cmp.missing.length) parts.push(`${cmp.missing.length} missing (${list(cmp.missing)})`);
  if (cmp.extra.length) parts.push(`${cmp.extra.length} extra (${list(cmp.extra)})`);
  if (cmp.explainedOnly) {
    const why = [...new Set(Object.values(cmp.explained || {}).filter(Boolean))].map(w => REASONS[w]);
    if ([...cmp.missing, ...cmp.extra].length) why.push('.npmignore only');
    return `${parts.join('; ')}; all explained: ${why.join(', ')}`;
  }
  return parts.join('; ');
}

// The build itself, run inside the container (see the script's header).
export const BUILD_SCRIPT = fs.readFileSync(new URL('./rebuild-npm.sh', import.meta.url), 'utf8');

export function rebuildRunArgs({ image, name, workDir, outDir, env, cli = CONTAINER_CLI, uid = process.getuid(), gid = process.getgid() }) {
  const args = [
    'run', '--rm', '--name', name,
    '--user', `${uid}:${gid}`,
    '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges',
    '--read-only',
    '--tmpfs', '/tmp:rw,exec,nosuid,size=2g',
    '--memory', '4g', '--cpus', '2', '--pids-limit', '2048',
    '-v', `${path.resolve(workDir)}:/work:rw`,
    '-v', `${path.resolve(outDir)}:/out:rw`,
    '--workdir', '/work',
  ];
  if (cli === 'podman' && uid !== 0) args.splice(1, 0, '--userns=keep-id'); // rootless podman: the caller's uid inside too
  for (const [k, v] of Object.entries(env)) args.push('-e', `${k}=${v}`);
  args.push(image, 'bash', '-c', BUILD_SCRIPT);
  return args;
}

function runLogged(cli, args, logFile, timeoutMs) {
  return new Promise((resolve) => {
    const log = fs.openSync(logFile, 'a');
    const child = spawn(cli, args, { stdio: ['ignore', log, log] });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeoutMs);
    child.on('close', (code) => { clearTimeout(timer); fs.closeSync(log); resolve({ code, timedOut }); });
  });
}

/** The Nostr event we would sign for a result. kind stays null until Leo picks one; nothing is published. */
export function rebuildEvent({ name, version, sha256: x, result, repoUrl, commit, toolchain, note, createdAt = Math.floor(Date.now() / 1000), kind = null }) {
  const tags = [['d', `npm:${name}@${version}`], ['x', x], ['status', result]];
  if (repoUrl && commit) tags.push(['source', repoUrl, commit]);
  if (toolchain) tags.push(['toolchain', toolchain]);
  if (note) tags.push(['note', note.slice(0, 200)]);
  return { kind, created_at: createdAt, tags, content: '' };
}

/**
 * Rebuild one npm package version. `source` is { repoUrl, ref, commit } from
 * the identity check. Returns the row stored in package_rebuilds (claimant ws)
 * plus the log path; never throws for a failed build, only for a registry the
 * host cannot reach.
 */
export async function rebuildNpm({ name, version, source, workRoot, fetchImpl = fetch, cli = CONTAINER_CLI, log = () => {} }) {
  const facts = await fetchNpmVersion(name, version, fetchImpl);
  const slug = `${name.replace(/[^a-zA-Z0-9.-]/g, '_')}@${version}`;
  const dir = path.join(workRoot, slug);
  fs.rmSync(dir, { recursive: true, force: true });
  const workDir = path.join(dir, 'work'), outDir = path.join(dir, 'out');
  fs.mkdirSync(workDir, { recursive: true }); fs.mkdirSync(outDir, { recursive: true });
  const logFile = path.join(dir, 'build.log');

  const r = await fetchImpl(facts.tarball, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`${facts.tarball}: HTTP ${r.status}`);
  const registryBuf = Buffer.from(await r.arrayBuffer());
  const integrity = `sha512-${createHash('sha512').update(registryBuf).digest('base64')}`;
  if (facts.integrity?.startsWith('sha512-') && facts.integrity !== integrity) throw new Error(`${name}@${version}: the downloaded tarball does not match the registry's integrity`);
  const x = sha256(registryBuf);
  const image = nodeImage(facts.nodeVersion);
  const toolchain = `${image.split('/').pop()} npm ${facts.npmVersion || 'default'}`;
  const row = { name, version, sha256: x, artifact: path.basename(new URL(facts.tarball).pathname), commit: source?.commit || null, repoUrl: source?.repoUrl || null, toolchain, logFile };
  const done = (result, note) => {
    const out = { ...row, result, note };
    out.event = rebuildEvent({ name, version, sha256: x, result, repoUrl: row.repoUrl, commit: row.commit, toolchain: row.toolchain, note });
    fs.rmSync(workDir, { recursive: true, force: true });
    return out;
  };

  if (!source?.repoUrl || !source?.ref) return done('failed', 'No git tag or commit for this version');
  fs.writeFileSync(logFile, `== ${name}@${version} registry sha256 ${x}\n== image ${image}\n`);
  const env = { REPO: source.repoUrl, REF: source.ref, DIR: facts.directory || '', NPMV: facts.npmVersion || '' };
  const cname = `rb-${process.pid}-${slug.replace(/[^a-zA-Z0-9.-]/g, '_')}`.slice(0, 110);
  const clone = await runLogged(cli, rebuildRunArgs({ image: CLONE_IMAGE, name: `${cname}-clone`, workDir, outDir, env: { ...env, PHASE: 'clone' }, cli }), logFile, REBUILD_TIMEOUT_MS);
  const run = clone.code === 0 && !clone.timedOut
    ? await runLogged(cli, rebuildRunArgs({ image, name: cname, workDir, outDir, env: { ...env, PHASE: 'build' }, cli }), logFile, REBUILD_TIMEOUT_MS)
    : clone;
  const logText = fs.readFileSync(logFile, 'utf8');
  if (logText.length > LOG_LIMIT) fs.writeFileSync(logFile, logText.slice(0, LOG_LIMIT / 2) + '\n…\n' + logText.slice(-LOG_LIMIT / 2));
  const commit = /^commit ([0-9a-f]{40})/m.exec(logText)?.[1];
  if (commit) row.commit = commit;
  // the npm that packed: the publisher's, or the image's when that one packed nothing
  const npmUsed = /^== npm \S+ packed nothing, packing with the image's npm (\S+)/m.exec(logText)?.[1] || /^== node \S+ npm (\S+)/m.exec(logText)?.[1];
  if (npmUsed) row.toolchain = `${image.split('/').pop()} npm ${npmUsed}`;
  if (run.timedOut) return done('failed', `Build did not finish in ${REBUILD_TIMEOUT_MS / 60000} minutes`);
  const packed = fs.readdirSync(outDir).filter(f => f.endsWith('.tgz'));
  if (run.code !== 0 || packed.length !== 1) {
    return done('failed', `Build failed: ${failureLine(logText).slice(0, 160)}`);
  }
  const cmp = compareTarballs(registryBuf, fs.readFileSync(path.join(outDir, packed[0])));
  fs.appendFileSync(logFile, `== comparison ${JSON.stringify({ ...cmp, missing: cmp.missing.slice(0, 50), extra: cmp.extra.slice(0, 50), changed: cmp.changed.slice(0, 50) })}\n`);
  if (cmp.match) return done('reproduced', cmp.identical ? 'Byte-identical tarball' : `All ${cmp.files} files identical; tarball metadata differs`);
  return done('failed', `Rebuilt tarball differs: ${diffNote(cmp)}`);
}
