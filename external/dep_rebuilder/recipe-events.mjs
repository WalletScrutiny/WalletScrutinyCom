// Recipes that arrive as signed Nostr events (README, "Recipes over Nostr").
//
// A recipe may be published by anyone whose key is in config/recipe-authors.json,
// without a merge request: a code snippet event (kind 1337, NIP-C0) whose
// content is the recipe. The relay is not trusted, only the signature: an
// event counts when it verifies, its author is on the list and its content is a
// valid recipe. The newest event per recipe id wins, and the newest seen is kept
// (db recipe_events), so a relay cannot bring an older one back by withholding it.
import fs from 'fs';
import { parseRecipe } from './recipes.mjs';
import { storedRecipeEvents, saveRecipeEvents } from './db.mjs';

export const RECIPE_KIND = 1337;          // code snippet, a kind the WalletScrutiny relay stores
export const RECIPE_TOPIC = 'ws-dep-recipe';
export const RECIPE_RELAYS = (process.env.DEP_REBUILDER_RECIPE_RELAYS || 'wss://relay.nostr.info/').split(',').map(s => s.trim()).filter(Boolean);
export const AUTHORS_FILE = process.env.DEP_REBUILDER_RECIPE_AUTHORS || new URL('./config/recipe-authors.json', import.meta.url).pathname;
const MAX_CONTENT = 20000;
const CONNECT_MS = 15000;
const MAX_AHEAD_S = 600; // an event dated later than this from now is not taken: nothing newer could ever replace it
const HEX = /^[0-9a-f]{64}$/;

/** The keys whose recipes are run: [{ name, pubkey }], pubkey as 64 hex characters. A file that is missing or wrong trusts nobody. */
export function loadAuthors(file = AUTHORS_FILE, { log = () => {} } = {}) {
  let list;
  try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') log(`${file}: ${e.message}`); return []; }
  if (!Array.isArray(list)) { log(`${file}: not a list`); return []; }
  const ok = list.filter(a => a && typeof a.name === 'string' && HEX.test(a.pubkey || ''));
  if (ok.length !== list.length) log(`${file}: ${list.length - ok.length} entr${list.length - ok.length === 1 ? 'y' : 'ies'} without a name and a hex pubkey left out`);
  return ok;
}

/** The unsigned event for a recipe; the content is the document as it was given, so what is signed is what was read. */
export function recipeTemplate(text, now = Date.now()) {
  const recipe = parseRecipe(JSON.parse(text));
  return {
    kind: RECIPE_KIND, created_at: Math.floor(now / 1000), content: text,
    tags: [['t', RECIPE_TOPIC], ['c', 'walletscrutiny'], ['l', 'json'], ['extension', 'json'], ['name', `${recipe.id}.recipe.json`],
      ['description', `WalletScrutiny rebuild recipe for ${recipe.repo}`], ['repo', recipe.repo]],
  };
}

/**
 * The recipe an event carries, with `event`, `author` and `signed` (the event
 * itself) set, or null with the reason logged. `verify` is nostr-tools'
 * verifyEvent, which also checks that the id is the hash of what was signed.
 */
export function recipeFromEvent(event, authors, { verify, log = () => {}, now = Date.now() }) {
  const short = String(event?.id).slice(0, 12);
  if (!event || event.kind !== RECIPE_KIND || !HEX.test(event.id || '') || !HEX.test(event.pubkey || '') || typeof event.content !== 'string') return null;
  if (!Array.isArray(event.tags) || !event.tags.some(t => Array.isArray(t) && t[0] === 't' && t[1] === RECIPE_TOPIC)) return null;
  if (!authors.some(a => a.pubkey === event.pubkey)) { log(`recipe event ${short}: its author is not on the list`); return null; }
  if (event.content.length > MAX_CONTENT) { log(`recipe event ${short}: too long`); return null; }
  if (!Number.isInteger(event.created_at) || event.created_at > now / 1000 + MAX_AHEAD_S) { log(`recipe event ${short}: dated in the future`); return null; }
  // Verified as a copy of its seven fields: nostr-tools remembers a verified event by a hidden
  // property, which a copy of the object carries along, whatever was changed in it since.
  const signed = { id: event.id, pubkey: event.pubkey, created_at: event.created_at, kind: event.kind, tags: event.tags, content: event.content, sig: event.sig };
  let ok = false;
  try { ok = verify(signed); } catch { /* malformed */ }
  if (!ok) { log(`recipe event ${short}: the signature does not verify`); return null; }
  try { return { ...parseRecipe(JSON.parse(event.content)), event: event.id, author: event.pubkey, createdAt: event.created_at, signed }; } catch (e) { log(`recipe event ${short}: ${e.message}`); return null; }
}

/** Of recipes read from events, the newest per `keyOf` (then the larger event id, so every reader picks the same). */
function newest(recipes, keyOf) {
  const latest = new Map();
  for (const r of recipes) {
    const have = latest.get(keyOf(r));
    if (!have || have.createdAt < r.createdAt || (have.createdAt === r.createdAt && have.event < r.event)) latest.set(keyOf(r), r);
  }
  return [...latest.values()];
}

/** Of all events, the valid recipes, the newest per id. Ordered by id. */
export function recipesFromEvents(events, authors, opts) {
  return newest(events.map(e => recipeFromEvent(e, authors, opts)).filter(Boolean), r => r.id).sort((a, b) => a.id.localeCompare(b.id));
}

// A relay answers with at most its own cap of events: ask again from the oldest seen until nothing
// new comes (as source_analysis/reproducible.mjs does, which cannot be imported here: its other
// imports are not installed with this utility).
async function pageRelay(querySync, relay, filter) {
  const seen = new Map();
  let until;
  for (;;) {
    const page = await querySync([relay], until === undefined ? filter : { ...filter, until });
    const fresh = page.filter(e => !seen.has(e.id));
    if (!fresh.length) return [...seen.values()];
    for (const e of fresh) seen.set(e.id, e);
    until = Math.min(...fresh.map(e => e.created_at));
  }
}

/** Asks one relay with nostr-tools. Throws when it cannot be reached: an empty answer must mean "no events". */
async function askRelay(url, filter) {
  if (typeof WebSocket !== 'function') throw new Error('this Node has no WebSocket (needs Node 22 or later)');
  const { SimplePool } = await import('nostr-tools/pool');
  const { Relay } = await import('nostr-tools/relay');
  // querySync gives an empty list for a relay it could not reach: connect first, to know. With a limit: a server that
  // accepts and never answers would hold the caller for minutes.
  // (Not Relay.connect: it does not pass a limit on.)
  const probe = new Relay(url);
  try { await probe.connect({ timeout: CONNECT_MS }); } finally { try { probe.close(); probe.ws?.close(); } catch { /* never opened */ } } // (ws: close() leaves a socket that is still connecting)
  const pool = new SimplePool();
  try { return await pageRelay((urls, f) => pool.querySync(urls, f, { maxWait: 20000 }), url, filter); } finally { pool.close([url]); }
}

/**
 * Events of the listed authors from the relays, as they came. Throws when no
 * relay could be asked: a relay that is down must not look like "no recipes".
 */
export async function fetchRecipeEvents({ authors, relays = RECIPE_RELAYS, ask = askRelay, log = () => {} }) {
  if (!authors.length || !relays.length) return [];
  const filter = { kinds: [RECIPE_KIND], authors: authors.map(a => a.pubkey), '#t': [RECIPE_TOPIC] };
  const events = [];
  let asked = 0;
  for (const url of relays) {
    try { events.push(...await ask(url, filter)); asked++; } catch (e) { log(`recipes: ${url} could not be asked: ${String(e?.message || e).slice(0, 100)}`); }
  }
  if (!asked) throw new Error('no relay could be asked');
  return events;
}

/**
 * The signed recipes in use: the newest valid event per recipe id among what the
 * relays have now and what was kept from earlier. So an event once seen stays
 * until a newer one replaces it, whatever a relay serves later, and with every
 * relay down the ones already known are used. An author who leaves the list is
 * no longer read; what was kept of theirs still counts if they return.
 */
export async function signedRecipes(db, { authors = null, relays = RECIPE_RELAYS, ask = askRelay, verify = null, now = Date.now(), log = () => {} } = {}) {
  authors = authors || loadAuthors(undefined, { log });
  if (!authors.length) return []; // nobody is trusted: nothing is asked, and nothing kept is touched
  const verifyEvent = verify ? null : (await import('nostr-tools/pure')).verifyEvent;
  let fetched = [];
  try { fetched = await fetchRecipeEvents({ authors, relays, ask, log }); } catch (e) { log(`recipes: ${e.message}; keeping the ones already known`); }
  const valid = [...storedRecipeEvents(db), ...fetched].map(e => recipeFromEvent(e, authors, { verify: verify || verifyEvent, log, now })).filter(Boolean);
  // Kept per id and author, and never dropped: what an author published stays the floor for what is taken from
  // them later, also after a start with a list that did not name them (or could not be read).
  saveRecipeEvents(db, newest(valid, r => `${r.id} ${r.author}`).map(r => [r.id, r.author, r.signed]));
  return newest(valid, r => r.id).sort((a, b) => a.id.localeCompare(b.id));
}

/** The recipes in use: the files, then the signed ones. A file wins over an event with its id, and comes first when two cover a package. */
export const recipesInUse = (fileRecipes, signed) => [...fileRecipes, ...signed.filter(r => !fileRecipes.some(f => f.id === r.id))];

/** Sign a recipe with a secret key (nsec or hex) and send it to the relays. Returns the event and, per relay, whether it took it. */
export async function publishRecipe(text, secret, { relays = RECIPE_RELAYS, now = Date.now() } = {}) {
  const { finalizeEvent, nip19 } = await import('nostr-tools');
  const { SimplePool } = await import('nostr-tools/pool');
  const key = secret.startsWith('nsec1') ? nip19.decode(secret).data : Uint8Array.from(Buffer.from(secret, 'hex'));
  if (key.length !== 32) throw new Error('the secret key must be an nsec or 64 hex characters');
  const event = finalizeEvent(recipeTemplate(text, now), key);
  const pool = new SimplePool();
  try {
    const results = await Promise.allSettled(pool.publish(relays, event));
    return { event, relays: relays.map((url, i) => ({ url, ok: results[i].status === 'fulfilled', ...(results[i].status === 'fulfilled' ? {} : { reason: String(results[i].reason?.message || results[i].reason || 'rejected').slice(0, 100) }) })) };
  } finally { pool.close(relays); }
}
