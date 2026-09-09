/* ==========================================================================
   Site-wide UI scripts
   ========================================================================== */

import { fitVids } from './fit-vids.js';
import { initGreedyNavigation } from './greedy-navigation.js';
import { wsIcon } from '../../src/icon.mjs';

// Icon helper for scripts that are not bundled (searchWallets.js, landingPageWalletGrid.js, ...)
// and for inline scripts in templates.
window.wsIcon = wsIcon;

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  if (main) {
    fitVids(main);
  }
  initGreedyNavigation();
});
