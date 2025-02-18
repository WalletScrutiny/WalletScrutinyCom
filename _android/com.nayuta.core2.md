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
website: https://nayuta.co/nayuta-wallet-2022/
repository: https://github.com/nayutaco/NayutaWalletApp
issue: https://github.com/nayutaco/NayutaWalletApp/pull/2/files
icon: com.nayuta.core2.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: 
date: 2024-07-05
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

In the GitHub repository there are currently two releases of the app's source code: one for android and the other for ios. Interestingly there are [multiple repositories](https://github.com/topics/nayutawallet) on Nayuta's account that are tagged as "nayutawallet" with descriptions suggesting that they are part of libraries and APIs that make up the app.

Quote from [lw](../authors/leo.md):

> Other projects would split this into different repos or have both platforms side by side on the default branch.
>

Their [GitHub repository](https://github.com/nayutaco/NayutaWalletApp/blob/android-v0.3.0/android/app/build.gradle#L153)

>
> shows that their public code is at version 0.3.0 while Play Store has 0.5.0 for us.

The provider has disabled public access for the Issue tracker in their repository. There are also no build instructions for the Android app. In order to make a suggestion for them, we forked their repository and created a [pull request](https://github.com/nayutaco/NayutaWalletApp/pull/2/files) instead of an issue.

Until such time this is addressed, this app should be considered as **not source-available**.