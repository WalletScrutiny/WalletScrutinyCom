---
wsId: metamask
title: 'MetaMask: Trade Crypto'
date: 2025-12-16
authors:
- leo
- danny
website: https://support.metamask.io
twitter: MetaMask
social:
- https://discord.com/invite/consensys
- https://www.instagram.com/metamask.io
- https://www.reddit.com/r/Metamask
- https://www.tiktok.com/@metamask
- https://www.youtube.com/@metamask
features:
- tradeAlts
- buyWithCC
- screenReader
redirect_from:
- /android/io.metamask/
- /iphone/io.metamask.MetaMask/
android:
  appId: io.metamask
  users: 10000000
  appCountry: us
  released: 2020-09-01
  updated: 2026-09-29
  version: 8.12.0
  reviews: 6755
  icon: io.metamask.webp
  alternativeStores:
  - zapstore
  meta: ok
  verdict: sourceavailable
  developerName: MetaMask Web3 Wallet
  repository: https://github.com/MetaMask/metamask-mobile
iphone:
  appId: io.metamask.MetaMask
  idd: 1438144202
  appCountry: us
  released: 2020-09-03
  updated: 2026-09-29
  version: 8.13.0
  reviews: 76477
  icon: io.metamask.MetaMask.webp
  meta: ok
  verdict: sourceavailable
  developerName: MetaMask
  repository: https://github.com/MetaMask/metamask-mobile

---

## Android

{% include featureEvidence.html feature="screenReader" comment="Code scan of the public source (2026-10-23): 513 accessibility labels on buttons and icons, 55 decorative images hidden from screen readers, and 46 places where it adapts to a running screen reader. Not yet tested hands-on." source="[MetaMask/metamask-mobile](https://github.com/MetaMask/metamask-mobile)" %}

## App Description

MetaMask is an Android self-custodial cryptocurrency wallet primarily designed for Ethereum and other EVM-compatible networks, allowing users to manage private keys locally and interact with decentralized applications.

The app supports token storage, swaps, NFTs, and DeFi access across multiple blockchains, and is widely used as a general-purpose Web3 wallet.

Historically, MetaMask focused on Ethereum-based assets and did not support native Bitcoin, instead relying on wrapped representations such as wBTC.

As announced [today](https://x.com/MetaMask/status/2000614577575428200), MetaMask has added native Bitcoin (BTC) support, enabling users to hold and transact BTC directly within the wallet as part of its expanding multi-chain architecture.

## Analysis

Testing confirms the wallet is self-custodial and [supports Bitcoin](https://x.com/BitcoinWalletz/status/2000748931660329160).  

This app is **now ready for verification**.

---

## iPhone

{% include featureEvidence.html feature="tradeAlts" source="[Website](https://metamask.io/)" quote="Swaps Safely exchange any token" %}
{% include featureEvidence.html feature="buyWithCC" source="[Website](https://metamask.io/)" quote="Buy Turn cash to crypto" %}

{% include featureEvidence.html feature="screenReader" comment="Code scan of the public source (2026-10-23): 513 accessibility labels on buttons and icons, 55 decorative images hidden from screen readers, and 46 places where it adapts to a running screen reader. Not yet tested hands-on." source="[MetaMask/metamask-mobile](https://github.com/MetaMask/metamask-mobile)" %}

{% include copyFromAndroid.html %}
