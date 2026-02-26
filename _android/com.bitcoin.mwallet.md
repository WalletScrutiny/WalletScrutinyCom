---
wsId: mwallet
title: 'Bitcoin.com Wallet: Buy, Sell'
altTitle: Bitcoin Wallet by Bitcoin.com
authors:
- leo
- danny
users: 10000000
appId: com.bitcoin.mwallet
appCountry: 
released: 2017-06-19
updated: 2026-02-17
version: 9.10.3
reviews: 4001
website: https://www.bitcoin.com
repository: https://github.com/Bitcoin-com/Wallet
issue: https://github.com/Bitcoin-com/Wallet/issues/39
icon: com.bitcoin.mwallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: []
date: 2024-07-15
signer: 
twitter: bitcoincom
social:
- https://www.facebook.com/buy.bitcoin.news
- https://www.reddit.com/r/btc
redirect_from:
- /com.bitcoin.mwallet/
- /posts/com.bitcoin.mwallet/
developerName: Bitcoin.com Developer
builds: 
features:
- batching
- hd
- multiAccount
- multiSig

---

According to
[the words of its owner on 2020-04-12](https://www.reddit.com/r/btc/comments/g04ece/bitcoincom_wallet_app_is_still_closed_source/fn7rlvy/)
this wallet is closed source until further notice. There is no indication that this will be changing, and the repository's updates ended at the 5.4-hotfix. We assume it is still supposed to be non-custodial but without source code, this is **not verifiable**.

{% include featureEvidence.html feature="hd" quote="BIP32 Hierarchical deterministic (HD) address generation and wallet backups" source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple wallet creation and management in-app" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Intuitive, multisignature security for personal or shared wallets" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="Easy spending proposal flow for shared wallets and group payments" source="GitHub README" %}