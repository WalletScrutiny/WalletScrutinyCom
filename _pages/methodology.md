---
layout: archive
title: "Methodology"
permalink: /methodology/
author_profile: true
---

<div class="info-landing-page guide-page methodology-page">

<div class="methodology-hero">
  <p class="methodology-lead">
    How WalletScrutiny evaluates wallets: what we test, what we do not cover,
    and how community build verifications fit into the review process.
  </p>
</div>

<nav class="methodology-tabs" aria-label="Methodology sections">
  <div class="tabulation-scroll-container">
    <div class="tabulation" role="tablist">
      <button type="button" class="tab" role="tab" aria-selected="false">Introduction</button>
      <button type="button" class="tab tests-we-run" role="tab" aria-selected="false">Tests we run</button>
      <button type="button" class="tab" role="tab" aria-selected="false">FAQ</button>
    </div>
  </div>
</nav>

{% capture faq %}
  {% include methodology/faq.md %}
{% endcapture %}
{% capture introduction %}
  {% include methodology/introduction.md %}
{% endcapture %}

<div class="tab-payloads">
  <div class="tab-container" role="tabpanel">{{ introduction | markdownify }}</div>
  <div class="tab-container" role="tabpanel">{% include methodology/tests.html %}</div>
  <div class="tab-container" role="tabpanel">{{ faq | markdownify }}</div>
</div>

</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.methodology-page .tabulation .tab'));
  let lastQuery = false;

  function tabSlug(tab) {
    return tab.textContent.trim().replace(/ /g, '-').toLowerCase();
  }

  function setActiveIndex(index) {
    document.body.setAttribute('data-active-index', String(index));
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i + 1 === index ? 'true' : 'false');
    });
  }

  function syncFromUrl() {
    let urlIndex = 1;
    let urlPlatformCategory = false;

    if (window.location.search.indexOf('?') >= 0) {
      const query = window.location.search.split('?')[1];
      const tabQuery = query.indexOf('/') > 0 ? query.split('/')[0] : query;

      tabs.forEach((tab, i) => {
        if (tabQuery === tabSlug(tab)) {
          urlIndex = i + 1;
        }
      });

      urlPlatformCategory = query.indexOf('/') > 0 ? query.split('/')[1] : false;
    }

    setActiveIndex(urlIndex);

    if (urlIndex === 2 && typeof window.processSelectedSubcategory === 'function') {
      window.processSelectedSubcategory(urlPlatformCategory || undefined);
    }

    lastQuery = window.location.search.split('?')[1];
  }

  tabs.forEach((tab, i) => {
    tab.setAttribute('data-index', String(i + 1));
    tab.addEventListener('click', (event) => {
      const index = Number(event.currentTarget.getAttribute('data-index'));
      setActiveIndex(index);
      const newQuery = tabSlug(event.currentTarget);
      if (lastQuery !== newQuery) {
        window.history.pushState('data', null, `/methodology/?${newQuery}`);
      }
      lastQuery = window.location.search.split('?')[1];
    });
  });

  syncFromUrl();

  window.addEventListener('popstate', () => {
    if (lastQuery !== window.location.search.split('?')[1]) {
      syncFromUrl();
    }
  });
});
</script>
