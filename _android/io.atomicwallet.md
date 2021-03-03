---
wsId: atomic
title: "Bitcoin Wallet & Ethereum Ripple ZIL DOT"
altTitle: 
authors:
- leo
users: 500000
appId: io.atomicwallet
launchDate: 2019-01-30
latestUpdate: 2021-02-22
apkVersionName: "0.72.1"
stars: 4.3
ratings: 25438
reviews: 13198
size: 14M
website: https://atomicwallet.io
repository: 
issue: 
icon: io.atomicwallet.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-03-02
reviewStale: false
signer: 
reviewArchive:
- date: 2020-10-12
  version: "0.72.1"
  apkHash: 
  gitRevision: d83253e829502835962be71b96dd37287dc87f5c
  verdict: nosource

providerTwitter: atomicwallet
providerLinkedIn: 
providerFacebook: atomicwallet
providerReddit: 

redirect_from:

---


**Update 2021-03-02:** We were approached by a visitor mentioning that Atomic
does have a GitHub and indeed [they do](https://github.com/Atomicwallet) but
none of the repositories there looks like belonging to this wallet. As it turns
out, the app is not only closed source but also **obfuscated** JS code which not
necessarily means bad intentions and might be due to Cordova working that way
but it certainly makes any attempt at auditing what the wallet actually does
very hard.

**Original review:**

Bitcoin Wallet & Ethereum Ripple Tron EOS
is a non-custodial wallet according to their description:

> Atomic Wallet is universal non-custodial app for over 300 cryptocurrencies.

Unfortunately they do not share all sources for the Android app.

Verdict: This wallet is **not verifiable**.
