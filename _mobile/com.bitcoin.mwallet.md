---
wsId: mwallet
title: 'Bitcoin.com Wallet: Buy, Sell'
verdict: nosource
meta: ok
authors:
- leo
- danny
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
  released: 2017-06-19
  updated: 2026-05-20
  version: 9.21.1
  reviews: 4125
  icon: com.bitcoin.mwallet.png
  date: 2024-07-15
  website: https://www.bitcoin.com
  repository: https://github.com/Bitcoin-com/Wallet
  developerName: Bitcoin.com Developer
iphone:
  appId: com.bitcoin.mwallet
  idd: '1252903728'
  released: 2017-07-11
  updated: 2026-05-13
  version: 9.21.0
  reviews: 43510
  icon: com.bitcoin.mwallet.jpg
  date: 2021-05-20
  website: https://wallet.bitcoin.com/
  developerName: Bitcoin.com

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
