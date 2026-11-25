// The rebuilder's results as one static file for the website: rebuilds.json,
// copied to the web server (publish.mjs of source_analysis does the copy, with
// brotli) and read from there by the source analysis, which turns each row into
// a `ws` claim of the dependency panel. Only the versions whose rebuild says
// something about the package leave this machine, each with its verdict and a
// one-line note: no logs, no paths, no build output.
import fs from 'fs';
import path from 'path';
import { publishExport } from '../source_analysis/publish.mjs';
import { VERDICT_SQL } from './db.mjs';

export const FEED_SCHEMA = 1;

// The verdicts (db.mjs) the feed carries. A build that finished and was compared says something:
// reproduced, almost (only docs or dev-only fields differ), not-reproducible (the publisher's build,
// as a recipe, differs) and unknown-command (our generic build differs: the command was a guess).
// A failed step or no build for it yet ("we don't know how yet") stays in the database, as the
// list of what to work on.
export const FEED_VERDICTS = ['reproduced', 'almost', 'not-reproducible', 'unknown-command'];

/** Every version whose rebuild was compared, ordered by package, as the rows of rebuilds.json. */
export function feedRows(db) {
  // wallets: how many wallets ship the version in their app (the candidate list's count); walletIds: which
  // result stays reproduced | failed, so a reader that predates `verdict` still takes only the reproduced
  return db.prepare(`SELECT * FROM (SELECT r.ecosystem, r.name, r.version, r.result, ${VERDICT_SQL} AS verdict, r.note, substr(r.finished_at, 1, 10) AS date,
      r.repo_url AS repo, r.commit_sha AS "commit", r.toolchain, r.recipe, r.recipe_event AS "recipeEvent", c.wallets AS wallets, c.wallet_ids AS walletIds
    FROM rebuilds r LEFT JOIN candidates c ON c.ecosystem = r.ecosystem AND c.name = r.name AND c.version = r.version
    ) WHERE verdict IN (${FEED_VERDICTS.map(v => `'${v}'`).join(', ')}) ORDER BY ecosystem, name, version`).all()
    .map(r => Object.fromEntries(Object.entries({ ...r, walletIds: r.walletIds && JSON.parse(r.walletIds) }).filter(([, v]) => v != null && v !== '')));
}

/** Writes <dir>/rebuilds.json atomically; returns the number of rows. */
export function writeFeed(db, dir, now = new Date()) {
  const rows = feedRows(db);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'rebuilds.json');
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ schema: FEED_SCHEMA, claimant: 'ws', generated: now.toISOString(), rows }));
  fs.renameSync(tmp, file);
  return rows.length;
}

/**
 * Writes the feed and copies it to DEP_REBUILDER_PUBLISH_TARGET (rsync destination,
 * `user@host:/` for an rrsync-restricted key) with DEP_REBUILDER_PUBLISH_SSH as the
 * ssh command. With no target nothing is copied. Throws when the copy fails.
 */
export function publishFeed(db, dir, { target = process.env.DEP_REBUILDER_PUBLISH_TARGET, ssh = process.env.DEP_REBUILDER_PUBLISH_SSH, run } = {}) {
  const rows = writeFeed(db, dir);
  const result = publishExport(dir, { target, ssh, ...(run ? { run } : {}) });
  return { rows, ...result };
}
