---
wsId: bitarooexpress
title: Bitaroo Express - Buy Bitcoin
verdict: custodial
date: 2024-09-05
authors:
- danny
website: https://www.bitaroo.com.au
twitter: BitarooExchange
social:
- https://www.youtube.com/@bitarooexchange
- https://www.linkedin.com/company/bitaroo/
- https://www.reddit.com/r/Bitaroo/
features:
- buyWithCC
- ln
- multiSig
redirect_from:
- /android/au.com.bitaroo.express/
- /iphone/au.com.bitaroo.express/
android:
  appId: au.com.bitaroo.express
  users: 1000
  updated: 2026-04-14
  version: 3.4.1
  icon: au.com.bitaroo.express.png
  meta: ok
  developerName: Bitaroo
iphone:
  appId: au.com.bitaroo.express
  idd: '6444825898'
  appCountry: au
  released: 2022-12-20
  updated: 2026-04-14
  version: 3.4.1
  reviews: 24
  icon: au.com.bitaroo.express.jpg
  meta: ok
  developerName: Bitaroo

---

## Android

## Analysis

- Supports bitcoin
- Allows for deposit/withdrawal
- Users are not in control of the private keys

## Observations

Bitaroo Express is an exchange with support for Lightning Network and on-chain transactions and it supports the buying, selling, deposit/withdraw of bitcoin. There's no mention of private keys or self custody anywhere in the description of the app. [However, this article](https://support.bitaroo.exchange/hc/en-au/articles/8633601898767-Why-did-Bitaroo-build-a-Vault) has some more information on how Bitaroo "holds" users' bitcoin.

> Users who utilise our long-term custodial services but do not engage in buying, selling, paying a BPAY bill, depositing, or withdrawing will have their coins automatically moved to the [Bitaroo Vault](https://support.bitaroo.exchange/hc/en-au/articles/7880245231759-What-is-Bitaroo-Vault).

The Bitaroo Vault mentioned here is a **custodial** storage solution. It's unlikely that this app lets the users hold their own private keys, and even less likely to be open source and available for reproducibility testing.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="It supports both on-chain transactions and the Lightning Network, giving you speed and flexibility." source="Store" %}

{% include featureEvidence.html feature="multiSig" quote="We guard one of your keys Collaborative multi-sig security for peace of mind." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Bitaroo Express lets you buy, sell, receive, store, and send bitcoin with ease." source="Store" %}
