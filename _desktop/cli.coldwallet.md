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
verdict: sourceavailable
date: 2025-06-03
twitter: 
social: 
features: 

---

## App Description

This project was built by Igor Korsakov, one of the main developers for the {% include walletLink.html wallet='android/io.bluewallet.bluewallet' verdict='true' %}. Can be run with node and is only a few lines long. Once installed it generates an ECPair through bitcoinjs-lib derives the SegWit-P2SH address and WIF private key, then prints both (plus QR codes) in a terminal table. [Source](https://github.com/Overtorment/cli-cold-wallet/blob/master/cli-cold-wallet.js) 

This wallet merits a **sourceavailable** verdict as it generates private keys locally with full user control, never exposing them to third parties or online services. The application creates WIF private keys and corresponding SegWit-P2SH addresses that can be used to receive Bitcoin transactions securely, functioning as a true cold wallet when run on an offline machine. Users can verify the code's integrity directly as it's a short, readable script with no obfuscation, making the private key generation process fully transparent. While receiving Bitcoin requires only the generated address, spending would require importing the private key into another wallet, maintaining the cold storage security model. The complete source availability allows users to audit exactly how their private keys are handled, which is essential for a tool designed to manage Bitcoin securely.

However, this cli program hasn't been updated for more than 7 years and **is not recommended for use**. 

