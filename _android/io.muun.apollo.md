---
wsId: muun
title: 'Muun: Bitcoin Lightning Wallet'
altTitle: 
authors:
- leo
- mohammad
- keraliss
users: 500000
appId: io.muun.apollo
appCountry: 
released: 2017-04-25
updated: 2026-03-26
version: '55.6'
reviews: 229
website: https://muun.com
repository: https://github.com/muun/apollo
icon: io.muun.apollo.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 9c743af9930e7eca39581e70ec9213489e572dc93fe33d3a90bc95b00825a4dc
date: 2025-02-24
signer: 026ae0ac859cc32adf2d4e7aa909daf902f40db0b4fe6138358026fd62836ad1
twitter: MuunWallet
social: 
redirect_from:
- /io.muun.apollo/
- /posts/io.muun.apollo/
developerName: muun
builds: 
features:
- ln
- multiSig
- segwit
- taproot

---

*Legacy verification [2024](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/a85123512755a021e4003644854d39d60facf7f6/_android/io.muun.apollo.md)*

## App Description

Muun is a self-custodial Bitcoin and Lightning Network wallet for Android, featuring a 2-of-2 multi-signature model that enhances security by storing only one key on the device and providing the other in an exportable Emergency Kit. It supports both on-chain and Lightning payments from a unified interface with dynamic fee estimation based on mempool conditions. The wallet includes Bech32 address support, taproot compatibility, and fee selection options. Recovery is possible using either a written code or email and password, but it does not support standard 12/24-word seed phrases. Muun’s architecture ensures that users retain full control over their funds, with no server-side custody or data access.

This app is **source available**.

{% include featureEvidence.html feature="segwit" quote="The wallet includes Bech32 address support, taproot compatibility, and fee selection options." source="App Description" %}

{% include featureEvidence.html feature="taproot" quote="The wallet includes Bech32 address support, taproot compatibility, and fee selection options." source="App Description" %}

{% include featureEvidence.html feature="multiSig" quote="Muun is a self-custodial Bitcoin and Lightning Network wallet for Android, featuring a 2-of-2 multi-signature model that enhances security by storing only one key on the device and providing the other in an exportable Emergency Kit." source="App Description" %}

An issue has been opened at [https://github.com/muun/apollo/issues/54](https://github.com/muun/apollo/issues/54)
