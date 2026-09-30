import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { parseRefreshOutput } from '../refresh_apps.mjs';

describe('parseRefreshOutput', () => {
  test('extracts appId and latestVersion from well-formed lines', () => {
    const output = [
      'Some noise before',
      '  appId: com.example.one  Current: 1.0.0  Latest: 1.2.3',
      '  appId: com.example.two  Current: 2.0.0  Latest: 2.5.0',
      'Trailing noise'
    ].join('\n');

    const parsed = parseRefreshOutput(output);
    assert.deepEqual(parsed, {
      'com.example.one': { latestVersion: '1.2.3' },
      'com.example.two': { latestVersion: '2.5.0' }
    });
  });

  test('returns an empty object when no line matches the expected shape', () => {
    assert.deepEqual(parseRefreshOutput(''), {});
    assert.deepEqual(parseRefreshOutput('only logging, no app info here'), {});
  });

  test('keeps the latest occurrence when an appId appears more than once', () => {
    const output = [
      '  appId: com.example.one  Current: 1.0.0  Latest: 1.2.3',
      '  appId: com.example.one  Current: 1.0.0  Latest: 1.2.4'
    ].join('\n');

    assert.deepEqual(parseRefreshOutput(output), {
      'com.example.one': { latestVersion: '1.2.4' }
    });
  });

  test('captures latest versions that include spaces / suffixes after the number', () => {
    const output = '  appId: com.example.one  Current: 1.0.0  Latest: 1.2.3-rc1 (annotated)';
    assert.deepEqual(parseRefreshOutput(output), {
      'com.example.one': { latestVersion: '1.2.3-rc1 (annotated)' }
    });
  });
});
