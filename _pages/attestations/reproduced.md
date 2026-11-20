---
layout: archive
title: "Reproduced"
permalink: /reproduced/
---

<div class="reproduced__tabs" role="tablist" aria-label="What was reproduced">
  <button type="button" class="reproduced__tab" role="tab" id="reproduced-tab-wallets" aria-controls="reproduced-panel-wallets" aria-selected="true" data-reproduced-tab="wallets">Wallets</button>
  <button type="button" class="reproduced__tab" role="tab" id="reproduced-tab-dependencies" aria-controls="reproduced-panel-dependencies" aria-selected="false" tabindex="-1" data-reproduced-tab="dependencies">Dependencies</button>
</div>

<div id="reproduced-panel-wallets" role="tabpanel" aria-labelledby="reproduced-tab-wallets">
  <p class="reproduced__intro">
    Wallet versions that verifiers rebuilt from source and found identical to the published app,
    newest first. Each result is a signed verification on Nostr; the date is when the version was
    first reproduced. <a href="/verifications/">How verifications work</a>.
  </p>
  <div id="reproducedWallets" class="reproduced">
    <p class="reproduced__status">Loading…</p>
  </div>
</div>

<div id="reproduced-panel-dependencies" role="tabpanel" aria-labelledby="reproduced-tab-dependencies" hidden>
  <p class="reproduced__intro">
    Packages that wallets ship, rebuilt from source by WalletScrutiny's own rebuilder in a sandbox,
    most shared first, and found byte for byte identical to the file the registry serves.
    The date is when we rebuilt it. Versions Google's OSS Rebuild already attests are not repeated.
  </p>
  <div id="reproducedDependencies" class="reproduced">
    <p class="reproduced__status">Loading…</p>
  </div>
</div>

<style>
  .reproduced__tabs { display: flex; gap: .5em; border-bottom: 2px solid var(--border-color, rgba(128, 128, 128, .35)); margin-bottom: 1.2em; }
  .reproduced__tab { flex: 1; max-width: 16em; padding: .7em 1.2em; font-size: 1.2em; font-weight: 600; background: none; border: 0; border-bottom: 4px solid transparent; margin-bottom: -2px; color: inherit; opacity: .65; cursor: pointer; }
  .reproduced__tab:hover { opacity: 1; }
  .reproduced__tab[aria-selected="true"] { opacity: 1; border-bottom-color: var(--link-color, #12a79d); }
  .reproduced__tab:focus-visible { outline: 2px solid var(--link-color, #12a79d); outline-offset: 2px; }
  .reproduced__lead { font-weight: 600; }
  .reproduced__month { margin: 1.6em 0 .4em; font-size: 1.15em; }
  .reproduced__list { list-style: none; margin: 0; padding: 0; }
  .reproduced__row { display: grid; grid-template-columns: 7.5em 1fr auto; gap: .2em 1em; padding: .45em 0; border-bottom: 1px solid var(--border-color, rgba(128, 128, 128, .25)); align-items: baseline; }
  .reproduced__date, .reproduced__who, .reproduced__platform { color: var(--text-muted, #6b7280); font-size: .9em; }
  .reproduced__version { font-variant-numeric: tabular-nums; opacity: .8; }
  .reproduced__more { margin-top: 1em; }
  @media (max-width: 600px) {
    .reproduced__row { grid-template-columns: 1fr; }
  }
</style>
