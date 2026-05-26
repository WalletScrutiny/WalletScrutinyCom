---
wsId: coincorner
title: CoinCorner
verdict: custodial
date: 2024-10-07
authors:
- kiwilamb
website: https://www.coincorner.com
twitter: CoinCorner
social:
- https://www.facebook.com/CoinCorner
features:
- buyWithCC
- ln
- nfc
redirect_from:
- /android/com.coincorner.app.crypt/
- /iphone/com.coincorner.app.crypt/
android:
  appId: com.coincorner.app.crypt
  users: 10000
  released: 2014-09-10
  updated: 2025-10-10
  version: 5.2.3
  reviews: 5
  icon: com.coincorner.app.crypt.png
  meta: removed
  developerName: CoinCorner Ltd
iphone:
  appId: com.coincorner.app.crypt
  idd: 917721788
  appCountry: gb
  released: 2014-09-22
  updated: 2026-03-24
  version: 5.2.4
  reviews: 309
  icon: com.coincorner.app.crypt.jpg
  meta: ok
  developerName: CoinCorner Ltd

---

## Android

A search of the play store and the providers website, reveals no statements about how private keys are managed.

This leads us to conclude the wallets funds are in control of the provider.

Our verdict: This 'wallet' is custodial and therefore is **not verifiable**.

{% include featureEvidence.html feature="nfc" quote="The world's first contactless Bitcoin debit card. Using NFC like your bank card except it's on the Bitcoin Lightning Network. Tap and pay with Bitcoin today." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy Bitcoin (BTC) with a debit card or bank transfer." source="Website" %}

---

## iPhone

A search of the app store and the providers website, reveals no statements about how private keys are managed.

This leads us to conclude the wallets funds are in control of the provider.

Our verdict: This 'wallet' is custodial and therefore is **not verifiable**.

{% include featureEvidence.html feature="buyWithCC" quote="Buy BTC with a debit card or bank transfer." source="Store description" %}

{% include featureEvidence.html feature="nfc" quote="The world's first contactless Bitcoin debit card. Using NFC like your bank card except it's on the Bitcoin Lightning Network. Tap and pay with Bitcoin today." source="Website" %}
