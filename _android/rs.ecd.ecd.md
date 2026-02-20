---
wsId: ecdWallet
title: 'ECD Wallet: Buy BTC & ETH'
altTitle: 
authors:
- danny
users: 5000
appId: rs.ecd.ecd
appCountry: 
released: 2024-10-22
updated: 2026-02-04
version: 1.4.78
reviews: 
website: https://ecd.rs/
repository: 
issue: 
icon: rs.ecd.ecd.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2026-01-03
signer: 
twitter: ecd_RS
social:
- https://www.youtube.com/@ecd-rs/videos
- https://www.linkedin.com/company/ecd-rs
- https://www.instagram.com/ecd_RS
- https://www.facebook.com/ecd.rs
redirect_from: 
developerName: ECD.RS
builds: 
features: 

---

## App Description

ECD Wallet is a mobile cryptocurrency wallet tied to the ECD.rs platform that enables registered and verified users to hold, send, receive, buy, and sell multiple cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Cardano (ADA), Tether (USDT), and Tron (TRX) using Serbian dinar (RSD).

The associated ECD Wallet service permits depositing RSD via bank transfer, exchanging between RSD and supported crypto, transferring crypto to other addresses, and withdrawing RSD back to a bank account, with transaction limits and fees defined per asset.

## Analysis

According to the official [FAQ](https://ecd.rs/en/faq/), wallet access requires account verification and multi-factor authentication (MFA); users can view transaction history, reset wallet passwords, and manage deposits and withdrawals through the ECD platform, where cryptocurrency storage is facilitated via Fireblocks infrastructure.

### What is Fireblocks?

[Fireblocks](https://www.fireblocks.com) primarily operates as a "Custody Technology Service Provider". This means it provides the software and infrastructure (the "rails") for businesses like ECD to manage assets, but it does not take "custody" of the assets in the traditional legal sense. 

For our purposes, we still consider this as a **custodial arrangement** if the user does not have exclusive control of the private keys 100%.