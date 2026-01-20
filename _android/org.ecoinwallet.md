---
wsId: 
title: 'ECOIN: Crypto & Bitcoin Wallet'
altTitle: 
authors:
- danny
users: 10000
appId: org.ecoinwallet
appCountry: 
released: 2024-01-21
updated: 2026-01-14
version: 1.8.6
stars: 4.4
ratings: 
reviews: 5
website: https://ecoinwallet.org
repository: https://github.com/ecoin-finance/ecoinwallet
issue: https://github.com/ecoin-finance/ecoinwallet/issues/1
icon: org.ecoinwallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2026-01-03
signer: 
twitter: ecoin_wallet
social:
- https://www.instagram.com/ecoin_wallet
- https://www.youtube.com/@ecoinwallet
- https://t.me/ecoin_wallet
redirect_from: 
developerName: Ecoin Ecosystem LTDA
builds: 
features: 

---

## App Description

ECOIN Wallet is an Android multi-chain cryptocurrency wallet that supports Bitcoin and additional networks including Ethereum, Solana, BNB Chain, Polygon, Stellar, Base, ZetaChain, and Pi Network on mainnet and testnet.

The wallet generates and stores mnemonic seed phrases and private keys locally on the device, with AES encryption, and the seed phrases can be exported and successfully imported into other compatible wallets such as Electrum.

ECOIN Wallet also includes in-app asset swapping, cross-chain swap functionality via ZetaChain, and NFT storage and management within a single mobile application.

## Testing and Analysis

We [tested](https://x.com/BitcoinWalletz/status/2007346453870756327) the app and verified the [existence of a Bitcoin wallet](https://x.com/BitcoinWalletz/status/2007345472441401517/photo/4) with an address of `bc1quckdqxm0mjad00rjfnzwxhxzu5w4qyw2h20mcu`.

A 24-word seed phrase was provided which we successfully exported to Electrum desktop. It generated matching BTC addresses. The app has a corresponding [GitHub organization page](https://github.com/ecoin-finance), and a [repository for the Android app](https://github.com/ecoin-finance/ecoinwallet). The repo itself held only a `LICENSE` and `README.md`, and the release artifacts—the APK plus the “source” zip/tarball—unpacked to those same two files, so it still **isn’t source-available**.