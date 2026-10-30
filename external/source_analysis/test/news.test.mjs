// news.json for the /news/ page: advisories of the last 14 days joined with
// the wallets whose newest working release, or a release of the last 6
// months, carries them.
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
    { ref: 'v3', status: 'failed', releasedAt: '2026-10-25', advisories: [adv('GHSA-failed')] },
    { ref: 'v2', status: 'ok', releasedAt: '2026-10-01', advisories: [adv('GHSA-new'), adv('GHSA-old'), adv('GHSA-alias', { aliases: ['CVE-2026-1'] }), adv('GHSA-undated')] },
    { ref: 'v1', status: 'ok', releasedAt: '2026-05-01', advisories: [adv('GHSA-recent-release', { version: '0.9.0' }), adv('GHSA-new', { version: '0.9.0' })] },
    { ref: 'v0', status: 'ok', releasedAt: '2026-04-28', advisories: [adv('GHSA-old-release')] },
    { ref: 'v-1', status: 'ok', advisories: [adv('GHSA-undated-release')] },
  ] },
  'b.wallet': { releases: [{ ref: '1.0', advisories: [adv('GHSA-new', { version: '1.0.1', scope: 'build' })] }] },
  'c.wallet': { releases: [] },
};
const index = { apps: Object.keys(apps).map(appId => ({ appId })) };
const signals = { published: {
  'GHSA-new': '2026-10-28', 'GHSA-old': '2026-10-15', 'CVE-2026-1': '2026-10-16', 'GHSA-alias': '2026-10-20',
  'GHSA-failed': '2026-10-28', 'GHSA-recent-release': '2026-10-27', 'GHSA-old-release': '2026-10-28', 'GHSA-undated-release': '2026-10-28',
} };

test('newsOf keeps the last 14 days of the newest working release and of releases of the last 6 months', () => {
  const news = newsOf({ index, appDoc: id => apps[id], signals, now });
  assert.equal(news.since, '2026-10-16');
  assert.equal(news.releasesSince, '2026-04-29');
  // GHSA-old is a day too old, GHSA-undated has no date; v3 failed; v0 is older than 6 months, v-1 has no date
  assert.deepEqual(news.advisories.map(a => [a.id, a.published]), [['GHSA-new', '2026-10-28'], ['GHSA-recent-release', '2026-10-27'], ['GHSA-alias', '2026-10-16']]);
  assert.deepEqual(news.advisories[0].wallets, [
    { appId: 'a.wallet', releases: [
      { ref: 'v2', releasedAt: '2026-10-01', newest: true, version: '1.0.0', scope: 'app', direct: false },
      { ref: 'v1', releasedAt: '2026-05-01', newest: false, version: '0.9.0', scope: 'app', direct: false },
    ] },
    { appId: 'b.wallet', releases: [{ ref: '1.0', releasedAt: null, newest: true, version: '1.0.1', scope: 'build', direct: false }] },
  ]);
  assert.deepEqual(news.advisories[1].wallets[0].releases.map(r => [r.ref, r.newest]), [['v1', false]]);
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
    assert.deepEqual(buildNews({ exportDir: dir, now }), { written: true, advisories: 3, wallets: 2 });
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'news.json'), 'utf8')).advisories.length, 3);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('newsOf carries the affected ranges and fixed versions, from any release that has them', () => {
  const docs = {
    'a.wallet': { releases: [
      { ref: 'v2', status: 'ok', releasedAt: '2026-10-01', advisories: [adv('GHSA-new')] },
      { ref: 'v1', status: 'ok', releasedAt: '2026-09-01', advisories: [adv('GHSA-new', { affected: ['< 1.2.0'], fixed: ['1.2.0'] })] },
    ] },
  };
  const news = newsOf({ index: { apps: [{ appId: 'a.wallet' }] }, appDoc: id => docs[id], signals, now });
  assert.deepEqual([news.advisories[0].affected, news.advisories[0].fixed], [['< 1.2.0'], ['1.2.0']]);
});
