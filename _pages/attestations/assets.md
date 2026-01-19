---
layout: archive
title: "Asset Registry"
permalink: /assets/
---

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
  <a href="/new_asset/" class="btn btn-success" style="margin-bottom: 0;">Register New Asset</a>
  <div id="shareButtonContainer"></div>
</div>

<div id="binariesTable"></div>

<script>
  const sourceAvailableAppIds = [
    {% assign platforms = 'hardware,android,iphone,bearer,desktop,others' | split: ',' %}
    {% for platform in platforms %}
      {% assign platformWallets = site[platform] | where: 'verdict', 'sourceavailable' %}
      {% for wallet in platformWallets %}
        "{{ wallet.appId }}"{% unless forloop.last or forloop.parentloop.last %},{% endunless %}{% if forloop.last and forloop.parentloop.last == false %},{% endif %}{% endfor %}
    {% endfor %}
  ];

  document.getElementById('loadingSpinner').style.display = 'block';

  window.addEventListener('verificationsUILoaded', async () => {
    renderShareButton({
      container: "#shareButtonContainer",
      defaultMessage: "Look at the list of latest assets reported on WalletScrutiny and help us improve the transparency of the Bitcoin ecosystem!",
      showRawButtons: false
    });

    try {
      await renderAssetsTable({
        htmlElementId: 'binariesTable', 
        enableSearch: true, 
        showOnlyRows: 100000, 
        showOnlyRegisteredAssets: true,
        getDrafts: false,
        filterAppIds: sourceAvailableAppIds
      });
    } catch (error) {
      console.error('Error rendering assets table: ', error);
    } finally {
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  });
</script>