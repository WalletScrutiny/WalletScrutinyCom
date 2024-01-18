---
wsId: nayutaCore2
title: Nayuta Wallet
altTitle: 
authors: 
- danny
users: 1000
appId: com.nayuta.core2
appCountry: 
released: 
updated: 2023-11-24
version: VARY
stars: 
ratings: 
reviews: 
size: 
website: https://nayuta.co/nayuta-wallet-2022/
repository: https://github.com/nayutaco/Support/wiki/Nayuta-Wallet-2022
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/516
icon: com.nayuta.core2.png
bugbounty: 
meta: ok
verdict: wip
date: 2024-01-18
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: Nayuta inc
features: 
- ln
---
We assume this is the successor to the now removed app {% include walletLink.html wallet='android/com.nayuta.core' verdict='true' %}


## App Description

> ✅Supports Lightning payment and automatic management using Lightning Service Provider(LSP)
>
> Warning: This app is still in beta so we urge you to only use amounts that you would be willing to lose as loss of funds is still possible.
>
> When making a Lightning Network transaction using Nayuta Wallet, if a path to the recipient cannot be found, Nayuta's Lightning Service Provider (LSP) will search for the path. Privacy is compromised since the path becomes identifiable, but the priority is given to convenience in avoiding a situation where the transaction cannot be completed.

## Analysis

The app's selling point is that it comes with a Lightning Service Provider which allows for, in its on words, easy lightning payments and channel management. Nayuta itself states that the app is still in beta which may put some of your funds at risk.

Users are allowed to backup and recover from the Lightning Channel via a passphrase, a Google Drive Auto Backup, or  a Manual Backup file saved onto the device. This app qualifies as self-custodial, so we went on to search for the source code to see if it was verifiable.

## Reproducible

In the GitHub repository there are currently two releases of the app's source code: one for android and the other for ios. Interestingly there are [multiple repositories](https://github.com/topics/nayutawallet) on Nayuta's account that are tagged as "nayutawallet" with descriptions suggesting that they are part of libraries and APIs that make up the app.

This repository, ["NayutaWalletLspLnd"](https://github.com/nayutaco/NayutaWalletLspLnd/blob/v0.15.4-beta.lsp-v0.2.1/docs/DOCKER.md) comes with Docker instructions. The repository ["NayutaWalletAppLnd"](https://github.com/nayutaco/NayutaWalletAppLnd/tree/v0.15.4-beta.app-v0.2.10) contains a bash script with commands to create either an "aar" or an "xcframework" file.

This app is **for verification.**