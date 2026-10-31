---
title: Starr Bitcoin Lightning Wallet
date: 2026-10-30
authors:
- danny
website: https://starr.app
redirect_from:
- /iphone/com.starwallet/
android:
  appId: com.starrwallet
  users: 1000
  appCountry: us
  released: 2026-04-22
  updated: 2026-09-16
  version: 2.1.0
  icon: com.starrwallet.webp
  meta: ok
  verdict: wip
  developerName: CoinSpace
iphone:
  appId: com.starwallet
  idd: '1513374252'
  appCountry: us
  released: 2026-05-08
  updated: 2026-09-17
  version: 2.1.0
  reviews: 2
  icon: com.starwallet.webp
  meta: ok
  verdict: wip
  developerName: CoinSpace

---

## App Description

Starr supports on-chain Bitcoin, Lightning, and Spark. It also supports Lightning addresses, LNURL, and offline transaction signing. Store listings describe local keys and phrase-based recovery. It is available on Android and Apple's US App Store.

## Testing and Analysis

Google Play calls Starr “100% non-custodial” and promises full control. Its [listing](https://play.google.com/store/apps/details?id=com.starrwallet) does not disclose Spark. The source advertises non-custody and phrase-based recovery.

The listed Android app is version 2.1.0. Its bundled Spark SDK is 0.24.1. Repository commit [`89676c2`](https://github.com/starrapp/StarrWallet/commit/89676c2) matches that version. Current repository source is newer, version 2.2.0. The installed Play binary was inspected separately.

The SDK exposes unilateral-exit functions. Starr does not call those functions. We found no exit controls, export, or recoverable-balance display. The SDK automatically collects exit data into private app storage. Starr’s Android backup rules exclude that storage.

After losing that data, phrase recovery needs reachable operators. Breez’s [exit guide](https://sdk-doc-spark.breez.technology/guide/unilateral_exit.html) explains this limitation. Lost exit data cannot be recovered without operators. Thus, users lack a demonstrated independent recovery route.

Starr markets the whole wallet as fully non-custodial. Spark balances depend on operator cooperation without usable unilateral exit. This supports a **custodial** classification under [WalletScrutiny’s guidance](https://github.com/WalletScrutiny/WalletScrutinyCom/blob/master/_data/verdicts/custodial.yml).

In our testing, Starr supported on-chain Bitcoin, Lightning, and Spark. The app displayed a recovery phrase during setup.
