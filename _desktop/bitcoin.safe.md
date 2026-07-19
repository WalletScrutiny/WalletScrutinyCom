---
title: Bitcoin-Safe Desktop
appId: bitcoin.safe
bitcoinOrgId: bitcoinsafe
authors:
- danny
released: 2025-02-20
discontinued: 
updated: 2026-06-29
version: 2.0.0
binaries: https://github.com/andreasgriffin/bitcoin-safe/releases
provider: Andreas Griffin
providerWebsite: 
website: https://bitcoin-safe.org
repository: https://github.com/andreasgriffin/bitcoin-safe
icon: bitcoin.safe.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-01
twitter: BitcoinSafeOrg
social: https://www.youtube.com/@BitcoinSafeOrg
community: https://substr.network/s/bitcoin-safe
translations: https://hosted.weblate.org/engage/bitcoin-safe/
builds:
- arch: x86_64-linux
  types:
    appimage:
    - Bitcoin-Safe-*-x86_64.AppImage.tar.gz
    deb:
    - Bitcoin-Safe-*-x86_64.deb
- arch: x86_64-windows
  types:
    portable:
    - Bitcoin-Safe-*-portable.exe
    setup:
    - Bitcoin-Safe-*-setup.exe
features:
- batching
- bip158spv
- camera
- coinCtrl
- companion
- customNode
- foss
- multiSig

---

## App Description

This desktop app supports Bitcoin and has Linux, macOS and Windows variants. It supports a myriad of hardware signing devices and enforces hardware only seeds. Supported devices include: Coldcard, Coldcard Q, Bitbox02, Blockstream Jade, Trezor, Foundation Passport, Keystone, Ledger, Specter DIY, using QR, USB, and SD-card.

It features multi-signature support. Once the user is finished setting/pairing the hardware devices, the user can then send/receive through the interface of the program.

It has multiple languages and a user-friendly step-by-step wizard. 

The distinction between a companion app and a wallet requires a bit of nuance in this case. On one hand, seed generation and private key storage does not occur within the program, a hardware device is specifically required to do so. We may think that this qualifies the program as "merely" a companion app, but we cannot ignore the fact that it can generate PSBTs, and can create transactions. 

It is self-custodial, source-available and should be **for verification.**

{% include featureEvidence.html feature="multiSig" quote="Easy Multisig-Wallet Setup" source="GitHub README" %}

{% include featureEvidence.html feature="bip158spv" quote="Compact Block Filters with transaction notifications" source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="You can specify your own (personal) server for both in &quot;Network settings&quot;." source="GitHub README" %}

{% include featureEvidence.html feature="coinCtrl" quote="Automatic coin selection within categories" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="CSV import for batch transactions" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="This program is free software: you can redistribute it and/or modify it under the terms of version 3 of the GNU General Public License as published by the Free Software Foundation." source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="QR codes (enhanced QR code detection for Laptop cameras)" source="GitHub README" %}

{% include featureEvidence.html feature="companion" quote="All wallets require hardware signers/wallets for safe seed storage" source="GitHub README" %}
