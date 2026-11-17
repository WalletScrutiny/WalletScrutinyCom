import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editDistance, lookalikes } from '../markers-cli.mjs';

test('lookalike names: one edit from a widely used name, used by few, same scope', () => {
  assert.equal(editDistance('bitcoinjs-lb', 'bitcoinjs-lib'), 1);
  assert.equal(editDistance('rteact', 'retact'), 1, 'a transposition is one edit');
  assert.equal(editDistance('lodash', 'lodahs'), 1);
  assert.equal(editDistance('express', 'expresso'), 1);
  assert.equal(editDistance('react', 'preact-x'), 2);
  const names = new Map([['bitcoinjs-lib', 20], ['bitcoinjs-lb', 1], ['ansi-styles', 22], ['ansistyles', 1], ['colors', 7], ['color', 17], ['@scope/thing1', 4], ['@other/thing2', 1], ['react', 20], ['preact', 1]]);
  assert.deepEqual(lookalikes(names).map(h => [h.name, h.like]), [['bitcoinjs-lb', 'bitcoinjs-lib'], ['preact', 'react']],
    'separator spellings, plurals and other scopes are left out; preact stays a lookalike, its downloads clear it');
});
