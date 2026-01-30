---
wsId: dfxBTCTaroWallet
title: DFX BTC Taro Wallet
altTitle: 
authors:
- danny
users: 1000
appId: swiss.dfx.bitcoin
appCountry: 
released: 2023-09-25
updated: 2025-07-23
version: 2.0.3
reviews: 
website: https://dfx.swiss/
repository: https://github.com/DFXswiss/btc-wallet
issue: https://github.com/DFXswiss/btc-wallet/issues/167
icon: swiss.dfx.bitcoin.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2026-01-03
signer: 
twitter: https://x.com/DFX_Swiss
social:
- https://www.linkedin.com/company/dfxswiss
redirect_from: 
developerName: DFX AG
builds: 
features: 

---

## App Description

DFX Bitcoin Wallet is an Android Bitcoin-only wallet that allows users to create an on-chain HD SegWit (BIP84) wallet, send and receive Bitcoin, and connect to a Lightning wallet via an LNDHub provider.

The app provides an exportable recovery phrase for the on-chain wallet and supports Lightning connectivity through selectable providers such as DFX.swiss, lightning.space, or a custom LNDHub endpoint.

It also integrates bank-to-wallet and wallet-to-bank functionality, enabling Bitcoin purchases and sales via linked fiat bank transfers.

## Analysis

Based on [in-app testing shown in the shared screenshots](https://x.com/BitcoinWalletz/status/2007370345687498753), the DFX Bitcoin Wallet generates an on-chain HD SegWit (BIP84) wallet with a user-visible and exportable recovery phrase, confirming local key generation for on-chain Bitcoin.

The app also includes Lightning support implemented via LNDHub, where users connect to an external Lightning service (e.g., DFX.swiss or lightning.space) and manage Lightning funds through provider-issued credentials rather than the on-chain seed.

DFX’s website and [FAQ](https://dfx.swiss/faq.html) describe a separation between the wallet software and fiat on/off-ramp services, where bank transfers and buy/sell operations are handled by DFX, while Bitcoin received into the wallet is controlled through the wallet application.

The published [GitHub repository](https://github.com/DFXswiss/btc-wallet) and tagged release correspond to the Google Play release of the same version, with source code and Android build artifacts made publicly available on the same date.

This app is **source-available** and **for verification**.