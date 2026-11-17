import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicKey, generateSecretKey } from 'nostr-tools/pure';
import * as nip19 from 'nostr-tools/nip19';

import { readWidgetConfig, toHexPubkey } from '../../src/opinions/config.mjs';
import { buildOpinionDraft, buildReplyDraft, buildReactionDraft, buildDeletionDraft } from '../../src/opinions/nostr.mjs';
import { opinionKind, replyKind, reactionKind, deletionKind } from '../../src/opinions/constants.mjs';
import { opinionAddress, stripOpinionWrapper } from '../../src/opinions/content.mjs';

const PUBKEY = getPublicKey(generateSecretKey());
const NPUB = nip19.npubEncode(PUBKEY);

describe('toHexPubkey', () => {
  test('accepts hex, npub and nprofile; rejects the rest', () => {
    assert.equal(toHexPubkey(PUBKEY.toUpperCase()), PUBKEY);
    assert.equal(toHexPubkey(NPUB), PUBKEY);
    assert.equal(toHexPubkey(nip19.nprofileEncode({ pubkey: PUBKEY, relays: [] })), PUBKEY);
    assert.equal(toHexPubkey('npub1garbage'), null);
    assert.equal(toHexPubkey(''), null);
  });
});

describe('readWidgetConfig', () => {
  const dataset = {
    subject: 'mobile/x',
    subjects: 'android/x,iphone/x',
    header: '******** Opinion about X (mobile)',
    footer: '[Join](https://walletscrutiny.com/mobile/x/)',
    title: 'Opinion about X',
    image: 'https://walletscrutiny.com/images/social/mobile/x.png',
    tags: 'WalletScrutiny,nostrOpinion',
    trustedAuthors: JSON.stringify([NPUB, 'npub1bad']),
    blockedEventIds: JSON.stringify(['A'.repeat(64)]),
    blockedAuthors: 'null',
  };

  test('parses the data attributes written by the include', () => {
    const config = readWidgetConfig(dataset);
    assert.equal(config.zapstoreAppId, '', 'no Zapstore lookup without an Android package id');
    assert.deepEqual(config.subjectKeys, ['mobile/x', 'android/x', 'iphone/x']);
    assert.deepEqual(config.tags, ['WalletScrutiny', 'nostrOpinion']);
    assert.deepEqual([...config.trustedAuthors], [PUBKEY]);
    assert.deepEqual([...config.blockedEventIds], ['a'.repeat(64)]);
    assert.equal(config.blockedAuthors.size, 0);
    assert.match(config.summary, /mobile\/x/);
  });

  test('requires a subject', () => {
    assert.throws(() => readWidgetConfig({}), /data-subject/);
  });

  test('event drafts carry the plugin-compatible tags', () => {
    const config = readWidgetConfig(dataset);
    const draft = buildOpinionDraft(config, { body: 'Nice', sentiment: '1' });
    assert.equal(draft.kind, opinionKind);
    assert.deepEqual(draft.tags.slice(0, 2), [['d', 'mobile/x'], ['sentiment', '1']]);
    assert.ok(draft.tags.some(([name, value]) => name === 't' && value === 'WalletScrutiny'));
    assert.ok(draft.tags.some(([name]) => name === 'published_at'));
    assert.equal(stripOpinionWrapper(draft.content), 'Nice');

    const previous = { ...draft, id: 'prev', pubkey: PUBKEY, tags: [...draft.tags.filter(([n]) => n !== 'published_at'), ['published_at', '42']] };
    const edited = buildOpinionDraft(config, { body: 'Nicer', sentiment: '0', previous });
    assert.deepEqual(edited.tags.find(([name]) => name === 'published_at'), ['published_at', '42']);

    const opinion = { ...draft, id: 'op', pubkey: PUBKEY };
    const replyDraft = buildReplyDraft({ opinion, target: opinion, body: 'thanks' });
    assert.equal(replyDraft.kind, replyKind);
    assert.deepEqual(replyDraft.tags[0], ['a', opinionAddress(opinion)]);
    assert.deepEqual(replyDraft.tags[1], ['e', 'op', '', 'root']);
    assert.ok(!replyDraft.tags.some((tag) => tag[3] === 'reply'));

    const nested = buildReplyDraft({ opinion, target: { id: 'r1', pubkey: 'c'.repeat(64), kind: 1, tags: [] }, body: 'x' });
    assert.ok(nested.tags.some((tag) => tag[0] === 'e' && tag[1] === 'r1' && tag[3] === 'reply'));
    assert.equal(nested.tags.filter((tag) => tag[0] === 'p').length, 2);

    const reaction = buildReactionDraft({ opinion, target: opinion, content: '+' });
    assert.equal(reaction.kind, reactionKind);
    assert.equal(reaction.content, '+');

    const deletion = buildDeletionDraft(opinion);
    assert.equal(deletion.kind, deletionKind);
    assert.ok(deletion.tags.some(([name, value]) => name === 'a' && value === opinionAddress(opinion)));
    assert.ok(deletion.tags.some(([name, value]) => name === 'k' && value === String(opinionKind)));
  });
});

describe('readWidgetConfig zapstoreAppId', () => {
  test('keeps the trimmed Android package id for the Zapstore lookup', () => {
    const config = readWidgetConfig({ subject: 'mobile/x', zapstoreAppId: ' com.example.wallet ' });
    assert.equal(config.zapstoreAppId, 'com.example.wallet');
  });
});
