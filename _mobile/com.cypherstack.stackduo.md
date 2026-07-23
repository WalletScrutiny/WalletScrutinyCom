---
wsId: stackDuo
title: Stack Duo
date: 2026-07-23
authors:
- danny
website: https://stackwallet.com
twitter: stack_wallet
social:
- https://discord.com/invite/mRPZuXx3At
- https://t.me/stackwallet
- https://www.reddit.com/r/stackwallet
- https://www.youtube.com/channel/UCqCtpXsLyNIle1uOO2DU7JA
redirect_from:
- /android/com.cypherstack.stackduo/
- /iphone/com.cypherstack.stackduo/
android:
  appId: com.cypherstack.stackduo
  users: 500
  appCountry: us
  released: 2024-06-29
  updated: 2025-11-26
  version: 2.4.2
  icon: com.cypherstack.stackduo.png
  meta: fewusers
  verdict: sourceavailable
  developerName: Cypher Stack Team
  repository: https://github.com/cypherstack/stack_wallet
iphone:
  appId: com.cypherstack.stackduo
  idd: '6446602017'
  appCountry: us
  released: 2023-03-29
  updated: 2025-11-27
  version: 2.4.2
  reviews: 7
  icon: com.cypherstack.stackduo.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Cypher Stack LLC
  repository: https://github.com/cypherstack/stack_wallet

---

## Android

## App Description from Google Play

> Stack Duo is a fully open source cryptocurrency wallet. It is a fork of Stack Wallet, but stripped down to just Bitcoin and Monero.
>
> - All private keys and seeds stay on device and are never shared.
> - Easy backup and restore feature to save all the information that's important to you.
> - Trading cryptocurrencies through our partners.
> - Custom address book
> - Favorite wallets with fast syncing
> - Custom Nodes.

## Analysis 

Stack Duo is Cypher Stack's own Bitcoin-and-Monero-only edition of {% include walletLink.html wallet='mobile/com.cypherstack.stackwallet' verdict='true' %}. Its source code has been merged into the Stack Wallet repository: the official [build instructions](https://github.com/cypherstack/stack_wallet/blob/staging/docs/building.md) build it directly as an application target — `./build_app.sh -a stack_duo -p android` (and `-p ios`) — so the current app for both platforms is built from [cypherstack/stack_wallet](https://github.com/cypherstack/stack_wallet). The separate [stack_duo repository](https://github.com/cypherstack/stack_duo) is kept for release continuity — it still publishes releases up to the current **v2.4.2** — but its source tree is no longer where development happens. The wallet is fully open source and non-custodial (seeds stay on device), so it is **source-available** and a candidate **for verification**: reproduce it from the Stack Wallet repository with `build_app.sh -a stack_duo`.

---

## iPhone

{% include copyFromAndroid.html %}
