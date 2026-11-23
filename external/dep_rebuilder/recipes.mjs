// Recipes: how one source repository builds the packages it publishes, written
// down once and run for every version wallets ship (README, "Recipes").
//
// A recipe is one JSON document, so it can be a file in recipes/ or travel as
// it is. It says what to run; it never says what the result is. The build runs
// in the sandbox and the rebuilder compares the files (rebuild-recipe.mjs).
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { matchTag } from '../source_analysis/sourceIdentity.mjs';

export const RECIPE_SCHEMA = 1;
export const RECIPES_DIR = process.env.DEP_REBUILDER_RECIPES || new URL('./recipes/', import.meta.url).pathname;

const NPM_NAME = /^(@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~][a-z0-9._~-]*$/i;
const PATTERN = /^(@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~*][a-z0-9._~*-]*$/i; // a name, with * for any run of characters but /
const VERSION = /^\d+\.\d+\.\d+$/;
const IMAGE = /^node:\d+(-(bookworm|bullseye|buster))?$/; // official Node images only: the name goes to the registry of images
const FIELDS = new Set(['schema', 'id', 'ecosystem', 'repo', 'packages', 'versions', 'ref', 'image', 'fetch', 'build', 'pack', 'notes']);
const MAX_COMMANDS = 8000; // the commands travel in the container's environment

export const isNpmName = (s) => typeof s === 'string' && s.length <= 214 && NPM_NAME.test(s);

/** 1.2.3 and 1.2.3-rc.1 → [1, 2, 3]: a recipe's version bounds are about releases, a pre-release counts as its release. */
export function versionParts(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(String(v));
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function compareVersions(a, b) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return 0;
}

/**
 * The recipe as the runner uses it, or throws with what is wrong. Strict: a
 * field this version does not know is an error, not ignored, so a recipe
 * written for a later runner is not half-run by this one.
 */
export function parseRecipe(doc) {
  const bad = (what) => { throw new Error(`recipe${typeof doc?.id === 'string' ? ` ${doc.id.slice(0, 40)}` : ''}: ${what}`); };
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) bad('not an object');
  for (const k of Object.keys(doc)) if (!FIELDS.has(k)) bad(`unknown field ${k.slice(0, 40)}`);
  if (doc.schema !== RECIPE_SCHEMA) bad(`schema must be ${RECIPE_SCHEMA}`);
  if (typeof doc.id !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(doc.id)) bad('id must be a short lowercase name');
  if (doc.ecosystem !== 'npm') bad('ecosystem must be npm');
  // https only and no credentials: the URL is cloned with the network open and shown on the website
  if (typeof doc.repo !== 'string' || !/^https:\/\/[a-z0-9.-]+\/[\w.~/-]+$/i.test(doc.repo) || doc.repo.includes('..')) bad('repo must be a plain https URL');
  // At most two * in a name: each becomes "any run of characters", and many of them make the match slow enough to stall the host.
  if (!Array.isArray(doc.packages) || !doc.packages.length || doc.packages.length > 200 || !doc.packages.every(p => typeof p === 'string' && p.length <= 214 && PATTERN.test(p) && p.split('*').length <= 3 && !p.includes('**'))) bad('packages must be a list of names, * (at most two) for any part of a name');
  const versions = doc.versions ?? {};
  if (typeof versions !== 'object' || Array.isArray(versions) || Object.keys(versions).some(k => k !== 'min' && k !== 'below')) bad('versions may have min and below');
  for (const k of ['min', 'below']) if (versions[k] != null && !(typeof versions[k] === 'string' && VERSION.test(versions[k]))) bad(`versions.${k} must be a version like 1.2.3`);
  if (doc.ref != null && !(typeof doc.ref === 'string' && /^[\w.@/{}-]{1,100}$/.test(doc.ref) && !doc.ref.includes('..') && !doc.ref.startsWith('-'))) bad('ref must be a tag name, with {version} and {name} filled in');
  if (doc.image != null && !(typeof doc.image === 'string' && IMAGE.test(doc.image))) bad('image must be an official Node image, like node:20-bookworm');
  const commands = (k) => {
    const v = doc[k] ?? [];
    if (!Array.isArray(v) || v.length > 50 || !v.every(c => typeof c === 'string' && c.trim() && !/[\0\r]/.test(c))) bad(`${k} must be a list of commands`);
    return v;
  };
  const fetchCommands = commands('fetch'), build = commands('build');
  if (doc.pack != null && !(typeof doc.pack === 'string' && doc.pack.trim() && !/[\0\r]/.test(doc.pack))) bad('pack must be a command');
  if ([...fetchCommands, ...build, doc.pack || ''].join('\n').length > MAX_COMMANDS) bad(`the commands are longer than ${MAX_COMMANDS} characters`);
  if (doc.notes != null && !(typeof doc.notes === 'string' && doc.notes.length <= 2000)) bad('notes must be text');
  const recipe = {
    schema: RECIPE_SCHEMA, id: doc.id, ecosystem: 'npm', repo: doc.repo.replace(/\.git$/, ''), packages: [...doc.packages],
    versions: { min: versions.min ?? null, below: versions.below ?? null }, ref: doc.ref ?? null, image: doc.image ?? null,
    fetch: fetchCommands, build, pack: doc.pack ?? null, notes: doc.notes ?? null,
  };
  // What a result is filed under: the id and what the recipe runs. A changed recipe is another
  // recipe, so what failed under the old one is built again; notes can change without that.
  const { notes, ...runs } = recipe;
  recipe.key = `${recipe.id}@${createHash('sha256').update(JSON.stringify(runs)).digest('hex').slice(0, 12)}`;
  return recipe;
}

const patternRe = (p) => new RegExp(`^${p.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')}$`);

/** Does the recipe say it builds this package version? */
export function covers(recipe, name, version) {
  const v = versionParts(version);
  if (!v || !recipe.packages.some(p => patternRe(p).test(name))) return false;
  if (recipe.versions.min && compareVersions(v, versionParts(recipe.versions.min)) < 0) return false;
  if (recipe.versions.below && compareVersions(v, versionParts(recipe.versions.below)) >= 0) return false;
  return true;
}

/** The first recipe that covers the package version: the order of the list decides between two that do. */
export const recipeFor = (recipes, name, version) => recipes.find(r => covers(r, name, version)) || null;

/**
 * Every *.json of a directory, by file name. A file that is no valid recipe is
 * reported and left out: one bad recipe must not stop the others.
 */
export function loadRecipes(dir = RECIPES_DIR, { log = () => {} } = {}) {
  let names;
  try { names = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort(); } catch { return []; }
  const recipes = [];
  for (const f of names) {
    try {
      const r = parseRecipe(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
      if (recipes.some(x => x.id === r.id)) throw new Error(`recipe ${r.id}: a second recipe with this id`);
      recipes.push(r);
    } catch (e) { log(`${f}: ${e.message}`); }
  }
  return recipes;
}

/**
 * The tag a package version is built from: the recipe's `ref` with the name and
 * version filled in, else the tag the identity check finds among the
 * repository's tags. Null when the repository has no such tag.
 */
export function refOf(recipe, tags, name, version) {
  if (!recipe.ref) return matchTag(tags, name, version);
  const ref = recipe.ref.replaceAll('{version}', version).replaceAll('{name}', name);
  return tags.has(ref) ? ref : null;
}

/**
 * Jobs for the package versions a recipe covers: one per commit, since one
 * build of a repository gives every package it publishes from there. Versions
 * without a tag come back as `untagged`. Largest job first (wallets, then
 * packages), so the build that settles the most runs first.
 */
export function planJobs(recipe, candidates, tags) {
  const jobs = new Map(), untagged = [];
  for (const c of candidates) {
    const ref = refOf(recipe, tags, c.name, c.version);
    if (!ref) { untagged.push(c); continue; }
    const commit = tags.get(ref);
    if (!jobs.has(commit)) jobs.set(commit, { recipe, ref, commit, packages: [] });
    jobs.get(commit).packages.push(c);
  }
  const weight = (j) => j.packages.reduce((n, p) => n + (p.wallets || 0), 0);
  return { jobs: [...jobs.values()].sort((a, b) => weight(b) - weight(a) || b.packages.length - a.packages.length || a.ref.localeCompare(b.ref)), untagged };
}
