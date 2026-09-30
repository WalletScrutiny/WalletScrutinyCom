import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Absolute font sizes must come from the $font-* tokens in _sass/_variables.scss.
// Relative sizing (em, %, smaller/larger, clamp(), inherit) is allowed. A px/rem
// literal needs a `// type-scale-exempt: <reason>` comment on the same line.
const SASS_DIR = '_sass';
const LITERAL = /font-size:\s*[\d.]+\s*(px|rem)/;
const EXEMPT = /type-scale-exempt/;

test('font-size literals use type scale tokens', () => {
  const offenders = [];
  for (const file of readdirSync(SASS_DIR)) {
    if (!file.endsWith('.scss')) continue; // skips vendor/ subdirectory
    const lines = readFileSync(join(SASS_DIR, file), 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (LITERAL.test(line) && !EXEMPT.test(line)) {
        offenders.push(`${SASS_DIR}/${file}:${i + 1}: ${line.trim()}`);
      }
    });
  }
  assert.deepStrictEqual(offenders, [],
    `font-size px/rem literals found; use $font-* tokens from _variables.scss ` +
    `or add "// type-scale-exempt: <reason>":\n${offenders.join('\n')}`);
});
