// Recipes: what a recipe may say, which versions it takes, and what the host
// does with a recipe's build. The container is faked (fake-container-cli.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { parseRecipe, covers, recipeFor, loadRecipes, planJobs, refOf, RECIPES_DIR } from '../recipes.mjs';
import { rebuildWithRecipe, filesWithContent } from '../rebuild-recipe.mjs';
import { openDb, saveCandidates, saveRebuild, saveRecipeSkip, pending, pendingForRecipe } from '../db.mjs';
import { nextRecipeJob, runRecipeJob } from '../recipe-jobs.mjs';
import { serveLoop } from '../worker.mjs';
import { feedRows } from '../site-export.mjs';
import { LIMITS, RECIPE_SCRIPT } from '../sandbox.mjs';

const cli = fileURLToPath(new URL('./fake-container-cli.mjs', import.meta.url));
const doc = (over = {}) => ({ schema: 1, id: 'mono', ecosystem: 'npm', repo: 'https://github.com/x/mono', packages: ['@mono/*', 'mono'], fetch: ['yarn install --immutable'], build: ['make build'], ...over });

test('a recipe is read strictly: an unknown field, another schema or a repository that is no plain https URL is refused', () => {
  const r = parseRecipe(doc({ versions: { min: '7.20.0', below: '8.0.0' }, ref: 'v{version}', image: 'node:20-bookworm', pack: 'yarn pack --out "$OUT"', notes: 'n' }));
  assert.equal(r.id, 'mono');
  assert.match(r.key, /^mono@[0-9a-f]{12}$/);
  for (const [over, why] of [
    [{ network: true }, /unknown field network/], [{ schema: 2 }, /schema/], [{ id: 'Not Plain' }, /id/], [{ ecosystem: 'maven' }, /ecosystem/],
    [{ repo: 'http://github.com/x/mono' }, /repo/], [{ repo: 'https://user:token@github.com/x/mono' }, /repo/], [{ repo: 'https://github.com/x/mono --upload-pack=evil' }, /repo/],
    [{ packages: [] }, /packages/], [{ packages: ['@mono/a b'] }, /packages/], [{ packages: ['*-*-*-x'] }, /packages/], [{ packages: ['@mono/**'] }, /packages/], [{ versions: { min: '^7' } }, /versions\.min/], [{ versions: { max: '8.0.0' } }, /versions/],
    [{ ref: '--upload-pack=x' }, /ref/], [{ ref: 'a b' }, /ref/], [{ image: 'evil.example/node:20' }, /image/], [{ image: 'ubuntu:24.04' }, /image/],
    [{ build: 'make' }, /build/], [{ build: [''] }, /build/], [{ fetch: [1] }, /fetch/], [{ pack: ['x'] }, /pack/], [{ build: ['x'.repeat(9000)] }, /longer/],
  ]) assert.throws(() => parseRecipe(doc(over)), why, JSON.stringify(over));
  assert.throws(() => parseRecipe([]), /not an object/);
});

test('a recipe\'s key changes with what it runs, not with its notes', () => {
  const key = (over) => parseRecipe(doc(over)).key;
  assert.equal(key({ notes: 'one' }), key({ notes: 'two' }));
  assert.notEqual(key({}), key({ build: ['make build', 'make more'] }));
  assert.notEqual(key({}), key({ fetch: [] }));
  assert.notEqual(key({}), key({ versions: { min: '2.0.0' } }));
});

test('a recipe covers the names and versions it says; the first recipe that does is taken', () => {
  const r = parseRecipe(doc({ versions: { min: '7.20.0', below: '8.0.0' } }));
  assert.ok(covers(r, '@mono/core', '7.20.0'));
  assert.ok(covers(r, 'mono', '7.99.3'));
  assert.ok(covers(r, '@mono/core', '7.21.0-rc.1'), 'a pre-release counts as its release');
  assert.ok(!covers(r, '@mono/core', '7.19.9'));
  assert.ok(!covers(r, '@mono/core', '8.0.0'));
  assert.ok(!covers(r, '@mono/core', '8.0.0-beta.1'));
  assert.ok(!covers(r, 'mono-extra', '7.20.0'), 'a name without * is that name');
  assert.ok(!covers(r, '@monolith/core', '7.20.0'));
  assert.ok(!covers(r, '@mono/core', 'latest'));
  const star = parseRecipe(doc({ packages: ['expo-*', '@expo/*', '*-plugin-*'] }));
  assert.ok(covers(star, 'expo-camera', '1.0.0') && covers(star, '@expo/cli', '1.0.0') && !covers(star, 'expo', '1.0.0'));
  assert.ok(covers(star, 'a-plugin-b', '1.0.0') && !covers(star, '@s/a-plugin-b', '1.0.0'), '* does not reach across the scope');
  const t0 = Date.now();
  assert.ok(!covers(star, `${'a-plugin-'.repeat(23)}/x`, '1.0.0'));
  assert.ok(Date.now() - t0 < 200, 'two * at most: a long name is still matched at once');
  const old = parseRecipe(doc({ id: 'mono-6', versions: { below: '7.20.0' } }));
  assert.equal(recipeFor([r, old], '@mono/core', '7.1.0'), old);
  assert.equal(recipeFor([r, old], '@mono/core', '7.30.0'), r);
  assert.equal(recipeFor([r, old], 'other', '7.30.0'), null);
});

test('the recipes this repository ships are all valid, and a file that is not is left out without stopping the others', () => {
  const problems = [];
  const shipped = loadRecipes(RECIPES_DIR, { log: (m) => problems.push(m) });
  assert.deepEqual(problems, []);
  // Babel is two recipes, by the Node its release build ran on; below what was tried, none.
  assert.deepEqual(['7.8.3', '7.22.5', '7.28.4', '7.28.5', '7.29.7', '8.0.0'].map(v => recipeFor(shipped, '@babel/core', v)?.id ?? null), [null, 'babel', 'babel', 'babel-node25', 'babel-node25', null]);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-recipes-'));
  fs.writeFileSync(path.join(dir, 'a.json'), JSON.stringify(doc()));
  fs.writeFileSync(path.join(dir, 'b.json'), '{ not json');
  fs.writeFileSync(path.join(dir, 'c.json'), JSON.stringify(doc({ packages: ['other'] }))); // the id of a.json again
  fs.writeFileSync(path.join(dir, 'd.json'), JSON.stringify(doc({ id: 'other', packages: ['other'] })));
  assert.deepEqual(loadRecipes(dir, { log: (m) => problems.push(m) }).map(r => r.id), ['mono', 'other']);
  assert.equal(problems.length, 2);
  assert.deepEqual(loadRecipes(path.join(dir, 'missing')), []);
});

test('one build per commit: versions are grouped by the commit their tag points at, the largest first; no tag, no build', () => {
  const tags = new Map([['v1.0.0', 'a'.repeat(40)], ['@mono/core@1.1.0', 'b'.repeat(40)], ['@mono/cli@2.0.0', 'b'.repeat(40)], ['v3.0.0', 'd'.repeat(40)]]);
  const c = (name, version, wallets = 1) => ({ name, version, wallets });
  const found = parseRecipe(doc()); // no ref: the tag the identity check finds
  const plan = planJobs(found, [c('@mono/core', '1.0.0', 9), c('@mono/core', '1.1.0', 2), c('@mono/cli', '2.0.0', 2), c('@mono/cli', '1.0.0', 1), c('mono', '5.0.0')], tags);
  assert.deepEqual(plan.jobs.map(j => [j.ref, j.commit[0], j.packages.map(p => p.name).join()]), [['v1.0.0', 'a', '@mono/core,@mono/cli'], ['@mono/core@1.1.0', 'b', '@mono/core,@mono/cli']]);
  assert.deepEqual(plan.untagged.map(p => p.name), ['mono']);
  const fixed = parseRecipe(doc({ ref: 'v{version}' }));
  assert.equal(refOf(fixed, tags, '@mono/core', '3.0.0'), 'v3.0.0');
  assert.equal(refOf(fixed, tags, '@mono/core', '1.1.0'), null, 'the recipe names the tag: no other is taken');
  assert.equal(refOf(parseRecipe(doc({ ref: '{name}@{version}' })), tags, '@mono/cli', '2.0.0'), '@mono/cli@2.0.0');
});

// A minimal ustar archive, as in rebuild.test.mjs
function tgz(files) {
  const blocks = [];
  for (const [name, body] of Object.entries(files)) {
    const h = Buffer.alloc(512), b = Buffer.from(body);
    h.write(`package/${name}`, 0, 100, 'utf8');
    h.write(b.length.toString(8).padStart(11, '0') + '\0', 124);
    h.write('0', 156); h.write('ustar\0' + '00', 257);
    blocks.push(h, b, Buffer.alloc((512 - (b.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return zlib.gzipSync(Buffer.concat(blocks));
}

// the same with GNU long names: a file name as long as the build likes
function tgzLongNames(names) {
  const blocks = [];
  const header = (name, size, type) => { const h = Buffer.alloc(512); h.write(name, 0, 100, 'utf8'); h.write(size.toString(8).padStart(11, '0') + '\0', 124); h.write(type, 156); h.write('ustar\0' + '00', 257); return h; };
  const padded = (b) => [b, Buffer.alloc((512 - (b.length % 512)) % 512)];
  for (const name of names) blocks.push(header('././@LongLink', name.length + 9, 'L'), ...padded(Buffer.from(`package/${name}\0`)), header('package/x', 1, '0'), ...padded(Buffer.from('x')));
  blocks.push(Buffer.alloc(1024));
  return zlib.gzipSync(Buffer.concat(blocks));
}

async function build(fake = {}, { names = ['@mono/a', '@mono/b'], missing = [], recipe = doc(), keep = false, limits = {}, integrity = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-recipe-'));
  const registry = path.join(root, 'registry');
  fs.mkdirSync(registry);
  const published = names.map((name, n) => { const buf = tgz({ 'index.js': `module.exports = ${n};\n`, 'package.json': JSON.stringify({ name, version: '1.0.0' }) }); fs.writeFileSync(path.join(registry, `${n}.tgz`), buf); return buf; });
  fs.writeFileSync(path.join(root, 'other.tgz'), tgz({ 'index.js': 'module.exports = "other";\n', 'package.json': '{}' }));
  fs.writeFileSync(path.join(root, 'long.tgz'), tgzLongNames(['a', 'b', 'c', 'd'].map(c => c.repeat(50000))));
  Object.assign(process.env, { FAKE_RECIPE: JSON.stringify(fake), FAKE_REGISTRY: registry, FAKE_OTHER_TGZ: path.join(root, 'other.tgz'), FAKE_LONG_TGZ: path.join(root, 'long.tgz'), FAKE_CALLS: path.join(root, 'calls') });
  const fetchImpl = async (url) => {
    const u = String(url);
    const n = names.findIndex(name => u.includes(`/${name.replace('/', '%2F')}/`) || u.endsWith(`/${name.split('/').pop()}-1.0.0.tgz`));
    if (missing.includes(names[n])) return { ok: false, status: 404 };
    return u.endsWith('.tgz') ? { ok: true, arrayBuffer: async () => published[n] } : { ok: true, json: async () => ({ dist: { tarball: `https://registry.npmjs.org/${names[n]}/-/${names[n].split('/').pop()}-1.0.0.tgz`, ...(integrity ? { integrity: integrity(published[n]) } : {}) }, _nodeVersion: '20.1.0' }) };
  };
  const r = await rebuildWithRecipe({ recipe: parseRecipe(recipe), ref: 'v1.0.0', commit: 'a'.repeat(40), packages: names.map(name => ({ name, version: '1.0.0' })), workRoot: path.join(root, 'work'), fetchImpl, cli, limits: { ...LIMITS, phaseMs: 20000, ...limits }, keep });
  const calls = fs.existsSync(path.join(root, 'calls')) ? fs.readFileSync(path.join(root, 'calls'), 'utf8').trim().split('\n').map(l => JSON.parse(l)) : [];
  return { r, rows: Object.fromEntries(r.rows.map(row => [row.name, row])), calls, root };
}

test('a recipe\'s build: every package is compared on its own, and only the clone and fetch steps have a network', async () => {
  const { r, rows, calls } = await build({ out: { 1: 'other' } });
  assert.equal(r.rows.length, 2);
  assert.equal(rows['@mono/a'].result, 'reproduced');
  assert.equal(rows['@mono/a'].note, 'Byte-identical tarball');
  assert.equal(rows['@mono/b'].result, 'failed');
  assert.equal(rows['@mono/b'].phase, 'compare');
  assert.match(rows['@mono/b'].note, /^Rebuilt tarball differs: /);
  assert.deepEqual(calls.map(c => [c.PHASE, c.network]), [['clone', 'default'], ['fetch', 'default'], ['build', 'none']]);
  const a = rows['@mono/a'];
  assert.equal(a.commit, 'c'.repeat(40), 'the commit that was checked out, not the one asked for');
  assert.match(a.recipe, /^mono@[0-9a-f]{12}$/);
  assert.equal(a.repoUrl, 'https://github.com/x/mono');
  assert.match(a.sha256, /^[0-9a-f]{64}$/);
  assert.equal(a.artifact, 'a-1.0.0.tgz');
  assert.match(a.toolchain, /^node:20-bookworm \(node v20\.1\.0\)$/);
  assert.equal(calls[0].REF, 'a'.repeat(40), 'the commit the tag pointed at when the build was planned');
  assert.equal(calls[2].BUILD, 'make build');
  assert.equal(calls[2].DIRS, '0 packages/0\n1 packages/1');
  assert.ok(!fs.existsSync(path.join(path.dirname(r.log), 'work')), 'nothing of the build stays but the log');
  assert.equal(r.out, null);
});

test('where the packages are is what the clone step said: a package that is not there fails alone, and a later step cannot move one', async () => {
  const { rows, calls } = await build({ dirs: { 0: '?' }, build: 'claims' });
  assert.equal(rows['@mono/a'].result, 'not-covered', 'no failure: the recipe says nothing about a package its repository does not hold');
  assert.match(rows['@mono/a'].note, /does not have exactly one package of this name/);
  assert.equal(rows['@mono/b'].result, 'reproduced');
  assert.equal(calls[2].DIRS, '1 packages/1');
  const odd = await build({ dirs: { 0: '../outside', 1: 'packages/b' } });
  assert.equal(odd.rows['@mono/a'].result, 'not-covered');
  assert.equal(odd.calls[2].DIRS, '1 packages/b');
  const none = await build({ dirs: { 0: '?', 1: '?' } });
  assert.deepEqual(none.calls.map(c => c.PHASE), ['clone'], 'nothing to build: no further step');
});

test('a fetch step that brings the published package is no build of it', async () => {
  const { r, calls } = await build({ fetch: 'brings' });
  assert.deepEqual(r.rows.map(row => row.result), ['failed', 'failed']);
  assert.match(r.rows[0].note, /brought a published package/);
  assert.deepEqual(calls.map(c => c.PHASE), ['clone', 'fetch'], 'the build is not run');
  assert.match(fs.readFileSync(r.log, 'utf8'), /left 1 published tarball\(s\) in the work directory, first cache\/x\.tgz/);
});

test('the published package is found where the fetch step hid it from reading, and when the clone brought it', async () => {
  const hidden = await build({ fetch: 'hides' });
  assert.deepEqual(hidden.r.rows.map(row => row.note), Array(2).fill('The steps with a network brought a published package that this build is to make'));
  assert.deepEqual(hidden.calls.map(c => c.PHASE), ['clone', 'fetch']);
  const cloned = await build({ clone: 'brings' }, { recipe: doc({ fetch: [] }) });
  assert.deepEqual(cloned.r.rows.map(row => row.result), ['failed', 'failed']);
  assert.deepEqual(cloned.calls.map(c => c.PHASE), ['clone'], 'a recipe without fetch commands is checked as well');
});

test('a registry file that is not the one the registry names is nobody\'s result', async () => {
  const sha512 = (buf) => `sha512-${createHash('sha512').update(buf).digest('base64')}`;
  assert.equal((await build({}, { integrity: sha512 })).r.rows[0].result, 'reproduced');
  await assert.rejects(build({}, { integrity: () => sha512(Buffer.from('another file')) }), /does not match the registry's integrity/);
});

test('a recipe without fetch commands has no step with a network after the clone', async () => {
  const { r, calls } = await build({}, { recipe: doc({ fetch: [] }) });
  assert.deepEqual(calls.map(c => c.PHASE), ['clone', 'build']);
  assert.deepEqual(r.rows.map(row => row.result), ['reproduced', 'reproduced']);
  assert.match(calls[1].PACK, /npm pack --offline/, 'npm packs when the recipe names no command');
});

test('a step that fails names itself on every package; clone and fetch are the steps a second try is for', async () => {
  for (const [fake, phase, note] of [[{ clone: 'fails' }, 'clone', /^clone failed: fatal: unable to access/], [{ fetch: 'fails' }, 'fetch', /^fetch failed: Error: the lockfile/], [{ build: 'fails' }, 'build', /^build failed: Error: make/]]) {
    const { r } = await build(fake);
    assert.deepEqual(r.rows.map(row => [row.result, row.phase]), [['failed', phase], ['failed', phase]]);
    assert.match(r.rows[0].note, note);
  }
});

test('what the build leaves is read only as a regular file; a package that was not packed says so', async () => {
  const { rows } = await build({ out: { 0: 'link', 1: 'none' } });
  assert.match(rows['@mono/a'].note, /something other than a file/);
  assert.equal(rows['@mono/b'].note, 'The recipe packed nothing for this package');
  assert.equal(rows['@mono/b'].phase, 'build');
});

test('a version the registry does not have fails alone; a name that is none is never asked for', async () => {
  const { rows } = await build({}, { missing: ['@mono/a'] });
  assert.equal(rows['@mono/a'].note, 'The registry does not have this version');
  assert.equal(rows['@mono/b'].result, 'reproduced');
  const odd = await build({}, { names: ['@mono/a', '../../etc'] });
  assert.equal(odd.rows['../../etc'].note, 'Not a package name');
  assert.equal(odd.rows['@mono/a'].result, 'reproduced');
});

test('keep leaves the rebuilt tarballs for whoever writes the recipe, and not the checkout', async () => {
  const { r } = await build({ out: { 1: 'other' } }, { keep: true });
  assert.deepEqual(fs.readdirSync(r.out).sort(), ['0.tgz', '1.tgz']);
  assert.deepEqual(fs.readdirSync(path.dirname(r.log)).sort(), ['build.log', 'out']);
});

test('a step that floods its output leaves a cut log, when it ends and when it is stopped at the time limit', async () => {
  const { r } = await build({ fetch: 'flood-fails' });
  assert.equal(r.rows[0].phase, 'fetch');
  assert.ok(fs.statSync(r.log).size < 250000, `${fs.statSync(r.log).size} bytes kept`);
  const hung = await build({ fetch: 'flood-hangs' }, { limits: { phaseMs: 1500 } });
  assert.deepEqual(hung.r.rows.map(row => [row.result, row.phase]), [['failed', 'fetch'], ['failed', 'fetch']]);
  assert.match(hung.r.rows[0].note, /^The fetch step did not finish in /);
  assert.ok(fs.statSync(hung.r.log).size < 250000, `${fs.statSync(hung.r.log).size} bytes kept`);
});

test('file names of a rebuilt tarball are cut in the note and the log', async () => {
  const { r, rows } = await build({ out: { 0: 'long-names' } });
  assert.equal(rows['@mono/a'].result, 'failed');
  assert.ok(rows['@mono/a'].note.length <= 400, `${rows['@mono/a'].note.length} characters`);
  assert.ok(fs.statSync(r.log).size < 20000, `${fs.statSync(r.log).size} bytes of log`);
});

test('filesWithContent reads only regular files of a wanted size and follows no link', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-content-'));
  const body = Buffer.from('published');
  const sha = execFileSync('sha256sum', { input: body, encoding: 'utf8' }).split(' ')[0];
  fs.mkdirSync(path.join(dir, 'a', 'b'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'a', 'b', 'copy'), body);
  fs.writeFileSync(path.join(dir, 'same-size'), 'publishe!');
  fs.writeFileSync(path.join(dir, 'outside'), body);
  fs.symlinkSync(path.join(dir, 'outside'), path.join(dir, 'a', 'link'));
  fs.symlinkSync(dir, path.join(dir, 'a', 'loop'));
  const look = () => filesWithContent(path.join(dir, 'a'), new Map([[sha, 1]]), new Set([body.length]));
  assert.deepEqual(look(), { hits: [path.join(dir, 'a', 'b', 'copy')], unread: [] });
  // What cannot be read is said, not passed over. (root reads everything: nothing to say there.)
  fs.chmodSync(path.join(dir, 'a', 'b'), 0o000);
  if (process.getuid() !== 0) assert.deepEqual(look(), { hits: [], unread: [path.join(dir, 'a', 'b')] });
  fs.chmodSync(path.join(dir, 'a', 'b'), 0o755);
});

test('a recipe takes what nobody reproduced and it has not tried as it is now; a changed recipe tries again', () => {
  const db = openDb(':memory:');
  const c = (name, wallets) => ({ ecosystem: 'npm', name, version: '1.0.0', wallets, wallets_any: wallets });
  saveCandidates(db, [c('@mono/done', 9), c('@mono/generic-failed', 8), c('@mono/unsupported', 7), c('@mono/tried', 6), c('@mono/new', 5), c('@mono/google', 4), c('unrelated', 3)]);
  db.prepare(`INSERT INTO google VALUES ('npm', '@mono/google', '1.0.0')`).run();
  const save = (name, result, extra = {}) => saveRebuild(db, { ecosystem: 'npm', name, version: '1.0.0', result, note: 'n', ...extra });
  save('@mono/done', 'reproduced');
  save('@mono/generic-failed', 'failed');
  save('@mono/unsupported', 'unsupported');
  save('@mono/tried', 'failed', { recipe: 'mono@aaa', phase: 'compare' });
  const r = parseRecipe(doc());
  const mine = (name, version) => covers(r, name, version);
  assert.deepEqual(pendingForRecipe(db, 'mono@aaa', mine).map(x => x.name), ['@mono/generic-failed', '@mono/unsupported', '@mono/new']);
  assert.deepEqual(pendingForRecipe(db, 'mono@bbb', mine).map(x => x.name), ['@mono/generic-failed', '@mono/unsupported', '@mono/tried', '@mono/new']);
  assert.deepEqual(pendingForRecipe(db, 'mono@aaa', mine, { retry: true }).map(x => x.name), ['@mono/generic-failed', '@mono/unsupported', '@mono/tried', '@mono/new']);
  assert.deepEqual(pendingForRecipe(db, 'mono@aaa', mine, { minWallets: 8 }).map(x => x.name), ['@mono/generic-failed']);
  assert.ok(!pending(db, { limit: 50 }).some(x => x.name === '@mono/tried'), 'the generic build leaves a recipe\'s failure alone');
  assert.ok(!pending(db, { limit: 50, recipeKeys: ['mono@aaa'] }).some(x => x.name === '@mono/tried'), 'also when it knows the recipes in use and this is one');
  for (const keys of [['mono@bbb'], []]) assert.deepEqual(pending(db, { limit: 50, recipeKeys: keys }).map(x => x.name), ['@mono/tried', '@mono/new', 'unrelated'], 'the failure of a recipe that is changed or gone is the generic build\'s again');
  saveRecipeSkip(db, 'mono@aaa', { name: '@mono/new', version: '1.0.0' }, 'no tag for this version');
  assert.deepEqual(pendingForRecipe(db, 'mono@aaa', mine).map(x => x.name), ['@mono/generic-failed', '@mono/unsupported'], 'what the recipe cannot build is not planned again');
  assert.ok(pendingForRecipe(db, 'mono@bbb', mine).some(x => x.name === '@mono/new'), 'a changed recipe looks again');
  assert.ok(pendingForRecipe(db, 'mono@aaa', mine, { retry: true }).some(x => x.name === '@mono/new'));
  assert.ok(pending(db, { limit: 50 }).some(x => x.name === '@mono/new'), 'and stays with the generic build');
});

test('a recipe\'s failed clone or fetch gets one more try a day later, whatever the generic build tried before', () => {
  const db = openDb(':memory:');
  saveCandidates(db, ['clone', 'fetch', 'build'].map(p => ({ ecosystem: 'npm', name: `@mono/${p}`, version: '1.0.0', wallets: 1, wallets_any: 1 })));
  const all = () => pendingForRecipe(db, 'mono@aaa', () => true).map(x => x.name);
  for (const p of ['clone', 'fetch', 'build']) {
    saveRebuild(db, { ecosystem: 'npm', name: `@mono/${p}`, version: '1.0.0', result: 'unsupported', note: 'generic' });
    saveRebuild(db, { ecosystem: 'npm', name: `@mono/${p}`, version: '1.0.0', result: 'failed', note: 'n', phase: p, recipe: 'mono@aaa' });
  }
  assert.deepEqual(all(), [], 'not on the same day');
  db.exec(`UPDATE rebuilds SET finished_at = datetime('now', '-2 days')`);
  assert.deepEqual(all(), ['@mono/clone', '@mono/fetch']);
  assert.deepEqual(pending(db, { limit: 50 }), [], 'the second try is the recipe\'s, not the generic build\'s');
  saveRebuild(db, { ecosystem: 'npm', name: '@mono/clone', version: '1.0.0', result: 'failed', note: 'n', phase: 'clone', recipe: 'mono@aaa' });
  db.exec(`UPDATE rebuilds SET finished_at = datetime('now', '-2 days')`);
  assert.deepEqual(all(), ['@mono/fetch'], 'a second failure stands');
});

test('a database from before recipes gets the columns', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-old-')), 'old.db');
  const old = openDb(file);
  old.exec(`ALTER TABLE rebuilds DROP COLUMN recipe; ALTER TABLE rebuilds DROP COLUMN recipe_event; ALTER TABLE attempts DROP COLUMN recipe; DROP TABLE recipe_skips; DROP TABLE recipe_events;`);
  old.close();
  const db = openDb(file);
  saveRebuild(db, { ecosystem: 'npm', name: 'a', version: '1.0.0', result: 'reproduced', note: 'ok', recipe: 'mono@aaa', recipeEvent: 'e'.repeat(64) });
  saveRecipeSkip(db, 'mono@aaa', { name: 'b', version: '1.0.0' }, 'no tag for this version');
  assert.deepEqual(db.prepare(`SELECT recipe, recipe_event FROM rebuilds`).get(), { recipe: 'mono@aaa', recipe_event: 'e'.repeat(64) });
  assert.equal(db.prepare(`SELECT recipe FROM attempts`).get().recipe, 'mono@aaa');
});

test('the feed names the recipe a version was reproduced with', () => {
  const db = openDb(':memory:');
  saveRebuild(db, { ecosystem: 'npm', name: 'a', version: '1.0.0', result: 'reproduced', note: 'ok', recipe: 'mono@aaa' });
  saveRebuild(db, { ecosystem: 'npm', name: 'b', version: '1.0.0', result: 'reproduced', note: 'ok' });
  const rows = feedRows(db);
  assert.equal(rows[0].recipe, 'mono@aaa');
  assert.ok(!('recipe' in rows[1]));
});

test('serve: a recipe\'s build comes before single versions; one that throws is set aside, not run in a loop', async () => {
  const db = openDb(':memory:');
  saveCandidates(db, [{ ecosystem: 'npm', name: 'single', version: '1.0.0', wallets: 9, wallets_any: 9 }]);
  const events = [], jobs = [{ key: 'mono@aaa v1' }, { key: 'mono@aaa v2' }];
  let stop = false, t = 1_000_000_000_000;
  await serveLoop({
    db, now: () => t, shouldStop: () => stop, log: (m) => events.push(m),
    sync: async () => ({}),
    step: async (c) => { events.push(`build ${c.name}`); saveRebuild(db, { ecosystem: 'npm', name: c.name, version: c.version, result: 'reproduced', note: 'ok' }); },
    recipes: {
      next: async (deferred) => jobs.find(j => !j.done && !deferred.has(j.key)) || null,
      run: async (job) => { events.push(`job ${job.key}`); if (job.key.endsWith('v1')) throw new Error('registry down'); job.done = true; },
    },
    sleep: async (ms) => { events.push(`sleep ${ms}`); t += ms; if (events.filter(e => e.startsWith('sleep')).length === 2) stop = true; },
  });
  assert.deepEqual(events.filter(e => /^(job|build)/.test(e)), ['job mono@aaa v1', 'job mono@aaa v2', 'build single']);
  assert.ok(events.includes('! mono@aaa v1: registry down'));
});

test('serve: what a recipe built is published; the failure of a recipe no longer in use goes back to the generic build', async () => {
  const run = async (keys) => {
    const db = openDb(':memory:');
    saveCandidates(db, [{ ecosystem: 'npm', name: 'left', version: '1.0.0', wallets: 9, wallets_any: 9 }]);
    saveRebuild(db, { ecosystem: 'npm', name: 'left', version: '1.0.0', result: 'failed', note: 'n', phase: 'build', recipe: 'old@aaa' });
    const events = [], jobs = [{ key: 'mono@bbb v1' }];
    let stop = false, t = 1_000_000_000_000;
    await serveLoop({
      db, now: () => t, shouldStop: () => stop, sync: async () => ({}),
      publish: async () => { events.push('publish'); return {}; },
      step: async (c) => { events.push(`build ${c.name}`); saveRebuild(db, { ecosystem: 'npm', name: c.name, version: c.version, result: 'reproduced', note: 'ok' }); },
      recipes: { next: async () => jobs.find(j => !j.done) || null, run: async (job) => { events.push(`job ${job.key}`); job.done = true; }, keys: () => keys },
      sleep: async (ms) => { t += ms; stop = true; },
    });
    return events;
  };
  assert.deepEqual(await run(['mono@bbb', 'old@aaa']), ['publish', 'job mono@bbb v1', 'publish'], 'the start publishes what was left, then the recipe\'s results');
  assert.deepEqual(await run(['mono@bbb']), ['publish', 'job mono@bbb v1', 'build left', 'publish']);
});

test('serve: asked to stop while the next build was looked for, it does not start it', async () => {
  const db = openDb(':memory:');
  let stop = false, ran = 0;
  await serveLoop({
    db, now: () => 1_000_000_000_000, shouldStop: () => stop, sync: async () => ({}), step: async () => { ran++; }, sleep: async () => {},
    recipes: { next: async () => { stop = true; return { key: 'mono@aaa v1' }; }, run: async () => { ran++; } },
  });
  assert.equal(ran, 0);
});

function jobsFixture() {
  const db = openDb(':memory:');
  const c = (name, version, wallets) => ({ ecosystem: 'npm', name, version, wallets, wallets_any: wallets });
  saveCandidates(db, [c('@mono/a', '1.0.0', 5), c('@mono/b', '1.0.0', 1), c('@mono/a', '2.0.0', 9), c('@mono/a', '3.0.0', 2), c('other', '1.0.0', 7)]);
  const tags = new Map([['v1.0.0', 'a'.repeat(40)], ['v2.0.0', 'b'.repeat(40)]]);
  const listed = [];
  const listTags = async (repo) => { listed.push(repo); return tags; };
  return { db, tags, listed, listTags, recipes: [parseRecipe(doc({ ref: 'v{version}' })), parseRecipe(doc({ id: 'second', packages: ['@mono/a', 'other'], repo: 'https://github.com/x/other' }))] };
}

test('the next build is the commit that settles the most wallets; a version without a tag stays with the generic build', async () => {
  const f = jobsFixture();
  const job = await nextRecipeJob({ ...f });
  assert.equal(job.key, `${f.recipes[0].key} v2.0.0`);
  assert.deepEqual(job.packages.map(p => `${p.name}@${p.version}`), ['@mono/a@2.0.0']);
  assert.deepEqual(f.db.prepare(`SELECT name, version, reason FROM recipe_skips`).all(), [{ name: '@mono/a', version: '3.0.0', reason: 'no tag for this version' }]);
  assert.equal(f.db.prepare(`SELECT COUNT(*) n FROM rebuilds`).get().n, 0, 'no result is recorded for it');
  assert.ok(pending(f.db, { limit: 50 }).some(x => x.version === '3.0.0'));
  const next = await nextRecipeJob({ ...f, deferred: new Set([job.key]) });
  assert.deepEqual(next.packages.map(p => p.name), ['@mono/a', '@mono/b'], 'a build set aside: the next largest');
  assert.equal(next.commit, 'a'.repeat(40));
});

test('a recipe takes only what no earlier recipe covers, and one whose repository cannot be listed is set aside', async () => {
  const f = jobsFixture();
  const deferred = new Set();
  const down = async (repo) => { f.listed.push(repo); if (repo.endsWith('/mono')) throw new Error('could not resolve host'); return new Map([['v1.0.0', 'c'.repeat(40)]]); };
  const log = [];
  const job = await nextRecipeJob({ ...f, listTags: down, deferred, log: (m) => log.push(m) });
  assert.equal(job.recipe.id, 'second');
  assert.deepEqual(job.packages.map(p => p.name), ['other'], '@mono/a is the first recipe\'s, also while that one waits');
  assert.ok(deferred.has(f.recipes[0].key));
  assert.match(log[0], /recipe mono: .* could not be listed: could not resolve host/);
  await nextRecipeJob({ ...f, listTags: down, deferred });
  assert.equal(f.listed.filter(r => r.endsWith('/mono')).length, 1, 'not listed again until the set is cleared');
  assert.equal((await nextRecipeJob({ ...f, only: 'second', listTags: down })).recipe.id, 'second');
  assert.equal(await nextRecipeJob({ ...f, only: 'none' }), null);
});

test('with nothing left to build, a recipe\'s repository is not listed at all', async () => {
  const f = jobsFixture();
  for (const c of f.db.prepare(`SELECT name, version FROM candidates`).all()) saveRebuild(f.db, { ecosystem: 'npm', ...c, result: 'reproduced', note: 'ok' });
  assert.equal(await nextRecipeJob({ ...f }), null);
  assert.deepEqual(f.listed, []);
});

function ranJob(rows, { interrupted = () => false } = {}) {
  const f = jobsFixture();
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-job-'));
  const scratch = path.join(workRoot, 'recipe-mono-v1.0.0');
  const build = async ({ recipe, ref }) => {
    fs.mkdirSync(scratch, { recursive: true });
    fs.writeFileSync(path.join(scratch, 'build.log'), 'the log\n');
    return { log: path.join(scratch, 'build.log'), seconds: 7, rows: rows.map(r => ({ ecosystem: 'npm', version: '1.0.0', recipe: recipe.key, ref, phase: null, ...r })) };
  };
  const printed = [];
  const job = { recipe: f.recipes[0], ref: 'v1.0.0', commit: 'a'.repeat(40), packages: rows.map(r => ({ name: r.name, version: '1.0.0' })) };
  return { f, workRoot, scratch, printed, run: () => runRecipeJob({ db: f.db, job, build, workRoot, interrupted, print: (m) => printed.push(m) }) };
}

test('a build that ran: a row per package, the log kept, nothing else; what the recipe does not cover gets no row', async () => {
  const t = ranJob([{ name: '@mono/a', result: 'reproduced', note: 'Byte-identical tarball' }, { name: '@mono/b', result: 'failed', note: 'Rebuilt tarball differs: x', phase: 'compare' }, { name: '@mono/c', result: 'not-covered', note: 'not there' }]);
  await t.run();
  const saved = t.f.db.prepare(`SELECT name, result, recipe, log FROM rebuilds ORDER BY name`).all();
  assert.deepEqual(saved.map(r => [r.name, r.result, r.recipe]), [['@mono/a', 'reproduced', t.f.recipes[0].key], ['@mono/b', 'failed', t.f.recipes[0].key]]);
  assert.equal(fs.readFileSync(saved[0].log, 'utf8'), 'the log\n');
  assert.equal(path.dirname(saved[0].log), path.join(t.workRoot, 'logs'));
  assert.ok(!fs.existsSync(t.scratch));
  assert.deepEqual(t.f.db.prepare(`SELECT name, reason FROM recipe_skips`).all(), [{ name: '@mono/c', reason: 'not in the repository at this tag' }]);
  assert.match(t.printed[0], /^~ recipe mono v1\.0\.0: 1 of 3 reproduced, 7s$/);
  assert.equal(t.printed.length, 3);
});

test('a build that was stopped: only what reproduced is kept, and the build counts as not done', async () => {
  const t = ranJob([{ name: '@mono/a', result: 'reproduced', note: 'ok' }, { name: '@mono/b', result: 'failed', note: 'build failed: Killed', phase: 'build' }, { name: '@mono/c', result: 'not-covered', note: 'not there' }], { interrupted: () => true });
  await assert.rejects(t.run(), /stopped while it was building/);
  assert.deepEqual(t.f.db.prepare(`SELECT name FROM rebuilds`).all(), [{ name: '@mono/a' }]);
  assert.equal(t.f.db.prepare(`SELECT COUNT(*) n FROM recipe_skips`).get().n, 0);
  const whole = ranJob([{ name: '@mono/a', result: 'reproduced', note: 'ok' }], { interrupted: () => true });
  await whole.run(); // everything reproduced: nothing the stop could have spoiled
});

// manifest-check.js as the sandbox runs it
const CHECK = fs.readFileSync(new URL('../manifest-check.js', import.meta.url), 'utf8');
function locateAll(files, wanted) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-locate-'));
  for (const [name, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(repo, name)), { recursive: true });
    fs.writeFileSync(path.join(repo, name), typeof body === 'string' ? body : JSON.stringify(body));
  }
  return execFileSync('node', ['-e', CHECK, 'locate-all', repo], { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '1', WANTED: wanted.map((name, n) => `${n} ${name}`).join('\n') } }).trim().split('\n');
}

test('locate-all: one line per wanted package; a private copy of the name does not count, two public ones leave it open', () => {
  const lines = locateAll({
    'package.json': { name: 'root', private: true, workspaces: ['packages/*'] },
    'packages/core/package.json': { name: '@mono/core' },
    'packages/cli/package.json': { name: '@mono/cli' },
    'packages/core/test/fixtures/x/package.json': { name: '@mono/cli', private: true },
    'packages/twin-a/package.json': { name: '@mono/twin' },
    'packages/twin-b/package.json': { name: '@mono/twin' },
    'packages/bad name/package.json': { name: '@mono/odd' },
    'packages/broken/package.json': '{ not json',
    'node_modules/@mono/core/package.json': { name: '@mono/core' },
  }, ['@mono/core', '@mono/cli', '@mono/twin', '@mono/odd', '@mono/missing', 'root']);
  assert.deepEqual(lines, ['== package 0 packages/core', '== package 1 packages/cli', '== package 2 ?', '== package 3 ?', '== package 4 ?', '== package 5 ?']);
});

test('the recipe\'s script gives its commands no input, not even the list it packs from, and packs each package on its own', () => {
  assert.ok(!RECIPE_SCRIPT.includes('__MANIFEST_CHECK__'));
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-script-'));
  // the build phase of the script itself, with /work and /out moved under a temporary directory
  const script = RECIPE_SCRIPT.replaceAll('/work', `${root}/work`).replaceAll('/out', `${root}/out`);
  for (const d of ['work/src/packages/a', 'work/src/packages/b', 'work/src/packages/c', 'out']) fs.mkdirSync(path.join(root, d), { recursive: true });
  const env = { PATH: process.env.PATH, PHASE: 'build', DIRS: '0 packages/a\n1 packages/b\n2 packages/c' };
  // BUILD reads its input; a's pack tries to read the list of directories; b's pack fails
  const out = execFileSync('bash', ['-c', script], { encoding: 'utf8', input: 'typed-in\n', env: { ...env, BUILD: 'echo built > built.txt\ncat', PACK: 'case "$(basename "$PWD")" in a) cat <&3 2>/dev/null || true;; b) exit 1;; esac; cp ../../built.txt "$OUT"' } });
  assert.ok(!out.includes('typed-in'), 'the build does not read what the script was given');
  assert.match(out, /== pack 0 packages\/a\n== pack 1 packages\/b\n== pack 1 failed\n== pack 2 packages\/c\n$/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'out')).sort(), ['0.tgz', '2.tgz']);
  assert.throws(() => execFileSync('bash', ['-c', script], { encoding: 'utf8', stdio: 'pipe', env: { ...env, BUILD: 'false\necho after', PACK: 'true', DIRS: '' } }), 'a build command that fails stops the build');
});
