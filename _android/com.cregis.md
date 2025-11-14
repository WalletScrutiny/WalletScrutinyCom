---
wsId: cregisApp
title: Cregis:BTC, ETH Wallet & Pay
altTitle: 
authors:
- danny
users: 500
appId: com.cregis
appCountry: 
released: Apr 5, 2023
updated: 2025-09-17
version: 3.5.0
stars: 
ratings: 
reviews: 
website: https://www.cregis.com
repository: 
issue: 
icon: com.cregis.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-14
signer: 
twitter: 0xCregis
social: 
redirect_from: 
developerName: Cregis
features: 

---

## App Description

Cregis is an enterprise-focused MPC wallet platform that provides multi-asset support, including Bitcoin. The app combines MPC shard generation with a traditional recovery phrase, allowing users to back up and reset wallet shards using a 15-word mnemonic. Wallet creation includes automatic provisioning of BTC, ETH, and multiple stablecoin networks. The system relies on both device-side and server-side MPC components for transaction signing and shard recovery.

## Analysis

We tested the Cregis Android app firsthand, as documented in this [Twitter post:](https://x.com/BitcoinWalletz/status/1989146382406664506)

Key findings from the test:

- The app shows BTC support immediately after wallet creation.
- Cregis generates MPC key shards, but also requires a 15-word recovery phrase for shard reset.
- The presence of a mnemonic confirms that the wallet is not seedless MPC, but a hybrid MPC + seed phrase model.

However, we found no claims regarding the availability of its source code, nor did we find a relevant [Android app ID in its GitHub code.](https://github.com/search?q=%22com.cregis%22&type=code)