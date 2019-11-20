---
title: "Bitcoin.com Bitcoin Wallet"

wallet: true
users: 1000000
appId: com.bitcoin.mwallet
launchDate: 2017-06-01
latestUpdate: 2019-10-18
apkVersionName: 5.13.3
stars: 4.0
commentCount: 9016
permissions:
website: https://www.bitcoin.com/
repository:
icon: "images/wallet_icons/bitcoincom.png"
bugbounty:
verdict: nosource # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: 2019-11-09
permalink: /posts/2019/11/bitcoincom/
redirect_from:
  - /bitcoincom/
tags:
  - Android
  - Security
---


[Bitcoin.com Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.bitcoin.mwallet)
claims to be non-custodial on their Playstore description:

> Our **non-custodial wallet** app lets nobody but you access the coins you own.

It claims to be non-custodial on their [website](https://wallet.bitcoin.com/),
too, yet the website doesn't link to any source code repository. On the website,
the link to "other versions" leads to GitHub but not to source code but only to
an [archive of binaries](https://github.com/bitcoin-portal/bitcoin-wallet-releases/releases)
which contains a file `Source code (zip)` but this zip file only contains a
`README.md` with the following content:

    ## Bitcoin.com Wallet Releases

    Includes APK, DMG, EXE for Bitcoin.com wallet.

This is where we give up for now and conclude the wallet to **not be verifiable**.
