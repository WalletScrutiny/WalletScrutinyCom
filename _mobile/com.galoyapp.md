---
wsId: bitcoinbeach
title: Blink (Bitcoin Wallet)
verdict: custodial
meta: ok
date: 2023-10-20
authors:
- leo
- danny
repository: https://github.com/GaloyMoney/galoy-mobile
twitter: blinkbtc
social:
- https://api.whatsapp.com/send/?phone=50369835117&text&type=phone_number&app_absent=0
- https://t.me/blinkbtc
- https://snort.social/p/community@blink.sv
features:
- foss
- ln
- nfc
redirect_from:
- /android/com.galoyapp/
- /iphone/io.galoy.bitcoinbeach/
android:
  appId: com.galoyapp
  users: 100000
  released: 2020-11-24
  updated: 2025-12-17
  version: 2.4.15
  reviews: 47
  icon: com.galoyapp.png
  website: https://blink.sv/
  developerName: Blink El Salvador S.A. de C.V.
iphone:
  appId: io.galoy.bitcoinbeach
  idd: '1531383905'
  appCountry: ng
  released: 2020-11-11
  updated: 2025-12-17
  version: 2.4.15
  reviews: 68
  icon: io.galoy.bitcoinbeach.jpg
  website: https://www.blink.sv/en/features
  developerName: Blink SA de CV

---

## Android

## Introduction

Note: We have previously examined Blink under its former name, "Bitcoin Beach Wallet." Since then, it has substantially expanded its app's description and website to include additional information.

> Blink (formerly Bitcoin Beach Wallet) is the bitcoin wallet for community building. From beginners to experts and from shoppers to merchants the wallet’s features make it a must have wallet on any phone

It is a custodial wallet with support for the Lightning Network:

- Great for onboarding: Easy to set up and includes educational onboarding making Blink the perfect wallet to recommend to friends, family or anybody newer to Bitcoin. As a custodial wallet, new users don’t (yet) have to have safe seed phrase storage education and skills to be able to use the Lightning Network.

However it is also built on Galoy's open source Bitcoin banking infrastructure:

> - Open source: True to the Bitcoin ethos, Blink is built on Free and Open Source Software (FOSS). The wallet is built on open source Bitcoin banking infrastructure maintained by Galoy.

Additional features:

> - No transaction fee when both sender and receiver use Blink
> - Earn sats and learn about Bitcoin with the in-app quiz
> - Transaction log displays a history of payments
> - Contact list makes it easy to send payments to friends and family
> - Merchant map displays local businesses that accept Lightning payments

It is unavailable in the US.

## The Site

There's [a repository for the official open-source code](https://github.com/GaloyMoney/galoy) with accessible releases and build instructions.

Galoy Inc's official website contains information on this app [here:](https://galoy.io/bitcoin-beach-wallet#deadLink)

> Bitcoin Beach is an initiative designed to create a sustainable Bitcoin economy – utilizing the Lightning Network. The project is based in El Zonte, a town of roughly 3,000 residents on the Pacific Coast of El Salvador.
>
> The Bitcoin Beach Wallet is the first implementation of Galoy software. It was designed as an open source Bitcoin-based community banking solution to meet the needs of the merchants and community members in El Zonte.

## The Verdict

This app is **custodial** and additionally, was created with the specific aim of aiding El Salvadoran local businesses and stores in adopting Bitcoin as a means of currency.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2021 Galoy Inc Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2021 Galoy Inc Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="NFC Payments: Easily receive Bitcoin with NFC technology for fast, real-world transactions." source="Store description" %}
