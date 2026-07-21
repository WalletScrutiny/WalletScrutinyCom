---
wsId: bunqApp
title: bunq
date: 2025-08-28
authors:
- danny
website: http://www.bunq.com
twitter: bunq
social:
- https://www.linkedin.com/company/bunq
- https://www.youtube.com/channel/UCNZo2GsB_ToorMDDSHoo70g
- https://www.facebook.com/bunq
- https://www.instagram.com/bunq
redirect_from:
- /android/com.bunq.android/
- /iphone/com.bunq.ios/
android:
  appId: com.bunq.android
  users: 5000000
  appCountry: us
  released: 2015-11-25
  updated: 2026-07-16
  version: 31.12.1
  reviews: 234
  icon: com.bunq.android.png
  meta: ok
  verdict: nosendreceive
  developerName: bunq
iphone:
  appId: com.bunq.ios
  idd: '1021178150'
  appCountry: de
  released: 2016-02-12
  updated: 2026-07-16
  version: 31.12.0
  reviews: 14278
  icon: com.bunq.ios.jpg
  meta: ok
  verdict: nosendreceive
  developerName: bunq

---

## Android

## App Description

bunq is a Dutch digital bank that offers traditional banking services alongside cryptocurrency trading functionality. The app allows users to buy, sell, and swap over 350 cryptocurrencies through a partnership with Kraken, with fees ranging from 0.25% to 1.99% depending on the subscription tier. Users can manage multiple bank accounts, savings accounts, and payment cards within the platform. The crypto feature includes portfolio tracking, price alerts, and Safety Shield protection that holds crypto sale proceeds for 24 hours.

## Analysis

1. **Is it a wallet?** No, bunq is primarily a traditional bank that offers crypto trading as an additional service. 

2. **Is it for bitcoins?** Partially, bunq supports Bitcoin trading but it's just one of 350+ cryptocurrencies offered as a banking service.

3. **Can it send and receive bitcoins?** No, bunq explicitly prohibits transferring crypto assets to external wallets as stated in their [Terms and Conditions](https://www.bunq.com/legal/terms-personal#deadLink).

4. **Is the product self-custodial?** No, crypto assets are stored by Kraken, bunq's licensed partner, not by the user.

5. **Is the source code publicly available?** No, there is no mention of open source code in bunq's documentation.

6. **Is the decompiled binary legible?** Not applicable, as the source code is not available.

7. **Is the source code of this wallet available?** No, bunq does not provide public access to their source code.

## Verdict

bunq cannot function as a Bitcoin wallet because it explicitly prohibits external transfers. According to their Terms and Conditions: "For your security and to ensure compliance with regulatory requirements, crypto assets held via the bunq app **cannot be transferred to external wallets.**" This restriction makes it impossible to send Bitcoin to external addresses or receive Bitcoin from external sources, limiting users to internal trading only within bunq's ecosystem.

---

## iPhone

{% include copyFromAndroid.html %}
