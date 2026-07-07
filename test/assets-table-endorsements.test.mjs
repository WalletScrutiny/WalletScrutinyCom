import './setup.mjs';
import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  resetEndorsementsState,
  setPendingEndorsementIds,
  loadEndorsementsForTable,
  loadEndorsementsForVerification,
} from '../src/assets-table-endorsements.js';

const VERIFICATION_ID = 'verification-1';

beforeEach(() => {
  resetEndorsementsState();
  globalThis.getEndorsementsFromVerificationEventIds = async (ids) => {
    const result = {};
    for (const id of ids) {
      result[id] = [{ id: `endorsement-for-${id}`, tags: [['e', id]] }];
    }
    return result;
  };
});

describe('loadEndorsementsForTable', () => {
  test('resolves immediately when no pending verification ids exist', async () => {
    const data = await loadEndorsementsForTable();
    assert.deepEqual(data, {});
  });

  test('fetches and caches endorsements for pending ids', async () => {
    setPendingEndorsementIds([VERIFICATION_ID]);
    const first = await loadEndorsementsForTable();
    const second = await loadEndorsementsForTable();

    assert.equal(first[VERIFICATION_ID].length, 1);
    assert.equal(first[VERIFICATION_ID][0].id, `endorsement-for-${VERIFICATION_ID}`);
    assert.equal(second, first);
  });

  test('refetches after pending ids change', async () => {
    setPendingEndorsementIds([VERIFICATION_ID]);
    const first = await loadEndorsementsForTable();

    setPendingEndorsementIds(['verification-2']);
    const second = await loadEndorsementsForTable();

    assert.ok(first[VERIFICATION_ID]);
    assert.ok(second['verification-2']);
    assert.equal(second[VERIFICATION_ID], undefined);
  });
});

describe('loadEndorsementsForVerification', () => {
  test('reuses table cache when available', async () => {
    setPendingEndorsementIds([VERIFICATION_ID]);
    await loadEndorsementsForTable();

    let fetchCount = 0;
    globalThis.getEndorsementsFromVerificationEventIds = async () => {
      fetchCount += 1;
      return { [VERIFICATION_ID]: [{ id: 'direct-fetch' }] };
    };

    const endorsements = await loadEndorsementsForVerification(VERIFICATION_ID);
    assert.equal(fetchCount, 0);
    assert.equal(endorsements[0].id, `endorsement-for-${VERIFICATION_ID}`);
  });

  test('fetches directly when verification is not in table cache', async () => {
    const endorsements = await loadEndorsementsForVerification('verification-2');
    assert.equal(endorsements.length, 1);
    assert.equal(endorsements[0].id, 'endorsement-for-verification-2');
  });
});
