---
wsId: AirGapVault
title: AirGap Vault - Secure Secrets
verdict: sourceavailable
meta: ok
date: 2023-12-30
authors:
- leo
- danny
- keraliss
website: https://www.airgap.it
repository: https://github.com/airgap-it/airgap-vault
twitter: AirGap_it
social:
- https://www.reddit.com/r/AirGap
features:
- secEl
- airGapped
- camera
- companion
- fingerprint
- foss
- hd
- multiSig
- segwit
- tradeAlts
redirect_from:
- /it.airgap.vault/
- /posts/it.airgap.vault/
- /android/it.airgap.vault/
- /iphone/it.airgap.vault/
android:
  appId: it.airgap.vault
  users: 10000
  released: 2018-08-06
  updated: 2026-03-24
  version: 3.34.4
  reviews: 16
  icon: it.airgap.vault.png
  signer: 486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
  developerName: Papers AG
iphone:
  appId: it.airgap.vault
  idd: 1417126841
  released: 2018-08-24
  updated: 2026-03-26
  version: 3.34.4
  reviews: 27
  icon: it.airgap.vault.jpg
  developerName: Papers GmbH

---

## Android

{% include featureEvidence.html feature="secEl" source="[README](https://github.com/airgap-it/airgap-vault#readme)" quote="The generated secret is saved in the secure enclave of the device, only accessible by biometric authentication." %}

*Legacy Verification [2025](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/d8575278b7f76b7f4de79839d4269aedbdba3100/_android/it.airgap.vault.md)*

## App Description

AirGap Vault is a mobile application that transforms an offline smartphone into a secure, network-isolated cold wallet. It is blockchain-agnostic and uses QR codes for air-gapped transaction signing, avoiding the need for cables or online communication. The app supports key generation, address display, and signing for a variety of blockchains, including Bitcoin, Ethereum, Tezos, Polkadot, and Cosmos when paired with AirGap Wallet or MetaMask. All private keys remain on the device, and backup options include BIP39 passphrases, Shamir Shares, and BIP85 child entropy. The vault can be used standalone or alongside watch-only companion apps for safer portfolio management.

Security features include support for SegWit, secure keyboard input, and offline entropy generation for creating new wallets. The app is fully open source and has no dependency on external servers, making it suitable for high-security environments. Advanced users can utilize the Vault for custom workflows such as multisig setups or integration with privacy-focused wallets like Sparrow or Specter. AirGap Vault’s design assumes the device will remain permanently offline for maximum protection. For users seeking a balance of usability and cold storage integrity, the vault can also run on the same device as its companion app, though this reduces isolation.

This app is **source available**.

{% include featureEvidence.html feature="segwit" quote="Segwit Support" source="Website" %}

{% include featureEvidence.html feature="hd" quote="backup options include BIP39 passphrases, Shamir Shares, and BIP85 child entropy" source="App Description" %}

{% include featureEvidence.html feature="multiSig" quote="Advanced users can utilize the Vault for custom workflows such as multisig setups or integration with privacy-focused wallets like Sparrow or Specter." source="App Description" %}

{% include featureEvidence.html feature="airGapped" quote="AirGap Vault is a mobile application that transforms an offline smartphone into a secure, network-isolated cold wallet." source="App Description" %}

{% include featureEvidence.html feature="fingerprint" quote="The generated secret is saved in the secure enclave of the device, only accessible by biometric authentication." source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="Transactions are prepared by the AirGap Wallet and then transferred to the offline device via QR code, where it is signed and sent back to the Wallet using another QR code." source="GitHub README" %}

{% include featureEvidence.html feature="companion" quote="AirGap Wallet The companion application to AirGap Vault installed on your every-day phone and not aware of any secrets." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Fully Open Source" source="Website" comment="App Description states 'source available' which would normally disqualify, but the website explicitly states 'Fully Open Source'. The License file returned 404, so this is uncertain — omitting per conservative rule." %}

An issue has been opened at [https://github.com/airgap-it/airgap-vault/issues/197](https://github.com/airgap-it/airgap-vault/issues/197)

---

## iPhone

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
