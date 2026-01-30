---
wsId: tastyCrypto
title: 'tastycrypto: Crypto Wallet'
altTitle: 
authors:
- danny
users: 1000
appId: com.tastycrypto
appCountry: 
released: 2023-05-02
updated: 2025-03-12
version: 0.4.1
reviews: 8
website: https://www.tastycrypto.com/
repository: 
issue: 
icon: com.tastycrypto.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-12-16
signer: 
twitter: tastycrypto
social:
- https://discord.com/invite/Np9hzS2QTj
- https://www.youtube.com/channel/UCgGyrBOeDZHYphAHf-Fvnkw
- https://www.instagram.com/tastycrypto
- https://www.facebook.com/tastycrypto
- https://www.tiktok.com/@thetastycrypto
redirect_from: 
developerName: tastycrypto
builds: 
features: 

---

## App Description

tastycrypto is an Android self-custodial cryptocurrency wallet developed by IG Group and tastytrade that allows users to hold and manage crypto assets without the provider controlling private keys.

According to its Google Play listing, the wallet supports Bitcoin (BTC), Ethereum (ETH), and Polygon (MATIC) networks, and allows users to import an existing seed phrase, buy crypto in-app, or transfer funds from tastytrade.

The app claims to include features such as token swaps, NFT viewing, WalletConnect support for interacting with decentralized applications, and basic portfolio and network fee tracking.

## Analysis

The Play Store description states that users retain full control of their seed phrase and assets, with swaps and Web3 interactions executed directly from the wallet rather than through a custodial account.

We [tested](https://x.com/BitcoinWalletz/status/2000811191548199352) this and verified that claim. The seed phrases were successfully imported into Electrum Desktop 4.6.2 using BIP39. The bitcoin addresses matched. 

No claims regarding source availability has been made. A search on GitHub Code using the app ID [did not show relevant results regarding the app's repository](https://github.com/search?q=%22com.tastycrypto%22&type=code).