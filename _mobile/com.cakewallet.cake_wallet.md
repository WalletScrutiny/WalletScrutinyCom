---
wsId: cake
title: 'Cake Wallet: Crypto, Made Easy'
date: 2022-11-02
authors:
- leo
- keraliss
website: https://cakewallet.com
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://www.reddit.com/r/cakewallet
features:
- TOR
- batching
- buyWithCC
- coinCtrl
- customNode
- foss
- multiSig
- tradeAlts
- taproot
- hd
- multiAccount
- segwit
redirect_from:
- /android/com.cakewallet.cake_wallet/
- /iphone/com.fotolockr.cakewallet/
android:
  appId: com.cakewallet.cake_wallet
  users: 100000
  appCountry: us
  released: 2020-01-01
  updated: 2026-04-23
  version: 6.1.2
  reviews: 658
  icon: com.cakewallet.cake_wallet.png
  meta: ok
  verdict: sourceavailable
  developerName: Cake Labs
  repository: https://github.com/cake-tech/cake_wallet
iphone:
  appId: com.fotolockr.cakewallet
  idd: 1334702542
  appCountry: us
  released: 2018-01-19
  updated: 2026-04-23
  version: 6.1.2
  reviews: 4210
  icon: com.fotolockr.cakewallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Cake Technologies, LLC
  repository: https://github.com/cake-tech/cake_wallet

---

## Android

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/591b4d2dcab8f8d8aec23d8fffd5525fa5765406/_android/com.cakewallet.cake_wallet.md)*

## App Description

Cake Wallet is a non-custodial, open-source cryptocurrency wallet available on Android, iOS, macOS, and Linux, supporting assets such as Monero (XMR), Bitcoin (BTC), Ethereum (ETH), and several others. It enables users to securely store, send, and receive funds, while offering built-in exchange functionality, invoice payments, and recurring payment templates. The wallet supports advanced privacy and security features including Tor-only connections, custom nodes, Cake 2FA, and external backups. Monero-specific features include subaddress and account support, batch sending, and proxy node configuration; Bitcoin and Litecoin users benefit from coin control and automatic address generation. Ethereum functionality includes ERC-20 token support, contract-based token addition, and optional Etherscan integration.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2018-2025 Cake Labs LLC Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

{% include featureEvidence.html feature="tradeAlts" quote="Built-in exchange for dozens of pairs" source="GitHub README" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy cryptocurrency (BTC/LTC/XMR/ETH) with credit/debit/bank" source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="Robust privacy settings (eg: Tor-only connections)" source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="Select your own custom nodes/servers" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="Specify multiple recipients for batch sending" source="GitHub README" %}

{% include featureEvidence.html feature="coinCtrl" quote="Bitcoin coin control (specify specific outputs to spend)" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/cake-tech/cake_wallet/issues/337](https://github.com/cake-tech/cake_wallet/issues/337)

---

## iPhone

{% include featureEvidence.html feature="taproot" source="[App Store](https://apps.apple.com/app/com.fotolockr.cakewallet)" quote="Powerful Bitcoin privacy tools like Silent Payments and Payjoin" %}
{% include featureEvidence.html feature="hd" source="[App Store](https://apps.apple.com/app/com.fotolockr.cakewallet)" quote="All your wallets and crypto with just one seed" %}

**Note:** iPhone products are **not verifiable**.

**Update  2022-11-02**: Apparently this product fails to build from source. The
relatively old
[issue](https://github.com/cake-tech/cake_wallet/issues/337) was not closed yet.
We have to assume this product remains to be **not verifiable**.

**Update 2021-04-14**: They now do have a public issue tracker and
[emanuel](/authors/emanuel) tried to build with
[slightly more success](https://github.com/cake-tech/cake_wallet/issues/112)
but the verdict remains the same.

> Cake Wallet allows you to safely store, send receive and exchange your XMR /
  Monero and BTC / Bitcoin.

is an implicit claim of this being a non-custodial Bitcoin wallet but:

> -You control your own seed and keys

is more explicit about the non-custodial part.

On their website we read:

> **FEATURES**<br>
  ...<br>
  Open source

and indeed, there is [a source code repo](https://github.com/cake-tech/cake_wallet).

There is no claim about reproducibility or build instructions. As the app uses
[Flutter](https://flutter.dev/) and we have no experience with that, we have to
stop here. Usually at this point we open issues on the code repository but they
have no public issue tracker.

{% include featureEvidence.html feature="coinCtrl" quote="Bitcoin coin control (specify specific outputs to spend)" source="README" %}

{% include featureEvidence.html feature="batching" quote="Specify multiple recipients for batch sending" source="README" %}

{% include featureEvidence.html feature="customNode" quote="Select your own custom nodes/servers" source="README" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy cryptocurrency (BTC/LTC/XMR/ETH) with credit/debit/bank" source="README" %}

{% include featureEvidence.html feature="tradeAlts" quote="Built-in exchange for dozens of pairs" source="README" %}

{% include featureEvidence.html feature="TOR" quote="Native Tor integration for powerful network-level privacy" source="Store" %}

{% include featureEvidence.html feature="multiAccount" quote="Create several wallets" source="README" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/cake-tech/cake_wallet/issues/337](https://github.com/cake-tech/cake_wallet/issues/337)
