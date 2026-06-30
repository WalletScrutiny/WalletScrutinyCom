---
wsId: xverse
title: 'Xverse Wallet: Buy Bitcoin'
date: 2022-01-13
authors:
- danny
website: https://www.xverse.app/
twitter: secretkeylabs
features:
- buyWithCC
- fingerprint
- multiSig
- nfc
- segwit
- taproot
- tradeAlts
redirect_from:
- /android/com.secretkeylabs.xverse/
- /iphone/com.secretkeylabs.xverse/
android:
  appId: com.secretkeylabs.xverse
  users: 100000
  appCountry: cn
  released: 2021-10-12
  updated: 2026-06-23
  version: 2.5.0
  reviews: 1104
  icon: com.secretkeylabs.xverse.png
  meta: ok
  verdict: nosource
  developerName: Secret Key Labs
iphone:
  appId: com.secretkeylabs.xverse
  idd: 1552272513
  appCountry: gt
  released: 2021-10-15
  updated: 2026-06-23
  version: v2.5.0
  reviews: 1
  icon: com.secretkeylabs.xverse.jpg
  meta: ok
  verdict: nosource
  developerName: Secret Key Labs

---

## Android

## Update 2024-07-17

We did not find any change regarding the source-availability for this app. A search for the app ID ["com.secretekeylabs.xverse" on GitHub](https://github.com/search?q=%22com.secretkeylabs.xverse%22&type=code), did not point to a relevant Android app repository. Despite their claims of being an Open Source Android wallet, only the xverse-core library is available for scrutiny.

## Review 2022-01-13

> Send & receive Stacks (STX), Bitcoin (BTC) and all tokens built on Stacks. Xverse wallet is a mobile wallet for the Stacks blockchain.

## Verdict

After installing the app, we created a 6-digit pin code. We were also provided with a 12-word mnemonic phrase. 

Backing up the wallet is also possible. However, once we loaded the app, the Bitcoin wallet can't seem to load from the interface. 

Judging from the Google Play pictures, there should be a BTC wallet. 

We could **not find any information indicating whether the project is open source.**

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="Compra, Guarda y Haz Trading, Simplemente: Rastrea, haz trading y genera ganancias sin esfuerzo con Bitcoin (BTC)" source="Store" comment="Insufficient — store description does not explicitly mention SegWit or bech32 addresses." %}

{% include featureEvidence.html feature="taproot" quote="Ordinals, Runes, BRC-20s" source="Store" comment="Ordinals and Runes require Taproot (P2TR) addresses, implying Taproot send/receive support." %}

{% include featureEvidence.html feature="fingerprint" quote="autenticación biométrica" source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="Intercambia instantáneamente activos nativos de Bitcoin como Runes y Ordinals. Transfiere tokens sin problemas desde Solana, Ethereum, Base y otras cadenas EVM directamente a Bitcoin (BTC) con nuestra aplicación web de Swap." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Deposita o compra fácilmente Bitcoin (BTC), Stacks (STX), Spark y Starknet (STRK)." source="Store" %}

{% include featureEvidence.html feature="multiSig" comment="(no justification provided by LLM)" %}

{% include featureEvidence.html feature="nfc" comment="(no justification provided by LLM)" %}
