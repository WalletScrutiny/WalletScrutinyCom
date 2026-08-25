---
title: BankSocial
date: 2026-07-22
website: https://www.banksocial.io
redirect_from:
- /android/app.banksocial.io/
- /iphone/Com.BankSocial.app/
android:
  appId: app.banksocial.io
  users: 10000
  appCountry: us
  released: 2021-09-22
  updated: 2026-02-08
  version: 2.31.0
  reviews: 35
  icon: app.banksocial.io.png
  meta: ok
  verdict: nosource
  developerName: BankSocial
iphone:
  appId: Com.BankSocial.app
  idd: '1586052784'
  appCountry: us
  released: 2021-10-26
  updated: 2026-02-09
  version: 2.31.0
  reviews: 144
  icon: Com.BankSocial.app.jpg
  meta: ok
  verdict: nosource
  developerName: Fivancial, Inc d/b/a BankSocial

---

## App Description

BankSocial is a cryptocurrency wallet available for Android and iOS. According to the developer's [setup instructions](https://support.banksocial.io/en/articles/13668972-how-to-create-a-banksocial-wallet), users can create a new wallet or import an existing wallet using private keys or a recovery phrase. Its [Google Play listing](https://play.google.com/store/apps/details?id=app.banksocial.io) says the app supports holding, buying, and staking digital assets, including Bitcoin and Ethereum, as well as HBAR on the Hedera network.

## Testing and Analysis

Our [testing](https://x.com/BitcoinWalletz/status/2079762837786996844), performed on the Android app on a Samsung device, confirms that the app provides a Bitcoin wallet. The app displayed the Bitcoin receiving address `bc1q3kke7qjt0c5q4tjfhjr5fgkgccwh5uuqu3vnzl` and an exportable 12-word seed phrase, which it labels a "passphrase." We imported those words into a third-party wallet and reproduced the same Bitcoin address, confirming that the user can independently recover the Bitcoin wallet.

We found no published source code for either mobile application. The [BankSocial GitHub organisation](https://github.com/BankSocial) hosts only supporting components — an open-source token list and a fork of the `bip39` library — not the Android or iOS application. BankSocial's own materials market the app as self-custodial but make no claim that its source is available. With a working self-custodial Bitcoin wallet but no published source, we assign the verdict **nosource**.
