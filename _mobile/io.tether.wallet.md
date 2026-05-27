---
wsId: tetherWallet
title: Tether Wallet
date: 2026-04-20
authors:
- danny
website: https://wallet.tether.io/support/
twitter: Tether_to
social:
- https://t.me/OfficialTether
features:
- hd
- segwit
- ln
redirect_from:
- /android/io.tether.wallet/
- /iphone/io.tether.wallet.official/
android:
  appId: io.tether.wallet
  users: 10000
  appCountry: us
  released: 2026-03-19
  updated: 2026-05-20
  version: 1.2.0
  reviews: 8
  icon: io.tether.wallet.png
  meta: ok
  verdict: nosource
  developerName: Tether Data
iphone:
  appId: io.tether.wallet.official
  idd: '6759002210'
  appCountry: us
  released: 2026-04-14
  updated: 2026-05-25
  version: 1.2.0
  reviews: 8
  icon: io.tether.wallet.official.jpg
  meta: ok
  verdict: nosource
  developerName: Tether Data

---

## Android

## App Description

Tether Wallet ("The People's Wallet") is a self-custodial multi-asset wallet publicly released on Google Play in April 2026. It supports Bitcoin (on-chain and Lightning Network), USD₮, XAU₮, and USA₮ across multiple supported networks (e.g. Ethereum, Polygon, Arbitrum; exact coverage may vary by asset and is not fully specified in the Play Store listing).

Key features:
- 12-word BIP39 seed phrase, user-controlled
- Claims transactions are signed locally on device (not independently verified)
- Supports human-readable usernames (e.g. @tether.me), though resolution mechanism is not publicly documented
- Claims to allow fee abstraction (paying fees in the asset being sent), though implementation details are not independently verified

## Source

The app is built on top of the [Wallet Development Kit (WDK)](https://github.com/tetherto/wdk), which is open source under Apache 2.0. However, the source code of the wallet app itself is not published — only APK releases are available at the repository link above.

## Verdict

The underlying WDK framework is open source, but the **application code for `io.tether.wallet` is not available** for review. Reproducibility cannot be assessed because the full application **source is not available**.

---

## iPhone

{% include copyFromAndroid.html %}
