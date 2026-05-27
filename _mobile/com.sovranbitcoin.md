---
title: Sovran
verdict: ecash
date: 2025-11-03
authors:
- danny
website: https://sovran.money
repository: https://github.com/SovranBitcoin/Sovran
twitter: SovranBitcoin
features:
- cashu
- fingerprint
- foss
- hd
- ln
- multiAccount
- multiSig
- nfc
appCountry: in
redirect_from:
- /iphone/com.sovranbitcoin/
iphone:
  appId: com.sovranbitcoin
  idd: '6499554529'
  released: 2025-06-07
  updated: 2026-04-08
  version: 0.0.62
  reviews: 0
  icon: com.sovranbitcoin.jpg
  meta: ok
  developerName: Sovran LTD

---

## App Description 

Sovran is an open-source Chaumian eCash and Lightning wallet built for Bitcoin users.  
It implements the [Cashu protocol](https://github.com/cashubtc/cashu) to issue and redeem blind-signed bearer tokens through mints, enabling off-chain Bitcoin transfers that preserve user privacy.  

The wallet also supports [Lightning Network payments](https://github.com/SovranBitcoin/Sovran) and integrates [Nostr](https://github.com/nostr-protocol/nostr) for contact and messaging features.  

Its source code is available on GitHub at [github.com/SovranBitcoin/Sovran](https://github.com/SovranBitcoin/Sovran).

## Analysis

Sovran qualifies as **ecash** because it uses the Cashu Chaumian eCash protocol, where users transact with mint-issued bearer tokens rather than controlling on-chain Bitcoin keys.

{% include featureEvidence.html feature="cashu" quote="Send and receive Bitcoin via Cashu ecash tokens" source="GitHub README" %}

{% include featureEvidence.html feature="ln" quote="Lightning Network payments and invoices" source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="Multi-account support with swipeable account pager" source="GitHub README" %}

{% include featureEvidence.html feature="hd" quote="BIP-39 / BIP-32 — Hierarchical deterministic wallets" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="NFC tap payments — scan NFC tags to pay Lightning invoices or receive ecash" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="Mozilla Public License Version 2.0" source="GitHub README" %}

{% include featureEvidence.html feature="fingerprint" quote="helper/secureStorage.ts — secure storage helper with biometric support" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" comment="(no justification provided by LLM)" %}
