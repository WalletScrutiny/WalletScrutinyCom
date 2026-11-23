// Rebuild one npm package version in the sandbox and compare it with the
// tarball the registry serves. Comparison rules, image choice and failure
// wording are source_analysis/rebuildNpm.mjs's; what differs is the sandbox
// (clone and install with the network but without lifecycle scripts, the
// package's own scripts without any network, see npm-sandbox.sh).
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { fetchNpmVersion, nodeImage, compareTarballs, diffNote, reproducedNote, failureLine, CLONE_IMAGE } from '../source_analysis/rebuildNpm.mjs';
import { resolveRepo } from '../source_analysis/sourceRepos.mjs';
import { lsRemoteTags, identityOf, npmProvenance } from '../source_analysis/sourceIdentity.mjs';
import { sandboxArgs, runPhase, removeTree, CONTAINER_CLI, LIMITS } from './sandbox.mjs';

const LOG_LIMIT = 200000;
const MAX_TARBALL_BYTES = 256 * 2 ** 20; // the host reads the rebuilt tarball into memory to compare it
const AFTER_BUILD = 'after-build.tgz'; // npm-sandbox.sh: the package packed again after a "build" script no publish hook calls
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const isCommit = (c) => typeof c === 'string' && /^[0-9a-f]{40}$/.test(c);
// The registry's _npmVersion is whatever the publisher's client sent. It ends up in
// `npm install -g npm@<it>`, where anything but a plain version (a URL, github:x/y) would
// make the sandbox run a stranger's npm with the network open.
const isNpmVersion = (v) => typeof v === 'string' && /^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(v);
// repository.directory is the publisher's word too, and the clone step prints it
const plainPath = (d) => typeof d === 'string' && /^[\w.@/-]+$/.test(d) && !d.split('/').includes('..');

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
  const npm = await provenance(name, version); // throws when the registry cannot be reached, as the build would a moment later
  const id = identityOf({ ecosystem: 'npm', name, version }, tags, npm);
  // the registry's gitHead is the publisher's word: only a full commit id is a ref we check out
  const commit = [id.commit, npm?.gitHead].find(isCommit) || null;
  return { repoUrl: src.repo_url, ref: id.tag || commit, commit, unlisted };
}

/**
 * Never throws for a failed build, only for a registry the host cannot reach. The row's
 * `phase` says where a failure happened: source, clone, install (the steps that need the
 * network, which the service tries a second time later), build or compare.
 *
 * `unsupported` instead of `failed`: the package is a member of a workspace and what was
 * built in its own directory is not the published package. Such a package is built by its
 * repository's root (Babel: one `make` for 150 packages, which also writes each LICENSE and
 * rewrites each package.json), and that build is not run here. What was compared is the
 * directory as it is in git, so the difference says nothing about the package.
 */
export async function rebuildNpm({ name, version, source, workRoot, fetchImpl = fetch, cli = CONTAINER_CLI, limits = LIMITS }) {
  const facts = await fetchNpmVersion(name, version, fetchImpl);
  const slug = `${name.replace(/[^a-zA-Z0-9.-]/g, '_')}@${version}`;
  const dir = path.join(workRoot, slug);
  removeTree(dir);
  try {
    return await rebuildIn(dir, { name, version, source, facts, slug, fetchImpl, cli, limits });
  } catch (e) {
    removeTree(dir); // nothing of a build that could not be judged stays on disk
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
  const npmVersion = isNpmVersion(facts.npmVersion) ? facts.npmVersion : '';
  const row = { ecosystem: 'npm', name, version, sha256: x, artifact: path.basename(new URL(facts.tarball).pathname), commit: source?.commit || null, ref: source?.ref || null, repoUrl: source?.repoUrl || null, toolchain: `${image.split('/').pop()} npm ${npmVersion || 'default'}`, sandbox: 'clone+install: network, no scripts; build: no network', log: logFile };
  const done = (result, note, phase = null) => {
    removeTree(workDir);
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
  const env = { REPO: source.repoUrl, REF: source.ref, NAME: name, DIR: facts.directory || '', NPMV: npmVersion };
  const cname = `dr-${process.pid}-${slug.replace(/[^a-zA-Z0-9.-]/g, '_')}`.slice(0, 100);
  const phases = [
    { phase: 'clone', image: CLONE_IMAGE, network: 'default' },
    { phase: 'install', image, network: 'default' },
    { phase: 'build', image, network: 'none', out: true },
  ];
  const runIn = (p) => {
    fs.appendFileSync(logFile, `\n=== phase ${p.phase} (${p.network === 'none' ? 'no network' : 'network, no package scripts'})\n`);
    const name2 = `${cname}-${p.phase}`;
    return runPhase({
      cli, name: name2, logFile, workDir, outDir: p.out ? outDir : null, limits,
      args: sandboxArgs({ image: p.image, name: name2, workDir, outDir: p.out ? outDir : null, env: { ...env, PHASE: p.phase }, network: p.network, cli, limits }),
    });
  };
  let run = { code: 0 }, failedPhase = null, workspaceMember = false;
  for (const p of phases) {
    run = await runIn(p);
    if (run.code !== 0 || run.timedOut || run.tooBig) { failedPhase = p.phase; break; }
    if (p.phase === 'clone') {
      // What the clone step says (npm-sandbox.sh) is read here, before any code of the repository
      // has run and written to the log: a build cannot say these about itself. Whole lines, split
      // at \n only, and the last of each: the script prints them after git's own output.
      const said = (what) => boundedLog(logFile).split('\n').filter(l => l.startsWith(what)).pop()?.slice(what.length);
      workspaceMember = said('== workspace member: ') != null;
      const cloned = /^[0-9a-f]{40}(?= |$)/.exec(said('commit ') || '')?.[0]; // the commit that was checked out
      if (cloned) row.commit = cloned;
      // where the package is, when that is not where the registry says
      const at = said('== package directory: ');
      if (at != null && !plainPath(at)) return done('failed', 'The source repository does not have exactly one package of this name');
      if (at) env.DIR = at;
    }
  }
  const logText = boundedLog(logFile);
  // (cut: `what` can carry file names of the rebuilt tarball, which are as long as the build likes)
  const notBuilt = (what) => done('unsupported', `Member of a workspace, whose root build is not run here: ${what}`.slice(0, 400), 'build');
  // the build can print these lines too: only something that looks like a version is taken
  const npmUsed = /^== npm \S+ packed nothing, packing with the image's npm (\d[\w.-]{0,30})$/m.exec(logText)?.[1] || /^== node \S+ npm (\d[\w.-]{0,30})$/m.exec(logText)?.[1];
  if (npmUsed) row.toolchain = `${image.split('/').pop()} npm ${npmUsed}`;
  if (run.timedOut) return done('failed', `The ${failedPhase} step did not finish in ${limits.phaseMs / 60000} minutes`, failedPhase);
  if (run.tooBig) return done('failed', `The ${failedPhase} step used more than ${Math.round(limits.diskBytes / 2 ** 30)} GB of disk`, failedPhase);
  // Whatever is in the output directory was put there by the package's own code: only a
  // regular file is read (a link would be followed out of the directory, a pipe or device
  // never ends), and only up to the size limit.
  const tarballs = fs.readdirSync(outDir).filter(f => f.endsWith('.tgz'));
  const packed = tarballs.filter(f => f !== AFTER_BUILD);
  if (run.code !== 0 || packed.length !== 1) {
    const why = `${failedPhase || 'build'} failed: ${failureLine(logText).slice(0, 160)}`;
    return workspaceMember && (failedPhase || 'build') === 'build' ? notBuilt(why) : done('failed', why, failedPhase || 'build');
  }
  const unreadable = (file) => {
    const stat = fs.lstatSync(file);
    if (!stat.isFile()) return 'The build left something other than a file as its tarball';
    if (stat.size > MAX_TARBALL_BYTES) return `The rebuilt tarball is larger than ${MAX_TARBALL_BYTES / 2 ** 20} MB`;
    return null;
  };
  const packedFile = path.join(outDir, packed[0]);
  if (unreadable(packedFile)) return done('failed', unreadable(packedFile), 'build');
  let cmp, how = '';
  try { cmp = compareTarballs(registryBuf, fs.readFileSync(packedFile)); } catch (e) { return done('failed', `The tarballs could not be compared: ${String(e.message).slice(0, 120)}`, 'compare'); }
  // Not the published package: a "build" script that no publish hook calls gets a step of its
  // own (npm-sandbox.sh), and what is packed after it is judged instead. A step that fails, runs
  // out of time or leaves nothing readable changes nothing: the first comparison stands.
  if (!reproducedNote(cmp)) {
    removeTree(path.join(outDir, AFTER_BUILD)); // whatever the build step left under that name
    const again = await runIn({ phase: 'after-build', image, network: 'none', out: true });
    const builtFile = path.join(outDir, AFTER_BUILD);
    if (again.code === 0 && !again.timedOut && !again.tooBig && fs.readdirSync(outDir).includes(AFTER_BUILD) && !unreadable(builtFile)) {
      try { cmp = compareTarballs(registryBuf, fs.readFileSync(builtFile)); how = ' after `npm run build`'; } catch (e) { /* the first comparison stands */ }
    }
    boundedLog(logFile);
  }
  // (cut: file names are the build's, and as long as it likes)
  fs.appendFileSync(logFile, `== comparison${how} ${JSON.stringify({ ...cmp, missing: cmp.missing.slice(0, 50), extra: cmp.extra.slice(0, 50), changed: cmp.changed.slice(0, 50) }).slice(0, 20000)}\n`);
  if (reproducedNote(cmp)) return done('reproduced', `${reproducedNote(cmp)}${how}`);
  if (workspaceMember) return notBuilt(diffNote(cmp));
  return done('failed', `Rebuilt tarball differs${how}: ${diffNote(cmp)}`.slice(0, 400), 'compare');
}
