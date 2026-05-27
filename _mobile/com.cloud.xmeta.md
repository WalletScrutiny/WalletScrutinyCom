---
wsId: xMetaExchange
title: X-Meta Exchange
verdict: custodial
date: 2023-12-19
authors:
- danny
website: https://x-meta.com
twitter: XMetaOfficial
social:
- https://www.facebook.com/xmetaofficial
- https://t.me/xmetaofficialgroup
redirect_from:
- /android/com.cloud.xmeta/
- /iphone/com.x-meta.exchange/
android:
  appId: com.cloud.xmeta
  users: 10000
  released: 2022-02-14
  updated: 2022-12-19
  version: 2.1.0
  reviews: 8
  icon: com.cloud.xmeta.png
  meta: obsolete
  developerName: x-meta
iphone:
  appId: com.x-meta.exchange
  idd: '1603193880'
  appCountry: ru
  released: 2022-02-13
  updated: 2022-03-11
  version: 1.1.0
  reviews: 3
  icon: com.x-meta.exchange.jpg
  meta: removed
  developerName: X-META LLC

---

## Android

## App Description from Google Play

> World’s Largest Crypto Exchange Pool; with over 140 pairs to Trade.
>
> Get started today and buy BTC, ETH, IHC, SOL, LUNA, BNB and even some meme coins! All with some of the lowest trading fees available on our exchange!
>
> X-META is powered by Binance Cloud, your funds are protected by Binance Secure Asset Fund for Users (SAFU Funds)

## Analysis

- We downloaded the app and found:
  - A multicoin wallet provided by the platform
  - A BTC/USDT trading pair where users can either buy or sell
  - A BTC wallet, with a legacy address, where users can store BTC.
  - Security options include:
    - SMS Authenticator
    - Google Authenticator
  - Identity Authentication
  - Provision for Withdrawal Address

- We were not able to find any option to backup the private keys of the app.
- The absence of the private keys makes this a **custodial** app.

---

## iPhone

{% include copyFromAndroid.html %}
