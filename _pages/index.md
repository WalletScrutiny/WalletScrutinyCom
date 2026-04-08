---
permalink: /
title: "Know your wallet like you built it."
summary: "WalletScrutiny helps everyday bitcoin users verify whether or not their wallet is truly open-source and secure."
excerpt: "Not everyone is a developer. Not everyone has to be."
author_profile: true
---

{% include base_path %}

<div class="title-wrapper">

{% include homepage/wallet-filters.html %}

  <!--
    The content of this div gets replaced if JS is enabled.
  -->
  {% assign platform = "android" %}
  {% assign verdicts = "sourceavailable" | split: "," %}
  {% assign selectedVerdict = "sourceavailable" %}
  <div class="page-section"></div>
</div>

{% include homepage/stats.html %}

{% include homepage/cta.html %}
