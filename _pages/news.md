---
layout: archive
title: "Vulnerability news"
permalink: /news/
author_profile: true
---

<div class="vuln-news" id="vuln-news" data-base="{{ site.baseurl }}">
  <p class="vuln-news__lead">
    Security advisories published in the last 14 days, and the wallets with a
    release that uses an affected version. A vulnerable dependency does not
    by itself put funds at risk: the app may not use the affected code, or
    use it in a way that cannot be exploited. The date is when the advisory
    became public, not when a wallet started using the library.
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
