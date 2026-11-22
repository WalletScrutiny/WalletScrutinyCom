// The unattended loop behind `node index.mjs serve`: keep the candidate list
// fresh, rebuild the next version (most wallets first), sleep when nothing is
// left. Results are saved one version at a time, so a restart loses at most
// the build in progress.
import { pending, getMeta, setMeta } from './db.mjs';

const HOUR = 3600 * 1000;

/**
 * Injected so the loop can be tested without containers or a network:
 *   sync()          refresh candidates and Google's list
 *   step(candidate) rebuild one version and save the result; may throw
 *   sleep(ms)       resolves early when the loop is asked to stop
 *   recipes         { next(deferred), run(job), keys() }: the next build of a recipe (one commit of a
 *                   repository, many packages; `key` names it) and running it. These come before
 *                   single versions: one such build settles what the generic build cannot.
 *                   `keys()` are the recipes in use: the failure of any other is the generic build's again.
 */
export async function serveLoop({ db, sync, step, sleep, shouldStop, publish = null, recipes = null, log = () => {}, now = Date.now,
  publishEveryMs = HOUR / 2, scope = 'app', minWallets = 1, syncEveryMs = 24 * HOUR, idleMs = HOUR, retrySyncMs = HOUR / 2, errorMs = 5 * 60 * 1000 }) {
  let dirty = false, lastPublish = 0; // results since the last copy to the website
  const publishNow = async () => {
    if (!publish || !dirty) return;
    try { const r = await publish(); dirty = false; log(`publish: ${JSON.stringify(r)}`); } catch (e) { log(`publish failed: ${e.message}`); }
    lastPublish = now();
  };
  const deferred = new Set(); // versions that threw (registry or network trouble) in this process: tried again after the next restart
  let nextSyncAt = Number(getMeta(db, 'last_sync_ms') || 0) + syncEveryMs;
  dirty = Boolean(publish); // a start republishes what an earlier run left unsent
  while (!shouldStop()) {
    if (now() >= nextSyncAt) {
      try {
        const r = await sync();
        setMeta(db, 'last_sync_ms', now());
        nextSyncAt = now() + syncEveryMs;
        deferred.clear();
        log(`sync: ${JSON.stringify(r)}`);
      } catch (e) {
        nextSyncAt = now() + retrySyncMs;
        log(`sync failed: ${e.message}`);
      }
      continue;
    }
    let job = null;
    if (recipes) {
      try { job = await recipes.next(deferred); } catch (e) { log(`recipes: ${e.message}`); }
    }
    if (job) {
      if (shouldStop()) break; // looking for it took a while (relays, the repository's tags): asked to stop since
      if (dirty && now() - lastPublish >= publishEveryMs) await publishNow();
      try {
        await recipes.run(job);
        dirty = true;
      } catch (e) {
        deferred.add(job.key);
        log(`! ${job.key}: ${e.message}`);
        await sleep(errorMs);
      }
      continue;
    }
    const next = pending(db, { limit: deferred.size + 1, scope, minWallets, recipeKeys: recipes?.keys?.() ?? null }).find(c => !deferred.has(`${c.name}@${c.version}`));
    if (dirty && (now() - lastPublish >= publishEveryMs || !next)) await publishNow();
    if (!next) { await sleep(Math.min(idleMs, Math.max(nextSyncAt - now(), 1000))); continue; }
    try {
      await step(next);
      dirty = true;
    } catch (e) {
      deferred.add(`${next.name}@${next.version}`);
      log(`! ${next.name}@${next.version}: ${e.message}`);
      await sleep(errorMs);
    }
  }
}
