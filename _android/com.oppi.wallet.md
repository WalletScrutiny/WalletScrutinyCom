---
wsId: oppiWallet
title: 'Oppi Wallet : Crypto Card/Pay'
altTitle: 
authors:
- danny
users: 10000
appId: com.oppi.wallet
appCountry: 
released: May 13, 2024
updated: 2025-10-29
version: 1.0.85
stars: 4.5555553
ratings: 
reviews: 7
website: https://oppiwallet.com
repository: 
issue: 
icon: com.oppi.wallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-20
signer: 
twitter: walletoppi
social: 
redirect_from: 
developerName: Encoin Limited
features: 

---

## App Description

Oppi Wallet (from Encoin Limited) pitches itself in the Play Store as a self‑custody wallet where “you control your private keys and your funds,” yet still layers in a fiat on/off ramp so users can buy, sell, swap, and store Bitcoin, Ethereum, stablecoins, and other supported tokens from one interface while tracking balances across multiple blockchains. 

The marketing site (`https://oppiwallet.com/en`) emphasizes its VASP certification, global availability (English/Turkish UI), biometric/MFA security, and claims of compliance. 

## Analysis

We [tested the app](https://x.com/BitcoinWalletz/status/1991480289051439126) and was able to access a Bitcoin wallet and the corresponding seed phrases. We imported the seed phrases onto Electrum desktop mobile and [successfully matched the address](https://x.com/BitcoinWalletz/status/1991481170073456918):
`bc1qpr0w9w9ems5lxkvwxyxm03uqkh4u7ppjynhjqc`.  

There were no claims regarding source-availability and a [search for the app ID](https://github.com/search?q=%22com.oppi.wallet%22&type=code) in GitHub Code **did not yield any relevant repository** corresponding to the source code of the app.