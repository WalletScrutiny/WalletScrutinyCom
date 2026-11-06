// Wallet pages with today's advisories, between analysis passes.
//
// A pass rechecks and exports every wallet only at its end, and a pass can
// take hours. This asks OSV.dev again about every stored release and
// re-exports and publishes only the wallets whose advisories changed (Luis,
// 2026-10-28: the pages need the newest information or they are not useful).
// Run by its own timer (config/walletscrutiny-advisory-refresh.*), hourly.
//
// An upload that fails is sent again by the next run, whether or not
// anything changed since: every file newer than the "published up to" marker
// (publish.mjs, markerPathFor) goes along, and only a successful upload moves
// the marker (issue 997).
//
// The refresh holds the run lock, and a pass waits for it. A stalled OSV.dev
// fails a release only after about 93 s (osv.mjs: timeouts and retries), so
// one release after another would keep a pass waiting for hours (issue 999).
// The refresh stops looking up after 3 failures in a row or after 45 minutes,
// before the next hourly run; what it changed until then is still published.
// The next run starts at the first release it left out (export.refresh-next,
// next to the export), so releases behind 3 that always fail, or behind the
// 45 minutes, are still looked up every other hour.
// The service's TimeoutStartSec ends it if a single lookup hangs beyond that.
import fs from 'fs';
import path from 'path';
import { recheckStoredReleases } from './recheck.mjs';
import { exportApp, productCounts } from './export.mjs';
import { packageSources } from './ddbbUtils.mjs';
import { publishFiles, markerPathFor, readMarker, writeMarker, exportFiles, newestExportFile } from './publish.mjs';
import { buildSignals } from './signals.mjs';
import { buildNews } from './news.mjs';

/**
 * Returns recheckStoredReleases' result plus { exported, published, retried }:
 * the apps written to exportDir, whether anything went to the web host, and
 * how many files a failed upload had left behind. Without an export (no
 * exportDir, or no index.json yet: the first pass writes it) only the
 * database is updated. A failing upload throws, and the marker stays.
 * A refresh that stopped early also has stopped: { reason, skipped, next }.
 */
export const MAX_FAILURES_IN_A_ROW = 3;
export const TIME_LIMIT_MS = 45 * 60 * 1000;
export const resumePathFor = (exportDir) => `${path.resolve(exportDir)}.refresh-next`;

function readResume(file) {
  try {
    const { appId, version } = JSON.parse(fs.readFileSync(file, 'utf8'));
    return typeof appId === 'string' && typeof version === 'string' ? { appId, version } : null;
  } catch {
    return null;
  }
}

export async function refreshAdvisories(db, { exportDir = null, onlyReproducible = true, check, deliver, publish = publishFiles, signals = buildSignals, log = console, markerPath = exportDir && markerPathFor(exportDir), maxFailuresInARow = MAX_FAILURES_IN_A_ROW, timeLimitMs = TIME_LIMIT_MS, now = Date.now, resumePath = exportDir && resumePathFor(exportDir) } = {}) {
  const apps = db.prepare('SELECT DISTINCT app_id FROM app_dependencies ORDER BY app_id').all().map(r => r.app_id);
  const recheck = await recheckStoredReleases(db, apps, { ...(check && { check }), ...(deliver && { deliver }), maxFailuresInARow, deadline: now() + timeLimitMs, now, startAt: resumePath && readResume(resumePath) });
  if (recheck.stopped) {
    const { reason, skipped, next } = recheck.stopped;
    log.log(`Refresh stopped early: ${reason}; ${skipped} releases not looked up keep their stored advisories; the next run starts at ${next.appId} ${next.version}`);
    if (resumePath) fs.writeFileSync(resumePath, `${JSON.stringify(next)}\n`);
  } else if (resumePath) {
    fs.rmSync(resumePath, { force: true });
  }
  const result = { ...recheck, exported: [], published: false, retried: 0 };
  if (!exportDir || !fs.existsSync(path.join(exportDir, 'index.json'))) return result;
  // No marker yet (the first run): the export as it stands counts as
  // published, so only this run's files go, and a failure among them is retried.
  let marker = readMarker(markerPath);
  if (marker === null) {
    marker = newestExportFile(exportDir);
    writeMarker(markerPath, marker);
  }
  const files = new Set();
  if (recheck.changed.length) {
    const counts = productCounts(db);
    const sources = packageSources(db);
    for (const appId of recheck.changed) {
      const app = exportApp(db, exportDir, appId, { onlyReproducible, counts, sources });
      if (!app.exported) continue;
      result.exported.push(appId);
      for (const f of app.files) files.add(f);
    }
    if (files.size) {
      // EPSS, CISA's exploited list and publication dates for the new advisories;
      // a failing feed keeps the previous signals.json.
      try {
        if ((await signals({ exportDir, log })).written) files.add('signals.json');
      } catch (error) {
        log.warn(`advisory signals: ${error.message}`);
      }
      try {
        if (buildNews({ exportDir }).written) files.add('news.json');
      } catch (error) {
        log.warn(`news: ${error.message}`);
      }
    }
  }
  // Everything newer than the marker: this run's files and what an earlier
  // failed upload left behind. Files inside a directory this run sends are
  // already covered by it.
  const current = exportFiles(exportDir);
  const dirs = [...files].filter(f => f.endsWith('/'));
  for (const { file, mtimeMs } of current) {
    if (mtimeMs <= marker || files.has(file) || dirs.some(d => file.startsWith(d))) continue;
    files.add(file);
    result.retried++;
  }
  if (!files.size) return result;
  if (result.retried) log.log(`Sending ${result.retried} files again that an earlier upload did not deliver`);
  result.published = publish(exportDir, [...files]).published;
  if (result.published) writeMarker(markerPath, current.reduce((max, f) => Math.max(max, f.mtimeMs), marker));
  return result;
}
