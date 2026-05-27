---
wsId: coincloud
title: 'Coin Cloud: Wallet 1.5'
verdict: nosource
date: 2023-08-29
authors:
- kiwilamb
website: https://www.coin.cloud#deadLink
twitter: CoinCloudATM
social:
- https://www.facebook.com/coincloudATM
redirect_from:
- /android/com.bitpay.coincloud/
- /iphone/com.bitpay.coincloud/
android:
  appId: com.bitpay.coincloud
  users: 50000
  released: 2018-09-06
  updated: 2022-02-16
  version: 12.02.18
  reviews: 101
  icon: com.bitpay.coincloud.png
  meta: removed
  developerName: Coin Cloud
iphone:
  appId: com.bitpay.coincloud
  idd: 1421460676
  released: 2018-09-09
  updated: 2022-02-16
  version: 1.9.6
  reviews: 162
  icon: com.bitpay.coincloud.jpg
  meta: removed

---

## Android

## App and Company History

- Today the url coin.cloud/app redirects to a different domain [(bitstop.co)](https://bitstop.co/), with different apps:
  - {% include walletLink.html wallet='android/co.hodlwallet' verdict='true' %}
  - {% include walletLink.html wallet='iphone/co.hodlwallet' verdict='true' %}

- Genesis Coin, Inc. [was acquired](https://www.nasdaq.com/articles/worlds-largest-bitcoin-atm-software-platform-acquired-by-bitstop-founders) by BitStop founders, January 2023
- Coin Cloud has filed for Chapter 11 bankruptcy last February 2023
- Coin Cloud was [acquired](https://www.atmmarketplace.com/news/genesis-coin-to-add-more-than-5700-crypto-atms-from-coincloud/) by Genesis Coin in July 2023

We didn't dig further as to why the dates don't line up. Our guess is it has something to do with paperwork and filings that do not coincide with the press releases. But ultimately, BitStop became the surviving monolithic entity - hence, the reason for the redirection of the domains. 

## Why does Coin Cloud have so many apps? 

Bad versioning. We took a look at the history of the url "coin.cloud/app" and found that the app was different. 

**For [June 2021](https://web.archive.org/web/20210616162825/https://coin.cloud/app) the linked apps were:**

- {% include walletLink.html wallet='android/com.bitpay.coincloud' verdict='true' %}
- {% include walletLink.html wallet='iphone/com.bitpay.coincloud' verdict='true' %}

**For [March 2023](https://web.archive.org/web/20230316190543/https://coin.cloud/app) the linked apps were:**

- {% include walletLink.html wallet='android/com.coincloud.walletpreview' verdict='true' %}
- {% include walletLink.html wallet='iphone/com.coincloud.walletpreview' verdict='true' %}

## Main Review

It is very clear that the provider is claiming that this wallet is non-custodial with this early statement found in the [play store description](https://play.google.com/store/apps/details?id=com.bitpay.coincloud).

> Keep your bitcoin and other digital currency secure and under your own control with the non-custodial Coin Cloud Wallet app.

With keys in control of the user, we need to find the source code in order to check reproducibility. However we are unable to locate a public source repository.

Our verdict: As there is no source code to be found anywhere, this wallet is at best a non-custodial closed source wallet and as such **not verifiable**.

---

## iPhone

**Update 2022-02-27**: This app is not available anymore.

It is very clear that the provider is claiming that this wallet is non-custodial with this early statement found in the [app store description](https://apps.apple.com/app/id1421460676).

> Keep your bitcoin and other digital currency secure and under your own control with the non-custodial Coin Cloud Wallet app. No third-party custodial services or key management

With keys in control of the user, we need to find the source code in order to check reproducibility. However we are unable to locate a public source repository.

Our verdict: As there is no source code to be found anywhere, this wallet is at best a non-custodial closed source wallet and as such **not verifiable**.
