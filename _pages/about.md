---
permalink: /
title: "Is your Bitcoin wallet secure?"
summary: "The aim of this project is to improve the security of Bitcoin wallets by examining the application code for possible back-doors and other vulnerabilities."
excerpt: "Many wallets are not open to public scrutiny"
author_profile: true
---

{% include base_path %}
<script>
  window.wallets = {% include allAppList.html %}
</script>
<script src="{{ base_path }}/assets/js/hero-search.js"></script>

<div class="page-section">

<h1 id="all-wallets-ordered-by-verifiability-downloads-and-ratings">What protects your Bitcoins from Hackers?</h1>

<img src="{{ base_path }}/images/hacker-bg.png" alt="hacker" style="height:10em;margin:0 0em 1em 0" />
<p style="text-align:center">
  Do <strong>you</strong> own your Bitcoins or do you <strong>trust</strong> that your app allows you to use "your"
  coins while they are actually controlled by <strong>"them"</strong>? Do you have a backup? Do
  "they" have a copy they didn't tell you about? Did anybody check the wallet for deliberate backdoors
  or <strong>vulnerabilities</strong>? Could anybody check the wallet for those?<a rel="me" href="https://bitcoinhackers.org/@giszmo">&nbsp;</a>
</p><p>
  We try to answer these questions for Bitcoin wallets on Android.
</p><p>
  To understand in more detail read about <a title="our methodology"
  href="{{ base_path }}/methodology/">our methodology</a>.
</p>
</div>


<h2 class="section-label">As featured on:</h2>

{% include press.html %}


<h2 class="section-label">All reproducible wallets</h2>

{% assign platform = "android" %}
{% assign verdicts = "reproducible" | split: "," %}
{% assign selectedVerdict = "reproducible" %}
{% assign showVerdictFilter = false %}
{% include list_of_wallets.html %}

<a href="{{ base_path }}/moreApps">more Android Play Store apps</a>

<a href="{{ base_path }}/apple">more Apple App Store apps</a>


<h2 class="section-label">How many wallets are in each category?<a href="#gridOfWallets1" style="color:#ccc">&para;</a></h2>

{% include grid_of_wallets.html %}


<h2 class="section-label">How many users (downloads) are in each category?<a href="#gridOfWallets2" style="color:#ccc">&para;</a></h2>

{% include grid_of_wallets_proportional.html %}
