---
wsId: malFinance
title: 'Mal.io: Bitcoin,Trade Crypto'
verdict: custodial
meta: ok
date: 2023-07-11
authors:
- danny
website: https://mal.io/
twitter: MalFinance
social:
- https://t.me/mal_io
- https://youtube.com/channel/UCChWLjFpifD4L1oymW0NBZQ
- http://tiktok.com/@mal.io1
redirect_from:
- /android/com.mal.exchange/
- /iphone/io.mal.exchange/
android:
  appId: com.mal.exchange
  users: 100000
  released: 2021-11-11
  updated: 2025-12-22
  version: 1.0.57
  reviews: 34
  icon: com.mal.exchange.jpg
  developerName: MAL finance مال
iphone:
  appId: io.mal.exchange
  idd: '6443828002'
  appCountry: us
  released: 2023-02-13
  updated: 2025-09-23
  version: 1.8.0
  reviews: 4
  icon: io.mal.exchange.jpg
  developerName: Mal Network Limited

---

## Android

## App Description from Google Play

> Mal.io Platform is a regulated crypto currency trading platform that holds cryptocurrency regulatory licenses in multiple countries, provides users with the opportunity to Buy - Sell - Trade and Store cryptocurrencies and helps them Buy - Sell - Trade hundreds of cryptocurrencies such as Bitcoin, Ethereum, USDT, SHIB, and more.

## Analysis

- [(Screenshots)](https://twitter.com/BitcoinWalletz/status/1678698472617267201)
- The app's language is primarily in Arabic.
- Some deposit functions require KYC before we are able to access it.
- We tried looking for Bitcoin deposit, but could not find it. ([Searching for 'BTC'](https://twitter.com/BitcoinWalletz/status/1678698472617267201/photo/3) in what we assume to be the deposit screen returns empty)
- It is possible to trade BTC with USDT.
- [Withdrawal of BTC](https://doc.mal.io/en/fees) is possible because the platform lists BTC withdrawal fees of 0.0005
- Some clues from the [Terms:](https://doc.mal.io/en/user-agreement)
  - Section 5.2 - About the capacity of the provider to suspend/terminate the user account.
  - Section 5.8 - The provider refers to generally ensuring the security of the user account.
  - Section 11.2.1.2 - About the capacity of the provider to report the details of the user account to authorities
- While the provider does not explicitly discuss its security mechanisms, most of the clues indicate a **custodial** service. We were also not able to find any mechanism for the user to backup the private keys.

---

## iPhone

{% include copyFromAndroid.html %}
