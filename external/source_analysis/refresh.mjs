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
 */
export async function refreshAdvisories(db, { exportDir = null, onlyReproducible = true, check, deliver, publish = publishFiles, signals = buildSignals, log = console, markerPath = exportDir && markerPathFor(exportDir) } = {}) {
  const apps = db.prepare('SELECT DISTINCT app_id FROM app_dependencies ORDER BY app_id').all().map(r => r.app_id);
  const recheck = await recheckStoredReleases(db, apps, { ...(check && { check }), ...(deliver && { deliver }) });
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
