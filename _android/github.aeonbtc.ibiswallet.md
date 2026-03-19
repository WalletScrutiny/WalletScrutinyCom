---
wsId: 
title: Ibis Wallet
altTitle: 
authors:
- danny
users: 0
appId: github.aeonbtc.ibiswallet
appCountry: 
released: 2026-02-09
updated: 2026-03-06
version: 2.2-beta
reviews: 0
website: 
repository: https://github.com/aeonBTC/IbisWallet
icon: 
bugbounty: 
meta: ok
verdict: fewusers
appHashes: 
date: 2026-03-06
signer: 
twitter: 
social: 
redirect_from: 
developerName: aeonBTC
builds: 
features:
- coinCtrl
- companion
- customNode
- foss
- nfc
- segwit
- TOR

---

## App Description

Ibis Wallet is a self-custody Bitcoin wallet for Android, inspired by Sparrow Wallet and built for mobile. It is built on the Bitcoin Development Kit (BDK) and targets experienced Bitcoin users. The app is not available on Google Play — releases are distributed directly via GitHub with PGP-signed APKs and SHA256 checksums. All releases are currently in beta.

{% include featureEvidence.html feature="foss" quote="MIT License" source="[LICENSE](https://github.com/aeonBTC/IbisWallet/blob/main/LICENSE)" %}

{% include featureEvidence.html feature="TOR" quote="Integrated Tor support without external proxies" source="[README](https://github.com/aeonBTC/IbisWallet#readme)" %}

{% include featureEvidence.html feature="coinCtrl" quote="Coin control with UTXO selection and freezing" source="[README](https://github.com/aeonBTC/IbisWallet#readme)" %}

{% include featureEvidence.html feature="customNode" quote="Connect to your own Electrum server" source="[README](https://github.com/aeonBTC/IbisWallet#readme)" %}

{% include featureEvidence.html feature="companion" quote="Hardware wallet signing via animated QR or PSBT files" source="[README](https://github.com/aeonBTC/IbisWallet#readme)" %}

{% include featureEvidence.html feature="nfc" quote="NFC support — broadcast and receive payment requests via NFC tap" source="[v2.2-beta release notes](https://github.com/aeonBTC/IbisWallet/releases/tag/v2.2-beta)" %}

{% include featureEvidence.html feature="segwit" quote="Watch-only wallet imports (xpub/zpub, descriptors, single addresses)" source="[README](https://github.com/aeonBTC/IbisWallet#readme)" %}

This app is **source available** — the MIT-licensed source is published on GitHub and appears current with the latest release. Reproducibility has not been confirmed; the release APK is built and signed manually by the developer with no CI-based release pipeline.
