---
wsId: ethosCrypto
title: 'Ethos: Crypto Trading Wallet'
verdict: nosource
date: 2025-11-14
authors:
- danny
website: https://www.ethos.io
twitter: Ethos_io
redirect_from:
- /android/com.ethos2.prod/
- /iphone/com.ethos2.app/
android:
  appId: com.ethos2.prod
  users: 10000
  released: 2023-06-26
  updated: 2026-05-01
  version: 5.4.0
  reviews: 21
  icon: com.ethos2.prod.png
  meta: ok
  developerName: Ethos.io
iphone:
  appId: com.ethos2.app
  idd: '6450948705'
  appCountry: nl
  released: 2023-09-10
  updated: 2026-05-01
  version: 5.4.0
  reviews: 2
  icon: com.ethos2.app.jpg
  meta: ok
  developerName: Ethos Corporation

---

## Android

## App Description

Ethos is an MPC-based self-custody wallet built around an Ethereum-only architecture, using a mobile Secure Element and a proprietary “Magic Keys” recovery system instead of traditional seed phrases.

Its vault system stores and manages user keys through a multi-party cryptography scheme, enabling self-custody access and on-device signing for Ethereum and ERC-20 assets.

The app supports self-custody swaps through the 0x protocol and provides real-time analytics and portfolio monitoring for Ethereum-ecosystem tokens.

## Analysis

We were able to [test](https://x.com/BitcoinWalletz/status/1989222846212845661) the app and found a Bitcoin wallet as well as the 24-word seeds. 

There were **no claims regarding source-availability** nor did we find its Android app repository by [searching for its app identifier on GitHub Code.](https://github.com/search?q=%22com.ethos2.prod%22&type=code)

---

## iPhone

{% include copyFromAndroid.html %}
