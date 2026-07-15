---
wsId: ViaWallet
title: CoinEx Wallet - Crypto & DeFi
date: 2021-10-01
authors:
- leo
- danny
website: https://viawallet.com
twitter: viawallet
social:
- https://www.facebook.com/ViaWallet
features:
- hd
- multiAccount
- tradeAlts
redirect_from:
- /com.viabtc.wallet/
- /posts/com.viabtc.wallet/
- /android/com.viabtc.wallet/
- /iphone/com.viabtc.ViaWallet/
android:
  appId: com.viabtc.wallet
  users: 100000
  appCountry: us
  released: 2019-05-15
  updated: 2026-06-30
  version: 4.23.5
  reviews: 61
  icon: com.viabtc.wallet.png
  meta: ok
  verdict: nosource
  developerName: ViaBTC
iphone:
  appId: com.viabtc.ViaWallet
  idd: 1462031389
  appCountry: us
  released: 2019-05-21
  updated: 2026-07-14
  version: 4.23.3
  reviews: 54
  icon: com.viabtc.ViaWallet.jpg
  meta: ok
  verdict: nosource
  developerName: Coinex Global Limited

---

## Android

## Update 2024-07-13

No updates have been observed regarding this app's source code availability.

## Review 2020-04-27

This app's description contains

> Users' self-control for private key to manage assets

which sounds like a claim to being non-custodial.

Also on their [FAQ](https://support.viawallet.com/hc/en-us/articles/900000212786-Is-my-digital-assets-safely-stored-in-ViaWallet-)
we read:

> **Is my digital assets safely stored in ViaWallet?**
> ViaWallet is a subsidiary brand of ViaBTC, which was founded in May 2016 as an
  innovation-intensive startup dedicated to cryptocurrency with rich
  technological prowess and experience in global operation of blockchain
  industry. With the most state-of-the-art Fintech, we aims to provide a
  self-controlled and easy-accessible multi-cryptocurrency wallet across
  devices, safeguarded with industry-leading security for your digital assets.

which says "self-controlled" but nowhere do we find a hint at this wallet's
source code. We assume it's claiming to be non-custodial but remain with the
verdict: **not verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Cross-chain swap · No need to transfer between wallet and exchange. · Using CoinEx Wallet to exchange cryptos conveniently." source="Store" %}

{% include featureEvidence.html feature="multiAccount" quote="One-stop asset management for multiple wallets and cryptos" source="Store" %}

{% include featureEvidence.html feature="hd" quote="Full self-custody of private key and assets" source="Store" comment="Store states private keys are held by users and supports multi-wallet management with mnemonic backup implied by self-custody decentralized wallet; however this is borderline — omitting per conservative rule" %}
