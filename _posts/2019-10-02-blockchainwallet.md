---
title: "Blockchain Wallet"
excerpt: "One of the top two wallets but is it verifiable?"

wallet: true
users: 5000000
appId: piuk.blockchain.android
repository: https://github.com/blockchain/My-Wallet-V3-Android
icon: "images/wallet_icons/blockchainwallet.png"
custodial: false
opensource: true
verifiable: false
bugbounty: https://hackerone.com/blockchain
verdict: nonverifiable # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: 2019-10-29
permalink: /posts/2019/11/blockchainwallet/
redirect_from:
  - /blockchainwallet/
tags:
  - Android
  - FOSS
  - Security
---

[Blockchain Wallet](https://play.google.com/store/apps/details?id=piuk.blockchain.android)
is not custodial.

It **doesn't claim to be verifiable**.

The build verification turned out to **not be possible** as the wallet
[does not build with the files provided](https://github.com/blockchain/My-Wallet-V3-Android/issues/1250).

The provider should make the repository compilable as is. With a way to compile
the app, verification might then be possible for all but this file. The security
implications of a modified `google-services.json` are minor compared to not
being able to compile the project at all.


Other observations
==================

*Blockchain Wallet* does have a [bug bounty program](https://hackerone.com/blockchain).

Libraries are
[version pinned](https://github.com/blockchain/My-Wallet-V3-Android/blob/master/buildSrc/src/main/java/Dependencies.kt).

Libraries get pulled from
[nine repositories](https://github.com/blockchain/My-Wallet-V3-Android/blob/master/build.gradle#L26)
which might have some security implications, given it is
[not straight forward](https://docs.gradle.org/current/userguide/introduction_dependency_management.html#sec:dependency_resolution)
to see which repository gets to provide which library. `jcenter()` being the
last in the list is remarkable in so far as it's one of the more popular and
trusted repositories, which we would not say about some of the others. Any
package expected to be loaded from `jcenter()` thus could trivially get provided
by said others. But trustworthiness of repositories and dependencies is a whole
different topic anyway ...


Interpretation
--------------

[Blockchain Wallet](https://play.google.com/store/apps/details?id=piuk.blockchain.android)
cannot easily be verified to match its available public code.
