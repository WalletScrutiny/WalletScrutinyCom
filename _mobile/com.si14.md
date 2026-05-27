---
wsId: sil4Crypto
title: Si14 Crypto Wallet
verdict: nosource
date: 2025-12-08
authors:
- danny
website: https://si14cw.com
features:
- buyWithCC
- customNode
- fingerprint
- hd
- tradeAlts
- foss
redirect_from:
- /android/com.si14/
- /iphone/com.si14wallet/
android:
  appId: com.si14
  users: 1000
  released: 2025-05-05
  updated: 2025-10-09
  version: 1.2.5
  icon: com.si14.png
  meta: ok
  developerName: Si14 Bank
iphone:
  appId: com.si14wallet
  idd: '6748298980'
  appCountry: ru
  released: 2025-09-24
  updated: 2025-10-13
  version: 1.2.5
  reviews: 3
  icon: com.si14wallet.jpg
  meta: ok
  developerName: Si14 AG

---

## Android

## App Description

Si14 is a multi-chain cryptocurrency wallet supporting networks such as Ethereum, BNB Smart Chain, Polygon, Arbitrum, Optimism, and Tron, and uses a model in which users pay transaction fees in USDT rather than in the native gas token. 

The app claims to store private keys locally with AES-256 encryption and provides optional biometric authentication, PIN-based two-factor confirmation, and hardware-wallet connectivity via Ledger and Trezor. 


## Analysis

Our [tests](https://x.com/BitcoinWalletz/status/1997992477983486128) reveal that the private keys can be exported into a third-party desktop Bitcoin app like Electrum and match the BTC address.

While the Play Store listing states that the code is “open-source and audited”, no source repository link is provided in the Play Store metadata, their GitHub organization [does not show any relevant Android repository](https://github.com/si14studios) and [no verifiable open-source repository](https://github.com/search?q=%22com.si14%22&type=code) for the app ID is associated with the app.

**This app is not source available**.

{% include featureEvidence.html feature="hd" quote="Import 12/24-word seed phrases (BIP-39)." source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Device protection: biometrics & PIN; encrypted key vault tied to OS keystore (where supported)." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Fiat on-ramp Top up with cards and bank transfers through trusted third-party providers." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Smart swaps Best-rate routing via integrated DEX and aggregators. Slippage controls, gas insights, and on-chain transparency." source="Website" %}

{% include featureEvidence.html feature="customNode" quote="Pro tools Custom RPCs, nonce & gas editing, raw transaction preview, testnet toggles, and signing simulation." source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Biometric ID and PIN-based 2FA" source="Store" %}

{% include featureEvidence.html feature="foss" quote="Open-source code audited by independent experts" source="Store" %}
