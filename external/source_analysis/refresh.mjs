// Wallet pages with today's advisories, between analysis passes.
//
// A pass rechecks and exports every wallet only at its end, and a pass can
// take hours. This asks OSV.dev again about every stored release and
// re-exports and publishes only the wallets whose advisories changed (Luis,
// 2026-10-28: the pages need the newest information or they are not useful).
// Run by its own timer (config/walletscrutiny-advisory-refresh.*), hourly.
import fs from 'fs';
import path from 'path';
import { recheckStoredReleases } from './recheck.mjs';
import { exportApp, productCounts } from './export.mjs';
import { packageSources } from './ddbbUtils.mjs';
import { publishFiles } from './publish.mjs';
import { buildSignals } from './signals.mjs';
import { buildNews } from './news.mjs';

/**
 * Returns recheckStoredReleases' result plus { exported, published }:
 * the apps written to exportDir and whether anything went to the web host.
 * Without an export (no exportDir, or no index.json yet: the first pass
 * writes it) only the database is updated.
 */
export async function refreshAdvisories(db, { exportDir = null, onlyReproducible = true, check, deliver, publish = publishFiles, signals = buildSignals, log = console } = {}) {
  const apps = db.prepare('SELECT DISTINCT app_id FROM app_dependencies ORDER BY app_id').all().map(r => r.app_id);
  const recheck = await recheckStoredReleases(db, apps, { ...(check && { check }), ...(deliver && { deliver }) });
  const result = { ...recheck, exported: [], published: false };
  if (!exportDir || !recheck.changed.length || !fs.existsSync(path.join(exportDir, 'index.json'))) return result;
  const counts = productCounts(db);
  const sources = packageSources(db);
  const files = new Set();
  for (const appId of recheck.changed) {
    const app = exportApp(db, exportDir, appId, { onlyReproducible, counts, sources });
    if (!app.exported) continue;
    result.exported.push(appId);
    for (const f of app.files) files.add(f);
  }
  if (!files.size) return result;
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
  result.published = publish(exportDir, [...files]).published;
  return result;
}
