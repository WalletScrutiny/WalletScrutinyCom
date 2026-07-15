---
wsId: vultisig
title: 'Vultisig: Seedless Wallet'
date: 2025-12-26
authors:
- danny
website: https://vultisig.com
twitter: vultisig
social:
- https://discord.com/invite/54wEtGYxuv
- https://t.me/vultisig
- https://www.instagram.com/vultisig
features:
- foss
- multiSig
- tradeAlts
redirect_from:
- /android/com.vultisig.wallet/
- /iphone/com.vultisig.wallet/
android:
  appId: com.vultisig.wallet
  users: 10000
  appCountry: us
  released: 2024-07-01
  updated: 2026-07-06
  version: 1.0.113
  reviews: 11
  icon: com.vultisig.wallet.png
  meta: ok
  verdict: custodial
  developerName: Vulti Holdings Ltd.
iphone:
  appId: com.vultisig.wallet
  idd: '6503023896'
  appCountry: us
  released: 2024-09-16
  updated: 2026-07-09
  version: '1.41'
  reviews: 62
  icon: com.vultisig.wallet.jpg
  meta: ok
  verdict: custodial
  developerName: Vulti Holdings Limited

---

## Android

## App Description

Vultisig Wallet is an Android cryptocurrency wallet that advertises a seedless design using Threshold Signature Scheme (TSS) to split signing authority across multiple devices instead of relying on a single recovery phrase.

The app explicitly lists Bitcoin support, alongside Ethereum, Solana, and other blockchains, according to its Google Play description.

Vultisig emphasizes multi-device access and threshold-based transaction signing rather than traditional single-key storage.

## Analysis

Our [testing](https://x.com/BitcoinWalletz/status/2004371037581201749/photo/1) reveals there are two modes for setting up the app. The first option is 'fast', which uses only 2 of 2 shares which connects to the Vultisig server and emails one of the shares to an assigned email. The other share is on the Android device held by the user. The other setup is the more secure vultisig vault which allows the user to store the shares on different devices. 

Because the fast mode relies on provider-mediated key share handling and the documentation does not demonstrate that Vultisig is cryptographically incapable of participating in signing or recovery, the app cannot be classified as self-custodial under WalletScrutiny criteria. The seed phrases were also not provided. 

Our verdict is **custodial**.

{% include featureEvidence.html feature="multiSig" quote="The first multi-chain, multi-asset, multi-signature wallet in the world for everyone." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="You can deposit, send, swap and more inside Vultisig." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Open-Source Audited" source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiSig" quote="TSS threshold signature technology • Multi-signature security without complexity" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="You can deposit, send, swap and more inside Vultisig." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Open-Source Audited" source="Website" %}
