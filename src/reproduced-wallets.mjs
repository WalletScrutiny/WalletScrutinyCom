// /reproduced/, two tabs. Wallets: the wallet versions verifiers have reproduced, newest first,
// by month, drawn from the same global load as the Asset Registry (window.allAssetInformation),
// so it shows what the registry shows. Dependencies: the packages our dependency rebuilder
// rebuilt and got the registry's file, from the rebuilds.json it publishes on the web host.

import { verificationKind } from './nostr-constants.mjs';
import { reproducedRows, groupByMonth } from './reproduced-wallets-model.mjs';
import { dependencyRows } from './reproduced-dependencies-model.mjs';
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
  window.addEventListener('verificationsUILoaded', initTabs, { once: true });
  window.addEventListener('allAssetInformationLoaded', () => { void paint(); });
  window.addEventListener('verificationsUILoaded', () => { if (window.allAssetInformation) { void paint(); } });
}

const FEED_URL = `${(typeof window !== 'undefined' && window.WS_DEP_REBUILDER_BASE) || '/api/dep-rebuilder'}/rebuilds.json`;

function dependencyNode(row) {
  const name = row.url
    ? el('a', { href: row.url, target: '_blank', rel: 'noopener noreferrer' }, `${row.name}`)
    : el('span', {}, row.name);
  const used = row.wallets ? `used by ${plural(row.wallets, 'wallet', 'wallets')}` : '';
  return el('li', { className: 'reproduced__row' },
    el('time', { className: 'reproduced__date', datetime: new Date(row.date * 1000).toISOString() }, dayLabel(row.date)),
    el('span', { className: 'reproduced__wallet' }, name, ' ', el('span', { className: 'reproduced__version' }, row.version),
      el('span', { className: 'reproduced__platform' }, ` ${row.ecosystem}`)),
    el('span', { className: 'reproduced__who' }, used));
}

export function renderDependencies(root, result, shown = PAGE_ROWS) {
  root.replaceChildren();
  if (!result) {
    root.append(el('p', { className: 'reproduced__status' }, 'The rebuild results could not be read.'));
    return;
  }
  const { rows, summary } = result;
  if (!rows.length) {
    root.append(el('p', { className: 'reproduced__status' }, 'No dependency has been rebuilt yet.'));
    return;
  }
  root.append(el('p', { className: 'reproduced__lead' },
    `${plural(summary.reproduced, 'version', 'versions')} of ${plural(summary.packages, 'package', 'packages')} rebuilt from source and identical to the registry's file. `,
    `In the last 30 days: ${summary.recent}.`,
    summary.failed ? ` ${plural(summary.failed, 'other version', 'other versions')} did not rebuild identically and ${summary.failed === 1 ? 'is' : 'are'} not listed.` : ''));
  let left = shown;
  for (const group of groupByMonth(rows)) {
    if (left <= 0) {
      break;
    }
    const slice = group.rows.slice(0, left);
    left -= slice.length;
    root.append(el('h2', { className: 'reproduced__month' }, monthLabel(group.key)),
      el('ul', { className: 'reproduced__list' }, ...slice.map(dependencyNode)));
  }
  if (rows.length > shown) {
    const more = el('button', { type: 'button', className: 'btn btn--primary reproduced__more' }, `Show more (${rows.length - shown} left)`);
    more.addEventListener('click', () => renderDependencies(root, result, shown + PAGE_ROWS));
    root.append(more);
  }
}

let dependenciesLoaded = false;

export async function loadDependencies(fetchImpl = fetch) {
  const root = document.getElementById('reproducedDependencies');
  if (!root || dependenciesLoaded) {
    return;
  }
  dependenciesLoaded = true;
  try {
    const response = await fetchImpl(FEED_URL, { cache: 'no-cache' });
    if (response.status === 404) {
      root.replaceChildren(el('p', { className: 'reproduced__status' }, 'No dependency has been rebuilt yet.'));
      return;
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    renderDependencies(root, dependencyRows(await response.json()));
  } catch (error) {
    console.warn('Rebuilt dependencies not available', error);
    dependenciesLoaded = false;
    renderDependencies(root, null);
  }
}

/** Shows one of the two tabs ('wallets' or 'dependencies'); the dependencies file is read on first use. */
export function selectTab(name) {
  const tabs = document.querySelectorAll('[data-reproduced-tab]');
  for (const tab of tabs) {
    const active = tab.dataset.reproducedTab === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(`reproduced-panel-${tab.dataset.reproducedTab}`);
    if (panel) {
      panel.hidden = !active;
    }
  }
  if (name === 'dependencies') {
    void loadDependencies();
  }
}

function initTabs() {
  const tabs = [...document.querySelectorAll('[data-reproduced-tab]')];
  if (!tabs.length) {
    return;
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      selectTab(tab.dataset.reproducedTab);
      history.replaceState(null, '', tab.dataset.reproducedTab === 'wallets' ? location.pathname : `#${tab.dataset.reproducedTab}`);
    });
    tab.addEventListener('keydown', (event) => {
      const i = tabs.indexOf(tab);
      const next = event.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : event.key === 'ArrowLeft' ? tabs[(i + tabs.length - 1) % tabs.length] : null;
      if (next) {
        event.preventDefault();
        next.focus();
        next.click();
      }
    });
  }
  selectTab(location.hash === '#dependencies' ? 'dependencies' : 'wallets');
}
