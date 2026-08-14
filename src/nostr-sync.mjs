import {
  fetchEvents as defaultFetchEvents,
  fetchEventsWithPagination as defaultFetchEventsWithPagination,
} from './nostr-client.mjs';
import { getIDBEventRange, saveEventsToIDB } from './nostr-idb.mjs';

function resolveDeps(overrides = {}) {
  return {
    getRange: overrides.getRange ?? getIDBEventRange,
    save: overrides.save ?? saveEventsToIDB,
    fetchEvents: overrides.fetchEvents ?? defaultFetchEvents,
    fetchEventsWithPagination: overrides.fetchEventsWithPagination ?? defaultFetchEventsWithPagination,
  };
}

function addAll(target, source) {
  for (const item of source ?? []) {
    target.add(item);
  }
  return target;
}

function buildFilter({ kinds, extraFilter, since, until, limit }) {
  const filter = { ...extraFilter, kinds, since };
  if (until != null) {
    filter.until = until;
  }
  if (limit != null) {
    filter.limit = limit;
  }
  return filter;
}

function singleBatchFetchOptions(paginationOptions = {}) {
  const fetchOptions = {};
  if (paginationOptions.relayUrls) {
    fetchOptions.relayUrls = paginationOptions.relayUrls;
  }
  if (paginationOptions.maxWait != null) {
    fetchOptions.maxWait = paginationOptions.maxWait;
  }
  return fetchOptions;
}

async function fetchEventWindow(filter, {
  singleBatch = false,
  paginationOptions = {},
} = {}, deps) {
  if (singleBatch) {
    return deps.fetchEvents(filter, singleBatchFetchOptions(paginationOptions));
  }
  return deps.fetchEventsWithPagination(filter, paginationOptions);
}

/**
 * Fetch events newer than the cache (and optionally older events to fill a gap), then save to IDB.
 *
 * Multiple kinds are synced independently (one cache cursor and paginated filter per kind)
 * unless `singleBatch` is set. `newest` / `oldest`: pass explicit cache cursors, or omit
 * (`undefined`) to read them from IDB. Pass `null` when the cache for this query is empty
 * so the fetch starts at `sinceFloor`.
 *
 * @returns {Promise<Set>} Newly fetched events (newer + gap), already saved when non-empty
 */
export async function syncDelta({
  kinds,
  extraFilter = {},
  sinceFloor,
  newest,
  oldest,
  fetchNewer = true,
  fillGaps = false,
  gapThresholdSeconds = 0,
  until,
  limit,
  singleBatch = false,
  paginationOptions = {},
} = {}, depsOverride = {}) {
  if (!singleBatch && kinds?.length > 1) {
    const pages = await Promise.all(
      kinds.map(kind => syncDelta({
        kinds: [kind],
        extraFilter,
        sinceFloor,
        newest,
        oldest,
        fetchNewer,
        fillGaps,
        gapThresholdSeconds,
        until,
        limit,
        singleBatch,
        paginationOptions,
      }, depsOverride))
    );
    const merged = new Set();
    for (const page of pages) {
      addAll(merged, page);
    }
    return merged;
  }

  const deps = resolveDeps(depsOverride);
  const fetchOptions = { singleBatch, paginationOptions };

  if (newest === undefined || (fillGaps && oldest === undefined)) {
    const range = await deps.getRange(kinds);
    if (newest === undefined) {
      newest = range.newest;
    }
    if (oldest === undefined) {
      oldest = range.oldest;
    }
  }

  const fetched = new Set();

  if (fetchNewer) {
    const since = newest != null ? newest + 1 : sinceFloor;
    const newer = await fetchEventWindow(
      buildFilter({ kinds, extraFilter, since, until, limit }),
      fetchOptions,
      deps
    );
    addAll(fetched, newer);
  }

  const shouldFillGaps = fillGaps
    && !until
    && !singleBatch
    && oldest != null
    && oldest > sinceFloor + gapThresholdSeconds;

  if (shouldFillGaps) {
    const older = await fetchEventWindow(
      buildFilter({
        kinds,
        extraFilter,
        since: sinceFloor,
        until: oldest - 1,
        limit,
      }),
      { ...fetchOptions, singleBatch: false },
      deps
    );
    addAll(fetched, older);
  }

  if (fetched.size > 0) {
    try {
      await deps.save(fetched);
    } catch (error) {
      console.warn('Failed to save synced events to IDB', error);
    }
  }

  return fetched;
}

/**
 * Run syncDelta over tag values in chunks (relay #e / #v filter limits).
 * Reads the cache cursor once so later batches keep the same since window.
 */
export async function syncDeltaInTagBatches({
  tagName,
  tagValues,
  batchSize = 100,
  extraFilter = {},
  ...syncOptions
} = {}, depsOverride = {}) {
  if (!tagValues?.length) {
    return new Set();
  }

  const deps = resolveDeps(depsOverride);
  let { newest, oldest } = syncOptions;
  if (newest === undefined) {
    const range = await deps.getRange(syncOptions.kinds);
    newest = range.newest;
    if (oldest === undefined) {
      oldest = range.oldest;
    }
  }

  const merged = new Set();
  for (let i = 0; i < tagValues.length; i += batchSize) {
    const batch = tagValues.slice(i, i + batchSize);
    const events = await syncDelta({
      ...syncOptions,
      newest,
      oldest,
      extraFilter: {
        ...extraFilter,
        [`#${tagName}`]: batch,
      },
    }, depsOverride);
    addAll(merged, events);
  }
  return merged;
}
