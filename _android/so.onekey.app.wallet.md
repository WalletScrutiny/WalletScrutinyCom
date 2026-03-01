---
wsId: onekeySo.new
title: 'OneKey: Crypto DeFi Wallet'
altTitle: 
authors:
- danny
users: 100000
appId: so.onekey.app.wallet
appCountry: 
released: 2022-04-27
updated: 2026-02-14
version: 6.0.0
reviews: 91
website: https://onekey.so
repository: https://github.com/OneKeyHQ/app-monorepo
issue: 
icon: so.onekey.app.wallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2025-07-21
signer: 
twitter: OneKeyHQ
social:
- https://discord.com/invite/nwUJaTzjzv#deadLink
redirect_from: 
developerName: ONEKEY LIMITED
builds: 
features: 

---

## Updated Analysis 2025-07-21

**Key Finding:**  
As of version 5.10.0, the OneKey Android app allows users to create a new wallet and access all wallet functions without connecting a hardware device. This was confirmed by video testing ([see demonstration](https://x.com/dannybuntu/status/1947142524147249221)), where a seed phrase was generated and wallet operations were performed with no hardware present.

**Implications:**  
- The app is no longer solely a hardware companion; it is now a fully functional non-custodial wallet.
- The previous verdict of `nowallet` is outdated and has been updated to reflect the app's current capabilities.

**Evidence:**  
- Video demonstration (see link above).
- Seed phrases were generated and provided during the test.
- We were able to access BTC send/receive functions.

## Possible Build Specifications

After analyzing the repository we find:

**Tech Stack Summary:**
- React Native (JavaScript/TypeScript)
- Yarn Workspaces (monorepo management)
- Gradle (Android build system)
- Node.js (>=20 required)
- Java JDK (>=11 required)
- Expo SDK (for development)
- Android SDK & Android Studio (for building/running)

This app is now **source available** and **for verification**.

## App Description from Google Play 

> All new designed and open source project of OneKey Wallet.

> MULTI-CHAIN SUPPORT
>
> Solana, Aptos, Near, STC, BTC, DOGE, LTC, Tron, EVM Chains (BSC, ETH, Arbitrum, Avalanche, Optimism, Polygon, CELO, CRO, FTM, HECO, OEC, xDai, and customized EVM Network).

## Analysis 

- The app claims to be Open Source and has provided the repository
- That app claims to support BTC sending and receiving 
- There is a presumption that it is non-custodial because of the reliance on the hardware wallets for the storage of private keys. Such as:

> BACK UP WITH ONEKEY LITE
> 
> Back up and restore your wallet without typing a word.

We tried installing the app on several of our devices: 

- On a Samsung phone with Android 12 
- On BlueStacks 5 Nougat 32-bit
- On BlueStacks 5 Pie 64-bit 
- APKCombo on BlueStacks5 Pie 64-bit
- Android Studio Emulator Pixel 5 API 29 Android 10 

And all failed. 

As [@loatheb1](https://gitlab.com/loatheb1) has explained on [GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/469): 

> "None of these three products can be used without our APP. We all need our APP to send data, process the received information inside the hardware, and then return it. This ensures that the private key in our hardware must be is safe." 

As a **companion app** to OneKey's hardware wallets, the app does not function as a wallet itself. 
