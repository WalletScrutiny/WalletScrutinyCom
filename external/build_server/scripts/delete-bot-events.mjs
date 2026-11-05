#!/usr/bin/env node
// Publish NIP-09 deletion requests for verifications the ABS published by
// mistake. Once the relays drop them, the ABS no longer finds its own
// verification for that combination and builds it again.
//
//   node scripts/delete-bot-events.mjs <eventId>...          # dry run
//   node scripts/delete-bot-events.mjs --yes <eventId>...    # publish
//
// It signs with the bot key the service uses (WS_BOT_PK_FILE). That key is a
// systemd encrypted credential, so run it in a transient unit that loads it:
//
//   sudo systemd-run --pipe --wait --collect -q \
//     -p User=build-server -p Group=build-server \
//     -p WorkingDirectory=/opt/build-server/walletScrutinyCom/external/build_server \
//     -p LoadCredentialEncrypted=build-server-ws-bot-pk:/etc/credstore.encrypted/build-server-ws-bot-pk \
//     /bin/sh -c 'WS_BOT_PK_FILE="$CREDENTIALS_DIRECTORY/build-server-ws-bot-pk" exec /usr/bin/node scripts/delete-bot-events.mjs <eventId>...'
//
// Only events authored by the bot are deleted; anything else is reported and
// skipped, since a deletion request signed by another key is ignored anyway.

import fs from 'fs';
import { connectToNostr, getEventsFromEventIds } from '../nostr-utils.mjs';
import { createEventDraft, signEvent, publishEvent, disconnectNostr, getUserPubkeyFromSigner } from '../../../src/nostr-client.mjs';
import { WS_BOT_NOSTR_PUBKEY_HEX } from '../config/config.mjs';

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error('Usage: node scripts/delete-bot-events.mjs [--yes] <eventId>...');
  process.exit(1);
}

const args = process.argv.slice(2);
const publish = args.includes('--yes');
const ids = args.filter(arg => arg !== '--yes');
if (ids.length === 0) usage('no event ids');
const badId = ids.find(id => !/^[0-9a-f]{64}$/.test(id));
if (badId) usage(`not an event id: ${badId}`);

const keyFile = process.env.WS_BOT_PK_FILE;
if (!keyFile) usage('WS_BOT_PK_FILE is not set');
const privateKey = fs.readFileSync(keyFile, 'utf8').trim();

const tag = (event, name) => event.tags.find(t => t[0] === name)?.[1] ?? '';
const describe = event =>
  `${event.id} kind=${event.kind} ${tag(event, 'i')} ${tag(event, 'version')} ${tag(event, 'platform')} ${tag(event, 'status')}`;

try {
  await connectToNostr(privateKey);
  const signerPubkey = await getUserPubkeyFromSigner();
  if (signerPubkey !== WS_BOT_NOSTR_PUBKEY_HEX) {
    throw new Error(`key in WS_BOT_PK_FILE is not the bot key (${signerPubkey})`);
  }

  const events = await getEventsFromEventIds(ids);
  const byId = new Map(events.map(event => [event.id, event]));
  const targets = [];
  for (const id of ids) {
    const event = byId.get(id);
    if (!event) {
      console.log(`not found on the relays, skipped: ${id}`);
    } else if (event.pubkey !== WS_BOT_NOSTR_PUBKEY_HEX) {
      console.log(`not a bot event, skipped: ${describe(event)}`);
    } else {
      targets.push(event);
    }
  }

  if (targets.length === 0) {
    console.log('Nothing to delete.');
  } else {
    // Verifications are addressable, so name them by "a" too: relays then
    // drop the address and not only this one revision.
    const tags = [];
    for (const event of targets) {
      tags.push(['e', event.id]);
      const d = tag(event, 'd');
      if (event.kind >= 30000 && event.kind < 40000 && d) {
        tags.push(['a', `${event.kind}:${event.pubkey}:${d}`]);
      }
    }
    for (const kind of new Set(targets.map(event => event.kind))) {
      tags.push(['k', String(kind)]);
    }
    const draft = createEventDraft({
      kind: 5,
      content: 'Published by the WalletScrutiny Build Server without a binary hash or with the wrong platform',
      tags,
    });

    console.log(`${publish ? 'Deleting' : 'Would delete'} ${targets.length} event(s):`);
    targets.forEach(event => console.log(`  ${describe(event)}`));

    if (!publish) {
      console.log('Dry run. Pass --yes to publish the deletion request.');
    } else {
      const signed = await signEvent(draft);
      const { successful, total } = await publishEvent(signed);
      console.log(`Published deletion request ${signed.id} to ${successful}/${total} relays`);
      if (successful === 0) process.exitCode = 1;
    }
  }
} catch (error) {
  console.error(`Error: ${error?.message ?? error}`);
  process.exitCode = 1;
} finally {
  await disconnectNostr();
  process.exit();
}
