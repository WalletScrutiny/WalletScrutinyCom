/**
 * androidAvailability.mjs
 *
 * Decides `android.meta: removed` from every distribution channel we track, not only
 * Google Play. Used by removedCheck.mjs, which runs in refresh.sh after the Play scraper
 * and the F-Droid and Zapstore checks.
 *
 * The Play scraper records a delisting as `android.playStore: removed`. That alone no
 * longer makes the product "removed": it stays `meta: ok` while F-Droid, Zapstore or a
 * recent GitHub release still ships an APK, and only becomes `meta: removed` when none
 * of them does.
 */

/** A GitHub release older than this no longer counts as the product being available. */
export const RECENT_RELEASE_MONTHS = 12;

/**
 * Whether Google Play no longer lists the app. Before `playStore: removed` existed, only
 * the Play scraper set `meta: removed`, so that also means a Play delisting.
 * `playStore: false` (never on Play) is not a delisting.
 */
export function isDelistedFromPlay (android) {
  if (!android || android.playStore === false) return false;
  return android.playStore === 'removed' || android.meta === 'removed';
}

export function githubRepoPath (repository) {
  const m = String(repository || '').match(/github\.com\/([^/\s]+\/[^/\s#?]+)/);
  return m ? m[1].replace(/\.git$/, '') : null;
}

/** Whether `releases` (GitHub API objects) hold a published APK newer than RECENT_RELEASE_MONTHS. */
export function hasRecentApkRelease (releases, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - RECENT_RELEASE_MONTHS);
  return releases.some((r) =>
    !r.draft &&
    new Date(r.published_at) >= cutoff &&
    (r.assets || []).some((a) => /\.apk$/i.test(a.name))
  );
}

/**
 * The channels other than Play that still ship the app.
 * `githubShips` is true, false or null (unknown, e.g. the API call failed).
 * Returns { channels, known }: `known` is false when an unknown answer could still
 * change the outcome, so the caller must leave `meta` alone.
 */
export function otherChannels (android, githubShips) {
  const channels = (android.alternativeStores || [])
    .map((s) => String(s).trim().toLowerCase())
    .filter((s) => s === 'fdroid' || s === 'zapstore');
  if (githubShips === true) channels.push('github');
  return { channels, known: channels.length > 0 || githubShips !== null };
}

/** Below this many Play installs an app is `fewusers`, as in helperPlayStore. */
export const FEW_USERS = 1000;

/**
 * The `meta` a Play-delisted app should have, or null to leave it unchanged.
 * Moves between `removed`, `ok` and `fewusers`; any other meta (obsolete, ...) is
 * kept while another channel still ships. The last Play install count decides
 * between `ok` and `fewusers`, as no other channel reports one.
 */
export function nextMeta (android, { channels, known }) {
  if (!known) return null;
  if (channels.length > 0) {
    const fewUsers = android.users != null && android.users < FEW_USERS;
    const shipped = fewUsers ? 'fewusers' : 'ok';
    if (android.meta === 'removed') return shipped;
    if (android.meta === 'ok' && fewUsers) return 'fewusers';
    return null;
  }
  return android.meta === 'removed' ? null : 'removed';
}
