---
wsId: hotWallet
title: HOT — Bitcoin & Crypto Wallet
altTitle: 
authors:
- danny
users: 100000
appId: app.herewallet.hot
appCountry: 
released: 2025-03-26
updated: 2025-06-15
version: '1.0'
stars: 4.3
ratings: 
reviews: 59
website: https://hot-labs.org/privacypolicy
repository: 
issue: 
icon: app.herewallet.hot.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-11
signer: 
twitter: hotdao_
social:
- https://www.instagram.com/hot_labs
- https://t.me/hotonnear
- https://www.youtube.com/@hot-labs
redirect_from: 
developerName: HERE Wallet
builds: 
features: 

---

## App Description

HOT Wallet is a multi-chain self-custodial wallet that supports major blockchains including Bitcoin, Ethereum, Solana, TRON, and NEAR. It uses multi-party computation (MPC) for key management and allows optional connection to Ledger hardware wallets. The app enables users to swap and bridge tokens across networks and integrates with decentralized applications through WalletConnect-style interfaces.

## Analysis

We tested the app, which offers two account types:

**Standard Account**: Generates a standard 12-word BIP39 mnemonic that can be imported into
other wallets (tested successfully with Electrum). This provides traditional self-custody with
full interoperability.

**MPC Account**: Uses Multi-Party Computation with a 13-word non-standard seed phrase linked to
a NEAR account. The app explicitly states this account "can only use it inside HOT Wallet."
The private key is sharded between your device and the provider's servers, creating vendor
lock-in and custodial risk.

Both account types support SegWit BTC wallets.

There were no claims regarding source-availability. We did find their [GitHub 
organization](https://github.com/orgs/hot-dao/) page, but did not find an Android-related
repository.

This app offers self-custodial options (Standard Account) but **is not source-available**.