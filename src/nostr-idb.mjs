const DB_NAME = 'WalletScrutinyDB';
const DB_VERSION = 4;
const EVENTS_STORE = 'events';
const PROFILES_STORE = 'profiles';

let dbOpenPromise = null;

const initDB = () => {
  if (dbOpenPromise) {
    return dbOpenPromise;
  }

  dbOpenPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      dbOpenPromise = null;
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      dbOpenPromise = null;
      reject('IndexedDB error: ' + event.target.errorCode);
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const oldVersion = event.oldVersion;

      // v4: drop stale events from incomplete pre-pagination-fix syncs; profiles are kept.
      if (oldVersion > 0 && oldVersion < 4 && db.objectStoreNames.contains(EVENTS_STORE)) {
        db.deleteObjectStore(EVENTS_STORE);
        console.log('Cleared events store for IDB v4 migration');
      }

      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        const eventsStore = db.createObjectStore(EVENTS_STORE, { keyPath: 'id' });
        eventsStore.createIndex('created_at', 'created_at', { unique: false });
        eventsStore.createIndex('kind', 'kind', { unique: false });
        eventsStore.createIndex('kind_createdAt', ['kind', 'created_at'], { unique: false });
        eventsStore.createIndex('pubkey', 'pubkey', { unique: false });
        console.log('Created events object store with indexes');
      }

      if (!db.objectStoreNames.contains(PROFILES_STORE)) {
        const profilesStore = db.createObjectStore(PROFILES_STORE, { keyPath: 'pubkey' });
        profilesStore.createIndex('cached_at', 'cached_at', { unique: false });
        console.log('Created profiles object store');
      }
    };
  });

  return dbOpenPromise;
};

export function eventHasTagValue(event, tagName, values) {
  const wanted = Array.isArray(values) ? values : [values];
  if (!wanted.length) {
    return false;
  }
  const wantedSet = new Set(wanted);
  return (event.tags ?? []).some(tag => tag[0] === tagName && wantedSet.has(tag[1]));
}

export function missingEventIds(requestedIds, cachedEvents) {
  const have = new Set((cachedEvents ?? []).map(event => event.id));
  return [...new Set((requestedIds ?? []).filter(Boolean))].filter(id => !have.has(id));
}

export function eventMatchesQuery(event, {
  appId = null,
  sha256 = null,
  pubkey = null,
  tagName = null,
  tagValues = null,
} = {}) {
  if (pubkey && event.pubkey !== pubkey) {
    return false;
  }

  if (appId) {
    const appIds = Array.isArray(appId) ? appId : [appId];
    const eventAppId = event.tags?.find(tag => tag[0] === 'i')?.[1];
    if (!eventAppId || !appIds.includes(eventAppId)) {
      return false;
    }
  }

  if (sha256) {
    const hashes = event.tags?.filter(tag => tag[0] === 'x').map(tag => tag[1]) ?? [];
    if (!hashes.includes(sha256)) {
      return false;
    }
  }

  if (tagName != null && tagValues != null) {
    if (!eventHasTagValue(event, tagName, tagValues)) {
      return false;
    }
  }

  return true;
}

export function eventTimeRange(events) {
  let oldest = null;
  let newest = null;
  for (const event of events) {
    if (!event.created_at) {
      continue;
    }
    if (newest === null || newest < event.created_at) {
      newest = event.created_at;
    }
    if (oldest === null || event.created_at < oldest) {
      oldest = event.created_at;
    }
  }
  return { oldest, newest };
}

/**
 * Save events to IDB as-is. Deduplication happens when reading (hash+pubkey for verifications).
 * @param {Array|Set} events
 * @returns {Promise<number>} Number of events saved
 */
export const saveEventsToIDB = async (events) => {
  const db = await initDB().catch(() => null);
  if (!db) {
    return 0;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(EVENTS_STORE);

    let savedCount = 0;
    const eventsArray = Array.isArray(events) ? events : Array.from(events);

    eventsArray.forEach(event => {
      const rawEvent = event.rawEvent ? event.rawEvent() : (event.toNostrEvent ? event.toNostrEvent() : event);
      const request = objectStore.put(rawEvent);
      request.onsuccess = () => savedCount++;
    });

    transaction.oncomplete = () => {
      console.debug(`Saved ${savedCount} events to IDB`);
      resolve(savedCount);
    };
    transaction.onerror = () => reject('Error saving events to IDB');
  });
};

/**
 * Removes a single Nostr event from the IndexedDB cache (events store keyPath: id).
 * Used after publishing a deletion (kind 5) so reload does not resurrect stale data.
 */
export const deleteCachedEventById = async (eventId) => {
  if (!eventId) {
    return;
  }
  const db = await initDB().catch(() => null);
  if (!db) {
    return;
  }

  return new Promise((resolve) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(EVENTS_STORE);
    const request = objectStore.delete(eventId);
    request.onerror = () => {
      console.warn('Failed to remove event from IDB cache:', eventId, request.error);
    };
    transaction.oncomplete = () => {
      console.debug(`Removed event ${eventId} from IDB cache`);
      resolve();
    };
    transaction.onerror = () => {
      console.warn('IDB transaction error removing cached event:', eventId);
      resolve();
    };
  });
};

/**
 * Get events from IDB with optional filtering, newest first.
 * @returns {Promise<Array>}
 */
export const getEventsFromIDB = async ({
  kinds = null,
  since = null,
  until = null,
  limit = null,
  appId = null,
  sha256 = null,
  pubkey = null,
  tagName = null,
  tagValues = null,
} = {}) => {
  const db = await initDB().catch(() => null);
  if (!db) {
    return [];
  }

  const query = { appId, sha256, pubkey, tagName, tagValues };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const objectStore = transaction.objectStore(EVENTS_STORE);
    const results = [];
    const index = objectStore.index('created_at');

    let range = null;
    if (since !== null && until !== null) {
      range = IDBKeyRange.bound(since, until);
    } else if (since !== null) {
      range = IDBKeyRange.lowerBound(since);
    } else if (until !== null) {
      range = IDBKeyRange.upperBound(until);
    }

    const request = index.openCursor(range, 'prev');

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const eventData = cursor.value;
        const kindOk = !kinds || kinds.includes(eventData.kind);
        if (kindOk && eventMatchesQuery(eventData, query)) {
          results.push(eventData);
          if (limit && results.length >= limit) {
            resolve(results);
            return;
          }
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = () => reject('Error reading events from IDB');
  });
};

/**
 * Timestamp range of cached events in IDB.
 * @returns {Promise<{oldest: number|null, newest: number|null, count: number}>}
 */
export const getIDBEventRange = async (kinds = null) => {
  const db = await initDB().catch(() => null);
  if (!db) {
    return { oldest: null, newest: null, count: 0 };
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const objectStore = transaction.objectStore(EVENTS_STORE);
    const index = objectStore.index('created_at');

    let oldest = null;
    let newest = null;
    let count = 0;

    const countRequest = objectStore.count();
    countRequest.onsuccess = () => {
      count = countRequest.result;
    };

    const oldestRequest = index.openCursor(null, 'next');
    oldestRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const eventData = cursor.value;
        if (!kinds || kinds.includes(eventData.kind)) {
          oldest = eventData.created_at;
        } else {
          cursor.continue();
          return;
        }
      }

      const newestRequest = index.openCursor(null, 'prev');
      newestRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const eventData = cursor.value;
          if (!kinds || kinds.includes(eventData.kind)) {
            newest = eventData.created_at;
          } else {
            cursor.continue();
            return;
          }
        }

        resolve({ oldest, newest, count });
      };
      newestRequest.onerror = () => reject('Error reading newest event');
    };
    oldestRequest.onerror = () => reject('Error reading oldest event');
  });
};

/**
 * Lookup events by id. Missing ids are omitted from the result.
 * @returns {Promise<Array>}
 */
export const getEventsByIdsFromIDB = async (ids) => {
  const uniqueIds = [...new Set((ids ?? []).filter(Boolean))];
  if (!uniqueIds.length) {
    return [];
  }

  const db = await initDB().catch(() => null);
  if (!db) {
    return [];
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const objectStore = transaction.objectStore(EVENTS_STORE);
    const found = [];
    let pending = uniqueIds.length;

    const finishIfDone = () => {
      pending--;
      if (pending <= 0) {
        resolve(found);
      }
    };

    uniqueIds.forEach(id => {
      const request = objectStore.get(id);
      request.onsuccess = () => {
        if (request.result) {
          found.push(request.result);
        }
        finishIfDone();
      };
      request.onerror = () => finishIfDone();
    });

    transaction.onerror = () => reject('Error reading events by id from IDB');
  });
};
