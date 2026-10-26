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
import { getReproducibleVersions, saveReproducibleVersions, hasReleaseAnalysis, saveVerifiedRef, recordAnalysis } from './ddbbUtils.mjs';
import { matchTag, lsRemoteTags } from './sourceIdentity.mjs';

export const VERIFICATION_KIND = 30301;
// src/nostr-constants.mjs eventRelayUrls; the main relay holds every verification.
export const VERIFICATION_RELAYS = ['wss://relay.nostr.info/', 'wss://nos.lol/', 'wss://relay.primal.net/'];
// src/nostr-constants.mjs verificationEventsSinceTS: nothing older is a verification of this kind.
const SINCE = 1742997262;

const tag = (event, name) => (event.tags.find(t => t[0] === name) || [])[1];

async function queryRelays(relays, filter) {
  if (typeof WebSocket !== 'function') throw new Error('this Node has no WebSocket (needs Node 22 or later)');
  const { SimplePool } = await import('nostr-tools/pool');
  const pool = new SimplePool();
  try {
    return await pool.querySync(relays, filter, { maxWait: 20000 });
  } finally {
    pool.close(relays);
  }
}

/**
 * appId -> [{ version, verifiedAt }] of every version with a reproducible
 * verification, newest verification first. Verifications are addressable:
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
    if (!known || known.verifiedAt < e.created_at) versions.set(version, { verifiedAt: e.created_at, platform: tag(e, 'platform') || null });
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
  if (flavour) hints.push(new RegExp(escapeRe(flavour).replace(/[-_ ]+/g, '[-_ ]?'), 'i'));
  if (PLATFORM_HINTS[platform]) hints.push(PLATFORM_HINTS[platform]);
  return pick(found, hints);
}

// The tag of a verified version. Verifications name the version the store
// shows (`3.2.0`, sometimes with a build suffix like `3.2.0-Multi` or
// `2026.16.1 (3)`); tags add a `v` or a component prefix. Tries the name as
// given, then without its suffix.
export function tagOfVersion(tags, appId, version, platform = null) {
  const m = /^v?(\d+(?:\.\d+)+)\s*(?:[-–]\s*)?([a-z][a-z -]*[a-z])?/i.exec(version);
  const base = m?.[1];
  const flavour = m?.[2] || null;
  for (const v of base && base !== version ? [version, base] : [version]) {
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
 * Returns the tags analysed.
 */
export async function analyseVerifiedVersions(db, { appId, repoUrl, verified, perPass, analyse, listTags = lsRemoteTags, analyser = null }) {
  if (!verified.length || !perPass) return [];
  let tags;
  try {
    tags = await listTags(repoUrl);
  } catch (error) {
    console.warn(`  Cannot list the tags of ${repoUrl}: ${error.message}. Verified versions wait for the next pass.`);
    return [];
  }
  const done = [];
  for (const [i, v] of verified.entries()) {
    const tag = tagOfVersion(tags, appId, v.version, v.platform);
    if (!tag) {
      // Kept so the export can say which verified version had no source to check.
      if (!analyser) analyser = (await import('./appAnalysis.mjs')).analyserVersion();
      recordAnalysis(db, { appId, kind: 'verified-no-tag', ref: v.version, status: 'unsupported', error: `no tag names verified version ${v.version}`, analyser });
      continue;
    }
    saveVerifiedRef(db, appId, tag, v.version);
    if (hasReleaseAnalysis(db, appId, tag) || done.includes(tag)) continue;
    if (done.length >= perPass) {
      console.log(`  Verified versions left for the next pass: ${verified.length - i}.`);
      break;
    }
    console.log(`  Verified version ${v.version} (reproducible): analysing tag ${tag}...`);
    await analyse(tag);
    done.push(tag);
  }
  return done;
}
