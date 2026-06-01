---
title: P.CASH
date: 2024-09-12
authors:
- danny
website: https://p.cash/
repository: https://github.com/piratecash/pcash-wallet-android
twitter: PirateCash_NET
social:
- https://www.facebook.com/PirateCash
- https://discord.com/invite/cbTdqxx
- https://bitcointalk.org/index.php?topic=5050988
- https://www.reddit.com/r/PirateCash
- https://t.me/PirateCash_ENG
features:
- hd
- tradeAlts
- secEl
- companion
- foss
redirect_from:
- /android/cash.p.terminal/
android:
  appId: cash.p.terminal
  users: 10000
  appCountry: us
  released: 2023-02-10
  updated: 2026-06-01
  version: 0.56.0
  icon: cash.p.terminal.png
  alternativeStores:
  - fdroid
  meta: ok
  verdict: sourceavailable
  developerName: PirateCash and Cosanta foundation

---

{% include featureEvidence.html feature="hd" source="Review" quote="A 12-word mnemonic phrase is provided during startup." %}
{% include featureEvidence.html feature="tradeAlts" source="[Play Store](https://play.google.com/store/apps/details?id=cash.p.terminal)" quote="Includes built-in onchain DEX, institutional-grade analytics for crypto and NFT markets" %}
{% include featureEvidence.html feature="secEl" source="[Play Store](https://play.google.com/store/apps/details?id=cash.p.terminal)" quote="private keys are securely generated and stored directly on the card, never exposed or saved anywhere" %}
{% include featureEvidence.html feature="companion" source="[Play Store](https://play.google.com/store/apps/details?id=cash.p.terminal)" quote="Now with Tangem hardware wallet support — private keys are securely generated and stored directly on the card" %}

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/a2fa561f891da1fe0fb8c09ab1e30df74b0807fb/_android/cash.p.terminal.md)*

## Update 2024-07-03

After updating the script, we found that this app is now [source-available](https://github.com/piratecash/pcash-wallet-android). This app is now **for verification**. 

We see from their repository that:

> This branch is 1599 commits ahead of, 1556 commits behind {% include walletLink.html wallet='android/io.horizontalsystems.bankwallet' verdict='true' %}

## App Description from Google Play

A powerful non-custodial multi-wallet for PirateCash, Cosanta, Bitcoin, Ethereum, Binance Smart Chain, Avalanche, Solana and other blockchains. Non-custodial crypto and NFT storage, onchain decentralized exchange, institutional grade analytics for cryptcurrency and NFT markets, extensive privacy controls and human oriented design.

## Analysis 

- A BTC wallet is available
- A 12-word mnemonic phrase is provided during startup. 
- We've verified their claim that this app is non-custodial. 
- The provider does not make any claims regarding source-availability
- A [search on GitHub](https://github.com/search?q=cash.p.terminal&type=code) for the app ID does not show any results.

{% include featureEvidence.html feature="foss" quote="Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="License" %}
