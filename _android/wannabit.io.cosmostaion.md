---
wsId: wannabitCosmostation
title: Cosmostation Interchain Wallet
altTitle: 
authors:
- danny
users: 100000
appId: wannabit.io.cosmostaion
alternativeStores: 
appCountry: 
released: 2019-03-17
updated: 2026-04-16
version: 1.10.48
reviews: 136
website: https://cosmostation.io
repository: https://github.com/cosmostation/cosmostation-android
icon: wannabit.io.cosmostaion.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2023-01-03
signer: 
twitter: CosmostationVD
social:
- https://t.me/cosmostation
- https://www.youtube.com/@cosmostationio
redirect_from: 
developerName: Stamper
builds: 
features:
- foss
- hd
- segwit
- taproot

---

## App Description

The app is a non-custodial, multi-chain cryptocurrency wallet that supports Bitcoin, Ethereum, Sui, Cosmos (ATOM), and more than 100 additional blockchain networks.

According to the app's Play description:

The wallet signs all transactions locally on the user’s device, does not transmit private keys externally, and follows BIP44 HD standards or official chain specifications, including support for Bitcoin Taproot, Native SegWit, SegWit, and Legacy addresses.

Cosmostation Wallet is published as open-source software and provides asset management and transaction functionality across Tendermint-based chains, Ethereum and its Layer-2 networks, and Sui.

## Testing and Analysis

We tested the app and were given a 24-word seed phrase. The Bitcoin address was labelled as Taproot. So we used Sparrow 2.3.1-1 since it currently supports Taproot. We followed these instructions: 

1. File > New Wallet (name it)
2. Script Type: Taproot (P2TR)
3. Click New or Imported Software Wallet
4. Select 24 words
5. Enter your seed phrase
6. If you used a passphrase, enter it
7. Click Create Keystore (verify path shows m/86'/0'/0')
8. Click Import Keystore > Apply
9. Set a local wallet password

The addresses between the app and Sparrow: `bc1pw2zy5kj5fgha7gw2vd4u28s9ucxjhzhweegnku7zzttp4d9mv82qr9nw0f` [matched](https://x.com/BitcoinWalletz/status/2007415225738506524). 

This app is **sourceavailable** and **for verification**.

{% include featureEvidence.html feature="taproot" quote="m/86'/0'/0'/0/X p2tr" source="README" %}

{% include featureEvidence.html feature="segwit" quote="m/84'/0'/0'/0/X p2wpkh" source="README" %}

{% include featureEvidence.html feature="hd" quote="follows BIP44 HD standards or official chain specifications, including support for Bitcoin Taproot, Native SegWit, SegWit, and Legacy addresses" source="App Description" %}

{% include featureEvidence.html feature="foss" quote="Licensed under the MIT." source="GitHub README" %}

An issue has been opened at [https://github.com/cosmostation/cosmostation-android/issues/729](https://github.com/cosmostation/cosmostation-android/issues/729)
