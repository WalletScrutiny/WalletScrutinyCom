import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

// _config.fast.yml must keep every exclude from _config.yml (Jekyll replaces
// the list when merging configs, so the copy drifts silently otherwise).
test('_config.fast.yml excludes everything _config.yml excludes', () => {
  const base = yaml.load(readFileSync('_config.yml', 'utf8')).exclude;
  const fast = yaml.load(readFileSync('_config.fast.yml', 'utf8')).exclude;
  const missing = base.filter((entry) => !fast.includes(entry));
  assert.deepEqual(missing, []);
  assert.ok(fast.some((entry) => entry.startsWith('_mobile/')), 'fast profile trims the mobile collection');
});
