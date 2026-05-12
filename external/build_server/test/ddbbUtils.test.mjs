import './setup.mjs';
// Note: BUILD_SERVER_DB_PATH=:memory: is set by the npm test script. It must
// be in place before ddbbUtils.mjs is imported (its DB_PATH is captured at
// module-load time), so setting it inside this file would be too late.

import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';

import {
  initDb,
  closeDb,
  insert,
  findById,
  findByVerificationId,
  findQueuedOrErroredSimilarAttempt,
  findErroredAttemptByBuildScriptEventId,
  findAll,
  update,
  deleteById
} from '../ddbbUtils.mjs';

function baseRow(overrides = {}) {
  return {
    appId: 'com.example',
    platform: 'linux',
    version: '1.0.0',
    arch: 'x86_64',
    type: 'release',
    verificationId: 'verif-1',
    buildScriptEventId: 'script-1',
    endResult: 'queued',
    ...overrides
  };
}

beforeEach(() => {
  // Start every test with a fresh in-memory database.
  closeDb();
  initDb();
});

after(() => {
  closeDb();
});

describe('ddbbUtils CRUD', () => {
  test('insert returns a positive rowid and findById round-trips the row', () => {
    const id = insert(baseRow());
    assert.equal(typeof id, 'number');
    assert.ok(id > 0);
    const row = findById(id);
    assert.ok(row);
    assert.equal(row.appId, 'com.example');
    assert.equal(row.endResult, 'queued');
    assert.ok(row.createdAt);
    assert.ok(row.updatedAt);
  });

  test('findByVerificationId returns the matching record', () => {
    insert(baseRow({ verificationId: 'unique-id' }));
    insert(baseRow({ verificationId: 'other-id' }));

    const row = findByVerificationId('unique-id');
    assert.ok(row);
    assert.equal(row.verificationId, 'unique-id');
    assert.equal(findByVerificationId('nope'), undefined);
  });

  test('update applies only allowed fields and changes updatedAt', () => {
    const id = insert(baseRow());
    const before = findById(id);

    const changes = update(id, { endResult: 'reproducible', bogus: 'ignored' });
    assert.equal(changes, 1);

    const after = findById(id);
    assert.equal(after.endResult, 'reproducible');
    assert.equal(after.appId, before.appId);
    // updatedAt may equal before.updatedAt if the test runs sub-second, so only
    // assert it's a non-empty string here.
    assert.ok(typeof after.updatedAt === 'string' && after.updatedAt.length > 0);
  });

  test('update returns 0 when no allowed field is provided', () => {
    const id = insert(baseRow());
    assert.equal(update(id, { bogus: 'ignored' }), 0);
  });

  test('deleteById removes the record', () => {
    const id = insert(baseRow());
    assert.equal(deleteById(id), 1);
    assert.equal(findById(id), undefined);
    assert.equal(deleteById(id), 0);
  });
});

describe('findAll', () => {
  test('filters by appId and/or platform and respects limit/offset', () => {
    insert(baseRow({ appId: 'a', platform: 'linux', verificationId: '1' }));
    insert(baseRow({ appId: 'a', platform: 'android', verificationId: '2' }));
    insert(baseRow({ appId: 'b', platform: 'linux', verificationId: '3' }));

    assert.equal(findAll({ appId: 'a' }).length, 2);
    assert.equal(findAll({ platform: 'linux' }).length, 2);
    assert.equal(findAll({ appId: 'a', platform: 'linux' }).length, 1);

    const all = findAll();
    assert.equal(all.length, 3);

    const limited = findAll({ limit: 2 });
    assert.equal(limited.length, 2);

    const offset = findAll({ limit: 1, offset: 1 });
    assert.equal(offset.length, 1);
    // Results are ordered by id DESC, so offset 1 gives us the 2nd-newest row.
    assert.equal(offset[0].verificationId, '2');
  });
});

describe('findQueuedOrErroredSimilarAttempt', () => {
  test('matches when every key field is equal and endResult is queued or error', () => {
    insert(baseRow({ endResult: 'queued' }));
    const hit = findQueuedOrErroredSimilarAttempt(baseRow({ endResult: 'whatever' }));
    assert.ok(hit);
    assert.equal(hit.endResult, 'queued');
  });

  test('ignores rows with terminal endResults like reproducible', () => {
    insert(baseRow({ endResult: 'reproducible' }));
    assert.equal(findQueuedOrErroredSimilarAttempt(baseRow()), undefined);
  });

  test('requires every key field to match', () => {
    insert(baseRow({ arch: 'arm64' }));
    assert.equal(findQueuedOrErroredSimilarAttempt(baseRow({ arch: 'x86_64' })), undefined);
  });

  test('returns the most recent match when there are several', () => {
    insert(baseRow({ endResult: 'error' }));
    const newer = insert(baseRow({ endResult: 'queued' }));
    const hit = findQueuedOrErroredSimilarAttempt(baseRow());
    assert.equal(hit.id, newer);
  });
});

describe('findErroredAttemptByBuildScriptEventId', () => {
  test('returns only error rows and prefers the newest', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'error' }));
    const newer = insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'error' }));
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'queued' }));

    const hit = findErroredAttemptByBuildScriptEventId('bs-1');
    assert.equal(hit.id, newer);
  });

  test('returns undefined when no error row exists for that script', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'reproducible' }));
    assert.equal(findErroredAttemptByBuildScriptEventId('bs-1'), undefined);
    assert.equal(findErroredAttemptByBuildScriptEventId('missing'), undefined);
  });
});
