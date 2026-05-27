---
wsId: muun
title: 'Muun: Bitcoin Lightning Wallet'
date: 2021-07-30
authors:
- leo
- mohammad
- keraliss
website: https://muun.com
twitter: MuunWallet
features:
- ln
- multiSig
- segwit
- taproot
- secEl
redirect_from:
- /io.muun.apollo/
- /posts/io.muun.apollo/
- /android/io.muun.apollo/
- /iphone/com.muun.falcon/
android:
  appId: io.muun.apollo
  users: 500000
  released: 2017-04-25
  updated: 2026-04-22
  version: '55.8'
  reviews: 230
  icon: io.muun.apollo.png
  signer: 026ae0ac859cc32adf2d4e7aa909daf902f40db0b4fe6138358026fd62836ad1
  builds:
  - arch: arm64-v8a
  - arch: armeabi-v7a
  meta: ok
  verdict: sourceavailable
  developerName: muun
iphone:
  appId: com.muun.falcon
  idd: 1482037683
  released: 2019-10-11
  updated: 2026-04-20
  version: 2.14.0
  reviews: 327
  icon: com.muun.falcon.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Muun Wallet, Inc

---

## Android

*Legacy verification [2024](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/a85123512755a021e4003644854d39d60facf7f6/_android/io.muun.apollo.md)*

## App Description

Muun is a self-custodial Bitcoin and Lightning Network wallet for Android, featuring a 2-of-2 multi-signature model that enhances security by storing only one key on the device and providing the other in an exportable Emergency Kit. It supports both on-chain and Lightning payments from a unified interface with dynamic fee estimation based on mempool conditions. The wallet includes Bech32 address support, taproot compatibility, and fee selection options. Recovery is possible using either a written code or email and password, but it does not support standard 12/24-word seed phrases. Muun’s architecture ensures that users retain full control over their funds, with no server-side custody or data access.

This app is **source available**.

{% include featureEvidence.html feature="segwit" quote="The wallet includes Bech32 address support, taproot compatibility, and fee selection options." source="App Description" %}

{% include featureEvidence.html feature="taproot" quote="The wallet includes Bech32 address support, taproot compatibility, and fee selection options." source="App Description" %}

{% include featureEvidence.html feature="multiSig" quote="Muun is a self-custodial Bitcoin and Lightning Network wallet for Android, featuring a 2-of-2 multi-signature model that enhances security by storing only one key on the device and providing the other in an exportable Emergency Kit." source="App Description" %}

An issue has been opened at [https://github.com/muun/apollo/issues/54](https://github.com/muun/apollo/issues/54)

---

## iPhone

**Update 2021-07-30**: While the Android version made some attempts at
reproducibility, the iPhone version, which is in a different code repository,
doesn't claim to be reproducible.

# Old Analysis

This provider claims:

> Muun is a non-custodial wallet: this means you are in full control of your
  money. You remain in control of your private keys, which are stored only on
  your device, using your phone's secure enclave.

and

> Our code is in an open source repository and can be audited by anyone on the
  Internet.

So they claim the right things and we found
[their source code](https://github.com/muun/falcon) but no claims of
reproducibility so we conclude this app is **not verifiable**.

{% include featureEvidence.html feature="segwit" quote="Support for Bech32" source="Store description" %}

{% include featureEvidence.html feature="taproot" quote="The Kit was designed to fit bitcoin's latest scripts, including multisig, lightning and taproot." source="Store description" %}

{% include featureEvidence.html feature="multiSig" quote="Protected with multi-signature: Muun is a 2-of-2 multi-signature wallet. Your Emergency Kit has both keys, but your phone just one." source="Store description" %}

{% include featureEvidence.html feature="secEl" quote="private keys, which are stored only on your device, using your phone's secure enclave." source="Existing WalletScrutiny review" %}
