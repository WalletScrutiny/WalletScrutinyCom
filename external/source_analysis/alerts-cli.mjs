#!/usr/bin/env node
// The alerts a person has to look at (alerts.mjs).
// Usage: node alerts-cli.mjs                       list open alerts
//        node alerts-cli.mjs --all                 list every alert
//        node alerts-cli.mjs --deliver             send the undelivered ones now
//        node alerts-cli.mjs --set <confirmed|dismissed|open> --app <id> --advisory <id> [--subject <eco:name@v>] [--note "why"]
//   (SOURCE_ANALYSIS_DB_PATH selects the database)
import minimist from 'minimist';
import { initDatabase } from './ddbbUtils.mjs';
import { ensureAlertsTable, deliverAlerts, alertText } from './alerts.mjs';

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { boolean: ['all', 'deliver'], string: ['set', 'app', 'advisory', 'subject', 'note'] });
  const db = initDatabase();
  ensureAlertsTable(db);
  if (argv.set) {
    if (!['confirmed', 'dismissed', 'open'].includes(argv.set) || !argv.app || !argv.advisory) {
      console.error('--set needs confirmed|dismissed|open, --app and --advisory');
      process.exit(1);
    }
    const r = db.prepare(`UPDATE alerts SET status = ?, note = COALESCE(?, note) WHERE app_id = ? AND advisory = ? AND (? IS NULL OR subject = ?)`)
      .run(argv.set, argv.note || null, argv.app, argv.advisory, argv.subject || null, argv.subject || null);
    console.log(`${r.changes} alert(s) set to ${argv.set}`);
    process.exit(r.changes ? 0 : 1);
  }
  if (argv.deliver) console.log(JSON.stringify(await deliverAlerts(db)));
  const rows = db.prepare(`SELECT * FROM alerts ${argv.all ? '' : "WHERE status = 'open'"} ORDER BY first_seen DESC`).all();
  for (const a of rows) console.log(`[${a.status}${a.notified_at ? `, sent ${a.notified_at}` : ', not sent'}] ${alertText(a)}${a.note ? `\nNote: ${a.note}` : ''}\n`);
  if (!rows.length) console.log(argv.all ? 'no alerts' : 'no open alerts');
  process.exit(0);
}
