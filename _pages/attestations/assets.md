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
  {%- comment -%}
    Mobile reviews keep their Android/iOS fields nested under `android:` / `iphone:`,
    so they cannot go through the flat `where: 'verdict'` lookup used for the other platforms.
  {%- endcomment -%}
  {%- assign sourceAvailableIds = '' | split: '' -%}
  {%- assign platforms = 'hardware,bearer,desktop,others' | split: ',' -%}
  {%- for platform in platforms -%}
    {%- assign platformWallets = site[platform] | where: 'verdict', 'sourceavailable' -%}
    {%- for wallet in platformWallets -%}
      {%- assign sourceAvailableIds = sourceAvailableIds | push: wallet.appId -%}
    {%- endfor -%}
  {%- endfor -%}
  {%- for wallet in site.mobile -%}
    {%- if wallet.android.verdict == 'sourceavailable' -%}
      {%- assign sourceAvailableIds = sourceAvailableIds | push: wallet.android.appId -%}
    {%- endif -%}
    {%- if wallet.iphone.verdict == 'sourceavailable' -%}
      {%- assign sourceAvailableIds = sourceAvailableIds | push: wallet.iphone.appId -%}
    {%- endif -%}
  {%- endfor -%}
  const sourceAvailableAppIds = {{ sourceAvailableIds | compact | uniq | jsonify }};

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
        filterAppIds: sourceAvailableAppIds,
        showSeen: true,
        tableLoadedCallback: () => (document.getElementById('loadingSpinner').style.display = 'none')
      });
    } catch (error) {
      console.error('Error rendering assets table: ', error);
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  });
</script>