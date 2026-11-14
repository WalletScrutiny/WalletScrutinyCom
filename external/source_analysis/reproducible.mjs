// Which wallets are in scope, and which of their versions were verified.
//
// Only products whose binary was reproduced from the analysed source are
// checked (Leo, 2026-10-16 and 2026-10-26): a wallet that does not build from
// its source may ship anything, so its declared dependencies say nothing about
// the app. A wallet stays in scope once any of its versions was found
// reproducible, even when later ones are not.
//
// The verdicts are the site's build verifications on Nostr (kind 30301, see
// src/nostr-constants.mjs): tags i (appId), version, status. Each pass reads
// them fresh and keeps the last good set in SQLite, like the app list, so a
// pass survives the relays being unreachable.
import { getReproducibleVersions, saveReproducibleVersions, hasReleaseAnalysis, replaceVerifiedRefs, recordAnalysis } from './ddbbUtils.mjs';
import { matchTag, lsRemoteTags } from './sourceIdentity.mjs';

export const VERIFICATION_KIND = 30301;
// src/nostr-constants.mjs eventRelayUrls; the main relay holds every verification.
export const VERIFICATION_RELAYS = ['wss://relay.nostr.info/', 'wss://nos.lol/', 'wss://relay.primal.net/'];
// src/nostr-constants.mjs verificationEventsSinceTS: nothing older is a verification of this kind.
const SINCE = 1742997262;

const tag = (event, name) => (event.tags.find(t => t[0] === name) || [])[1];

// The build's own download list (scripts/rb/ws-buildlock.sh) travels with a
// verification as an ordinary output file under exactly this name (issue 1000).
export const BUILD_LOCK_NAME = 'build-lock.json';
const NEAR_BUILD_LOCK = /^build-lock.*\.json$/i;

/**
 * The `build-lock.json` output files of one verification event, and the
 * output files named like one but not exactly (`build-lock (1).json`), which
 * are reported as misnamed and never downloaded. Each lock carries the
 * event's own app, version and platform, to compare with the file's.
 */
export function buildLockRefs(event) {
  const locks = [];
  const misnamed = [];
  for (const t of event.tags) {
    if (t[0] !== 'output-file' || !t[1]) continue;
    const sha256 = String(t[2] || '').toLowerCase().replace(/^sha256:/, '');
    if (t[1] === BUILD_LOCK_NAME && /^[0-9a-f]{64}$/.test(sha256)) {
      locks.push({ sha256, eventId: event.id, pubkey: event.pubkey, appId: tag(event, 'i'), version: String(tag(event, 'version') || '').trim(), platform: tag(event, 'platform') || null });
    } else if (t[1] !== BUILD_LOCK_NAME && NEAR_BUILD_LOCK.test(t[1])) {
      misnamed.push({ name: t[1], sha256: sha256 || null, eventId: event.id, pubkey: event.pubkey, platform: tag(event, 'platform') || null });
    }
  }
  return { locks, misnamed };
}

// Every event of `filter` one relay holds. A relay answers a query with at
// most its own cap of events, newest first (relay.nostr.info 2000, nos.lol and
// primal 500 in 2026-11), so older ones need pages: ask again `until` the
// oldest event seen, until a page brings nothing new. `until` is inclusive, so
// events sharing that second are not lost; the seen set drops the repeats.
export async function pageRelay(querySync, relay, filter) {
  const seen = new Map();
  let until = filter.until;
  for (;;) {
    const page = await querySync([relay], until === undefined ? filter : { ...filter, until });
    const fresh = page.filter(e => !seen.has(e.id));
    if (!fresh.length) return [...seen.values()];
    for (const e of fresh) seen.set(e.id, e);
    until = Math.min(...fresh.map(e => e.created_at));
  }
}

// Paged per relay, because each relay stops at a different cap.
export async function queryRelays(relays, filter) {
  if (typeof WebSocket !== 'function') throw new Error('this Node has no WebSocket (needs Node 22 or later)');
  const { SimplePool } = await import('nostr-tools/pool');
  const pool = new SimplePool();
  const querySync = (urls, f) => pool.querySync(urls, f, { maxWait: 20000 });
  try {
    const pages = await Promise.all(relays.map(relay => pageRelay(querySync, relay, filter)));
    return [...new Map(pages.flat().map(e => [e.id, e])).values()];
  } finally {
    pool.close(relays);
  }
}

// The build-lock fields of a version, only when some verification has one.
function withBuildLocks(known, refs) {
  const buildLocks = [...(known?.buildLocks || []), ...refs.locks];
  const misnamedLocks = [...(known?.misnamedLocks || []), ...refs.misnamed];
  return { ...(buildLocks.length ? { buildLocks } : {}), ...(misnamedLocks.length ? { misnamedLocks } : {}) };
}

/**
 * appId -> [{ version, verifiedAt, platform, buildLocks, misnamedLocks }] of
 * every version with a reproducible verification, newest verification first
 * (buildLockRefs: the build-lock.json files of all of them). Verifications are addressable:
 * only the newest event per (author, d) counts, so a verifier who revised
 * "reproducible" to "not reproducible" no longer vouches for that version.
 */
export function reproducibleVersions(events) {
  const latest = new Map();
  for (const e of events) {
    const key = `${e.pubkey}\n${tag(e, 'd')}`;
    if (!latest.has(key) || latest.get(key).created_at < e.created_at) latest.set(key, e);
  }
  const byApp = new Map();
  for (const e of latest.values()) {
    const appId = tag(e, 'i');
    const version = String(tag(e, 'version') || '').trim();
    if (!appId || !version || tag(e, 'status') !== 'reproducible') continue;
    if (!byApp.has(appId)) byApp.set(appId, new Map());
    const versions = byApp.get(appId);
    const known = versions.get(version);
    // every verifier's build-lock.json counts, whichever verification is newest
    const locks = withBuildLocks(known, buildLockRefs(e));
    if (!known || known.verifiedAt < e.created_at) versions.set(version, { verifiedAt: e.created_at, platform: tag(e, 'platform') || null, ...locks });
    else Object.assign(known, locks);
  }
  const out = new Map();
  for (const [appId, versions] of byApp) {
    out.set(appId, [...versions].map(([version, v]) => ({ version, ...v })).sort((a, b) => b.verifiedAt - a.verifiedAt));
  }
  return out;
}

/**
 * Fresh verdicts when the relays answer (and cache them), otherwise the last
 * cached set. Throws when neither exists: without verdicts nothing is in scope,
 * and an empty pass would look like a clean one.
 */
export async function loadReproducible(db, { query = queryRelays, relays = VERIFICATION_RELAYS } = {}) {
  try {
    const events = await query(relays, { kinds: [VERIFICATION_KIND], since: SINCE });
    const byApp = reproducibleVersions(events);
    if (!byApp.size) throw new Error(`no reproducible verification among ${events.length} events`);
    saveReproducibleVersions(db, byApp);
    return { byApp, source: 'relays' };
  } catch (error) {
    const byApp = getReproducibleVersions(db);
    if (!byApp.size) throw new Error(`cannot load the build verifications and no cached copy: ${error.message}`);
    return { byApp, source: 'cache', error: error.message };
  }
}

// Every verified version of a job: its appId and every alias (an app listed on
// Android and iPhone shares the repository), newest verification first.
export function verifiedVersionsOf(job, byApp) {
  const ids = new Set([job.appId, ...(job.aliases || []).map(a => a.appId)]);
  const seen = new Map();
  for (const id of ids) {
    for (const v of byApp.get(id) || []) {
      if (!seen.has(v.version) || seen.get(v.version).verifiedAt < v.verifiedAt) seen.set(v.version, { ...v, appId: id });
    }
  }
  return [...seen.values()].sort((a, b) => b.verifiedAt - a.verifiedAt);
}

export const inScope = (job, byApp) => verifiedVersionsOf(job, byApp).length > 0;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PLATFORM_HINTS = { android: /android/i, iphone: /ios|iphone/i, desktop: /desktop/i };
// The Bitcoin-only edition as tags name it (`firmware-btc-only/v9.25.0`);
// verifiers also write "Bitcoin-only".
const BTC_ONLY = /b(?:itcoin|tc)[-_ ]?only/i;
// A multi-coin flavour (`9.25.0 - Multi`, `-multicoin`): where the repository
// tags it only by leaving the Bitcoin-only marker off, the tag without it.
const MULTI = /^multi(?:[-_ ]?coin)?$/i;
const notBtcOnly = { test: (t) => !BTC_ONLY.test(t) };
// A plain version on Android is the Play Store build: WalletScrutiny's Android
// listings are Play Store apps (`v0.60.0-google`, not `v0.60.0-fdroid`).
const PLAY_STORE = /[-_.](?:google|g?play)(?:[-_.]|$)/i;

// The candidate a hint picks: the only one matching it, else null.
function pick(found, hints) {
  for (const hint of hints) {
    const named = found.filter(t => hint.test(t));
    if (named.length === 1) return named[0];
  }
  return null;
}

// A tag that names the version after a component prefix (`firmware/v9.27.1`,
// `android-v2.8.2`, `android.2.9.2`, `release_5.7.0`), maybe with a flavour
// after it (`v0.60.0-fdroid`). Several match in repositories that tag each
// app or flavour: the one named by the verified platform or by the flavour in
// the verified version (`0.59.4 - Fdroid`, `9.25.0-Btc-Only`) wins, otherwise
// none; a wrong guess is worse than no tag.
function prefixedTag(tags, version, platform, flavour) {
  const re = new RegExp(`(^|[/_-]|[a-z]\\.)v?${escapeRe(version)}([-_][a-z-]+)?$`, 'i');
  const found = [...(tags.keys ? tags.keys() : tags)].filter(t => re.test(t));
  if (found.length <= 1) return found[0] || null;
  const hints = [];
  if (flavour && BTC_ONLY.test(flavour)) hints.push(BTC_ONLY);
  else if (flavour) hints.push(new RegExp(escapeRe(flavour).replace(/[-_ ]+/g, '[-_ ]?'), 'i'));
  if (flavour && MULTI.test(flavour)) hints.push(notBtcOnly);
  if (PLATFORM_HINTS[platform]) hints.push(PLATFORM_HINTS[platform]);
  if (!flavour && platform === 'android') hints.push(PLAY_STORE);
  return pick(found, hints);
}

// The tag of a verified version. Verifications name the version the store
// shows (`3.2.0`, sometimes with a build suffix like `3.2.0-Multi` or
// `2026.16.1 (3)`); tags add a `v` or a component prefix. Tries the name as
// given, then without its suffix, then without a last `.0` the tag leaves
// off (`1.70.0` is `android.1.70`).
export function tagOfVersion(tags, appId, version, platform = null) {
  const m = /^v?(\d+(?:\.\d+)+)\s*(?:[-–]\s*)?([a-z][a-z -]*[a-z])?/i.exec(version);
  const base = m?.[1];
  const flavour = m?.[2] || null;
  const short = /^\d+\.\d+\.0$/.test(base || '') ? base.slice(0, -2) : null;
  for (const v of [...new Set([version, base, short].filter(Boolean))]) {
    const found = matchTag(tags, appId, v) || prefixedTag(tags, v, platform, flavour);
    if (found) return found;
  }
  return null;
}

/**
 * Analyse the verified versions of a wallet that have no finished analysis
 * yet, at most `perPass`, each at the tag that names it. These are the
 * versions users run, so they count more than the newest release; any host
 * works, the tags come from git. `analyse(tag)` runs one release analysis.
 * With `redo` (--reanalyse: the tags already run again this pass) finished
 * analyses run again too and there is no cap. Returns the tags analysed.
 */
export async function analyseVerifiedVersions(db, { appId, repoUrl, verified, perPass, analyse, listTags = lsRemoteTags, analyser = null, redo = null }) {
  if (!verified.length || (!perPass && !redo)) return [];
  let tags;
  try {
    tags = await listTags(repoUrl);
  } catch (error) {
    console.warn(`  Cannot list the tags of ${repoUrl}: ${error.message}. Verified versions wait for the next pass.`);
    return [];
  }
  const resolved = verified.map(v => ({ v, tag: tagOfVersion(tags, appId, v.version, v.platform) }));
  // Saved past the cap too: the export shows only releases a verified version
  // names. Rebuilt whole, so no name keeps a tag an earlier pass gave it.
  replaceVerifiedRefs(db, appId, resolved.filter(r => r.tag).map(r => [r.tag, r.v.version]));
  const done = [];
  let left = 0;
  for (const { v, tag } of resolved) {
    if (!tag) {
      // Kept so the export can say which verified version had no source to check.
      if (!analyser) analyser = (await import('./appAnalysis.mjs')).analyserVersion();
      recordAnalysis(db, { appId, kind: 'verified-no-tag', ref: v.version, status: 'unsupported', error: `no tag names verified version ${v.version}`, analyser });
      continue;
    }
    if (done.includes(tag)) continue;
    // the tag's commit now: a moved tag is analysed again
    if (redo ? redo.includes(tag) : hasReleaseAnalysis(db, appId, tag, tags.get?.(tag) || null)) continue;
    if (!redo && done.length >= perPass) {
      left++;
      continue;
    }
    console.log(`  Verified version ${v.version} (reproducible): analysing tag ${tag}...`);
    await analyse(tag);
    done.push(tag);
  }
  if (left) console.log(`  Verified versions left for the next pass: ${left}.`);
  return done;
}
