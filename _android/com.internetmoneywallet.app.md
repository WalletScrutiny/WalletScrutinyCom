---
wsId: internetMoneyWallet
title: Internet Money - Crypto Wallet
altTitle: 
authors:
- danny
users: 10000
appId: com.internetmoneywallet.app
appCountry: 
released: 2022-11-12
updated: 2026-04-01
version: '2.6'
reviews: 85
website: https://internetmoney.io/
repository: 
icon: com.internetmoneywallet.app.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-18
signer: 
twitter: internetmoneyio
social: 
redirect_from: 
developerName: Internet Money
builds: 
features: 

---

## App Description

- The listing describes Internet Money as **“an open source Bitcoin, Ethereum and all EVM chains crypto wallet”** with full NFT support across those networks.
- Feature list highlights “support for various Bitcoin account types: Native Segwit, Taproot, Nested Segwit and Legacy accounts” plus 40+ preloaded networks and custom RPC support.

## Analysis

- The open-source claim in the Play Store text lacks a linked repository.
- GitHub searches for the package ID [com.internetmoneywallet.app](https://github.com/search?q=%22com.internetmoneywallet.app%22&type=code) only surface generic manifests listing many wallet package names; none correspond to an official Android repository for this app.
- Bitcoin support is asserted for “Native Segwit, Taproot, Nested Segwit and Legacy accounts,” which is now supported by our test importing the 24-word seed into Electrum 4.6.2; the derived address `bc1qtatuw2uzg64cw2ka00ge0yk8jn4mcmttvlzmr4` matches the wallet’s receive list ([Testing evidence](https://x.com/BitcoinWalletz/status/1990747834443018622)).

Our tests show that this app is **not source-available**.
