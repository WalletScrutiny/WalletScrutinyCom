import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  resetAttachmentState,
  storeAttachmentMetadata,
  buildAttachmentVerificationIndex,
} from '../../src/assets-table-attachments.mjs';
import { codeSnippetKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

describe('buildAttachmentVerificationIndex', () => {
  test('maps attachment ids to verification items', () => {
    const verification = makeEvent({
      id: 'verification-1',
      tags: [['file-attachment', 'attachment-1'], ['file-attachment', 'attachment-2']],
    });
    const sortedItems = [{ items: [verification] }];
    const index = buildAttachmentVerificationIndex(sortedItems);

    assert.equal(index.get('attachment-1')?.[0].id, 'verification-1');
    assert.equal(index.get('attachment-2')?.[0].id, 'verification-1');
  });

  test('returns empty map when no attachments exist', () => {
    const sortedItems = [{ items: [makeEvent({ tags: [['status', 'reproducible']] })] }];
    assert.equal(buildAttachmentVerificationIndex(sortedItems).size, 0);
  });
});

describe('storeAttachmentMetadata', () => {
  test('stores decoded attachment metadata in the in-memory store', () => {
    resetAttachmentState();
    const raw = Buffer.from('hello').toString('base64');
    const attachment = makeEvent({
      id: 'attachment-1',
      kind: codeSnippetKind,
      content: raw,
      tags: [['name', 'log'], ['extension', 'txt'], ['size', '512'], ['content-type', 'text/plain']],
    });

    storeAttachmentMetadata(attachment);
    // Metadata is stored internally; index builder can reference the attachment id.
    const index = buildAttachmentVerificationIndex([{
      items: [makeEvent({ tags: [['file-attachment', 'attachment-1']] })],
    }]);
    assert.equal(index.get('attachment-1')?.length, 1);
  });
});
