---
wsId: tapWallet
title: TAP Wallet
verdict: nosource
meta: ok
date: 2025-10-03
authors:
- danny
twitter: theTAPwallet
social:
- https://www.tiktok.com/@thetapwallet
- https://www.facebook.com/theTAPwallet
- https://www.linkedin.com/company/thetapwallet
redirect_from:
- /android/com.humbl.wallet.app/
- /iphone/com.humbl.wallet/
android:
  appId: com.humbl.wallet.app
  users: 5000
  released: 2022-07-04
  updated: 2026-05-09
  version: 1.0.94
  reviews: 48
  icon: com.humbl.wallet.app.jpg
  website: https://tapwallet.com/
  developerName: TAP, Inc.
iphone:
  appId: com.humbl.wallet
  idd: '1627171234'
  appCountry: us
  released: 2022-07-21
  updated: 2026-04-23
  version: 2.0.5
  reviews: 491
  icon: com.humbl.wallet.jpg
  website: https://tapinvest.com/wallet/
  developerName: HUMBL

---

## Android

📝 **Note**: This app's website is linked to a domain linked to this hardware device: {% include walletLink.html wallet='hardware/tapwallet' verdict='true' %}. It has undergone a rebranding from Tap Labs, to Tap Inc./Humbl LLC.

## App Description 

The TAP Wallet is described as a multi-asset system that combines transaction signing, authentication, and payment functions within a single platform. It claims to support storage and transfer of Bitcoin (BTC), Ethereum (ETH), Solana (SOL), USD Coin (USDC), Avalanche (AVAX), Polygon (MATIC), Binance Chain (BNB), Optimism (OP), Tether (USDT), and other Ethereum-compatible tokens. The stated design objective is to provide one interface that handles digital asset operations across multiple networks, with an emphasis on unified access and cryptographic verification.

## Analysis

Clicking "Create new wallet" during app-initialization opens a mobile browser that goes to the website tapwallet.com. There are navigation tabs at the bottom with an icon depicting a wallet. A Bitcoin icon appears after tapping it. 

The Bitcoin "wallet" shows send/receive functions. However, no wallet creation phase seems to have occurred since we were immediately brought to the send and receive functions. Displaying the seed phrase is available under settings. The user can view the seed phrase after tapping "Show my Seed Phrase". This is secured by biometric or pin-authentication.

There is no mention of its developers making the source code for this app publicly available. A search on GitHub for the appID lists [several wallet registries](https://github.com/search?q=com.humbl.wallet.app&type=code) or configuration lists used by Web3 libraries and SDKs. An Android repository is not among the list of results. 

This app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}
