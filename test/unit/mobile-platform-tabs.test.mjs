import './setup.mjs';
import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// assets/js/mobilePlatformTabs.js is a plain script that hangs helpers off
// `window`, so it is loaded by evaluating its source against the linkedom DOM.
const source = readFileSync(
  fileURLToPath(new URL('../../assets/js/mobilePlatformTabs.js', import.meta.url)),
  'utf8',
);

globalThis.wsIcon = (name) => `<svg data-icon="${name}"></svg>`;
new Function(source)();

const ANDROID_ICON = 'data-icon="google-play"';
const IPHONE_ICON = 'i-app-store';

describe('updateDualMobileVerification', () => {
  let target;

  beforeEach(() => {
    document.body.innerHTML = '<div id="merged"></div>';
    target = document.getElementById('merged');
    window._mobileVerParts = {};
  });

  function update(platform, info) {
    window.updateDualMobileVerification(platform, info, 'merged');
  }

  test('labels both platforms when both have a version', () => {
    update('android', { lastVersion: '8.0.1', lastVersionDate: '2026-07-20' });
    update('iphone', { lastVersion: '7.9.0', lastVersionDate: '2026-06-01' });

    assert.ok(target.innerHTML.includes(ANDROID_ICON));
    assert.ok(target.innerHTML.includes(IPHONE_ICON));
    assert.ok(target.innerHTML.includes('8.0.1'));
    assert.ok(target.innerHTML.includes('7.9.0'));
  });

  test('labels the single number when only android has a version', () => {
    update('android', { lastVersion: '8.0.1', lastVersionDate: '2026-07-20' });
    update('iphone', {});

    assert.ok(target.innerHTML.includes('Latest release found in a'));
    assert.ok(target.innerHTML.includes('8.0.1'));
    // Without the icon the number would read as covering both platforms.
    assert.ok(target.innerHTML.includes(ANDROID_ICON));
    assert.ok(!target.innerHTML.includes(IPHONE_ICON));
  });

  test('labels the single number when only iphone has a version', () => {
    update('android', {});
    update('iphone', { lastVersion: '3.2.0', lastVersionDate: '2026-05-05' });

    assert.ok(target.innerHTML.includes('3.2.0'));
    assert.ok(target.innerHTML.includes(IPHONE_ICON));
    assert.ok(!target.innerHTML.includes(ANDROID_ICON));
  });

  test('renders nothing when neither platform has a version', () => {
    update('android', {});
    update('iphone', {});

    assert.equal(target.innerHTML, '');
  });

  test('labels the reproducible line too', () => {
    update('android', {
      lastVersion: '8.0.1',
      lastVersionDate: '2026-07-20',
      lastVerifiedVersion: '7.9.0',
      lastVerifiedVersionDate: '2026-06-01',
    });
    update('iphone', {});

    assert.ok(target.innerHTML.includes('Reproducible Verification'));
    assert.equal(target.innerHTML.split(ANDROID_ICON).length - 1, 2);
    assert.ok(!target.innerHTML.includes(IPHONE_ICON));
  });
});
