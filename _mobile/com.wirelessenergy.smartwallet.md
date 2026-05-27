---
wsId: swtWallet
title: SWT Wallet
verdict: nosource
date: 2026-05-05
authors:
- danny
website: https://swttoken.com/
twitter: swttoken
social:
- https://t.me/swttoken
- https://www.instagram.com/swttoken/
redirect_from:
- /android/com.wirelessenergy.smartwallet/
- /iphone/com.wirelessenergy.smartwallet/
android:
  appId: com.wirelessenergy.smartwallet
  users: 500
  released: 2021-09-24
  updated: 2026-05-16
  version: 2.17.0
  icon: com.wirelessenergy.smartwallet.png
  meta: fewusers
  developerName: Smart Wallet Token
iphone:
  appId: com.wirelessenergy.smartwallet
  idd: '6751100799'
  appCountry: us
  released: 2026-02-02
  updated: 2026-05-18
  version: 2.17.0
  reviews: 0
  icon: com.wirelessenergy.smartwallet.jpg
  meta: ok
  developerName: Smart Wallet Token

---

## Android

## App Description

SWT Wallet is promoted as a multi-asset cryptocurrency wallet and exchange app. The Play Store listing says it supports assets such as SWT, USDT, ETH, TRX, BNB, MATIC, and other popular assets, while the official website describes wallet, swap, card, and Web3 features.

## Analysis

We tested the app and posted the video on [X.com](https://x.com/BitcoinWalletz/status/2051602559660695907). The app provided seed phrases, and when the seed was imported into Electrum, the Bitcoin addresses matched.

Testing also showed that Bitcoin can be sent and received in the app. This supports the app's claim that the user controls the wallet keys.

However, we found no public source repository for the Android wallet app. A GitHub search for the app id `com.wirelessenergy.smartwallet` did [not return relevant source code](https://github.com/search?q=com.wirelessenergy.smartwallet&ref=opensearch&type=code), and the public GitHub account only shows documentation and smart-contract repositories, not the source code for the mobile wallet.

This app supports self-custodial Bitcoin use, but the mobile app **source code is not publicly available**.

---

## iPhone

{% include copyFromAndroid.html %}
