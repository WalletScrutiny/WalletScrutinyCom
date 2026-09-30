---
layout: archive
title: "WalletScrutiny Automated Build Server"
permalink: /automated-build-server/
---

<div class="info-landing-page guide-page">

<div class="contribute-hero">
  <p class="contribute-lead">
    The <strong>WalletScrutiny Automated Build Server</strong> (ABS) is a service that runs reproducibility build scripts on behalf of the community. When a new wallet binary is registered in the <a href="/assets/">Asset Registry</a> or a new release is detected, the ABS can automatically download an existing <code>build.sh</code> script from Nostr, run it in an isolated environment, and publish a new verification signed by the <strong>WalletScrutiny Bot</strong>.
  </p>
  <p class="contribute-lead">
    This lets wallets with a working build script stay up to date without requiring a human to re-run the same steps for every new version.
  </p>
</div>

<section class="guide-section" id="how-it-works">
  <h2>How it works</h2>

  <p>The ABS runs continuously on a dedicated Linux server:</p>

  <ol class="guide-steps">
    <li>
      <h3>Collect context</h3>
      <p>It loads wallet metadata from WalletScrutiny inventory files and fetches existing <a href="/verifications/">build verifications</a> from Nostr.</p>
    </li>
    <li>
      <h3>Find work</h3>
      <p>It looks for assets in the Asset Registry that do not yet have a matching verification, and (when enabled) for new desktop or hardware releases.</p>
    </li>
    <li>
      <h3>Select a script</h3>
      <p>For each candidate, it searches prior verifications marked <strong>reproducible</strong> that include a file attachment whose name ends with <code>build.sh</code>.</p>
    </li>
    <li>
      <h3>Run the build</h3>
      <p>The script is downloaded, made executable, and run inside a dedicated build directory. Scripts typically wrap the build in <code>podman</code>, <code>docker</code>, or (for vendor Nix-based recipes) <code>nix develop</code> / <code>nix build</code>. Execution is recorded with <a href="https://asciinema.org/" target="_blank" rel="noopener noreferrer">asciinema</a> so anyone can review what happened.</p>
    </li>
    <li>
      <h3>Read the result</h3>
      <p>The script must write a <code>COMPARISON_RESULTS.yaml</code> file with the verdict (<code>reproducible</code>, <code>not_reproducible</code>, or <code>ftbfs</code>).</p>
    </li>
    <li>
      <h3>Publish to Nostr</h3>
      <p>The ABS creates a new verification on Nostr as WalletScrutiny Bot, referencing the original script author, attaching the terminal recording, and stating the outcome.</p>
    </li>
  </ol>

  <p>Jobs for different wallets can run in parallel, but only one job per wallet runs at a time to avoid resource conflicts.</p>
</section>

<section class="guide-section" id="triggers">
  <h2>What triggers an automatic run?</h2>

  <p>Today the ABS focuses on one case:</p>

  <ul>
    <li><strong>New asset in the Asset Registry</strong> — When a user registers a binary (for example via the <a href="https://zapstore.dev/apps/naddr1qvzqqqr7pvpzpytvkhls05a4rnhh76mt0a28nvgqrdqpcr5z2k8wrg39qnra2p7fqqtxxmmd9emkzmrvv468xcmjw46xjmne9eshquqr8p5tv" target="_blank" rel="noopener noreferrer">WalletScrutiny Android app</a> or the <a href="/new_asset/">register new asset</a> page), the ABS tries to reproduce it if a suitable <code>build.sh</code> already exists on Nostr.</li>
  </ul>

  <p>In the future, the ABS will be able to detect newly newly published versions for desktop and hardware wallets and run the script for each architecture and binary type defined in the wallet file.</p>

  <p>The ABS only reuses scripts from verifications with a <strong>reproducible</strong> verdict. It currently runs on Linux and skips macOS targets.</p>
</section>

<section class="guide-section" id="writing-scripts">
  <h2>Writing scripts for the ABS</h2>

  <p>To have your script picked up automatically, publish it as an attachment to a manual verification on Nostr and follow the rules in <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/docs/script_verifications.md" target="_blank" rel="noopener noreferrer"><strong>Scripts for Reproducible Verifications</strong></a> on GitLab.</p>

  <p>Users can also download the same script from Nostr and run it locally to verify a binary themselves.</p>

  <p>If you are writing your first script, we recommend reaching out on the <a href="https://discord.gg/yCNdcSJw9k" target="_blank" rel="noopener noreferrer">WalletScrutiny Discord</a> so the community can help you through the process.</p>

  <h3>Further reading on GitLab</h3>

  <ul>
    <li><a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/docs/verifications.md" target="_blank" rel="noopener noreferrer"><strong>Binary Verifications via Nostr</strong></a> — How verifications and the Asset Registry work on Nostr.</li>
    <li><a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/external/build_server/README.md" target="_blank" rel="noopener noreferrer"><strong>Build Server README</strong></a> — Technical details about the ABS service, requirements, and deployment.</li>
  </ul>
</section>

<section class="guide-section" id="recognizing-abs">
  <h2>Recognizing ABS verifications</h2>

  <p>Automatic verifications are published by the <strong>WalletScrutiny Bot</strong>. Their description starts with <em>"Automatic verification by WalletScrutiny Build Server"</em> and they reference the human verification whose <code>build.sh</code> script was reused. The terminal recording of the run is attached as an asciicast file.</p>

  <p>To view verifications for a wallet, search for it using the wallet search in the navigation bar. Its verifications appear on the wallet's review page.</p>
</section>

</div>
