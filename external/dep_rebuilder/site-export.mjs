// The rebuilder's results as one static file for the website: rebuilds.json,
// copied to the web server (publish.mjs of source_analysis does the copy, with
// brotli) and read from there by the source analysis, which turns each row into
// a `ws` claim of the dependency panel. Only the outcome and a one-line reason
// leave this machine: no logs, no paths, no build output.
import fs from 'fs';
import path from 'path';
import { publishExport } from '../source_analysis/publish.mjs';

export const FEED_SCHEMA = 1;

/** Every finished rebuild, ordered by package, as the rows of rebuilds.json. */
export function feedRows(db) {
  return db.prepare(`SELECT ecosystem, name, version, result, note, substr(finished_at, 1, 10) AS date,
      repo_url AS repo, commit_sha AS "commit", toolchain
    FROM rebuilds WHERE result IN ('reproduced', 'failed') ORDER BY ecosystem, name, version`).all()
    .map(r => Object.fromEntries(Object.entries(r).filter(([, v]) => v != null && v !== '')));
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
