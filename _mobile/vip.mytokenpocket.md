---
wsId: TokenPocket
title: 'TokenPocket: Crypto & Bitcoin'
date: 2026-07-23
authors:
- leo
- danny
website: https://www.tokenpocket.pro/
twitter: TokenPocket_TP
social:
- https://www.facebook.com/TokenPocket
redirect_from:
- /android/vip.mytokenpocket/
- /iphone/com.tp.ios/
- /iphone/com.global.wallet.ios/
- /mobile/com.global.wallet.ios/
android:
  appId: vip.mytokenpocket
  users: 5000000
  appCountry: us
  released: 2018-06-29
  updated: 2026-08-04
  version: 2.24.0
  reviews: 630
  icon: vip.mytokenpocket.png
  meta: ok
  verdict: obfuscated
  developerName: TP Global Ltd
  repository: https://github.com/TP-Lab/tp-android
iphone:
  appId: com.global.wallet.ios
  idd: '6444625622'
  appCountry: us
  released: 2023-01-04
  updated: 2026-08-13
  version: 2.26.2
  reviews: 723
  icon: com.global.wallet.ios.jpg
  meta: ok
  verdict: obfuscated
  developerName: TP Global Ltd
  repository: https://github.com/TP-Lab/tp-ios

---

## Update 2026-07-23

The iOS app was re-listed. The original iPhone app `com.tp.ios` (idd 1436028697) was removed from the App Store and replaced by the current listing **`com.global.wallet.ios`** (idd 6444625622, store name "TP Global Wallet", same developer TP Global Ltd). The official [tokenpocket.pro download page](https://www.tokenpocket.pro/en/download/app) links to both this iOS app and the Android app `vip.mytokenpocket`, confirming they are the same product; the separate `wip` stub for the new iOS listing has been folded in here. The `obfuscated` verdict is unchanged.

**Verdict re-validated (2026-07-23).** We re-checked the repositories these apps point to, and the `obfuscated` finding still holds — the shipped binaries are not built from the published source. The Android build is minified ([`minifyEnabled true`](https://github.com/TP-Lab/tp-android/blob/master/app/build.gradle#L17)), and the repository's own [`applicationId "com.tokenbank"`](https://github.com/TP-Lab/tp-android/blob/master/app/build.gradle#L7) matches **neither** the shipped `vip.mytokenpocket` (Android) **nor** `com.global.wallet.ios` (iOS). The [README](https://github.com/TP-Lab/tp-android/blob/master/README.md) further describes a different, early product — *"based on TokenPocket early version… Only supports SWTC Blockchain for now"* — while the shipped apps are multi-chain (BTC/ETH/…). Both repositories are long dormant ([`tp-android`](https://github.com/TP-Lab/tp-android) last pushed 2022-04-21, [`tp-ios`](https://github.com/TP-Lab/tp-ios) 2021-10-13) even though the apps were updated 2026-07-17 — so the "open source" claim is effectively false and the released binaries cannot be reproduced from the public code.

## Android

## Update 2024-07-17

We see the same [minification](https://github.com/TP-Lab/tp-android/blob/master/app/build.gradle#L17) and no changes for the last 6 years have been made to the Android app repository.

## Review 2022-01-09

From the description:

> You can store, send and receive your Bitcoin (BTC), Ethereum (ETH), EOS, TRON
  (TRX), IOST, Cosmos and Biance (BNB) easily.

so it's a BTC wallet and according to the following also self-custodial and open
source:

> Features of the Multi-Crypto Wallet<br>
  1. An open-sourced decentralized wallet, keep your cryptocurrencies safe<br>
  • It is an open-sourced and non-custodial decentralized wallet that stores
    your private keys on users' device, you can store, send and receive all your
    tokens within the wallet.

And indeed, on their website we can find a link to
[their repository on GitHub](https://github.com/TP-Lab/tp-android).

A quick look at the code though reveals several issues:

* Minification is a sort of obfuscation and [they minify](https://github.com/TP-Lab/tp-android/blob/master/app/build.gradle#L17).
* The `applicationId` is [not vip.mytokenpocket](https://github.com/TP-Lab/tp-android/blob/master/app/build.gradle#L7).
* The repository was last active two years ago while the app on Google Play was last updated two weeks ago.
* [The description](https://github.com/TP-Lab/tp-android/blob/master/README.md) sounds very different to the Play Store description:

> Only supports SWTC Blockchain for now, we will support Ethereum Blockchain and
  so on in the future.

So for now we have to file it as "obfuscated" and recommend to be careful as some
things don't add up. At least the "open source" claim is probably false. In any
case the app is **not verifiable** as is.

An issue has been opened at [https://github.com/TP-Lab/tp-android/issues/15](https://github.com/TP-Lab/tp-android/issues/15)

---

## iPhone

{% include copyFromAndroid.html %}

An issue has been opened at [https://github.com/TP-Lab/tp-ios/issues/1](https://github.com/TP-Lab/tp-ios/issues/1)
