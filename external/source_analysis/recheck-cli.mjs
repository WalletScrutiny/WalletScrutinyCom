#!/usr/bin/env node
// Re-score the stored releases: ask OSV.dev again about every stored
// dependency and replace the advisories saved with them. This is how a fix in
// the advisory lookup (the analyser) reaches rows saved earlier, without
// cloning or building anything.
// Usage: node recheck-cli.mjs [--app <appId>]... [--deliver]
//   (SOURCE_ANALYSIS_DB_PATH selects the database; alerts for possible malware
//   are recorded but only sent to people with --deliver)
import minimist from 'minimist';
import { initDatabase, backupDatabase } from './ddbbUtils.mjs';
import { DB_PATH } from './config.mjs';
import { recheckStoredReleases } from './recheck.mjs';

const args = minimist(process.argv.slice(2), { string: ['app'], boolean: ['deliver'] });
backupDatabase(DB_PATH);
const db = initDatabase(DB_PATH);
const apps = args.app ? [].concat(args.app) : db.prepare('SELECT DISTINCT app_id FROM app_dependencies ORDER BY app_id').all().map(r => r.app_id);
const result = await recheckStoredReleases(db, apps, args.deliver ? {} : { deliver: async () => {} });
console.log(`${apps.length} apps, ${result.releases} releases looked up again, ${result.failed} failed, ${result.added} new advisories`);
db.close();
process.exit(result.failed ? 1 : 0);
