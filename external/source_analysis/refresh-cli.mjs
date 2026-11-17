#!/usr/bin/env node
// Ask OSV.dev again about every stored release and put the wallets whose
// advisories changed on the site (refresh.mjs). The service runs it hourly
// (config/walletscrutiny-advisory-refresh.timer); skipped while a pass runs
// (runLock.mjs), since the pass rechecks and exports everything when it ends.
// Usage: node refresh-cli.mjs
//   (SOURCE_ANALYSIS_DB_PATH, SOURCE_ANALYSIS_EXPORT_DIR and
//   SOURCE_ANALYSIS_PUBLISH_* as for index.mjs)
import { initDatabase } from './ddbbUtils.mjs';
import { DB_PATH, EXPORT_DIR, SCOPE } from './config.mjs';
import { refreshAdvisories } from './refresh.mjs';
import { lockPathFor, tryLock } from './runLock.mjs';

const { release, holder } = tryLock(lockPathFor(DB_PATH));
if (!release) {
  console.log(`Skipped: process ${holder} (a source analysis pass) is running; it exports everything when it ends`);
  process.exit(0);
}
const db = initDatabase(DB_PATH);
try {
  const r = await refreshAdvisories(db, { exportDir: EXPORT_DIR, onlyReproducible: SCOPE !== 'all' });
  console.log(`${r.releases} releases looked up again, ${r.failed} failed, ${r.added} new advisories; changed: ${r.changed.join(', ') || 'none'}`);
  if (r.exported.length) console.log(`Exported ${r.exported.length} apps${r.published ? ' and published them' : ''}`);
  process.exitCode = r.failed ? 1 : 0;
} catch (error) {
  console.error('✗  Advisory refresh failed:', error.message);
  process.exitCode = 1;
} finally {
  db.close();
  release();
}
