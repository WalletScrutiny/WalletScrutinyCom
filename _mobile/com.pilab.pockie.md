---
wsId: pockieWallet
title: Pockie Wallet - Crypto Wallet
date: 2025-11-26
authors:
- danny
website: https://www.pockie.io/
twitter: Pockie_io
features:
- fingerprint
- hd
- segwit
- multiAccount
redirect_from:
- /android/com.pilab.pockie/
- /iphone/com.pilab.pockie/
android:
  appId: com.pilab.pockie
  users: 10000
  released: 2023-07-24
  updated: 2025-08-06
  version: 1.4.10
  reviews: 57
  icon: com.pilab.pockie.png
  meta: ok
  verdict: nosource
  developerName: PiLab Technology
iphone:
  appId: com.pilab.pockie
  idd: '6448715234'
  appCountry: us
  released: 2023-08-02
  updated: 2025-08-11
  version: 1.4.10
  reviews: 10
  icon: com.pilab.pockie.jpg
  meta: ok
  verdict: nosource
  developerName: PiLab Co.,Ltd

---

## Android

## App Description

Pockie is a non-custodial cryptocurrency wallet developed by PiLab Technology that supports multiple EVM-compatible blockchains including Bifrost, Ethereum, BNB Chain, Avalanche, Polygon, Klaytn, Base, and Arbitrum. The app allows users to manage tokens and NFTs across these networks, with features including DApp connectivity, on-chain activity tracking, and wallet security through PIN or biometric authentication. 

According to their website, users control their own recovery phrases and private keys. The wallet provides a simplified interface designed for both beginners and experienced users, with automatic display of native tokens from supported networks and manual token addition capabilities.

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/1993609718217273471) the app and can confirm Bitcoin support. We were also provided with the 12-word seed phrase and [successfully imported this into Electrum](https://x.com/BitcoinWalletz/status/1993610225899974666). The address provided by the app matches: `bc1qrmydzhn9p0uwes36nf0slyj3ka7y94j773j7nh`

We then searched for claims regarding source-availability but did not find any. We also searched for its play id in GitHub Code but[did not find any relevant results](https://github.com/search?q=%22com.pilab.pockie%22&type=code).

This app is **not source-available**.

{% include featureEvidence.html feature="hd" quote="We were also provided with the 12-word seed phrase and successfully imported this into Electrum. The address provided by the app matches: bc1qrmydzhn9p0uwes36nf0slyj3ka7y94j773j7nh" source="App Description" comment="12-word BIP39 mnemonic confirmed recoverable in Electrum, a competing wallet correctly implementing BIP standards." %}

{% include featureEvidence.html feature="segwit" quote="The address provided by the app matches: bc1qrmydzhn9p0uwes36nf0slyj3ka7y94j773j7nh" source="App Description" comment="bc1q address is a native SegWit (bech32) address, confirming SegWit receive support. Send to SegWit implied by wallet generating such addresses." %}

{% include featureEvidence.html feature="fingerprint" quote="wallet security through PIN or biometric authentication" source="App Description" comment="Biometric authentication explicitly mentioned, which includes fingerprint." %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Use your PIN or biometrics to unlock your wallet." source="Store" %}

{% include featureEvidence.html feature="hd" quote="How should I store my recovery phrase and private key? Do not share your recovery phrase and private key with anyone! Make sure to store them in a safe place and remember that smart phones or emails can be hacked." source="Website" comment="Recovery phrase (mnemonic) backup is mentioned, indicating HD wallet structure per BIP39." %}

{% include featureEvidence.html feature="multiAccount" quote="When importing a wallet using a recovery phrase, Pockie imports the main account. Please use private keys to import additional accounts under the same recovery phrase." source="Website" %}
