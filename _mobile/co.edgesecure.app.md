---
wsId: edge
title: Edge - Bitcoin & Crypto Wallet
bitcoinOrgId: edgewallet
date: 2026-10-30
authors:
- leo
- emanuel
- danny
- keraliss
website: https://edge.app
twitter: edgewallet
social:
- https://www.linkedin.com/company/edgeapp
- https://www.reddit.com/r/EdgeWallet
features:
- foss
- tradeAlts
- hd
redirect_from:
- /edge/
- /co.edgesecure.app/
- /posts/2019/11/edge/
- /posts/co.edgesecure.app/
- /android/co.edgesecure.app/
- /iphone/co.edgesecure.app/
android:
  appId: co.edgesecure.app
  users: 500000
  appCountry: us
  released: 2018-03-01
  updated: 2026-10-01
  version: 4.51.3
  reviews: 767
  icon: co.edgesecure.app.webp
  signer: 8cd6a12e3dc595964fabcbe82341e28f4a2a4ac6a347fcbead488b76faa7e186
  alternativeStores:
  - zapstore
  meta: ok
  verdict: sourceavailable
  developerName: Edge (formerly Airbitz)
  repository: https://github.com/EdgeApp/edge-react-gui
iphone:
  appId: co.edgesecure.app
  idd: '1344400091'
  appCountry: us
  released: 2018-02-09
  updated: 2026-10-02
  version: 4.51.3
  reviews: 3317
  icon: co.edgesecure.app.webp
  meta: ok
  verdict: sourceavailable
  developerName: Airbitz Inc
  repository: https://github.com/EdgeApp/edge-react-gui

---

## Android

**Update 2026-10-30:** Edge is still listed and updated. The [edge-react-gui repository](https://github.com/EdgeApp/edge-react-gui) is still public under the BSD 3-Clause license and received commits today; its tags include v4.51.3, the version on Google Play, and v4.52.1. Our [issue about verifying the Play build](https://github.com/EdgeApp/edge-react-gui/issues/1748) is still open, so the verdict stays {% include verdictBadge.html verdict="sourceavailable" type='short' %}.

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/dc62509a628bf691951d673ce74ec124cc6d442e/_android/co.edgesecure.app.md)*

## Edge – Technical Overview

Edge is a non-custodial, open-source mobile wallet supporting over 120 cryptocurrencies including Bitcoin, Ethereum, Monero, Solana, and Avalanche. It employs a zero-knowledge architecture where private keys, transaction data, and user credentials are never accessible to Edge or third parties. The wallet uses hierarchical deterministic (HD) address generation, ensuring a new address is used for each transaction to enhance privacy. Edge also includes built-in exchange functionality, allowing users to swap supported assets directly within the app. Its decentralized server model ensures full wallet functionality even during backend outages.

{% include featureEvidence.html feature="foss" quote="BSD 3-Clause License Copyright (c) 2017, Airbitz Inc (dba Edge) All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:" source="GitHub README" %}

{% include featureEvidence.html feature="tradeAlts" quote="Edge also includes built-in exchange functionality, allowing users to swap supported assets directly within the app." source="Edge – Technical Overview" %}

An issue has been opened at [https://github.com/EdgeApp/edge-react-gui/issues/1748](https://github.com/EdgeApp/edge-react-gui/issues/1748)

---

## iPhone

**Update 2026-10-30:** The iPhone app is still listed, at version 4.51.3, built from the same repository. As usual for iPhone apps we cannot verify the build, and the verdict stays {% include verdictBadge.html verdict="sourceavailable" type='short' %}.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="Hierarchical Deterministic (HD) Wallets – Automatically changes addresses per transaction for additional security and privacy" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Built-in Crypto Exchange – Instantly swap Bitcoin, Ethereum, Litecoin, Monero, and other cryptocurrencies" source="Store description" %}

{% include featureEvidence.html feature="foss" quote="open source" source="GitHub README" %}
