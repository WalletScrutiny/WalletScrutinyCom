---
wsId: openBlock
title: OpenBlock
verdict: custodial
date: 2026-05-20
authors:
- danny
website: https://openblock.com
twitter: OpenBlockWallet
redirect_from:
- /android/com.openblock.wallet/
- /iphone/com.dssq.obwallet/
android:
  appId: com.openblock.wallet
  users: 1000
  released: 2023-02-06
  updated: 2026-03-10
  version: 2.2.6
  icon: com.openblock.wallet.png
  meta: ok
  developerName: JXJL Inc.
iphone:
  appId: com.dssq.obwallet
  idd: '6449669390'
  appCountry: us
  released: 2024-01-04
  updated: 2026-03-16
  version: 2.2.6
  reviews: 2
  icon: com.dssq.obwallet.jpg
  meta: ok
  developerName: JXJL Inc.

---

## Android

## App Description

OpenBlock is an MPC crypto wallet.
The Google Play listing says it supports more than 30 mainnets, including Bitcoin, Ethereum, BSC, Solana, Fantom, and Polygon.
It says users can create a wallet without a seed phrase.
It also says users can log in using a phone number, email address, Google account, or Apple ID.
The listing says users can manage, receive, and send tokens and NFTs.

## Analysis

OpenBlock is presented as a Bitcoin wallet.
It claims Bitcoin support.
It claims users can receive and send assets.
However, the custody model fails the self-custody check.

OpenBlock uses an MPC wallet model instead of a seed phrase.
Its security documentation says the default scheme is a 2-of-3 architecture.
The three fragments are held by the user, OpenBlock, and a trusted third party.
For normal signing, the user works with OpenBlock 24-hour online service.
The documentation says the third shard is stored by a trusted third-party cold data storage provider.
It also says users can apply to retrieve the third fragment if their key is lost and needs a reset.

This means the user does not independently control the Bitcoin wallet with only user-held recovery material.
OpenBlock participates in normal signing.
A third party also stores a recovery fragment.
The app explicitly avoids seed phrase custody.
For WalletScrutiny purposes, MPC systems that require provider-held key material or provider-assisted recovery are treated as custodial.

We did not continue to source-code verification.
The custody issue is reached before source availability in the review pipeline.
For WalletScrutiny purposes, the verdict is **custodial**.

Sources:

- [OpenBlock MPC Wallet User Manual](https://openblock.com/help/posts/en/OpenBlock%20MPC%20Wallet%20User%20Manual.html)
- [OpenBlock Security Model overview](https://docs.openblock.com/OpenBlock/SecurityModel/overview/)
- [OpenBlock Enterprise Wallet Model](https://docs.openblock.com/OpenBlock/SecurityModel/Enterprise%20Wallet%20Model/)
- [GitHub search for exact app id](https://github.com/search?q=%22com.openblock.wallet%22&type=code)

---

## iPhone

{% include copyFromAndroid.html %}
