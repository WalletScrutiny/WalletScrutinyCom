---
wsId: kleverK5FinanceCrypto
title: 'Klever Wallet: Crypto,DeFi,BTC'
date: 2023-07-11
authors:
- danny
website: https://klever.io
twitter: klever_io
social:
- https://discord.gg/klever-io#deadLink
- https://www.instagram.com/klever.io
- https://www.facebook.com/klever.io
features:
- hd
- multiAccount
- segwit
- tradeAlts
- buyWithCC
- fingerprint
- ln
redirect_from:
- /android/finance.klever.bitcoin.wallet/
- /iphone/finance.klever.bitcoin.wallet/
android:
  appId: finance.klever.bitcoin.wallet
  users: 100000
  appCountry: us
  released: 2023-01-16
  updated: 2026-06-18
  version: 5.48.6
  reviews: 203
  icon: finance.klever.bitcoin.wallet.png
  meta: ok
  verdict: nosource
  developerName: 'Klever Wallet: BTC, ETH, TRX, KLV, SOL, and More'
iphone:
  appId: finance.klever.bitcoin.wallet
  idd: '1615064243'
  appCountry: us
  released: 2023-01-25
  updated: 2026-06-15
  version: 5.9.7
  reviews: 1109
  icon: finance.klever.bitcoin.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Klever Exchange

---

## Android

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

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Bitcoin Lightning Wallet for Payments Pay in seconds with Bitcoin Lightning. Klever Wallet lets you use BTC with low fees, making it the ideal Bitcoin Lightning wallet for micropayments and transfers." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap your BTC for USDT, ETH, SOL, TRX, and other tokens - all while keeping full self-custody." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Purchase Bitcoin, Ethereum, Solana, TRX, XRP, USDT, and more with credit/debit cards, Apple Pay, Google Pay, or bank transfer." source="Store description" %}

{% include featureEvidence.html feature="hd" quote="Use your same 12 or 24 words from the multichain wallet with an optimized interface, dedicated tools, and a clear Bitcoin-only balance view" source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple Accounts Manage unlimited accounts effortlessly. Buy, sell, stake and transact with ease." source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Klever encrypts and stores private keys locally, never on servers. During setup, you get a 24-word recovery phrase for backup and can create an additional encrypted file for protection." source="Store description" comment="Omitted — not explicitly evidenced as fingerprint auth" %}
