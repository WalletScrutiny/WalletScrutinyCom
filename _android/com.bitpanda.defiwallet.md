---
wsId: bitpandaDeFi
title: 'Bitpanda DeFi Wallet: Onchain'
altTitle: 
authors:
- danny 
users: 10000
appId: com.bitpanda.defiwallet
appCountry: 
updated: 2025-10-22
version: 1.3.2
stars: 
ratings: 
reviews: 
website: https://www.bitpanda.com/de/web3
repository: 
issue: 
icon: com.bitpanda.defiwallet.png
bugbounty: 
meta: ok
verdict: nobtc
appHashes: 
date: 2025-11-13
signer: 
twitter: Bitpanda
social:
- https://www.facebook.com/BITPANDA
redirect_from: 
developerName: Bitpanda Web3 FZCO
features: 

---

This is the Web3 DeFi app. The custodial app is {% include walletLink.html wallet='android/com.bitpanda.bitpanda' verdict='true' %}.

## App Description

Bitpanda DeFi Wallet is a non-custodial Web3 wallet that allows users to control their own private keys using a two-shard encrypted backup system shared between BitPanda and the user's cloud storage. 

The wallet supports EVM and Solana-based networks such as Ethereum, Polygon, Avalanche C-Chain, and Solana, but does not support Bitcoin or any UTXO-based chains.

## Analysis

The app has two features: the web3 DeFi portion, and the custodial exchange portion. The app could access both, but would need to **link** then **sign up** to the exchange using the same app. 

The DeFi portion of the app does provide the seed phrases (but this is only compatible with the BitPanda app) and [does not currently support Bitcoin, only tokenized Bitcoin](https://x.com/BitcoinWalletz/status/1988809141696262297). The exchange portion of the app is [custodial](https://www.bitpanda.com/en/security): 

> Asset protection
>
> We prioritise keeping your assets safe, incorporating multiple security measures to protect them from potential threats. Crypto assets are stored in highly-secure cold storage facilities that are examined by an external auditor. Your assets are yours.

There are two modes: a) web3 DeFi and the b) exchange portion. In the sequence of analyzing apps, we determine the verdict according to this order. Since the web3 DeFi portion comes first, and since it **does not support Bitcoin**, that verdict is reflected accordingly.