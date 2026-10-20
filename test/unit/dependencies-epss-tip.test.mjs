import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { epssTrigger, closeTip, EPSS_LEARN_MORE_URL } from '../../src/dependencies-epss-tip.mjs';

function fire(target, type, props = {}) {
  const event = new window.Event(type, { bubbles: true });
  Object.assign(event, props);
  target.dispatchEvent(event);
}

function cell(...triggers) {
  const host = document.createElement('div');
  host.append(...triggers);
  document.body.appendChild(host);
  return host;
}

describe('EPSS toggletip', () => {
  test('a click pins the explanation next to its trigger, a second click closes it', () => {
    const t = epssTrigger(0.0052, 0.43);
    cell(t);
    assert.equal(t.tagName, 'BUTTON');
    assert.equal(t.textContent, 'EPSS 0.5 %');
    assert.equal(t.getAttribute('aria-expanded'), 'false');

    fire(t, 'click');
    const tip = document.getElementById(t.getAttribute('aria-controls'));
    assert.equal(t.getAttribute('aria-expanded'), 'true');
    assert.equal(tip.hidden, false);
    assert.equal(t.nextElementSibling, tip, 'next to the trigger so Tab reaches the link');
    assert.match(tip.textContent, /Estimated exploitation likelihood within the next 30 days\./);
    assert.match(tip.textContent, /This is not your wallet’s chance of being hacked\./);
    assert.match(tip.textContent, /Higher than 43 % of all scored CVEs\./);
    const link = tip.querySelector('a');
    assert.equal(link.getAttribute('href'), EPSS_LEARN_MORE_URL);
    assert.equal(link.textContent, 'Learn more');

    fire(t, 'click');
    assert.equal(t.getAttribute('aria-expanded'), 'false');
    assert.equal(tip.hidden, true);
  });

  test('Escape and a press outside close it; a press inside does not', () => {
    const t = epssTrigger(0.3, null);
    const outside = document.createElement('span');
    cell(t, outside);
    fire(t, 'click');
    const tip = document.getElementById(t.getAttribute('aria-controls'));
    assert.equal(tip.querySelector('.dp-tip__percentile').hidden, true, 'no percentile line without a percentile');

    fire(document, 'keydown', { key: 'Escape' });
    assert.equal(tip.hidden, true);

    fire(t, 'click');
    fire(tip.querySelector('a'), 'pointerdown');
    assert.equal(tip.hidden, false);
    fire(outside, 'pointerdown');
    assert.equal(tip.hidden, true);
    assert.equal(t.getAttribute('aria-expanded'), 'false');
  });

  test('hover opens it for a mouse only, and one tip moves between triggers', () => {
    const a = epssTrigger(0.01, 0.5);
    const b = epssTrigger(0.02, 0.6);
    cell(a, b);
    fire(a, 'pointerenter', { pointerType: 'touch' });
    assert.equal(a.getAttribute('aria-expanded'), 'false');
    fire(a, 'pointerenter', { pointerType: 'mouse' });
    assert.equal(a.getAttribute('aria-expanded'), 'true');

    fire(b, 'click');
    assert.equal(a.getAttribute('aria-expanded'), 'false');
    assert.equal(b.getAttribute('aria-expanded'), 'true');
    assert.equal(document.querySelectorAll('.dp-tip').length, 1);
    assert.match(b.nextElementSibling.textContent, /Higher than 60 %/);
    closeTip();
  });
});
