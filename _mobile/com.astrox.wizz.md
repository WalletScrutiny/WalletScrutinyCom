---
wsId: wizzWallet
title: WizzWallet
verdict: nosource
date: 2025-11-03
authors:
- danny
website: https://wizzwallet.io
twitter: wizzwallet
social:
- https://discord.com/invite/H7hzuDj2d6
features:
- segwit
- hd
- taproot
redirect_from:
- /android/com.astrox.wizz/
- /iphone/com.astrox.wizz/
android:
  appId: com.astrox.wizz
  users: 1000
  released: 2023-07-10
  updated: 2025-10-13
  version: 1.9.11
  icon: com.astrox.wizz.png
  meta: ok
  developerName: AstroX Network
iphone:
  appId: com.astrox.wizz
  idd: '6451117430'
  appCountry: us
  released: 2023-07-12
  updated: 2025-10-15
  version: 1.9.11
  reviews: 16
  icon: com.astrox.wizz.jpg
  meta: ok
  developerName: AstroX Network

---

## Android

## App Description

Wizz Wallet is an Android Bitcoin wallet that supports on-chain transactions and UTXO-based protocols such as Atomicals, ARC-20, and RGB assets. It stores private keys locally on the device and allows users to manage and transfer supported assets. The wallet integrates Atomicals functionality for minting and tracking digital items on Bitcoin. It operates entirely on the Bitcoin main chain without custodial intermediaries.

## Analysis 

We were able to find the [GitHub organization page](https://github.com/WizzWallet) for the app. It currently lists 6 repositories, but none of them are related to the Android app.

- elex-proxy
- wizzwallet-provider-demo
- Memedinal
- AIPs
- atom32_python
- networks

This app's source is **not available publicly**.

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="Support legacy, segwit, taproot address types." source="Store" %}

{% include featureEvidence.html feature="taproot" quote="Support legacy, segwit, taproot address types." source="Store" %}

{% include featureEvidence.html feature="hd" quote="Create and restore your wallet using seed phrase." source="Store" %}
