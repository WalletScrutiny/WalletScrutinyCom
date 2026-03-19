---
title: BitPay
appId: bitpay
authors:
- danny
released: 2014-03-15
discontinued: 
updated: 2022-07-29
version: 12.12.2
binaries: 
provider: 
providerWebsite: 
website: https://bitpay.com/
repository: https://github.com/bitpay/wallet
icon: bitpay.png
bugbounty: 
meta: obsolete
verdict: sourceavailable
date: 2026-01-20
twitter: BitPay
social:
- https://www.linkedin.com/company/bitpay-inc-
builds: 
features:
- segwit
- hd
- multiSig
- multiAccount
- customNode
- foss

---

{% include featureEvidence.html feature="segwit" source="[README](https://github.com/bitpay/wallet#readme)" quote="Segwit and native segwit addresses (BECH32) for sending and receiving" %}
{% include featureEvidence.html feature="hd" source="[README](https://github.com/bitpay/wallet#readme)" quote="BIP32 Hierarchical deterministic (HD) address generation and wallet backups" %}
{% include featureEvidence.html feature="multiSig" source="[README](https://github.com/bitpay/wallet#readme)" quote="Intuitive, multisignature capabilities for personal or shared wallets" %}
{% include featureEvidence.html feature="multiAccount" source="[README](https://github.com/bitpay/wallet#readme)" quote="Multiple wallet creation (BTC, BCH and ETH) and management in-app" %}
{% include featureEvidence.html feature="customNode" source="[README](https://github.com/bitpay/wallet#readme)" quote="Switching between BWS instances is very simple and can be done with a click from within Bitpay Wallet." %}
{% include featureEvidence.html feature="foss" source="[README](https://github.com/bitpay/wallet#readme)" quote="MIT License" %}

## App Description

BitPay is a payment services company, and its desktop wallet app provides a branded wallet experience for managing and spending supported crypto assets. The desktop client was distributed for major desktop platforms and connects to the BitPay Wallet ecosystem.

## Analysis

The source code is published at https://github.com/bitpay/wallet, so the project is source-available. The last tagged release is [v12.12.2](https://github.com/bitpay/wallet/releases/tag/v12.12.2), and there have been no newer desktop releases since July 29, 2022. Given the age of the last release, treat the desktop wallet as **obsolete**.
