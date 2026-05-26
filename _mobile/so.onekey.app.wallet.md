---
wsId: onekeySo.new
title: 'OneKey Wallet: Bitcoin & Web3'
verdict: sourceavailable
meta: ok
date: 2025-07-21
authors:
- danny
repository: https://github.com/OneKeyHQ/app-monorepo
twitter: OneKeyHQ
social:
- https://discord.com/invite/nwUJaTzjzv#deadLink
features:
- companion
- airGapped
- batching
- buyWithCC
- camera
- customNode
- fingerprint
- secEl
- tradeAlts
redirect_from:
- /android/so.onekey.app.wallet/
- /iphone/so.onekey.wallet/
android:
  appId: so.onekey.app.wallet
  users: 100000
  released: 2022-04-27
  updated: 2026-05-19
  version: 6.3.0
  reviews: 93
  icon: so.onekey.app.wallet.png
  website: https://onekey.so
  developerName: ONEKEY LIMITED
iphone:
  appId: so.onekey.wallet
  idd: '1609559473'
  appCountry: us
  released: 2022-04-27
  updated: 2026-05-20
  version: 6.3.0
  reviews: 680
  icon: so.onekey.wallet.jpg
  website: https://onekey.so?utm_source=app_store
  developerName: ONEKEY LIMITED

---

## Android

{% include featureEvidence.html feature="companion" source="Review" quote="None of these three products can be used without our APP." %}

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

---

## iPhone

## Update 2025-07-21

The Android App's verdict is now **source available** and is **for verification**. 

The iPhone app remains non-verifiable because all apps distributed through the Apple App Store are re-signed and encrypted by Apple before delivery to users. This process alters the original binary, making it impossible to directly compare the published app with a version built from source code. As a result, researchers and users cannot independently verify that the code released by developers matches the app actually installed on iOS devices.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Multiple protection layers: App password, biometrics, and hardware wallet integration" source="Store" %}

{% include featureEvidence.html feature="secEl" quote="Our hardware wallets use EAL6+ secure elements, supporting offline signing, Bluetooth, or QR code communication for real air-gapping." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="OneKey Swap aggregates liquidity across multiple chains and DEXs to find the best rates and lowest slippage." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="The system automatically compares quotes from multiple trusted providers to get you the best price." source="Store" %}

{% include featureEvidence.html feature="airGapped" quote="Our hardware wallets use EAL6+ secure elements, supporting offline signing, Bluetooth, or QR code communication for real air-gapping." source="Store" %}

{% include featureEvidence.html feature="camera" quote="supporting offline signing, Bluetooth, or QR code communication for real air-gapping." source="Store" %}

{% include featureEvidence.html feature="customNode" quote="Custom RPC networks, batch address import, instant balance preview." source="Store" %}

{% include featureEvidence.html feature="companion" quote="qr-wallet-sdk/ # QR-code hardware wallet SDK" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="batch address import, instant balance preview." source="Store" %}
