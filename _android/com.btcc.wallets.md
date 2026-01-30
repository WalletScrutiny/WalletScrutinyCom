---
wsId: btccWallet
title: 'BTCC Wallet: Crypto & Bitcoin'
altTitle: 
authors:
- danny
users: 100000
appId: com.btcc.wallets
appCountry: 
released: 2023-11-16
updated: 2026-01-26
version: 3.5.40
reviews: 14
website: https://www.btcc.com/wallet
repository: 
issue: 
icon: com.btcc.wallets.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-11-13
signer: 
twitter: BTCCexchange
social: 
redirect_from: 
developerName: BTCC WALLET
builds: 
features: 

---

This is the wallet counterpart to the full exchange app in {% include walletLink.html wallet='android/com.btcc.hy' verdict='true' %}

## App Description

This app provides multi-chain asset management for networks such as Bitcoin, Ethereum (ERC-20), BNB Smart Chain (BEP-20), TRON (TRC-20), and others. The app is tightly integrated with the custodial BTCC exchange, allowing users to sync balances, trading history, and account data directly from their BTCC accounts.

While the app presents itself as a “wallet,” all buy, sell, and transfer functions are executed through BTCC’s centralized infrastructure, and no evidence is provided that users control private keys or on-device signing. We were able to sign in using our existing BTCC account.

## Analysis

A Bitcoin wallet is available but no seed phrases were provided. Access is given to the app after signing in. 

This is a **custodial** service.