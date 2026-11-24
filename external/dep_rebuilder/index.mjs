#!/usr/bin/env node
// dep-rebuilder: rebuild the dependency versions WalletScrutiny wallets ship,
// the most shared first, every build inside a sandbox (see sandbox.mjs and
// README.md). Its database is its own; it reads the published dependency
// export and never touches source_analysis's database.
//
//   node index.mjs sync   [--export URL|DIR] [--releases all|latest]   read the export, count wallets per package version
//   node index.mjs list   [--top N] [--scope app|any]                  what would be built next
//   node index.mjs run    [--top N] [--retry] [--scope app|any] [--min-wallets N] [--package name@version]...
//   node index.mjs serve  [--scope app|any] [--min-wallets N]         unattended: sync daily, rebuild one version at a time, forever (the systemd service)
//   node index.mjs site   [--out DIR] [--publish]                      write rebuilds.json for the website; --publish also copies it (DEP_REBUILDER_PUBLISH_TARGET)
//   node index.mjs status                                               tally of results and verdicts
//   node index.mjs verdicts [--verdict V] [--top N]                     results with what they say (db.mjs VERDICTS), most wallets first
//   node index.mjs run --recipe ID [--top N] [--retry]                  build the next N commits a recipe covers
//   node index.mjs try RECIPE.json (--version V | --package name@version...)   run a recipe being written; nothing is saved, the rebuilt tarballs are kept
//   node index.mjs recipes                                              the recipes in use: recipes/ and those signed by the listed authors
//   node index.mjs publish RECIPE.json                                  sign a recipe (DEP_RECIPE_NSEC) and send it to the relays
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { openDb, saveCandidates, pending, saveRebuild, tally, verdicts, VERDICTS, WORK_DIR, DB_PATH, DATA_DIR } from './db.mjs';
import { loadRecipes, parseRecipe, covers, planJobs } from './recipes.mjs';
import { nextRecipeJob, runRecipeJob } from './recipe-jobs.mjs';
import { rebuildWithRecipe } from './rebuild-recipe.mjs';
import { signedRecipes, recipesInUse, publishRecipe, loadAuthors } from './recipe-events.mjs';
import { lsRemoteTags } from '../source_analysis/sourceIdentity.mjs';
import { serveLoop } from './worker.mjs';
import { removeStaleContainers, removeTree } from './sandbox.mjs';
import { writeFeed, publishFeed } from './site-export.mjs';
import { collectCandidates, EXPORT_BASE } from './candidates.mjs';
import { syncGoogle } from './google.mjs';
import { rebuildNpm, sourceOf } from './rebuild.mjs';

// Rootful podman would make a container escape a root compromise of this host.
if (process.getuid() === 0 && !process.env.DEP_REBUILDER_ALLOW_ROOT) {
  console.error('Refusing to run as root: start it as an unprivileged user with rootless podman (README.md). DEP_REBUILDER_ALLOW_ROOT=1 overrides, for tests only.');
  process.exit(1);
}
// A system service has no login session; rootless podman needs the user's runtime directory (lingering user, README).
if (!process.env.XDG_RUNTIME_DIR) process.env.XDG_RUNTIME_DIR = `/run/user/${process.getuid()}`;
const argv = minimist(process.argv.slice(2), { boolean: ['retry'], string: ['package', 'scope', 'export', 'releases', 'out', 'recipe', 'version', 'verdict'], default: { top: 10, scope: 'app', releases: 'all' } });
const cmd = argv._[0];
const db = openDb();

/**
 * Rebuild one candidate in the sandbox, keep its log, save the result. Throws when the registry
 * or network cannot be reached, and when the run was told to stop while a build that did not
 * reproduce was going on: a shutdown takes the container down with it, and that is not the
 * package failing.
 */
async function rebuildAndSave(c, { interrupted = () => false } = {}) {
  const label = `${c.name}@${c.version}`;
  fs.mkdirSync(path.join(WORK_DIR, 'logs'), { recursive: true });
  const source = await sourceOf(db, c.name, c.version);
  const r = await rebuildNpm({ name: c.name, version: c.version, source, workRoot: WORK_DIR });
  const kept = path.join(WORK_DIR, 'logs', `${label.replace(/[^a-zA-Z0-9.@-]/g, '_')}.log`);
  if (r.log) { // none when nothing was built (not on the registry)
    const scratch = path.dirname(r.log);
    if (fs.existsSync(r.log)) { fs.copyFileSync(r.log, kept); r.log = kept; }
    removeTree(scratch); // the log is kept, the tarball and checkout are not
  }
  if (r.result !== 'reproduced' && interrupted()) throw new Error('stopped while it was building, so this result is not kept');
  saveRebuild(db, r);
  console.log(`${mark(r.result)} ${label}${c.wallets ? ` (${c.wallets} wallets)` : ''} ${r.seconds}s: ${r.note}`);
  return r;
}

// The recipes in use: the files of recipes/, then those signed by the listed authors (recipe-events.mjs).
// A file wins over an event with its id. Events are asked for again after an hour; when no relay
// answers, the ones already known stay.
const fileRecipes = loadRecipes(undefined, { log: (m) => console.error(`recipe not loaded: ${m}`) });
let recipes = fileRecipes, recipesAskedAt = 0;
async function refreshRecipes({ maxAgeMs = 3600 * 1000 } = {}) {
  if (Date.now() - recipesAskedAt < maxAgeMs) return;
  recipesAskedAt = Date.now();
  const signed = await signedRecipes(db, { log: (m) => console.error(m) });
  recipes = recipesInUse(fileRecipes, signed);
}
const recipeKeys = () => recipes.map(r => r.key);
const mark = (result) => ({ reproduced: '✓', unsupported: '–', 'not-covered': '–' }[result] || '✗');
const named = (s) => { const at = s.lastIndexOf('@'); return { name: s.slice(0, at), version: s.slice(at + 1), wallets: null }; };

const nextJob = (deferred, more = {}) => nextRecipeJob({ db, recipes, listTags: lsRemoteTags, deferred, scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1), log: (m) => console.error(m), ...more });
const runJob = (job, more = {}) => runRecipeJob({ db, job, build: rebuildWithRecipe, workRoot: WORK_DIR, ...more });

async function syncAll() {
  const rows = await collectCandidates({ base: argv.export || EXPORT_BASE, releases: argv.releases, log: console.error });
  saveCandidates(db, rows);
  const g = await syncGoogle(db, { log: console.error });
  return { candidates: rows.length, google: g, ...tally(db) };
}

if (cmd === 'sync') {
  console.log(JSON.stringify({ db: DB_PATH, ...await syncAll() }));
} else if (cmd === 'list') {
  await refreshRecipes();
  for (const c of pending(db, { limit: Number(argv.top), scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1), recipeKeys: recipeKeys() })) console.log(`${c.wallets}\t${c.name}@${c.version}`);
} else if (cmd === 'recipes') {
  await refreshRecipes();
  const authors = loadAuthors();
  for (const r of recipes) console.log(`${r.key}\t${r.repo}\t${r.packages.join(' ')}\t${r.event ? `event ${r.event} by ${authors.find(a => a.pubkey === r.author)?.name || r.author}` : 'recipes/'}`);
} else if (cmd === 'publish') {
  const secret = process.env.DEP_RECIPE_NSEC;
  if (!secret) { console.error('Set DEP_RECIPE_NSEC to the key that signs (nsec or hex). Its public key must be in config/recipe-authors.json for the rebuilder to run the recipe.'); process.exit(1); }
  const r = await publishRecipe(fs.readFileSync(argv._[1], 'utf8'), secret);
  console.log(JSON.stringify({ event: r.event.id, pubkey: r.event.pubkey, relays: r.relays }));
  if (!r.relays.some(x => x.ok)) process.exitCode = 2;
} else if (cmd === 'run' && argv.recipe) {
  await refreshRecipes();
  if (!recipes.some(r => r.id === argv.recipe)) { console.error(`No recipe ${argv.recipe} (have: ${recipes.map(r => r.id).join(', ') || 'none'})`); process.exit(1); }
  let stop = false;
  for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { stop = true; console.error('stopping after this build'); });
  const done = new Set(), count = {};
  for (let i = 0; i < Number(argv.top) && !stop; i++) {
    await refreshRecipes();
    const job = await nextJob(done, { only: argv.recipe, retry: argv.retry });
    if (!job) break;
    done.add(job.key);
    try { for (const row of await runJob(job, { interrupted: () => stop })) count[row.result] = (count[row.result] || 0) + 1; }
    catch (e) { count.error = (count.error || 0) + 1; console.error(`! ${job.key}: ${e.message}`); }
  }
  console.log(JSON.stringify(count));
} else if (cmd === 'try') {
  // For whoever writes a recipe: run it on named versions, show every package's result, save nothing.
  const recipe = parseRecipe(JSON.parse(fs.readFileSync(argv._[1], 'utf8')));
  const explicit = [].concat(argv.package || []).map(named);
  const packages = explicit.length ? explicit : db.prepare(`SELECT name, version, wallets FROM candidates WHERE ecosystem = 'npm' AND version = ?`).all(String(argv.version || '')).filter(c => covers(recipe, c.name, c.version));
  if (!packages.length) { console.error('Nothing to build: name versions with --package name@version, or --version V after a sync (the versions wallets ship).'); process.exit(1); }
  const outside = packages.filter(p => !covers(recipe, p.name, p.version));
  if (outside.length) { console.error(`The recipe does not cover ${outside.map(p => `${p.name}@${p.version}`).join(', ')} (packages, versions).`); process.exit(1); }
  const { jobs, untagged } = planJobs(recipe, packages, await lsRemoteTags(recipe.repo));
  for (const c of untagged) console.log(`✗ ${c.name}@${c.version}: The recipe's repository has no tag for this version`);
  const count = { failed: untagged.length };
  for (const job of jobs) {
    const r = await rebuildWithRecipe({ recipe, ref: job.ref, commit: job.commit, packages: job.packages, workRoot: path.join(WORK_DIR, 'try'), keep: true });
    for (const row of r.rows) { count[row.result] = (count[row.result] || 0) + 1; console.log(`${mark(row.result)} ${row.name}@${row.version}: ${row.note}`); }
    console.log(`== ${job.ref} (${r.rows[0]?.commit || 'not cloned'}) ${r.seconds}s; log ${r.log}; rebuilt tarballs ${r.out}/<n>.tgz, n = the "== pack <n> <directory>" lines of the log`);
  }
  console.log(JSON.stringify({ recipe: recipe.key, ...count }));
  if (!count.reproduced || count.failed || count['not-covered']) process.exitCode = 2;
} else if (cmd === 'run') {
  const wanted = [].concat(argv.package || []).map(named);
  if (!wanted.length) await refreshRecipes();
  const todo = wanted.length ? wanted : pending(db, { limit: Number(argv.top), retry: argv.retry, scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1), recipeKeys: recipeKeys() });
  fs.mkdirSync(path.join(WORK_DIR, 'logs'), { recursive: true });
  let stop = false;
  for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { stop = true; console.error('stopping after this package'); });
  const count = {};
  for (const c of todo) {
    if (stop) break;
    try { const r = await rebuildAndSave(c, { interrupted: () => stop }); count[r.result] = (count[r.result] || 0) + 1; }
    catch (e) { count.error = (count.error || 0) + 1; console.error(`! ${c.name}@${c.version}: ${e.message}`); }
  }
  console.log(JSON.stringify(count));
} else if (cmd === 'serve') {
  let stop = false, wake = null;
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stop = true; console.error('stopping after the current package'); wake?.(); });
  const removed = removeStaleContainers();
  if (removed) console.error(`removed ${removed} container(s) left by an earlier run`);
  await serveLoop({
    db, sync: syncAll, step: (c) => rebuildAndSave(c, { interrupted: () => stop }), log: (m) => console.error(m),
    recipes: { next: async (deferred) => { await refreshRecipes(); return nextJob(deferred); }, run: (job) => runJob(job, { interrupted: () => stop }), keys: recipeKeys },
    publish: process.env.DEP_REBUILDER_PUBLISH_TARGET ? async () => publishFeed(db, path.join(DATA_DIR, 'site')) : null,
    scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1),
    shouldStop: () => stop,
    sleep: (ms) => new Promise(res => { if (stop) return res(); const t = setTimeout(res, ms); wake = () => { clearTimeout(t); res(); }; }),
  });
} else if (cmd === 'site') {
  const dir = argv.out || path.join(DATA_DIR, 'site');
  console.log(JSON.stringify(argv.publish ? publishFeed(db, dir) : { rows: writeFeed(db, dir), dir }));
} else if (cmd === 'verdicts') {
  if (argv.verdict && !VERDICTS.includes(argv.verdict)) { console.error(`--verdict is one of ${VERDICTS.join(', ')}`); process.exit(1); }
  for (const r of verdicts(db, { verdict: argv.verdict || null, limit: Number(argv.top) })) console.log(`${r.wallets}\t${r.verdict}\t${r.name}@${r.version}\t${r.note || ''}`);
} else if (cmd === 'status') {
  console.log(JSON.stringify(tally(db), null, 2));
} else {
  console.error(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 17).join('\n'));
  process.exit(1);
}
