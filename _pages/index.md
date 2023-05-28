---
permalink: /
title: "Know your wallet like you built it."
summary: "Wallet Scrutiny helps everyday bitcoin users verify whether or not their wallet is truly open-source and secure."
excerpt: "Not everyone is a developer. Not everyone has to be."
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
<link rel="stylesheet" href="{{ base_path }}/assets/css/styles.css">


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

{% include homepage/stats.html %}

{% include homepage/cta.html %}



<script src="{{ base_path }}/assets/js/color-thief.umd.js"></script>
<script src="{{ base_path }}/assets/js/widgetBadgeDetails.js"></script>
<script src="{{ base_path }}/assets/js/ui-components.js"></script>
<script src="{{ base_path }}/assets/js/scripts.js"></script>
<script src="{{ base_path }}/assets/js/landingPage.js"></script>
