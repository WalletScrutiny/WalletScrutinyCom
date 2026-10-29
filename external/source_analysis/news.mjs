/**
 * The advisories that became public in the last NEWS_DAYS days and the
 * wallets whose newest analysed release depends on an affected version,
 * written as news.json into the export directory after signals.json
 * (index.mjs), for the site's /news/ page. A join of files the export
 * already has, so the page does not load every app file:
 *
 *   signals.json   `published`, the day each advisory became public
 *   index.json     the exported apps
 *   apps/<id>.json each release's advisories, newest release first
 *
 * "Published" is the advisory's date, not the day a wallet picked the
 * library up: a wallet that adds an old vulnerable version is not news here.
 * Without publication dates (signals.json missing or without them) nothing
 * is written and the export keeps the previous pass's file.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { safeName } from './export.mjs';

// Worst first, as plugins/osv.mjs sorts findings.
const SEVERITY_ORDER = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];

export const NEWS_DAYS = 14;

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// The day an advisory became public: the earliest date of its id and aliases.
function publishedDay(advisory, published) {
  return [advisory.id, ...(advisory.aliases || [])].map(id => published[id]).filter(Boolean).sort()[0] || null;
}

/**
 * Returns { schema, date, days, since, advisories } where advisories holds,
 * newest first, each advisory published on or after `since` with the wallets
 * whose newest working release carries it; or null without publication dates.
 */
export function newsOf({ index, appDoc, signals, now = new Date(), days = NEWS_DAYS }) {
  const published = signals?.published;
  if (!published || !Object.keys(published).length) return null;
  const since = new Date(now.getTime() - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  const byId = new Map();
  for (const { appId } of index?.apps || []) {
    const doc = appDoc(appId);
    // Newest first; a newer release whose analysis failed is skipped, as the panel does.
    const release = (doc?.releases || []).find(r => (r.status || 'ok') === 'ok');
    if (!release) continue;
    for (const a of release.advisories || []) {
      const day = publishedDay(a, published);
      if (!day || day < since) continue;
      let entry = byId.get(a.id);
      if (!entry) {
        entry = { id: a.id, aliases: a.aliases || [], published: day, severity: a.severity, summary: a.summary, ecosystem: a.ecosystem, package: a.package, wallets: [] };
        byId.set(a.id, entry);
      }
      if (!entry.wallets.some(w => w.appId === appId)) {
        entry.wallets.push({ appId, release: release.ref, version: a.version, scope: a.scope ?? null, direct: a.direct ?? null });
      }
    }
  }
  // Newest day first; within a day the worst severity, then the most wallets.
  const rank = s => (SEVERITY_ORDER.includes(s) ? SEVERITY_ORDER.indexOf(s) : SEVERITY_ORDER.length);
  const advisories = [...byId.values()].sort((x, y) => y.published.localeCompare(x.published) || rank(x.severity) - rank(y.severity) ||
    y.wallets.length - x.wallets.length || x.id.localeCompare(y.id));
  for (const a of advisories) a.wallets.sort((x, y) => x.appId.localeCompare(y.appId));
  return { schema: 1, date: now.toISOString().slice(0, 10), days, since, advisories };
}

// Writes news.json into exportDir; returns { written, advisories, wallets }.
export function buildNews({ exportDir, now = new Date(), days = NEWS_DAYS } = {}) {
  const news = newsOf({
    index: readJson(join(exportDir, 'index.json')),
    appDoc: appId => readJson(join(exportDir, 'apps', `${safeName(appId)}.json`)),
    signals: existsSync(join(exportDir, 'signals.json')) ? readJson(join(exportDir, 'signals.json')) : null,
    now,
    days,
  });
  if (!news) return { written: false, advisories: 0, wallets: 0 };
  writeFileSync(join(exportDir, 'news.json'), JSON.stringify(news));
  return { written: true, advisories: news.advisories.length, wallets: new Set(news.advisories.flatMap(a => a.wallets.map(w => w.appId))).size };
}
