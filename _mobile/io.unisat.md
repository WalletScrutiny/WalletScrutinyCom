---
wsId: uniSat
title: UniSat Wallet
date: 2025-10-23
authors:
- danny
website: https://unisat.io/
twitter: unisat_wallet
social:
- https://discord.com/invite/unisat
features:
- foss
redirect_from:
- /android/io.unisat/
- /iphone/io.unisat.mobile/
android:
  appId: io.unisat
  users: 100000
  appCountry: us
  released: 2024-03-16
  updated: 2026-06-02
  version: 1.7.16
  reviews: 19
  icon: io.unisat.png
  meta: ok
  verdict: nosource
  developerName: UniSat
iphone:
  appId: io.unisat.mobile
  idd: '6498628503'
  appCountry: us
  released: 2024-08-30
  updated: 2026-06-04
  version: 1.7.16
  reviews: 31
  icon: io.unisat.mobile.jpg
  meta: ok
  verdict: nosource
  developerName: UniPro Technology Limited

---

## Android

## App Description

UniSat Wallet is a non-custodial hierarchical deterministic (HD) Bitcoin wallet that supports storage and transfer of Bitcoin, Ordinals, and related token standards such as BRC-20, Alkanes, Runes, and CAT-20. 

They claim to enable users to inscribe (mint) Ordinals without requiring a full node and displays unconfirmed inscriptions in real time. 

They also mention that private keys are generated from a Secret Recovery Phrase, encrypted locally by the user’s password, and never transmitted externally. UniSat does not collect personally identifiable information or track balances.

They claim that the extension version of their app is 100% Open Source. But it appears that the wording is vague and may seem to imply that the entire project is 100% Open Source.

## Analysis 

We installed the app and was provided the seed phrases during initialization. 

Bitcoin is supported. 

However, when we checked their repository, we found what was supposed to be their android repository [unisat-app](https://github.com/unisat-wallet/unisat-app) only contains a README.md. 

A search on GitHub using the appID (related to android build settings) returned [non-relevant results.](https://github.com/search?q=io.unisat&type=code)

Despite claims, this app is **NOT source available**

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="foss" quote="Fully Open Source Built with transparency in mind. Review our code anytime at https://github.com/unisat-wallet/extension" source="Store" %}
