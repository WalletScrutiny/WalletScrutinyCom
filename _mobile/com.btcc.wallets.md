---
wsId: btccWallet
title: 'BTCC Wallet: Crypto & Bitcoin'
date: 2025-11-13
authors:
- danny
website: https://www.btcc.com/wallet
twitter: BTCCexchange
redirect_from:
- /android/com.btcc.wallets/
- /iphone/com.btcc.wallets/
android:
  appId: com.btcc.wallets
  users: 100000
  appCountry: us
  released: 2023-11-16
  updated: 2026-08-20
  version: 3.5.45
  reviews: 18
  icon: com.btcc.wallets.png
  meta: ok
  verdict: custodial
  developerName: BTCC WALLET
iphone:
  appId: com.btcc.wallets
  idd: '6470782742'
  appCountry: us
  released: 2023-11-20
  updated: 2026-08-24
  version: 3.5.45
  reviews: 33
  icon: com.btcc.wallets.jpg
  meta: ok
  verdict: custodial
  developerName: BTCC UK Limited

---

## Android

This is the wallet counterpart to the full exchange app in {% include walletLink.html wallet='android/com.btcc.hy' verdict='true' %}

## App Description

This app provides multi-chain asset management for networks such as Bitcoin, Ethereum (ERC-20), BNB Smart Chain (BEP-20), TRON (TRC-20), and others. The app is tightly integrated with the custodial BTCC exchange, allowing users to sync balances, trading history, and account data directly from their BTCC accounts.

While the app presents itself as a “wallet,” all buy, sell, and transfer functions are executed through BTCC’s centralized infrastructure, and no evidence is provided that users control private keys or on-device signing. We were able to sign in using our existing BTCC account.

## Analysis

A Bitcoin wallet is available but no seed phrases were provided. Access is given to the app after signing in. 

This is a **custodial** service.

---

## iPhone

{% include copyFromAndroid.html %}
