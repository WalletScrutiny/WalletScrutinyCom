---
wsId: flashWallet
title: Flash Wallet
altTitle: 
authors:
- danny
users: 50000
appId: com.flashwallet.production
appCountry: 
released: Oct 23, 2023
updated: 2025-10-31
version: '31.0'
stars: 
ratings: 
reviews: 
website: https://flash-wallet.com/
repository: 
issue: 
icon: com.flashwallet.production.jpg
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-14
signer: 
twitter: Flash_Techno_Of
social: 
redirect_from: 
developerName: Flash Wallet
features: 

---

## App Description

Flash Wallet (com.flashwallet.production) is a multi-chain cryptocurrency wallet that enables users to create and manage wallets using a standard 12-word BIP39 recovery phrase.
The app supports Bitcoin, providing native SegWit (bc1) send/receive functionality derived directly from the user’s seed.

It includes biometric protection, encrypted local key storage, QR-based payments, and the ability to add custom EVM tokens.

NFT viewing, on-device transaction signing, and a token-import interface allow users to manage both Bitcoin and EVM-compatible assets in a single non-custodial environment.

## Analysis

Flash Wallet provides a 12-word BIP39 seed phrase and displays a Bitcoin SegWit (bc1...) address.

We verified that the displayed address correctly derives from the seed phrase by importing the mnemonic into Electrum Desktop ([verification evidence](https://x.com/dannybuntu/status/1990367154076783009)). This confirms the app uses standard BIP39/BIP84 derivation for Bitcoin addresses.

However, without source code review, we cannot verify:
- Entropy quality during seed generation
- Whether keys are transmitted to external servers
- Presence of backdoors or key leakage mechanisms

Based on observable behavior and derivation verification with Electrum, the app **appears to be self-custodial**, though closed-source nature prevents complete security assessment.

The project does not make a claim regarding source-availability and offers **[no public source code.](https://github.com/search?q=com.flashwallet.production&ref=opensearch&type=code)**