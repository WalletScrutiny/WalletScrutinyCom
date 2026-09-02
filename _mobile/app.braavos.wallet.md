---
wsId: braavosWallet
title: 'Braavos: BTC & Starknet Wallet'
date: 2025-11-03
authors:
- danny
website: https://braavos.app/
twitter: myBraavos
features:
- buyWithCC
- fingerprint
- ln
- tradeAlts
redirect_from:
- /android/app.braavos.wallet/
- /iphone/app.braavos.wallet/
android:
  appId: app.braavos.wallet
  users: 100000
  appCountry: us
  released: 2022-07-12
  updated: 2026-02-04
  version: 4.19.6
  icon: app.braavos.wallet.png
  meta: ok
  verdict: nosource
  developerName: FreeBraavos
iphone:
  appId: app.braavos.wallet
  idd: '1636013523'
  appCountry: us
  released: 2022-08-02
  updated: 2026-02-07
  version: 4.19.6
  reviews: 119
  icon: app.braavos.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Braavos LTD.

---

## Android

## App Description 

Braavos Wallet is a mobile self-custodial wallet for Bitcoin (BTC), Ethereum (ETH), and StarkNet (STRK) assets under the Android package app.braavos.wallet. It integrates a StarkNet smart-contract account system allowing on-chain DeFi interactions and staking directly from the app, with optional Bitcoin and Lightning Network support. The wallet claims to use biometric authentication and on-device seed phrase storage for key management, while connecting to StarkNet-based DeFi protocols for yield generation.

## Analysis 

We tested the app, created a BTC wallet that can send/receive and were shown the seed phrases. No overt claims about source-availability has been observed.

A search on GitHub shows their [organization](https://github.com/orgs/myBraavos) page, but this app is **not source available**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="seamless Lightning payments" source="Store description" %}

{% include featureEvidence.html feature="fingerprint" quote="Biometric transaction protection (FaceID or fingerprint)" source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="start with fiat using Apple Pay, Google Pay or direct deposit" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="swap tokens" source="Store description" %}
