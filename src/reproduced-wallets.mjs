// /reproduced/, two tabs. Wallets: the wallet versions verifiers have reproduced, newest first,
// by month, drawn from the same global load as the Asset Registry (window.allAssetInformation),
// so it shows what the registry shows. Dependencies: the packages our dependency rebuilder
// rebuilt and got the registry's file, from the rebuilds.json it publishes on the web host.

import { verificationKind } from './nostr-constants.mjs';
import { reproducedRows, groupByMonth } from './reproduced-wallets-model.mjs';
import { dependencyRows } from './reproduced-dependencies-model.mjs';
import { whenAllWalletsLoaded } from './assets-table-utils.mjs';
import { loadTip } from './source-analysis-export.mjs';
import { walletOf, walletItem } from './used-by-wallets.mjs';
import { wsIcon } from './icon.mjs';
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

/** One line of either list: date, name (a link when there is a page), version, a small tag, a note at the right. */
function rowNode({ date, title, url, external = false, version, tag, note }) {
  const name = url
    ? el('a', external ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: url }, title)
    : el('span', {}, title);
  return el('li', { className: 'reproduced__row' },
    el('time', { className: 'reproduced__date', datetime: new Date(date * 1000).toISOString() }, dayLabel(date)),
    el('span', { className: 'reproduced__wallet' }, name, ' ', el('span', { className: 'reproduced__version' }, version),
      tag ? el('span', { className: 'reproduced__platform' }, ` ${tag}`) : null),
    el('span', { className: 'reproduced__who' }, note));
}

/** A list by month under its lead line, [PAGE_ROWS] rows at a time; [empty] when there are no rows. */
function renderList(root, list, shown = PAGE_ROWS) {
  const { rows, lead, empty, toRow } = list;
  root.replaceChildren();
  if (!rows.length) {
    root.append(el('p', { className: 'reproduced__status' }, empty));
    return;
  }
  root.append(el('p', { className: 'reproduced__lead' }, lead));
  let left = shown;
  for (const group of groupByMonth(rows)) {
    if (left <= 0) {
      break;
    }
    const slice = group.rows.slice(0, left);
    left -= slice.length;
    root.append(el('h2', { className: 'reproduced__month' }, monthLabel(group.key)),
      el('ul', { className: 'reproduced__list' }, ...slice.map(row => rowNode(toRow(row)))));
  }
  if (rows.length > shown) {
    const more = el('button', { type: 'button', className: 'btn btn--primary reproduced__more' }, `Show more (${rows.length - shown} left)`);
    more.addEventListener('click', () => renderList(root, list, shown + PAGE_ROWS));
    root.append(more);
  }
}

export function renderReproduced(root, { rows, summary }) {
  renderList(root, {
    rows,
    empty: 'No reproduced wallets found yet.',
    lead: `${plural(summary.wallets, 'wallet', 'wallets')} with ${plural(summary.versions, 'version', 'versions')} reproduced from source. `
      + `In the last 30 days: ${plural(summary.recentVersions, 'version', 'versions')} of ${plural(summary.recentWallets, 'wallet', 'wallets')}.`,
    toRow: row => ({
      date: row.date, title: row.title, url: row.url, version: row.version, tag: row.platform,
      note: [plural(row.verifiers, 'verifier', 'verifiers'),
        row.against ? `${plural(row.against, 'verifier', 'verifiers')} could not reproduce it` : ''].filter(Boolean).join(' · '),
    }),
  });
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

// "used by 3 wallets", with the info icon of the wallet page's Used by that lists them in the
// panel's tip when the row names them and [tip] (loadTip) is there. One entry per listing,
// by name; built when it opens, so it names the wallets allWallets.js brought in meanwhile.
function usedByNote(row, tip) {
  if (!row.wallets) {
    return '';
  }
  const text = `used by ${plural(row.wallets, 'wallet', 'wallets')}`;
  if (!tip || !row.walletIds?.length) {
    return text;
  }
  const trigger = tip.tipTrigger(el('span', { html: wsIcon('circle-info') }), () => {
    const byWallet = new Map();
    for (const appId of row.walletIds) {
      const wallet = walletOf(appId);
      byWallet.set(wallet?.url || appId, { wallet, appId });
    }
    const items = [...byWallet.values()]
      .sort((x, y) => (x.wallet?.title || x.appId).localeCompare(y.wallet?.title || y.appId))
      .map(({ wallet, appId }) => walletItem(wallet, appId));
    return [el('p', {}, 'Wallets that ship ', el('strong', {}, row.name), ` ${row.version}:`), el('ul', { className: 'dp-tip__wallets' }, ...items)];
  }, { className: 'dp-products-info' });
  trigger.setAttribute('aria-label', `Which wallets ship ${row.name} ${row.version}`);
  return el('span', {}, text, trigger);
}

export function renderDependencies(root, result, tip = null) {
  if (!result) {
    root.replaceChildren(el('p', { className: 'reproduced__status' }, 'The rebuild results could not be read.'));
    return;
  }
  const { rows, summary } = result;
  renderList(root, {
    rows,
    empty: 'No dependency has been rebuilt yet.',
    lead: `${plural(summary.reproduced, 'version', 'versions')} of ${plural(summary.packages, 'package', 'packages')} rebuilt from source and identical to the registry's file. `
      + `In the last 30 days: ${plural(summary.recent, 'version', 'versions')}.`,
    toRow: row => ({
      date: row.date, title: row.name, url: row.url, external: true, version: row.version, tag: row.ecosystem,
      note: usedByNote(row, tip),
    }),
  });
}

let dependenciesLoaded = false;

export async function loadDependencies(fetchImpl = fetch, tipLoader = loadTip) {
  const root = document.getElementById('reproducedDependencies');
  if (!root || dependenciesLoaded) {
    return;
  }
  dependenciesLoaded = true;
  const tip = tipLoader();
  try {
    const response = await fetchImpl(FEED_URL, { cache: 'no-cache' });
    if (response.status === 404) {
      root.replaceChildren(el('p', { className: 'reproduced__status' }, 'No dependency has been rebuilt yet.'));
      return;
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const feed = await response.json();
    renderDependencies(root, dependencyRows(feed), await tip);
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
