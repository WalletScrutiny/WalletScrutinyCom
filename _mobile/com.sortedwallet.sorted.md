---
title: 'Sorted Wallet: Send Money Home'
date: 2026-05-20
authors:
- danny
website: https://www.sorted.io
twitter: sortedwallet
redirect_from:
- /android/com.sortedwallet.sorted/
android:
  appId: com.sortedwallet.sorted
  users: 10000
  appCountry: us
  released: 2025-12-11
  updated: 2026-07-24
  version: 1.0.25
  icon: com.sortedwallet.sorted.png
  meta: ok
  verdict: nosource
  developerName: Sors Technology Limited

---

## App Description

Sorted is a multi-chain mobile wallet by Sors Technology Limited (Hong Kong) supporting Bitcoin, Lightning Network, USDT, and several other networks including Ethereum, Polygon, Tron, TON, Celo, BNB Chain, and Liquid. The app targets users in emerging markets, primarily Africa, offering USDT-to-mobile-money cash-outs (M-Pesa and others), bill payments, airtime top-ups, gift cards, and eSIMs. The [Terms and Conditions](https://www.sorted.io/terms-and-conditions) state that "private keys are generated, held, and controlled exclusively by you and are not unilaterally accessible to, recoverable by or controlled by Sorted," and the [wallet page](https://www.sorted.io/wallet) references seed phrase backup.

## Testing and Analysis

**Bitcoin Support**

The Play Store listing and [wallet page](https://www.sorted.io/wallet) both explicitly claim Bitcoin and Lightning Network send/receive support: "Create your Bitcoin & USDT wallet in 30 seconds," "Receive dollars (USDT) or Bitcoin from anyone," and "Request and receive Bitcoin or USDt with Sorted — directly into your wallet." No developer-published tutorials or technical documentation specific to Bitcoin are available; the [help center](https://www.sorted.io/help) article on viewing a public address covers only installation and registration steps without specifying address type.

**Seed Phrase / Private Keys**

The [Terms and Conditions](https://www.sorted.io/terms-and-conditions) state that "private keys are generated, held, and controlled exclusively by you and are not unilaterally accessible to, recoverable by or controlled by Sorted." The [wallet page](https://www.sorted.io/wallet) contains a single reference under "Is Sorted safe to use?": "Keep your backup phrase safe!" No further documentation, tutorial, or help article explaining how to view or back up the phrase was found.

**Custody Claims**

Sorted claims non-custody in several places. The [Google Play listing](https://play.google.com/store/apps/details?id=com.sortedwallet.sorted) states: "Sorted is non-custodial" and "Your keys, your cash." The [wallet page](https://www.sorted.io/wallet) states users control funds and private keys and advises keeping a backup phrase safe. However, the [Terms and Conditions](https://www.sorted.io/terms-and-conditions) also state that Sorted can suspend, delete, or cancel an "Account or Sorted Wallet" in some cases.

**Registration**

A registration attempt was made during review. The verification email did not arrive and the app returned the error: "Captcha score is too risky."

**Source Code**

No public Android source repository was found for `com.sortedwallet.sorted`. The GitHub organization ([github.com/sorted-wallet](https://github.com/sorted-wallet)) contains only a placeholder repository with a single commit. WalletScrutiny's rule is simple: if the app claims self-custody but no current source is available, then the verdict has to be **"not source available"**.
