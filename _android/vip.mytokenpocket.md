---
wsId: TokenPocket
title: 'TokenPocket: Crypto & Bitcoin'
altTitle: 
authors:
- leo
- danny
users: 5000000
appId: vip.mytokenpocket
appCountry: 
released: 2018-06-29
updated: 2025-03-21
version: 2.4.6
stars: 4.5
ratings: 16862
reviews: 603
website: https://www.tokenpocket.pro/
repository: https://github.com/TP-Lab/tp-android
issue: https://github.com/TP-Lab/tp-android/issues/15
icon: vip.mytokenpocket.png
bugbounty: 
meta: ok
verdict: obfuscated
appHashes: []
date: 2024-07-17
signer: 
reviewArchive:
- date: 2024-07-17
  version: 2.3.8
  appHashes: []
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: obfuscated
twitter: TokenPocket_TP
social:
- https://www.facebook.com/TokenPocket
redirect_from: 
developerName: TP Global Ltd
features: 

---

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
