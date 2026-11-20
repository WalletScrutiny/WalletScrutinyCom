// Rebuild one npm package version in the sandbox and compare it with the
// tarball the registry serves. Comparison rules, image choice and failure
// wording are source_analysis/rebuildNpm.mjs's; what differs is the sandbox
// (clone and install with the network but without lifecycle scripts, the
// package's own scripts without any network, see npm-sandbox.sh).
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { fetchNpmVersion, nodeImage, compareTarballs, diffNote, failureLine, CLONE_IMAGE } from '../source_analysis/rebuildNpm.mjs';
import { resolveRepo } from '../source_analysis/sourceRepos.mjs';
import { lsRemoteTags, identityOf, npmProvenance } from '../source_analysis/sourceIdentity.mjs';
import { sandboxArgs, runPhase, CONTAINER_CLI, LIMITS } from './sandbox.mjs';

const LOG_LIMIT = 200000;
const MAX_TARBALL_BYTES = 256 * 2 ** 20; // the host reads the rebuilt tarball into memory to compare it
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const COMMIT = /^[0-9a-f]{40}$/;
// The registry's _npmVersion is whatever the publisher's client sent. It ends up in
// `npm install -g npm@<it>`, where anything but a plain version (a URL, github:x/y) would
// make the sandbox run a stranger's npm with the network open.
const NPM_VERSION = /^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/;
// repository.directory is the publisher's word too, and the clone step prints it
const plainPath = (d) => /^[\w.@/-]+$/.test(d) && !d.split('/').includes('..');

/**
 * A build's log is written by untrusted code and can be as large as the disk limit:
 * keep its first and last half of LOG_LIMIT on disk and return only that, never the
 * whole file in memory.
 */
export function boundedLog(file, limit = LOG_LIMIT) {
  const size = fs.statSync(file).size;
  if (size <= limit) return fs.readFileSync(file, 'utf8');
  const half = Math.floor(limit / 2), head = Buffer.alloc(half), tail = Buffer.alloc(half);
  const fd = fs.openSync(file, 'r');
  fs.readSync(fd, head, 0, half, 0);
  fs.readSync(fd, tail, 0, half, size - half);
  fs.closeSync(fd);
  const text = `${head.toString('utf8')}\n… ${size - limit} bytes left out …\n${tail.toString('utf8')}`;
  fs.writeFileSync(file, text);
  return text;
}

/**
 * Repository and tag/commit to build from, asked of the registry and the remote; repository
 * cached in db.sources. `unlisted` carries git's message when the repository's tags could not
 * be listed (gone, private, or the network): the commit the registry names is used then.
 */
export async function sourceOf(db, name, version, { resolve = resolveRepo, lsRemote = lsRemoteTags, provenance = npmProvenance } = {}) {
  let src = db.prepare(`SELECT repo_url FROM sources WHERE ecosystem = 'npm' AND name = ?`).get(name);
  if (!src) {
    const r = await resolve({ ecosystem: 'npm', name, version });
    db.prepare(`INSERT OR REPLACE INTO sources (ecosystem, name, repo_url) VALUES ('npm', ?, ?)`).run(name, r.url || null);
    src = { repo_url: r.url || null };
  }
  if (!src.repo_url) return null;
  let unlisted = null;
  const tags = await lsRemote(src.repo_url).catch((e) => { unlisted = e.message || 'git ls-remote failed'; return null; });
  const npm = await provenance(name, version).catch(() => null);
  const id = identityOf({ ecosystem: 'npm', name, version }, tags, npm);
  // the registry's gitHead is the publisher's word: only a full commit id is a ref we check out
  const commit = [id.commit, npm?.gitHead].find(c => COMMIT.test(c || '')) || null;
  return { repoUrl: src.repo_url, ref: id.tag || commit, commit, unlisted };
}

/**
 * Never throws for a failed build, only for a registry the host cannot reach. The row's
 * `phase` says where a failure happened: source, clone, install (the steps that need the
 * network, which the service tries a second time later), build or compare.
 */
export async function rebuildNpm({ name, version, source, workRoot, fetchImpl = fetch, cli = CONTAINER_CLI, limits = LIMITS }) {
  const facts = await fetchNpmVersion(name, version, fetchImpl);
  const slug = `${name.replace(/[^a-zA-Z0-9.-]/g, '_')}@${version}`;
  const dir = path.join(workRoot, slug);
  fs.rmSync(dir, { recursive: true, force: true });
  try {
    return await rebuildIn(dir, { name, version, source, facts, slug, fetchImpl, cli, limits });
  } catch (e) {
    fs.rmSync(dir, { recursive: true, force: true }); // nothing of a build that could not be judged stays on disk
    throw e;
  }
}

async function rebuildIn(dir, { name, version, source, facts, slug, fetchImpl, cli, limits }) {
  const workDir = path.join(dir, 'work'), outDir = path.join(dir, 'out');
  fs.mkdirSync(workDir, { recursive: true }); fs.mkdirSync(outDir, { recursive: true });
  const logFile = path.join(dir, 'build.log');
  const t0 = Date.now();

  const r = await fetchImpl(facts.tarball, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`${facts.tarball}: HTTP ${r.status}`);
  const registryBuf = Buffer.from(await r.arrayBuffer());
  const integrity = `sha512-${createHash('sha512').update(registryBuf).digest('base64')}`;
  if (facts.integrity?.startsWith('sha512-') && facts.integrity !== integrity) throw new Error(`${name}@${version}: the downloaded tarball does not match the registry's integrity`);
  const x = sha256(registryBuf);
  const image = nodeImage(facts.nodeVersion);
  const npmVersion = NPM_VERSION.test(facts.npmVersion || '') ? facts.npmVersion : '';
  const row = { ecosystem: 'npm', name, version, sha256: x, artifact: path.basename(new URL(facts.tarball).pathname), commit: source?.commit || null, ref: source?.ref || null, repoUrl: source?.repoUrl || null, toolchain: `${image.split('/').pop()} npm ${npmVersion || 'default'}`, sandbox: 'clone+install: network, no scripts; build: no network', log: logFile };
  const done = (result, note, phase = null) => {
    fs.rmSync(workDir, { recursive: true, force: true });
    return { ...row, result, note, phase, seconds: Math.round((Date.now() - t0) / 1000) };
  };

  if (!source?.repoUrl) return done('failed', 'No source repository found for this package');
  if (facts.directory && !plainPath(facts.directory)) return done('failed', 'The registry names a package directory that is not a plain path');
  if (!source.ref) {
    return source.unlisted
      ? done('failed', `The source repository could not be read: ${source.unlisted.slice(0, 160)}`, 'source')
      : done('failed', 'No git tag or commit for this version');
  }
  fs.writeFileSync(logFile, `== ${name}@${version} registry sha256 ${x}\n== image ${image}\n`);
  const env = { REPO: source.repoUrl, REF: source.ref, DIR: facts.directory || '', NPMV: npmVersion };
  const cname = `dr-${process.pid}-${slug.replace(/[^a-zA-Z0-9.-]/g, '_')}`.slice(0, 100);
  const phases = [
    { phase: 'clone', image: CLONE_IMAGE, network: 'default' },
    { phase: 'install', image, network: 'default' },
    { phase: 'build', image, network: 'none', out: true },
  ];
  let run = { code: 0 }, failedPhase = null;
  for (const p of phases) {
    fs.appendFileSync(logFile, `\n=== phase ${p.phase} (${p.network === 'none' ? 'no network' : 'network, no package scripts'})\n`);
    const name2 = `${cname}-${p.phase}`;
    run = await runPhase({
      cli, name: name2, logFile, workDir, outDir: p.out ? outDir : null, limits,
      args: sandboxArgs({ image: p.image, name: name2, workDir, outDir: p.out ? outDir : null, env: { ...env, PHASE: p.phase }, network: p.network, cli, limits }),
    });
    if (run.code !== 0 || run.timedOut || run.tooBig) { failedPhase = p.phase; break; }
  }
  const logText = boundedLog(logFile);
  const commit = /^commit ([0-9a-f]{40})/m.exec(logText)?.[1];
  if (commit) row.commit = commit;
  const npmUsed = /^== npm \S+ packed nothing, packing with the image's npm (\S+)/m.exec(logText)?.[1] || /^== node \S+ npm (\S+)/m.exec(logText)?.[1];
  if (npmUsed) row.toolchain = `${image.split('/').pop()} npm ${npmUsed}`;
  if (run.timedOut) return done('failed', `The ${failedPhase} step did not finish in ${limits.phaseMs / 60000} minutes`, failedPhase);
  if (run.tooBig) return done('failed', `The ${failedPhase} step used more than ${Math.round(limits.diskBytes / 2 ** 30)} GB of disk`, failedPhase);
  // Whatever is in the output directory was put there by the package's own code: only a
  // regular file is read (a link would be followed out of the directory, a pipe or device
  // never ends), and only up to the size limit.
  const packed = fs.readdirSync(outDir).filter(f => f.endsWith('.tgz'));
  if (run.code !== 0 || packed.length !== 1) return done('failed', `${failedPhase || 'build'} failed: ${failureLine(logText).slice(0, 160)}`, failedPhase || 'build');
  const packedFile = path.join(outDir, packed[0]);
  const stat = fs.lstatSync(packedFile);
  if (!stat.isFile()) return done('failed', 'The build left something other than a file as its tarball', 'build');
  if (stat.size > MAX_TARBALL_BYTES) return done('failed', `The rebuilt tarball is larger than ${MAX_TARBALL_BYTES / 2 ** 20} MB`, 'build');
  let cmp;
  try { cmp = compareTarballs(registryBuf, fs.readFileSync(packedFile)); } catch (e) { return done('failed', `The tarballs could not be compared: ${String(e.message).slice(0, 120)}`, 'compare'); }
  fs.appendFileSync(logFile, `== comparison ${JSON.stringify({ ...cmp, missing: cmp.missing.slice(0, 50), extra: cmp.extra.slice(0, 50), changed: cmp.changed.slice(0, 50) })}\n`);
  if (cmp.match) return done('reproduced', cmp.identical ? 'Byte-identical tarball' : `All ${cmp.files} files identical; tarball metadata differs`);
  return done('failed', `Rebuilt tarball differs: ${diffNote(cmp)}`, 'compare');
}
