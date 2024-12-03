---
layout: archive
title: "Creating New Asset"
permalink: /new_asset/
---

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    const createdAssetResult = await createAsset(
      "Universal APK from Github",
      [
        ["i",   "app.zeusln.zeus"],
        ["url", "https://github.com/ZeusLN/zeus/releases/download/v0.9.2/zeus-v0.9.2-universal.apk"],
        ["version", "0.9.2"],
        ["m", "application/vnd.android.package-archive"],
        ["x", "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
        ["ox", "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
        ["platform", "Android Universal"]
      ]);
  })();
</script>