---
wsId: beginApp
title: 'Begin: Bitcoin Cardano Solana'
verdict: nosource
meta: ok
date: 2025-04-22
authors:
- danny
website: https://begin.is
twitter: BeginWallet
features:
- foss
- fingerprint
- hd
- multiAccount
- tradeAlts
redirect_from:
- /android/is.begin.app/
- /iphone/is.begin.app/
android:
  appId: is.begin.app
  users: 5000
  released: 2022-10-30
  updated: 2026-05-07
  version: 2.6.1
  reviews: 3
  icon: is.begin.app.png
  developerName: Begin W
  repository: https://github.com/BeginWallet/begin-core
iphone:
  appId: is.begin.app
  idd: '1642488837'
  appCountry: us
  released: 2022-11-03
  updated: 2026-05-07
  version: 2.6.1
  reviews: 12
  icon: is.begin.app.jpg
  developerName: Begin W UG

---

## Android

## App description from Google Play

> Begin Wallet is a non-custodial cryptocurrency wallet for Bitcoin and Cardano assets. It supports key management on-device with password-encrypted private keys, and enables users to send, receive, and stake ADA, interact with dApps, and manage NFTs. The app includes contact-based transactions and a QR-based receive method. No user registration or personal data collection is required.

The app has its source partially available on Github, with only the SDK available. This app is **not fully source available**.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2021 B58 Finance Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" comment="The SDK is published under MIT License with no Commons Clause or commercial-use restrictions. However, the Google Play description notes only the SDK is available and the app is not fully source available. The SDK itself qualifies as FOSS under MIT, but this applies only to the partial SDK component, not the full wallet app." %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="foss" quote="Is the wallet open-source? Yes — the entire core of Begin is open-source. Developers and users can audit the code anytime." source="Website" %}

{% include featureEvidence.html feature="hd" quote="Begin supports both chains under a single recovery phrase and UI." source="Website" %}

{% include featureEvidence.html feature="multiAccount" quote="Manage all of your assets and wallets in one place" source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="Integration with BTC, ADA Handle, Jupiter Swap" source="Store" %}

{% include featureEvidence.html feature="fingerprint" quote="Your private keys never leave your device and are encrypted with your password." source="Store" %}
