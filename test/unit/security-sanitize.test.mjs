/**
 * Regression tests for markdown → HTML sanitization and remaining XSS sinks
 * (profiles, issue-tracker widget URLs, rich HTML helpers).
 */
import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicKey, generateSecretKey } from 'nostr-tools/pure';

import {
  sanitizeRichHtml,
  sanitizeHttpUrl,
  isSha256Hex,
} from '../../src/html-utils.mjs';
import { parseMarkdownToSafeHtml } from '../../src/marked-loader.js';
import {
  buildProfileCircleHtml,
  renderProfileCardHtml,
  renderBigProfileCardHtml,
  getProfileImageUrl,
  PROFILE_PLACEHOLDER_IMAGE,
} from '../../src/nostr-profile.mjs';
import { buildIssueTrackerLinkHtml } from '../../src/assets-table-modal.js';

const PUBKEY = getPublicKey(generateSecretKey());

const MARKDOWN_XSS_PAYLOADS = [
  '<div onmouseover=alert(1)>x</div>',
  '<a href="javascript:alert(1)">x</a>',
  '<svg onload=alert(1)>',
  '<p onclick=alert(1)>click</p>',
  '[click](javascript:alert(1))',
  '![x](javascript:alert(1))',
  '<details open ontoggle=alert(1)>',
];

function assertSafeRenderedHtml(html) {
  const mount = document.createElement('div');
  mount.innerHTML = html;
  assert.equal(
    mount.querySelectorAll('script, iframe, object, embed, svg, math').length,
    0,
    `forbidden nodes in: ${html}`,
  );
  for (const node of [mount, ...mount.querySelectorAll('*')]) {
    for (const attr of node.attributes ?? []) {
      assert.ok(!/^on/i.test(attr.name), `handler attr ${attr.name} in: ${html}`);
      if (/^(href|src)$/i.test(attr.name)) {
        assert.doesNotMatch(
          attr.value,
          /^\s*javascript:/i,
          `javascript: URL in ${attr.name}: ${html}`,
        );
      }
    }
  }
}

describe('sanitizeRichHtml — untrusted markdown HTML must not keep handlers/URLs', () => {
  for (const payload of MARKDOWN_XSS_PAYLOADS) {
    test(`neutralises ${payload.slice(0, 40)}`, () => {
      assertSafeRenderedHtml(sanitizeRichHtml(payload));
    });
  }

  test('keeps safe https links and emphasis', () => {
    const html = sanitizeRichHtml('<p><a href="https://example.com/ok">ok</a> <em>hi</em></p>');
    assert.match(html, /https:\/\/example\.com\/ok/);
    assert.match(html, /<em>hi<\/em>/i);
    assertSafeRenderedHtml(html);
  });
});

describe('parseMarkdownToSafeHtml', () => {
  for (const payload of MARKDOWN_XSS_PAYLOADS) {
    test(`markdown payload stays safe: ${payload.slice(0, 40)}`, async () => {
      assertSafeRenderedHtml(await parseMarkdownToSafeHtml(payload));
    });
  }

  test('renders normal markdown links as https anchors', async () => {
    const html = await parseMarkdownToSafeHtml('See [docs](https://walletscrutiny.com/)');
    assert.match(html, /href="https:\/\/walletscrutiny\.com\/"/);
    assertSafeRenderedHtml(html);
  });
});

describe('sanitizeHttpUrl', () => {
  test('allows http and https', () => {
    assert.equal(sanitizeHttpUrl('https://example.com/a'), 'https://example.com/a');
    assert.match(sanitizeHttpUrl('http://example.com/a'), /^http:\/\/example\.com\/a/);
  });

  test('rejects dangerous schemes', () => {
    assert.equal(sanitizeHttpUrl('javascript:alert(1)'), null);
    assert.equal(sanitizeHttpUrl('data:text/html,<script>alert(1)</script>'), null);
    assert.equal(sanitizeHttpUrl('file:///etc/passwd'), null);
    assert.equal(sanitizeHttpUrl('vbscript:msgbox(1)'), null);
  });
});

describe('profile HTML builders — Nostr profile fields must not break out', () => {
  test('display name quote breakout does not inject handlers', () => {
    const html = buildProfileCircleHtml(
      PUBKEY,
      { name: '" onfocus="alert(1)' },
      'https://cdn.example/a.png',
      PROFILE_PLACEHOLDER_IMAGE,
    );
    assertSafeRenderedHtml(html);
    assert.doesNotMatch(html, /onclick\s*=/i);
    assert.doesNotMatch(html, /onerror\s*=/i);
  });

  test('javascript image URL falls back to placeholder in getProfileImageUrl', () => {
    assert.equal(
      getProfileImageUrl({ image: 'javascript:alert(1)' }),
      PROFILE_PLACEHOLDER_IMAGE,
    );
    assert.equal(
      getProfileImageUrl({ picture: 'data:text/html,x' }),
      PROFILE_PLACEHOLDER_IMAGE,
    );
  });

  test('unsafe image URL is not used as img src in circle html', () => {
    const html = buildProfileCircleHtml(
      PUBKEY,
      { name: 'Eve' },
      'javascript:alert(1)',
      PROFILE_PLACEHOLDER_IMAGE,
    );
    assert.doesNotMatch(html, /javascript:/i);
    assert.match(html, /profile-placeholder/);
    assertSafeRenderedHtml(html);
  });

  test('profile cards do not use inline handlers', () => {
    const card = renderProfileCardHtml(PUBKEY, {
      name: 'Alice',
      image: 'https://cdn.example/a.png',
      nip05: 'alice@example.com',
    });
    const big = renderBigProfileCardHtml(PUBKEY, { name: 'Bob' });
    assert.doesNotMatch(card, /onclick\s*=/i);
    assert.doesNotMatch(card, /onerror\s*=/i);
    assert.doesNotMatch(big, /onerror\s*=/i);
    assertSafeRenderedHtml(card);
    assertSafeRenderedHtml(big);
  });

  test('non-hex pubkey is not placed in navigation dataset', () => {
    const html = renderProfileCardHtml(`" onclick="alert(1)`, { name: 'X' });
    assert.doesNotMatch(html, /data-verifier-pubkey/i);
    assert.doesNotMatch(html, /alert\s*\(/i);
    assertSafeRenderedHtml(html);
  });
});

describe('buildIssueTrackerLinkHtml', () => {
  test('rejects javascript URLs', () => {
    const html = buildIssueTrackerLinkHtml('javascript:alert(1)');
    assert.match(html, /invalid URL omitted/i);
    assert.doesNotMatch(html, /javascript:/i);
    assertSafeRenderedHtml(html);
  });

  test('keeps https URLs', () => {
    const html = buildIssueTrackerLinkHtml('https://github.com/org/repo/issues/1');
    assert.match(html, /href="https:\/\/github\.com\/org\/repo\/issues\/1"/);
    assertSafeRenderedHtml(html);
  });
});

describe('isSha256Hex', () => {
  test('accepts 64 hex chars only', () => {
    assert.equal(isSha256Hex('a'.repeat(64)), true);
    assert.equal(isSha256Hex(`' onmouseover='x/` + '0'.repeat(50)), false);
    assert.equal(isSha256Hex('g'.repeat(64)), false);
  });
});
