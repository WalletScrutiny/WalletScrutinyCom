---
permalink: /
lang: es
page_id: home
title: "Conoce tu wallet como si la hubieras construido."
summary: "WalletScrutiny ayuda a usuarios cotidianos de bitcoin a verificar si su wallet es verdaderamente open-source y segura."
excerpt: "No todos son desarrolladores. No todos tienen que serlo."
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
