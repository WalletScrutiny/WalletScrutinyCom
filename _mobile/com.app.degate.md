---
wsId: deGate
title: 'DeGate: Multichain wallet'
date: 2026-05-27
authors:
- danny
website: https://degate.com/
twitter: DeGateWallet
social:
- https://t.me/degate_public
- https://discord.gg/degate
redirect_from:
- /android/com.app.degate/
- /iphone/com.app.degate/
android:
  appId: com.app.degate
  users: 1000
  released: 2025-06-09
  updated: 2026-04-24
  version: 1.0.24
  icon: com.app.degate.png
  meta: ok
  verdict: nosource
  developerName: DeGate Inc.
iphone:
  appId: com.app.degate
  idd: '6742168343'
  appCountry: us
  released: '2025-06-17T07:00:00Z'
  updated: 2026-05-25
  version: 1.0.25
  reviews: 8
  icon: com.app.degate.jpg
  meta: ok
  verdict: nosource
  developerName: DeGate Inc.

---

## Android

## App Description

DeGate is a self-custody multichain wallet supporting Bitcoin and 10+ chains including Ethereum, Solana, Base, BSC, Arbitrum, Optimism, Polygon, and Avalanche. 

It offers intent-based cross-chain swaps across 10,000,000+ tokens, LP yield via "Turbo Range," and vault yields via "Simple Earn." Keys are derived client-side via BIP44.

## Analysis

DeGate is non-custodial. The protocol documentation states:

> "The DeGate protocol and degate.com do not and cannot access users' wallet private keys."

Testing confirms genuine self-custody: the app generates a Taproot (P2TR, `bc1p`) Bitcoin address that exports correctly and matches when imported into Sparrow. See the [test screencast](https://x.com/BitcoinWalletz/status/2059600654931513845) for evidence.

However, the [degatedev](https://github.com/degatedev) GitHub organization has 34 repositories covering protocols, SDKs, and documentation — no Android source code is available. A [search for the app ID on GitHub](https://github.com/search?q=%22com.app.degate%22&type=code) returns no relevant hits. The self-custody claim is verified in practice but cannot be verified from source.

---

## iPhone

{% include copyFromAndroid.html %}
