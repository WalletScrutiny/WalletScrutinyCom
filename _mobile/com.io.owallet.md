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
  verdict: nosource
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

OWallet is a multichain mobile wallet from Oraichain. It is published as `com.io.owallet` by Oraichain Labs US on Google Play and as `io.orai.owallet` by Oraichain on the App Store. The different identifiers belong to the same product: OWallet's official repository links to both store listings, and both apps use the same name, website, feature set and source-code claim.

The wallet supports Bitcoin together with EVM, Cosmos, Tron and Solana networks. It also offers swaps, staking, portfolio tracking and a dApp browser.

## Testing and Analysis

This assessment uses the US store listings and OWallet's public repositories as checked on 2026-09-04.

### Bitcoin and key control

Both current store descriptions explicitly include Bitcoin. The [Google Play listing](https://play.google.com/store/apps/details?id=com.io.owallet) advertises a universal wallet for Bitcoin and other supported networks, and says:

> Private keys are stored securely on your device

The [App Store listing](https://apps.apple.com/us/app/owallet/id1626035069) likewise calls OWallet non-custodial and says “you hold your keys.” OWallet's [terms of service](https://owallet.io/terms-of-service) document recovery-phrase backup under **Settings → Manage Wallets → Recovery Phrase** and state that assets belong to the user controlling the private key.

Those claims establish that OWallet is a Bitcoin wallet and describe a self-custodial design. There is no exchange account standing between the user and an on-chain Bitcoin transaction, so the review proceeds to source availability.

### The published mobile source stops at version 3.1.29

OWallet points users to the public [`owallet-io/owallet`](https://github.com/owallet-io/owallet) repository as its source. That repository used to contain the React Native Android and iOS projects. Immediately before their removal, both platform manifests declared version **3.1.29**: Android in [`build.gradle`](https://github.com/owallet-io/owallet/blob/d69b10a222a0f2a305b00e9ec280c9669377b6b5/apps/mobile/android/app/build.gradle) and iOS in the [Xcode project](https://github.com/owallet-io/owallet/blob/d69b10a222a0f2a305b00e9ec280c9669377b6b5/apps/mobile/ios/mobile.xcodeproj/project.pbxproj).

On 2025-02-19, commit [`428d751`](https://github.com/owallet-io/owallet/commit/428d75161b655fa25cc5df29ba534180fb848ece) deleted the mobile application from that public tree. The `apps` path is now a Git submodule, and [`.gitmodules`](https://github.com/owallet-io/owallet/blob/main/.gitmodules) points it to `owallet-io/owallet-apps`. That repository was not publicly accessible when checked: its HTTPS Git endpoint returned “Repository not found.”

This is not merely a missing release tag. Google Play ships **3.8.2** and the App Store ships **3.8.3**, whereas the last mobile source available in the public repository identifies itself as **3.1.29**. The public parent repository still contains shared packages and extension code, but not the current mobile application needed to build either store release.

### Verdict: nosource

OWallet supports native Bitcoin and claims a self-custodial recovery-phrase design, but the source published for its mobile apps trails the store releases and the replacement mobile repository is not public. Neither current binary can therefore be reviewed or built from available source. Both the Android and iPhone apps receive our **nosource** verdict.
