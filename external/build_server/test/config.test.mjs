import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { shouldProcessAppId, DEBUG_APP_IDS } from '../config/config.mjs';

// Restore DEBUG_APP_IDS to its baseline after every test so the mutations
// don't leak into other suites.
afterEach(() => {
  DEBUG_APP_IDS.include = [];
  DEBUG_APP_IDS.exclude = [];
  DEBUG_APP_IDS.includeEvenWithVerification = [];
});

describe('shouldProcessAppId', () => {
  test('returns true for any appId when include and exclude are empty', () => {
    assert.equal(shouldProcessAppId('com.example.one'), true);
    assert.equal(shouldProcessAppId('com.example.two'), true);
  });

  test('returns false for appIds present in the exclude list', () => {
    DEBUG_APP_IDS.exclude = ['com.blocked'];
    assert.equal(shouldProcessAppId('com.blocked'), false);
    assert.equal(shouldProcessAppId('com.allowed'), true);
  });

  test('when include is non-empty, only those appIds pass', () => {
    DEBUG_APP_IDS.include = ['com.only.this'];
    assert.equal(shouldProcessAppId('com.only.this'), true);
    assert.equal(shouldProcessAppId('com.something.else'), false);
  });

  test('exclude wins over include when an appId is in both', () => {
    DEBUG_APP_IDS.include = ['com.shared'];
    DEBUG_APP_IDS.exclude = ['com.shared'];
    assert.equal(shouldProcessAppId('com.shared'), false);
  });
});
