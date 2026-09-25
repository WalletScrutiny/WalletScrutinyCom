import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  readAndroidAlternativeStores,
  setAndroidAlternativeStore
} from '../../scripts/alternativeStoresFrontmatter.mjs';

const page = (android) => `---\nwsId: x\nandroid:\n${android}\nstripped: true\n---\n\nBody text.\n`;

describe('setAndroidAlternativeStore', () => {
  test('inserts a new list right after appId', () => {
    const before = page('  appId: a.b\n  users: 10\n  verdict: sourceavailable');
    const { content, status } = setAndroidAlternativeStore(before, 'zapstore', true);
    assert.equal(status, 'added');
    assert.equal(content, page('  appId: a.b\n  alternativeStores:\n  - zapstore\n  users: 10\n  verdict: sourceavailable'));
  });

  test('appends to an existing list instead of treating it as a conflict', () => {
    const before = page('  appId: a.b\n  alternativeStores:\n  - fdroid\n  meta: ok');
    const { content, status } = setAndroidAlternativeStore(before, 'zapstore', true);
    assert.equal(status, 'added');
    assert.equal(content, page('  appId: a.b\n  alternativeStores:\n  - fdroid\n  - zapstore\n  meta: ok'));
    assert.deepEqual(readAndroidAlternativeStores(content), ['fdroid', 'zapstore']);
  });

  test('is a no-op when the store is already listed', () => {
    const before = page('  appId: a.b\n  alternativeStores:\n  - fdroid\n  - zapstore\n  meta: ok');
    assert.deepEqual(setAndroidAlternativeStore(before, 'fdroid', true), { content: before, status: 'unchanged' });
    assert.deepEqual(setAndroidAlternativeStore(before, 'other', false), { content: before, status: 'unchanged' });
  });

  test('removes one store and keeps the others', () => {
    const before = page('  appId: a.b\n  alternativeStores:\n  - fdroid\n  - zapstore\n  meta: ok');
    const { content, status } = setAndroidAlternativeStore(before, 'fdroid', false);
    assert.equal(status, 'removed');
    assert.equal(content, page('  appId: a.b\n  alternativeStores:\n  - zapstore\n  meta: ok'));
  });

  test('drops the key with its last store', () => {
    const before = page('  appId: a.b\n  alternativeStores:\n  - fdroid\n  meta: ok');
    const { content } = setAndroidAlternativeStore(before, 'fdroid', false);
    assert.equal(content, page('  appId: a.b\n  meta: ok'));
    assert.deepEqual(readAndroidAlternativeStores(content), []);
  });

  test('reads deeper-indented items and inline values', () => {
    assert.deepEqual(readAndroidAlternativeStores(page('  appId: a.b\n  alternativeStores:\n    - fdroid\n  meta: ok')), ['fdroid']);
    assert.deepEqual(readAndroidAlternativeStores(page('  appId: a.b\n  alternativeStores: [fdroid, zapstore]')), ['fdroid', 'zapstore']);
    assert.deepEqual(readAndroidAlternativeStores(page('  appId: a.b\n  alternativeStores: fdroid')), ['fdroid']);
  });

  test('never touches a top-level key of the same name or the body', () => {
    const before = `---\nalternativeStores:\n- fdroid\nandroid:\n  appId: a.b\n---\n\n  alternativeStores:\n  - fdroid\n`;
    const { content } = setAndroidAlternativeStore(before, 'zapstore', true);
    assert.equal(content, `---\nalternativeStores:\n- fdroid\nandroid:\n  appId: a.b\n  alternativeStores:\n  - zapstore\n---\n\n  alternativeStores:\n  - fdroid\n`);
  });

  test('keeps CRLF line endings', () => {
    const before = '---\r\nandroid:\r\n  appId: a.b\r\n  meta: ok\r\n---\r\nBody\r\n';
    const { content } = setAndroidAlternativeStore(before, 'zapstore', true);
    assert.equal(content, '---\r\nandroid:\r\n  appId: a.b\r\n  alternativeStores:\r\n  - zapstore\r\n  meta: ok\r\n---\r\nBody\r\n');
  });

  test('reports files without an android block', () => {
    assert.equal(setAndroidAlternativeStore('---\niphone:\n  appId: x\n---\n', 'zapstore', true).status, 'no_android_block');
    assert.equal(setAndroidAlternativeStore('no front matter', 'zapstore', true).status, 'no_frontmatter');
  });
});
