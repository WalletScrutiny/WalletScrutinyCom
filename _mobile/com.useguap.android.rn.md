---
wsId: guapBitcoinWallet
title: Guap - Bitcoin Wallet
date: 2026-05-02
authors:
- danny
website: https://useguap.com
twitter: guap_app
redirect_from:
- /android/com.useguap.android.rn/
- /iphone/com.useguap.ios.rn/
android:
  appId: com.useguap.android.rn
  users: 1000
  appCountry: us
  released: 2025-12-05
  updated: 2026-05-21
  version: 0.9.2
  icon: com.useguap.android.rn.png
  meta: ok
  verdict: custodial
  developerName: Future Money Labs
iphone:
  appId: com.useguap.ios.rn
  idd: '6744361725'
  appCountry: us
  released: 2025-12-08
  updated: 2026-05-21
  version: 0.9.2
  reviews: 1
  icon: com.useguap.ios.rn.jpg
  meta: ok
  verdict: custodial
  developerName: Future Money Labs

---

## Android

## App Description

Guap is presented as a wallet for bitcoin and stablecoins on the Spark network. The Google Play listing says users can fund Guap from Lightning-compatible wallets, including Cash App, Coinbase, and Strike. The website and [FAQ](https://getguap.notion.site/guap-faq) say wallet keys are stored client-side and that wallet infrastructure is provided by Privy.

## Analysis

The app was not tested directly as it is not available in our region. If you can access this app, please [contribute your findings](https://walletscrutiny.com/contribute).

The public website claims:

> Guap is a self-custody wallet app

and:

> Wallet keys are stored client-side

However, Guap explicitly names [Privy](https://privy.io) as their wallet infrastructure provider. According to [Privy's own documentation](https://privy.io/blog/how-privy-embedded-wallets-work), when a wallet is created, the private key is generated inside a Trusted Execution Environment (TEE) and immediately split into two shares: an *enclave share* held in the TEE, and an *auth share* encrypted and stored on Privy's servers. Both shares are required to reconstruct the key (2-of-2). The user does not independently hold all key material — Privy must cooperate for key reconstruction.

This architecture contradicts the "keys stored client-side" marketing claim. Because a key share is held by Privy, users cannot recover their funds without Privy's cooperation. This makes the wallet **custodial** by WalletScrutiny's standard, regardless of how Guap describes it.

No public source repository was found for the Android app via Google Play, the Guap website, or [GitHub search](https://github.com/search?q=%22com.useguap.android.rn%22&type=code).

---

## iPhone

{% include copyFromAndroid.html %}
