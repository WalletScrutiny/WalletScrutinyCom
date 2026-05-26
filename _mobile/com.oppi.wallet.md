---
wsId: oppiWallet
title: 'Oppi: Crypto Wallet & Card'
verdict: nosource
meta: ok
date: 2025-11-20
authors:
- danny
twitter: walletoppi
features:
- buyWithCC
- fingerprint
- hd
- segwit
- tradeAlts
redirect_from:
- /android/com.oppi.wallet/
- /iphone/com.oppi.wallet/
android:
  appId: com.oppi.wallet
  users: 10000
  released: 2024-05-13
  updated: 2026-05-25
  version: 1.0.112
  reviews: 9
  icon: com.oppi.wallet.png
  website: https://oppiwallet.com/en
  developerName: Encoin Limited
iphone:
  appId: com.oppi.wallet
  idd: '6502544148'
  appCountry: us
  released: 2024-08-12
  updated: 2026-05-15
  version: 1.0.111
  reviews: 16
  icon: com.oppi.wallet.jpg
  developerName: Encoin Limited

---

## Android

## App Description

Oppi Wallet (from Encoin Limited) pitches itself in the Play Store as a self‑custody wallet where “you control your private keys and your funds”, yet still layers in a fiat on/off ramp so users can buy, sell, swap, and store Bitcoin, Ethereum, stablecoins, and other supported tokens from one interface while tracking balances across multiple blockchains. 

The marketing site (`https://oppiwallet.com/en`) emphasizes its VASP certification, global availability (English/Turkish UI), biometric/MFA security, and claims of compliance. 

## Analysis

We [tested the app](https://x.com/BitcoinWalletz/status/1991480289051439126) and was able to access a Bitcoin wallet and the corresponding seed phrases. We imported the seed phrases onto Electrum desktop mobile and [successfully matched the address](https://x.com/BitcoinWalletz/status/1991481170073456918):
`bc1qpr0w9w9ems5lxkvwxyxm03uqkh4u7ppjynhjqc`.  

There were no claims regarding source-availability and a [search for the app ID](https://github.com/search?q=%22com.oppi.wallet%22&type=code) in GitHub Code **did not yield any relevant repository** corresponding to the source code of the app.

{% include featureEvidence.html feature="hd" quote="We imported the seed phrases onto Electrum desktop mobile and successfully matched the address: bc1qpr0w9w9ems5lxkvwxyxm03uqkh4u7ppjynhjqc" source="Analysis" %}

{% include featureEvidence.html feature="segwit" quote="successfully matched the address: bc1qpr0w9w9ems5lxkvwxyxm03uqkh4u7ppjynhjqc" source="Analysis" %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap your cryptocurrencies on-the-go with the best prices on the market. Experience seamless high-speed swaps and enjoy the most popular coins on the market." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy & Sell Instantly" source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Protect your holdings with bank-grade encryption, biometric access, and VASP-compliant protocols guaranteeing security levels other wallets can only dream of." source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}
