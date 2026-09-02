---
wsId: byteWallet
title: ByteVault
date: 2023-05-05
authors:
- danny
website: https://www.bytefederal.com
twitter: bytefederal
social:
- https://www.facebook.com/bytefederal
- https://www.instagram.com/bytefederalatm
- https://www.youtube.com/channel/UCozOzfZ0MgqLT_TA7hbNh4g
- https://www.linkedin.com/company/bytefederal
features:
- hd
- ln
- multiAccount
redirect_from:
- /android/io.bytewallet.bytewallet/
- /iphone/com.bytefederal.bytewallet/
android:
  appId: io.bytewallet.bytewallet
  users: 10000
  appCountry: us
  released: 2021-07-20
  updated: 2026-09-01
  version: VARY
  reviews: 54
  icon: io.bytewallet.bytewallet.png
  meta: ok
  verdict: nosource
  developerName: Byte Federal, Inc
iphone:
  appId: com.bytefederal.bytewallet
  idd: '1569062610'
  appCountry: us
  released: 2021-07-27
  updated: 2026-09-02
  version: 1.7.0.4
  reviews: 49
  icon: com.bytefederal.bytewallet.jpg
  meta: ok
  verdict: nosource
  developerName: Byte Federal, Inc.

---

## Android

## Update 2024-07-22

[Description from the website:](https://www.bytefederal.com/)

>  Send & receive Bitcoin, find any ATM and login instantly.
>
>    World’s fastest growing non-custodial crypto wallet
>    Buy, sell & trade crypto under one platform
>    Swap cryptocurrencies instantly

It claims to be non-custodial, which means that the private keys would be under control of the user. As for the topic of reproducibility, we found an associated [GitHub profile.](https://github.com/bytefederal/) but no source code for the wallet. This app remains **not verifiable.**

## Old Review 2023-05-05

> Store, send, and receive Bitcoin safely and easily. Manage your ByteFederal account and find our nearest Bitcoin ATM locations.

## Analysis 

[(Screenshots)](https://twitter.com/BitcoinWalletz/status/1654313718086529025)
- We installed the app and was able to create a Bitcoin wallet.
- The wallet can send/receive.
- The app provided the backup phrase.
- There are no claims the app is Open Source.
- We were not able to find the corresponding app ID on GitHub.
- This app's source is **not publicly available.**

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="The Lightning Network is supported as well!" source="Store" %}

{% include featureEvidence.html feature="hd" quote="Backup and recovery are quick and easy with your unique 12-word seed phrase, the current industry standard for security." source="Store" %}

{% include featureEvidence.html feature="multiAccount" quote="Create as many wallets as you like and store BTC, ETH, LTC, DOGE, and even MARS, the future currency of the planet Mars." source="Store" %}
