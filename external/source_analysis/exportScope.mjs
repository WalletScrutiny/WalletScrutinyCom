// Which apps and releases the export shows: a release only for the listings
// whose binary of it was reproduced, an app only while some version of it is.
import { getReproducibleVersions, getVerifiedRefs, getEndOfLife } from './ddbbUtils.mjs';

// A verification's platform tag as the wallet page names its platform:
// verifiers write linux, windows or "Android (arm64-v8a)".
export function pagePlatform(platform) {
  const p = String(platform || '').toLowerCase();
  if (p.includes('android')) return 'android';
  if (/ios|iphone/.test(p)) return 'iphone';
  if (/linux|windows|mac|desktop/.test(p)) return 'desktop';
  return p || null;
}

// ref -> the listings ({ appId, platform }) whose binary of that release was
// reproduced. Only those artifacts get their dependencies shown (Leo,
// 2026-11-09): a sibling listing that was never reproduced (the iPhone app of a
// reproduced Android app, an older hardware model) builds from other files or
// ships something else. verified_refs is the tag each pass resolved a verified
// version to (reproducible.mjs); the version names the listing that verified it.
// Returns ref -> { listings, versions }: `versions` are the names verifiers
// typed for that release, so the panel matches a picked version by name and
// never guesses a tag a second time.
export function reproducedListings(db, appId, aliases = [], byApp = getReproducibleVersions(db)) {
  const ids = [...new Set([appId, ...aliases.map(a => a.appId)])];
  const out = new Map();
  for (const [ref, names] of getVerifiedRefs(db, appId)) {
    const listings = [];
    const versions = [];
    for (const id of ids) {
      for (const v of byApp.get(id) || []) {
        if (!names.includes(v.version)) continue;
        if (!versions.includes(v.version)) versions.push(v.version);
        // every platform it was reproduced on: Bitkey's one app id is Android and iPhone
        for (const platform of (v.platforms || [v.platform]).map(pagePlatform)) {
          if (!listings.some(l => l.appId === id && l.platform === platform)) listings.push({ appId: id, platform });
        }
      }
    }
    if (listings.length) out.set(ref, { listings, versions });
  }
  return out;
}

// Which app ids the site shows: a reproducible version on any of the
// repository's ids, and not past its end of life.
export function scopeFilter(db, aliases) {
  const verified = getReproducibleVersions(db);
  const endOfLife = getEndOfLife(db); // gone and no commit for years (index.mjs)
  return (id) => !endOfLife.has(id) && [id, ...(aliases.get(id) || []).map(a => a.appId)].some(a => verified.has(a));
}
