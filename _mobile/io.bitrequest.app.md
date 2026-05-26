---
wsId: bitrequest
title: Bitrequest
verdict: nosendreceive
meta: fewusers
date: 2026-05-05
authors:
- danny
website: https://www.bitrequest.io
twitter: bitrequest
social:
- https://github.com/bitrequest/bitrequest.github.io
- https://www.reddit.com/r/bitrequest/
- https://www.youtube.com/channel/UCwrbrnGg82FQdVQqCSEBmug/featured
redirect_from:
- /android/io.bitrequest.app/
- /iphone/io.bitrequest.app/
android:
  appId: io.bitrequest.app
  users: 500
  released: 2019-11-01
  updated: 2026-02-24
  version: 1.6.1
  icon: io.bitrequest.app.png
  meta: fewusers
  developerName: XpressZo
iphone:
  appId: io.bitrequest.app
  idd: '1484815377'
  appCountry: us
  released: 2019-11-15
  updated: 2026-03-11
  version: '1.30'
  reviews: 1
  icon: io.bitrequest.app.jpg
  meta: ok
  developerName: XpressZo

---

## Android

## App Description

Bitrequest is a cryptocurrency payment request and point-of-sale app. The Play Store listing says it lets businesses accept cryptocurrencies as a POS and send payment requests to friends.

## Analysis

The official website describes Bitrequest as a non-custodial app for creating and sharing cryptocurrency payment requests. It supports Bitcoin, including Lightning Network integrations, and can generate a seed phrase and derive Bitcoin addresses locally.

However, Bitrequest's own [privacy page](https://www.bitrequest.io/privacy/) states:

> Bitrequest is a tool for accepting cryptocurrencies. It's not possible to send any funds.

This means Bitrequest has local wallet/address-generation functionality, but it does not allow users to send Bitcoin transactions. It is therefore a receive/request-only Bitcoin payment tool rather than a full Bitcoin wallet.

This app can generate Bitcoin receiving addresses, but it **cannot send Bitcoin**.

---

## iPhone

{% include copyFromAndroid.html %}
