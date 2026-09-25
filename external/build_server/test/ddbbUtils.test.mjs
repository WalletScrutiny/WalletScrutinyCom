import './setup.mjs';
// Note: BUILD_SERVER_DB_PATH=:memory: is set by the npm test script. It must
// be in place before ddbbUtils.mjs is imported (its DB_PATH is captured at
// module-load time), so setting it inside this file would be too late.

import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

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

describe('asset attempts are keyed by file set, not version', () => {
  const EN_SET = 'e'.repeat(64);
  const ES_SET = 'f'.repeat(64);
  const assetRow = (overrides = {}) => baseRow({ platform: 'android', arch: '', type: '', assetKey: EN_SET, ...overrides });

  test('an errored file set does not block another set of the same version', () => {
    insert(assetRow({ buildScriptEventId: 'bs-1', endResult: 'error' }));

    assert.ok(findQueuedOrErroredSimilarAttempt(assetRow({ buildScriptEventId: 'bs-1' })));
    assert.ok(findErroredAttemptForBuildScript(assetRow({ buildScriptEventId: 'bs-1' })));
    assert.equal(findQueuedOrErroredSimilarAttempt(assetRow({ buildScriptEventId: 'bs-1', assetKey: ES_SET })), undefined);
    assert.equal(findErroredAttemptForBuildScript(assetRow({ buildScriptEventId: 'bs-1', assetKey: ES_SET })), undefined);
  });

  test('the same file set stays blocked when registered under another version tag', () => {
    insert(assetRow({ buildScriptEventId: 'bs-1', version: '1.0.0', endResult: 'error' }));

    assert.ok(findQueuedOrErroredSimilarAttempt(assetRow({ buildScriptEventId: 'bs-1', version: '1.0.0 (1)' })));
    assert.ok(findErroredAttemptForBuildScript(assetRow({ buildScriptEventId: 'bs-1', version: '1.0.0 (1)' })));
  });

  test('rows without an asset key block only release builds of that version', () => {
    // Rows written before assetKey existed look like this.
    insert(baseRow({ buildScriptEventId: 'bs-1', endResult: 'error' }));

    assert.ok(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1' })));
    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1', assetKey: EN_SET })), undefined);
    assert.equal(findQueuedOrErroredSimilarAttempt(baseRow({ assetKey: EN_SET })), undefined);
  });

  test('an asset row does not block a release build of the same version', () => {
    insert(baseRow({ buildScriptEventId: 'bs-1', assetKey: EN_SET, endResult: 'error' }));

    assert.equal(findErroredAttemptForBuildScript(baseRow({ buildScriptEventId: 'bs-1' })), undefined);
  });
});

describe('initDb migration', () => {
  test('adds assetKey to a database created without it and keeps its rows', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'abs-ddbb-'));
    const dbPath = path.join(dir, 'verifications.db');
    try {
      const old = new Database(dbPath);
      old.exec(`
        CREATE TABLE verifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          appId TEXT NOT NULL,
          platform TEXT NOT NULL,
          version TEXT NOT NULL,
          arch TEXT NOT NULL,
          type TEXT NOT NULL,
          verificationId TEXT NOT NULL,
          buildScriptEventId TEXT NOT NULL,
          endResult TEXT NOT NULL,
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now'))
        );
        INSERT INTO verifications (appId, platform, version, arch, type, verificationId, buildScriptEventId, endResult)
        VALUES ('com.example', 'linux', '1.0.0', 'x86_64', 'release', 'verif-1', 'script-1', 'error');
      `);
      old.close();

      // DB_PATH is fixed at module load, so open the file from a fresh process.
      const moduleUrl = new URL('../ddbbUtils.mjs', import.meta.url).href;
      const script = `
        const m = await import(${JSON.stringify(moduleUrl)});
        const row = { appId: 'com.example', platform: 'linux', version: '1.0.0', arch: 'x86_64', type: 'release', verificationId: 'verif-1', buildScriptEventId: 'script-1' };
        const legacy = m.findQueuedOrErroredSimilarAttempt(row);
        const newId = m.insert({ ...row, assetKey: 'k', endResult: 'queued' });
        const fresh = m.findQueuedOrErroredSimilarAttempt({ ...row, assetKey: 'k' });
        m.closeDb();
        m.initDb();
        m.closeDb();
        console.log(JSON.stringify({ legacyId: legacy?.id, legacyKey: legacy?.assetKey, newId, freshId: fresh?.id }));
      `;
      const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
        env: { ...process.env, BUILD_SERVER_DB_PATH: dbPath },
        cwd: path.dirname(fileURLToPath(import.meta.url)),
        encoding: 'utf8',
      });
      const result = JSON.parse(output.trim().split('\n').pop());
      assert.equal(result.legacyId, 1);
      assert.equal(result.legacyKey, '');
      assert.equal(result.freshId, result.newId);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
