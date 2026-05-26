---
wsId: ammerWallet
title: Ammer Wallet
verdict: nosource
meta: ok
date: 2023-07-20
authors:
- danny
twitter: AmmerCards
features:
- companion
- nfc
redirect_from:
- /android/ammer.wallet/
- /iphone/io.trustody.wallet/
android:
  appId: ammer.wallet
  users: 10000
  released: 2022-12-05
  updated: 2025-12-18
  version: 1.8.1
  reviews: 1
  icon: ammer.wallet.png
  website: https://ammer.cards/
  developerName: Ammer Technologies AG
iphone:
  appId: io.trustody.wallet
  idd: '1599698329'
  appCountry: nz
  released: 2022-03-04
  updated: 2026-01-11
  version: '9.0'
  reviews: 0
  icon: io.trustody.wallet.jpg
  website: https://ammer.cards
  developerName: Ammer Technologies AG

---

## Android

This app is used in conjunction with the {% include walletLink.html wallet='hardware/ammer.cards' verdict='true' %}.

## Update 2024-07-24

We did not find any evidence that the source code for this app is publicly available.

## App Description from Google Play 2023-07-20

> Ammer Wallet is a secure, non-custodial, multi-asset wallet app that allows you to easily manage your digital assets as well as fully use crypto for everyday shopping.
>
> You can store, send, receive, buy, and sell cryptocurrencies and NFTs. Ammer Wallet supports major blockchain protocols (Polygon, Ethereum, Waves, Celo, Casper, and others) and currencies (Bitcoin, Ton, Litecoin, Dogecoin, etc.).

## Information from the [FAQ](https://ammer.cards/#openFAQ)

> - Ammer Card is a non-custodial hardware wallet that stores your crypto keys.
> - Virtual cards in Ammer Wallet serve as a software wallet, and the keys are stored in your mobile device.
> - Unlike bank cards, your Ammer Card belongs to you, not the bank.
> - Neither Ammer card, nor virtual cards are bank cards, and there isn’t any kind of fiat account associated with them. However, they look like a traditional bank card to provide you with a familiar experience.
> - When you pay with your Ammer Card or a virtual card, you pay directly in your crypto on blockchain without any kind conversion to fiat.
> - Unlike bank cards, Ammer and virtual cards are accepted only by the merchants in the Ammer Pay network (both in stores and online).
> - You can have as many Ammer Cards as you’d like. However, you can only have 3 virtual cards in your Ammer Wallet.

## Analysis

- The app initializes by creating a virtual card. This has the resemblance of actual physical Ammer cards. 
- Inside the virtual card are various cryptocurrencies including bitcoin. 
- We were able to find an account with legacy BTC address that can send/receive. 
- There was an option to back up the private keys of the virtual card. It exported a 64-character string.
- We did not find any claims regarding source-availability.
- When we searched for the app ID in GitHub Code, we only found [1 unrelated file.](https://github.com/search?q=ammer.wallet&type=code)
- This app is **not source-available.**

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="nfc" quote="Ammer Card has the traditional shape of a credit card and can be used for payment with Ammer Pay due to its NFC capability." source="Store description" %}

{% include featureEvidence.html feature="companion" quote="Ammer Card is a multi-asset hardware wallet with an accessible shape of a bank card with NFC capability. It comes with an easy to use companion app called Ammer Wallet that allows you to manage your assets." source="Website" %}
