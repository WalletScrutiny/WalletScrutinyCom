---
wsId: tastyCrypto
title: 'tastycrypto: Crypto Wallet'
date: 2025-12-16
authors:
- danny
website: https://www.tastycrypto.com/
twitter: tastycrypto
social:
- https://discord.com/invite/Np9hzS2QTj
- https://www.youtube.com/channel/UCgGyrBOeDZHYphAHf-Fvnkw
- https://www.instagram.com/tastycrypto
- https://www.facebook.com/tastycrypto
- https://www.tiktok.com/@thetastycrypto
features:
- buyWithCC
- hd
- tradeAlts
redirect_from:
- /android/com.tastycrypto/
- /iphone/com.tastycrypto/
android:
  appId: com.tastycrypto
  users: 1000
  released: 2023-05-02
  updated: 2025-03-12
  version: 0.4.1
  reviews: 9
  icon: com.tastycrypto.png
  meta: removed
  verdict: nosource
  developerName: tastycrypto
iphone:
  appId: com.tastycrypto
  idd: '1670102186'
  appCountry: us
  released: 2023-04-29
  updated: 2025-10-22
  version: 0.4.26
  reviews: 20
  icon: com.tastycrypto.jpg
  meta: ok
  verdict: nosource
  developerName: Tasty

---

## Android

## App Description

tastycrypto is an Android self-custodial cryptocurrency wallet developed by IG Group and tastytrade that allows users to hold and manage crypto assets without the provider controlling private keys.

According to its Google Play listing, the wallet supports Bitcoin (BTC), Ethereum (ETH), and Polygon (MATIC) networks, and allows users to import an existing seed phrase, buy crypto in-app, or transfer funds from tastytrade.

The app claims to include features such as token swaps, NFT viewing, WalletConnect support for interacting with decentralized applications, and basic portfolio and network fee tracking.

## Analysis

The Play Store description states that users retain full control of their seed phrase and assets, with swaps and Web3 interactions executed directly from the wallet rather than through a custodial account.

We [tested](https://x.com/BitcoinWalletz/status/2000811191548199352) this and verified that claim. The seed phrases were successfully imported into Electrum Desktop 4.6.2 using BIP39. The bitcoin addresses matched. 

No claims regarding source availability has been made. A search on GitHub Code using the app ID [did not show relevant results regarding the app's repository](https://github.com/search?q=%22com.tastycrypto%22&type=code).

{% include featureEvidence.html feature="hd" quote="The seed phrases were successfully imported into Electrum Desktop 4.6.2 using BIP39. The bitcoin addresses matched." source="App Description" %}

{% include featureEvidence.html feature="tradeAlts" quote="The app claims to include features such as token swaps, NFT viewing, WalletConnect support for interacting with decentralized applications, and basic portfolio and network fee tracking." source="App Description" %}

{% include featureEvidence.html feature="buyWithCC" quote="allows users to hold and manage crypto assets without the provider controlling private keys. According to its Google Play listing, the wallet supports Bitcoin (BTC), Ethereum (ETH), and Polygon (MATIC) networks, and allows users to import an existing seed phrase, buy crypto in-app, or transfer funds from tastytrade." source="App Description" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap: Access over 1000+ tokens for in-app trading." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy crypto in-app, transfer crypto from tastytrade, or import a seed phrase" source="Store description" %}
