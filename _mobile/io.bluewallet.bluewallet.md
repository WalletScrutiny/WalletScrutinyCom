---
wsId: bluewallet
title: BlueWallet Bitcoin Wallet
date: 2023-12-30
authors:
- emanuel
- Mohammad Rafigh
- leo
- danny
- keraliss
website: https://bluewallet.io
twitter: bluewalletio
social:
- https://www.reddit.com/r/bluewallet
features:
- hd
- multiAccount
- companion
- batching
- foss
- ln
- multiSig
- ownLN
- segwit
- customNode
- ownFullNode
redirect_from:
- /bluewallet/
- /io.bluewallet.bluewallet/
- /posts/2019/12/bluewallet/
- /posts/io.bluewallet.bluewallet/
- /android/io.bluewallet.bluewallet/
- /iphone/io.bluewallet.bluewallet/
android:
  appId: io.bluewallet.bluewallet
  users: 1000000
  appCountry: us
  released: 2018-11-01
  updated: 2026-06-02
  version: 8.0.0
  reviews: 380
  icon: io.bluewallet.bluewallet.png
  signer: 42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
  meta: ok
  verdict: sourceavailable
  developerName: BlueWallet Services S. R. L.
  repository: https://github.com/bluewallet/bluewallet
iphone:
  appId: io.bluewallet.bluewallet
  idd: 1376878040
  appCountry: us
  released: 2018-05-27
  updated: 2026-06-01
  version: 8.0.0
  reviews: 838
  icon: io.bluewallet.bluewallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Bluewallet Services, S. R. L.
  repository: https://github.com/bluewallet/bluewallet

---

## Android

## App Description

BlueWallet is a React Native Bitcoin and Lightning Network wallet that uses an Electrum backend for on-chain transactions and supports LNDhub for custodial or self-hosted Lightning accounts. It implements HD wallets (BIP44/49/84), multisig vaults via PSBT, and watch-only wallets with hardware wallet integration through the companion app flow. Private keys are stored locally on the device, with optional AES encryption and plausible deniability through multiple wallet storage containers.

## App Analysis

This app is **source-available**.

{% include featureEvidence.html feature="hd" source="[Website](https://bluewallet.io)" quote="Recover on another wallet" %}
{% include featureEvidence.html feature="multiAccount" source="[Website](https://bluewallet.io)" quote="Plausible Deniability Create multiple storages or fake ones in case of a forced disclosure." %}
{% include featureEvidence.html feature="companion" source="[Website](https://bluewallet.io)" quote="Watch-only Wallets Easily connect to your hardware wallet and manage your cold storage." %}

{% include featureEvidence.html feature="segwit" quote="SegWit-first. Replace-By-Fee support" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="## LICENSE MIT" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Vaults The best security available on the Bitcoin protocol. Create wallets with multiple keys." source="Website" %}

{% include featureEvidence.html feature="batching" quote="Transactions control Choose your fees when sending. Easily Bump, Cancel or Batch transactions." source="Website" %}

{% include featureEvidence.html feature="ownLN" quote="LNDhub LNDhub on VPS with Ubuntu LNDHub on Mac OSX LNDhub with raspibolt Recover lndhub account" source="Website" %}

An issue has been opened at [https://github.com/BlueWallet/BlueWallet/issues/6409](https://github.com/BlueWallet/BlueWallet/issues/6409)

---

## iPhone

{% include featureEvidence.html feature="companion" source="[Website](https://bluewallet.io)" quote="Sign a transaction offline" %}

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="SegWit-first. Replace-By-Fee support" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="MIT" source="GitHub README" %}

{% include featureEvidence.html feature="ownFullNode" quote="Connect to your Bitcoin full node through Electrum" source="Store description" %}

{% include featureEvidence.html feature="customNode" quote="Connect to your Bitcoin full node through Electrum" source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Create for free unlimited number of bitcoin wallets or import your existing wallet." source="Store description" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Vaults - The best security available on the Bitcoin protocol. Create wallets with multiple keys." source="Website" %}

{% include featureEvidence.html feature="batching" quote="Transactions control - Choose your fees when sending. Easily Bump, Cancel or Batch transactions." source="Website" %}

{% include featureEvidence.html feature="ownLN" quote="LNDhub" source="Website" %}

An issue has been opened at [https://github.com/BlueWallet/BlueWallet/issues/758](https://github.com/BlueWallet/BlueWallet/issues/758)
