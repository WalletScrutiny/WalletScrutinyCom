#!/usr/bin/env node
// Mark wallets for a rerun by the service's next pass, which analyses each
// one as `index.mjs --reanalyse` would (default branch, newest release, every
// stored release, all verified versions) and then removes its mark. Nothing
// is analysed or deleted here, so this is safe while a pass runs.
// Usage: node reanalyse-cli.mjs --app-id <appId>...   mark
//        node reanalyse-cli.mjs --list                 show pending marks
//        node reanalyse-cli.mjs --clear --app-id <id>  take marks back
//   (SOURCE_ANALYSIS_DB_PATH selects the database)
import minimist from 'minimist';
import { initDatabase, requestReanalyse, reanalyseRequests, clearReanalyse } from './ddbbUtils.mjs';
import { DB_PATH } from './config.mjs';

const args = minimist(process.argv.slice(2), { string: ['appId'], boolean: ['list', 'clear'], alias: { appId: ['app-id'] } });
const ids = [].concat(args.appId || []).filter(Boolean);
if (!args.list && !ids.length) {
  console.error('Usage: node reanalyse-cli.mjs --app-id <appId>... | --list | --clear --app-id <appId>...');
  process.exit(1);
}

const db = initDatabase(DB_PATH);
if (args.clear) {
  console.log(`Removed ${clearReanalyse(db, ids)} of ${ids.length} marks`);
} else if (ids.length) {
  // A wallet the database has never seen is probably a typo; it is marked
  // anyway, the pass simply never reaches an id outside its scope.
  const known = db.prepare('SELECT 1 FROM apps WHERE app_id = ? UNION SELECT 1 FROM analyses WHERE app_id = ?');
  for (const id of ids.filter(id => !known.get(id, id))) console.warn(`⚠ ${id} is not in the app list or the analyses: check the appId`);
  requestReanalyse(db, ids);
  console.log(`Marked ${ids.length} wallets; the next pass analyses them again`);
}
for (const r of reanalyseRequests(db)) console.log(`${r.app_id}\t${r.requested_at}`);
db.close();
