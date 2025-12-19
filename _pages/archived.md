---
permalink: /archived/
layout: archive
title: "Wallet Archived"
---

{% include base_path %}

<div id="archived-wallet-container"></div>

<script>
window.addEventListener('allWalletsLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('appId');
  const platform = urlParams.get('platform');

  if (!appId || !platform) {
    document.getElementById('archived-wallet-container').innerHTML = 
      '<div class="page"><h1>Archived Wallet</h1><p>Please provide appId and platform parameters in the URL.</p><p>Example: /archived/?appId=example.app&platform=android</p></div>';
    return;
  }

  const wallet = window.wallets.find(w => 
    w.archived === true && 
    w.appId === appId && 
    w.folder === platform
  );

  if (!wallet) {
    document.getElementById('archived-wallet-container').innerHTML = 
      `<div class="page"><h1>Wallet Not Found</h1><p>No archived wallet found with appId="${appId}" and platform="${platform}".</p></div>`;
    return;
  }

  const icon = wallet.icon ? `/images/wIcons/${wallet.folder}/small/${wallet.icon}` : '/images/noimg.svg';
  const iconBig = wallet.icon ? `/images/wIcons/${wallet.folder}/${wallet.icon}` : '/images/noimg.svg';
  const title = wallet.altTitle || wallet.title;
  const verdict = wallet.verdict || 'unknown';
  const verdictText = window.verdicts && window.verdicts[verdict] ? window.verdicts[verdict].short : verdict;
  const meta = wallet.meta && wallet.meta !== 'ok' ? wallet.meta : null;
  const metaText = meta && window.verdicts && window.verdicts[meta] ? window.verdicts[meta].short : meta;

  const html = `
    <div class="page app-review">
      <article class="page" itemscope itemtype="http://schema.org/CreativeWork">
        <meta itemprop="headline" content="${title}">
        <div class="page__inner-wrap">
          <div class="app-summary-grid">
            <img src="${iconBig}" class="app_logo_big" alt="Wallet Logo">
            <div class="app-sum-head">
              <h1 class="page__title -va-c" itemprop="headline">${title}</h1>
              <div class="secondary-text">
                <span class="stamp stamp-archived">Wallet Archived</span>
              </div>
            </div>
          </div>
          <div class="wallet-details">
            <div class="stamps">
              <span class="stamp stamp-archived">Wallet Archived</span>
              <span data-text="${verdictText}" class="stamp stamp-${verdict}" alt=""></span>
              ${meta ? `<span data-text="${metaText}" class="stamp stamp-${meta}" alt=""></span>` : ''}
            </div>
            <div class="article-after">
              <p><strong>Platform:</strong> ${wallet.folder}</p>
              <p><strong>App ID:</strong> ${wallet.appId}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;

  document.getElementById('archived-wallet-container').innerHTML = html;
});

if (window.wallets && window.wallets.length > 0) {
  window.dispatchEvent(new Event('allWalletsLoaded'));
}
</script>