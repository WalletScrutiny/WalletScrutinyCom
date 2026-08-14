import {
  connectNostr,
  disconnectNostr,
  getPool,
  getUserPubkeyFromSigner,
} from './nostr-client.mjs';
import { writeRelayUrls } from './nostr-constants.mjs';
import { waitNostr } from 'nip07-awaiter';
import { showToast } from './toast.mjs';

let connectionPromise = null;
let signerReadyPromise = null;
let hasNip07Signer = false;
let resolveNostrConnectInitiated;
const nostrConnectInitiatedPromise = new Promise(resolve => {
  resolveNostrConnectInitiated = resolve;
});

const connectTimeout = 5;
const nip07WaitTimeoutMs = 3125;

export async function getNostrPool() {
  await ensureNostrSession();
  return getPool();
}

async function assignSigner() {
  const nip07 = await waitNostr(nip07WaitTimeoutMs);
  if (nip07) {
    console.debug("Signer: Using browser extension");
    hasNip07Signer = true;
    return;
  }

  hasNip07Signer = false;
  console.debug("Signer: No browser extension available");
}

export function nostrConnect() {
  let resolveSignerReady;
  signerReadyPromise = new Promise((resolve) => {
    resolveSignerReady = resolve;
  });

  connectionPromise = (async () => {
    try {
      await connectNostr({
        relayUrls: writeRelayUrls,
        connectTimeoutMs: connectTimeout * 1000,
        onRelayConnect: (relay) => {
          console.debug(`Connected to relay: ${relay.url}`);
        },
        onRelayDisconnect: (relay) => {
          console.debug(`Disconnected from relay: ${relay.url}`);
        },
        onRelayError: (relay, error) => {
          console.debug(`Relay error (${relay.url}):`, error);
        },
      });
      console.log("Nostr connected successfully.");
      void assignSigner().finally(() => resolveSignerReady());
    } catch (e) {
      console.error("nostr connect failed", e);
      if (typeof window !== 'undefined') {
        showToast('It was impossible to connect to Nostr. Please check your browser extension and try again.', 'error');
      }
      resolveSignerReady();
      throw e;
    }
  })();

  resolveNostrConnectInitiated();
  console.debug("nostrConnect initiated, connectionPromise is set.");

  return connectionPromise;
}

export async function ensureNostrSession() {
  if (!connectionPromise) {
    await nostrConnectInitiatedPromise;
  }
  await connectionPromise;
  if (!getPool()) {
    throw new Error("Nostr pool not initialized after connection.");
  }
}

export async function ensureSignerReady() {
  await ensureNostrSession();
  if (signerReadyPromise) {
    await signerReadyPromise;
  }
}

export function isNip07SignerAvailable() {
  return hasNip07Signer;
}

export async function getUserPubkey() {
  await ensureSignerReady();
  if (!hasNip07Signer) {
    throw new Error("No signer available");
  }
  return getUserPubkeyFromSigner();
}

export function cleanupNostrSession() {
  try {
    disconnectNostr();
    connectionPromise = null;
    signerReadyPromise = null;
    hasNip07Signer = false;
    console.warn("Nostr cleanup completed");
  } catch (error) {
    console.error("Error during Nostr cleanup:", error);
  }
}
