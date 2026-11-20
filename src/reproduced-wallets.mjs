// /reproduced/: the wallet versions verifiers have reproduced, newest first, by month.
// Drawn from the same global load as the Asset Registry (window.allAssetInformation),
// so it shows what the registry shows.

import { verificationKind } from './nostr-constants.mjs';
import { reproducedRows, groupByMonth } from './reproduced-wallets-model.mjs';
import { whenAllWalletsLoaded } from './assets-table-utils.mjs';
import { el } from './html-utils.mjs';

const PAGE_ROWS = 100;

function monthLabel(key) {
  return new Date(`${key}-01T00:00:00Z`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', timeZone: 'UTC' });
}

function dayLabel(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

function rowNode(row) {
  const name = row.url
    ? el('a', { href: row.url }, row.title)
    : el('span', {}, row.title);
  const note = [];
  note.push(plural(row.verifiers, 'verifier', 'verifiers'));
  if (row.against) {
    note.push(`${plural(row.against, 'verifier', 'verifiers')} could not reproduce it`);
  }
  return el('li', { className: 'reproduced__row' },
    el('time', { className: 'reproduced__date', datetime: new Date(row.date * 1000).toISOString() }, dayLabel(row.date)),
    el('span', { className: 'reproduced__wallet' }, name, ' ', el('span', { className: 'reproduced__version' }, row.version),
      row.platform ? el('span', { className: 'reproduced__platform' }, ` ${row.platform}`) : null),
    el('span', { className: 'reproduced__who' }, note.join(' · ')));
}

export function renderReproduced(root, { rows, summary }, shown = PAGE_ROWS) {
  root.replaceChildren();
  if (!rows.length) {
    root.append(el('p', { className: 'reproduced__status' }, 'No reproduced wallets found yet.'));
    return;
  }
  root.append(el('p', { className: 'reproduced__lead' },
    `${plural(summary.wallets, 'wallet', 'wallets')} with ${plural(summary.versions, 'version', 'versions')} reproduced from source. `,
    `In the last 30 days: ${plural(summary.recentVersions, 'version', 'versions')} of ${plural(summary.recentWallets, 'wallet', 'wallets')}.`));
  let left = shown;
  for (const group of groupByMonth(rows)) {
    if (left <= 0) {
      break;
    }
    const slice = group.rows.slice(0, left);
    left -= slice.length;
    root.append(el('h2', { className: 'reproduced__month' }, monthLabel(group.key)),
      el('ul', { className: 'reproduced__list' }, ...slice.map(rowNode)));
  }
  if (rows.length > shown) {
    const more = el('button', { type: 'button', className: 'btn btn--primary reproduced__more' }, `Show more (${rows.length - shown} left)`);
    more.addEventListener('click', () => renderReproduced(root, { rows, summary }, shown + PAGE_ROWS));
    root.append(more);
  }
}

async function paint() {
  const root = document.getElementById('reproducedWallets');
  const info = window.allAssetInformation;
  if (!root || !info?.verifications) {
    return;
  }
  await whenAllWalletsLoaded();
  const events = [];
  for (const group of info.verifications.values()) {
    for (const event of group) {
      if (event.kind === verificationKind) {
        events.push(event);
      }
    }
  }
  renderReproduced(root, reproducedRows([...new Map(events.map(e => [e.id, e])).values()], window.wallets));
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'none';
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('allAssetInformationLoaded', () => { void paint(); });
  window.addEventListener('verificationsUILoaded', () => { if (window.allAssetInformation) { void paint(); } });
}
