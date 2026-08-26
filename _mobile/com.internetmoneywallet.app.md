---
wsId: internetMoneyWallet
title: 'Internet Money: Crypto Wallet'
date: 2025-11-18
authors:
- danny
website: https://internetmoney.io/
twitter: internetmoneyio
features:
- segwit
- taproot
- tradeAlts
redirect_from:
- /android/com.internetmoneywallet.app/
- /iphone/com.internetmoneywallet.app/
android:
  appId: com.internetmoneywallet.app
  users: 50000
  appCountry: us
  released: 2022-11-12
  updated: 2026-08-25
  version: '4.0'
  reviews: 88
  icon: com.internetmoneywallet.app.png
  meta: ok
  verdict: nosource
  developerName: Internet Money
iphone:
  appId: com.internetmoneywallet.app
  idd: '1641771042'
  appCountry: us
  released: 2023-04-17
  updated: 2026-07-02
  version: '3.2'
  reviews: 192
  icon: com.internetmoneywallet.app.jpg
  meta: ok
  verdict: nosource
  developerName: Decentralized Innovations, LLC

---

## Android

## App Description

- The listing describes Internet Money as **“an open source Bitcoin, Ethereum and all EVM chains crypto wallet”** with full NFT support across those networks.
- Feature list highlights “support for various Bitcoin account types: Native Segwit, Taproot, Nested Segwit and Legacy accounts” plus 40+ preloaded networks and custom RPC support.

## Analysis

- The open-source claim in the Play Store text lacks a linked repository.
- GitHub searches for the package ID [com.internetmoneywallet.app](https://github.com/search?q=%22com.internetmoneywallet.app%22&type=code) only surface generic manifests listing many wallet package names; none correspond to an official Android repository for this app.
- Bitcoin support is asserted for “Native Segwit, Taproot, Nested Segwit and Legacy accounts,” which is now supported by our test importing the 24-word seed into Electrum 4.6.2; the derived address `bc1qtatuw2uzg64cw2ka00ge0yk8jn4mcmttvlzmr4` matches the wallet’s receive list ([Testing evidence](https://x.com/BitcoinWalletz/status/1990747834443018622)).

Our tests show that this app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="Support for various Bitcoin account types: Native Segwit, Taproot, Nested Segwit and Legacy accounts!" source="Store description" %}

{% include featureEvidence.html feature="taproot" quote="Support for various Bitcoin account types: Native Segwit, Taproot, Nested Segwit and Legacy accounts!" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Cross-chain swapping (Change) between different blockchains (currently supports 27+ different chains)" source="Store description" %}
