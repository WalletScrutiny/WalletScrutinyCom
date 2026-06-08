---
wsId: hotWallet
title: HOT — Bitcoin & Crypto Wallet
date: 2025-11-11
authors:
- danny
website: https://hot-labs.org/privacypolicy
twitter: hotdao_
social:
- https://www.instagram.com/hot_labs
- https://t.me/hotonnear
- https://www.youtube.com/@hot-labs
features:
- customNode
- fingerprint
- tradeAlts
redirect_from:
- /android/app.herewallet.hot/
- /iphone/app.here.dev.wallet/
android:
  appId: app.herewallet.hot
  users: 100000
  appCountry: us
  released: 2025-03-26
  updated: 2025-06-15
  version: '1.0'
  reviews: 65
  icon: app.herewallet.hot.png
  meta: ok
  verdict: nosource
  developerName: HERE Wallet
iphone:
  appId: app.here.dev.wallet
  idd: '6740916148'
  appCountry: us
  released: 2025-01-31
  updated: 2026-01-15
  version: 1.0.3
  reviews: 44
  icon: app.here.dev.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: HERE Wallet, Inc

---

## Android

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

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap & bridge: move tokens cross-chain with just a few taps" source="Store description" %}

{% include featureEvidence.html feature="fingerprint" quote="2FA Enable 2FA and secure your wallet with password protection." source="Website" comment="Insufficient — this only mentions 2FA/password, not fingerprint. Removing." %}

{% include featureEvidence.html feature="customNode" quote="Custom networks 100%" source="Website" %}
