---
layout: archive
title: "Vulnerability news"
permalink: /news/
author_profile: true
---

<div class="vuln-news" id="vuln-news" data-base="{{ site.baseurl }}">
  <p class="vuln-news__lead">
    Advisories of the last 14 days, by the day they went public, and the
    wallets with a release that uses an affected version. That alone does not
    put funds at risk: the app may not use the affected code.
  </p>
  <div class="vuln-news__filters">
    <label class="vuln-news__filter">
      Releases:
      <select id="vuln-news-releases"></select>
    </label>
    <div class="vuln-news__filter" id="vuln-news-severity" role="group" aria-label="Severity">
      Severity:
    </div>
  </div>
  <div class="vuln-news__days" id="vuln-news-days">
    <p class="vuln-news__status">Loading…</p>
  </div>
  <button type="button" class="vuln-news__more" id="vuln-news-more" hidden></button>
</div>

<script defer src="{{ site.baseurl }}/assets/js/vulnerabilityNews.js?v={{ 'assets/js/vulnerabilityNews.js' | file_digest }}"></script>
