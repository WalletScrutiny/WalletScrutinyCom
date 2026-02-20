---
wsId: smartWallet
title: Smart Wallet
altTitle: 
authors:
- danny
users: 500000
appId: com.smartblockchain.wallet
appCountry: 
released: 2023-07-20
updated: 2026-01-25
version: 2.5.0
reviews: 32
website: https://smartwallet.com
repository: 
issue: 
icon: com.smartblockchain.wallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-12-08
signer: 
twitter: 
social: 
redirect_from: 
developerName: YamaD LLC
builds: 
features: 

---

## App Description

Smart Wallet is a multi-asset cryptocurrency wallet that allows users to create multiple wallets, view balances, and send or receive supported digital assets through a unified interface. The Play Store listing claims strong encryption and user-controlled wallet creation but does not specify which blockchains or cryptocurrencies are supported, nor does it document how private keys are generated, stored, or secured internally.

## Analysis

We were able to 'activate the Bitcoin wallet', export the seed phrase, and then import it into Electrum desktop wallet. [The BTC address matches](https://x.com/BitcoinWalletz/status/1997999752441680313). 

A [search on GitHub](https://github.com/search?q=%22com.smartblockchain.wallet%22&type=code) for the app ID did not show any relevant result for an Android app repository.
