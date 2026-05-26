---
wsId: metamask
title: 'MetaMask: Trade Crypto'
verdict: sourceavailable
meta: ok
date: 2025-12-16
authors:
- leo
- danny
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
redirect_from:
- /android/io.metamask/
- /iphone/io.metamask.MetaMask/
android:
  appId: io.metamask
  users: 10000000
  released: 2020-09-01
  updated: 2026-05-22
  version: 7.77.0
  reviews: 6633
  icon: io.metamask.png
  website: https://support.metamask.io/
  developerName: MetaMask Web3 Wallet
  repository: https://github.com/MetaMask/metamask-mobile
iphone:
  appId: io.metamask.MetaMask
  idd: 1438144202
  released: 2020-09-03
  updated: 2026-05-18
  version: 7.77.0
  reviews: 74967
  icon: io.metamask.MetaMask.jpg
  website: https://metamask.io/
  developerName: MetaMask

---

## Android

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

{% include copyFromAndroid.html %}
