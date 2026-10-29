// news.json for the /news/ page: advisories of the last 14 days joined with
// the wallets whose newest working release carries them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { buildNews, newsOf } from '../news.mjs';

const now = new Date('2026-10-29T12:00:00Z');
const adv = (id, extra = {}) => ({ id, aliases: [], severity: 'high', summary: `${id} summary`, ecosystem: 'npm', package: 'lib', version: '1.0.0', scope: 'app', direct: false, ...extra });

const apps = {
  'a.wallet': { releases: [
    { ref: 'v3', status: 'failed', advisories: [adv('GHSA-failed')] },
    { ref: 'v2', status: 'ok', advisories: [adv('GHSA-new'), adv('GHSA-old'), adv('GHSA-alias', { aliases: ['CVE-2026-1'] }), adv('GHSA-undated')] },
    { ref: 'v1', status: 'ok', advisories: [adv('GHSA-older-release')] },
  ] },
  'b.wallet': { releases: [{ ref: '1.0', advisories: [adv('GHSA-new', { version: '1.0.1', scope: 'build' })] }] },
  'c.wallet': { releases: [] },
};
const index = { apps: Object.keys(apps).map(appId => ({ appId })) };
const signals = { published: {
  'GHSA-new': '2026-10-28', 'GHSA-old': '2026-10-15', 'CVE-2026-1': '2026-10-16', 'GHSA-alias': '2026-10-20',
  'GHSA-failed': '2026-10-28', 'GHSA-older-release': '2026-10-28',
} };

test('newsOf keeps the last 14 days of the newest working release, newest first', () => {
  const news = newsOf({ index, appDoc: id => apps[id], signals, now });
  assert.equal(news.since, '2026-10-16');
  // GHSA-old is a day too old, GHSA-undated has no date; v3 failed and v1 is not the newest
  assert.deepEqual(news.advisories.map(a => [a.id, a.published]), [['GHSA-new', '2026-10-28'], ['GHSA-alias', '2026-10-16']]);
  assert.deepEqual(news.advisories[0].wallets, [
    { appId: 'a.wallet', release: 'v2', version: '1.0.0', scope: 'app', direct: false },
    { appId: 'b.wallet', release: '1.0', version: '1.0.1', scope: 'build', direct: false },
  ]);
});

test('newsOf returns null without publication dates', () => {
  assert.equal(newsOf({ index, appDoc: id => apps[id], signals: { epss: {} }, now }), null);
  assert.equal(newsOf({ index, appDoc: id => apps[id], signals: null, now }), null);
});

test('buildNews writes news.json next to signals.json, and nothing without it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'news-'));
  try {
    fs.mkdirSync(path.join(dir, 'apps'));
    fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(index));
    for (const [id, doc] of Object.entries(apps)) fs.writeFileSync(path.join(dir, 'apps', `${id}.json`), JSON.stringify({ appId: id, ...doc }));
    assert.deepEqual(buildNews({ exportDir: dir, now }), { written: false, advisories: 0, wallets: 0 });
    assert.ok(!fs.existsSync(path.join(dir, 'news.json')));
    fs.writeFileSync(path.join(dir, 'signals.json'), JSON.stringify(signals));
    assert.deepEqual(buildNews({ exportDir: dir, now }), { written: true, advisories: 2, wallets: 2 });
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'news.json'), 'utf8')).advisories.length, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
