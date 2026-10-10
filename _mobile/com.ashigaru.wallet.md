---
title: Ashigaru
date: 2026-10-10
authors:
- danny
website: https://ashigaru.rs
features:
- batching
- coinCtrl
- customNode
- foss
- hd
- TOR
android:
  appId: com.ashigaru.wallet
  users: 0
  released: 2024-09-20
  updated: 2025-03-03
  version: 1.1.1
  reviews: 0
  playStore: false
  icon: com.ashigaru.wallet.webp
  signer: 968a3056882d0800da04f73c60a85fb85156dba23d3b9b15937cae224ee72e2d
  meta: stale
  verdict: sourceavailable
  developerName: Ashigaru Open Source Project
  repository: http://ashicodepbnpvslzsl2bz7l2pwrjvajgumgac423pp3y2deprbnzz7id.onion/Ashigaru/Ashigaru-Mobile

---

## App Description

Ashigaru is a self-custodial Bitcoin wallet for Android. It is a fork of Samourai Wallet: its README says it uses "all commits from Samourai Wallet's /master and /development branch up to 24th April 2024", the day Samourai's founders were arrested.

The app is **not on Google Play**. The only download is a direct APK from the project's own git server, which is reachable **over Tor only**. Its address is in the `repository` field above; [ashigaru.rs/download](https://ashigaru.rs/download/) links to it and publishes a PGP-signed SHA-256 of each APK.

## Analysis

We downloaded `ashigaru_mobile_v1.1.1.apk` (released 2025-03-03) over Tor on 2026-10-10.

- Its SHA-256 is `13f7832417b48be902877dddc7b1ef4f3ddffe6891f42ef151d8cbd8070591ef`, the same as the signed hash on the download page.
- Package `com.ashigaru.wallet`, versionName `1.1.1`, versionCode `111`.
- It is signed by the certificate `OU=Ashigaru Wallet`, with the SHA-256 fingerprint shown above as `signer`.
- It bundles its own Tor (`libKmpTor.so` for all four ABIs).

The source is public under GPLv3. Tag `v1.1.1` (commit `dd1bcac71fe3`) matches the release, and its `app/build.gradle` declares the same `applicationId`, `versionCode` and `versionName` as the APK. The project publishes [reproducible build instructions](http://ashicodepbnpvslzsl2bz7l2pwrjvajgumgac423pp3y2deprbnzz7id.onion/Ashigaru/Ashigaru-Mobile/src/branch/main/docs/ReproducibleBuilds.md) and an [unsigned APK hash for each release](http://ashicodepbnpvslzsl2bz7l2pwrjvajgumgac423pp3y2deprbnzz7id.onion/Ashigaru/Ashigaru-Mobile/src/branch/main/docs/Unsigned-APK-Hashes.md). For v1.1.1 that hash is `0209e3db0793f236849a2aaf51541df56420f9ca3a92d8ea553137273d7b95a5`. We have not yet checked it ourselves.

There has been no release since v1.1.1 in March 2025, so the app was last updated more than a year ago.

The mobile app does not offer Whirlpool coinjoin. The [v1.0.0 release notes](https://ashigaru.rs/news/release-wallet-v1-0-0/) list "Whirlpool coinjoin removed". The [Ashigaru Whirlpool coordinator](https://ashigaru.rs/news/announcement-whirlpool/) launched later with a separate desktop client, Ashigaru Terminal. We therefore do not list the CoinJoin feature for this app.

{% include featureEvidence.html feature="foss" quote="Ashigaru mobile is released under the Free and Open Source license GNU GPLv3" source="README (Ashigaru-Mobile repository, Tor only)" %}

{% include featureEvidence.html feature="coinCtrl" quote="Select, label, freeze and unfreeze unspent transaction outputs (UTXOs) in your wallet" source="[ashigaru.rs](https://ashigaru.rs/)" %}

{% include featureEvidence.html feature="batching" quote="Save on fees by composing a single transaction to multiple recipients" source="[ashigaru.rs](https://ashigaru.rs/)" %}

{% include featureEvidence.html feature="TOR" quote="Connect to your Dojo node and broadcast over the Tor network" source="[ashigaru.rs](https://ashigaru.rs/)" comment="(The v1.1.1 APK bundles its own Tor library, libKmpTor.so.)" %}

{% include featureEvidence.html feature="customNode" quote="Connect to your Dojo node and broadcast over the Tor network" source="[ashigaru.rs](https://ashigaru.rs/)" %}

{% include featureEvidence.html feature="hd" quote="Standards based mnemonic secured with a passphrase that can be imported to other wallets" source="[ashigaru.rs](https://ashigaru.rs/)" %}

This app is **source available**: the GPLv3 source is published and tagged for the current release. Its build has not been verified as reproducible yet.
