// One writer at a time (runLock.mjs): the advisory refresh skips while a pass
// holds the lock, a pass waits for it, a killed owner's lock is taken over.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { lockPathFor, tryLock, waitForLock } from '../runLock.mjs';

const tmpLock = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'runlock-')), 'assets.db.lock');

test('tryLock: a held lock reports its owner; release frees it', () => {
  const file = tmpLock();
  const pass = tryLock(file, { pid: 111, isAlive: () => true });
  assert.ok(pass.release);
  assert.equal(fs.readFileSync(file, 'utf8').trim(), '111');
  assert.deepEqual(tryLock(file, { pid: 222, isAlive: () => true }), { holder: 111 });
  pass.release();
  assert.equal(fs.existsSync(file), false);
  const refresh = tryLock(file, { pid: 222, isAlive: () => true });
  assert.ok(refresh.release);
  refresh.release();
});

test('tryLock: a lock whose owner is gone is taken over', () => {
  const file = tmpLock();
  fs.writeFileSync(file, '111\n');
  const r = tryLock(file, { pid: 222, isAlive: (pid) => pid !== 111 });
  assert.ok(r.release);
  assert.equal(fs.readFileSync(file, 'utf8').trim(), '222');
  r.release();
});

test('release does not remove a lock someone else took over', () => {
  const file = tmpLock();
  const r = tryLock(file, { pid: 111, isAlive: () => true });
  fs.writeFileSync(file, '333\n'); // 111 was presumed dead and 333 took over
  r.release();
  assert.equal(fs.readFileSync(file, 'utf8').trim(), '333');
});

test('waitForLock: a pass starts once the running refresh releases', async () => {
  const file = tmpLock();
  const refresh = tryLock(file, { pid: 111, isAlive: () => true });
  const lines = [];
  let started = false;
  const pass = waitForLock(file, { pid: 222, isAlive: () => true, pollMs: 10, log: { log: (l) => lines.push(l) } })
    .then(release => { started = true; return release; });
  await new Promise(r => setTimeout(r, 50));
  assert.equal(started, false);
  refresh.release();
  const release = await pass;
  assert.equal(fs.readFileSync(file, 'utf8').trim(), '222');
  assert.equal(lines.length, 1);
  release();
});

test('lockPathFor: next to the database', () => {
  assert.equal(lockPathFor('/var/lib/x/assets.db'), '/var/lib/x/assets.db.lock');
});
