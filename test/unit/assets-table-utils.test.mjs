import './setup.mjs';
import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatZapAmount,
  formatCommentDate,
  getAttachmentInfo,
  getStatusIcon,
} from '../../src/assets-table-utils.mjs';
import { codeSnippetKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

describe('formatZapAmount', () => {
  test('formats large amounts with K and M suffixes', () => {
    assert.equal(formatZapAmount(500), '500');
    assert.equal(formatZapAmount(2500), '2.5K');
    assert.equal(formatZapAmount(2_500_000), '2.5M');
  });
});

describe('formatCommentDate', () => {
  test('shows relative minutes for recent comments', () => {
    const now = 1_700_000_000;
    mock.timers.enable({ now: now * 1000 });
    try {
      assert.equal(formatCommentDate(now - 30), 'Just now');
      assert.equal(formatCommentDate(now - 120), '2 minutes ago');
      assert.equal(formatCommentDate(now - 7200), '2 hours ago');
      assert.equal(formatCommentDate(now - 86400), '1 day ago');
    } finally {
      mock.timers.reset();
    }
  });
});

describe('getAttachmentInfo', () => {
  test('builds name from code snippet tags', () => {
    const attachment = makeEvent({
      kind: codeSnippetKind,
      tags: [['name', 'build'], ['extension', 'sh'], ['size', '2048']],
    });
    assert.deepEqual(getAttachmentInfo(attachment), { name: 'build.sh', sizeInKb: 2 });
  });

  test('uses filename tag for non-snippet attachments', () => {
    const attachment = makeEvent({
      kind: 1063,
      tags: [['filename', 'output.cast'], ['size', '10240']],
    });
    assert.deepEqual(getAttachmentInfo(attachment), { name: 'output.cast', sizeInKb: 10 });
  });
});

describe('getStatusIcon', () => {
  test('maps reproducible status to checkmark', () => {
    assert.equal(getStatusIcon('reproducible'), '✅');
    assert.equal(getStatusIcon('not_reproducible'), '❌');
  });
});
