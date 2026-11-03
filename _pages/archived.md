---
permalink: /archived/
layout: archive
title: "Wallet Archived"
---
<div id="archived-wallet-container"></div>

<script>
const archivedVerdicts = {
{%- for v in site.data.verdicts %}{% if v[0] == 'nobtc' or v[0] == 'nowallet' %}
  {{ v[0] | jsonify }}: { title: {{ v[1].title | jsonify }}, details: {{ v[1].details | markdownify | jsonify }} },
{%- endif %}{% endfor %}
};
// "platform/appId" -> [path before archiving, last commit of that path]
const archivedSources = {
{%- for post in site.archived %}{% if post.archivedCommit %}{% assign folder = post.path | split: '/' %}
  {{ folder[1] | append: '/' | append: post.appId | jsonify }}: [{{ post.archivedFrom | jsonify }}, {{ post.archivedCommit | jsonify }}],
{%- endif %}{% endfor %}
};

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

  const explanation = archivedVerdicts[verdict];
  const explanationHtml = explanation
    ? `<div>${explanation.details}</div>`
    : '';
  const source = archivedSources[`${platform}/${appId}`];
  const sourceHtml = source
    ? `<p>To see more information about our old analysis, <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/${source[1]}/${source[0]}">click here</a>.</p>`
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
            ${explanationHtml}
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