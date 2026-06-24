/* ==========================================================================
   Site-wide UI scripts
   ========================================================================== */

import { fitVids } from './fit-vids.js';
import { initGreedyNavigation } from './greedy-navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  if (main) {
    fitVids(main);
  }
  initGreedyNavigation();
});
