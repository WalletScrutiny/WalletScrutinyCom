---
wsId: bitpocketBTC
title: BitPocket - BTC/LN Wallet
verdict: nosource
date: 2025-11-12
authors:
- danny
website: https://www.bitdance.network/
twitter: BitPocketWallet
features:
- ln
- taproot
redirect_from:
- /android/com.bitdance.bitpocket.google/
- /iphone/com.bitdance.bitpocket/
android:
  appId: com.bitdance.bitpocket.google
  users: 1000
  released: 2025-08-22
  updated: 2026-03-18
  version: 1.3.27
  icon: com.bitdance.bitpocket.google.png
  meta: ok
  developerName: Bitdance
iphone:
  appId: com.bitdance.bitpocket
  idd: '6746639763'
  appCountry: au
  released: 2025-06-14
  updated: 2026-04-19
  version: 1.3.23
  reviews: 1
  icon: com.bitdance.bitpocket.jpg
  meta: ok
  developerName: BITDANCE LIMITED

---

## Android

## App Description

BitPocket is a non-custodial Bitcoin wallet that supports both on-chain and Lightning Network transactions within a single interface. Users generate and store their own private keys and recovery seed locally on the device, retaining full control over their funds. The app also supports Taproot Assets without requiring the user to operate a Lightning node, suggesting integrated node connectivity managed client-side.

## Analysis

Seed phrases were provided. We verified that both Lightning and Bitcoin support is available. However, we did not find any claims regarding the source-availability for this app. A search for the [appID on GitHub Code](https://github.com/search?q=%22com.bitdance.bitpocket.google%22&type=code) also did not yield any results.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Manage both Bitcoin + Lightning Network assets in one place." source="Store" %}

{% include featureEvidence.html feature="taproot" quote="Securely handle Taproot Assets without running your own Lightning Network node." source="Store" %}
