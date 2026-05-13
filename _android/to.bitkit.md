---
wsId: bitkit
title: 'Bitkit: Bitcoin Wallet'
altTitle: 
authors:
- danny
- basantagoswami
- keraliss
users: 5000
appId: to.bitkit
alternativeStores: 
appCountry: 
released: 2024-06-07
updated: 2026-04-08
version: 2.2.0
reviews: 3
website: https://bitkit.to/
repository: https://github.com/synonymdev/bitkit
icon: to.bitkit.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2024-12-25
signer: 422ae8e4c9b4f1288efb27df173e31cadfd7134d61fa5357eb5ed9eae83c75a7
twitter: bitkitwallet
social:
- https://discord.com/invite/DxTBJXvJxn
- https://t.me/bitkitchat
- https://medium.com/synonym-to
- https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg
redirect_from: 
developerName: Synonym
builds: 
features:
- hd
- foss
- ln
- segwit

---

## App Description

Bitkit is a native Android Bitcoin and Lightning wallet developed by Synonym, built in Kotlin with Jetpack Compose and backed by `ldk-node` (LDK-based Lightning) and `bitkit-core` Rust bindings distributed as GitHub Packages. It supports on-chain HD wallets with BIP39 seed backup, self-custodial Lightning channels, and Bech32/SegWit addresses. The app uses a multi-flavor Gradle build (dev/tnet/mainnetRelease) with Firebase and Hilt dependency injection.

## App Analysis

This app is **source-available**.

{% include featureEvidence.html feature="hd" source="[Website](https://bitkit.to/)" quote="Restore your bitcoin on any wallet." %}

{% include featureEvidence.html feature="foss" quote="This project is licensed under the MIT License." source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="The app has a Bech32 BTC address" source="Analysis" %}

An issue has been opened at [https://github.com/synonymdev/bitkit/issues/2414#deadLink](https://github.com/synonymdev/bitkit/issues/2414#deadLink)
