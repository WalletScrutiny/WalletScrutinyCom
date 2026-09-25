#!/usr/bin/env node

/**
 * zapstoreCheck.mjs
 *
 * Walks `_mobile/` markdown files with an `android.appId` and checks whether Zapstore
 * lists the app. Zapstore is not limited to open source, so every verdict is checked.
 *
 * Zapstore's web page (https://zapstore.dev/apps/<appId>) answers 200 even for unknown
 * ids, so the check asks the Zapstore relay instead: an app is listed when the relay
 * holds its app event (NIP-82, kind 32267, `d` tag = appId).
 *
 * When Zapstore lists the app, `zapstore` is added to `android.alternativeStores`:
 *   alternativeStores:
 *   - zapstore
 * When a file lists zapstore but the relay no longer has the app, it is removed again
 * (and the key with it, if nothing else is left). Ids whose query failed are left alone,
 * and nothing is removed at all when the relay returned no app for any id.
 *
 * Usage:
 *   node scripts/zapstoreCheck.mjs [--dry-run]
 *
 * Options:
 *   --dry-run   Do not write .md files; only report
 *
 * Environment:
 *   DEBUG_ZAPSTORE_CHECK   When set, also print rows with outcome not_listed
 *
 * TSV columns (stdout): outcome, file, appId, zapstoreUrl, fileWrite, detail
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { readAndroidAlternativeStores, setAndroidAlternativeStore } from './alternativeStoresFrontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const MOBILE_DIR = path.join(REPO_ROOT, '_mobile');

const ZAPSTORE_RELAY = 'wss://relay.zapstore.dev';
const ZAPSTORE_APP_KIND = 32267;
const IDS_PER_REQUEST = 100;
const REQUEST_TIMEOUT_MS = 30000;

const DEBUG_ZAPSTORE_CHECK = process.env.DEBUG_ZAPSTORE_CHECK !== undefined;

function zapstoreUrl(appId) {
  return `https://zapstore.dev/apps/${appId}`;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return null;
  try {
    return yaml.load(m[1], { schema: yaml.FAILSAFE_SCHEMA });
  } catch {
    return null;
  }
}

/**
 * Asks the relay which of `appIds` have an app event. Resolves to the set of listed ids;
 * rejects on connection errors, a CLOSED reply or a timeout, so a failed query never
 * reads as "not listed".
 */
function queryListedAppIds(appIds) {
  return new Promise((resolve, reject) => {
    const listed = new Set();
    const subId = `ws-zapstore-${Date.now()}`;
    const ws = new WebSocket(ZAPSTORE_RELAY);
    const timer = setTimeout(() => finish(new Error('timeout')), REQUEST_TIMEOUT_MS);
    let done = false;
    function finish(err) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { ws.close(); } catch { /* already closed */ }
      if (err) reject(err);
      else resolve(listed);
    }
    ws.onopen = () => {
      ws.send(JSON.stringify(['REQ', subId, { kinds: [ZAPSTORE_APP_KIND], '#d': appIds }]));
    };
    ws.onmessage = (msg) => {
      let data;
      try {
        data = JSON.parse(msg.data);
      } catch {
        return;
      }
      if (data[1] !== subId) return;
      if (data[0] === 'EVENT') {
        const d = data[2]?.tags?.find((t) => t[0] === 'd')?.[1];
        if (d) listed.add(d);
      } else if (data[0] === 'EOSE') {
        finish();
      } else if (data[0] === 'CLOSED') {
        finish(new Error(`relay closed the request: ${data[2] ?? ''}`));
      }
    };
    ws.onerror = (e) => finish(new Error(e.message || 'websocket error'));
    ws.onclose = () => finish(new Error('connection closed before EOSE'));
  });
}

function collectRows() {
  const rows = [];
  for (const name of fs.readdirSync(MOBILE_DIR).sort()) {
    if (!name.endsWith('.md')) continue;
    const absPath = path.join(MOBILE_DIR, name);
    const content = fs.readFileSync(absPath, 'utf8');
    const appId = parseFrontmatter(content)?.android?.appId;
    if (typeof appId !== 'string' || !appId.trim()) continue;
    rows.push({
      absPath,
      file: path.relative(REPO_ROOT, absPath),
      appId: appId.trim(),
      hadZapstore: readAndroidAlternativeStores(content).includes('zapstore'),
      outcome: 'pending',
      fileWrite: '',
      detail: ''
    });
  }
  return rows;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const rows = collectRows();

  const appIds = [...new Set(rows.map((r) => r.appId))];
  const listed = new Set();
  const failed = new Map();
  for (let i = 0; i < appIds.length; i += IDS_PER_REQUEST) {
    const chunk = appIds.slice(i, i + IDS_PER_REQUEST);
    try {
      for (const id of await queryListedAppIds(chunk)) listed.add(id);
    } catch (err) {
      for (const id of chunk) failed.set(id, err.message);
    }
  }

  for (const r of rows) {
    if (failed.has(r.appId)) {
      r.outcome = 'query_error';
      r.detail = failed.get(r.appId);
    } else {
      r.outcome = listed.has(r.appId) ? 'listed' : 'not_listed';
    }
  }

  // An empty answer for every id means the relay is broken, not that Zapstore emptied out.
  const allowRemoval = listed.size > 0;
  const counts = { added: 0, removed: 0, errors: 0 };
  for (const r of rows) {
    let want;
    if (r.outcome === 'listed') want = true;
    else if (r.outcome === 'not_listed' && r.hadZapstore && allowRemoval) want = false;
    else continue;
    try {
      const content = fs.readFileSync(r.absPath, 'utf8');
      const res = setAndroidAlternativeStore(content, 'zapstore', want);
      if (res.status === 'added' || res.status === 'removed') {
        if (!dryRun) fs.writeFileSync(r.absPath, res.content, 'utf8');
        counts[res.status]++;
        r.fileWrite = dryRun ? `would_${res.status === 'added' ? 'add' : 'remove'}` : res.status;
      } else {
        r.fileWrite = res.status;
        if (res.status !== 'unchanged') counts.errors++;
      }
    } catch (err) {
      r.fileWrite = 'write_error';
      r.detail = err.message;
      counts.errors++;
    }
  }

  for (const r of rows) {
    if (r.outcome === 'not_listed' && !r.fileWrite && !DEBUG_ZAPSTORE_CHECK) continue;
    console.log([r.outcome, r.file, r.appId, zapstoreUrl(r.appId), r.fileWrite, r.detail]
      .map((c) => String(c).replace(/\t/g, ' ')).join('\t'));
  }

  const verb = dryRun ? 'would be ' : '';
  console.error('');
  console.error(
    `Summary: ${rows.filter((r) => r.outcome === 'listed').length} listed on Zapstore, ` +
      `${rows.filter((r) => r.outcome === 'not_listed').length} not listed, ${failed.size} query errors, ` +
      `${rows.length} Android apps scanned under _mobile/. ` +
      `zapstore ${verb}added: ${counts.added}, ${verb}removed: ${counts.removed}, file errors: ${counts.errors}.` +
      (allowRemoval ? '' : ' Removal skipped: the relay listed no app at all.')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
