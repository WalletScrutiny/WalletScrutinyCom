#!/usr/bin/env node
// List and delete rows of the ABS verifications database, so a build the ABS
// already attempted (and would skip) gets tried again, e.g. after a fix.
//
//   node scripts/verifications-db.mjs list <appId> [version]
//   node scripts/verifications-db.mjs delete <rowId>
//
// The database is the one the service uses (BUILD_SERVER_DB_PATH in
// walletscrutiny-build-server.service) unless BUILD_SERVER_DB_PATH or
// --db <path> says otherwise. Run it as the service user:
//
//   sudo -u build-server node scripts/verifications-db.mjs list com.example.wallet
//
// A row with endResult 'queued' belongs to a job the running ABS has not
// finished; deleting it does not stop that job.

import fs from 'fs';

const SERVICE_DB_PATH = '/var/lib/walletscrutiny-build-server/verifications.db';
const COLUMNS = ['id', 'appId', 'platform', 'version', 'arch', 'type', 'endResult', 'createdAt', 'updatedAt', 'buildScriptEventId', 'verificationId', 'assetKey'];

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(
    'Usage:\n' +
    '  node scripts/verifications-db.mjs [--db <path>] list <appId> [version]\n' +
    '  node scripts/verifications-db.mjs [--db <path>] delete <rowId>'
  );
  process.exit(1);
}

function printRows(rows) {
  const widths = COLUMNS.map(column =>
    Math.max(column.length, ...rows.map(row => String(row[column] ?? '').length)));
  const line = values => values.map((value, i) => String(value ?? '').padEnd(widths[i])).join('  ').trimEnd();
  console.log(line(COLUMNS));
  for (const row of rows) console.log(line(COLUMNS.map(column => row[column])));
}

const args = process.argv.slice(2);
let dbPath = process.env.BUILD_SERVER_DB_PATH ?? SERVICE_DB_PATH;
const dbFlag = args.indexOf('--db');
if (dbFlag !== -1) {
  dbPath = args[dbFlag + 1];
  if (!dbPath) usage('--db needs a path');
  args.splice(dbFlag, 2);
}
const [command, ...rest] = args;

// Opening a missing file would create an empty database and list nothing,
// which reads like "no rows" for the wrong reason.
if (dbPath !== ':memory:' && !fs.existsSync(dbPath)) {
  console.error(`Error: database not found: ${dbPath} (set --db or BUILD_SERVER_DB_PATH)`);
  process.exit(1);
}
process.env.BUILD_SERVER_DB_PATH = dbPath;
// ddbbUtils reads BUILD_SERVER_DB_PATH when it loads, so import it only now.
const { listByApp, getById, deleteById, closeDb } = await import('../ddbbUtils.mjs');

try {
  if (command === 'list') {
    const [appId, version] = rest;
    if (!appId || rest.length > 2) usage('list takes <appId> [version]');
    const rows = listByApp(appId, version);
    if (rows.length === 0) {
      console.log(`No rows for appId=${appId}${version ? ` version=${version}` : ''} in ${dbPath}`);
    } else {
      printRows(rows);
    }
  } else if (command === 'delete') {
    const [rowId] = rest;
    if (rest.length !== 1 || !/^\d+$/.test(rowId)) usage('delete takes one numeric <rowId>');
    const row = getById(Number(rowId));
    if (!row) {
      console.error(`Error: no row with id ${rowId} in ${dbPath}`);
      process.exitCode = 1;
    } else {
      deleteById(row.id);
      console.log('Deleted:');
      printRows([row]);
    }
  } else {
    usage(command ? `unknown command: ${command}` : undefined);
  }
} finally {
  closeDb();
}
