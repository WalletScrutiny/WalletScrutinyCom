---
title: DexSpace
date: 2026-09-15
authors:
  - danny
website: https://dexspace.io
android:
  appId: com.dexspace.dexspacemobile
  users: 100
  appCountry: us
  released: 2025-09-29
  updated: 2026-02-25
  version: 0.1.10
  icon: com.dexspace.dexspacemobile.png
  meta: fewusers
  verdict: nobtc
  developerName: Dexspace Crypto Platform LLC
iphone:
  appId: com.dexspace.dexspacemobile
  idd: "6751681180"
  appCountry: us
  released: "2025-10-01T07:00:00Z"
  updated: 2026-03-05
  version: 0.1.11
  reviews: 0
  icon: com.dexspace.dexspacemobile.jpg
  meta: ok
  verdict: nobtc
  developerName: DexSpace Crypto Platform LLC
---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6751681180" author="overtorment" severity="critical" finding="Email import POSTs the mnemonic. Generate & Start is server-custodial. Listing says signing is local." note="Per overtorment’s analysis of the iPhone app, signing in with email and importing a wallet sends its 12-word recovery phrase or private key to DexSpace’s server (market-api.dexspace.io). Wallets made with “Generate & Start” are held on that server. The App Store listing says the recovery phrase “is generated locally and never leaves your device.”" %}

## App Description

DexSpace, published by Dexspace Crypto Platform LLC, describes itself as a non-custodial crypto wallet combined with a decentralized exchange aggregator. Users can create several wallets protected by biometrics, swap tokens through decentralized exchanges, follow real-time charts and create their own tokens with a token launchpad. The only blockchain the listing names is Solana, next to "other leading blockchains" it does not name.

## Testing and Analysis

This assessment was recorded on 2026-09-15.

### The app could not be installed

The [Google Play listing](https://play.google.com/store/apps/details?id=com.dexspace.dexspacemobile) (version 0.1.10) reports the app as unavailable in the reviewer's country. A second attempt from a different region, using Aurora Store on an Android emulator, was refused for the same reason. We found no trustworthy copy of the APK:

- DexSpace's website links only to the two stores.
- APKMirror, APKPure, APKCombo and Uptodown do not offer it.

We normally settle the Bitcoin question in the installed app, but here that check was not possible.

### No sign of Bitcoin in anything DexSpace publishes

- **Web app, hands-on:** we signed up on the [web app](https://app.dexspace.io) on 2026-09-15.
  - The wallet set-up screen reads "Import or Create Solana Wallet: Select whether you want to generate a new Solana wallet or import an existing one using a private key."
  - The chain selector lists only **SUI, ETHEREUM, SOLANA and BSC**. Bitcoin is not among them.
- **Store listings:** both the [Google Play](https://play.google.com/store/apps/details?id=com.dexspace.dexspacemobile) and the [App Store](https://apps.apple.com/us/app/dexspace/id6751681180) descriptions name one network, "Connect to Solana and other leading blockchains", and never mention Bitcoin.
- **Website:** the [homepage](https://dexspace.io), [academy](https://dexspace.io/en/academy), [terms of service](https://dexspace.io/en/terms-of-service) and [privacy policy](https://dexspace.io/en/privacy-policy) mention Solana, Ethereum and Tron, but not Bitcoin, BTC or even wrapped BTC (WBTC).
- **Web app:** the [web app](https://app.dexspace.io) loads 36 JavaScript files (1.7 MB). None of them mentions Bitcoin, BTC or WBTC. The app is built on the Solana wallet adapter, sets `chain: "solana"` in its code, and asks users to "Connect a wallet on Solana".

### What we could check of overtorment's findings

Without the app we could not reproduce overtorment's findings. He analysed the iPhone build, and the Android app is a separate binary. What DexSpace exposes publicly is consistent with his report:

- The server he names, `market-api.dexspace.io`, is live and identifies itself as "Application: DEXSPACE_STAGING_API. Version: 1.0.1".
- The account path he quotes, `/api/v1/user/account/`, also appears in the web app's code.
- `auth.dexspace.io` is live ("Identity Server. Version 1.2."), which fits his description of a separate email sign-in mode.

DexSpace's own statements say the opposite. Its [terms of service](https://dexspace.io/en/terms-of-service) state:

> DexSpace does not have access to your digital assets or private keys.

The App Store listing says the recovery phrase "is generated locally and never leaves your device."

### Verdict: does not support bitcoin

We could not open the mobile app to inspect its network list. We did sign up on DexSpace's web app: its wallet set-up offers only a Solana wallet, and its chain list is SUI, Ethereum, Solana and BSC. The store listings and the website agree, and none of them mentions Bitcoin. We therefore conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**, and the review stops at the Bitcoin-support gate. Custody and source availability are not assessed. If the app becomes obtainable and turns out to support native Bitcoin, we will revisit this verdict.
