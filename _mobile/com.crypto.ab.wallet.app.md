---
wsId: aliceBobWallet
title: 'Crypto Wallet: Buy Bitcoin BTC'
date: 2024-09-04
authors:
- danny
website: https://alicebob.com/
twitter: alicebob_wallet
features:
- buyWithCC
- hd
- tradeAlts
redirect_from:
- /android/com.crypto.ab.wallet.app/
- /iphone/com.ab.crypto.wallet.app/
android:
  appId: com.crypto.ab.wallet.app
  users: 100000
  appCountry: us
  released: 2023-09-27
  updated: 2026-02-17
  version: 1.20.0
  reviews: 235
  icon: com.crypto.ab.wallet.app.png
  meta: ok
  verdict: nosource
  developerName: AliceBob – Secure Crypto Wallet
iphone:
  appId: com.ab.crypto.wallet.app
  idd: '6467197622'
  appCountry: us
  released: 2023-12-05
  updated: 2026-08-11
  version: 1.21.0
  reviews: 206
  icon: com.ab.crypto.wallet.app.jpg
  meta: ok
  verdict: nosource
  developerName: Alicebob LLC

---

## Android

## App Description 

As of 2024-09-04, the Android app {{ page.title }} is currently not available. This may be temporary so we posted on [X.com to ask them.](https://x.com/dannybuntu/status/1831289975968804938)

We will base our analysis on the information found on the [iPhone app page.](https://apps.apple.com/us/app/alicebob-wallet-send-bitcoin/id6467197622?mt=8)

- Supports Bitcoin and other cryptocurrencies
- Claims to be self-custodial

> ... you retain complete control over your private keys. AliceBob Wallet is a self-custodial wallet that adheres to industry standards such as OWASP MASVS. We implement advanced cryptographic methods including BIP32, BIP39, and BIP44 to protect your digital assets like Bitcoin (BTC) and Ethereum (ETH) from security risks.

From the [terms:](https://alicebob.com/terms-of-use/)

> 2.2. Our software enables you to create, generate and store Digital Assets addresses, transaction requests, and encrypted private keys by gathering information on your Digital Assets transactions from the ledgers of different blockchain networks.

## Analysis 

There are no claims regarding this app's source availability.

Assuming all their other claims are true, we could not locate the Android app's [app ID in GitHub](https://github.com/search?q=%22com.crypto.ab.wallet.app%22&type=code). 

This app's **source is not available**, and thus the app is **nonverifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="We implement advanced cryptographic methods including BIP32, BIP39, and BIP44 to protect your digital assets like Bitcoin (BTC) and Ethereum (ETH) from security risks." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Exchange and manage over 1,000 cryptocurrencies with AliceBob Wallet. You can buy Bitcoin and trade it for popular options like Ethereum, Binance Coin (BNB), Cardano, Dogecoin, Monero, and many others." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Choose from trusted fiat providers like MoonPay, Banxa, Simplex, and Wert to purchase crypto using credit cards, bank transfers, or other methods." source="Store description" %}
