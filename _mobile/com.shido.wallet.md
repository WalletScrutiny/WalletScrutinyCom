---
title: Shido Wallet
date: 2026-10-31
authors:
- leo
website: https://shido.io
android:
  appId: com.shido.wallet
  users: 5000
  appCountry: us
  released: Dec 4, 2023
  updated: 2025-08-22
  version: '1.37'
  reviews: 14
  icon: com.shido.wallet.webp
  meta: stale
  verdict: nobtc
  developerName: Shido Finance
iphone:
  appId: ShidoWalletV2-com.shido.walletv2
  idd: '6473452165'
  appCountry: us
  released: '2024-01-30T08:00:00Z'
  updated: 2025-02-25
  version: '5.0'
  reviews: 29
  icon: ShidoWalletV2-com.shido.walletv2.webp
  meta: stale
  verdict: nobtc
  developerName: Shido Finance

---

## App Description

> Shido Wallet is a secure non-custodial wallet to store, receive and send crypto. Shido Wallet features inbuilt DEX, Web3 Browser and much more.

This is the second-generation wallet of Shido, the team behind the Shido Network, which its [website](https://shido.io) calls "a superfast MultiVM Layer 1". On iPhone it is called "Shido App" and its bundle ID is `ShidoWalletV2-com.shido.walletv2`. It replaces {% include walletLink.html wallet='android/com.shidowallet' verdict='true' %}, which is no longer in the stores.

## Analysis

- **Bitcoin support.** The Shido Network is, in the words of its [documentation](https://docs.shido.io/untitled/shido-network/wallets), "built using the Cosmos SDK" with "both Ethereum Virtual Machine (EVM) and WASM smart contracts". The Play Store screenshots of this app show only EVM assets: the asset list labels Ethereum, SHIDO, USDT and even "Bitcoin" as "ERC20", and transactions go to and from `0x…` addresses. A "Bitcoin ERC20" balance is a wrapped token on an Ethereum-compatible chain, not bitcoin. We found no sign that the app supports the Bitcoin network itself, unlike the old Shido Wallet, which had a Bech32 BTC address.
- **Activity.** The Android app was last updated in August 2025 and the iPhone app in February 2025.

As this wallet does not support bitcoin, it is {% include verdictBadge.html verdict="nobtc" type='short' %}.
