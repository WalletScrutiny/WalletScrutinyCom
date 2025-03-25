---
wsId: cryptoQR
title: CryptoQR
altTitle: 
authors:
- danny
users: 1000
appId: za.co.cryptoconvert.bolt
appCountry: 
released: 2022-05-16
updated: 2024-03-27
version: 1.1.86
stars: 
ratings: 
reviews: 
website: https://www.cryptoconvert.co.za/
repository: 
issue: 
icon: za.co.cryptoconvert.bolt.png
bugbounty: 
meta: stale
verdict: nowallet
appHashes: 
date: 2025-03-25
signer: 
reviewArchive: 
twitter: CryptoConverted
social: 
redirect_from: 
developerName: CryptoConvert
features: 

---

## App Description from Google Play

> The CryptoQR app will let you use any compatible lightning wallet to pay at participating retailers, by scanning a QR code at the point of sale.

## Description from the Website

> Accept Crypto without volatility risk, get next-day settlement in Rands, using our simple merchant API, powered by Lightning
>
> CryptoConvert’s QR scanner app that provides interoperability with legacy systems that can not display Lightning Payment QR codes.
>
> Customers can link any standard Bitcoin Lightning wallet, enabling a faster experience, low transaction fees, and the ability to support small payments.

## Analysis

- The first time we opened the app, we were presented with a short list of bitcoin-lightning apps. 
- We selected Wallet of Satoshi, and the Wallet of Satoshi app opened. 
- We were asked to send a payment of 80 sats to the original app. We paid it.
- The next time we opened this app, our phone's camera was initialized to scan a QR code. 
- We are also notified that "This app works best if you have a compatible wallet installed on your phone. This app is compatible with (at least) the following wallets:
  - {% include walletLink.html wallet='android/zapsolutions.strike' verdict='true' %}
  - {% include walletLink.html wallet='android/io.muun.apollo' verdict='true' %}
  - {% include walletLink.html wallet='android/com.livingroomofsatoshi.wallet' verdict='true' %}
  - {% include walletLink.html wallet='android/io.bluewallet.bluewallet' verdict='true' %}
  - {% include walletLink.html wallet='android/fr.acinq.phoenix.mainnet' verdict='true' %}
  - {% include walletLink.html wallet='android/app.zeusln.zeus' verdict='true' %}
  - {% include walletLink.html wallet='android/com.galoyapp' verdict='true' %}
  - {% include walletLink.html wallet='android/com.breez.client' verdict='true' %}
- In the configuration settings, we can select a server:
  - "Production" - (api.circuit.cryptoconvert.co.za)
  - "Staging" - (staging.circuit.cryptoconvert.co.za)
  - "Manual" - (Enter your own address)
  - Reset Settings.

- We did not find settings that allowed for wallet generation or seed phrase provision on the app. 
- It seems to be reliant on third-party apps.
- Thus, we conclude that this app **does not have a bitcoin wallet**.
