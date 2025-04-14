---
title: BitShares Xbts DEX
appId: bitshares
authors:
- danny
released: 2019-01-27
discontinued: 
updated: 2022-11-30
version: 3.2.4
binaries: 
provider: 
providerWebsite: 
website: https://xbts.io
repository: https://github.com/XBTS/xbts-ui
issue: 
icon: bitshares.png
bugbounty: 
meta: obsolete
verdict: nobtc
date: 2025-04-14
reviewArchive: 
twitter: xbtsdex
social: 
features: 

---

## App Description

> The BitShares desktop application is a self-custodial wallet designed for managing assets on the BitShares blockchain. Built with Electron, it runs on Windows, macOS, and Linux, allowing users to securely store private keys locally and sign transactions client-side. The app connects to BitShares nodes via API, providing full access to account management, asset transfers, market trading, and decentralized exchange features. It does not support Bitcoin wallets natively but can interact with BTC-pegged assets through the BitShares ecosystem.

This desktop application does not include a Bitcoin wallet. Rather, it [makes use of gateways](https://medium.com/the-ledger-by-spark/dex-masterclass-102-bitshares-dex-complete-ecosystem-stable-php-case-study-d0d0879a979b): 

> To make trading BTC on the BitShares DEX possible, a gateway will run a Bitcoin node that process transactions on the Bitcoin blockchain. When a customer makes a BTC deposit, the gateway will take that BTC and issue a BitShares-based token in exchange which represents the value of that Bitcoin deposit. That is the UIA and as a BitShares based token, it can be traded quickly and easily across the BitShares ecosystem.