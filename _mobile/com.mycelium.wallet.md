---
wsId: mycelium
title: Mycelium Bitcoin Wallet
date: 2025-03-07
authors:
- leo
- danny
website: https://wallet.mycelium.com
twitter: MyceliumCom
social:
- https://www.linkedin.com/company/mycelium
- https://www.facebook.com/myceliumcom
- https://www.reddit.com/r/mycelium
features:
- tradeAlts
- TOR
- hd
- multiAccount
- nfc
- segwit
- coinCtrl
- customNode
- fingerprint
redirect_from:
- /mycelium/
- /com.mycelium.wallet/
- /posts/2019/11/mycelium/
- /posts/com.mycelium.wallet/
- /android/com.mycelium.wallet/
- /iphone/com.mycelium.wallet-ios/
android:
  appId: com.mycelium.wallet
  users: 1000000
  appCountry: us
  released: 2013-07-01
  updated: 2026-05-15
  version: 3.22.0.2
  reviews: 1154
  icon: com.mycelium.wallet.jpg
  signer: b8e59d4a60b65290efb2716319e50b94e298d7a72c76c2119eb7d8d3afac302e
  meta: ok
  verdict: sourceavailable
  developerName: Mycelium Developers
  repository: https://github.com/mycelium-com/wallet-android
  bitcoinOrgId: mycelium
iphone:
  appId: com.mycelium.wallet-ios
  idd: 943912290
  appCountry: us
  released: 2014-12-17
  updated: 2026-08-06
  version: '2.10'
  reviews: 9
  icon: com.mycelium.wallet-ios.jpg
  meta: ok
  verdict: sourceavailable
  developerName: MRD X-Change GmbH
  repository: https://github.com/mycelium-com/wallet-ios

---

## Android

{% include featureEvidence.html feature="tradeAlts" source="[Website](https://wallet.mycelium.com)" quote="In-app exchange and trading" %}

**Disclaimer**: Authors of this project have contributed to Mycelium.

## App Description 

Mycelium Bitcoin Wallet is a non-custodial mobile wallet for Android that supports Bitcoin, Ethereum, and ERC-20 tokens such as USDT and USDC. It provides full user control over private keys, HD wallet support (BIP32/BIP39/BIP44), and watch-only functionality for integrating with cold storage solutions. Mycelium supports hardware wallets including Trezor, Ledger, and KeepKey, as well as direct spending from paper wallets or imported keys. Additional features include dynamic transaction fees, BIP70 payment request support, BitID authentication, and encrypted PDF key backups. The wallet also includes Local Trader for peer-to-peer in-person Bitcoin trading, and can optionally connect via Tor for enhanced privacy.

This app is **source available**.

{% include featureEvidence.html feature="segwit" quote="SegWit: native (Bech32) and P2SH compatible" source="Website" %}

{% include featureEvidence.html feature="TOR" quote="For enhanced privacy and availability you can connect to our super nodes via a tor-hidden service ( *.onion* address)" source="README" %}

{% include featureEvidence.html feature="hd" quote="HD enabled - manage multiple accounts and never reuse addresses (Bip32/Bip44 compatible)" source="README" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple HD accounts, private keys, external xPub or xPriv accounts" source="README" %}

{% include featureEvidence.html feature="nfc" quote="NFC" source="Website" %}

---

## iPhone

**Disclaimer**: The authors of this project have contributed to Mycelium Android.

This app has [public source code](https://github.com/mycelium-com/wallet-ios)
which is independent of their Android version.

The provider claims:

> 100% control over your private keys, they never leave your device unless you
  export them.

but so far nobody reproduced the build, so the claim is **not verifiable**.

{% include featureEvidence.html feature="segwit" quote="SegWit: native (Bech32) and P2SH compatible" source="Website" %}

{% include featureEvidence.html feature="TOR" quote="TOR network support to mask IP address and location" source="Website" %}

{% include featureEvidence.html feature="hd" quote="Option to display derivation address path for BIP44 HD accounts" source="Website" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple accounts - you can have unlimited number of USDT, Bitcoin, Tron, Ethereum, and TRC20/ERC20 accounts." source="Store" %}

{% include featureEvidence.html feature="coinCtrl" quote="Full UTXO control." source="Store" %}

{% include featureEvidence.html feature="customNode" quote="Connection to your own Bitcoin node." source="Store" %}

{% include featureEvidence.html feature="fingerprint" quote="PIN protection with randomized keypad or biometric authentication." source="Store" %}

{% include featureEvidence.html feature="nfc" quote="NFC" source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="In-app exchange and trading" source="Website" %}
