---
wsId: 
title: Lexaa Wallet
altTitle: 
authors:
- danny
users: 1000
appId: com.lexaawallet.user
alternativeStores: 
appCountry: 
released: 2025-10-09
updated: 2025-12-05
version: '3.0'
reviews: 
website: https://lexaascan.com
repository: 
icon: com.lexaawallet.user.png
bugbounty: 
meta: ok
verdict: nobtc
date: 2026-05-20
signer: 
twitter: 
social: 
redirect_from: 
developerName: Swayam Health
builds: 
features: 

---

## App Description

Lexaa Wallet is described as a non-custodial crypto wallet built on LexaaChain.
The Google Play listing says it lets users send, receive, store, and manage cryptocurrencies and NFTs across multiple blockchains.
The listing says users keep full control of their private keys.
It does not name Bitcoin or BTC as a supported asset.

## Analysis

Lexaa Wallet is presented as a crypto wallet.
It claims send and receive functionality.
It claims self-custody.
However, the public listing does not claim Bitcoin support.
It only says cryptocurrencies, NFTs, multiple blockchains, and LexaaChain.
Those generic terms are not enough to establish BTC, Bitcoin mainnet, or Lightning support.

The listed homepage, https://lexaascan.com, is not working.
A direct request to the homepage returned Cloudflare HTTP 521.
This means the public website could not be used to verify Bitcoin support or source availability.
We also could not complete app testing because the app required mobile-number OTP verification.
Searches for the exact app id and Lexaa Wallet source code did not find a public Android wallet repository.
We also did not find public documentation naming BTC, Bitcoin mainnet, or Lightning support.

App screenshots in the Google Play listing primarily show Ethereum assets. 

Unknown Bitcoin support is not treated as yes.
The review stops at the Bitcoin-support step.
For our purposes, the verdict is **nobtc**.

Sources:

- [GitHub code search for exact app id](https://github.com/search?q=%22com.lexaawallet.user%22&type=code)
