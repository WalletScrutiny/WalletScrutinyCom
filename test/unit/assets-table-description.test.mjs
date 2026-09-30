import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { getRowDescription } from '../../src/assets-table-paint.mjs';
import { verificationKind, assetBundleRegistrationKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

const ASSET_TEXT = 'Blockstream Bitcoin Wallet v5.7.0 (installed from dev.zapstore.app, uploaded by WalletScrutiny Android)';
const BOT_TEXT = 'Automatic verification by WalletScrutiny Build Server';

const asset = (content = ASSET_TEXT, created_at = 100) =>
  makeEvent({ id: `a${created_at}`, kind: assetBundleRegistrationKind, content, created_at });
const verification = (description = BOT_TEXT, created_at = 200) =>
  makeEvent({ id: `v${created_at}`, kind: verificationKind, content: JSON.stringify({ description }), created_at });

describe('getRowDescription', () => {
  test('joins the asset registration and the verification', () => {
    assert.equal(getRowDescription([verification(), asset()]), `${ASSET_TEXT} - ${BOT_TEXT}`);
  });

  test('shows either part alone when the other is missing or empty', () => {
    assert.equal(getRowDescription([asset()]), ASSET_TEXT);
    assert.equal(getRowDescription([verification()]), BOT_TEXT);
    assert.equal(getRowDescription([verification(), asset('  ')]), BOT_TEXT);
  });

  test('uses the newest verification', () => {
    assert.equal(
      getRowDescription([verification('newer', 300), verification('older', 200), asset()]),
      `${ASSET_TEXT} - newer`,
    );
  });

  test('does not repeat the asset text a verification already carries', () => {
    assert.equal(
      getRowDescription([verification(`${ASSET_TEXT} - ${BOT_TEXT}`), asset()]),
      `${ASSET_TEXT} - ${BOT_TEXT}`,
    );
    // The site cuts descriptions to 120 characters, possibly inside the asset text itself.
    assert.equal(getRowDescription([verification(ASSET_TEXT.slice(0, 60)), asset()]), ASSET_TEXT);
  });

  test('collapses newlines in the asset text', () => {
    assert.equal(getRowDescription([verification(), asset('line one\nline two')]), `line one line two - ${BOT_TEXT}`);
  });
});
