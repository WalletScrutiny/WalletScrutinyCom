---
layout: archive
title: "How to Contribute to WalletScrutiny"
permalink: /howtoContributeToWS/
author_profile: false
---

<div class="contribute-page">

<div class="contribute-hero">
  <p class="contribute-lead">
    WalletScrutiny promotes accountability and auditability in Bitcoin wallet security.
    Whether you build from source, write reviews, or help spread the word, there are many ways to pitch in.
  </p>
</div>

<div class="contribute-actions">
  <a href="{{ site.baseurl }}/verifications/" class="btn btn-medium btn-success">Build verifications</a>
  <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">GitLab repository</a>
  <a href="{{ site.baseurl }}/donate/" class="btn btn-medium btn-success">Donate</a>
</div>

<div class="contribute-grid">
  {% for way in site.data.contributeWays %}
    {% if way.link %}
      <a class="contribute-card" href="{{ way.link }}"{% if way.external %} target="_blank" rel="noopener noreferrer"{% endif %}>
    {% else %}
      <div class="contribute-card">
    {% endif %}
        <span class="contribute-card__icon" aria-hidden="true">
          <i class="{% if way.iconBrand %}fab{% else %}fas{% endif %} {{ way.icon }}"></i>
        </span>
        <h2 class="contribute-card__title">{{ way.title }}</h2>
        <p class="contribute-card__desc">{{ way.description }}</p>
        {% if way.link and way.linkText %}
          <span class="contribute-card__cta">
            {{ way.linkText }}
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </span>
        {% endif %}
    {% if way.link %}
      </a>
    {% else %}
      </div>
    {% endif %}
  {% endfor %}
</div>

<div class="infoBox contribute-wiki">
  <p>
    Looking for step-by-step instructions, field definitions, and advanced workflows?
    See the full guide on the
    <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/wikis/How-to-Contribute-to-WalletScrutiny" target="_blank" rel="noopener noreferrer">WalletScrutiny GitLab wiki</a>.
  </p>
</div>

</div>
