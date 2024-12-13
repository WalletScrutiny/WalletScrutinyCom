---
layout: archive
title: "Creating New Asset"
permalink: /test_new_asset_2/
---

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    const createdAssetResult = await createAssetRegistration({
      name: "Android arm64-v7a APK from Github",
      appId: "app.zeusln.zeus",
      url: "https://github.com/ZeusLN/zeus/releases/download/v0.9.2/zeus-v0.9.2-armeabi-v7a.apk",
      version: "0.9.2",
      mimeType: "application/vnd.android.package-archive",
      sha256: "03187d22f74aee58c459b4525eb93766c1a2453a7b1810d07b9c3bb27792b9b7",
      platform: "Android arm64-v7a APK"
    });
  })();
</script>