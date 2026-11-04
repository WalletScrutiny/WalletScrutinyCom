---
permalink: /archived/
layout: archive
title: "Wallet Archived"
---
<div id="archived-wallet-container"></div>

<script>
// "platform/appId" -> [rendered old body, path before archiving, last commit of that path]
const archivedSources = {
{%- for post in site.archived %}{% assign folder = post.path | split: '/' %}
  {{ folder[1] | append: '/' | append: post.appId | jsonify }}: [{{ post.url | jsonify }}, {{ post.archivedFrom | jsonify }}, {{ post.archivedCommit | jsonify }}],
{%- endfor %}
};

window.addEventListener('allWalletsLoaded', async () => {
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

  const iconBig = '/images/noimg.svg';
  const title = wallet.title;
  const verdict = wallet.verdict || 'unknown';

  let reason = '';

  if (verdict === 'nowallet') {
    reason = "it's not a wallet";
  } else if (verdict === 'nobtc') {
    reason = "it doesn't allow the user to use Bitcoin";
  } else {
    reason = "of unknown reason";
  }

  const source = archivedSources[`${platform}/${appId}`];
  let bodyHtml = '';
  if (source) {
    try {
      const response = await fetch(source[0]);
      if (response.ok) bodyHtml = `<div class="archived-old-analysis">${await response.text()}</div>`;
    } catch {}
  }
  const sourceHtml = source && source[2]
    ? `<p>To see more information about our old analysis, <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/${source[2]}/${source[1]}">click here</a>.</p>`
    : '';

  const html = `
    <div class="page app-review">
      <article class="page" itemscope itemtype="http://schema.org/CreativeWork">
        <meta itemprop="headline" content="${title}">
        <div class="page__inner-wrap">
          <div class="app-summary-grid">
            <img src="${iconBig}" class="app_logo_big" alt="Wallet Logo">
            <div class="app-sum-head">
              <h1 class="page__title -va-c" itemprop="headline">${title}</h1>
            </div>
          </div>
          <div class="wallet-details">
            <div>
              <span style="font-size: 24px;">This product has been archived by the WalletScrutiny team because <b>${reason}</b>.</span>
            </div>
            ${bodyHtml}
            ${sourceHtml}
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