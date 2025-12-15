---
wsId: uniSat
title: UniSat - Inscribe your dreams
altTitle: 
authors:
- danny
users: 100000
appId: io.unisat
appCountry: 
released: 2024-03-16
updated: 2025-10-14
version: v0.2.47(2472)
stars: 4.1
ratings: 
reviews: 15
website: https://unisat.io/
repository: 
issue: 
icon: io.unisat.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-10-23
signer: 
twitter: unisat_wallet
social:
- https://discord.com/invite/unisat
redirect_from: 
developerName: UniSat
builds: 
features: 

---

## App Description

UniSat Wallet is a non-custodial hierarchical deterministic (HD) Bitcoin wallet that supports storage and transfer of Bitcoin, Ordinals, and related token standards such as BRC-20, Alkanes, Runes, and CAT-20. 

They claim to enable users to inscribe (mint) Ordinals without requiring a full node and displays unconfirmed inscriptions in real time. 

They also mention that private keys are generated from a Secret Recovery Phrase, encrypted locally by the user’s password, and never transmitted externally. UniSat does not collect personally identifiable information or track balances.

They claim that the extension version of their app is 100% Open Source. But it appears that the wording is vague and may seem to imply that the entire project is 100% Open Source.

## Analysis 

We installed the app and was provided the seed phrases during initialization. 

Bitcoin is supported. 

However, when we checked their repository, we found what was supposed to be their android repository [unisat-app](https://github.com/unisat-wallet/unisat-app) only contains a README.md. 

A search on GitHub using the appID (related to android build settings) returned [non-relevant results.](https://github.com/search?q=io.unisat&type=code)

Despite claims, this app is **NOT source available**