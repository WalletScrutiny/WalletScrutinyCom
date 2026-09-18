---
layout: archive
title: "WalletScrutiny Android app"
permalink: /androidApp/
author_profile: false
---

{% assign ws_app_repo = "https://gitlab.com/walletscrutiny/walletscrutinyandroid" %}
{% assign ws_app_latest = ws_app_repo | append: "/-/releases/permalink/latest/downloads" %}
{% assign ws_app_cert = "615bf6cba1c73c90b0515e74f871224ba4e7ed6d6355b9d5ee4a5d1c9d28cfb2" %}

<div class="info-landing-page guide-page android-app-page">

<div class="guide-hero">
  <p class="guide-lead">
    Checks the wallets installed on your phone against our build verifications
    and sends builds nobody has tested yet to the build server.
  </p>
</div>

<div class="guide-actions">
  <a href="{{ ws_app_latest }}/walletscrutiny-arm.apk" class="btn btn-medium btn-success">{% include icon.html name="download" %} Download APK</a>
  <a href="https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/{{ ws_app_repo }}" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">{% include icon.html name="bell" %} Add to Obtainium</a>
  <a href="{{ ws_app_repo }}/-/releases" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">{% include icon.html name="gitlab" %} All releases</a>
</div>

<div class="guide-section">
  <h2>{% include icon.html name="android" %} What it does</h2>
  <ul class="landing-benefits">
    <li>{% include icon.html name="mobile-screen" %}<span>Hashes every installed wallet from our list and matches the hash against the verifications on this site.</span></li>
    <li>{% include icon.html name="clipboard-check" %}<span>Shows whether the exact build on your phone was reproduced from source, not just the version number.</span></li>
    <li>{% include icon.html name="share-nodes" %}<span>Uploads builds nobody has tested yet to the build server, so your update becomes a verification for everyone.</span></li>
    <li>{% include icon.html name="bell" %}<span>Notifies you when a verdict arrives for a build you sent and when a verified newer version of a wallet is available.</span></li>
  </ul>
  <p>
    It only knows wallets whose source is available, because Android requires
    every package it may look at to be listed at build time. The list is
    generated from this site before each release.
  </p>
</div>

<div class="guide-section">
  <h2>{% include icon.html name="clipboard-check" %} Check before you install</h2>
  <p>
    Every release is signed with the same key. Whatever you downloaded, and
    wherever you got it from, the signing certificate must match:
  </p>
  <ul class="landing-copy-list">
    <li class="landing-copy-row">
      <span class="landing-copy-row__label">Signing certificate SHA-256</span>
      <code class="landing-copy-row__value" title="{{ ws_app_cert }}">{{ ws_app_cert }}</code>
      <button type="button" class="landing-copy-btn" aria-label="Copy signing certificate SHA-256" onclick="navigator.clipboard.writeText('{{ ws_app_cert }}').then(() => { if (typeof showToast === 'function') showToast('Signing certificate SHA-256 copied', 'success'); })">
        {% include icon.html name="copy" %}
      </button>
    </li>
  </ul>
  <pre><code>sha256sum walletscrutiny-arm.apk
apksigner verify --print-certs walletscrutiny-arm.apk</code></pre>
  <p>
    The APK hash is next to each download as
    <a href="{{ ws_app_latest }}/walletscrutiny-arm.apk.sha256">walletscrutiny-arm.apk.sha256</a>
    and in the release notes on GitLab. The app runs on Android 6.0 or newer;
    an <a href="{{ ws_app_latest }}/walletscrutiny-x86.apk">x86 build</a> exists for emulators.
  </p>
</div>

<div class="guide-section">
  <h2>{% include icon.html name="bell" %} Keep it updated</h2>
  <p>
    The app is not on Google Play. <a href="https://github.com/ImranR98/Obtainium" target="_blank" rel="noopener noreferrer">Obtainium</a>
    tracks the GitLab releases and installs new versions like a store would:
    tap <em>Add to Obtainium</em> above, or paste the repository URL into it.
  </p>
</div>

<div class="guide-section">
  <h2>{% include icon.html name="gitlab" %} Source and privacy</h2>
  <ul>
    <li><a href="{{ ws_app_repo }}" target="_blank" rel="noopener noreferrer">Source code on GitLab</a>. Bugs and ideas go to the <a href="{{ ws_app_repo }}/-/issues" target="_blank" rel="noopener noreferrer">issue tracker</a>.</li>
    <li><a href="{{ site.baseurl }}/androidApp/privacy/">Privacy policy</a>: what the build server receives when the app uploads a build.</li>
  </ul>
</div>

<div class="guide-section">
  <h2>{% include icon.html name="share-nodes" %} Share</h2>
  <div class="android-app-share">
    <img src="{{ site.baseurl }}/images/androidApp-qr.svg" alt="QR code linking to walletscrutiny.com/androidApp/" width="144" height="144">
    <p>This page is <code>walletscrutiny.com/androidApp/</code>. The QR code opens it on a phone; the download link on it always serves the latest release.</p>
  </div>
</div>

</div>
