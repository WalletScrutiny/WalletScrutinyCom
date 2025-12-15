---
title: Mixin Messenger Desktop
appId: mixin.messenger
authors:
- danny
released: 2019-03-15
discontinued: 
updated: 2025-02-24
version: 3.0.3
binaries: https://messenger.mixin.one/download
provider: Mixin Ltd.
providerWebsite: 
website: https://mixin.one
repository: https://github.com/MixinNetwork/flutter-app
issue: 
icon: mixin.messenger.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2025-06-25
twitter: Mixin_Network
social: 
builds: 
features: 

---

## App Description:

Mixin Messenger is a cross-platform desktop application for Linux, macOS, and Windows that combines an open-source cryptocurrency wallet with secure Signal-based messaging. Designed with security and decentralization in mind, it features a self-custodial MPC wallet, built-in 2FA resistant to mnemonic leaks, and anonymous account creation via mnemonic phrases. Users can swap thousands of native cryptocurrencies including BTC, ETH, and XMR, send assets directly to contacts with zero fees, and recover wallets using mnemonic phrases, trusted contacts, or phone numbers.

**Note:** the desktop application would still require downloading the Android app.

## Analysis 

The user has to dig through the [documentation](https://support.mixin.one/en/article/mixin-messenger-desktop-user-guide-ckpcnp/), to see this message: 

> ⚠️ Mixin Desktop supports chat functions only. To use wallet features, please use the mobile version!

As tested on both Windows and Linux, the desktop app **does not actually have a wallet**.
