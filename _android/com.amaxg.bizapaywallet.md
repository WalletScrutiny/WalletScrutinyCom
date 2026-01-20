---
wsId: bizaPayWallet
title: BizaPAY Wallet - 암호화폐 지갑
altTitle: 
authors:
- danny
users: 1000
appId: com.amaxg.bizapaywallet
appCountry: 
released: 2025-01-13
updated: 2025-01-16
version: 1.0.0
stars: 
ratings: 
reviews: 
website: 
repository: 
issue: 
icon: com.amaxg.bizapaywallet.png
bugbounty: 
meta: stale
verdict: custodial
appHashes: 
date: 2026-01-16
signer: 
twitter: 
social: 
redirect_from: 
developerName: BIZA Project
builds: 
features: 

---

## App Description

From the Google Play description:

> easily manage various virtual assets and NFTs such as Bitcoin (BTC), Ethereum (ETH), and BizAuto. Assets from multiple blockchain networks can be integrated and managed in one place, and assets can be transferred easily and quickly...
>
> Visa Pay Wallet is a decentralized wallet service. Asset security is further strengthened because users directly manage their private keys. 

## Testing and Analysis

We managed to [test](https://x.com/BitcoinWalletz/status/2011974369271300352) the app despite the language difficulties.

We did find a screen with the Bitcoin logo, along with other coins and a ticker for the Korean Won (KRW). However, upon tapping it, nothing happened. There was no QR for the address, no text bitcoin wallet address. Instead a KYC box would appear - we assume it is asking us to fulfill KYC procedures before other features (such as displaying the BTC address perhaps) are available. We were also not provided the seed phrases. 

Since this is a stale foreign language app and since its website is no longer available, we are assuming that it is a **custodial** service that limits the wallet features of the app if KYC is not performed. It's also worth noting that it doesn't have a homepage, and the domain listed in its admin email is no longer available.

