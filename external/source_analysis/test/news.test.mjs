// news.json for the /news/ page: advisories of the last 14 days joined with
// the wallets whose newest working release, or a release of the last 6
// months, carries them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { buildNews, newsOf, affectedRanges } from '../news.mjs';
import { initDatabase, saveVulnerabilities } from '../ddbbUtils.mjs';

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

// The app files leave the ranges out (export.mjs): the database has them.
test('newsOf takes the affected ranges from the database when the app file has none', () => {
  const db = initDatabase(':memory:');
  saveVulnerabilities(db, 'b.wallet', 'v9', { findings: [
    { ecosystem: 'npm', name: 'lib', version: '1.0.0', id: 'GHSA-new', aliases: [], severity: 'high', summary: '', fixed: ['1.2.0'], affected: ['< 1.2.0'], direct: true, dev: false },
    { ecosystem: 'npm', name: 'other', version: '1.0.0', id: 'GHSA-old', aliases: [], severity: 'high', summary: '', fixed: [], direct: true, dev: false },
  ] });
  saveVulnerabilities(db, 'b.wallet', 'v8', { findings: [
    { ecosystem: 'npm', name: 'lib', version: '0.9.0', id: 'GHSA-new', aliases: [], severity: 'high', summary: '', fixed: ['1.2.0'], affected: ['< 1.0.0'], direct: true, dev: false },
  ] });
  const affectedOf = affectedRanges(db);
  const row = { id: 'GHSA-new', ecosystem: 'npm', package: 'lib', version: '1.0.0' };
  assert.deepEqual(affectedOf(row, { appId: 'b.wallet', ref: 'v9' }), ['< 1.2.0']);
  assert.deepEqual(affectedOf({ ...row, version: '0.9.0' }, { appId: 'b.wallet', ref: 'v8' }), ['< 1.0.0'], 'the ranges stored with that release\'s row, not another version\'s');
  assert.equal(affectedOf(row, { appId: 'a.wallet', ref: 'v9' }), undefined, 'not another wallet\'s row');
  assert.equal(affectedOf({ id: 'GHSA-old', ecosystem: 'npm', package: 'other', version: '1.0.0' }, { appId: 'b.wallet', ref: 'v9' }), undefined, 'a row stored without ranges');
  // as the app file has them now: no ranges; the older release's row has none either, the newer one's does
  const docs = { 'b.wallet': { releases: [
    { ref: 'v10', status: 'ok', releasedAt: '2026-10-20', advisories: [adv('GHSA-new', { fixed: ['1.2.0'] })] },
    { ref: 'v9', status: 'ok', releasedAt: '2026-10-01', advisories: [adv('GHSA-new', { fixed: ['1.2.0'] })] },
  ] } };
  const news = newsOf({ index: { apps: [{ appId: 'b.wallet' }] }, appDoc: id => docs[id], signals, affectedOf, now });
  assert.deepEqual([news.advisories[0].affected, news.advisories[0].fixed], [['< 1.2.0'], ['1.2.0']], 'from any release that has them, as before');

  // buildNews hands the database on
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'news-db-'));
  try {
    fs.mkdirSync(path.join(dir, 'apps'));
    fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify({ apps: [{ appId: 'b.wallet' }] }));
    fs.writeFileSync(path.join(dir, 'apps', 'b.wallet.json'), JSON.stringify(docs['b.wallet']));
    fs.writeFileSync(path.join(dir, 'signals.json'), JSON.stringify(signals));
    buildNews({ exportDir: dir, db, now });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'news.json'), 'utf8')).advisories[0].affected, ['< 1.2.0']);
    buildNews({ exportDir: dir, now });
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'news.json'), 'utf8')).advisories[0].affected, undefined, 'without the database there is nowhere to read them');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  db.close();
});

test('a wallet is listed only when the advisory is in one of its apps', () => {
  const now = new Date('2026-10-10T00:00:00Z');
  const signals = { published: { 'GHSA-server': '2026-10-09', 'GHSA-phone': '2026-10-09', 'GHSA-both': '2026-10-09' } };
  const row = (id, targets) => ({ id, severity: 'high', ecosystem: 'npm', package: id, version: '1.0.0', targets });
  const releases = [{ ref: 'v1', status: 'ok', advisories: [row('GHSA-server', ['server']), row('GHSA-phone', ['android']), row('GHSA-both', ['server', 'shared'])] }];
  const docs = {
    phone: { aliases: [{ appId: 'phone', platform: 'android' }], releases },
    desktop: { aliases: [{ appId: 'desktop', platform: 'desktop' }], releases },
    bearer: { aliases: [{ appId: 'bearer', platform: 'bearer' }], releases },
    old: { aliases: [{ appId: 'old' }], releases },
  };
  const news = newsOf({ index: { apps: Object.keys(docs).map(appId => ({ appId })) }, appDoc: id => docs[id], signals, now });
  const walletsOf = id => news.advisories.find(a => a.id === id).wallets.map(w => w.appId);
  assert.deepEqual(walletsOf('GHSA-server'), ['bearer', 'old'], 'no page says it builds the server; platforms with no list and old exports stay unfiltered');
  assert.deepEqual(walletsOf('GHSA-phone'), ['bearer', 'old', 'phone']);
  assert.deepEqual(walletsOf('GHSA-both'), ['bearer', 'desktop', 'old', 'phone'], 'also in a shared file');
});
