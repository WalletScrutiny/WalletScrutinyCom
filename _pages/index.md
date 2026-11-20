---
permalink: /
title: "Know your wallet like you built it."
summary: "WalletScrutiny helps everyday bitcoin users verify whether or not their wallet is truly open-source and secure."
excerpt: "Not everyone is a developer. Not everyone has to be."
author_profile: true
---

{%- assign totalReviewed = site.data.precomputed.totalReviewedProducts -%}
{%- assign allPassed = site.data.precomputed.verdictGroupCounts.allPassed -%}
{%- assign codeIssues = site.data.precomputed.verdictGroupCounts.codeIssues -%}
{%- assign noSource = site.data.precomputed.verdictGroupCounts.noSource -%}
{%- assign sourceIssues = codeIssues | plus: noSource -%}

<section class="home-section home-section--stats-strip" aria-label="Review statistics">
  <div class="home-stats-strip">
    <div class="home-stat">
      <span class="home-stat__value">{{ totalReviewed | thousands_separated }}</span>
      <span class="home-stat__label">Wallets reviewed</span>
      <span class="home-stat__hint">Across mobile, hardware, desktop, and more</span>
    </div>
    <div class="home-stat">
      <span class="home-stat__value">{{ allPassed | thousands_separated }}</span>
      <span class="home-stat__label">All tests passed</span>
      <span class="home-stat__hint">Reproducible or not requiring binaries</span>
    </div>
    <div class="home-stat">
      <span class="home-stat__value">{{ sourceIssues | thousands_separated }}</span>
      <span class="home-stat__label">Source or build issues</span>
      <span class="home-stat__hint">Missing source code or unverifiable builds</span>
    </div>
  </div>
</section>
{% include homepage/wallet-directory.html %}
{% include homepage/stats.html %}
<section class="home-section home-section--support">
  <div class="home-section__layout">
    <div class="home-section__copy">
      <p class="home-section__eyebrow">Get involved</p>
      <h2>Support scrutiny.</h2>
      <p>WalletScrutiny is an independent, non-profit entity that depends on volunteers and donations. Have a thorough understanding of open-source bitcoin and feel like helping us review some wallets? Great. We'd love to hear from you. Don't know the first thing about code but want to support the people that do? Consider donating today.</p>
    </div>
    <nav class="home-cta-cards" aria-label="Support WalletScrutiny">
      <a class="home-cta-card" href="{{ site.baseurl }}/howtoContributeToWS/" title="Help review wallets">
        <span class="home-cta-card__icon" aria-hidden="true">{% include icon.html name="handshake-angle" %}</span>
        <span class="home-cta-card__copy">
          <span class="home-cta-card__label">Contribute</span>
          <span class="home-cta-card__hint">Help us review wallets</span>
        </span>
        <span class="home-cta-card__arrow" aria-hidden="true">{% include icon.html name="arrow-right" %}</span>
      </a>
      <a class="home-cta-card" href="/donate" title="Donate to WalletScrutiny">
        <span class="home-cta-card__icon" aria-hidden="true">{% include icon.html name="circle-dollar-to-slot" %}</span>
        <span class="home-cta-card__copy">
          <span class="home-cta-card__label">Donate</span>
          <span class="home-cta-card__hint">Donate sats to the cause</span>
        </span>
        <span class="home-cta-card__arrow" aria-hidden="true">{% include icon.html name="arrow-right" %}</span>
      </a>
    </nav>
  </div>
</section>
