---
permalink: /
title: "Is your Bitcoin wallet secure?"
summary: "This project examines wallet products for build transparency and potential vulnerabilities."
excerpt: "Many wallets are not open to public scrutiny"
author_profile: true
---

{% include base_path %}

<script>
function lsTest(){
    var test = 'test';
    try {
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch(e) {
        return false
    }
}
</script>
<style>
</style>
<!-- <div class="page-section">
<h1 id="all-wallets-ordered-by-verifiability-downloads-and-ratings">What protects your Bitcoins from Hackers?</h1>
<div style="width:100%;text-align:center;">
<img src="{{ base_path }}/images/hacker-bg.png" alt="hacker" style="height:10em;margin:0 auto 1em auto;" />
</div>
<p style="text-align:center">
  Do <strong>you</strong> own your Bitcoins or do you <strong>trust</strong> that your product allows you to use "your"
  coins while they are actually controlled by <strong>"them"</strong>? Do you have a backup? Do
  "they" have a copy they didn't tell you about? Did anybody check the wallet for deliberate back doors
  or <strong>vulnerabilities</strong>? Could anybody check the wallet for those?
</p><p>
  We try to answer these questions and more for Bitcoin Wallets.
</p><p>
  To understand in more detail read about <a title="our methodology"
  href="{{ base_path }}/methodology/">our methodology</a>.
</p>
</div> -->

<div class="title-wrapper">
<h2 class="section-label">Wallets&nbsp;<a href="#modularWalletPayload" style="color:#ccc">&para;</a></h2>
<!-- <div class="-sticky fragmented-controls-master">
  <h2 class="section-label fragmented-controls -sticky">Showing</h2>
  <h2 class="section-label fragmented-controls -disappearable"><span id="modularVerdict">reproducible</span> </h2>
  <h2 class="section-label fragmented-controls -sticky">Wallets from <span id="modularPlatformPH"></span></h2>
</div> -->


<div class="filter">
  <div class="component component-verdict">
    <label>Verdict</label>
    <div class="dropdown-options dropdown-verdict"></div>
  </div>
  <div class="component component-platform">
    <label>Platform</label>
    <div class="dropdown-options dropdown-platform"></div>
  </div>
  <div class="component component-view">
    <label>View</label>
    <div class="dropdown-options dropdown-view">
    <div class="option tiles selected" data="tiles"><i class="fas fa-th-large"></i> tiles</div>
    <div class="option list" data="list"><i class="fas fa-list"></i> list</div>
    </div>
  </div>
</div>
</div>
<br>


<div id="modularWalletPayload" class="tile-list-ui">

  <!--
    The content of this div gets replaced if JS is enabled.
  -->
  {% assign platform = "android" %}
  {% assign verdicts = "reproducible" | split: "," %}
  {% assign selectedVerdict = "reproducible" %}
  <div class="page-section"></div>
</div>

{% include grid_of_wallets.html %}
{% include grid_of_wallets_proportional.html %}

<script src="{{ base_path }}/assets/js/widgetBadgeDetails.js"></script>
<script src="{{ base_path }}/assets/js/scripts.js"></script>
<script src="{{ base_path }}/assets/js/walletFilters.js"></script>
<script src="{{ base_path }}/assets/js/landingPage.js"></script>
