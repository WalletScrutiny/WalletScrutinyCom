---
wsId: BinanceUS
title: 'Binance.US: Buy BTC & Crypto'
date: 2026-10-30
authors:
- leo
website: https://www.binance.us
twitter: binanceus
social:
- https://www.linkedin.com/company/binance-us
- https://www.facebook.com/BinanceUS
features:
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
  updated: 2026-10-10
  version: 3.48.1
  reviews: 6951
  icon: com.binance.us.webp
  meta: ok
  verdict: custodial
  developerName: Binance.US
iphone:
  appId: us.binance.fiat
  idd: 1492670702
  appCountry: us
  released: 2020-01-05
  updated: 2026-10-13
  version: 3.49.0
  reviews: 111062
  icon: us.binance.fiat.webp
  meta: ok
  verdict: custodial
  developerName: BAM Trading Services, Inc.

---

## Android

**Update 2026-10-30:** The verdict still holds for the exchange account. The store
description now also advertises "Binance.US Wallet", which it calls "a true
self-custodial crypto wallet" inside the same app. We found no public source code
for the app, so that wallet cannot be verified either. The description also says
that for users in New York and North Carolina, assets "are custodied, cleared, and
settled solely by BitGo". We removed the "FOSS" feature tag, which had no source.
The exchange remains {% include verdictBadge.html verdict="custodial" type='short' %},
like other exchange apps with a built-in Web3 wallet such as
{% include walletLink.html wallet='android/com.okinc.okex.gp' verdict='true' %}.

Binance being a big exchange, the description on Google Play only mentions
security features like FDIC insurance for USD balance but no word on
self-custody. Their website is not providing more information neither. We
assume the app is a custodial offering and therefore **not verifiable**.

---

## iPhone

**Update 2026-10-30:** The verdict still holds. The App Store description does
not mention the self-custodial wallet that the Android description advertises, but
carries the same BitGo custody note for New York and North Carolina. It remains {% include verdictBadge.html verdict="custodial" type='short' %}.

This is the iPhone version of {% include walletLink.html wallet='android/com.binance.us' %} and we
come to the same conclusion for the same reasons. This app is **not verifiable**.

{% include featureEvidence.html feature="tradeAlts" quote="Convert between cryptocurrencies with zero transaction fees. A spread applies when converting crypto." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Easily buy & sell crypto using bank transfer (ACH)" source="Store description" comment="Bank transfer (ACH) qualifies as buying with fiat payment method; however this is ACH not credit card — omitting" %}

{% include featureEvidence.html feature="fingerprint" quote="INDUSTRY-LEADING SECURITY - Trade with peace of mind on the crypto platform of choice for customers looking to securely store their crypto." source="Store description" comment="No explicit fingerprint mention — omitting" %}
