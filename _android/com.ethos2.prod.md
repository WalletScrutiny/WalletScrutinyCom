---
wsId: ethosCrypto
title: 'Ethos: Crypto Trading Wallet'
altTitle: 
authors:
- danny
users: 10000
appId: com.ethos2.prod
appCountry: 
released: 2023-06-26
updated: 2026-01-30
version: 5.3.3
reviews: 18
website: https://www.ethos.io
repository: 
issue: 
icon: com.ethos2.prod.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-14
signer: 
twitter: Ethos_io
social: 
redirect_from: 
developerName: Ethos.io
builds: 
features: 

---

## App Description

Ethos is an MPC-based self-custody wallet built around an Ethereum-only architecture, using a mobile Secure Element and a proprietary “Magic Keys” recovery system instead of traditional seed phrases.

Its vault system stores and manages user keys through a multi-party cryptography scheme, enabling self-custody access and on-device signing for Ethereum and ERC-20 assets.

The app supports self-custody swaps through the 0x protocol and provides real-time analytics and portfolio monitoring for Ethereum-ecosystem tokens.

## Analysis

We were able to [test](https://x.com/BitcoinWalletz/status/1989222846212845661) the app and found a Bitcoin wallet as well as the 24-word seeds. 

There were **no claims regarding source-availability** nor did we find its Android app repository by [searching for its app identifier on GitHub Code.](https://github.com/search?q=%22com.ethos2.prod%22&type=code)