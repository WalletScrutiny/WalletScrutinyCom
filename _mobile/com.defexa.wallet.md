---
wsId: defexaWallet
title: Defexa - Safe Crypto Wallet
verdict: nosource
meta: ok
authors:
- danny
twitter: DefexaCrypto
social:
- https://discord.com/invite/JaSnYuXYS5
- https://t.me/defexa
- https://www.linkedin.com/company/defexa
- https://www.quora.com/profile/Defexa
features:
- buyWithCC
- hd
- multiAccount
- tradeAlts
developerName: FPS Global LTD
redirect_from:
- /android/com.defexa.wallet/
- /iphone/com.defexa.CryptoWallet-Defexa/
android:
  appId: com.defexa.wallet
  users: 10000
  released: 2023-04-28
  updated: 2025-12-10
  version: 2.3.0
  reviews: 5
  icon: com.defexa.wallet.png
  date: 2023-11-02
  website: https://defexa.io/wallet/
iphone:
  appId: com.defexa.CryptoWallet-Defexa
  idd: '6446314571'
  appCountry: jp
  released: 2023-05-29
  updated: 2025-12-17
  version: 2.4.0
  reviews: 0
  icon: com.defexa.CryptoWallet-Defexa.jpg
  date: 2026-02-02
  website: https://defexa.io/wallet

---

## Android

## App Description from Google Play

> Defexa Wallet is the ultimate all-in-one toolkit that helps you manage your stablecoins, and altcoins. With Defexa, you can accept, transfer, exchange Crypto and Fiat currencies, all in one single ecosystem. Some of the available options include BTC, ETH, BNB, USDT, USDC & TRX.
>
> NON-CUSTODIAL ARCHITECTURE
>
> Be in control of your assets. Defexa is a safe crypto wallet that provides unprecedented security for storing your cryptocurrencies.
>
> Your funds never leave your custody: Defexa leverages mnemonic phrases as the safest way to hold crypto.
>
> Store your funds safely, without any third-party risks.

## Analysis

- We tested the app and the seed phrases were provided during initialization.
- There is a Bech32 BTC address that can send and receive.
- We searched GitHub for the appID and found [0 results.](https://github.com/search?q=com.defexa.wallet&type=code)
- This app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="Defexa leverages mnemonic phrases as the safest way to hold crypto." source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Use unlimited number of multichain wallets" source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy crypto with a credit card directly on the Defexa Wallet App." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Store, exchange, buy, sell, swap & send crypto in one app" source="Store description" %}
