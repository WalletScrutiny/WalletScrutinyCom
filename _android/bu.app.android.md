---
wsId: bitunix
title: 'Bitunix Pro: Buy BTC & Crypto'
altTitle: 
authors:
- danny
users: 500000
appId: bu.app.android
appCountry: 
released: 2025-04-29
updated: 2026-04-19
version: 3.30.0
reviews: 80
website: https://www.unixcrypto.net
repository: 
icon: bu.app.android.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-11-11
signer: 
twitter: BitunixOfficial
social:
- https://t.me/bitunixglobal
- https://www.linkedin.com/company/bitunix
- https://www.facebook.com/bitunix
- https://www.instagram.com/bitunix.official
redirect_from: 
developerName: Bitunix Pro
builds: 
features: 

---

**Note:** We have observed that an older and *removed* bitunix app {% include walletLink.html wallet='android/io.bitunix.android' verdict='true' %} exists. 

We also see that there is domain inconsistency in this Android app which lists unixcrypto.net as its homepage. However, its ios counterpart, {% include walletLink.html wallet='iphone/com.bitunix.ios-' verdict='true' %} lists bitunix.com as its homepage. Curiously, bitunix.com lists this android app in its links.

## App Description

BU Exchange is a centralized trading platform that offers spot and futures markets for Bitcoin (BTC) and various altcoins. Users can deposit assets via multiple blockchains, including Bitcoin, Ethereum, and Binance Smart Chain, to trade within custodial accounts managed by the exchange. The app provides no self-custody features or private key access, and all transactions occur within BU’s internal ledger system.

## Analysis 

Section 3.2 "Services Provided" of the User Agreement does not explicitly state key management, but close:

> Asset management and wallet services;

In a [press release](https://support.bitunix.com/hc/en-us/articles/36957185642009-Bitunix-Announces-Major-Security-Upgrade-5-Million-Insurance-Backed-by-UK-Based-Security-Partner), they mentioned that:

> Understanding that the security of digital assets is important, Bitunix partnered with Cobo, ..., in June 2023. This partnership integrates Cobo’s Wallet-as-a-Service (WaaS) into the Bitunix platform, offering users institutional-grade security.

Notwithstanding the branding and domain inconsistency, this is a **custodial** app.