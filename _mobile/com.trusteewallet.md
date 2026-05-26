---
wsId: Trustee
title: Trustee | crypto & btc wallet
verdict: sourceavailable
meta: ok
date: 2026-03-23
authors:
- leo
- danny
- keraliss
twitter: Trustee_Wallet
social:
- https://www.facebook.com/Trustee.Wallet
features:
- buyWithCC
- tradeAlts
redirect_from:
- /com.trusteewallet/
- /posts/com.trusteewallet/
- /android/com.trusteewallet/
- /iphone/com.trusteewallet/
android:
  appId: com.trusteewallet
  users: 500000
  released: 2019-05-01
  updated: 2026-03-18
  version: 1.52.3
  reviews: 62
  icon: com.trusteewallet.png
  website: https://trusteeglobal.com
  developerName: BlockSoft Lab
  repository: https://github.com/trustee-wallet/trusteeWallet
iphone:
  appId: com.trusteewallet
  idd: 1462924276
  appCountry: jp
  released: 2019-06-14
  updated: 2026-03-19
  version: 1.52.3
  reviews: 0
  icon: com.trusteewallet.jpg
  website: https://trusteeglobal.com/
  developerName: BLOCKSOFTLAB INC

---

## Android

{% include featureEvidence.html feature="buyWithCC" source="[README](https://github.com/trustee-wallet/trusteeWallet#readme)" quote="Quick and safe buy and sell bitcoin directly with your Visa or MasterCard" %}

## App Description

Trustee Wallet is a non-custodial, multi-asset crypto wallet that allows users to buy, sell, and exchange cryptocurrencies directly within the app using bank cards. It does not require users to submit personal information, supporting anonymous usage without email or KYC. The wallet employs a rate-optimizing algorithm to automatically select the most favorable exchange rates across providers. All private keys and transaction data are stored locally on the user’s device, with no third-party access or custody. The codebase is publicly auditable on GitHub and has undergone a security review by hacken.io.

This app is **source available**.

*Legacy verification [2023](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/fe5e184d1f4081097bd57c3ecf8ea82fd6a55cf1/_android/com.trusteewallet.md)*

*Legacy verification [2020](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/commit/5b3d36789381144a7d34fc1394b61811a29138f7)*

## Similar App Note 2023-08-23

This app is from the same developer of {% include walletLink.html wallet='android/com.trusteeplus' verdict='true' %}. 

We verified that both apps are linked from their homepage.

An issue has been opened at [https://github.com/trustee-wallet/trusteeWallet/issues/180](https://github.com/trustee-wallet/trusteeWallet/issues/180)

---

## iPhone

{% include featureEvidence.html feature="tradeAlts" source="[Website](https://trusteeglobal.com/)" quote="Обмін Більше ніж 100 крос-пар та вигідні комісії." %}

**Update 2021-02-07**: This wallet
[has its issues](https://github.com/bitcoin-dot-org/Bitcoin.org/pull/3514) you
might want to take into consideration, too.

On the App Store the provider claims:

> NON-CUSTODIAL<br>
  Trustee doesn’t authorize third parties to store private keys and details of
  your assets, so operations remain only yours!<br>
  Any time you buy or sell bitcoin we guarantee that no one else will save your
  transaction details. Everything is stored solely on your Trustee wallet and
  you are the only owner of your private keys and the seed phrase.

This is weirdly worded but the final sentence is very clear about who owns the
private keys: You alone on your phone.

On public source their website claims:


> **Our benefits**<br>
  Trustee Wallet is an open-source mobile multi-currency crypto wallet, this is
  the ideal solution for the safe storage and operational management of your
  crypto assets

and we found [their GitHub](https://github.com/trustee-wallet/trusteeWallet).

There they comment in length on the issue of reproducibility for their Android app
{% include walletLink.html wallet='android/com.trusteewallet' %} but make no such claims for
their iPhone product which leads us to the verdict: **not verifiable**.
