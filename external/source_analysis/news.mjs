/**
 * The advisories that became public in the last NEWS_DAYS days and the
 * wallets with a release that depends on an affected version, written as news.json into the export directory after signals.json
 * (index.mjs), for the site's /news/ page. A join of files the export
 * already has, so the page does not load every app file:
 *
 *   signals.json   `published`, the day each advisory became public
 *   index.json     the exported apps
 *   apps/<id>.json each release's advisories and publication day
 *                  (releasedAt), newest release first
 *
 * Per wallet it lists the releases carrying the advisory: the newest working
 * one, and any published in the last NEWS_RELEASE_MONTHS months. The page
 * filters on them (newest release only, or released in the last 1/3/6 months).
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
export const NEWS_RELEASE_MONTHS = 6;

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
 * Returns { schema, date, days, since, releasesSince, advisories } where
 * advisories holds, newest first, each advisory published on or after `since`
 * with the wallets that carry it in their newest working release or in a
 * release published on or after `releasesSince`; or null without publication dates.
 * Each wallet: { appId, releases: [{ ref, releasedAt, newest, version, scope, direct }] }, newest first.
 */
export function newsOf({ index, appDoc, signals, now = new Date(), days = NEWS_DAYS, releaseMonths = NEWS_RELEASE_MONTHS }) {
  const published = signals?.published;
  if (!published || !Object.keys(published).length) return null;
  const since = new Date(now.getTime() - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - releaseMonths);
  const releasesSince = cutoff.toISOString().slice(0, 10);
  const byId = new Map();
  for (const { appId } of index?.apps || []) {
    const doc = appDoc(appId);
    // Newest first; releases whose analysis failed are skipped, as the panel does.
    const working = (doc?.releases || []).filter(r => (r.status || 'ok') === 'ok');
    const releases = working.filter((r, i) => i === 0 || (r.releasedAt && r.releasedAt >= releasesSince));
    for (const release of releases) {
      for (const a of release.advisories || []) {
        const day = publishedDay(a, published);
        if (!day || day < since) continue;
        let entry = byId.get(a.id);
        if (!entry) {
          entry = { id: a.id, aliases: a.aliases || [], published: day, severity: a.severity, summary: a.summary, ecosystem: a.ecosystem, package: a.package, wallets: [] };
          byId.set(a.id, entry);
        }
        let wallet = entry.wallets.find(w => w.appId === appId);
        if (!wallet) {
          wallet = { appId, releases: [] };
          entry.wallets.push(wallet);
        }
        if (!wallet.releases.some(r => r.ref === release.ref)) {
          wallet.releases.push({ ref: release.ref, releasedAt: release.releasedAt || null, newest: release === working[0], version: a.version, scope: a.scope ?? null, direct: a.direct ?? null });
        }
      }
    }
  }
  // Newest day first; within a day the worst severity, then the most wallets.
  const rank = s => (SEVERITY_ORDER.includes(s) ? SEVERITY_ORDER.indexOf(s) : SEVERITY_ORDER.length);
  const advisories = [...byId.values()].sort((x, y) => y.published.localeCompare(x.published) || rank(x.severity) - rank(y.severity) ||
    y.wallets.length - x.wallets.length || x.id.localeCompare(y.id));
  for (const a of advisories) a.wallets.sort((x, y) => x.appId.localeCompare(y.appId));
  return { schema: 2, date: now.toISOString().slice(0, 10), days, since, releasesSince, advisories };
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
