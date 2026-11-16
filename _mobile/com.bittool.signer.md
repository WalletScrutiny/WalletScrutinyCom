---
title: BitTool Signer
date: 2026-11-16
authors:
- danny
website: https://bittool.com/signer
android:
  appId: com.bittool.signer
  users: 5
  appCountry: us
  released: Oct 23, 2026
  updated: 2026-10-24
  version: 1.0.0
  meta: fewusers
  verdict: sourceavailable
  developerName: BitTool
  repository: https://github.com/bitbill/bittool-signer-android
iphone:
  appId: com.bittool.signer
  idd: '6823781498'
  appCountry: us
  released: '2026-10-26T07:00:00Z'
  updated: 2026-10-26
  version: 1.0.0
  reviews: 0
  repository: https://github.com/bitbill/bittool-signer-ios
  meta: ok
  verdict: sourceavailable
  developerName: BITTOOL PTE. LTD.

---

BitTool Signer is an offline signer by BITTOOL PTE. LTD. It is meant to be used with {% include walletLink.html wallet='android/com.bittool.wallet' verdict='true' %}, which works as the watch-only half. BITTOOL PTE. LTD. also publishes the iPhone app of {% include walletLink.html wallet='android/com.bitbill.www' verdict='true' %}, and both signer repositories sit in the same [bitbill](https://github.com/bitbill) GitHub account as Ownbit's published key code.

## Android

## App Description

BitTool Signer keeps the recovery phrase on a phone that never goes online. It shows receiving addresses and signs transactions that come in as QR codes from a watch-only wallet. It supports Bitcoin, Ethereum and other EVM networks, TRON and Solana. Besides Google Play, the developer offers the APK [on its website](https://bittool.com/signer).

## Analysis

The app creates the recovery phrase on the phone and never sends it anywhere, so it is **self-custodial**.

The Android app removes the internet permission in [its manifest](https://github.com/bitbill/bittool-signer-android/blob/android-v1.0.0/app/src/main/AndroidManifest.xml), so it cannot go online. [Its build file](https://github.com/bitbill/bittool-signer-android/blob/android-v1.0.0/app/build.gradle.kts) says this holds for both the Play and the website flavor.

The source is public at [bitbill/bittool-signer-android](https://github.com/bitbill/bittool-signer-android), with the tag [android-v1.0.0](https://github.com/bitbill/bittool-signer-android/tree/android-v1.0.0) for the version on Google Play. So the app is {% include verdictBadge.html verdict="sourceavailable" type='short' %} and we can look into reproducibility next.

Two things to know:

- The Android repository has no license file, even though [the website](https://bittool.com/signer) calls the app "fully open source". The iPhone repository is [MIT licensed](https://github.com/bitbill/bittool-signer-ios/blob/v1.0.0/LICENSE).
- The developer [does not claim](https://github.com/bitbill/bittool-signer-android/blob/android-v1.0.0/docs/Reproducible-Build.md) a reproducible APK. Only the signing engine, `signer.js`, is meant to rebuild byte for byte. The interface and key storage can be read but not compared.

The security audits linked on the website are AI reviews. The iPhone [README](https://github.com/bitbill/bittool-signer-ios/blob/v1.0.0/README.md) says plainly that this "is not a third-party independent audit".

---

## iPhone

The source is public at [bitbill/bittool-signer-ios](https://github.com/bitbill/bittool-signer-ios), with the tag [v1.0.0](https://github.com/bitbill/bittool-signer-ios/tree/v1.0.0) for the App Store version. The Android analysis above applies here too, so this app is {% include verdictBadge.html verdict="sourceavailable" type='short' %} as well.

iOS cannot take network access away from an app. That the app never goes online rests on the source, which [the README](https://github.com/bitbill/bittool-signer-ios/blob/v1.0.0/README.md) says opens no network connection.
