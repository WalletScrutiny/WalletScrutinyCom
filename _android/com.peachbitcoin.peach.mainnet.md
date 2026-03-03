---
wsId: 
title: Peach Bitcoin
altTitle: 
authors:
- danny
users: 10000
appId: com.peachbitcoin.peach.mainnet
appCountry: 
released: 
updated: 2026-03-02
version: 0.69.0
reviews: 
website: https://peachbitcoin.com
repository: https://github.com/Peach2Peach/peach-app
issue: 
icon: com.peachbitcoin.peach.mainnet.png
bugbounty: 
meta: ok
verdict: wip
appHashes: 
date: 2025-11-26
signer: 
twitter: peachbitcoin
social:
- https://t.me/peachtopeach
- https://discord.com/invite/ypeHz3SW54
- https://snort.social/p/npub15369wu3wzzar5fclhecyqfv683x69n6nhlg7rxqnsg2dydgxflpq3apswl
redirect_from: 
developerName: Peach Bitcoin
builds: 
features: 

---

## App Description

Peach Bitcoin is a peer-to-peer Bitcoin trading platform that facilitates non-KYC (no identity verification) transactions between buyers and sellers. The app includes an integrated self-custodial Bitcoin wallet where users control their private keys through a 12-word seed phrase that can be backed up and restored in standard Bitcoin wallets like Sparrow. During trades, Peach uses a 2-of-2 multisignature escrow system where sellers lock Bitcoin in an address requiring both their signature and Peach's signature to move funds, which are released to the buyer's wallet once payment is confirmed. The platform is licensed as a Swiss financial service provider and operates as an SRO member of Polyreg, supporting various payment methods including cash transactions across Europe, Africa, and Latin America.

**Note:** iOS version is currently only available via TestFlight (beta), not on the main App Store.

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/1993584064218206313) the app and can confirm the presence of a Bitcoin wallet with a 12-word seed phrase. We were able to import the seed phrases unto Electrum desktop and can confirm that the [addresses match](https://x.com/BitcoinWalletz/status/1993585057764983136) with the one provided by the app. 

This app is **for verification**.