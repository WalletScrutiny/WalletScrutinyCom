---
wsId: rezorWallet
title: 'Rezor : Crypto Wallet'
verdict: nosource
date: 2025-12-08
authors:
- danny
twitter: rezor_official
social:
- https://t.me/rezorofficial
- https://www.instagram.com/rezor.rzr
redirect_from:
- /android/com.rezor/
- /iphone/com.rezor/
android:
  appId: com.rezor
  users: 1000
  released: 2025-04-05
  updated: 2026-03-30
  version: '1'
  reviews: 10
  icon: com.rezor.png
  meta: ok
  developerName: saitaresilia
iphone:
  appId: com.rezor
  idd: '6751512715'
  appCountry: us
  released: 2025-10-08
  updated: 2025-11-05
  version: 1.0.5
  reviews: 21
  icon: com.rezor.jpg
  meta: ok
  developerName: rezor foundation

---

## Android

## App Description

Rezor is a multi-chain non-custodial cryptocurrency wallet that allows users to store, buy, and swap digital assets across supported EVM-compatible networks such as Ethereum, BNB Smart Chain, Polygon, and Avalanche. 

The project states that users retain control of their private keys and can access features like cross-chain swaps and portfolio tracking through the native Rezor Wallet interface. 

## Analysis

Rezor’s official website provides documentation about seed-phrase creation and wallet recovery but does not list Bitcoin (BTC) among its supported networks or assets.

However, during [testing](https://x.com/BitcoinWalletz/status/1997942736960577944) we found a Bitcoin wallet and successfully exported the provided seed phrase to Electrum.

**There are no claims regarding source availability**, and [we did not find a relevant Android repository](https://github.com/search?q=%22com.rezor%22&type=code) for the app.

---

## iPhone

{% include copyFromAndroid.html %}
