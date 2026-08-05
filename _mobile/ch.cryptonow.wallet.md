---
wsId: cryptoNow
title: Cryptonow
date: 2025-11-11
authors:
- danny
website: https://cryptonow.ch
redirect_from:
- /android/ch.cryptonow.wallet/
- /iphone/ch.cryptonow.wallet/
android:
  appId: ch.cryptonow.wallet
  users: 10000
  appCountry: us
  updated: 2026-06-29
  version: 2.3.1
  icon: ch.cryptonow.wallet.png
  meta: ok
  verdict: nosource
  developerName: Värdex Suisse AG
iphone:
  appId: ch.cryptonow.wallet
  idd: '1607143703'
  appCountry: ch
  released: 2022-07-07
  updated: 2026-06-29
  version: 2.3.1
  reviews: 122
  icon: ch.cryptonow.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Värdex Suisse AG

---

## Android

## App Description

Cryptonow Wallet is a self-custodial mobile wallet that allows users to create or import wallets and manage assets such as Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). It supports private key and seed phrase recovery, as well as importing Cryptonow physical cards containing pre-generated keys. The app operates without server-side custody. 

They also have a bearer token:

{% include walletLink.html wallet='bearer/cryptonowcard' verdict='true' %}

## Analysis

This [section](https://www.cryptonow.ch/en-ch/help/cryptonow-mobile-wallet-app/settings/how-do-i-create-an-app-wallet-backup) discusses seed-phrases.

> Creating a backup for your Cryptonow Wallet App is crucial to ensure the security of your cryptocurrencies at all times. If you lose your smartphone, it gets stolen, or technical problems arise, you can still access your cryptocurrencies using the wallet backup.

We did not find any claims regarding source-availability. We also did [not find its app ID](https://github.com/search?q=%22ch.cryptonow.wallet%22&type=code), in GitHub code or repositories.

This app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}
