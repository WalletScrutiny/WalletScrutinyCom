// Size-change alerts fire once, when an asset first appears, and compare it
// only with releases published before it. Every pass refetches all releases.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveAsset } from '../ddbbUtils.mjs';
import { evaluateChangesInNewAsset } from '../utils.mjs';

const MB = 1024 * 1024;
const apk = (version, sizeMb, day) => ({
  version,
  assetName: 'Bravearm64Universal.apk',
  source: 'github',
  sha256: `sha-${version}`,
  size: sizeMb * MB,
  publishedAt: `2026-01-${String(day).padStart(2, '0')}T00:00:00Z`,
});

function freshDb() {
  return initDatabase(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-size-')), 'assets.db'));
}

function sizeAlerts(fn) {
  const lines = [];
  const original = console.log;
  console.log = (...args) => { lines.push(args.join(' ')); };
  try { fn(); } finally { console.log = original; }
  return lines.filter(l => l.includes('Asset size'));
}

function ingest(db, assets) {
  return sizeAlerts(() => {
    for (const asset of assets) {
      saveAsset(db, 'brave.browser', asset, evaluateChangesInNewAsset(db, 'brave.browser', asset));
    }
  });
}

test('a stored asset does not alert again on later passes', () => {
  const db = freshDb();
  const releases = [apk('v1.1', 200, 1), apk('v1.2', 200, 2), apk('v1.3', 272, 3)];
  assert.equal(ingest(db, releases).length, 1);
  assert.deepEqual(ingest(db, releases), []);
  assert.deepEqual(ingest(db, releases), []);
});

test('a release is compared with older releases, not newer ones', () => {
  const db = freshDb();
  ingest(db, [apk('v2.0', 272, 10), apk('v2.1', 272, 11)]);
  // An older release appearing late is in line with its own predecessors (none here).
  assert.deepEqual(ingest(db, [apk('v1.0', 150, 1)]), []);
});
