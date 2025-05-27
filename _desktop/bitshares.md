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
date: 2025-04-24
twitter: xbtsdex
social: 
features: 

---

## App Description

BitShares is a decentralized exchange (DEX). They have two desktop applications, [XBTS-DEX](https://github.com/XBTS/xbts-ui/releases/latest) and [XBTS-DEFI](https://github.com/XBTS/app/releases/tag/v0.2.5). Despite having icons for Linux, and Apple, only the Windows binary was able for download in their GitHub releases page. We tested the Windows version. Using the platform requires signing up to their service. 

The Deposit/Withdraw option has this information:

> If you want to deposit or withdraw funds, either in fiat or from other blockchains, you may use a bridge or gateway service to do so. 

This desktop application does not include a Bitcoin wallet. Rather, it [makes use of gateways](https://medium.com/the-ledger-by-spark/dex-masterclass-102-bitshares-dex-complete-ecosystem-stable-php-case-study-d0d0879a979b). 

From the interface of the program, gateways are described:

> These assets are backed 100% by the real BTC or ETH or any other coin that people deposit with the gateways.

Bridges on the other hand:

> A bridge service provides a way to deposit an amount of a cryptocurrency other than BitShares, and in turn receive a SmartCoin equivalent.

Both point to the fact that the user may not be depositing BTC whose private key they control. "Backed by 100%" the real thing isn't the same as controlling the private keys. SmartCoins are simply **not Bitcoins**.