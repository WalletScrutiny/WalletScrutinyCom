---
wsId: mwallet
title: 'Bitcoin.com Wallet: Buy, Sell'
date: 2021-05-20
authors:
- leo
- danny
website: https://www.bitcoin.com
twitter: bitcoincom
social:
- https://www.facebook.com/buy.bitcoin.news
- https://www.reddit.com/r/btc
features:
- batching
- hd
- multiAccount
- multiSig
- buyWithCC
- fingerprint
- tradeAlts
redirect_from:
- /com.bitcoin.mwallet/
- /posts/com.bitcoin.mwallet/
- /android/com.bitcoin.mwallet/
- /iphone/com.bitcoin.mwallet/
android:
  appId: com.bitcoin.mwallet
  altTitle: Bitcoin Wallet by Bitcoin.com
  users: 10000000
  appCountry: us
  released: 2017-06-19
  updated: 2026-05-31
  version: 9.23.5
  reviews: 4137
  icon: com.bitcoin.mwallet.png
  meta: ok
  verdict: nosource
  developerName: Bitcoin.com Developer
  repository: https://github.com/Bitcoin-com/Wallet
iphone:
  appId: com.bitcoin.mwallet
  idd: '1252903728'
  appCountry: us
  released: 2017-07-11
  updated: 2026-05-28
  version: 9.23.1
  reviews: 43702
  icon: com.bitcoin.mwallet.jpg
  meta: ok
  verdict: nosource
  developerName: Bitcoin.com
  repository: https://github.com/Bitcoin-com/Wallet

---

## Android

According to
[the words of its owner on 2020-04-12](https://www.reddit.com/r/btc/comments/g04ece/bitcoincom_wallet_app_is_still_closed_source/fn7rlvy/)
this wallet is closed source until further notice. There is no indication that this will be changing, and the repository's updates ended at the 5.4-hotfix. We assume it is still supposed to be non-custodial but without source code, this is **not verifiable**.

{% include featureEvidence.html feature="hd" quote="BIP32 Hierarchical deterministic (HD) address generation and wallet backups" source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple wallet creation and management in-app" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Intuitive, multisignature security for personal or shared wallets" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="Easy spending proposal flow for shared wallets and group payments" source="GitHub README" %}

An issue has been opened at [https://github.com/Bitcoin-com/Wallet/issues/39](https://github.com/Bitcoin-com/Wallet/issues/39)

---

## iPhone

According to
[the words of its owner on 2020-04-12](https://www.reddit.com/r/btc/comments/g04ece/bitcoincom_wallet_app_is_still_closed_source/fn7rlvy/)
this wallet is closed source until further notice. There was no indication of a
change by 2020-05-20. We assume it is still
supposed to be non-custodial but without source code, this is **not verifiable**.

{% include featureEvidence.html feature="fingerprint" quote="Protect your wallet with fingerprint, Face ID, or PIN." source="Store description" %}

{% include featureEvidence.html feature="multiSig" quote="MULTISIG WALLETS FOR TEAMS & FAMILIES Create multi-signature wallets for shared access. Ideal for DAOs, family savings, business treasuries, and joint accounts." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Buy, sell, send, receive, and swap major cryptocurrencies: Bitcoin (BTC), Bitcoin Cash (BCH), Ethereum (ETH), Avalanche (AVAX), Polygon (MATIC), BNB Smart Chain (BNB), ZANO, fUSD, and select ERC-20 tokens." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Pay with credit card, Google Pay and more." source="Store description" %}
