---
wsId: BinanceUS
title: 'Binance.US: Buy BTC & Crypto'
date: 2020-11-17
authors:
- leo
website: https://www.binance.us
twitter: binanceus
social:
- https://www.linkedin.com/company/binance-us
- https://www.facebook.com/BinanceUS
features:
- foss
- buyWithCC
- fingerprint
- tradeAlts
redirect_from:
- /com.binance.us/
- /android/com.binance.us/
- /iphone/us.binance.fiat/
android:
  appId: com.binance.us
  users: 1000000
  appCountry: us
  released: 2019-12-23
  updated: 2026-06-26
  version: 3.41.1
  reviews: 6893
  icon: com.binance.us.png
  meta: ok
  verdict: custodial
  developerName: Binance.US
iphone:
  appId: us.binance.fiat
  idd: 1492670702
  appCountry: us
  released: 2020-01-05
  updated: 2026-06-27
  version: 3.41.1
  reviews: 110755
  icon: us.binance.fiat.jpg
  meta: ok
  verdict: custodial
  developerName: BAM Trading Services, Inc.

---

## Android

Binance being a big exchange, the description on Google Play only mentions
security features like FDIC insurance for USD balance but no word on
self-custody. Their website is not providing more information neither. We
assume the app is a custodial offering and therefore **not verifiable**.

{% include featureEvidence.html feature="foss" comment="(no justification provided by LLM)" %}

---

## iPhone

This is the iPhone version of {% include walletLink.html wallet='android/com.binance.us' %} and we
come to the same conclusion for the same reasons. This app is **not verifiable**.

{% include featureEvidence.html feature="tradeAlts" quote="Convert between cryptocurrencies with zero transaction fees. A spread applies when converting crypto." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Easily buy & sell crypto using bank transfer (ACH)" source="Store description" comment="Bank transfer (ACH) qualifies as buying with fiat payment method; however this is ACH not credit card — omitting" %}

{% include featureEvidence.html feature="fingerprint" quote="INDUSTRY-LEADING SECURITY - Trade with peace of mind on the crypto platform of choice for customers looking to securely store their crypto." source="Store description" comment="No explicit fingerprint mention — omitting" %}
