import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { buildBuildLogButtonHtml } from '../../src/assets-table-modal.mjs';

const HASH = 'a'.repeat(64);

describe('buildBuildLogButtonHtml', () => {
  test('renders a button carrying the hash, subject and file name as data', () => {
    const html = buildBuildLogButtonHtml(HASH, 'script.cast', 'ZEUS Wallet 13.0.1');
    const container = document.createElement('div');
    container.innerHTML = html;
    const button = container.querySelector('button.js-open-build-log');
    assert.ok(button);
    assert.equal(button.getAttribute('type'), 'button');
    assert.equal(button.dataset.castHash, HASH);
    assert.equal(button.dataset.logSubject, 'ZEUS Wallet 13.0.1');
    assert.equal(button.dataset.logFile, 'script.cast');
    assert.match(button.textContent, /View build log/);
    assert.ok(button.querySelector('svg.ws-icon-eye'));
  });

  test('hostile names stay data, not markup', () => {
    const html = buildBuildLogButtonHtml(HASH, '"><img src=x onerror=alert(1)>.cast', '<script>alert(1)</script>');
    const container = document.createElement('div');
    container.innerHTML = html;
    assert.equal(container.querySelector('img'), null);
    assert.equal(container.querySelector('script'), null);
    const button = container.querySelector('button');
    assert.equal(button.dataset.logSubject, '<script>alert(1)</script>');
    assert.equal(button.dataset.logFile, '"><img src=x onerror=alert(1)>.cast');
  });

  test('is nothing without a hash', () => {
    assert.equal(buildBuildLogButtonHtml('not-a-hash', 'a.cast', 'x'), '');
    assert.equal(buildBuildLogButtonHtml('', 'a.cast', 'x'), '');
  });
});
