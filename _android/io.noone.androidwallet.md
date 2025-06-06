---
wsId: nooneWallet
title: Noone Crypto Wallet
altTitle: 
authors:
- danny
users: 50000
appId: io.noone.androidwallet
appCountry: 
released: 2023-03-17
updated: 2025-05-16
version: 1.22.3
stars: 4.9
ratings: 
reviews: 141
website: https://noone.io
repository: 
issue: 
icon: io.noone.androidwallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-23
signer: 
twitter: NooneWallet
social: 
redirect_from: 
developerName: Raias Llc
features: 

---

## Update 2024-07-23

One year has passed and we strove to double-check whether they're still not source-available. On their website, they claim: 

> Open-Source Core
>
> Noone Wallet's open core-code promotes transparency and collaboration, empowering users to verify the wallet's security measures.

What do they mean exactly? 

What's not so clear is which repository of the 17 they're referring to. A quick search for the app ID, ["io.noone.androidwallet" on GitHub](https://github.com/search?q=%22io.noone.androidwallet%22&type=code), turns out only 1 repository and it's not NoOne's.

On their repository we have 2 potential candidates for the repository of the Android app:

- [noone-android-core-crypto](https://github.com/noonewallet/noone-android-core-crypto)
- [noone-android-core-btclike](https://github.com/noonewallet/noone-android-core-btclike) 

We took a look at the **build.gradle.kts** file in the noone-android-core-crypto, **app-nist** subfolder and this is what it contains:

> android {
>   namespace = "io.noone.app_nist"
>   compileSdk = 33
>
>   defaultConfig {
>       applicationId = "io.noone.app_nist"
>       minSdk = 26
>       targetSdk = 33
>       versionCode = 1
>       versionName = "1.0"

The version that's on Google Play is version 1.14.1 which was last updated June 26, 2024. The latest release of **noone-android-core-crypto** is v1.5.0, last updated on June 26, 2023. 

It turns out **noone-android-core-crypto** is a submodule of **noone-android-core-btclike**, which has a release of v1.0.0 on June 26, 2023. 

Right now, we find no definitive proof that either of these repositories would build the app on Google Play. We filed an [issue on GitHub](https://github.com/noonewallet/noone-android-core-crypto/issues/1) to ask them about this. We posted on [X](https://x.com/dannybuntu/status/1815597847569649877) as well. We will continue marking this as **not source-available** until they have reached out.

## App Description from Google Play 2023-06-29

> With Noone Wallet's non-custodial approach, you remain in full control of your funds
>
> Supported Cryptocurrencies:
>
> Bitcoin (BTC) Legacy and Bitcoin Segwit...

## Analysis

- The app claims that it supports BTC and is non-custodial.
- We verified these claims.
- There are no claims to it being source-available.
- A code search on GitHub [does not yield any result.](https://github.com/search?q=io.noone.androidwallet&type=code)  
- This app is **not source-available**.
