---
wsId: tapProtocolWallet
title: TAP Protocol Wallet
date: 2026-05-02
authors:
- danny
website: https://tap-protocol.com
twitter: tap_protocol
redirect_from:
- /android/com.tapwalletmobile/
- /iphone/com.tap-protocol.tapwallet/
android:
  appId: com.tapwalletmobile
  users: 1000
  appCountry: us
  released: 2025-07-24
  updated: 2026-01-19
  version: 1.0.29
  icon: com.tapwalletmobile.png
  meta: ok
  verdict: nosource
  developerName: Trac Systems
iphone:
  appId: com.tap-protocol.tapwallet
  idd: '6748963003'
  appCountry: us
  released: 2025-08-05
  updated: 2026-01-20
  version: 1.0.7
  reviews: 7
  icon: com.tap-protocol.tapwallet.jpg
  meta: ok
  verdict: nosource
  developerName: Trac Systems UG (haftungsbeschrankt)

---

## Android

## App Description

TAP Protocol Wallet is presented as a wallet for TAP Protocol tokens and Bitcoin inscription-related assets. The Google Play listing says it supports one-transaction transfers for TAP Protocol tokens and can make sats from inscriptions spendable as Bitcoin. TAP Protocol documentation describes TAP as a protocol built on Bitcoin Ordinals and Bitcoin L1.

## Testing and Analysis

The app is in scope because the listing describes Bitcoin-related wallet functions, including spending sats from inscriptions. Public TAP Protocol repositories document protocol specifications and related tooling.

We [tested the app](https://x.com/BitcoinWalletz/status/2050509492673257614), and found support for BTC. Then 24 words seed phrases. The addresses matched when the seed was exported to Electrum. 

I did [not find the repository](https://github.com/search?q=com.tapwalletmobile&type=code) for the android app by searching for the app ID `com.tapwalletmobile` on GitHub.

This app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}
