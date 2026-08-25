---
wsId: nunchuk
title: Nunchuk Bitcoin Wallet
date: 2023-01-06
authors:
- leo
- emanuel
- mohammad
- danny
website: https://nunchuk.io
twitter: nunchuk_io
social:
- https://nunchuk.medium.com/
- https://join.slack.com/t/nunchukio/shared_invite/zt-xqdlvl5g-xKKohQu_R7IUo7_np8rVaw
features:
- ownFullNode
- customNode
- coinCtrl
- foss
- multiSig
- segwit
redirect_from:
- /android/io.nunchuk.android/
- /iphone/io.nunchuk.ios/
android:
  appId: io.nunchuk.android
  users: 10000
  appCountry: us
  released: 2021-11-11
  updated: 2026-08-22
  version: 2.8.3
  reviews: 44
  icon: io.nunchuk.android.png
  signer: 79b1cd71de5f19c6236d4e3ef134b5b691cf051a138944bda01b640b3e9b1d42
  meta: ok
  verdict: sourceavailable
  developerName: Nunchuk Inc
  repository: https://github.com/nunchuk-io/nunchuk-android
iphone:
  appId: io.nunchuk.ios
  idd: 1563190073
  appCountry: us
  released: 2021-12-16
  updated: 2026-08-20
  version: 2.7.4
  reviews: 548
  icon: io.nunchuk.ios.jpg
  meta: ok
  verdict: nosource
  developerName: Nunchuk
  repository: https://github.com/nunchuk-io/nunchuk-android

---

## Android

{% include featureEvidence.html feature="ownFullNode" source="[Play Store](https://play.google.com/store/apps/details?id=io.nunchuk.android)" quote="Connect to your own full node." %}
{% include featureEvidence.html feature="customNode" source="[Play Store](https://play.google.com/store/apps/details?id=io.nunchuk.android)" quote="Connect to your own full node." %}

*Legacy Verification [2025](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/e4d24e72cf41d87dbf560baddb2f323a09ac97ed/_android/io.nunchuk.android.md)*

## App Description

Nunchuk is a Bitcoin wallet offering advanced multisignature (multisig) functionality, inheritance planning, and robust privacy features. It eliminates single points of failure with multisig setups and provides key recovery options through encrypted cloud backups. The wallet ensures non-custodial control, allowing users to retain full ownership of their Bitcoin. Privacy is emphasized with features like end-to-end encrypted communication and inheritance planning without identity verification.

Additional capabilities include advanced coin control for managing transaction inputs, tagging, and filtering coins, as well as a multi-user multisig wallet for shared Bitcoin management. Nunchuk supports secure collaboration for families or businesses, ensuring that assets can be managed collectively with ease.

This app is **source available**.

### Provider's Own Process

The provider has their own **[script](https://github.com/nunchuk-io/nunchuk-android/blob/master/reproducible-builds/apkdiff.py)** and **[instructions](https://github.com/nunchuk-io/nunchuk-android/tree/master/reproducible-builds)** for testing the reproducibility of the app.

{% include featureEvidence.html feature="foss" quote="GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Nunchuk is a Bitcoin wallet offering advanced multisignature (multisig) functionality, inheritance planning, and robust privacy features." source="App Description" %}

{% include featureEvidence.html feature="coinCtrl" quote="Additional capabilities include advanced coin control for managing transaction inputs, tagging, and filtering coins" source="App Description" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2723364936](https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2723364936)

---

## iPhone

This product's version for Android is now source-available and we are waiting
for source for the iPhone version.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="Future-Proof Architecture: Built on advanced standards (Native Segwit, Miniscript) that minimize data exposure and provide practical resistance against long-term threats." source="Store description" %}

{% include featureEvidence.html feature="multiSig" quote="Advanced Multisig Security: Protect your wealth by eliminating single points of failure. Create flexible vaults (e.g., 2-of-3, 3-of-5) for personal security, family trusts, or business accounts." source="Store description" %}

{% include featureEvidence.html feature="coinCtrl" quote="Utilize advanced coin control for organization and privacy." source="Store description" %}

{% include featureEvidence.html feature="ownFullNode" quote="Connect to your own full node." source="Store description" %}

An issue has been opened at [https://github.com/nunchuk-io/nunchuk-mobile-issues/issues/5](https://github.com/nunchuk-io/nunchuk-mobile-issues/issues/5)
