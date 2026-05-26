---
wsId: maxSwapApp
title: 'MaxSwap: Crypto Bitcoin Wallet'
verdict: custodial
date: 2025-08-29
authors:
- danny
website: https://maxswap.cc
features:
- fingerprint
redirect_from:
- /android/com.maxswap.app/
- /iphone/com.maxswap.app/
android:
  appId: com.maxswap.app
  users: 1000
  released: 2024-06-19
  updated: 2025-07-22
  version: 1.0.0
  icon: com.maxswap.app.jpg
  meta: ok
  developerName: MS Profit LTD
iphone:
  appId: com.maxswap.app
  idd: '6501994899'
  appCountry: ca
  released: 2024-12-13
  updated: 2024-12-14
  version: 1.0.1
  reviews: 0
  icon: com.maxswap.app.jpg
  meta: stale
  developerName: MW Profit LTD

---

## Android

## App Description

MaxSwap markets itself as a "Crypto Bitcoin Wallet" but explicitly describes its service as a "Reliable custodial wallet" in the Google Play Store. 

The platform offers cryptocurrency trading, virtual card services, and wallet functionality, but operates under a custodial model where MaxSwap maintains control of user funds.

## Analysis

**1. Is it a wallet?**
Yes, but operates as a custodial wallet service. MaxSwap explicitly labels itself as a "Reliable custodial wallet" in their Google Play Store description. We tested the app, and can verify that A BTC wallet that can send/receive is in the features.

**2. Is it for bitcoins?**
Yes. The app is marketed as "MaxSwap: Crypto Bitcoin Wallet" and supports Bitcoin along with other cryptocurrencies.

**3. Ability to send & receive**
Yes the BTC wallet can send and receive but the seed phrases were not provided through the interface.

**4. Key custody**
Custodial. MaxSwap explicitly describes their service as a "custodial wallet" and uses an account-based system:
- *"Reliable custodial wallet"* (Google Play Store description)
- *"You need only your email without any personal data for successful registration. Access to your account is managed through a PIN, fingerprint, Face ID"* (Play Store listing)
- *"You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account"* ([Terms of Use](https://maxswap.cc/terms-of-use/))

## Conclusion

MaxSwap operates as a **custodial** cryptocurrency service that explicitly markets itself as a "custodial wallet." While it supports Bitcoin and likely allows deposits/withdrawals, users do not control private keys. Instead, they access funds through email/PIN-based accounts managed by MaxSwap.

The platform combines wallet functionality with trading and virtual card services, but the custodial nature means users rely on MaxSwap's infrastructure and policies for fund access and security.

{% include featureEvidence.html feature="fingerprint" quote="Access to your account is managed through a PIN, fingerprint, Face ID" source="Store" %}

---

## iPhone

{% include copyFromAndroid.html %}
