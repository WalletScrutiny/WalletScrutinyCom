---
wsId: flashWallet
title: Flash Wallet
date: 2025-11-14
authors:
- danny
website: https://flash-wallet.app/
twitter: Flash_Techno_Of
features:
- fingerprint
- hd
- segwit
redirect_from:
- /android/com.flashwallet.production/
- /iphone/flashwallet.org.production/
android:
  appId: com.flashwallet.production
  users: 50000
  appCountry: us
  released: 2023-10-23
  updated: 2026-01-29
  version: '32.0'
  icon: com.flashwallet.production.jpg
  meta: ok
  verdict: nosource
  developerName: Flash Technologies LLC
iphone:
  appId: flashwallet.org.production
  idd: '6461013442'
  appCountry: us
  released: 2023-12-06
  updated: 2026-01-31
  version: '29'
  reviews: 5
  icon: flashwallet.org.production.jpg
  meta: removed
  verdict: nosource
  developerName: Flash Technologies LLC FZ

---

## Android

## App Description

Flash Wallet (com.flashwallet.production) is a multi-chain cryptocurrency wallet that enables users to create and manage wallets using a standard 12-word BIP39 recovery phrase.
The app supports Bitcoin, providing native SegWit (bc1) send/receive functionality derived directly from the user’s seed.

It includes biometric protection, encrypted local key storage, QR-based payments, and the ability to add custom EVM tokens.

NFT viewing, on-device transaction signing, and a token-import interface allow users to manage both Bitcoin and EVM-compatible assets in a single non-custodial environment.

## Analysis

Flash Wallet provides a 12-word BIP39 seed phrase and displays a Bitcoin SegWit (bc1...) address.

We verified that the displayed address correctly derives from the seed phrase by importing the mnemonic into Electrum Desktop ([verification evidence](https://x.com/dannybuntu/status/1990367154076783009)). This confirms the app uses standard BIP39/BIP84 derivation for Bitcoin addresses.

However, without source code review, we cannot verify:
- Entropy quality during seed generation
- Whether keys are transmitted to external servers
- Presence of backdoors or key leakage mechanisms

Based on observable behavior and derivation verification with Electrum, the app **appears to be self-custodial**, though closed-source nature prevents complete security assessment.

The project does not make a claim regarding source-availability and offers **[no public source code.](https://github.com/search?q=com.flashwallet.production&ref=opensearch&type=code)**

{% include featureEvidence.html feature="segwit" quote="The app supports Bitcoin, providing native SegWit (bc1) send/receive functionality derived directly from the user's seed." source="App Description" %}

{% include featureEvidence.html feature="hd" quote="Flash Wallet (com.flashwallet.production) is a multi-chain cryptocurrency wallet that enables users to create and manage wallets using a standard 12-word BIP39 recovery phrase." source="App Description" %}

{% include featureEvidence.html feature="fingerprint" quote="It includes biometric protection, encrypted local key storage, QR-based payments, and the ability to add custom EVM tokens." source="App Description" %}

---

## iPhone

{% include copyFromAndroid.html %}
