---
wsId: TokenPocket
title: "TokenPocket Wallet. BTC, ETH, BSC, HECO, TRON, DOT"
altTitle: 
authors:
- leo
users: 1000000
appId: vip.mytokenpocket
launchDate: 
latestUpdate: 2021-05-17
apkVersionName: "1.2.7"
stars: 4.2
ratings: 7094
reviews: 3335
size: 43M
website: https://www.tokenpocket.pro
repository: https://github.com/TP-Lab/tp-android
issue: https://github.com/TP-Lab/tp-android/issues/15
icon: vip.mytokenpocket.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-04-13
reviewStale: true
signer: 
reviewArchive:


providerTwitter: TokenPocket_TP
providerLinkedIn: 
providerFacebook: TokenPocket
providerReddit: 

redirect_from:

---


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

So for now we have to file it as "no source" and recommend to be careful as some
things don't add up. At least the "open source" claim is probably false. In any
case the app is **not verifiable** as is.
