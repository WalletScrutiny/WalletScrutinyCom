---
title: CLI Cold Wallet
appId: cli.coldwallet
authors:
- danny
released: 2017-10-16
discontinued: 
updated: 2018-04-03
version: 1.2.0
binaries: 
provider: 
providerWebsite: 
website: 
repository: https://github.com/Overtorment/cli-cold-wallet
issue: 
icon: 
bugbounty: 
meta: obsolete
verdict: diy
date: 2025-05-19
twitter: 
social: 
features: 

---

## App Description

This project was built by Igor Korsakov, one of the main developers for the {% include walletLink.html wallet='android/io.bluewallet.bluewallet' verdict='true' %}. Can be run with node and is only a few lines long. Once installed it generates an ECPair through bitcoinjs-lib derives the SegWit-P2SH address and WIF private key, then prints both (plus QR codes) in a terminal table. [Source](https://github.com/Overtorment/cli-cold-wallet/blob/master/cli-cold-wallet.js) 

Since the program was meant to be built from source, this is a DIY project that's **obsolete**.