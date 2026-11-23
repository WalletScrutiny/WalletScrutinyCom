// Which build of a recipe comes next, and what is kept of one that ran. The
// command line (index.mjs) and the service call these; everything that touches
// the network or a container is passed in, so the bookkeeping can be tested.
import fs from 'fs';
import path from 'path';
import { pendingForRecipe, saveRebuild, saveRecipeSkip } from './db.mjs';
import { recipeFor, planJobs } from './recipes.mjs';
import { removeTree } from './sandbox.mjs';

/**
 * The next build: of the first recipe with work, the commit that settles the most.
 * Versions its repository has no tag for are remembered as that (recipe_skips) and
 * stay with the generic build. A repository that cannot be listed sets its recipe
 * aside (`deferred`) until the caller clears the set.
 */
export async function nextRecipeJob({ db, recipes, listTags, deferred = new Set(), only = null, retry = false, scope = 'app', minWallets = 1, log = () => {} }) {
  for (const recipe of recipes) {
    if ((only && recipe.id !== only) || deferred.has(recipe.key)) continue;
    const mine = (name, version) => recipeFor(recipes, name, version) === recipe;
    const todo = pendingForRecipe(db, recipe.key, mine, { scope, minWallets, retry });
    if (!todo.length) continue;
    let tags;
    try { tags = await listTags(recipe.repo); } catch (e) { deferred.add(recipe.key); log(`recipe ${recipe.id}: ${recipe.repo} could not be listed: ${e.message}`); continue; }
    const { jobs, untagged } = planJobs(recipe, todo, tags);
    for (const c of untagged) saveRecipeSkip(db, recipe.key, c, 'no tag for this version');
    const job = jobs.map(j => ({ ...j, key: `${recipe.key} ${j.ref}` })).find(j => !deferred.has(j.key));
    if (job) return job;
  }
  return null;
}

/**
 * Run one build, keep its log, save a row per package. Throws when the registry
 * cannot be reached, and when the run was told to stop while something had not
 * reproduced: a shutdown takes the container down, which is not the package
 * failing, so only what was reproduced before that is kept.
 */
export async function runRecipeJob({ db, job, build, workRoot, interrupted = () => false, print = console.log }) {
  fs.mkdirSync(path.join(workRoot, 'logs'), { recursive: true });
  const r = await build({ recipe: job.recipe, ref: job.ref, commit: job.commit, packages: job.packages, workRoot });
  const kept = path.join(workRoot, 'logs', `recipe-${job.recipe.id}-${job.ref.replace(/[^a-zA-Z0-9.@-]/g, '_')}.log`);
  if (fs.existsSync(r.log)) { fs.copyFileSync(r.log, kept); removeTree(path.dirname(r.log)); }
  const rows = r.rows.map(row => ({ ...row, log: kept }));
  const stopped = interrupted();
  for (const row of rows) {
    if (row.result === 'not-covered') { if (!stopped) saveRecipeSkip(db, job.recipe.key, row, 'not in the repository at this tag'); } // no result: the generic build keeps it
    else if (row.result === 'reproduced' || !stopped) saveRebuild(db, row);
  }
  if (stopped && rows.some(row => row.result !== 'reproduced')) throw new Error('stopped while it was building, so what did not reproduce is not kept');
  const ok = rows.filter(row => row.result === 'reproduced').length;
  print(`${ok === rows.length ? '✓' : ok ? '~' : '✗'} recipe ${job.recipe.id} ${job.ref}: ${ok} of ${rows.length} reproduced, ${r.seconds}s`);
  for (const row of rows) if (row.result !== 'reproduced') print(`  ${row.result === 'not-covered' ? '–' : '✗'} ${row.name}@${row.version}: ${row.note}`);
  return rows;
}
