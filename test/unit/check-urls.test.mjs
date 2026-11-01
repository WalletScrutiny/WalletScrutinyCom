import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { collectUrls, replaceInFile } from '../../scripts/checkUrls.mjs';

const MOBILE_FILE = `---
title: Example
website: https://example.com
social:
- https://example.org/social
android:
  appId: com.example
  repository: https://git.example.com/android
iphone:
  appId: com.example.ios
  repository: https://git.example.com/ios
---
See [the docs](https://docs.example.com/page).
`;

function withProductTree(fn) {
  const cwd = process.cwd();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'checkurls-'));
  fs.mkdirSync(path.join(dir, '_mobile'));
  fs.writeFileSync(path.join(dir, '_mobile', 'com.example.md'), MOBILE_FILE);
  process.chdir(dir);
  try {
    return fn();
  } finally {
    process.chdir(cwd);
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('collects URLs from _mobile, including per-store fields', () => {
  withProductTree(() => {
    const { urlMap } = collectUrls();
    const fields = [...urlMap.values()].flatMap(entry => entry.refs.map(ref => ref.field)).sort();
    assert.deepEqual(fields, ['android.repository', 'body', 'iphone.repository', 'social', 'website']);
  });
});

test('replaces a per-store URL inside its store block', () => {
  const header = {
    website: 'https://example.com',
    android: { repository: 'https://git.example.com/android' },
    iphone: { repository: 'https://git.example.com/ios' }
  };
  const fileData = new Map([['_mobile/com.example.md', { header, body: '', dirty: false }]]);
  replaceInFile(fileData, '_mobile/com.example.md', 'iphone.repository', undefined,
    'https://git.example.com/ios', 'https://git.example.com/ios#deadLink');
  assert.equal(header.iphone.repository, 'https://git.example.com/ios#deadLink');
  assert.equal(header.android.repository, 'https://git.example.com/android');
  assert.equal(fileData.get('_mobile/com.example.md').dirty, true);
});
