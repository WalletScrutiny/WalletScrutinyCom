---
wsId: walletVerse
title: 'Wallet Verse: DeFi, Buy Crypto'
verdict: nosource
date: 2025-12-31
authors:
- danny
website: https://walletverse.io/
twitter: walletverse_io
social:
- https://www.linkedin.com/company/walletverse
- https://discord.com/invite/6HNxuUxnU8
- https://www.facebook.com/walletverse
- https://www.instagram.com/walletverse_io
- https://t.me/walletverse_io
features:
- buyWithCC
- hd
- multiAccount
- tradeAlts
redirect_from:
- /android/com.walletverse/
- /iphone/ilink.walletverse/
android:
  appId: com.walletverse
  users: 10000
  released: 2023-06-29
  updated: 2026-05-05
  version: 1.17.0
  reviews: 13
  icon: com.walletverse.png
  meta: ok
  developerName: ilink Ltd.
iphone:
  appId: ilink.walletverse
  idd: '6462672660'
  appCountry: us
  released: 2023-10-15
  updated: 2026-05-07
  version: 1.17.1
  reviews: 41
  icon: ilink.walletverse.jpg
  meta: ok
  developerName: ilink Ltd.

---

## Android

## App Description

Walletverse is an Android self-custodial cryptocurrency wallet that supports multiple blockchains and token standards, including ERC-20, TRC-20, BEP-20, BEP-2, Solana, and others. It explicitly claims support for Bitcoin (BTC) alongside Ethereum, stablecoins, and hundreds of additional cryptocurrencies, allowing users to send and receive on-chain assets from within the app. According to the Play Store description, private keys are generated and stored locally on the user’s device, while additional functionality such as swaps, staking, fiat on-ramps, and DApp connectivity is provided through integrated third-party services.

## Testing and Analysis

We [tested](https://x.com/BitcoinWalletz/status/2006304200603623524) the app and can confirm the inclusion of a Bitcoin wallet that can send/receive BTC. The seed phrases were also provided.

When exported to Electrum desktop, [the BTC address generated matched those from the app](https://x.com/BitcoinWalletz/status/2006306006150865092).

We did not find any claims regarding source-availability and a search for the App ID on GitHub code, [did not yield any relevant results](https://github.com/search?q=com.walletverse&type=code).

**This app is not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy Crypto with Visa, Mastercard or local payment providers." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="DEX (Decentralized Exchange) and instant crypto exchange with more than 10,000+ pairs." source="Store" %}

{% include featureEvidence.html feature="multiAccount" quote="Multi-wallet: create as many accounts and addresses as you wish, with full multi-currency wallet support." source="Store" %}

{% include featureEvidence.html feature="hd" quote="Self-custodial (non-custodial) wallet. Only you have access to private keys and they never leave your device." source="Store" comment="Implied by self-custodial multi-chain wallet with private key ownership; conservative — only included because the store explicitly states private keys are stored on device under user control, consistent with HD wallet architecture for a multi-chain wallet of this type." %}
