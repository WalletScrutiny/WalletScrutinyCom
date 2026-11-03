#!/usr/bin/env node
// Import other projects' rebuild claims (rebuildClaims.mjs) for every package
// version in the database: Google's OSS Rebuild (npm, PyPI, crates.io) and
// Reproducible Central (Maven). The pass does this too (index.mjs).
// Usage: node rebuild-claims-cli.mjs [--all] [--no-rc]
//   --all    ask OSS Rebuild again for names looked up in the last week
//   --no-rc  skip Reproducible Central (no checkout update)
// SOURCE_ANALYSIS_DB_PATH selects the database, SOURCE_ANALYSIS_RC_DIR the checkout.
import minimist from 'minimist';
import { initDatabase } from './ddbbUtils.mjs';
import { importRebuildClaims, syncReproducibleCentral } from './rebuildClaims.mjs';
import { RC_DIR } from './config.mjs';

const argv = minimist(process.argv.slice(2), { boolean: ['all', 'rc'], default: { rc: true } });
const db = initDatabase();
const rcDir = argv.rc ? syncReproducibleCentral(RC_DIR) : null;
const stats = await importRebuildClaims(db, { all: argv.all, rcDir, log: console.error });
console.log(JSON.stringify(stats, null, 2));
process.exit(stats.failed ? 2 : 0);
