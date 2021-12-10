---
wsId: bhWallet
title: "Bluehelix Wallet"
altTitle: 
authors:
- danny
- emanuel
- leo
users: 100
appId: com.bhex.wallet
released: 2021-07-07
updated: 2021-09-19
version: "1.3.5"
stars: 3.7
ratings: 6
reviews: 4
size: 22M
website: https://www.bhexchain.com/
repository: https://github.com/bluehelix-chain/wallet-android
issue: https://github.com/bluehelix-chain/wallet-android/issues/4
icon: com.bhex.wallet.png
bugbounty: 
verdict: fewusers
date: 2021-11-17
signer: 
reviewArchive:


providerTwitter: BHEXOfficial
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


**Update 2021-11-17**: Despite this app having only few users, Emanuel looked
into it and found the source code could not be compiled. The provider
[has not replied in two weeks](https://github.com/bluehelix-chain/wallet-android/issues/4).

**NOTE:** It is unclear what the connection is between this app and {% include walletLink.html wallet='android/com.bh.android' verdict='true' %}. They have strikingly similar logos and titles, however both apps have different developers. While HBTC's app is called BHEX **Exchange** and has been discontinued, this app claims to be a decentralized wallet.

## App Description

> Bluehelix Wallet is the first reliable decentralized cross-chain wallet, decentralized cross-chain asset safe custody, efficient and scalable consensus clearings, and a wide range of API support. It is the best wallet tool you can use to manage Bluehelix Chain assets.


## The Site

On security:

> Bluehelix Chain innovates three-layer node architecture, utilizes the distributed private key generation and signature mechanism to realize asset swaps crossing any chains with security, and the direct value swap of the same assets on different public chains can be realized via HDEX, OTC, Cross-chain deposit & withdrawal and other on-chain applications and functions.

The site lists Huobi, OKCoin, and Plum Ventures as "Investors & Ventures" on the homepage.

There is also a "Bluehelix Technical Function Manual" and [we also find a guide](https://docs.bhexchain.com/en/home.html) on what "BHEX chain" is:

> Bluehelix is the next generation **decentralized custody and clearing technology.** Based on decentralization and community consensus, it employs comprehensive technologies including cryptography and blockchain, supports decentralized governance through technology, and aims to effectively solve the security and trust problems faced by centralized digital assets platforms. **Bhex Chain is the public blockchain on decentralized custody and settlement of digital assets based on Bluehelix technology.**

From this information, it looks like apps that claim to be BHEX exchanges or wallets are simply using the technology provided by BHEX chain.

## The App

We tested out the app and are immediately greeted by a Privacy Policy and Service Agreement screen. You are then allowed to create a new wallet or import an existing wallet with either a mnemonic phrase, a private key, or by importing KeyStore.

### Creating a wallet

You are asked to set up a name for the wallet, as well as a password. Users are then presented with a backup mnemonic phrase for the new wallet and asked to verify that it had been backed up.

Users now have access to a wallet that appears to hold multiple cryptocurrencies, including HBC, BNB, BTC, DAI, DOGECOIN, and ETH. Users may backup or export mnemonics or private keys in the settings.

## Verdict

This is a **self-custodial** app. The website has linked to a [repository](https://github.com/bluehelix-chain/wallet-android) that is purportedly for the Bluehelix wallet. [Searching for the Play Store ID yields some results in Github](https://github.com/bluehelix-chain/wallet-android/search?q=com.bhex.wallet), however, with no build instructions, it is unsure if this is verifiable source code.

We await further information before we can make a verdict.
