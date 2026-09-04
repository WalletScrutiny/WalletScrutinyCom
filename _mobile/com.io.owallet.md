---
wsId: owallet
title: OWallet
date: 2026-09-04
authors:
- danny
website: https://owallet.io/
appCountry: us
redirect_from:
- /android/com.io.owallet/
- /iphone/io.orai.owallet/
- /mobile/io.orai.owallet/
android:
  appId: com.io.owallet
  users: 10000
  appCountry: us
  released: 2022-05-30
  updated: 2026-03-18
  version: 3.8.2
  reviews: 19
  icon: com.io.owallet.png
  meta: ok
  verdict: nobtc
  developerName: Oraichain Labs US
iphone:
  appId: io.orai.owallet
  idd: '1626035069'
  appCountry: us
  released: 2022-06-06
  updated: 2026-05-20
  version: 3.8.3
  reviews: 47
  icon: io.orai.owallet.jpg
  meta: ok
  verdict: nosource
  developerName: Oraichain

---

## App Description

OWallet is a multichain mobile wallet from Oraichain. It is published as `com.io.owallet` by Oraichain Labs US on Google Play and as `io.orai.owallet` by Oraichain on the App Store. The different identifiers belong to the same product: OWallet's official repository links to both store listings, and both apps use the same name, website and advertised feature set.

The store listings advertise Bitcoin together with EVM, Cosmos, Tron and Solana networks. The app also offers swaps, staking, portfolio tracking and a dApp browser. Hands-on testing, however, found that the Android app's actual network list does not include Bitcoin.

## Testing and Analysis

This assessment uses the US store listings and OWallet's public repositories as checked on 2026-09-04.

### The Android store claim does not survive an in-app check

The [Google Play listing](https://play.google.com/store/apps/details?id=com.io.owallet) advertises a universal wallet for Bitcoin and other supported networks. A WalletScrutiny reviewer installed the current Android app and inspected its network and receive-address selectors. Bitcoin was absent: there was no Bitcoin network to enable or select and no Bitcoin address to receive to. The reviewer published the [test record and screenshot](https://x.com/BitcoinWalletz/status/2095815398763720967); the captured **Receive → Copy Address** sheet lists LFG, Neutaro, Noble, OraiBridge, Osmosis, Solana and Tron, but not Bitcoin.

For this gate, functionality in the released app controls—not a claim in its store description. An app that does not expose the Bitcoin network cannot create or use a native Bitcoin wallet, regardless of the listing's use of the word “Bitcoin.” We therefore do not proceed to Android custody or source analysis.

### Android verdict: nobtc

The Android app is a cryptocurrency wallet, but the reviewed release does not offer Bitcoin in its network list. Its Play Store description is misleading on this point. Android therefore receives our **nobtc** verdict, and the review stops at the Bitcoin-support gate.

### The iPhone claim cannot be checked against current source

The hands-on finding above concerns the Android app. The [App Store listing](https://apps.apple.com/us/app/owallet/id1626035069) separately claims Bitcoin support, calls OWallet non-custodial and says “you hold your keys.” OWallet's [terms of service](https://owallet.io/terms-of-service) document recovery-phrase backup under **Settings → Manage Wallets → Recovery Phrase** and state that assets belong to the user controlling the private key.

The iPhone app has not been independently confirmed to expose a Bitcoin network. Even if its store claim is accepted, its current implementation cannot be inspected because the published mobile source stops at version 3.1.29.

OWallet points users to the public [`owallet-io/owallet`](https://github.com/owallet-io/owallet) repository as its source. That repository used to contain the React Native Android and iOS projects. Immediately before their removal, both platform manifests declared version **3.1.29**: Android in [`build.gradle`](https://github.com/owallet-io/owallet/blob/d69b10a222a0f2a305b00e9ec280c9669377b6b5/apps/mobile/android/app/build.gradle) and iOS in the [Xcode project](https://github.com/owallet-io/owallet/blob/d69b10a222a0f2a305b00e9ec280c9669377b6b5/apps/mobile/ios/mobile.xcodeproj/project.pbxproj).

On 2025-02-19, commit [`428d751`](https://github.com/owallet-io/owallet/commit/428d75161b655fa25cc5df29ba534180fb848ece) deleted the mobile application from that public tree. The `apps` path is now a Git submodule, and [`.gitmodules`](https://github.com/owallet-io/owallet/blob/main/.gitmodules) points it to `owallet-io/owallet-apps`. That repository was not publicly accessible when checked: its HTTPS Git endpoint returned “Repository not found.”

This is not merely a missing release tag. The App Store ships **3.8.3**, whereas the last mobile source available in the public repository identifies itself as **3.1.29**. The public parent repository still contains shared packages and extension code, but not the current mobile application needed to build the store release.

### iPhone verdict: nosource

The iPhone listing claims a self-custodial Bitcoin wallet, but the current binary cannot be reviewed or built from available source. The iPhone app therefore retains our **nosource** verdict unless an in-app check establishes that it too fails the earlier Bitcoin-support gate.
