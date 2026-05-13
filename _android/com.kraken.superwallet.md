---
wsId: krakenSuperWallet
title: 'Kraken Wallet: Crypto & NFT'
altTitle: 
authors:
- danny
users: 100000
appId: com.kraken.superwallet
alternativeStores: 
appCountry: 
released: 2024-04-11
updated: 2026-04-10
version: 1.28.0 (5)
reviews: 120
website: https://kraken.com/wallet
repository: https://github.com/krakenfx/wallet
icon: com.kraken.superwallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-06-06
signer: 
twitter: krakenfx
social:
- https://www.linkedin.com/company/krakenfx
- https://www.facebook.com/KrakenFX
- https://www.reddit.com/r/Kraken
redirect_from: 
developerName: Payward, Inc.
builds: 
features:
- multiAccount
- fingerprint
- foss
- hd

---

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

{% include featureEvidence.html feature="foss" quote="Kraken Wallet's source code is released under the terms of the MIT license." source="GitHub README" %}

{% include featureEvidence.html feature="hd" quote="Import Wallets (BIP39 standard)" source="GitHub README" %}

{% include featureEvidence.html feature="fingerprint" quote="Data encryption using password and/or biometrics" source="GitHub README" %}

An issue has been opened at [https://github.com/krakenfx/wallet/discussions/59](https://github.com/krakenfx/wallet/discussions/59)
