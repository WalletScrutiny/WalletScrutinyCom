---
wsId: zapitWeb3Wallet
title: 'Zapit: Web3 Wallet'
date: 2026-01-02
authors:
- danny
website: http://zapit.io
twitter: zapit_io
social:
- https://www.linkedin.com/company/zapit-io
- https://www.reddit.com/user/zapit_io
redirect_from:
- /android/io.wallet.zapit/
- /iphone/io.zapit.wallet/
android:
  appId: io.wallet.zapit
  users: 10000
  appCountry: us
  released: 2021-03-23
  updated: 2025-08-29
  version: 0.9.67
  reviews: 12
  icon: io.wallet.zapit.png
  meta: ok
  verdict: custodial
  developerName: Zapit Web3 Platform
iphone:
  appId: io.zapit.wallet
  idd: '1558433083'
  appCountry: in
  released: 2021-06-26
  updated: 2025-03-22
  version: v0.9.64
  reviews: 8
  icon: io.zapit.wallet.jpg
  meta: removed
  verdict: custodial
  developerName: Zapit Limited

---

## Android

## App Description

Zapit is a multi-chain, self-custodial Web3 wallet that lets users send, receive, and swap cryptocurrencies across networks including Bitcoin, Bitcoin Cash, Ethereum, Polygon, Avalanche, and Litecoin.

Beyond basic wallet functionality, Zapit integrates play-to-earn games, rewards, and discount mechanisms that are closely tied to its broader Web3 and token ecosystem

## Testing and Analysis

We [tested](https://x.com/BitcoinWalletz/status/2006967095796576692) the app and Zapit displays and operates a Bitcoin on-chain address, but the provided recovery phrase does not reproduce the Bitcoin wallet using standard derivation schemes. As a result, Bitcoin funds cannot be independently restored using external Bitcoin wallets, making Bitcoin custody effectively dependent on the Zapit app.

This is a **custodial service**.

---

## iPhone

{% include copyFromAndroid.html %}
