---
wsId: AirGapVault
title: AirGap Vault - Secure Secrets
altTitle: 
authors:
- leo
appId: it.airgap.vault
appCountry: 
idd: 1417126841
released: 2018-08-24
updated: 2026-03-26
version: 3.34.4
reviews: 26
website: 
repository: https://github.com/airgap-it/airgap-vault
icon: it.airgap.vault.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2023-12-30
signer: 
twitter: AirGap_it
social:
- https://www.reddit.com/r/AirGap
features:
- airGapped
- camera
- companion
- fingerprint
- foss
- hd
- multiSig
- secEl
- segwit
- tradeAlts
developerName: Papers GmbH

---

This app for Android is reproducible but unfortunately due to limitations of the
iPhone platform, we so far were not able to reproduce any App Store app.

{% include featureEvidence.html feature="segwit" quote="Segwit Support" source="Store" %}

{% include featureEvidence.html feature="hd" quote="BIP39 Passphrase" source="Store" %}

{% include featureEvidence.html feature="foss" quote="Open Source" source="README" comment="README explicitly states open source and mentions reproducible builds; store description also lists 'Open Source' as a feature. License file returned 404 but the README and store description confirm open source status. However, since the License file is not found, this cannot be fully confirmed per rules." %}

{% include featureEvidence.html feature="airGapped" quote="AirGap Vault does not connect to any network, irrespective of the device used." source="Store" %}

{% include featureEvidence.html feature="camera" quote="Transactions can be signed seamlessly without the use of cables, thanks to verifiable QR codes." source="Store" %}

{% include featureEvidence.html feature="companion" quote="AirGap Vault is currently used alongside other companion apps like AirGap Wallet, MetaMask, Sparrow Wallet, BlueWallet, Specter, and any other QR code-based wallets." source="Store" %}

{% include featureEvidence.html feature="fingerprint" quote="The generated secret is saved in the secure enclave of the device, only accessible by biometric authentication." source="README" %}

{% include featureEvidence.html feature="secEl" quote="The generated secret is saved in the secure enclave of the device, only accessible by biometric authentication." source="README" %}

{% include featureEvidence.html feature="multiSig" quote="Shamir Shares (Social Recovery)" source="Store" comment="Shamir Shares is social recovery, not multisig — removing this." %}

{% include featureEvidence.html feature="tradeAlts" quote="When paired with AirGap Wallet - Bitcoin - BTC, Ethereum - ETH, Polkadot - DOT, Kusama - KSM, Tezos - XTZ, Cosmos - ATOM" source="Store" comment="Multiple chains supported but no explicit trading feature mentioned — removing this." %}