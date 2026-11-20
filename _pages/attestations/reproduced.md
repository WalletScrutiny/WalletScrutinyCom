---
layout: archive
title: "Reproduced wallets"
permalink: /reproduced/
---

<p class="reproduced__intro">
  Wallet versions that verifiers rebuilt from source and found identical to the published app,
  newest first. Each result is a signed verification on Nostr; the date is when the version was
  first reproduced. <a href="/verifications/">How verifications work</a>.
</p>

<div id="reproducedWallets" class="reproduced">
  <p class="reproduced__status">Loading…</p>
</div>

<style>
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
