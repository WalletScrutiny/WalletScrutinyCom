#!/usr/bin/env node
// dep-rebuilder: rebuild the dependency versions WalletScrutiny wallets ship,
// the most shared first, every build inside a sandbox (see sandbox.mjs and
// README.md). Its database is its own; it reads the published dependency
// export and never touches source_analysis's database.
//
//   node index.mjs sync   [--export URL|DIR] [--releases all|latest]   read the export, count wallets per package version
//   node index.mjs list   [--top N] [--scope app|any]                  what would be built next
//   node index.mjs run    [--top N] [--retry] [--scope app|any] [--min-wallets N] [--package name@version]...
//   node index.mjs serve  [--scope app|any] [--min-wallets N]         unattended: sync daily, rebuild one version at a time, forever (the systemd service)
//   node index.mjs site   [--out DIR] [--publish]                      write rebuilds.json for the website; --publish also copies it (DEP_REBUILDER_PUBLISH_TARGET)
//   node index.mjs status                                               tally of results
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { openDb, saveCandidates, pending, saveRebuild, tally, WORK_DIR, DB_PATH, DATA_DIR } from './db.mjs';
import { serveLoop } from './worker.mjs';
import { removeStaleContainers } from './sandbox.mjs';
import { writeFeed, publishFeed } from './site-export.mjs';
import { collectCandidates, EXPORT_BASE } from './candidates.mjs';
import { syncGoogle } from './google.mjs';
import { rebuildNpm, sourceOf } from './rebuild.mjs';

// Rootful podman would make a container escape a root compromise of this host.
if (process.getuid() === 0 && !process.env.DEP_REBUILDER_ALLOW_ROOT) {
  console.error('Refusing to run as root: start it as an unprivileged user with rootless podman (README.md). DEP_REBUILDER_ALLOW_ROOT=1 overrides, for tests only.');
  process.exit(1);
}
// A system service has no login session; rootless podman needs the user's runtime directory (lingering user, README).
if (!process.env.XDG_RUNTIME_DIR) process.env.XDG_RUNTIME_DIR = `/run/user/${process.getuid()}`;
const argv = minimist(process.argv.slice(2), { boolean: ['retry'], string: ['package', 'scope', 'export', 'releases', 'out'], default: { top: 10, scope: 'app', releases: 'all' } });
const cmd = argv._[0];
const db = openDb();

/**
 * Rebuild one candidate in the sandbox, keep its log, save the result. Throws when the registry
 * or network cannot be reached, and when the run was told to stop while a build that did not
 * reproduce was going on: a shutdown takes the container down with it, and that is not the
 * package failing.
 */
async function rebuildAndSave(c, { interrupted = () => false } = {}) {
  const label = `${c.name}@${c.version}`;
  fs.mkdirSync(path.join(WORK_DIR, 'logs'), { recursive: true });
  const source = await sourceOf(db, c.name, c.version);
  const r = await rebuildNpm({ name: c.name, version: c.version, source, workRoot: WORK_DIR });
  const kept = path.join(WORK_DIR, 'logs', `${label.replace(/[^a-zA-Z0-9.@-]/g, '_')}.log`);
  const scratch = path.dirname(r.log);
  if (fs.existsSync(r.log)) { fs.copyFileSync(r.log, kept); r.log = kept; }
  fs.rmSync(scratch, { recursive: true, force: true }); // the log is kept, the tarball and checkout are not
  if (r.result !== 'reproduced' && interrupted()) throw new Error('stopped while it was building, so this result is not kept');
  saveRebuild(db, r);
  console.log(`${r.result === 'reproduced' ? '✓' : '✗'} ${label}${c.wallets ? ` (${c.wallets} wallets)` : ''} ${r.seconds}s: ${r.note}`);
  return r;
}

async function syncAll() {
  const rows = await collectCandidates({ base: argv.export || EXPORT_BASE, releases: argv.releases, log: console.error });
  saveCandidates(db, rows);
  const g = await syncGoogle(db, { log: console.error });
  return { candidates: rows.length, google: g, ...tally(db) };
}

if (cmd === 'sync') {
  console.log(JSON.stringify({ db: DB_PATH, ...await syncAll() }));
} else if (cmd === 'list') {
  for (const c of pending(db, { limit: Number(argv.top), scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1) })) console.log(`${c.wallets}\t${c.name}@${c.version}`);
} else if (cmd === 'run') {
  const wanted = [].concat(argv.package || []).map(s => { const at = s.lastIndexOf('@'); return { name: s.slice(0, at), version: s.slice(at + 1), wallets: null }; });
  const todo = wanted.length ? wanted : pending(db, { limit: Number(argv.top), retry: argv.retry, scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1) });
  fs.mkdirSync(path.join(WORK_DIR, 'logs'), { recursive: true });
  let stop = false;
  for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { stop = true; console.error('stopping after this package'); });
  const count = {};
  for (const c of todo) {
    if (stop) break;
    try { const r = await rebuildAndSave(c, { interrupted: () => stop }); count[r.result] = (count[r.result] || 0) + 1; }
    catch (e) { count.error = (count.error || 0) + 1; console.error(`! ${c.name}@${c.version}: ${e.message}`); }
  }
  console.log(JSON.stringify(count));
} else if (cmd === 'serve') {
  let stop = false, wake = null;
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stop = true; console.error('stopping after the current package'); wake?.(); });
  const removed = removeStaleContainers();
  if (removed) console.error(`removed ${removed} container(s) left by an earlier run`);
  await serveLoop({
    db, sync: syncAll, step: (c) => rebuildAndSave(c, { interrupted: () => stop }), log: (m) => console.error(m),
    publish: process.env.DEP_REBUILDER_PUBLISH_TARGET ? async () => publishFeed(db, path.join(DATA_DIR, 'site')) : null,
    scope: argv.scope, minWallets: Number(argv['min-wallets'] || 1),
    shouldStop: () => stop,
    sleep: (ms) => new Promise(res => { if (stop) return res(); const t = setTimeout(res, ms); wake = () => { clearTimeout(t); res(); }; }),
  });
} else if (cmd === 'site') {
  const dir = argv.out || path.join(DATA_DIR, 'site');
  console.log(JSON.stringify(argv.publish ? publishFeed(db, dir) : { rows: writeFeed(db, dir), dir }));
} else if (cmd === 'status') {
  console.log(JSON.stringify(tally(db), null, 2));
} else {
  console.error(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 12).join('\n'));
  process.exit(1);
}
