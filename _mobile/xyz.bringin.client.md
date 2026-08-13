---
wsId: bringinApp
title: 'Bringin: Buy & spend Bitcoin'
date: 2026-07-07
authors:
- danny
website: https://bit.ly/3wT0eSM
twitter: bringinxyz
social:
- https://www.linkedin.com/company/bringinxyz
- https://www.youtube.com/@bringinxyz
features:
- ln
android:
  appId: xyz.bringin.client
  users: 1000
  appCountry: us
  released: 2025-08-31
  updated: 2026-08-11
  version: 2.3.9
  icon: xyz.bringin.client.png
  meta: ok
  verdict: nosource
  developerName: Bringin
iphone:
  appId: xyz.bringin.client
  idd: '6503239911'
  appCountry: bg
  released: 2025-10-02
  updated: 2026-08-11
  version: 2.3.8
  reviews: 0
  icon: xyz.bringin.client.jpg
  meta: ok
  verdict: nosource
  developerName: UAB Bringin

---

## App Description

Bringin is a mobile Bitcoin wallet and Bitcoin-fiat bridge app. It supports Bitcoin payments and conversions through Lightning, on-chain Bitcoin, and integrated fiat services such as EUR off-ramping, vIBAN functionality, and debit-card spending. It also integrates with Visa cards for spending Bitcoin-backed funds at merchants, and offers a dedicated European vIBAN for bank transfers.

The app claims to provide a self-custodial Lightning/Spark wallet. According to Bringin’s documentation, the wallet uses Breez SDK Spark and generates a 12-word BIP39 recovery phrase for the user. Bringin states that private keys are generated and stored on the user’s device and that the company does not have access to user funds.

## Analysis

We were not able to test the app due to country restrictions, so we are analyzing it based on publicly available information.

The app supports a BTC wallet. Its [Google Play listing](https://play.google.com/store/apps/details?id=xyz.bringin.client) describes Bringin as a Bitcoin app that can receive Bitcoin over Lightning or on-chain and can spend in euros or Bitcoin.

Bringin’s [Spark wallet documentation](https://help.bringin.xyz/en/articles/12629642-how-does-the-bringin-spark-wallet-work) claims the wallet is self-custodial and says it generates a standard BIP39 mnemonic phrase for the user. This supports documenting the provider’s self-custody claim, but it does not by itself prove WalletScrutiny’s `hd` (hierarchically deterministic) feature. In plain terms, this means one recovery phrase can recreate the wallet, but WalletScrutiny also requires evidence that the funds are recoverable in a competitor’s wallet.

We were not able to test whether Bringin exposes the recovery phrase to the user or whether that phrase can restore the wallet in another app. The [Breez SDK Spark overview](https://sdk-doc-spark.breez.technology/) mentions seed backup and restore support, and the [SDK initialization documentation](https://sdk-doc-spark.breez.technology/guide/initializing.html) shows the SDK can be initialized from mnemonic words, but this still does not prove cross-wallet recovery for Bringin users.

A [GitHub code search for `xyz.bringin.client`](https://github.com/search?q=%22xyz.bringin.client%22&type=code) did not yield a relevant mobile repository. Bringin maintains a public GitHub organization (bringinxyz) publishing auxiliary tooling (NWC package, LNURL-pay, checkout), but the wallet app's source is not among its repositories.

Bringin’s documentation points to Breez SDK Spark, which is open source, but availability of an upstream SDK is not the same as availability of Bringin’s mobile app source code. We conclude that this app's mobile repository is **not available publicly**.
