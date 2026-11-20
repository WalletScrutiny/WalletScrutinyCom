// What Google's OSS Rebuild already attests, so those versions are not rebuilt.
import { listOssRebuild } from '../source_analysis/rebuildClaims.mjs';

/** Fill db.google for each (ecosystem, name) not looked up yet; returns how many versions Google has among our candidates. */
export async function syncGoogle(db, { ecosystem = 'npm', fetchImpl = fetch, log = () => {}, concurrency = 12 } = {}) {
  const names = db.prepare(`SELECT DISTINCT c.name FROM candidates c WHERE c.ecosystem = ?
    AND NOT EXISTS (SELECT 1 FROM google_lookups l WHERE l.ecosystem = c.ecosystem AND l.name = c.name)`).all(ecosystem).map(r => r.name);
  const ours = db.prepare(`SELECT version FROM candidates WHERE ecosystem = ? AND name = ?`);
  const ins = db.prepare(`INSERT OR IGNORE INTO google (ecosystem, name, version) VALUES (?, ?, ?)`);
  const done = db.prepare(`INSERT OR REPLACE INTO google_lookups (ecosystem, name) VALUES (?, ?)`);
  const queue = [...names];
  let hits = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const name = queue.shift();
      try {
        const listing = await listOssRebuild(ecosystem, name, fetchImpl);
        db.transaction(() => {
          for (const { version } of ours.all(ecosystem, name)) if (listing?.has(version)) { ins.run(ecosystem, name, version); hits++; }
          done.run(ecosystem, name);
        })();
      } catch (e) { log(`${name}: ${e.message}`); }
    }
  }));
  return { looked: names.length, hits };
}
