import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { formatDate } from '../src/format-utils.mjs';

describe('formatDate', () => {
  test('formats unix timestamp with date and time by default', () => {
    const formatted = formatDate(1_704_067_200); // 2024-01-01 00:00:00 UTC
    assert.match(formatted, /2024/);
    assert.ok(formatted.length > 4);
  });

  test('omits time when short mode is enabled', () => {
    const full = formatDate(1_704_067_200, false);
    const short = formatDate(1_704_067_200, true);
    assert.notEqual(full, short);
    assert.match(short, /2024/);
  });
});
