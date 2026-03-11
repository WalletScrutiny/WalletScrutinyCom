---
wsId: mycelium
title: Mycelium Bitcoin Wallet
altTitle: 
authors:
- leo
- danny
users: 1000000
appId: com.mycelium.wallet
appCountry: 
released: 2013-07-01
updated: 2026-02-09
version: 3.21.0.0
reviews: 1155
website: https://wallet.mycelium.com
repository: https://github.com/mycelium-com/wallet-android
issue: 
icon: com.mycelium.wallet.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- dff1afc579b1df3dfeb0c5f6f5c79ade9f3670939128c3b314d84ed69f5a4bc6
date: 2025-03-07
signer: b8e59d4a60b65290efb2716319e50b94e298d7a72c76c2119eb7d8d3afac302e
twitter: MyceliumCom
social:
- https://www.linkedin.com/company/mycelium
- https://www.facebook.com/myceliumcom
- https://www.reddit.com/r/mycelium
redirect_from:
- /mycelium/
- /com.mycelium.wallet/
- /posts/2019/11/mycelium/
- /posts/com.mycelium.wallet/
developerName: Mycelium Developers
builds: 
features:
- tradeAlts
- TOR
- hd
- multiAccount
- nfc
- segwit

---

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