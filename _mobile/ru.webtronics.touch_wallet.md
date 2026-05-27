---
wsId: touchWalletCrypto
title: Touch Wallet — Crypto Wallet
date: 2024-10-03
authors:
- danny
website: https://touchwallet.com/
twitter: Touch_Wallet
social:
- https://t.me/TouchWalletEN
redirect_from:
- /android/ru.webtronics.touch_wallet/
- /iphone/ru.webtronics.touchwallet2/
android:
  appId: ru.webtronics.touch_wallet
  users: 10000
  appCountry: us
  released: 2022-10-29
  updated: 2025-04-30
  version: 2.1.14
  icon: ru.webtronics.touch_wallet.png
  meta: stale
  verdict: custodial
  developerName: CLOUD FARMER L.L.C-FZ
iphone:
  appId: ru.webtronics.touchwallet2
  idd: '6443906980'
  appCountry: us
  released: 2022-11-01
  updated: 2024-08-26
  version: 2.1.0
  reviews: 3
  icon: ru.webtronics.touchwallet2.jpg
  meta: removed
  verdict: custodial
  developerName: CLOUD FARMER L.L.C-FZ

---

## Android

## App Description from Google Play

> TouchWallet is a convenient and secure service for depositing, storing, and withdrawing the most popular cryptocurrencies: BTC, ETH, USDT, LTC, BNB, XMR, DOGE. Use individual settings, control the balance of your crypto wallets, track exchange rates, and manage assets through one personal account.

## Google Play Reviews

> [uwem joseph](https://play.google.com/store/apps/details?id=ru.webtronics.touch_wallet&gl=ru)<br>
  ★☆☆☆☆ July 13, 2023 <br>
       Why is this app misbehaving, downloaded it two times but yet the same thing 😔, it is the same network am using in others but it is tell me no network, gosh 😞

## Analysis

- The app has a rating of 2.0 stars given by 53 reviewers. The actual reviews are hidden.
- After registration, the email address is verified.
- Logging in brings us to the main page. The bottom tab menu includes:
  - Main
  - Balance
  - NFT
  - Menu
- Clicking on BTC, opens a wallet page with the following options:
  - Top up Balance
  - Withdraw Funds 
  - Exchange
  - Settings
  - Buy
- The app provides a Bech32 BTC address for receiving Bitcoin.
- There is also a withdrawal option.
- There is no backup mechanism for the private keys. We find this concerning since the provider states that they do not store the private keys in the Terms.
- We find it irregular that the Terms can only be read from the app during registration and cannot be copy-pasted. We could not find a copy of the Terms on their website.
- Even though it is stated in the Terms that the provider does not control the private keys, they have also not provided a way to extract this using the app. Without the private keys, the only assumption we can make is that they do control it after all, thus making this service **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
