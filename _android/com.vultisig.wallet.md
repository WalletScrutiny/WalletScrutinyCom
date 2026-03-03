---
wsId: vultisig
title: 'Vultisig: Seedless Wallet'
altTitle: 
authors:
- danny
users: 10000
appId: com.vultisig.wallet
appCountry: 
released: 2024-07-01
updated: 2026-03-03
version: 1.0.96
reviews: 9
website: https://vultisig.com
repository: 
issue: 
icon: com.vultisig.wallet.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-12-26
signer: 
twitter: vultisig
social:
- https://discord.com/invite/54wEtGYxuv
- https://t.me/vultisig
- https://www.instagram.com/vultisig
redirect_from: 
developerName: Vulti Holdings Ltd.
builds: 
features:
- foss
- multiSig
- tradeAlts

---

## App Description

Vultisig Wallet is an Android cryptocurrency wallet that advertises a seedless design using Threshold Signature Scheme (TSS) to split signing authority across multiple devices instead of relying on a single recovery phrase.

The app explicitly lists Bitcoin support, alongside Ethereum, Solana, and other blockchains, according to its Google Play description.

Vultisig emphasizes multi-device access and threshold-based transaction signing rather than traditional single-key storage.

## Analysis

Our [testing](https://x.com/BitcoinWalletz/status/2004371037581201749/photo/1) reveals there are two modes for setting up the app. The first option is 'fast', which uses only 2 of 2 shares which connects to the Vultisig server and emails one of the shares to an assigned email. The other share is on the Android device held by the user. The other setup is the more secure vultisig vault which allows the user to store the shares on different devices. 

Because the fast mode relies on provider-mediated key share handling and the documentation does not demonstrate that Vultisig is cryptographically incapable of participating in signing or recovery, the app cannot be classified as self-custodial under WalletScrutiny criteria. The seed phrases were also not provided. 

Our verdict is **custodial**.

{% include featureEvidence.html feature="multiSig" quote="The first multi-chain, multi-asset, multi-signature wallet in the world for everyone." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="You can deposit, send, swap and more inside Vultisig." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Open-Source Audited" source="Website" %}