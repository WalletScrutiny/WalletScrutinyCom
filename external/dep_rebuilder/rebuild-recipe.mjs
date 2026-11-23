// Build one commit of a repository the way its recipe says (recipes.mjs) and
// compare every package the recipe covers with the tarball the registry serves.
// One build, many packages: Babel's root build gives 150 of them.
//
// The recipe only says what to run. Where the packages are is read from the
// clone step, before any code of the repository has run; the comparison is the
// host's, with the rules of the generic build (rebuild.mjs). The recipe's build
// and pack commands run without a network.
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { fetchNpmVersion, nodeImage, compareTarballs, diffNote, reproducedNote, failureLine, CLONE_IMAGE } from '../source_analysis/rebuildNpm.mjs';
import { sandboxArgs, runPhase, removeTree, reclaim, CONTAINER_CLI, LIMITS, RECIPE_SCRIPT } from './sandbox.mjs';
import { boundedLog } from './rebuild.mjs';
import { isNpmName } from './recipes.mjs';

const MAX_TARBALL_BYTES = 256 * 2 ** 20;
const DOWNLOADS = 6;
// npm before 7 has no --pack-destination, so the tarball is moved
const DEFAULT_PACK = 'npm pack --offline >/dev/null && mv -- *.tgz "$OUT"';
export const RECIPE_SANDBOX = 'clone: network, no repository code; fetch: network, the recipe\'s commands; build and pack: no network';
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const plainPath = (d) => typeof d === 'string' && /^[\w.@/-]+$/.test(d) && !d.split('/').includes('..');

async function pool(items, fn, n) {
  const queue = [...items.entries()];
  await Promise.all(Array.from({ length: n }, async () => { while (queue.length) { const [i, item] = queue.shift(); await fn(item, i); } }));
}

/**
 * Regular files below `dir` whose content is one of `wanted` (sha256 → anything):
 * `hits`. The tree was written by a build: links are not followed and only files
 * of a wanted size are read. What could not be looked at (a directory or file
 * that cannot be read) is `unread`: the caller must not take that for "not there".
 */
export function filesWithContent(dir, wanted, sizes) {
  const hits = [], unread = [], stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let names;
    try { names = fs.readdirSync(d); } catch { unread.push(d); continue; }
    for (const name of names) {
      const file = path.join(d, name);
      let stat;
      try { stat = fs.lstatSync(file); } catch { unread.push(file); continue; }
      if (stat.isDirectory()) stack.push(file);
      else if (stat.isFile() && sizes.has(stat.size)) {
        try { if (wanted.has(sha256(fs.readFileSync(file)))) hits.push(file); } catch { unread.push(file); }
      }
    }
  }
  return { hits, unread };
}

/**
 * Rows for `packages` ({ name, version }), one each, never fewer. Throws only when
 * the registry cannot be reached. `phase` on a failed row: clone, fetch (the steps
 * with a network, which get a second try), build or compare. `not-covered` instead
 * of `failed`: the recipe's repository does not hold the package at that commit, so
 * the recipe says nothing about it and the generic build keeps it.
 *
 * `keep` leaves the rebuilt tarballs (not the checkout) where `out` in the return
 * value says, for someone writing a recipe to look at what differs.
 */
export async function rebuildWithRecipe({ recipe, ref, commit = null, packages, workRoot, fetchImpl = fetch, cli = CONTAINER_CLI, limits = LIMITS, keep = false }) {
  const slug = `recipe-${recipe.id}-${String(ref).replace(/[^a-zA-Z0-9.-]/g, '_')}`.slice(0, 80);
  const dir = path.join(workRoot, slug);
  removeTree(dir);
  try {
    return await rebuildIn(dir, { recipe, ref, commit, packages, slug, fetchImpl, cli, limits, keep });
  } catch (e) {
    removeTree(dir);
    throw e;
  }
}

async function rebuildIn(dir, { recipe, ref, commit, packages, slug, fetchImpl, cli, limits, keep }) {
  const workDir = path.join(dir, 'work'), outDir = path.join(dir, 'out'), registryDir = path.join(dir, 'registry');
  for (const d of [workDir, outDir, registryDir]) fs.mkdirSync(d, { recursive: true });
  const logFile = path.join(dir, 'build.log');
  const t0 = Date.now();
  const base = { ecosystem: 'npm', repoUrl: recipe.repo, ref, commit, recipe: recipe.key, recipeEvent: recipe.event || null, sandbox: RECIPE_SANDBOX, log: logFile };
  const jobs = packages.map((p, n) => ({ n, name: p.name, version: p.version, row: { ...base, name: p.name, version: p.version }, result: null }));
  const settle = (j, result, note, phase = null) => { j.result = { result, note, phase }; };
  const open = () => jobs.filter(j => !j.result);
  const finish = () => {
    removeTree(workDir);
    if (!keep) removeTree(outDir);
    removeTree(registryDir);
    if (fs.existsSync(logFile)) boundedLog(logFile); // on every way out: a step that was stopped may have filled the disk limit with output
    const seconds = Math.round((Date.now() - t0) / 1000);
    return { log: logFile, out: keep ? outDir : null, seconds, rows: jobs.map(j => ({ ...j.row, ...j.result, seconds })) };
  };
  const failOpen = (note, phase) => { for (const j of open()) settle(j, 'failed', note, phase); return finish(); };

  // What the registry serves, onto the host's disk and outside what a container sees.
  await pool(jobs, async (j) => {
    if (!isNpmName(j.name)) return settle(j, 'failed', 'Not a package name');
    let facts;
    try { facts = await fetchNpmVersion(j.name, j.version, fetchImpl); } catch (e) {
      if (/HTTP 404$/.test(e.message)) return settle(j, 'failed', 'The registry does not have this version');
      throw e;
    }
    const r = await fetchImpl(facts.tarball, { signal: AbortSignal.timeout(120000) });
    if (!r.ok) throw new Error(`${facts.tarball}: HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (facts.integrity?.startsWith('sha512-') && facts.integrity !== `sha512-${createHash('sha512').update(buf).digest('base64')}`) throw new Error(`${j.name}@${j.version}: the downloaded tarball does not match the registry's integrity`);
    j.registryFile = path.join(registryDir, `${j.n}.tgz`);
    fs.writeFileSync(j.registryFile, buf);
    j.size = buf.length;
    Object.assign(j.row, { sha256: sha256(buf), artifact: path.basename(new URL(facts.tarball).pathname) });
    j.nodeVersion = facts.nodeVersion;
  }, DOWNLOADS);
  if (!open().length) return finish();

  // The publisher's Node unless the recipe names one: what was published was built with some Node, and the recipe's author knows which works.
  // (Of the first package that names one: a commit's packages are published by one run of one tool.)
  const image = recipe.image ? `docker.io/library/${recipe.image}` : nodeImage(jobs.find(j => j.nodeVersion)?.nodeVersion);
  for (const j of jobs) j.row.toolchain = image.split('/').pop();
  fs.writeFileSync(logFile, `== recipe ${recipe.key} ${recipe.repo} ${ref}, ${open().length} package(s)\n== image ${image}\n`);
  const cname = `dr-${process.pid}-${slug}`.slice(0, 100);
  const env = {
    REPO: recipe.repo, REF: commit || ref,
    WANTED: open().map(j => `${j.n} ${j.name}`).join('\n'),
    FETCH: recipe.fetch.join('\n'), BUILD: recipe.build.join('\n'), PACK: recipe.pack || DEFAULT_PACK, DIRS: '',
  };
  const runIn = (phase, { image: img = image, network = 'default', out = false } = {}) => {
    fs.appendFileSync(logFile, `\n=== phase ${phase} (${network === 'none' ? 'no network' : 'network'})\n`);
    const name = `${cname}-${phase}`;
    return runPhase({
      cli, name, logFile, workDir, outDir: out ? outDir : null, limits,
      args: sandboxArgs({ image: img, name, workDir, outDir: out ? outDir : null, env: { ...env, PHASE: phase }, network: network === 'none' ? 'none' : 'default', cli, limits, script: RECIPE_SCRIPT }),
    });
  };
  const stopped = (run, phase) => {
    if (run.timedOut) return `The ${phase} step did not finish in ${limits.phaseMs / 60000} minutes`;
    if (run.tooBig) return `The ${phase} step used more than ${Math.round(limits.diskBytes / 2 ** 30)} GB of disk`;
    if (run.code !== 0) return `${phase} failed: ${failureLine(boundedLog(logFile)).slice(0, 160)}`;
    return null;
  };

  let run = await runIn('clone', { image: CLONE_IMAGE });
  if (stopped(run, 'clone')) return failOpen(stopped(run, 'clone'), 'clone');
  // Read now, before any code of the repository has run and written to the log: whole lines, the last of each.
  const lines = boundedLog(logFile).split('\n');
  const cloned = /^commit ([0-9a-f]{40})(?= |$)/.exec(lines.filter(l => l.startsWith('commit ')).pop() || '')?.[1];
  if (cloned) for (const j of jobs) j.row.commit = cloned;
  const at = new Map(lines.map(l => /^== package (\d+) (\S+)$/.exec(l)).filter(Boolean).map(m => [Number(m[1]), m[2]]));
  for (const j of open()) {
    const d = at.get(j.n);
    if (!d || !plainPath(d)) settle(j, 'not-covered', 'The recipe\'s repository does not have exactly one package of this name at this commit');
    else j.dir = d;
  }
  if (!open().length) return finish();
  env.DIRS = open().map(j => `${j.n} ${j.dir}`).join('\n');

  if (recipe.fetch.length) {
    run = await runIn('fetch');
    if (stopped(run, 'fetch')) return failOpen(stopped(run, 'fetch'), 'fetch');
  }
  // The steps with a network must not bring what is to be built (the clone too: its bytes are the
  // repository's choice). This finds the plain case, the published file itself lying in the work
  // directory; a recipe is public so that the rest can be read. Modes are the steps' to set, so they
  // are set back first, and what still cannot be read counts as hidden.
  reclaim(workDir);
  const wanted = new Map(open().map(j => [j.row.sha256, j])), sizes = new Set(open().map(j => j.size));
  const brought = filesWithContent(workDir, wanted, sizes);
  if (brought.hits.length) {
    fs.appendFileSync(logFile, `== the steps with a network left ${brought.hits.length} published tarball(s) in the work directory, first ${path.relative(workDir, brought.hits[0]).slice(0, 300)}\n`);
    return failOpen('The steps with a network brought a published package that this build is to make');
  }
  if (brought.unread.length) {
    fs.appendFileSync(logFile, `== ${brought.unread.length} path(s) in the work directory cannot be read after the steps with a network, first ${path.relative(workDir, brought.unread[0]).slice(0, 300)}\n`);
    return failOpen('The steps with a network left files in the work directory that cannot be read');
  }

  run = await runIn('build', { network: 'none', out: true });
  const logText = boundedLog(logFile);
  if (stopped(run, 'build')) return failOpen(stopped(run, 'build'), 'build');
  // the build can print this line too: only something that looks like versions is taken
  const tools = /^== node (v\d[\w.-]{0,30}) npm (\d[\w.-]{0,30}) \(offline\)$/m.exec(logText);
  if (tools) for (const j of jobs) j.row.toolchain = `${image.split('/').pop()} (node ${tools[1]})`;

  for (const j of open()) {
    // Whatever is in the output directory was put there by the repository's code: only a regular file of a sane size is read.
    const file = path.join(outDir, `${j.n}.tgz`);
    let stat = null;
    try { stat = fs.lstatSync(file); } catch { /* nothing packed */ }
    if (!stat) { settle(j, 'failed', 'The recipe packed nothing for this package', 'build'); continue; }
    if (!stat.isFile()) { settle(j, 'failed', 'The build left something other than a file as its tarball', 'build'); continue; }
    if (stat.size > MAX_TARBALL_BYTES) { settle(j, 'failed', `The rebuilt tarball is larger than ${MAX_TARBALL_BYTES / 2 ** 20} MB`, 'build'); continue; }
    let cmp;
    try { cmp = compareTarballs(fs.readFileSync(j.registryFile), fs.readFileSync(file)); } catch (e) { settle(j, 'failed', `The tarballs could not be compared: ${String(e.message).slice(0, 120)}`, 'compare'); continue; }
    // file names are the build's: a few of them, cut, in the log and in the note
    const some = (names) => names.slice(0, 10).map(f => f.slice(0, 200));
    fs.appendFileSync(logFile, `== comparison ${j.name}@${j.version} ${JSON.stringify({ ...cmp, missing: some(cmp.missing), extra: some(cmp.extra), changed: some(cmp.changed), explained: undefined })}\n`);
    if (reproducedNote(cmp)) settle(j, 'reproduced', reproducedNote(cmp));
    else settle(j, 'failed', `Rebuilt tarball differs: ${diffNote(cmp)}`.slice(0, 400), 'compare');
  }
  return finish();
}
