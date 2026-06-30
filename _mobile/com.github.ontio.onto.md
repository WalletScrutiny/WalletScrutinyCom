---
wsId: ONTO
title: ONTO Cross-chain Crypto Wallet
date: 2021-09-15
authors:
- danny
website: https://onto.app/
twitter: ONTOWallet
features:
- fingerprint
- tradeAlts
appCountry: us
redirect_from:
- /android/com.github.ontio.onto/
- /iphone/com.ontology.foundation.onto/
android:
  appId: com.github.ontio.onto
  users: 100000
  appCountry: us
  released: 2018-06-27
  updated: 2026-06-26
  version: 4.10.6
  reviews: 128
  icon: com.github.ontio.onto.png
  meta: ok
  verdict: nosource
  developerName: Ontology Foundation Ltd.
  repository: https://github.com/ONTO-Data-Wallet/ONTO#deadLink
iphone:
  appId: com.ontology.foundation.onto
  idd: 1436009823
  appCountry: us
  released: 2018-09-21
  updated: 2026-06-30
  version: 4.10.6
  reviews: 88
  icon: com.ontology.foundation.onto.jpg
  meta: ok
  verdict: nosource
  developerName: Ontology Foundation
  repository: https://github.com/ONTO-Data-Wallet/ONTO#deadLink

---

## Android

## Update 2024-07-15

Nothing new changed with regards to the availability of this app's source code. It is still not available. 

## Review 2021-09-15

The Google Play description: 

> ONTO is the first truly decentralized, cross-chain wallet, allowing users to securely manage their identities, data, and digital assets.

Given that it refers to itself as a **decentralized** wallet, this likely means that it is a **self-custodial** wallet. As our policy is "don't trust, verify" we will still try to verify this.

In the official website's help center, [we find a page on how to export ONT ID Wallet](https://ontology-1.gitbook.io/onto/guides/wallet-management/wallet-backup).

Users may choose to export their 12-word mnemonic phrase. [It is also possible to import and export single-chain wallets](https://ontology-1.gitbook.io/onto/guides/wallet-management/import-export-switch-or-delete-single-chain-wallet#import-single-chain-wallet) provided the users have access to the mnemonic phrases.

We emailed them to verify the location for the source code of their wallet, and they have pointed to the [github](https://github.com/ONTO-Data-Wallet) page at the bottom of their site.

We took a look at ONTO's github page for the source code corresponding to their Google Play appID, but have found no results. The link points to the "ONTO-Data-Wallet". Curiously, at the time of this writing, the page only contained a readme file. 

In the absence of a scrutinizable source code, we would tentatively have to label this as having **no source code**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Native cross-chain bridge & multi-chain exchange Multi-chain integrated swapping with low fees and high efficiency" source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Your private key is generated on your device and cannot be accessed by ONTO. You retain complete control over your assets." source="Website" %}
