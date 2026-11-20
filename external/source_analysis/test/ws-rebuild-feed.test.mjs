import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { importWsFeed, importRebuildClaims } from '../rebuildClaims.mjs';
import { initDatabase, getRebuildClaims } from '../ddbbUtils.mjs';

const feed = (rows, extra = {}) => ({ schema: 1, claimant: 'ws', generated: 'x', rows, ...extra });
const serve = (body, status = 200) => async () => ({ ok: status === 200, status, json: async () => body });

function freshDb() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wsfeed-'));
  const db = initDatabase(path.join(dir, 'a.db'));
  const pkg = db.prepare(`INSERT INTO packages (ecosystem, name, version) VALUES (?, ?, ?)`);
  pkg.run('npm', 'gopd', '1.2.0'); pkg.run('npm', 'color-name', '1.1.4');
  return { db, dir };
}

describe('our rebuilder\'s feed', () => {
  test('reproduced rows for versions we hold become ws claims with their date and note; others are left out', async () => {
    const { db, dir } = freshDb();
    const r = await importWsFeed(db, 'https://x/rebuilds.json', { fetchImpl: serve(feed([
      { ecosystem: 'npm', name: 'gopd', version: '1.2.0', result: 'reproduced', note: 'Byte-identical tarball', date: '2026-11-20', commit: 'a'.repeat(40) },
      { ecosystem: 'npm', name: 'color-name', version: '1.1.4', result: 'failed', note: 'line endings only', date: '2026-11-20' },
      { ecosystem: 'npm', name: 'nobody-ships-this', version: '1.0.0', result: 'reproduced' },
      { ecosystem: 'npm', name: 'gopd', version: '1.2.0', result: 'weird' },
      { ecosystem: 'rubygems', name: 'x', version: '1', result: 'reproduced' },
    ])) });
    assert.deepEqual(r, { claims: 1, failed: false });
    const claims = getRebuildClaims(db);
    assert.deepEqual(claims.get('npm\u0000gopd\u00001.2.0').map(c => [c.by, c.result, c.note, c.date]), [['ws', 'reproduced', 'Byte-identical tarball', '2026-11-20']]);
    assert.equal(claims.has('npm\u0000color-name\u00001.1.4'), false, 'our build not matching is no claim about the package');
    assert.equal(db.prepare(`SELECT count(*) AS n FROM package_rebuilds WHERE claimant = 'ws'`).get().n, 1, 'nor is it stored');
    assert.equal(claims.has('npm\u0000nobody-ships-this\u00001.0.0'), false);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('a newer feed replaces the claim; an unreachable or malformed feed changes nothing', async () => {
    const { db, dir } = freshDb();
    const row = (result) => ({ ecosystem: 'npm', name: 'gopd', version: '1.2.0', result, date: '2026-11-20' });
    await importWsFeed(db, 'u', { fetchImpl: serve(feed([{ ...row('reproduced'), note: 'All 7 files identical; tarball metadata differs' }])) });
    await importWsFeed(db, 'u', { fetchImpl: serve(feed([{ ...row('reproduced'), note: 'Byte-identical tarball' }])) });
    assert.deepEqual(getRebuildClaims(db).get('npm\u0000gopd\u00001.2.0').map(c => c.note), ['Byte-identical tarball']);
    const logs = [];
    for (const f of [serve({}, 503), serve({ schema: 2, rows: [] }), serve({ schema: 1, claimant: 'oss-rebuild', rows: [] }), async () => { throw new Error('offline'); }]) {
      const r = await importWsFeed(db, 'u', { fetchImpl: f, log: m => logs.push(m) });
      assert.deepEqual(r, { claims: 0, failed: true });
    }
    assert.equal(logs.length, 4);
    assert.equal(getRebuildClaims(db).get('npm\u0000gopd\u00001.2.0')[0].result, 'reproduced');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('a claim that left the feed is withdrawn; a rebuild of our own with its hash and event stays, and shows only when reproduced', async () => {
    const { db, dir } = freshDb();
    const row = (name, version, result) => ({ ecosystem: 'npm', name, version, result, date: '2026-11-20' });
    db.prepare(`INSERT INTO package_rebuilds (ecosystem, name, version, claimant, result, sha256, event) VALUES ('npm', 'color-name', '1.1.4', 'ws', 'reproduced', ?, '{}')`).run('f'.repeat(64));
    await importWsFeed(db, 'u', { fetchImpl: serve(feed([row('gopd', '1.2.0', 'reproduced')])) });
    assert.equal(getRebuildClaims(db).get('npm\u0000gopd\u00001.2.0')[0].result, 'reproduced');
    // what the feed carried until 2026-11-20: taken then, gone with the next import whatever the feed says
    db.prepare(`INSERT OR REPLACE INTO package_rebuilds (ecosystem, name, version, claimant, result, note) VALUES ('npm', 'gopd', '1.2.0', 'ws', 'failed', 'differs')`).run();
    assert.equal(getRebuildClaims(db).has('npm\u0000gopd\u00001.2.0'), false, 'not shown even before that import');
    const r = await importWsFeed(db, 'u', { fetchImpl: serve(feed([row('gopd', '1.2.0', 'failed')])) });
    assert.deepEqual(r, { claims: 0, failed: false });
    const claims = getRebuildClaims(db);
    assert.equal(claims.has('npm\u0000gopd\u00001.2.0'), false);
    assert.equal(db.prepare(`SELECT count(*) AS n FROM package_rebuilds WHERE name = 'gopd'`).get().n, 0, 'withdrawn, not only hidden');
    assert.equal(claims.get('npm\u0000color-name\u00001.1.4')[0].result, 'reproduced');
    db.prepare(`UPDATE package_rebuilds SET result = 'failed' WHERE name = 'color-name'`).run();
    assert.equal(getRebuildClaims(db).has('npm\u0000color-name\u00001.1.4'), false, 'a rebuild of rebuild-npm-cli.mjs that did not match is kept, not shown');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('importRebuildClaims reads the feed only when a URL is given', async () => {
    const { db, dir } = freshDb();
    let asked = 0;
    const fetchImpl = async (url) => {
      if (String(url).includes('rebuilds.json')) { asked++; return { ok: true, json: async () => feed([{ ecosystem: 'npm', name: 'gopd', version: '1.2.0', result: 'reproduced', date: '2026-11-20' }]) }; }
      return { ok: true, json: async () => ({ items: [] }) };
    };
    assert.equal((await importRebuildClaims(db, { fetchImpl })).wsClaims, 0);
    assert.equal(asked, 0);
    assert.equal((await importRebuildClaims(db, { fetchImpl, wsFeedUrl: 'https://x/rebuilds.json' })).wsClaims, 1);
    assert.equal(asked, 1);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
