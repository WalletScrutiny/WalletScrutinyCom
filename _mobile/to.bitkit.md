---
title: 'Bitkit: Bitcoin Wallet'
date: 2026-10-30
authors:
- danny
- basantagoswami
- keraliss
website: https://bitkit.to/
twitter: bitkitwallet
social:
- https://discord.com/invite/DxTBJXvJxn
- https://t.me/bitkitchat
- https://medium.com/synonym-to
- https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg
features:
- hd
- foss
- ln
- segwit
redirect_from:
- /android/to.bitkit/
- /iphone/to.bitkit/
android:
  appId: to.bitkit
  users: 5000
  appCountry: us
  released: 2024-06-07
  updated: 2026-10-13
  version: 2.5.1
  reviews: 3
  icon: to.bitkit.webp
  signer: 422ae8e4c9b4f1288efb27df173e31cadfd7134d61fa5357eb5ed9eae83c75a7
  alternativeStores:
  - zapstore
  meta: ok
  verdict: sourceavailable
  developerName: Synonym
  repository: https://github.com/synonymdev/bitkit-android
iphone:
  appId: to.bitkit
  idd: '6502440655'
  appCountry: us
  released: 2024-06-12
  updated: 2026-09-23
  version: 2.5.0
  reviews: 10
  icon: to.bitkit.webp
  meta: ok
  verdict: sourceavailable
  developerName: Synonym Software Ltd
  repository: https://github.com/synonymdev/bitkit-ios

---

## Android

**Update 2026-10-30:** The Android source code now lives in [synonymdev/bitkit-android](https://github.com/synonymdev/bitkit-android). The old [synonymdev/bitkit](https://github.com/synonymdev/bitkit) repository is now only an index pointing to the app repositories, and the old React Native app moved to the archived [synonymdev/bitkit-react-native](https://github.com/synonymdev/bitkit-react-native), so we updated the links.

## App Description

Bitkit is a native Android Bitcoin and Lightning wallet developed by Synonym, built in Kotlin with Jetpack Compose and backed by `ldk-node` (LDK-based Lightning) and `bitkit-core` Rust bindings distributed as GitHub Packages. It supports on-chain HD wallets with BIP39 seed backup, self-custodial Lightning channels, and Bech32/SegWit addresses. The app uses a multi-flavor Gradle build (dev/tnet/mainnetRelease) with Firebase and Hilt dependency injection.

## App Analysis

This app is **source-available**.

{% include featureEvidence.html feature="hd" source="[Website](https://bitkit.to/)" quote="Restore your bitcoin on any wallet." %}

{% include featureEvidence.html feature="foss" quote="This project is licensed under the MIT License." source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="The app has a Bech32 BTC address" source="Analysis" %}

An issue has been opened at [https://github.com/synonymdev/bitkit-react-native/issues/2414](https://github.com/synonymdev/bitkit-react-native/issues/2414)

---

## iPhone

The Android analysis above applies to the iPhone app too.
