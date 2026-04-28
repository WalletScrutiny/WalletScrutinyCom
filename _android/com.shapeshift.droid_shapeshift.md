---
wsId: ShapeShift
title: 'ShapeShift: Crypto Platform'
altTitle: 
authors:
- leo
- danny
users: 500000
appId: com.shapeshift.droid_shapeshift
alternativeStores: 
appCountry: 
released: 2015-10-26
updated: 2026-02-16
version: 3.7.1
reviews: 511
website: https://ShapeShift.com
repository: https://github.com/shapeshift/mobile-app
icon: com.shapeshift.droid_shapeshift.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2025-07-28
signer: 
twitter: ShapeShift
social:
- https://www.facebook.com/ShapeShiftPlatform
- https://www.instagram.com/shapeshift_io
- https://www.youtube.com/channel/UCrZ2Ml63kLwZJ6amqoGaZeQ
- https://t.me/shapeshiftofficial
redirect_from:
- /com.shapeshift.droid_shapeshift/
developerName: ShapeShift.com
builds: 
features:
- buyWithCC
- foss
- multiSig
- tradeAlts

---

## App Description 

ShapeShift is a non-custodial, open-source crypto platform that enables users to buy, sell, trade, and manage over 10,000 digital assets across 14 supported chains. It offers integration with 170+ external wallets and supports self-custody by design, meaning private keys are never stored or accessed by the platform. Users can execute trades directly without relying on centralized exchanges, and fiat on/off-ramps are available via credit/debit cards and bank transfers in over 160 countries. The platform includes wallet creation, asset tracking, and support for both novice and advanced DeFi users. Governed by a DAO since its corporate dissolution, ShapeShift continues to evolve as a community-owned tool for decentralized asset management.

This app is **source available**

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests/758)*

## Update 2024-07-15

An [announcement](https://shapeshift.com/newsroom/shapeshift-releases-new-and-improved-mobile-app-and-migrates-legacy-users) was made on October 19, 2022 regarding ShapeShift's app:

> “In addition to the numerous improvements and new features, the new mobile app is fully open-source and the only backend is blockchain data一which we are actively working to decentralize with FOXChain. ShapeShift DAO is dedicated to building the best interface to the decentralized universe, and with new wallets, chains, and protocols being added each week, the vision is coming together. However, for this vision to fully come to fruition, the interface can’t just exist on the web; it must be available on mobile too.” - Willy Ogorzaly

- We confirmed the app has a Bitcoin wallet that can send/receive.
- It provided the 12-word seed phrases
- We confirmed the existence of its [GitHub repository](https://github.com/shapeshift/mobile-app) for the mobile app.
- This app is due **for verification**.

## Review 2021-05-23

ShapeShift is best known for their non-custodial exchange but this app appears
to be a wallet:

> **STORE YOUR CRYPTO IN A SECURE WALLET**<br>
  Setup a ShapeShift multi-chain wallet in seconds to store your crypto.

... and non-custodial:

> ShapeShift makes self-custody easy, never holding your coins, so you have
  complete control over your assets.

but is their code public? 

On the [referenced website](https://shapeshift.com/) there is no link back to
the app on App Store or Play Store but there is
[this site](https://shapeshift.com/invite#deadLink) where they suggest having an
invite-only mobile app. When you provide them with your email (Seriously?) they ...
forward you to [this site](https://shapeshift.com/download) where there are
actually download links for both mobile apps.

As we couldn't find any source code we assume the app is closed source and
therefore **not verifiable**.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2022 ShapeShift Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

{% include featureEvidence.html feature="tradeAlts" quote="enables users to buy, sell, trade, and manage over 10,000 digital assets across 14 supported chains" source="App Description" %}

{% include featureEvidence.html feature="buyWithCC" quote="fiat on/off-ramps are available via credit/debit cards and bank transfers in over 160 countries" source="App Description" %}

{% include featureEvidence.html feature="multiSig" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/shapeshift/mobile-app/issues/104](https://github.com/shapeshift/mobile-app/issues/104)
