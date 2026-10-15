/**
 * Who is posting: the browser extension (NIP-07), like everywhere else on the
 * site. Reading needs no identity. The pubkey is kept for the page; a flag in
 * localStorage lets the next page ask the extension again without a click.
 */
import { waitNostr } from 'nip07-awaiter';
import { getUserPubkeyFromSigner } from '../nostr-client.mjs';
import { signedInStorageKey } from './constants.mjs';

const NIP07_WAIT_MS = 3125;

export const NO_EXTENSION_MESSAGE =
  'Posting an opinion needs a Nostr browser extension (NIP-07), for example Alby, nos2x or Flamingo.';

let pubkey = null;
const listeners = new Set();

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

/** Asks the extension for the pubkey; throws when no extension is installed. */
export async function signIn() {
  const nip07 = await waitNostr(NIP07_WAIT_MS);
  if (!nip07) {
    throw new Error(NO_EXTENSION_MESSAGE);
  }
  pubkey = await getUserPubkeyFromSigner();
  storage()?.setItem(signedInStorageKey, '1');
  notify();
  return pubkey;
}

/** Silently signs in again when the user did so on an earlier page. */
export async function restoreSignIn() {
  if (storage()?.getItem(signedInStorageKey) !== '1') {
    return null;
  }
  try {
    return await signIn();
  } catch (error) {
    console.debug('opinions: could not restore the extension sign-in', error?.message ?? error);
    return null;
  }
}

export function signOut() {
  pubkey = null;
  storage()?.removeItem(signedInStorageKey);
  notify();
}
