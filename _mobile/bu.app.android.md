---
wsId: bitunix
title: 'Bitunix Pro: Buy BTC & Crypto'
date: 2024-09-06
authors:
- danny
website: https://www.unixcrypto.net
twitter: BitunixOfficial
social:
- https://t.me/bitunixglobal
- https://www.linkedin.com/company/bitunix
- https://www.facebook.com/bitunix
- https://www.instagram.com/bitunix.official
features:
- buyWithCC
- fingerprint
- tradeAlts
redirect_from:
- /android/bu.app.android/
- /iphone/com.bitunix.ios-/
android:
  appId: bu.app.android
  users: 500000
  appCountry: us
  released: 2025-04-29
  updated: 2026-08-03
  version: 3.45.0
  reviews: 116
  icon: bu.app.android.png
  meta: ok
  verdict: custodial
  developerName: Bitunix Pro
iphone:
  appId: com.bitunix.ios-
  idd: '6446243957'
  appCountry: us
  released: 2023-04-11
  updated: 2026-07-06
  version: 3.41.0
  reviews: 722
  icon: com.bitunix.ios-.jpg
  meta: ok
  verdict: custodial
  developerName: Bitunix Global Limited

---

## Android

**Note:** We have observed that an older and *removed* bitunix app {% include walletLink.html wallet='android/io.bitunix.android' verdict='true' %} exists. 

We also see that there is domain inconsistency in this Android app which lists unixcrypto.net as its homepage. However, its ios counterpart, {% include walletLink.html wallet='iphone/com.bitunix.ios-' verdict='true' %} lists bitunix.com as its homepage. Curiously, bitunix.com lists this android app in its links.

## App Description

BU Exchange is a centralized trading platform that offers spot and futures markets for Bitcoin (BTC) and various altcoins. Users can deposit assets via multiple blockchains, including Bitcoin, Ethereum, and Binance Smart Chain, to trade within custodial accounts managed by the exchange. The app provides no self-custody features or private key access, and all transactions occur within BU’s internal ledger system.

## Analysis 

Section 3.2 "Services Provided" of the User Agreement does not explicitly state key management, but close:

> Asset management and wallet services;

In a [press release](https://support.bitunix.com/hc/en-us/articles/36957185642009-Bitunix-Announces-Major-Security-Upgrade-5-Million-Insurance-Backed-by-UK-Based-Security-Partner), they mentioned that:

> Understanding that the security of digital assets is important, Bitunix partnered with Cobo, ..., in June 2023. This partnership integrates Cobo’s Wallet-as-a-Service (WaaS) into the Bitunix platform, offering users institutional-grade security.

Notwithstanding the branding and domain inconsistency, this is a **custodial** app.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Trade spot and futures markets with Bitcoin, Ethereum, and leading altcoins, supported by deep liquidity and advanced trading tools." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy and sell crypto instantly with Apple Pay, Google Pay, Visa, Mastercard, and P2P fiat transfers." source="Store description" %}

{% include featureEvidence.html feature="fingerprint" quote="Rely on our secure operations with Proof of Reserves, licensed compliance, advanced risk monitoring, and strict asset protection standards." source="Store description" %}
