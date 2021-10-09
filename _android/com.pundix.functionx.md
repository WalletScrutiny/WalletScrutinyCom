---
wsId: functionX
title: "f(x)Wallet by Pundi X Labs"
altTitle: 
authors:
- danny
users: 10000
appId: com.pundix.functionx
released: 2021-03-25
updated: 2021-09-29
version: "1.8.0(001)"
stars: 3.9
ratings: 236
reviews: 124
size: 33M
website: https://functionx.io/
repository: https://github.com/FunctionX/fx-wallet-android
issue: 
icon: com.pundix.functionx.png
bugbounty: 
verdict: nosource
date: 2021-10-04
signer: 
reviewArchive:


providerTwitter: FUNCTIONX_IO
providerLinkedIn: functionx
providerFacebook: FunctionX.io
providerReddit: 

redirect_from:

---


### App Description

It claims to support multiple blockchains including Bitcoin, Ethereum and their own, Function X. 

> Supports on-chain storage, transfer, and exchange of digital assets such as Bitcoin, ERC-20s, and Function X.

Google Play reviews show 4 stars out of 219 reviews. 

Among a few of the reviews include:

> [Sead Metjahic](https://play.google.com/store/apps/details?id=com.pundix.functionx&reviewId=gp%3AAOqpTOGv4V8i6M_ZbM-q3PxR16FaLXKcDEgKSd8soXjm3swPoZ4dDhnl_-oj3HUPrCPW391nU3BXH7EaAoAHsg)<br>
  ★★☆☆☆ September 24, 2021 <br>
       Cannot create a backup due to it crashing... Not able to transfer my coins out of this wallet due to signature issue. Scared to even attempt uninstall and reinstall waiting for new update hopefully this gets resolved soon.

### The Site

The terms of service can only be found on the app prior to "Create a new wallet" or "Import a Wallet". Curiously, we cannot find a link to this terms anywhere else on the site or online. We endeavored to make a [pastebin of the Terms](https://pastebin.com/HtC4CnEy) that are copied verbatim from the app as of September 30, 2021.

Some pertinent provisions:

> **Services**<br>
The Wallet Application enables users: (i) the self-custody of their digital assets, meaning, we do not store your private key on your behalf; 

### The App

We installed the app both on Blue Stacks and on a Samsung Phone. Upon opening you have 2 options:

- Create wallet
- Restore or import existing wallet

Both require 24-word seed.

After that, there were no KYC measures or ID verification. A BTC wallet is available by scrolling down and tapping on "Add Asset"

It is possible to send or receive BTC from the app.

### Verdict
The 24-word seed phrase is for the entire wallet and not just specifically for bitcoin. 

We found a repository for the code and [Emanuel](https://walletscrutiny.com/authors/emanuel/) made [an issue on Github.](https://github.com/FunctionX/fx-wallet-android/issues/1)

> This repo last commit is from "Feb 4, 2021" and contain only 5 commits and 1 tag for version 1.0.0, while [the android app with appid "com.pundix.functionx"](https://play.google.com/store/apps/details?id=com.pundix.functionx) was last updated in: "August 9, 2021" with version: 1.7.2 and [according to appbrain had several version before that.](https://www.appbrain.com/app/fxwallet-by-pundi-x-labs/com.pundix.functionx)

The source code for this app is **not-verifiable.**
