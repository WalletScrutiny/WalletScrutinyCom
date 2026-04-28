---
wsId: kleverK5FinanceCrypto
title: 'Klever Wallet: Crypto,DeFi,BTC'
altTitle: 
authors:
- danny
users: 100000
appId: finance.klever.bitcoin.wallet
alternativeStores: 
appCountry: 
released: 2023-01-16
updated: 2026-04-20
version: 5.45.6
reviews: 202
website: https://klever.io
repository: 
icon: finance.klever.bitcoin.wallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-24
signer: 
twitter: klever_io
social:
- https://discord.gg/klever-io#deadLink
- https://www.instagram.com/klever.io
- https://www.facebook.com/klever.io
redirect_from: 
developerName: 'Klever Wallet: BTC, ETH, TRX, KLV, SOL, and More'
builds: 
features:
- hd
- multiAccount
- segwit
- tradeAlts

---

From the same developer of the apps:

- {% include walletLink.html wallet='android/cash.klever.blockchain.wallet' verdict='true' %}
- {% include walletLink.html wallet='iphone/cash.klever.blockchain.wallet' verdict='true' %}

## Update 2024-07-24

Although klever has an extensive organization page on GitHub, its Android repository for the app on Google Play remains elusive. We [posted on X](https://x.com/dannybuntu/status/1816028969239785717) to ask them but for now, we'll retain the **not source-available** verdict.

## App Description from Google Play 2023-07-11

> Klever Wallet is everything you need in a crypto wallet. Using our crypto wallet app, you have access to over 17 Blockchain networks and can store coins, tokens, and crypto assets such as Bitcoin (BTC), TRON (TRX), Ethereum (ETH), Klever (KLV), Binance Coin (BNB), Tether (USDT) and other top crypto assets safely and anonymously.
>
> Klever Wallet is built on Klever OS, which completely protects the user's private keys and makes sensitive data available only on the user's specific device using the latest state-of-the-art encryption technology.

## Analysis

- The first thing we did was to choose the option, 'Create Wallet'.
- We then assigned a 6-digit pin.
- We were provided with a 12-word mnemonic phrase.
- The app supports multiple cryptocurrencies, among them, BTC.
- We were provided with a Bech32 BTC address.
- There are no claims regarding source-availability and [0 results](https://github.com/search?q=finance.klever.bitcoin.wallet&type=code) when searching GitHub code for the app ID.
- This app is **not source-available**.

{% include featureEvidence.html feature="segwit" quote="We were provided with a Bech32 BTC address." source="App Description from Google Play 2023-07-11 / Analysis" %}

{% include featureEvidence.html feature="hd" quote="We then assigned a 6-digit pin. We were provided with a 12-word mnemonic phrase." source="Analysis" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple Accounts Manage unlimited accounts effortlessly. Buy, sell, stake and transact with ease." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Fast Swaps Swap across multiple blockchains, fast, secure & no KYC hassles." source="Website" %}