/**
 * Who is posting: the browser extension (NIP-07), like everywhere else on the
 * site. The pubkey is read once when the page loads. An extension that is
 * present then is the identity for this page; one that is not present leaves
 * the page without an identity. Reading opinions needs no identity.
 */
import { waitNostr } from 'nip07-awaiter';
import { getUserPubkeyFromSigner } from '../nostr-client.mjs';

const NIP07_WAIT_MS = 3125;
const LEGACY_SIGNED_IN_KEY = 'wsOpinionsSignedIn';

export const NO_EXTENSION_MESSAGE =
  'Posting an opinion needs a Nostr browser extension (NIP-07), for example Alby, nos2x or Flamingo.';

export const EXTENSION_DECLINED_MESSAGE =
  'The Nostr extension did not share an account.';

let pubkey = null;
const listeners = new Set();
let extensionCheck = null;
let detection = null;

function notify() {
  for (const listener of listeners) {
    listener(pubkey);
  }
}

export function getPubkey() {
  return pubkey;
}

export function onAuthChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Resolves to whether a NIP-07 extension is present. Extensions inject
 * `window.nostr` after the page starts, so this waits once and remembers the
 * answer for every widget on the page.
 */
export function hasExtension() {
  extensionCheck ??= waitNostr(NIP07_WAIT_MS).then(Boolean, () => false);
  return extensionCheck;
}

/**
 * Adopts the extension account when one is available at load, once per page.
 * A missing or declining extension leaves the pubkey empty for the rest of
 * the page; there is no later sign-in.
 */
export function detectIdentity() {
  detection ??= detectIdentityOnce();
  return detection;
}

async function detectIdentityOnce() {
  storage()?.removeItem(LEGACY_SIGNED_IN_KEY);
  const nip07 = await hasExtension();
  if (!nip07) {
    pubkey = null;
    notify();
    return null;
  }
  try {
    pubkey = await getUserPubkeyFromSigner();
  } catch (error) {
    pubkey = null;
    console.debug('opinions: extension did not provide a pubkey', error?.message ?? error);
  }
  notify();
  return pubkey;
}
