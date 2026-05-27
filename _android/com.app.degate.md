---
wsId: deGate
title: 'DeGate: Multichain wallet'
altTitle: 
authors:
  - danny
users: 1000
appId: com.app.degate
alternativeStores: 
appCountry: 
released: 2025-06-09
updated: 2026-04-24
version: 1.0.24
reviews: 
website: https://degate.com/
repository: 
icon: com.app.degate.png
bugbounty: 
meta: ok
verdict: nosource
date: 2026-05-27
signer: 
twitter: DeGateWallet
social:
  - https://t.me/degate_public
  - https://discord.gg/degate
redirect_from: 
developerName: DeGate Inc.
builds: 
features: 

---

## App Description

DeGate is a self-custody multichain wallet supporting Bitcoin and 10+ chains including Ethereum, Solana, Base, BSC, Arbitrum, Optimism, Polygon, and Avalanche. 

It offers intent-based cross-chain swaps across 10,000,000+ tokens, LP yield via "Turbo Range," and vault yields via "Simple Earn." Keys are derived client-side via BIP44.

## Analysis

DeGate is non-custodial. The protocol documentation states:

> "The DeGate protocol and degate.com do not and cannot access users' wallet private keys."

Testing confirms genuine self-custody: the app generates a Taproot (P2TR, `bc1p`) Bitcoin address that exports correctly and matches when imported into Sparrow. See the [test screencast](https://x.com/BitcoinWalletz/status/2059600654931513845) for evidence.

However, the [degatedev](https://github.com/degatedev) GitHub organization has 34 repositories covering protocols, SDKs, and documentation — no Android source code is available. A [search for the app ID on GitHub](https://github.com/search?q=%22com.app.degate%22&type=code) returns no relevant hits. The self-custody claim is verified in practice but cannot be verified from source.

