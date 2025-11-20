---
wsId: opzCryptoBTC
title: 'OPZ: Crypto & BTC Wallet'
altTitle: 
authors:
- danny
users: 1000
appId: com.opz.dev
appCountry: 
released: Aug 16, 2023
updated: 2025-05-16
version: 2.12.1
stars: 4.969697
ratings: 
reviews: 31
website: https://www.opz.io
repository: 
issue: 
icon: com.opz.dev.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-11-20
signer: 
twitter: OPZ_Official
social:
- https://t.me/OPZ_Chat
- https://discord.com/invite/SSmXDHCMZC
redirect_from: 
developerName: OPZ
features: 

---

## App Description

OPZ markets itself as an “all-in-one Web3 wallet” using MPC under the in-house “KeyFusion” protocol, meaning users sign transactions with multiple key shares instead of a mnemonic seed phrase. The Play Store description also advertises multi-factor authentication, WalletConnect v2, an embedded dApp browser, OPZ-branded NFC hardware for storing keys offline, and even an on-device “OPZ-AI” assistant. Security copy focuses on scanning tokens/dApps for risks and verifying destination addresses, while the [site](https://www.opz.io) touts its mission to “accelerate the transition to self-ownership of assets.”

## Analysis

Despite those self-custody claims, OPZ keeps everything closed-source: there’s [no repository for the Android](https://github.com/search?q=%22com.opz.dev%22&type=code) or iOS apps, yet the company still pushes proprietary features (KeyFusion, OPZ-NFC, AI assistant, risk scanners) that can’t be independently audited. The wallet additionally layers in 24/7 customer support and onboarding that requires registering an account within OPZ’s own backend, suggesting there may be server-dependent components even for MPC signing.

Our [tests](https://x.com/BitcoinWalletz/status/1991488024673427775) show that the app supports Bitcoin, but does not offer to backup the seed phrases. Instead users are given an MPC Key which is a lengthy alphanumeric string that could be backed up to the 'OPZ Cloud'. This app is **custodial**.
