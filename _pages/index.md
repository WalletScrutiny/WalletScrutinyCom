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

<div class="title-wrapper">



{% include homepage/wallet-filters.html %}


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

<script src="{{ base_path }}/assets/js/color-thief.umd.js"></script>
<script src="{{ base_path }}/assets/js/widgetBadgeDetails.js"></script>
<script src="{{ base_path }}/assets/js/scripts.js"></script>
<script src="{{ base_path }}/assets/js/landingPage.js"></script>
