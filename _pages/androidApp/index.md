---
layout: archive
title: "WalletScrutiny Android app"
permalink: /androidApp/
author_profile: false
---

{% assign ws_app_repo = "https://gitlab.com/walletscrutiny/walletscrutinyandroid" %}

<div class="info-landing-page guide-page android-app-page">

<div class="guide-hero">
  <p class="guide-lead">
    The app hashes the wallets installed on your phone and matches them against
    the verifications on this site, so you know whether the exact build you run
    was reproduced from its source code.
  </p>
  <p class="guide-lead">
    A verified version number is not enough: the file on your phone can differ
    from the one we tested. Builds nobody has checked yet are sent to our build
    server, so your update becomes a verification for everyone.
  </p>
</div>

<div class="guide-actions">
  <a href="https://zapstore.dev/apps/com.walletscrutiny.ng_app" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">{% include icon.html name="mobile-screen" %} Get it on Zapstore</a>
  <a href="{{ ws_app_repo }}/-/releases/permalink/latest" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">{% include icon.html name="gitlab" %} Download from GitLab</a>
</div>

<p class="android-app-links">
  <a href="{{ ws_app_repo }}" target="_blank" rel="noopener noreferrer">Source code</a>
</p>

</div>
