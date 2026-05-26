---
wsId: uniwallet
title: 'UniWallet: Buy Bitcoin, Crypto'
verdict: nosource
meta: ok
date: 2025-12-24
authors:
- danny
website: https://uniwall.et/
twitter: uniwallet_app
social:
- https://t.me/uniwallet_app
- https://www.reddit.com/r/uniwallet_app
- https://web.facebook.com/uniwalletapp
features:
- buyWithCC
- tradeAlts
developerName: UniWallet Ltd.
redirect_from:
- /android/com.uniwallet/
- /iphone/org.uniwallet.UniWallet/
android:
  appId: com.uniwallet
  users: 10000
  released: 2025-01-05
  updated: 2025-09-18
  version: 1.1.0
  reviews: 2
  icon: com.uniwallet.png
iphone:
  appId: org.uniwallet.UniWallet
  idd: '6503896169'
  appCountry: us
  released: 2025-02-11
  updated: 2025-07-20
  version: 1.0.8
  reviews: 1
  icon: org.uniwallet.UniWallet.jpg

---

## Android

## App Description

Described in Google Play:

> UniWallet is a multi-chain self-custody cryptocurrency wallet that supports all major chains and protocols.

## Analysis

Our [tests](https://x.com/BitcoinWalletz/status/2003711808914489580) show that the app supports Bitcoin. It is self-custodial with the seed phrases exportable to third-party wallet apps such as Electrum. Moreover, the legacy addresses matched. The app does not make any claims regarding source-availability. [Searching for the app ID on Github](https://github.com/search?q=%22com.uniwallet%22&type=repositories) did not show any relevant repositories.

**This app is not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="buyWithCC" quote="UniWallet has partnered with the world's biggest 3rd party crypto payment processors to give you global on/off-ramp functionality. Anywhere in the world, you can easily and securely buy crypto with your credit card or sell crypto for fiat directly into your bank account" source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="Easily send, receive and swap crypto between different addresses and chains." source="Store" %}
