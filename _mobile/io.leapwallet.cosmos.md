---
wsId: leapWallet
title: Leap Wallet
date: 2025-11-09
authors:
- danny
website: https://www.leapwallet.io/mobile
twitter: leap_cosmos
social:
- https://www.reddit.com/user/Leap_Wallet
redirect_from:
- /android/io.leapwallet.cosmos/
- /iphone/com.LeapCosmosWallet/
android:
  appId: io.leapwallet.cosmos
  users: 100000
  appCountry: us
  released: 2023-02-14
  updated: 2026-03-27
  version: 0.77.0
  reviews: 99
  icon: io.leapwallet.cosmos.png
  meta: removed
  verdict: nosource
  developerName: Leap Wallet
iphone:
  appId: com.LeapCosmosWallet
  idd: '1642465549'
  appCountry: us
  released: 2022-11-02
  updated: 2026-04-01
  version: 0.77.0
  reviews: 1136
  icon: com.LeapCosmosWallet.jpg
  meta: removed
  verdict: nosource
  developerName: Hyphen Labs Ltd.

---

## Android

## App Description

The claims on Google Play:

Leap Wallet is a self-custodial, multichain mobile wallet that lets users manage, swap, stake, and interact with DeFi across Cosmos-based chains, EVM networks, Solana, and Bitcoin using user-controlled private keys. The app provides portfolio aggregation, NFT management, and secure dApp access in a single interface, without relying on provider custody.

## Testing and Analysis

We [tested the app](https://x.com/BitcoinWalletz/status/2004832799661207754), and verified the existence of a Bitcoin wallet. The seed phrases were provided and when [exported into Electrum desktop](https://x.com/BitcoinWalletz/status/2004834400438288831), the addresses matched.

However, we did not find any claims regarding source-availability, nor did we find relevant repositories when [searching for the app ID on GitHub](https://github.com/search?q=%22io.leapwallet.cosmos%22&type=code).

---

## iPhone

{% include copyFromAndroid.html %}
