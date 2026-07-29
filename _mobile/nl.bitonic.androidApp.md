---
wsId: bitonic
title: 'Bitonic: buy & store bitcoin'
date: 2026-01-03
authors:
- danny
website: https://bitonic.nl
twitter: bitonic
social:
- https://www.linkedin.com/company/bitonic-b-v-
- https://www.instagram.com/bitonic
redirect_from:
- /android/nl.bitonic.androidApp/
- /iphone/nl.bitonic.Bitonic/
android:
  appId: nl.bitonic.androidApp
  users: 50000
  appCountry: us
  updated: 2026-07-24
  version: 3.28.0
  icon: nl.bitonic.androidApp.jpg
  meta: ok
  verdict: custodial
  developerName: Bitonic
iphone:
  appId: nl.bitonic.Bitonic
  idd: '1503179166'
  appCountry: nl
  released: 2020-05-17
  updated: 2026-07-27
  version: 3.28.0
  reviews: 2581
  icon: nl.bitonic.Bitonic.jpg
  meta: ok
  verdict: custodial
  developerName: Bitonic B.V.

---

## Android

## App Description

Bitonic Wallet is an Android app that allows users to buy, sell, hold, and send Bitcoin (BTC) only, directly integrated with Bitonic’s regulated brokerage service in the Netherlands.

## Analysis

The app does not support altcoins and provides an account-based Bitcoin balance, where users can store BTC within their Bitonic account or send it to an external wallet.

Their reliance on [cold storage](https://bitonic.nl/security) strongly suggests they hold the private keys, making it effectively a **custodial service**:

> We primarily use multi-signature wallets for bitcoin storage in cold storage, meaning bitcoins are kept offline, protected from hacks and online threats.

---

## iPhone

{% include copyFromAndroid.html %}
