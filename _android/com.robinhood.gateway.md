---
wsId: robinhoodWalletSwapCrypto
title: 'Robinhood Wallet: Swap Crypto'
altTitle: 
authors:
- danny
users: 100000
appId: com.robinhood.gateway
appCountry: 
released: Mar 12, 2024
updated: 2025-11-03
version: 2025.44.0
stars: 4.4455447
ratings: 
reviews: 119
website: https://robinhood.com/web3-wallet/
repository: 
issue: 
icon: com.robinhood.gateway.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-12-08
signer: 
twitter: RobinhoodApp
social:
- https://www.instagram.com/robinhoodapp
- https://www.linkedin.com/company/robinhood
- https://www.tiktok.com/@robinhoodapp
redirect_from: 
developerName: Robinhood
features: 

---

## App Description

Robinhood Wallet is a multi-chain, non-custodial Web3 wallet that allows users to store, send, and swap digital assets across Ethereum, Solana, Polygon, Arbitrum, Optimism, and Bitcoin. 

The wallet provides user-controlled private keys and supports transferring assets between Robinhood Wallet and {% include walletLink.html wallet='android/com.robinhood.android' verdict='true' %}, which remains a separate service. 

## Analysis

Bitcoin support is included as one of the supported networks, but the implementation details—such as address formats, signing model, supported transaction types, or derivation paths are not documented in the Play Store listing. 

Our [tests](https://x.com/BitcoinWalletz/status/1997951939049611765) show that the app contains a Bitcoin wallet and the seed phrase was successfully imported into an Electrum wallet with matching addresses.

Robinhood [**does not publish the source code**](https://github.com/search?q=com.robinhood.gateway&type=code) for Robinhood Wallet, and no repository is linked from the Play listing or official documentation. 