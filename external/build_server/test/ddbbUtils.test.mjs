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
  findQueuedOrErroredSimilarAttempt,
  findErroredAttemptForBuildScript,
  markStaleQueuedAttemptsAsInterrupted,
  update,
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
  test('insert returns a positive rowid and stores the row', () => {
    const id = insert(baseRow());
    assert.equal(typeof id, 'number');
    assert.ok(id > 0);

    const row = findQueuedOrErroredSimilarAttempt(baseRow());
    assert.ok(row);
    assert.equal(row.id, id);
    assert.equal(row.appId, 'com.example');
    assert.equal(row.endResult, 'queued');
    assert.ok(row.createdAt);
    assert.ok(row.updatedAt);
  });

  test('update applies only allowed fields and clears queued/error lookup', () => {
    const id = insert(baseRow());

    const changes = update(id, { endResult: 'reproducible', bogus: 'ignored' });
    assert.equal(changes, 1);

    assert.equal(findQueuedOrErroredSimilarAttempt(baseRow()), undefined);
  });

  test('update returns 0 when no allowed field is provided', () => {
    const id = insert(baseRow());
    assert.equal(update(id, { bogus: 'ignored' }), 0);
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

describe('findErroredAttemptForBuildScript', () => {
  test('returns only error rows and prefers the newest', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'error' }));
    const newer = insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'error' }));
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'queued' }));

    const hit = findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1' }));
    assert.equal(hit.id, newer);
  });

  test('returns undefined when no error row exists for that script', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'reproducible' }));
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1' })), undefined);
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'missing' })), undefined);
  });

  test('a script that failed for one wallet version is not blocked for another version', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', version: '1.0.0', endResult: 'error' }));

    assert.ok(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', version: '1.0.0' })));
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', version: '1.1.0' })), undefined);
  });

  test('ignores the verificationId but requires app, platform, arch and type to match', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', verificationId: 'verif-1', endResult: 'error' }));

    assert.ok(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', verificationId: 'verif-2' })));
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', appId: 'com.other' })), undefined);
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', platform: 'android' })), undefined);
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', arch: 'arm64' })), undefined);
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', type: 'debug' })), undefined);
  });
});

describe('markStaleQueuedAttemptsAsInterrupted', () => {
  test('flips every queued row to interrupted and leaves the rest alone', () => {
    insert(baseRow({ endResult: 'queued' }));
    insert(baseRow({ endResult: 'queued', version: '2.0.0' }));
    insert(baseRow({ endResult: 'error', version: '3.0.0' }));
    insert(baseRow({ endResult: 'reproducible', version: '4.0.0' }));

    assert.equal(markStaleQueuedAttemptsAsInterrupted(), 2);

    // Interrupted rows no longer block a retry of the same build.
    assert.equal(findQueuedOrErroredSimilarAttempt(baseRow()), undefined);
    assert.equal(findQueuedOrErroredSimilarAttempt(baseRow({ version: '2.0.0' })), undefined);
    // Errored rows still do.
    assert.ok(findQueuedOrErroredSimilarAttempt(baseRow({ version: '3.0.0' })));
    // Nothing left to mark.
    assert.equal(markStaleQueuedAttemptsAsInterrupted(), 0);
  });
});
