---
wsId: okxWeb3Wallet
title: 'OKX Wallet: Portal to Web3'
date: 2025-11-20
authors:
- danny
twitter: wallet
redirect_from:
- /android/com.okx.wallet/
- /iphone/com.okx.wallet/
android:
  appId: com.okx.wallet
  users: 500000
  appCountry: us
  released: 2025-03-21
  updated: 2026-07-05
  version: 6.178.0
  reviews: 48
  icon: com.okx.wallet.png
  meta: ok
  verdict: nosource
  developerName: OKX Technology Inc.
iphone:
  appId: com.okx.wallet
  idd: '6743309484'
  appCountry: us
  released: 2025-04-15
  updated: 2026-06-12
  version: 6.172.0
  reviews: 94
  icon: com.okx.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: OKX Technology Inc

---

## Android

## App Description

OKX Wallet is a self-custodial multi-chain cryptocurrency wallet where users maintain full control of their private keys and seed phrases, supporting Bitcoin and 120+ blockchains with access to DeFi, DEX trading, and Web3 DApps. The wallet's signature SDKs (JavaScript/Go) for key management and cryptographic operations are open source under MIT license on GitHub, though the mobile application's source itself is unavailable. The platform offers both traditional seed phrase recovery and an optional MPC (Multi-Party Computation) wallet mode that splits keys into three shares where users hold two shares and can recover independently without OKX's assistance.

## Analysis

We [tested the wallet](https://x.com/BitcoinWalletz/status/1991448177669718183) and confirmed it provides standard BIP39 seed phrases that control all supported blockchains, including Bitcoin. [Importing the seed phrase into Electrum](https://x.com/BitcoinWalletz/status/1991449817437073876) successfully recovered the Bitcoin wallet with matching addresses, verifying true self-custody and no vendor lock-in. This demonstrates the wallet uses standard BIP39/BIP32/BIP84 derivation paths compatible with other Bitcoin wallets, allowing users to independently recover funds without OKX's involvement.

The wallet offers two modes: traditional seed phrase (tested above) and an optional MPC wallet. Per OKX's [terms](https://www.okx.com/help/dex-trading-in-app-terms-of-service), "OKX does not take custody of any asset with the OKX Wallet Software" and "OKX Wallet Software has no access to Private Keys". While the signature SDKs are open source on GitHub, the mobile application's **source itself remains unavailable**, preventing independent verification of the APK binaries.

---

## iPhone

{% include copyFromAndroid.html %}
