/**
 * Regression tests for untrusted Nostr values reaching innerHTML / inline handlers.
 *
 * These assert the *desired* secure behaviour. They are expected to fail (red) against
 * the current renderer and sanitiser, and turn green once:
 * - untrusted values are not interpolated into markup/handlers
 * - eventSanitize neutralises quote characters used for attribute breakout
 * - hash ingest validates 64-char hex rather than length alone
 */
import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  renderVerificationCard,
  renderVerificationActionLink,
  renderBlossomDownloadButton,
  renderVerificationsCell,
  renderAssetVersionDescriptionHtml,
} from '../../src/assets-table-paint.mjs';
import {
  eventSanitize,
  getVerificationHashList,
} from '../../src/verifications_utils.mjs';
import {
  buildEndorsementButtonHtml,
  buildOutputFileDownloadHtml,
  buildDiffoscopeOpenButtonHtml,
  buildIssueTrackerLinkHtml,
} from '../../src/assets-table-modal.mjs';
import {
  buildAttachmentRowActionsHtml,
  buildAttachmentVerificationMetaHtml,
  createAttachmentRowActions,
  createAttachmentVerificationMeta,
  createAttachmentPreviewNode,
} from '../../src/assets-table-attachments.mjs';
import { verificationKind } from '../../src/nostr-constants.mjs';
import { HASH_A, makeEvent } from './fixtures.mjs';

const SAFE_HASH = HASH_A;
const SAFE_ID = 'c'.repeat(64);
const SAFE_PUBKEY = 'd'.repeat(64);

/** Classic single-quote breakout against onclick='...${value}...' */
const SINGLE_QUOTE_BREAKOUT = "' onmouseover='alert(1)";
/** Double-quote breakout against data-foo="${value}" */
const DOUBLE_QUOTE_BREAKOUT = '" onfocus="alert(1)';
/** Markup injection into text/html sinks */
const HTML_TAG_PAYLOAD = '<img src=x onerror=alert(1)>';
/** 64-char non-hex value that today's length-only filter accepts */
const FAKE_HASH_WITH_QUOTE = (`' onmouseover='x/` + '0'.repeat(64)).slice(0, 64);

function handlerNames(html) {
  // Only inspect real start tags so escaped text like &lt;img ... onerror=...&gt;
  // (or payloads in text nodes) is not treated as an inline handler.
  const names = [];
  for (const tagMatch of String(html).matchAll(/<[a-zA-Z][^>]*>/g)) {
    const tag = tagMatch[0]
      .replace(/="[^"]*"/g, '=""')
      .replace(/='[^']*'/g, "=''");
    for (const handlerMatch of tag.matchAll(/\son([a-z]+)\s*=/gi)) {
      names.push(handlerMatch[1].toLowerCase());
    }
  }
  return names;
}

function assertNoAttributeBreakout(html) {
  const found = handlerNames(html);
  assert.deepEqual(
    found,
    [],
    `unexpected inline handler(s) on${found.join(', on')} in: ${html}`,
  );
  assert.doesNotMatch(
    html,
    /\s(href|src)\s*=\s*["']?\s*javascript:/i,
    `javascript: URL in: ${html}`,
  );
}

function assertNoInlineHandlers(html) {
  const found = handlerNames(html);
  assert.deepEqual(
    found,
    [],
    `expected no inline event handlers, found on${found.join(', on')} in: ${html}`,
  );
}

function assertNoRawHtmlPayload(html) {
  const mount = document.createElement('div');
  mount.innerHTML = html;
  assertSafeElementTree(mount);
}

function assertSafeElementTree(root) {
  assert.equal(
    root.querySelectorAll('img, script, iframe, object, embed').length,
    0,
    'attacker HTML nodes present in element tree',
  );
  for (const node of [root, ...root.querySelectorAll('*')]) {
    for (const attr of node.attributes ?? []) {
      assert.ok(!/^on/i.test(attr.name), `unexpected handler attribute ${attr.name}`);
    }
  }
}

function makeAttestation(overrides = {}) {
  return makeEvent({
    id: SAFE_ID,
    pubkey: SAFE_PUBKEY,
    kind: verificationKind,
    created_at: 1_700_000_000,
    tags: [['status', 'reproducible']],
    content: JSON.stringify({ description: 'ok', content: 'ok' }),
    ...overrides,
  });
}

describe('renderVerificationCard — Nostr values must not break out of attributes', () => {
  test('identifier with single quote does not inject a new handler attribute', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation(),
      sha256HashKey: SAFE_HASH,
      identifier: SINGLE_QUOTE_BREAKOUT,
      platform: 'android',
      isMyDraft: false,
    });
    assertNoAttributeBreakout(html);
  });

  test('platform with single quote does not inject a new handler attribute', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation(),
      sha256HashKey: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: SINGLE_QUOTE_BREAKOUT,
      isMyDraft: false,
    });
    assertNoAttributeBreakout(html);
  });

  test('sha256 hash key with single quote does not inject a new handler attribute', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation(),
      sha256HashKey: FAKE_HASH_WITH_QUOTE,
      identifier: 'com.example.wallet',
      platform: 'android',
      isMyDraft: false,
    });
    assertNoAttributeBreakout(html);
  });

  test('attestation id with double quote does not break the JS string inside the handler', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation({ id: 'abc");alert(1);//' }),
      sha256HashKey: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      isMyDraft: false,
    });
    assert.doesNotMatch(html, /alert\s*\(/i);
    assertNoAttributeBreakout(html);
  });

  test('pubkey with double quote does not break data-pubkey_verifiers', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation({ pubkey: DOUBLE_QUOTE_BREAKOUT }),
      sha256HashKey: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      isMyDraft: false,
    });
    assertNoAttributeBreakout(html);
  });

  test('card markup does not use inline handlers that interpolate untrusted values', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation(),
      sha256HashKey: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      isMyDraft: false,
    });
    assert.doesNotMatch(html, /onclick\s*=/i);
    assert.doesNotMatch(html, /showVerificationModal\s*\(/);
  });

  test('status label from an unknown status tag is not emitted as raw HTML', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation({ tags: [['status', HTML_TAG_PAYLOAD]] }),
      sha256HashKey: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      isMyDraft: false,
    });
    assertNoRawHtmlPayload(html);
    assertNoAttributeBreakout(html);
  });
});

describe('renderVerificationActionLink — query values must not break the href', () => {
  test('identifier with double quote does not inject attributes into the anchor', () => {
    const html = renderVerificationActionLink({
      identifier: DOUBLE_QUOTE_BREAKOUT,
      version: '1.0.0',
      platform: 'android',
      label: 'Create verification',
    });
    assertNoAttributeBreakout(html);
    assert.doesNotMatch(html, /javascript:/i);
  });

  test('version with single and double quotes stays inside the href', () => {
    const html = renderVerificationActionLink({
      identifier: 'com.example.wallet',
      version: `1.0${SINGLE_QUOTE_BREAKOUT}${DOUBLE_QUOTE_BREAKOUT}`,
      platform: 'android',
      label: 'Create verification',
    });
    assertNoAttributeBreakout(html);
  });

  test('platform breakout does not add a new handler on the anchor', () => {
    const html = renderVerificationActionLink({
      identifier: 'com.example.wallet',
      version: '1.0.0',
      platform: SINGLE_QUOTE_BREAKOUT,
      label: 'Create verification',
    });
    assertNoAttributeBreakout(html);
  });
});

describe('renderBlossomDownloadButton — data-* attributes must not break out', () => {
  test('identifier with double quote does not inject handlers on the button', () => {
    const html = renderBlossomDownloadButton({
      downloadHash: SAFE_HASH,
      identifier: DOUBLE_QUOTE_BREAKOUT,
      platform: 'android',
      version: '1.2.3',
      sanitizedFileName: 'app.apk',
      bundleFilesAttr: '',
      downloadTitle: 'Download from Blossom',
      bundleFileCount: 1,
    });
    assertNoAttributeBreakout(html);
  });

  test('version with double quote does not inject handlers on the button', () => {
    const html = renderBlossomDownloadButton({
      downloadHash: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      version: DOUBLE_QUOTE_BREAKOUT,
      sanitizedFileName: 'app.apk',
      bundleFilesAttr: '',
      downloadTitle: 'Download from Blossom',
      bundleFileCount: 1,
    });
    assertNoAttributeBreakout(html);
  });

  test('platform with double quote does not inject handlers on the button', () => {
    const html = renderBlossomDownloadButton({
      downloadHash: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: DOUBLE_QUOTE_BREAKOUT,
      version: '1.2.3',
      sanitizedFileName: 'app.apk',
      bundleFilesAttr: '',
      downloadTitle: 'Download from Blossom',
      bundleFileCount: 1,
    });
    assertNoAttributeBreakout(html);
  });

  test('file name with double quote does not inject handlers on the button', () => {
    const html = renderBlossomDownloadButton({
      downloadHash: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      version: '1.2.3',
      sanitizedFileName: DOUBLE_QUOTE_BREAKOUT,
      bundleFilesAttr: '',
      downloadTitle: 'Download from Blossom',
      bundleFileCount: 1,
    });
    assertNoAttributeBreakout(html);
  });

  test('download hash with quote characters does not break the button id attribute', () => {
    const html = renderBlossomDownloadButton({
      downloadHash: FAKE_HASH_WITH_QUOTE,
      identifier: 'com.example.wallet',
      platform: 'android',
      version: '1.2.3',
      sanitizedFileName: 'app.apk',
      bundleFilesAttr: '',
      downloadTitle: 'Download from Blossom',
      bundleFileCount: 1,
    });
    assertNoAttributeBreakout(html);
  });
});

describe('renderVerificationsCell — composed card + action link stay safe', () => {
  test('malicious identifier cannot inject handlers into the cell', () => {
    const html = renderVerificationsCell({
      attestations: [makeAttestation()],
      sha256HashKey: SAFE_HASH,
      identifier: SINGLE_QUOTE_BREAKOUT,
      platform: 'android',
      version: '1.0.0',
      hideButtons: false,
    });
    assertNoAttributeBreakout(html);
  });

  test('empty cell action link also rejects quote breakout in version', () => {
    const html = renderVerificationsCell({
      attestations: [],
      sha256HashKey: SAFE_HASH,
      identifier: 'com.example.wallet',
      platform: 'android',
      version: DOUBLE_QUOTE_BREAKOUT,
      hideButtons: false,
    });
    assertNoAttributeBreakout(html);
  });
});

describe('renderAssetVersionDescriptionHtml — description/version are text, not HTML', () => {
  test('description HTML tags are not emitted raw into the description cell', () => {
    const { descriptionCell, mobileDescription } = renderAssetVersionDescriptionHtml({
      version: '1.0.0',
      itemDescription: HTML_TAG_PAYLOAD,
    });
    assertNoRawHtmlPayload(descriptionCell);
    assertNoRawHtmlPayload(mobileDescription);
    assertNoAttributeBreakout(descriptionCell);
    assertNoAttributeBreakout(mobileDescription);
  });

  test('version HTML tags are not emitted raw into the version fragment', () => {
    const { versionFragment } = renderAssetVersionDescriptionHtml({
      version: HTML_TAG_PAYLOAD,
      itemDescription: 'safe',
    });
    assertNoRawHtmlPayload(versionFragment);
    assertNoAttributeBreakout(versionFragment);
  });
});

describe('eventSanitize — quote characters used for attribute breakout must not survive', () => {
  test('strips single quotes from identifier tags', () => {
    const event = makeEvent({
      tags: [['i', `com.example${SINGLE_QUOTE_BREAKOUT}`]],
      content: '{}',
    });
    eventSanitize(event);
    assert.equal(event.tags[0][1].includes("'"), false);
  });

  test('strips single quotes from version tags', () => {
    const event = makeEvent({
      tags: [['version', `1.0${SINGLE_QUOTE_BREAKOUT}`]],
      content: '{}',
    });
    eventSanitize(event);
    assert.equal(event.tags[0][1].includes("'"), false);
  });

  test('strips single quotes from platform tags', () => {
    const event = makeEvent({
      tags: [['platform', SINGLE_QUOTE_BREAKOUT]],
      content: '{}',
    });
    eventSanitize(event);
    assert.equal(event.tags[0][1].includes("'"), false);
  });

  test('strips single quotes from x (hash) tags', () => {
    const event = makeEvent({
      tags: [['x', FAKE_HASH_WITH_QUOTE]],
      content: '{}',
    });
    eventSanitize(event);
    assert.equal(event.tags[0][1].includes("'"), false);
  });

  test('still strips double quotes from tags', () => {
    const event = makeEvent({
      tags: [['i', `com.example${DOUBLE_QUOTE_BREAKOUT}`]],
      content: '{}',
    });
    eventSanitize(event);
    assert.equal(event.tags[0][1].includes('"'), false);
  });

  test('description field does not retain raw HTML tags', () => {
    const event = makeEvent({
      tags: [],
      content: JSON.stringify({ description: HTML_TAG_PAYLOAD, content: 'body' }),
    });
    eventSanitize(event);
    const parsed = JSON.parse(event.content);
    assert.equal(parsed.description.includes('<img'), false);
    assert.equal(parsed.description.includes('onerror'), false);
  });
});

describe('getVerificationHashList — only accept 64-char hex hashes', () => {
  test('rejects a 64-character non-hex hash containing a quote', () => {
    const event = makeEvent({
      tags: [['x', FAKE_HASH_WITH_QUOTE]],
    });
    assert.deepEqual(getVerificationHashList(event), []);
  });

  test('rejects short non-hex fallback values', () => {
    const event = makeEvent({
      tags: [['x', SINGLE_QUOTE_BREAKOUT]],
    });
    assert.deepEqual(getVerificationHashList(event), []);
  });

  test('accepts a real lowercase hex hash', () => {
    const event = makeEvent({
      tags: [['x', SAFE_HASH]],
    });
    assert.deepEqual(getVerificationHashList(event), [SAFE_HASH]);
  });

  test('does not fall back to an arbitrary non-hex x tag when no 64-hex hash exists', () => {
    const event = makeEvent({
      tags: [['x', 'not-a-hash'], ['i', 'com.example']],
    });
    assert.deepEqual(getVerificationHashList(event), []);
  });
});

describe('modal HTML builders — Nostr-derived ids/names must not break handlers', () => {
  test('endorsement button rejects single-quote breakout in verification id', () => {
    const html = buildEndorsementButtonHtml(SINGLE_QUOTE_BREAKOUT, SAFE_HASH);
    assertNoAttributeBreakout(html);
    assertNoInlineHandlers(html);
  });

  test('endorsement button rejects single-quote breakout in sha256 hash', () => {
    const html = buildEndorsementButtonHtml(SAFE_ID, FAKE_HASH_WITH_QUOTE);
    assertNoAttributeBreakout(html);
    assertNoInlineHandlers(html);
  });

  test('output file download rejects breakout in file name', () => {
    const html = buildOutputFileDownloadHtml(SINGLE_QUOTE_BREAKOUT, SAFE_HASH);
    assertNoAttributeBreakout(html);
    assertNoInlineHandlers(html);
  });

  test('output file download rejects breakout in file hash', () => {
    const html = buildOutputFileDownloadHtml('report.cast', FAKE_HASH_WITH_QUOTE);
    assertNoAttributeBreakout(html);
    assertNoInlineHandlers(html);
  });

  test('diffoscope button rejects breakout in file URL', () => {
    const html = buildDiffoscopeOpenButtonHtml(
      'diff.html',
      `https://example.test/${SINGLE_QUOTE_BREAKOUT}`,
    );
    assertNoAttributeBreakout(html);
    assertNoInlineHandlers(html);
  });

  test('diffoscope button does not emit raw HTML from file name', () => {
    const html = buildDiffoscopeOpenButtonHtml(HTML_TAG_PAYLOAD, 'https://example.test/diff');
    assertNoRawHtmlPayload(html);
    assertNoAttributeBreakout(html);
  });

  test('issue tracker link rejects javascript: URLs and attribute breakout', () => {
    const html = buildIssueTrackerLinkHtml(`javascript:alert(1)${DOUBLE_QUOTE_BREAKOUT}`);
    assertNoAttributeBreakout(html);
    assert.doesNotMatch(html, /javascript:/i);
  });
});

describe('attachment HTML builders — ids/names/meta must not break handlers or HTML', () => {
  test('attachment actions reject single-quote breakout in attachment id', () => {
    const node = createAttachmentRowActions({
      attachmentId: SINGLE_QUOTE_BREAKOUT,
      name: 'script.sh',
      pubkey: SAFE_PUBKEY,
      date: '2024-01-01',
      sizeInKb: 12,
    });
    assertSafeElementTree(node);
  });

  test('attachment actions reject HTML / quote breakout in file name', () => {
    const node = createAttachmentRowActions({
      attachmentId: SAFE_ID,
      name: `${HTML_TAG_PAYLOAD}${DOUBLE_QUOTE_BREAKOUT}`,
      pubkey: SAFE_PUBKEY,
      date: '2024-01-01',
      sizeInKb: 12,
    });
    assertSafeElementTree(node);
    assert.equal(node.querySelectorAll('img').length, 0);
    assert.match(node.textContent, /onerror/);
  });

  test('attachment actions reject quote breakout in pubkey', () => {
    const node = createAttachmentRowActions({
      attachmentId: SAFE_ID,
      name: 'script.sh',
      pubkey: DOUBLE_QUOTE_BREAKOUT,
      date: '2024-01-01',
      sizeInKb: 12,
    });
    assertSafeElementTree(node);
    assert.equal(node.querySelector('.profile-unknown') != null, true);
  });

  test('verification meta rejects HTML from identifier/version/platform', () => {
    const node = createAttachmentVerificationMeta({
      walletTitle: null,
      identifier: HTML_TAG_PAYLOAD,
      platform: SINGLE_QUOTE_BREAKOUT,
      version: DOUBLE_QUOTE_BREAKOUT,
    });
    assertSafeElementTree(node);
    assert.equal(node.querySelectorAll('img').length, 0);
    assert.match(node.textContent, /onmouseover/);
  });

  test('attachment preview keeps HTML tags as text, not DOM nodes', () => {
    const node = createAttachmentPreviewNode(
      `echo ok\n${HTML_TAG_PAYLOAD}\n<a href="https://evil.example">click</a>`,
    );
    assert.equal(node.tagName, 'PRE');
    assert.equal(node.style.margin, '0');
    assert.equal(node.style.overflow, 'visible');
    assert.equal(node.querySelectorAll('img, a, script').length, 0);
    assert.match(node.textContent, /onerror/);
    assert.match(node.textContent, /<a href="https:\/\/evil\.example">click<\/a>/);
  });
});
/**
 * Inverse / over-sanitisation guards.
 * These should stay green before and after the XSS fix. If a fix strips or rejects too much,
 * legitimate wallet data stops rendering or stops being clickable.
 */
describe('legitimate Nostr values must survive sanitize and remain usable in render', () => {
  const LEGIT_APP_ID = 'app.zeusln.zeus';
  const LEGIT_VERSION = '0.9.0-rc1';
  const LEGIT_PLATFORM = 'android';
  const LEGIT_DESCRIPTION = "Wallet's binary doesn't match the build from source";
  const UPPER_HASH = 'ABCDEF0123456789abcdef0123456789ABCDEF0123456789abcdef0123456789';

  test('eventSanitize keeps normal appId, version and platform intact', () => {
    const event = makeEvent({
      tags: [
        ['i', LEGIT_APP_ID],
        ['version', LEGIT_VERSION],
        ['platform', LEGIT_PLATFORM],
        ['x', SAFE_HASH],
        ['status', 'reproducible'],
      ],
      content: JSON.stringify({ description: 'ok', content: 'ok' }),
    });
    eventSanitize(event);
    assert.equal(event.tags.find(tag => tag[0] === 'i')[1], LEGIT_APP_ID);
    assert.equal(event.tags.find(tag => tag[0] === 'version')[1], LEGIT_VERSION);
    assert.equal(event.tags.find(tag => tag[0] === 'platform')[1], LEGIT_PLATFORM);
    assert.equal(event.tags.find(tag => tag[0] === 'x')[1], SAFE_HASH);
    assert.equal(event.tags.find(tag => tag[0] === 'status')[1], 'reproducible');
  });

  test('eventSanitize preserves apostrophes in description text', () => {
    // Descriptions are shown as text, not inside single-quoted handlers. Stripping every
    // apostrophe would mangle normal English copy without improving attribute safety.
    const event = makeEvent({
      tags: [['i', LEGIT_APP_ID]],
      content: JSON.stringify({ description: LEGIT_DESCRIPTION, content: 'body' }),
    });
    eventSanitize(event);
    const parsed = JSON.parse(event.content);
    assert.equal(parsed.description, LEGIT_DESCRIPTION);
  });

  test('eventSanitize preserves dots, hyphens and colons used in real identifiers', () => {
    const hardwareId = 'hardware:coldcard-mk4';
    const event = makeEvent({
      tags: [
        ['i', hardwareId],
        ['version', '6.5.0X'],
        ['platform', 'hardware'],
      ],
      content: '{}',
    });
    eventSanitize(event);
    assert.equal(event.tags.find(tag => tag[0] === 'i')[1], hardwareId);
    assert.equal(event.tags.find(tag => tag[0] === 'version')[1], '6.5.0X');
    assert.equal(event.tags.find(tag => tag[0] === 'platform')[1], 'hardware');
  });

  test('getVerificationHashList accepts uppercase and mixed-case hex', () => {
    assert.deepEqual(
      getVerificationHashList(makeEvent({ tags: [['x', UPPER_HASH]] })),
      [UPPER_HASH],
    );
  });

  test('verification card with legitimate values still exposes them for UI wiring', () => {
    const html = renderVerificationCard({
      attestation: makeAttestation({
        id: SAFE_ID,
        pubkey: SAFE_PUBKEY,
        tags: [['status', 'reproducible']],
      }),
      sha256HashKey: SAFE_HASH,
      identifier: LEGIT_APP_ID,
      platform: LEGIT_PLATFORM,
      isMyDraft: false,
    });
    assert.match(html, new RegExp(SAFE_HASH));
    assert.match(html, new RegExp(SAFE_ID));
    assert.match(html, new RegExp(LEGIT_APP_ID.replace(/\./g, '\\.')));
    assert.match(html, new RegExp(LEGIT_PLATFORM));
    assert.match(html, /reproducible|Reproducible/i);
  });

  test('action link with legitimate values keeps a usable new_verification href', () => {
    const html = renderVerificationActionLink({
      identifier: LEGIT_APP_ID,
      version: LEGIT_VERSION,
      platform: LEGIT_PLATFORM,
      label: 'Create verification',
    });
    assert.match(html, /^<a /);
    assert.match(html, /href="\/new_verification\/\?[^"]*"/);
    assert.match(html, new RegExp(`appId=${LEGIT_APP_ID.replace(/\./g, '\\.')}`));
    assert.match(html, new RegExp(`version=${LEGIT_VERSION.replace(/\./g, '\\.')}`));
    assert.match(html, new RegExp(`platform=${LEGIT_PLATFORM}`));
    assert.match(html, />Create verification</);
  });

  test('blossom button with legitimate values keeps download wiring attributes', () => {
    const html = renderBlossomDownloadButton({
      downloadHash: SAFE_HASH,
      identifier: LEGIT_APP_ID,
      platform: LEGIT_PLATFORM,
      version: LEGIT_VERSION,
      sanitizedFileName: 'zeus-v0.9.0-rc1.apk',
      bundleFilesAttr: '',
      downloadTitle: 'Download from Blossom',
      bundleFileCount: 1,
    });
    assert.match(html, new RegExp(`id="blossom-${SAFE_HASH}"`));
    assert.match(html, new RegExp(`data-appid="${LEGIT_APP_ID.replace(/\./g, '\\.')}"`));
    assert.match(html, new RegExp(`data-platform="${LEGIT_PLATFORM}"`));
    assert.match(html, new RegExp(`data-version="${LEGIT_VERSION.replace(/\./g, '\\.')}"`));
    assert.match(html, /data-filename="zeus-v0\.9\.0-rc1\.apk"/);
    assert.match(html, /class="[^"]*blossom-download/);
  });

  test('version/description render keeps readable legitimate copy', () => {
    const { versionFragment, descriptionCell, mobileDescription } = renderAssetVersionDescriptionHtml({
      version: LEGIT_VERSION,
      itemDescription: LEGIT_DESCRIPTION,
    });
    assert.match(versionFragment, new RegExp(LEGIT_VERSION.replace(/\./g, '\\.')));
    assert.match(descriptionCell, /Wallet's binary doesn't match the build from source/);
    assert.match(mobileDescription, /Wallet's binary doesn't match the build from source/);
  });

  test('issue tracker keeps a normal https URL', () => {
    const url = 'https://github.com/ZeusLN/zeus/issues/1234';
    const html = buildIssueTrackerLinkHtml(url);
    assert.match(html, new RegExp(`href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('endorsement button with legitimate ids still targets the verification', () => {
    const html = buildEndorsementButtonHtml(SAFE_ID, SAFE_HASH);
    assert.match(html, new RegExp(SAFE_ID));
    assert.match(html, new RegExp(SAFE_HASH));
    assert.match(html, /Endorse this verification/);
  });

  test('attachment meta with legitimate wallet fields stays readable', () => {
    const html = buildAttachmentVerificationMetaHtml({
      walletTitle: 'Zeus',
      identifier: LEGIT_APP_ID,
      platform: LEGIT_PLATFORM,
      version: LEGIT_VERSION,
    });
    assert.match(html, /Zeus/);
    assert.match(html, new RegExp(LEGIT_PLATFORM));
    assert.match(html, new RegExp(LEGIT_VERSION.replace(/\./g, '\\.')));
  });
});
