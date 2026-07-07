---
wsId: pantherWallet
title: 'Panther: Crypto Wallet'
date: 2026-05-20
authors:
- danny
website: https://mypanther.io
twitter: panther_wallet
social:
- https://www.instagram.com/panther.wallet
- https://www.facebook.com/Panther.wallet
redirect_from:
- /android/com.inexlatam.panther/
- /iphone/com.inexlatam.panther/
android:
  appId: com.inexlatam.panther
  users: 1000
  appCountry: us
  released: 2025-06-05
  updated: 2026-06-19
  version: 0.8.7
  reviews: 4
  icon: com.inexlatam.panther.png
  meta: ok
  verdict: custodial
  developerName: Veltrix Technologies OÜ
iphone:
  appId: com.inexlatam.panther
  idd: '6744923576'
  appCountry: pa
  released: 2025-06-29
  updated: 2026-07-01
  version: 0.8.9 (2049)
  reviews: 0
  icon: com.inexlatam.panther.jpg
  meta: ok
  verdict: custodial
  developerName: Veltrix Technologies OU

---

## Android

## App Description

Panther Wallet is a crypto wallet and digital-asset platform.
The Google Play listing says it supports digital asset transfers, payment tools, cards, referrals, rewards, and an ecosystem token.
It says users can operate under different asset management modes.
Some modes let users keep direct control over credentials.
Other modes are focused on a simplified experience.

## Analysis

Panther Wallet is presented as a crypto wallet.
It claims send and receive functionality for digital assets.
It also describes both custodial and self-custody modes.

Our app test found Bitcoin support in the wallet.
The test is documented in this [screencast](https://x.com/BitcoinWalletz/status/2057018118434865456).
The review continues to the custody step.

In the tested account, the wallet options did not provide a seed phrase or private-key backup for the Bitcoin wallet.

For this review, the tested Bitcoin wallet did not demonstrate user-controlled recovery material.

The terms describe both custodial and non-custodial wallet modes.
They define Custodial Services as functions where an authorized entity maintains limited operational control over user keys or digital assets.

They define Non-Custodial Web3 Services as functions where the user keeps exclusive control over private keys and seed phrases.

The terms say wallet services may be offered in limited custodial mode and Web3 non-custodial mode.

They also say the non-custodial wallet may be integrated through a switch between custodial and non-custodial environments.

The terms say custodial mode may involve Panther Custody S.A. or authorized third-party providers.

They also allow the operator to freeze, retain, limit, restrict, or terminate access to accounts, assets, or services in risk cases.

This confirms Panther is a mixed custodial/non-custodial platform.

The available tested Bitcoin wallet flow did not expose the non-custodial recovery material needed to prove self-custody.

For WalletScrutiny purposes, provider-controlled or provider-assisted custody fails the custody step.

The review stops at custody.

For WalletScrutiny purposes, the verdict is **custodial**.

Sources:

- [Google Play listing](https://play.google.com/store/apps/details?id=com.inexlatam.panther)
- [Panther Wallet website](https://mypanther.io/en/)
- [About Panther](https://mypanther.io/en/acerca-de-panther/)
- [Panther P2P page](https://mypanther.io/p2p-2/)
- [Panther token page](https://mypanther.io/token/)
- [Panther terms and conditions](https://mypanther.io/terminos-y-condiciones-de-uso/)
- [Panther Bitcoin support screencast](https://x.com/BitcoinWalletz/status/2057018118434865456)
- [Panther App Store listing](https://apps.apple.com/pa/app/panther-wallet-crypto/id6744923576?l=en-GB)
- [GitHub search for exact app id](https://github.com/search?q=%22com.inexlatam.panther%22&type=code)

---

## iPhone

{% include copyFromAndroid.html %}
