---
layout: archive
title: "Build Verifications on Nostr"
permalink: /verifications/
---

<div class="info-landing-page guide-page">

<div class="contribute-hero">
  <p class="contribute-lead">
    Community members independently reproduce wallet binaries from source and publish signed results on Nostr.
    Explore existing verifications, register new assets, or start your own build verification.
  </p>
</div>

<div class="contribute-grid">
  <a class="contribute-card" href="/assets/">
    <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-folder-open"></i></span>
    <h2 class="contribute-card__title">Asset Registry</h2>
    <p class="contribute-card__desc">Browse wallet binaries registered on the network.</p>
    <span class="contribute-card__cta">Open registry <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
  </a>
  <a class="contribute-card" href="/verifiers/">
    <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-hands-helping"></i></span>
    <h2 class="contribute-card__title">Top Build Verifiers</h2>
    <p class="contribute-card__desc">See who is most active in reproducing wallet builds.</p>
    <span class="contribute-card__cta">View verifiers <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
  </a>
  <a class="contribute-card" href="/new_asset/">
    <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-plus"></i></span>
    <h2 class="contribute-card__title">Register New Asset</h2>
    <p class="contribute-card__desc">Add a binary that is not yet in the registry.</p>
    <span class="contribute-card__cta">Register asset <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
  </a>
  <a class="contribute-card" href="/new_verification/">
    <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-clipboard-check"></i></span>
    <h2 class="contribute-card__title">New Verification</h2>
    <p class="contribute-card__desc">Publish a signed build verification for a known binary.</p>
    <span class="contribute-card__cta">Start verification <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
  </a>
</div>

<section class="verifications-drop-panel" id="start">
  <h2><i class="fas fa-download" aria-hidden="true"></i> Start with a binary</h2>
  <p class="bigScreenOnly">Drop a wallet binary here to look up existing verifications, calculate its SHA256 hash, or begin registering it.</p>
  <p class="smallScreenOnly">Select a wallet binary to look up existing verifications or calculate its SHA256 hash.</p>

  {% include /verifications/dragAndDropArea.html buttonMessage="Drop binary to verify" %}

  <div class="verifications-drop-notes">
    <p>If the <strong>binary is new to the network</strong>, you will be prompted to register it with product and source details so testers know what they are reproducing.</p>
    <p>If the <strong>binary is already known</strong>, you can view existing verifications, access build instructions, or publish your own.</p>
    <p class="note">Not every Bitcoin wallet has verifications yet. This is a community-driven effort.</p>
  </div>
</section>

<section class="guide-section" id="what-are">
  <h2>What are Nostr Build Verifications?</h2>

  <p>Nostr Build Verifications let anyone compile software from source, compare the result to a distributed binary, and share a signed public record of what they found. Verifiers can attach scripts and build logs so others can reproduce the work themselves.</p>

  <ul class="verifications-benefits">
    <li><i class="fas fa-circle-check" aria-hidden="true"></i> Verify builds independently</li>
    <li><i class="fas fa-share-nodes" aria-hidden="true"></i> Store results on decentralized Nostr relays</li>
    <li><i class="fas fa-globe" aria-hidden="true"></i> Make verification outcomes publicly accessible</li>
    <li><i class="fas fa-handshake-angle" aria-hidden="true"></i> Build trust through community participation</li>
  </ul>

  <p>Some verifications are created automatically by the <a href="/automated-build-server/">WalletScrutiny Automated Build Server</a>, which re-runs community-published <code>build.sh</code> scripts when new binaries are registered. To make your script eligible for automatic runs, see the <a href="/automated-build-server/">ABS documentation</a> and the <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/docs/script_verifications.md" target="_blank" rel="noopener noreferrer">script rules on GitLab</a>.</p>
</section>

<section class="guide-section" id="how-it-works">
  <h2>How it works</h2>

  <ol class="guide-steps">
    <li>
      <h3>Find or register a binary</h3>
      <p>Look up a wallet binary in the <a href="/assets/">Asset Registry</a>, or drop a file above to register one that is not listed yet.</p>
    </li>
    <li>
      <h3>Build from source</h3>
      <p>Follow published build instructions or your own process to reproduce the binary locally.</p>
    </li>
    <li>
      <h3>Publish a signed verification</h3>
      <p>Post your result on Nostr with scripts, logs, and a reproducibility verdict for the community.</p>
    </li>
    <li>
      <h3>Others cross-check your work</h3>
      <p>Independent verifiers repeat the process, strengthening trust through reproducible evidence.</p>
    </li>
  </ol>
</section>

<section class="guide-section" id="nostr-updates">
  <h2>Subscribe to verification updates on Nostr</h2>

  <p>When a new wallet build verification is published, <strong>WalletScrutiny Bot</strong> posts a short Nostr note with the app, version, platform, result, and a link back to this site. Follow the bot in your Nostr client:</p>

  <ul class="verifications-copy-list">
    <li class="verifications-copy-row">
      <span class="verifications-copy-row__label">Hex pubkey</span>
      <code class="verifications-copy-row__value" title="168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335">168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335</code>
      <button type="button" class="verifications-copy-btn" aria-label="Copy hex pubkey" onclick="navigator.clipboard.writeText('168b7a2cd8bb9205c3f574de540606d6f4c46717c5164f47373fdcce2b9cd335').then(() => { if (typeof showToast === 'function') showToast('Hex pubkey copied', 'success'); })">
        <i class="fas fa-copy" aria-hidden="true"></i>
      </button>
    </li>
    <li class="verifications-copy-row">
      <span class="verifications-copy-row__label">npub</span>
      <code class="verifications-copy-row__value" title="npub1z69h5txchwfqtsl4wn09gpsx6m6vgechc5ty73eh8lwvu2uu6v6sfwaukf">npub1z69h5txchwfqtsl4wn09gpsx6m6vgechc5ty73eh8lwvu2uu6v6sfwaukf</code>
      <button type="button" class="verifications-copy-btn" aria-label="Copy npub" onclick="navigator.clipboard.writeText('npub1z69h5txchwfqtsl4wn09gpsx6m6vgechc5ty73eh8lwvu2uu6v6sfwaukf').then(() => { if (typeof showToast === 'function') showToast('npub copied', 'success'); })">
        <i class="fas fa-copy" aria-hidden="true"></i>
      </button>
    </li>
  </ul>

  <p><a href="https://primal.net/p/npub1z69h5txchwfqtsl4wn09gpsx6m6vgechc5ty73eh8lwvu2uu6v6sfwaukf" target="_blank" rel="noopener noreferrer">WalletScrutiny Bot on Primal</a></p>

  <p class="note">You only need a Nostr account and a client that supports following other users. If you are new to Nostr, see <a href="/nostr/">getting started with Nostr</a>.</p>
</section>

<section class="guide-section" id="explore">
  <h2>Other ways to explore</h2>

  <div class="contribute-grid verifications-explore-grid">
    <a class="contribute-card" href="/assets/">
      <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-tags"></i></span>
      <h2 class="contribute-card__title">Browse the Asset Registry</h2>
      <p class="contribute-card__desc">View wallet binaries that have been added to the network.</p>
      <span class="contribute-card__cta">Browse assets <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
    </a>
    <a class="contribute-card" href="/verifiers/">
      <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-user-secret"></i></span>
      <h2 class="contribute-card__title">Top Build Verifiers</h2>
      <p class="contribute-card__desc">See the most active community members who verify wallet builds.</p>
      <span class="contribute-card__cta">View verifiers <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
    </a>
    <div class="contribute-card">
      <span class="contribute-card__icon" aria-hidden="true"><i class="fas fa-magnifying-glass"></i></span>
      <h2 class="contribute-card__title">Wallet Search</h2>
      <p class="contribute-card__desc">Use the search bar in the navigation to find verifications for a specific Bitcoin wallet.</p>
    </div>
  </div>
</section>

<div class="infoBox guide-note" id="prerequisites">
  <p><strong>View only:</strong> no extra tools are required.</p>
  <p><strong>Contribute:</strong> you need a Nostr browser extension to register assets or publish verifications. See <a href="/nostr/">getting started with Nostr</a>.</p>
</div>

<section class="guide-section" id="sha256-cli">
  <h2>Calculate SHA256 on the command line</h2>
  <p>When you register a new binary manually, you need its SHA256 hash. Dropping the file above calculates it automatically; otherwise use your terminal:</p>

  <ol class="guide-steps">
    <li>
      <h3>Linux or macOS</h3>
      <pre><code>sha256sum path/to/your/file</code></pre>
    </li>
    <li>
      <h3>Windows</h3>
      <pre><code>certutil -hashfile path\to\your\file SHA256</code></pre>
    </li>
  </ol>
</section>

</div>
