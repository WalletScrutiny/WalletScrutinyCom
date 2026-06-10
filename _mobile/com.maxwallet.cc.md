---
wsId: maxwallet
title: MaxWallet
date: 2026-01-14
authors:
- danny
website: https://maxwallet.cc/contact-us
twitter: MaxWalletEN
social:
- https://t.me/maxwalletapp
redirect_from:
- /android/com.maxwallet.cc/
- /iphone/com.maxwallet.cc/
android:
  appId: com.maxwallet.cc
  users: 5000
  appCountry: us
  updated: 2026-06-03
  version: 1.2.4
  icon: com.maxwallet.cc.png
  meta: ok
  verdict: nosource
  developerName: MaxWallet
iphone:
  appId: com.maxwallet.cc
  idd: '6670610349'
  appCountry: ru
  released: 2025-01-06
  updated: 2026-05-25
  version: 1.2.4(3)
  reviews: 95
  icon: com.maxwallet.cc.jpg
  meta: ok
  verdict: nosource
  developerName: MS PROFIT LTD

---

## Android

## App Description

MaxWallet is a multi-platform cryptocurrency wallet offering Android, iOS, and desktop downloads (Windows, macOS, Linux) via its official site (https://maxwallet.cc/). The Google Play listing claims support for Bitcoin and multiple other assets, along with features such as swaps, staking, and integration with third-party services. The website distributes the Android APK directly (max_wallet.apk) and provides installers for desktop operating systems.

## Analysis

We installed and tested MaxWallet on Android. The app provides a seed phrase on wallet creation and supports sending and receiving Bitcoin — results are documented in this [video posted on X](https://x.com/BitcoinWalletz/status/2047611674589536568). However, no source code repository is linked on the website, and a search of GitHub yields no public repository attributable to MaxWallet or its parent platform MaxSwap. With no source code available, there is no way to independently verify how the wallet handles private keys, whether the seed phrase implementation is correct, or whether user funds are at risk. **Because the source code is not available, this wallet cannot be verified.**

---

## iPhone

{% include copyFromAndroid.html %}
