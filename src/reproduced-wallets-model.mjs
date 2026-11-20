// The "Reproduced wallets" page, worked out from the published verifications and the site's
// wallet list, so the renderer only draws it. One row per wallet version that at least one
// verifier reproduced; the date is when it was first reproduced.

import { getFirstTagValue } from './verifications_common.mjs';
import { normalizeVersionName } from './build-verifications-model.mjs';

const DAY = 24 * 3600;

/** appId (Android package, iPhone bundle id or the page's own id) → wallet, from window.wallets. */
export function walletIndex(wallets) {
  const index = new Map();
  for (const wallet of wallets || []) {
    for (const id of [wallet.appId, wallet.androidAppId, wallet.iphoneAppId]) {
      if (id && !index.has(id)) {
        index.set(id, wallet);
      }
    }
  }
  return index;
}

/**
 * [verifications]: kind-30301 events. Newest first; versions with no reproducible verdict are
 * left out, but a version that also has a "not reproducible" or "failed to build" verdict says so.
 */
export function reproducedRows(verifications, wallets, now = Math.floor(Date.now() / 1000)) {
  const index = walletIndex(wallets);
  const byVersion = new Map();
  for (const event of verifications) {
    const appId = getFirstTagValue(event, 'i');
    const version = normalizeVersionName(getFirstTagValue(event, 'version'));
    if (!appId || !version) {
      continue;
    }
    const key = `${appId}\n${version}`;
    let entry = byVersion.get(key);
    if (!entry) {
      entry = { appId, version, platform: getFirstTagValue(event, 'platform') || '', reproducedBy: new Set(), against: new Set(), first: Infinity, last: 0 };
      byVersion.set(key, entry);
    }
    const status = getFirstTagValue(event, 'status');
    if (status === 'reproducible') {
      entry.reproducedBy.add(event.pubkey);
      entry.first = Math.min(entry.first, event.created_at);
      entry.last = Math.max(entry.last, event.created_at);
    } else if (status === 'not_reproducible' || status === 'ftbfs') {
      entry.against.add(event.pubkey);
    }
  }
  const rows = [];
  for (const entry of byVersion.values()) {
    if (entry.reproducedBy.size === 0) {
      continue;
    }
    const wallet = index.get(entry.appId) || null;
    rows.push({
      appId: entry.appId,
      version: entry.version,
      platform: entry.platform,
      title: wallet?.title || entry.appId,
      url: wallet?.url || null,
      date: entry.first,
      lastDate: entry.last,
      verifiers: entry.reproducedBy.size,
      against: entry.against.size,
    });
  }
  rows.sort((a, b) => b.date - a.date || a.title.localeCompare(b.title) || b.version.localeCompare(a.version));
  return { rows, summary: summaryOf(rows, now) };
}

function summaryOf(rows, now) {
  const wallets = new Set(rows.map(row => row.title));
  const recent = rows.filter(row => row.date >= now - 30 * DAY);
  return {
    wallets: wallets.size,
    versions: rows.length,
    recentVersions: recent.length,
    recentWallets: new Set(recent.map(row => row.title)).size,
    newest: rows.length ? rows[0].date : null,
  };
}

/** Rows grouped by calendar month (UTC), newest first: [{ key: '2026-11', rows }]. */
export function groupByMonth(rows) {
  const groups = [];
  for (const row of rows) {
    const key = new Date(row.date * 1000).toISOString().slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.rows.push(row);
    } else {
      groups.push({ key, rows: [row] });
    }
  }
  return groups;
}
