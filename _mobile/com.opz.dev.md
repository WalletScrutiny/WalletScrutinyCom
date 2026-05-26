---
wsId: opzCryptoBTC
title: 'OPZ: Crypto & BTC Wallet'
verdict: custodial
meta: stale
date: 2026-05-05
authors:
- danny
website: https://www.opz.io
twitter: OPZ_Official
social:
- https://t.me/OPZ_Chat
- https://discord.com/invite/SSmXDHCMZC
features:
- nfc
redirect_from:
- /android/com.opz.dev/
- /iphone/com.opz/
android:
  appId: com.opz.dev
  users: 1000
  released: 2023-08-16
  updated: 2025-05-16
  version: 2.12.1
  reviews: 31
  icon: com.opz.dev.png
  developerName: OPZ
iphone:
  appId: com.opz
  idd: '6463236757'
  appCountry: us
  released: 2024-12-09
  updated: 2025-05-08
  version: 2.12.1
  reviews: 1
  icon: com.opz.jpg
  developerName: OPZ, LLC

---

## Android

## App Description

OPZ markets itself as an “all-in-one Web3 wallet” using MPC under the in-house “KeyFusion” protocol, meaning users sign transactions with multiple key shares instead of a mnemonic seed phrase. The Play Store description also advertises multi-factor authentication, WalletConnect v2, an embedded dApp browser, OPZ-branded NFC hardware for storing keys offline, and even an on-device “OPZ-AI” assistant. Security copy focuses on scanning tokens/dApps for risks and verifying destination addresses, while the [site](https://www.opz.io) touts its mission to “accelerate the transition to self-ownership of assets”.

## Analysis

Despite those self-custody claims, OPZ keeps everything closed-source: there’s [no repository for the Android](https://github.com/search?q=%22com.opz.dev%22&type=code) or iOS apps, yet the company still pushes proprietary features (KeyFusion, OPZ-NFC, AI assistant, risk scanners) that can’t be independently audited. The wallet additionally layers in 24/7 customer support and onboarding that requires registering an account within OPZ’s own backend, suggesting there may be server-dependent components even for MPC signing.

Our [tests](https://x.com/BitcoinWalletz/status/1991488024673427775) show that the app supports Bitcoin, but does not offer to backup the seed phrases. Instead users are given an MPC Key which is a lengthy alphanumeric string that could be backed up to the 'OPZ Cloud'. This app is **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="nfc" quote="OPZ NFC Technology: Connect NFC-enabled devices with Web3, allowing users to interact with the decentralized applications (dApps) with just a tap." source="Store" %}
