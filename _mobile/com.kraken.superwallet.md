---
title: 'Kraken Wallet: Crypto & NFT'
date: 2026-10-30
authors:
- danny
website: https://kraken.com/wallet
twitter: krakenfx
social:
- https://www.linkedin.com/company/krakenfx
- https://www.facebook.com/KrakenFX
- https://www.reddit.com/r/Kraken
features:
- multiAccount
- fingerprint
- hd
redirect_from:
- /android/com.kraken.superwallet/
- /iphone/com.kraken.superwallet.app/
android:
  appId: com.kraken.superwallet
  users: 100000
  appCountry: us
  released: 2024-04-11
  updated: 2026-10-06
  version: 2.6.0 (36)
  reviews: 137
  icon: com.kraken.superwallet.webp
  meta: ok
  verdict: nosource
  developerName: Payward, Inc.
  repository: https://github.com/krakenfx/wallet#deadLink
iphone:
  appId: com.kraken.superwallet.app
  idd: '1626327149'
  appCountry: us
  released: 2024-04-17
  updated: 2026-10-07
  version: 2.6.0
  reviews: 1282
  icon: com.kraken.superwallet.app.webp
  meta: ok
  verdict: nosource
  developerName: Kraken
  repository: https://github.com/krakenfx/wallet#deadLink

---

**Update 2026-10-30:** Kraken removed the wallet's source code from GitHub. The [repository](https://web.archive.org/web/20260818153247/https://github.com/krakenfx/wallet) was still online in August 2026 and is gone now. Its last published code was version 1.29.0 from May 2026 (kept in [third-party copies](https://github.com/sftwrstef/wallet)), while the apps are at version 2.6.0, so the apps are now {% include verdictBadge.html verdict="nosource" type='short' %}.

## Android

{% include featureEvidence.html feature="multiAccount" source="[Play Store](https://play.google.com/store/apps/details?id=com.kraken.superwallet)" quote="Multiple wallets, one seed phrase: Manage multiple wallets for different purposes using a single, secure seed phrase." %}

Kraken Superwallet is a self-custodial cryptocurrency wallet designed for securely managing digital assets, NFTs, and decentralized finance (DeFi) holdings. It supports multiple blockchain networks, enabling users to store, send, and receive Bitcoin, Ethereum, Solana, Dogecoin, Polygon, and other cryptocurrencies.

### Key Features

- Multi-Asset Support – Allows users to manage various cryptocurrencies, NFT collections, and DeFi assets within a single interface.
- Seed Phrase Management – Supports multiple wallets under a single seed phrase, providing a unified recovery mechanism.
- Privacy Measures – Implements minimal data collection policies and shields IP addresses to enhance user privacy.
- Security Model – The wallet’s security architecture follows Kraken’s established security practices, including open-source code audits.
- Dapp Integration – Features a built-in browser for interacting with decentralized applications (dapps) and monitoring DeFi positions.

## Analysis

The wallet is **source-available** and should be verified using Nostr verifications.

{% include featureEvidence.html feature="hd" quote="Import Wallets (BIP39 standard)" source="GitHub README" %}

{% include featureEvidence.html feature="fingerprint" quote="Data encryption using password and/or biometrics" source="GitHub README" %}

An issue has been opened at [https://github.com/krakenfx/wallet/discussions/59](https://github.com/krakenfx/wallet/discussions/59)

---

## iPhone

The Android analysis above applies to the iPhone app too.

{% include featureEvidence.html feature="hd" quote="Import Wallets (BIP39 standard)" source="GitHub README" %}

{% include featureEvidence.html feature="fingerprint" quote="Data encryption using password and/or biometrics" source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple wallets, one seed phrase: Manage multiple wallets for different purposes using a single, secure seed phrase." source="Store description" %}
