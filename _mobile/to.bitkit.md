---
wsId: bitkit
title: 'Bitkit: Bitcoin Wallet'
verdict: sourceavailable
meta: ok
date: 2024-12-25
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
  released: 2024-06-07
  updated: 2026-04-08
  version: 2.2.0
  reviews: 3
  icon: to.bitkit.png
  signer: 422ae8e4c9b4f1288efb27df173e31cadfd7134d61fa5357eb5ed9eae83c75a7
  repository: https://github.com/synonymdev/bitkit
  developerName: Synonym
iphone:
  appId: to.bitkit
  idd: '6502440655'
  appCountry: us
  released: 2024-06-12
  updated: 2026-05-05
  version: 2.2.1
  reviews: 10
  icon: to.bitkit.jpg
  repository: https://github.com/synonymdev/bitkit-ios
  developerName: Synonym Software Ltd

---

## Android

## App Description

Bitkit is a native Android Bitcoin and Lightning wallet developed by Synonym, built in Kotlin with Jetpack Compose and backed by `ldk-node` (LDK-based Lightning) and `bitkit-core` Rust bindings distributed as GitHub Packages. It supports on-chain HD wallets with BIP39 seed backup, self-custodial Lightning channels, and Bech32/SegWit addresses. The app uses a multi-flavor Gradle build (dev/tnet/mainnetRelease) with Firebase and Hilt dependency injection.

## App Analysis

This app is **source-available**.

{% include featureEvidence.html feature="hd" source="[Website](https://bitkit.to/)" quote="Restore your bitcoin on any wallet." %}

{% include featureEvidence.html feature="foss" quote="This project is licensed under the MIT License." source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="The app has a Bech32 BTC address" source="Analysis" %}

An issue has been opened at [https://github.com/synonymdev/bitkit/issues/2414#deadLink](https://github.com/synonymdev/bitkit/issues/2414#deadLink)

---

## iPhone

{% include copyFromAndroid.html %}
