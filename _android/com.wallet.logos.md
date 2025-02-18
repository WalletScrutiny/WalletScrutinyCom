---
wsId: LogosDVWallet
title: Dives Wallet (DABI)
altTitle: 
authors:
- danny
users: 10000
appId: com.wallet.logos
appCountry: 
released: 2020-09-16
updated: 2024-10-21
version: 0.4.1
stars: 
ratings: 
reviews: 
website: https://logos-foundation.org/logos
repository: 
issue: 
icon: com.wallet.logos.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-10-24
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: Logos Foundation PTE. LTD.
features: 

---

This app claims to be a multi-currency digital wallet. Its description advertises the following:

>
 - Intuitive UX configuration makes it easy to transmit crypto.
 - It is easy to send to contacts/QR codes.
 - Transfer between DV Wallet users is free of charge!
 - Multi-currency Support
 - It supports Bitcoin (BTC), Ethereum (ETH)
 
 
Searching for the company's name, "LOGOS Foundation PTE LDE" took us to what can be assumed to be the official site. There we found the product's [whitepaper.](https://logos-foundation.org/logos-en.pdf) One section had information on how the app encrypts private keys:

> Decentralized Security Wallet Service
>
>  Logos encrypts and stores user information for safekeeping of assets. The parser responsible for key distribution receives a randomly generated 256bit key from the Dynamic Key Management System (DKMS) and encrypts it with the seed encryption algorithm. Afterwards, the key is divided according to the number of storage nodes and the linked list is implemented and stored in each storage node. If stored, distribute keys to be stored jointly with their distributed keys on the left and right brother storage nodes to form a recoverable environment by bypassing the storage node even if the storage node is not connected due to an accident. In addition, it plans to store various areas to prepare for non-permanent situations such as natural disasters. 

In the same page:

> Logos will store private key using secure enclave and security
keystore provided by platforms from iOS and Android.

DV Wallet's code is not up for review and there's nothing on the website on how to backup/restore a wallet. While the provider does claim that private keys will store private keys protected by mobile phone features, the fact that transactions between {{ page.title }}'s users are advertised as free strongly hints to this product being **custodial** as else, Bitcoin transactions would cost at least a small fee always.