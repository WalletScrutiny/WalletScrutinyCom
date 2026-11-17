// Marks for a rerun (reanalyse-cli.mjs): the pass reanalyses a marked wallet
// and removes only the marks older than its start.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initDatabase, requestReanalyse, reanalyseRequests, clearReanalyse } from '../ddbbUtils.mjs';

test('a mark made before the wallet started is cleared, one made during its run stays', () => {
  const db = initDatabase(':memory:');
  db.prepare("INSERT INTO reanalyse_requests (app_id, requested_at) VALUES ('app.early', '2026-10-28 10:00:00'), ('app.late', '2026-10-28 12:00:00')").run();
  assert.equal(clearReanalyse(db, ['app.early', 'app.late'], '2026-10-28 11:00:00'), 1);
  assert.deepEqual(reanalyseRequests(db).map(r => r.app_id), ['app.late']);
});

test('marking twice keeps one row; clearing without a time removes it', () => {
  const db = initDatabase(':memory:');
  requestReanalyse(db, ['app.one', 'app.two']);
  requestReanalyse(db, ['app.one']);
  assert.deepEqual(reanalyseRequests(db).map(r => r.app_id).sort(), ['app.one', 'app.two']);
  assert.equal(clearReanalyse(db, ['app.one', 'app.none']), 1);
  assert.deepEqual(reanalyseRequests(db).map(r => r.app_id), ['app.two']);
});
