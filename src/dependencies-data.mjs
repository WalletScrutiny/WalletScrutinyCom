// Loading what the Dependencies panel (dependencies-panel.mjs) shows: the
// source-analysis export, the dependency statements (site build and relays),
// APK checks, upstream hints and advisory signals.

import { safeName } from './dependencies-panel-model.mjs';
import { DELETION_KIND } from './dependency-triage.mjs';
import { dependencyTriageKind, mainRelayUrl } from './nostr-constants.mjs';
import { fetchEvents } from './nostr-client.mjs';

// Where the export is served from: the analyser copies it to the web server
// after each pass (external/source_analysis/publish.mjs), no site build involved.
export const EXPORT_BASE = (typeof window !== 'undefined' && window.WS_SOURCE_ANALYSIS_BASE) || '/api/source-analysis';
// The triage statements the site build saw and the trusted list
// (scripts/build-dependency-triage.mjs); the relay adds the trusted authors' newer ones.
export const TRIAGE_BASE = (typeof window !== 'undefined' && window.WS_DEPENDENCY_TRIAGE_BASE) || '/api/dependency-triage';
const TRIAGE_RELAY_WAIT_MS = 4000;
export async function fetchJson(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { Accept: 'application/json' } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

// The app's export file, following one alias hop (results are stored under
// the first app id of a repository; the other ids get a stub pointing at it).
export async function loadApp(appId, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  const first = await fetchJson(`${base}/apps/${safeName(appId)}.json`, fetchImpl);
  if (!first) return null;
  if (first.alias && first.appId && first.appId !== appId) {
    return fetchJson(`${base}/apps/${safeName(first.appId)}.json`, fetchImpl);
  }
  return first;
}

// statements.json (scripts/build-dependency-triage.mjs): every statement the
// site build saw, its deletion requests, the trusted authors and the listed
// maintainers; fetched once per base. Empty lists, and `failed`, when it
// cannot be read.
const triageCache = new Map();
export function loadTriage({ triageBase = TRIAGE_BASE, fetchImpl = globalThis.fetch } = {}) {
  if (!triageCache.has(triageBase)) {
    const failed = { trusted: [], maintainers: {}, statements: [], deletions: [], failed: true };
    triageCache.set(triageBase, fetchJson(`${triageBase}/statements.json`, fetchImpl).then(doc => (doc && typeof doc === 'object' ? {
      trusted: Array.isArray(doc.trusted) ? doc.trusted : [],
      maintainers: doc.maintainers && typeof doc.maintainers === 'object' ? doc.maintainers : {},
      statements: Array.isArray(doc.statements) ? doc.statements : [],
      deletions: Array.isArray(doc.deletions) ? doc.deletions : [],
    } : failed), () => failed));
  }
  return triageCache.get(triageBase);
}

// The trusted authors and listed maintainers, `{ trusted, maintainers }`: the
// statement dialog says whether the signer's statement settles rows.
export async function loadTrusted(opts = {}) {
  const { trusted, maintainers } = await loadTriage(opts);
  return { trusted, maintainers };
}

// Whose statements the page asks the relays for (issue 1002): the trusted
// authors and the listed maintainers from statements.json, the only ones
// whose statements settle a row. Everyone else's arrive with the site build.
export function triageAuthors({ trusted = [], maintainers = {} } = {}) {
  return [...new Set([...trusted, ...Object.values(maintainers).flat()])].filter(Boolean);
}

// What the relays have now from `authors` (triageAuthors): their statements
// and their deletion requests. The same relays the site build reads: the
// project relay does not accept the statement kind yet. After the first
// paint, so a slow relay only delays the repaint. [] when none answers in
// time, and without asking when there is nobody to ask for: statements.json
// did not load, so no statement could settle a row anyway, and some relays
// read an empty `authors` as no filter.
export async function liveTriageEvents({ authors = [] } = {}) {
  if (!authors.length) {
    console.warn('Dependencies panel: no trusted authors (statements.json not loaded); not asking the relays');
    return [];
  }
  try {
    const events = await fetchEvents([{ kinds: [dependencyTriageKind], authors }, { kinds: [DELETION_KIND], '#k': [String(dependencyTriageKind)], authors }], { relayUrls: [...new Set([mainRelayUrl, ...eventRelayUrls])], maxWait: TRIAGE_RELAY_WAIT_MS });
    return [...events];
  } catch (error) {
    console.warn('Dependencies panel: relay not reachable for triage statements', error);
    return [];
  }
}

// The released APK's check (apk/<appId>.json), or null.
export async function loadApk(appIds, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  for (const id of [...new Set(appIds.filter(Boolean))]) {
    try {
      const doc = await fetchJson(`${base}/apk/${safeName(id)}.json`, fetchImpl);
      if (doc) return doc;
    } catch {
      return null;
    }
  }
  return null;
}

// The wallet's harvested ignore-file entries (upstream/<appId>.json, from the
// source-analysis export), or null; the same id order as loadTriage.
export async function loadUpstream(appIds, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  for (const id of [...new Set(appIds.filter(Boolean))]) {
    try {
      const doc = await fetchJson(`${base}/upstream/${safeName(id)}.json`, fetchImpl);
      if (doc) return doc;
    } catch {
      return null; // hints are optional; the panel paints without them
    }
  }
  return null;
}

// Public per-CVE signals (scripts/build-advisory-signals.mjs), or null when the build had none.
export async function loadSignals({ base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  try {
    return await fetchJson(`${base}/signals.json`, fetchImpl);
  } catch (error) {
    console.warn('Dependencies panel: signals not reachable', error);
    return null;
  }
}
