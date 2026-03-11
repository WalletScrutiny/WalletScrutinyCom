---
wsId: softnoteCrypto
title: 'SoftNote: Secure Crypto Wallet'
altTitle: 
authors: 
users: 1000
appId: com.softnotewallet
appCountry: 
released: 2024-08-18
updated: 2025-10-17
version: 1.8.4
reviews: 3
website: https://softnote.com
repository: 
issue: 
icon: com.softnotewallet.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-12-08
signer: 
twitter: tectumsocial
social:
- https://www.linkedin.com/showcase/tectum-blockchain
- https://t.me/tectumglobal
- https://www.facebook.com/Tectum.io
- https://www.youtube.com/channel/UCn17IrKSqmIFn8illLRR2-g
redirect_from: 
developerName: Crispmind Ltd.
builds: 
features: 

---

## App Description

SoftNote Wallet is a mobile application built by Crispmind Ltd. that manages “SoftNote Bills”, which are digital bearer-style instruments issued on Tectum’s T12 blockchain and can be filled with assets such as Bitcoin, Ethereum, USDT, TRX, and TET. 

The app allows users to mint, fill, burn, send, and receive SoftNotes, while also providing a conventional crypto interface for transferring supported assets on BTC, ERC-20, TRC-20, and T12 networks. SoftNote’s payment model relies on transferable SoftNote Bills rather than traditional on-chain Bitcoin transactions, and peer-to-peer transfers inside the SoftNote system are marketed as zero-fee, with merchants paying up to a 1% processing fee. 

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/1998008797303128181) the app and observed an unusually long loading time, often exceeding five minutes before the interface became usable.

During testing, the app did not provide any seed phrase, nor did we find any feature that allowed viewing or exporting private keys, making it unclear whether users have any form of key ownership or wallet-level control.

The interface was also confusing, at times giving the impression that users could deposit Bitcoin into an address beginning with “3”, though the app provided no verifiable information confirming whether this was an actual Bitcoin address, a custodial deposit address, or part of Tectum’s SoftNote overlay system.

We then take a look at its [documentation FAQ](https://softnote.com/faq):

> How does the Tectum connect to other Blockchains?
>
> Tectum does not connect to other blockchains. In the case of Bitcoin, the transactions are executed as Tectum Smart Contracts; Tectum holds the BTC and runs a ledger of the transactions on the Tectum blockchain. In addition, Тectum signs BTC transactions and saves them in the ledger. Therefore, Tectum can guarantee BTC transactions via its own Ledger.

Based on Tectum’s public documentation, SoftNote operates under a **custodial** architecture in which the provider holds all Bitcoin on behalf of users, executes Bitcoin transactions internally as smart contracts, and signs all real BTC transactions using Tectum-controlled private keys. 

Therefore, the user never controls Bitcoin keys, and SoftNote should be classified as **custodial**.