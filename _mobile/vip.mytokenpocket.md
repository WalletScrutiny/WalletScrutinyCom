---
wsId: TokenPocket
title: 'TokenPocket: Crypto & Bitcoin'
verdict: obfuscated
authors:
- leo
- danny
twitter: TokenPocket_TP
social:
- https://www.facebook.com/TokenPocket
redirect_from:
- /android/vip.mytokenpocket/
- /iphone/com.tp.ios/
android:
  appId: vip.mytokenpocket
  users: 5000000
  released: 2018-06-29
  updated: 2026-05-14
  version: 2.19.2
  reviews: 633
  icon: vip.mytokenpocket.png
  meta: ok
  date: 2024-07-17
  website: https://www.tokenpocket.pro/
  repository: https://github.com/TP-Lab/tp-android
  developerName: TP Global Ltd
iphone:
  appId: com.tp.ios
  idd: 1436028697
  released: 2018-09-23
  updated: 2022-06-30
  version: 1.8.5
  reviews: 322
  icon: com.tp.ios.jpg
  meta: removed
  date: 2023-01-11
  website: https://www.tokenpocket.pro
  repository: https://github.com/TP-Lab/tp-ios

---

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
