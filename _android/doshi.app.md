---
wsId: doshiWallet
title: Do* Wallet
altTitle: 
authors:
- danny
users: 10000
appId: doshi.app
appCountry: 
released: 2022-08-22
updated: 2023-11-17
version: 1.0.130
stars: 3.3
ratings: 
reviews: 3
website: https://www.doshi.app
repository: 
issue: 
icon: doshi.app.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: 
date: 2024-10-23
signer: 
reviewArchive: 
twitter: doshi_wallet
social:
- https://discord.com/invite/xQkdtmZm5V
redirect_from: 
developerName: Doshi
features: 

---

## Update 2024-07-24

[Terms:](https://www.doshi.app/terms-conditions)

> Doshi App Limited (or our licensors) hold all intellectual property rights in and to the Doshi app worldwide. The app is licensed, not sold, to you for use. This means that we retain ownership of the app at all times.

We searched GitHub again for the app ID and got:

- 18 hits in [code](https://github.com/search?q=%22doshi.app%22&type=code) 
- 2 [repositories](https://github.com/search?q=%22doshi.app%22&type=repositories)

One of the hits in code is this:

- [doshi](https://github.com/jeffersribeiro/doshi/blob/master/android/app/build.gradle)

However, the app ID in the build.gradle file is **"com.doshi"** and not **"doshi.app"**. It's only version 1.0 and was last updated June 28, 2020. The app currently in review was released in August 22, 2022, last updated on 2023-11-17. 

None of the other repositories are related to the app in review. The source for doshi.app is not publicly available.

## App Description from Google Play 2023-07-17

> - Collect NFTs or mint your own on Polygon using Doshi’s AI technology
> - Get access to the latest DApps, NFT projects and blockchain-based Games.

The app claims to be a financial education app that allows users even as young as 13 to join.

## Analysis

- Section 29.2. Violation of the [terms](https://www.doshi.app/utilities/termsandconditions) gives Doshi the right to remotely access user's device and remove the app.
- When we installed the app, we were in 'school mode' - we couldn't access the wallet feature.
- From this [blog](https://www.doshi.app/post/5-must-know-tips-when-beginning-in-crypto-doshi) post we see that the app claims to be non-custodial, and supports buying bitcoin through its partnerships with regulated exchanges.
- We encountered some sign-in problems when testing the app.
- If we do a Google search using the 'site' parameter, with 'custody' or 'private keys' as the search term, we found some of their 'academy' articles referring to the app as a 'non-custodial' wallet with a 'special technology' for storing the private keys. We can't access this article or any similar references in any of its available online material.
- The current registration process does not provide the seed phrases or any other mechanism to backup the private keys.
- With the available information that we have, we will tentatively assume that this is a non-custodial wallet that supports bitcoin.
- We do not see any claims that it is source-available.
- Searching for the app ID on GitHub has [some possibly related repositories](https://github.com/search?q=doshi.app&type=code), but none that is conclusively the repository for the Android app.
- As an added note, its Head of Learning, one alleged, "Juan Giraldo" has a different name on LinkedIn when we search for using the profile image.
- For the meanwhile, we'll mark this app as **not source-available**.
- It's linked twitter account does not exist.
