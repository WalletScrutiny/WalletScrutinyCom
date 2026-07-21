---
wsId: ggpWallet
title: GGP Wallet
date: 2025-11-18
authors:
- danny
website: https://ggp.gg/
twitter: ggp_wallet
features:
- buyWithCC
- fingerprint
- hd
- nfc
- tradeAlts
- multiAccount
redirect_from:
- /android/com.ggp__wallet/
- /iphone/wallet.ggp/
android:
  appId: com.ggp__wallet
  users: 5000
  appCountry: us
  released: 2024-06-05
  updated: 2026-06-09
  version: 1.5.9
  reviews: 16
  icon: com.ggp__wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Planet 9 Group Corporation
iphone:
  appId: wallet.ggp
  idd: '6692627990'
  appCountry: us
  released: 2024-11-10
  updated: 2026-06-11
  version: 1.5.6
  reviews: 10
  icon: wallet.ggp.jpg
  meta: ok
  verdict: nosource
  developerName: Planet 9 Corp.

---

## Android

## App Description

GGP Wallet is a cryptocurrency management application that supports over 300 cryptocurrencies including Bitcoin, Ethereum, and USDT across multiple blockchain networks (ERC-20, BEP-20, TRC-20, Solana, Polygon). The application integrates six fiat on-ramp services (MoonPay, Simplex, Banxa) for purchasing cryptocurrency with Visa, Mastercard, or local payment methods, and includes DEX and CEX aggregators for trading across 10,000+ trading pairs. The application claims to be self-custodial with private keys encrypted and stored on the user's device, and states it uses "trusted open-source technology."

## Analysis

The application description repeatedly claims self-custody with statements such as "only you have access to your private keys, and they never leave your device" and "Your private keys remain encrypted on your device". 

The developers also claim the platform uses "trusted open-source technology for a transparent, reliable platform." 

However, **no source code** repository was found in [searches](https://github.com/search?q=%22com.ggp__wallet.%22&type=code) for "GGP Wallet github", "GGP Wallet source code", or the package name "com.ggp__wallet".

The reference to "open-source technology" appears to describe the underlying libraries or frameworks used in development, not the publication of GGP Wallet's own source code. Without access to source code, the claims about private key management, encryption implementation, and self-custody model cannot be independently verified or audited. Users must trust the developer's assertions about security and key management without the ability to review the implementation.

[Video of the App](https://x.com/BitcoinWalletz/status/1990665418554683624) would show that we were able to import the seed phrases to the Electrum desktop app.

This app is **not source-available**.

{% include featureEvidence.html feature="fingerprint" quote="Protect Your Funds with Passcode and Biometric Security Features." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Streamline Cryptocurrency Purchases via Credit Card, Payment App, or Bank Account." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Effortlessly Switch Between Cryptocurrencies." source="Website" %}

{% include featureEvidence.html feature="hd" quote="Video of the App would show that we were able to import the seed phrases to the Electrum desktop app." source="Analysis" %}

{% include featureEvidence.html feature="nfc" comment="(no justification provided by LLM)" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="buyWithCC" quote="Purchase crypto with Visa, Mastercard, or local payment providers. GGP Wallet integrates six fiat on-ramp services (MoonPay, Simplex, Banxa, and more), supporting multiple currencies, including USD, EUR, GBP, and others." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="Access DEX and CEX aggregators with over 10,000 trading pairs, ensuring you always get the best exchange rates." source="Store" %}

{% include featureEvidence.html feature="multiAccount" quote="Create multiple wallets and addresses." source="Store" %}

{% include featureEvidence.html feature="fingerprint" quote="Protect Your Funds with Passcode and Biometric Security Features." source="Website" %}
