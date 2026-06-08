---
wsId: easyCryptoWallet
title: 'Easy Crypto Wallet: Buy BTC'
date: 2025-11-20
authors:
- danny
website: https://easycrypto.com/
twitter: easycrypto
social:
- https://www.facebook.com/easycryptoau
- https://www.instagram.com/easycrypto.global
- https://www.linkedin.com/company/easy-crypto
- https://www.youtube.com/c/EasyCryptoGlobal
redirect_from:
- /android/com.octopass.app/
- /iphone/com.octopass.app/
android:
  appId: com.octopass.app
  users: 10000
  appCountry: us
  updated: 2026-03-19
  version: prod-1.18.11
  icon: com.octopass.app.png
  meta: deprecated
  verdict: custodial
  developerName: Dott Enterprises Limited
iphone:
  appId: com.octopass.app
  idd: '6466778991'
  appCountry: nz
  released: 2023-11-21
  updated: 2026-03-22
  version: 1.18.11
  reviews: 1541
  icon: com.octopass.app.jpg
  meta: deprecated
  verdict: custodial
  developerName: Dott Enterprises Ltd.

---

## Android

- **2025:** In the process of being acquired by {% include walletLink.html wallet='android/au.com.swyftx' verdict='true' %}

## App Description

Easy Crypto Wallet (published by Dott Enterprises Limited of Wellington, New Zealand) is pitched in the Play Store as a “self-custody wallet” that lets users buy, sell, swap, and hold major assets including Bitcoin (BTC), Ethereum (ETH), Tether (USDT), XRP, and Dogecoin. The listing emphasizes that it is the “official home of NZDD”, a New Zealand dollar–backed stablecoin integrated into the wallet so customers can trade or park value in NZD-pegged tokens with 1:1 backing.

Security marketing centers on MPC key-splitting (keys “are split into encrypted parts and distributed across secure servers”), cloud backups instead of seed phrases, MFA, and privacy features such as the ability to maintain separate addresses for different accounts. 

## Analysis

The Play Store listing describes the wallet's security model under "Next-Generation Protection and Recovery" with Multi-Party Computation (MPC): ["Your private keys are never stored in one location. Instead, they are split into encrypted parts and distributed across secure servers"](https://play.google.com/store/apps/details?id=com.octopass.app). This MPC architecture means users do not hold complete private keys independently—the encrypted key shares are distributed across Easy Crypto's infrastructure rather than under sole user control. The wallet does not provide traditional seed phrase recovery, instead relying on cloud backups and the company's servers for key reconstruction. No source code is publicly available for the Android app, preventing independent verification of the MPC implementation or recovery mechanisms. Despite marketing as "self-custody," the distributed key model creates dependency on Easy Crypto's continued operation and server availability.

In March 2025, Australian exchange Swyftx [acquired Easy Crypto](https://swyftx.com/media-release/swyftx-acquires-new-zealands-largest-crypto-exchange/) in a deal combining over 1.1 million customers, with both platforms operating separately during integration. Easy Crypto now actively encourages users to [transfer funds from Easy Crypto Wallet to Swyftx](https://hub.easycrypto.com/au/transfer-funds-from-easy-crypto-wallet-to-swyftx), with an automated migration process announced for January 2026. {% include walletLink.html wallet='android/au.com.swyftx' verdict='true' %} is a custodial exchange where, per their own terms, ["You do not hold the private keys to crypto assets while they remain in your Swyftx account"](https://swyftx.com/terms-of-use/). A precedent exists: Finder Wallet was [discontinued on June 19, 2025](https://swyftx.com/announcement/finder-wallet-migration/) with users migrated to Swyftx's custodial platform. The combination of MPC-dependent architecture, ownership by a custodial exchange, and active migration to **custodial** services leads us to conclude the same.

---

## iPhone

{% include copyFromAndroid.html %}
