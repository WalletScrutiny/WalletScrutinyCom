---
wsId: mpcvaultMultisig
title: MPCVault - Multisig Wallet
date: 2025-11-20
authors:
- danny
website: https://mpcvault.com/
twitter: mpcvault
social:
- https://www.linkedin.com/company/mpcvault
features:
- batching
- multiAccount
- multiSig
redirect_from:
- /android/com.mpcvault.mobileapp.android/
- /iphone/com.mpcvault.mobileapp.ios/
android:
  appId: com.mpcvault.mobileapp.android
  users: 5000
  appCountry: us
  released: 2022-09-13
  updated: 2026-06-23
  version: 3.18.0
  reviews: 3
  icon: com.mpcvault.mobileapp.android.png
  meta: ok
  verdict: custodial
  developerName: MetaLoop Inc
iphone:
  appId: com.mpcvault.mobileapp.ios
  idd: '1622756458'
  appCountry: us
  released: 2022-09-13
  updated: 2026-06-08
  version: 1.139.2
  reviews: 135
  icon: com.mpcvault.mobileapp.ios.jpg
  meta: ok
  verdict: custodial
  developerName: MetaLoop Inc

---

## Android

## App Description

MPCVault is a multi-chain, multi-asset wallet with multi-signature capabilities developed by MetaLoop Inc. The wallet supports multiple blockchains including Bitcoin.

According to the company's user agreement, **"MPCVault does not take custody of Virtual Currency"** and **"does not have total independent control over funds at a user's wallet"**. Users are responsible for storing backups of their wallet addresses and private key pairs.

The wallet's source code is not publicly available. The company maintains a GitHub organization (github.com/mpcvault) with API documentation but no mobile application source code.

## Analysis

MPCVault operates a 3-of-3 multi-party computation (MPC) architecture where the user holds one key share and MPCVault holds two key shares, requiring all three shares for transaction signing. Regular users cannot export their key shares or achieve independent custody; the 12-word "personal key certificate" provided during setup is used for app authentication and cannot recover funds independently. [Source](https://docs.mpcvault.com/techoverview#deadLink)

Only business and enterprise customers on annual plans can [request a key share backup](https://docs.mpcvault.com/sharesexport#deadLink) that provides **"a copy of all your wallet's private keys and have full control over your funds"**.

From the [technical overview](https://docs.mpcvault.com/techoverview#deadLink):

> MPCVault operates with three rotating key shares: User holds 1 key share, MPCVault holds 2 key shares (stored in different cloud environments with encrypted backups worldwide). All three key shares are required for signing.

According to WalletScrutiny's custodial verdict criteria, products that "claim to be non-custodial but feature custodial accounts without very clearly marking those as custodial are also considered 'custodial' as a whole". Regular MPCVault users cannot achieve self-custody as they cannot export their keys or spend funds independently without MPCVault's cooperation, meeting the definition of custodial despite the company's claims of being "non-custodial".

[Video of our testing](https://x.com/BitcoinWalletz/status/1991342692748652743). The 12 words were not called seed phrases, but *"personal key certificates"*. The Bitcoin wallet address that the app provided to us was `3CmMZyfdc3LBLsQcM1NqzE6vQFLC8Fm6it`. We tried to import the 12-words to Electrum, but the addresses did not match. 



**Conclusion**: While MPCVault markets itself as non-custodial and enterprise users can eventually export keys, the default experience for regular users is functionally **custodial** - they cannot spend or recover funds without the provider's cooperation.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiSig" quote="Supports creating multiple independent wallets for different use cases and multisig transaction policies." source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Supports creating multiple independent wallets for different use cases and multisig transaction policies." source="Store description" %}

{% include featureEvidence.html feature="batching" quote="Allows batch sending assets to multiple addresses simultaneously." source="Store description" %}
