---
wsId: dfxBTCTaroWallet
title: DFX BTC Taro Wallet
date: 2026-01-03
authors:
- danny
website: https://dfx.swiss/
twitter: DFX_Swiss
social:
- https://www.linkedin.com/company/dfxswiss
features:
- ln
- ownLN
- multiSig
- foss
- hd
- segwit
redirect_from:
- /android/swiss.dfx.bitcoin/
- /iphone/swiss.dfx.bitcoin/
android:
  appId: swiss.dfx.bitcoin
  users: 1000
  appCountry: us
  released: 2023-09-25
  updated: 2025-07-23
  version: 2.0.3
  icon: swiss.dfx.bitcoin.png
  meta: ok
  verdict: sourceavailable
  developerName: DFX AG
  repository: https://github.com/DFXswiss/btc-wallet
iphone:
  appId: swiss.dfx.bitcoin
  idd: '6466037617'
  appCountry: jp
  released: 2023-10-03
  updated: 2025-07-24
  version: 2.0.3
  reviews: 0
  icon: swiss.dfx.bitcoin.jpg
  meta: ok
  verdict: sourceavailable
  developerName: DFX AG
  repository: https://github.com/DFXswiss/btc-wallet

---

## Android

{% include featureEvidence.html feature="ln" source="[README](https://github.com/DFXswiss/btc-wallet#readme)" quote="Lightning Network supported" %}
{% include featureEvidence.html feature="ownLN" source="Review" quote="connect to an external Lightning service (e.g., DFX.swiss or lightning.space) and manage Lightning funds through provider-issued credentials" %}
{% include featureEvidence.html feature="multiSig" source="[Website](https://dfx.swiss/)" quote="Eine self-custody Bitcoin-Wallet mit Lightning und Multisig Feature – für Unternehmen und private Nutzer" %}

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

{% include featureEvidence.html feature="foss" quote="LICENSE MIT" source="GitHub README" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

{% include featureEvidence.html feature="hd" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/DFXswiss/btc-wallet/issues/167](https://github.com/DFXswiss/btc-wallet/issues/167)

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Lightning Network supported" source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="SegWit-first. Replace-By-Fee support" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="LICENSE MIT" source="GitHub README" %}

An issue has been opened at [https://github.com/DFXswiss/btc-wallet/issues/167](https://github.com/DFXswiss/btc-wallet/issues/167)
