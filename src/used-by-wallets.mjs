// The wallets behind a "Used by" count, as the shared tip lists them: on the wallet page's
// Dependencies panel (dependencies-panel.mjs) and on /reproduced/ (reproduced-wallets.mjs).

import { el } from './html-utils.mjs';

// The site's listing for an export app id: its own id, or a mobile listing's
// store ids (the same lookup as the /news/ page's wallet chips).
export function walletOf(appId) {
  const wallets = globalThis.window?.wallets || [];
  return wallets.find(w => w.appId === appId && !w.archived) ||
    wallets.find(w => w.androidAppId === appId || w.iphoneAppId === appId) ||
    wallets.find(w => w.appId === appId) || null;
}

/** One wallet of the tip's list: its icon and name, linked to its page when it has one; [extra] after it. */
export function walletItem(wallet, appId, extra = null) {
  const icon = wallet?.icon
    ? el('img', { src: `/images/wIcons/${wallet.iconFolder || wallet.folder}/small/${wallet.icon}`, alt: '', loading: 'lazy' })
    : null;
  const label = wallet?.title || appId;
  return el('li', {}, wallet?.url ? el('a', { href: wallet.url }, icon, label) : el('span', {}, icon, label), extra);
}
