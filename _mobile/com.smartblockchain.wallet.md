---
wsId: smartWallet
title: Smart Wallet
date: 2025-12-08
authors:
- danny
website: https://smartwallet.com
features:
- multiAccount
redirect_from:
- /android/com.smartblockchain.wallet/
- /iphone/com.smartblockchain.wallet/
android:
  appId: com.smartblockchain.wallet
  users: 500000
  appCountry: us
  released: 2023-07-20
  updated: 2026-04-27
  version: 2.6.1
  reviews: 33
  icon: com.smartblockchain.wallet.png
  meta: ok
  verdict: nosource
  developerName: YamaD LLC
iphone:
  appId: com.smartblockchain.wallet
  idd: '6463490400'
  appCountry: us
  released: 2023-09-20
  updated: 2026-04-28
  version: 2.6.1
  reviews: 21
  icon: com.smartblockchain.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Yamad LLC

---

## Android

## App Description

Smart Wallet is a multi-asset cryptocurrency wallet that allows users to create multiple wallets, view balances, and send or receive supported digital assets through a unified interface. The Play Store listing claims strong encryption and user-controlled wallet creation but does not specify which blockchains or cryptocurrencies are supported, nor does it document how private keys are generated, stored, or secured internally.

## Analysis

We were able to 'activate the Bitcoin wallet', export the seed phrase, and then import it into Electrum desktop wallet. [The BTC address matches](https://x.com/BitcoinWalletz/status/1997999752441680313). 

A [search on GitHub](https://github.com/search?q=%22com.smartblockchain.wallet%22&type=code) for the app ID did not show any relevant result for an Android app repository.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiAccount" quote="You can create an unlimited number of wallets with just a few clicks, switch between different cryptocurrencies and manage them from a single app." source="Store" %}
