---
title: Bitcoin Wallet
date: 2024-03-02
authors:
- leo
- emanuel
website: https://www.bitorzo.io#deadLink
features:
- hd
- fingerprint
- foss
- camera
redirect_from:
- /android/com.bitorzo.wallet/
android:
  appId: com.bitorzo.wallet
  altTitle: Bitcoin Wallet by Bitorzo.com
  users: 1000
  released: 2020-07-22
  updated: 2021-01-03
  version: 3.1.3
  icon: com.bitorzo.wallet.jpg
  meta: removed
  verdict: sourceavailable
  developerName: Hodlers Team
  repository: https://github.com/Bitorzo/Bitorzo

---

{% include featureEvidence.html feature="hd" source="[README](https://github.com/Bitorzo/Bitorzo#readme)" quote="HD enabled - wallet never reuse addresses (BIP32, BIP44) to keep your privacy safe." %}
{% include featureEvidence.html feature="fingerprint" source="[README](https://github.com/Bitorzo/Bitorzo#readme)" quote="Protect your funds with biometrics (FaceID / Fingerprint)" %}
{% include featureEvidence.html feature="foss" source="[License](https://github.com/Bitorzo/Bitorzo/blob/master/LICENSE)" quote="MIT License" %}
{% include featureEvidence.html feature="camera" source="[README](https://github.com/Bitorzo/Bitorzo#readme)" quote="Easily Send / Receive by scanning QR code (for non-contacts or non-Bitorzo users)." %}

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/4858b0b76e8e8e7fe6c60e2e3af81360a79bed91/_android/com.bitorzo.wallet.md)*

> ⚠️ **Notice**: The Bitorzo wallet app has been removed from the Google Play Store. Users should exercise caution and verify sources before attempting to install or use this application from unofficial channels.

Bitorzo is a cross-platform mobile Bitcoin wallet developed in Dart using the Flutter framework. It is designed to be secure by default, keeping private keys encrypted on the device and never transmitting them unless explicitly exported by the user. The wallet supports HD key derivation (BIP32/BIP44), dynamic fee estimation, and contact-based payments without needing to share addresses manually. Security features include biometric authentication and 24-word mnemonic backups. Developers can build the app using Flutter SDK for Android (both `armeabi-v7a` and `arm64-v8a`) and iOS, with internationalization support managed via `intl_translation`.

An issue has been opened at [https://github.com/Bitorzo/Bitorzo/issues/2](https://github.com/Bitorzo/Bitorzo/issues/2)
