---
wsId: nooneWallet
title: Noone Crypto Wallet
date: 2023-07-24
authors:
- danny
website: https://noone.io
twitter: NooneWallet
features:
- buyWithCC
- multiAccount
- tradeAlts
redirect_from:
- /android/io.noone.androidwallet/
- /iphone/io.noone.ioswallet/
android:
  appId: io.noone.androidwallet
  users: 100000
  appCountry: us
  released: 2023-03-17
  updated: 2026-02-12
  version: 1.32.0
  reviews: 322
  icon: io.noone.androidwallet.png
  meta: ok
  verdict: nosource
  developerName: Raias Llc
iphone:
  appId: io.noone.ioswallet
  idd: '1668333995'
  appCountry: us
  released: 2023-03-29
  updated: 2026-02-06
  version: 1.32.0
  reviews: 172
  icon: io.noone.ioswallet.jpg
  meta: ok
  verdict: nosource
  developerName: NO ONE FZCO

---

## Android

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

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="buyWithCC" quote="Instantly purchase Bitcoin, Ethereum, Dogecoin, and more using your credit or debit card. No need for third-party apps – buy and store your crypto directly in Noone Wallet." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Effortlessly swap your digital assets across multiple blockchains, always getting the best rates. With Noone Wallet's built-in exchange, managing your portfolio is as smooth as ever." source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Multi-account" source="Website" %}
