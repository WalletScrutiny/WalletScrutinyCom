---
wsId: tapProtocolWallet
title: TAP Protocol Wallet
altTitle: 
authors:
- danny
users: 1000
appId: com.tapwalletmobile
alternativeStores: 
appCountry: 
released: 2025-07-24
updated: 2026-01-19
version: 1.0.29
reviews: 
website: https://tap-protocol.com
repository: 
icon: com.tapwalletmobile.png
bugbounty: 
meta: ok
verdict: nosource
date: 2026-05-02
signer: 
twitter: tap_protocol
social: 
redirect_from: 
developerName: Trac Systems
builds: 
features: 

---

## App Description

TAP Protocol Wallet is presented as a wallet for TAP Protocol tokens and Bitcoin inscription-related assets. The Google Play listing says it supports one-transaction transfers for TAP Protocol tokens and can make sats from inscriptions spendable as Bitcoin. TAP Protocol documentation describes TAP as a protocol built on Bitcoin Ordinals and Bitcoin L1.

## Testing and Analysis

The app is in scope because the listing describes Bitcoin-related wallet functions, including spending sats from inscriptions. Public TAP Protocol repositories document protocol specifications and related tooling.

We [tested the app](https://x.com/BitcoinWalletz/status/2050509492673257614), and found support for BTC. Then 24 words seed phrases. The addresses matched when the seed was exported to Electrum. 

I did [not find the repository](https://github.com/search?q=com.tapwalletmobile&type=code) for the android app by searching for the app ID `com.tapwalletmobile` on GitHub.

This app is **not source-available**.