const DB_NAME = 'WalletScrutinyDB';
const DB_VERSION = 5;
const EVENTS_STORE = 'events';
const PROFILES_STORE = 'profiles';

let dbOpenPromise = null;

function createEventsStore(db) {
  const eventsStore = db.createObjectStore(EVENTS_STORE, { keyPath: 'id' });
  eventsStore.createIndex('created_at', 'created_at', { unique: false });
  eventsStore.createIndex('kind', 'kind', { unique: false });
  eventsStore.createIndex('kind_createdAt', ['kind', 'created_at'], { unique: false });
  eventsStore.createIndex('pubkey', 'pubkey', { unique: false });
}

function createProfilesStore(db) {
  const profilesStore = db.createObjectStore(PROFILES_STORE, { keyPath: 'pubkey' });
  profilesStore.createIndex('cached_at', 'cached_at', { unique: false });
}

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
      const transaction = event.target.transaction;
      const oldVersion = event.oldVersion;

      // v4: drop stale events from incomplete pre-pagination-fix syncs; profiles are kept.
      if (oldVersion > 0 && oldVersion < 4 && db.objectStoreNames.contains(EVENTS_STORE)) {
        db.deleteObjectStore(EVENTS_STORE);
        console.log('Cleared events store for IDB v4 migration');
      }

      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        createEventsStore(db);
        console.log('Created events object store with indexes');
      } else {
        const eventsStore = transaction.objectStore(EVENTS_STORE);
        if (!eventsStore.indexNames.contains('kind_createdAt')) {
          eventsStore.createIndex('kind_createdAt', ['kind', 'created_at'], { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(PROFILES_STORE)) {
        createProfilesStore(db);
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
 * Compound index bounds for kind_createdAt ([kind, created_at]).
 * Upper-open [kind, kind+1) covers every timestamp for that kind.
 */
export function kindCreatedAtRangeArgs(kind, since = null, until = null) {
  if (since != null && until != null) {
    return { lower: [kind, since], upper: [kind, until], lowerOpen: false, upperOpen: false };
  }
  if (since != null) {
    return { lower: [kind, since], upper: [kind + 1], lowerOpen: false, upperOpen: true };
  }
  if (until != null) {
    return { lower: [kind], upper: [kind, until], lowerOpen: false, upperOpen: false };
  }
  return { lower: [kind], upper: [kind + 1], lowerOpen: false, upperOpen: true };
}

function kindCreatedAtRange(kind, since = null, until = null) {
  const { lower, upper, lowerOpen, upperOpen } = kindCreatedAtRangeArgs(kind, since, until);
  return IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
}

function createdAtRange(since, until) {
  if (since !== null && until !== null) {
    return IDBKeyRange.bound(since, until);
  }
  if (since !== null) {
    return IDBKeyRange.lowerBound(since);
  }
  if (until !== null) {
    return IDBKeyRange.upperBound(until);
  }
  return null;
}

function scanEvents(db, { indexName, range, limit = null, query = {} }) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const objectStore = transaction.objectStore(EVENTS_STORE);
    const index = objectStore.index(indexName);
    const results = [];
    const request = index.openCursor(range, 'prev');

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (!cursor) {
        resolve(results);
        return;
      }
      const eventData = cursor.value;
      if (eventMatchesQuery(eventData, query)) {
        results.push(eventData);
        if (limit && results.length >= limit) {
          resolve(results);
          return;
        }
      }
      cursor.continue();
    };
    request.onerror = () => reject('Error reading events from IDB');
  });
}

function readKindTimeRange(db, kind) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const index = transaction.objectStore(EVENTS_STORE).index('kind_createdAt');
    const range = kindCreatedAtRange(kind);
    let oldest = null;
    let newest = null;
    let count = 0;

    const countRequest = index.count(range);
    countRequest.onsuccess = () => {
      count = countRequest.result;
    };
    countRequest.onerror = () => reject('Error counting events by kind');

    const oldestRequest = index.openCursor(range, 'next');
    oldestRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        oldest = cursor.value.created_at;
      }
    };
    oldestRequest.onerror = () => reject('Error reading oldest event');

    const newestRequest = index.openCursor(range, 'prev');
    newestRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        newest = cursor.value.created_at;
      }
    };
    newestRequest.onerror = () => reject('Error reading newest event');

    transaction.oncomplete = () => resolve({ oldest, newest, count });
    transaction.onerror = () => reject('Error reading event range from IDB');
  });
}

function mergeRangeResults(ranges) {
  let oldest = null;
  let newest = null;
  let count = 0;
  for (const range of ranges) {
    count += range.count;
    if (range.oldest != null && (oldest === null || range.oldest < oldest)) {
      oldest = range.oldest;
    }
    if (range.newest != null && (newest === null || range.newest > newest)) {
      newest = range.newest;
    }
  }
  return { oldest, newest, count };
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
 * When `kinds` is set, reads the kind_createdAt index instead of scanning every event.
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
  if (Array.isArray(kinds) && kinds.length === 0) {
    return [];
  }

  const db = await initDB().catch(() => null);
  if (!db) {
    return [];
  }

  const query = { appId, sha256, pubkey, tagName, tagValues };

  if (kinds?.length) {
    const pages = [];
    for (const kind of kinds) {
      pages.push(await scanEvents(db, {
        indexName: 'kind_createdAt',
        range: kindCreatedAtRange(kind, since, until),
        limit,
        query,
      }));
    }
    const merged = pages.flat();
    merged.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
    return limit ? merged.slice(0, limit) : merged;
  }

  return scanEvents(db, {
    indexName: 'created_at',
    range: createdAtRange(since, until),
    limit,
    query,
  });
};

/**
 * Timestamp range of cached events in IDB.
 * When `kinds` is set, uses kind_createdAt so the cursor is not mixed with other kinds.
 * @returns {Promise<{oldest: number|null, newest: number|null, count: number}>}
 */
export const getIDBEventRange = async (kinds = null) => {
  if (Array.isArray(kinds) && kinds.length === 0) {
    return { oldest: null, newest: null, count: 0 };
  }

  const db = await initDB().catch(() => null);
  if (!db) {
    return { oldest: null, newest: null, count: 0 };
  }

  if (kinds?.length) {
    const ranges = [];
    for (const kind of kinds) {
      ranges.push(await readKindTimeRange(db, kind));
    }
    return mergeRangeResults(ranges);
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
        oldest = cursor.value.created_at;
      }
    };
    oldestRequest.onerror = () => reject('Error reading oldest event');

    const newestRequest = index.openCursor(null, 'prev');
    newestRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        newest = cursor.value.created_at;
      }
    };
    newestRequest.onerror = () => reject('Error reading newest event');

    transaction.oncomplete = () => resolve({ oldest, newest, count });
    transaction.onerror = () => reject('Error reading event range from IDB');
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

/**
 * Read a cached profile record. TTL / cache-version policy stays in the caller.
 * @returns {Promise<object|null>}
 */
export const getProfileRecord = async (pubkey) => {
  if (!pubkey) {
    return null;
  }

  const db = await initDB().catch(() => null);
  if (!db) {
    return null;
  }

  return new Promise((resolve) => {
    const transaction = db.transaction([PROFILES_STORE], 'readonly');
    const objectStore = transaction.objectStore(PROFILES_STORE);
    const request = objectStore.get(pubkey);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => resolve(null);
  });
};

/**
 * Write a profile record ({ pubkey, profile, cached_at, cache_version }).
 */
export const putProfileRecord = async (record) => {
  if (!record?.pubkey) {
    return;
  }

  const db = await initDB().catch(() => null);
  if (!db) {
    return;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROFILES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(PROFILES_STORE);
    const request = objectStore.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject('Error saving profile to IDB');
  });
};
