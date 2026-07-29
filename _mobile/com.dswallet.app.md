---
wsId: digitalShield
title: 'Digital Shield: Crypto Wallet'
date: 2026-05-01
authors:
- danny
website: https://ds.pro
twitter: DigitShield_HQ
social:
- https://discord.com/invite/digitshield
- https://www.youtube.com/@DigitalShield-s6j
- https://www.facebook.com/profile.php?id=61577514952314
- https://t.me/DigitaShield
redirect_from:
- /android/com.dswallet.app/
- /iphone/com.digitalshield.walletapp/
android:
  appId: com.dswallet.app
  users: 5000
  appCountry: us
  released: 2025-03-19
  updated: 2026-07-27
  version: 2.2.1
  icon: com.dswallet.app.png
  meta: ok
  verdict: nosource
  developerName: Yoime Technologie
iphone:
  appId: com.digitalshield.walletapp
  idd: '6740052686'
  appCountry: at
  released: 2025-01-16
  updated: 2026-07-29
  version: 2.2.1
  reviews: 0
  icon: com.digitalshield.walletapp.jpg
  meta: ok
  verdict: nosource
  developerName: HONG KONG YUHENG NETWORK TECHNOLOGY CO., LIMITED

---

## Android

This is the **companion app** to the {% include walletLink.html wallet='hardware/digitalshieldpro' verdict='true' %}.

## App Description 

Digital Shield Wallet is an Android application that claims to function as part of a “security-first, open-source decentralized wallet system” integrating a hardware wallet, mobile app, and blockchain data services. The Play Store description states that private keys are secured within a hardware wallet featuring a CC EAL6+ certified chip, with the mobile app acting as an interface for viewing balances, executing transactions, and managing assets via Bluetooth connectivity. It also claims support for multi-wallet management, real-time notifications, and compatibility with multiple blockchains and tokens.

## App Analysis

The `dswallet` GitHub organization (`github.com/dswallet`) contains four public repositories — `core`, `common`, `contracts`, and `passport` — comprising backend microservice libraries built on NestJS and TypeScript; no Android application source code is present, and a GitHub search for the package identifier `com.dswallet.app` returns no results. The Play Store lists the developer as Yoime Technologie; the website's terms and conditions identify the legal operator as YuhengNetwork Technology Co., Limited; and promotional materials for the associated hardware device reference Feitian Technologies as the manufacturer.

## Analysis

We tested the app and posted the [video on x.com](https://x.com/BitcoinWalletz/status/2050119090996716001).

The Play Store listing and associated marketing assert the project is “100% open source”, but no source code for the Android application is publicly available — only backend infrastructure libraries are published, under ISC license. The official website (ds.pro) explicitly names Bitcoin, Ethereum, and TRON as supported networks; broader claims of “12+ blockchains and 5000+ tokens” found in third-party marketing materials are not verifiable from the developer's own primary sources.

This app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}
