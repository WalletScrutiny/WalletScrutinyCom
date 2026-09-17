---
title: AoWallet & Arweave Wallet
date: 2026-09-17
authors:
- danny
website: https://www.aowallet.org
iphone:
  appId: org.aowallet.app
  idd: '6737453345'
  appCountry: us
  released: 2024-11-05
  updated: 2025-01-18
  version: 0.0.17
  reviews: 0
  icon: org.aowallet.app.jpg
  meta: stale
  verdict: nobtc
  developerName: 郑州单点科技软件有限公司

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6737453345" author="overtorment" severity="high" finding="Ionic Live Updates can replace wallet JS with no signing key. A 6-digit PIN plus unsalted SHA-256 and a reused IV wrap the JWK and mnemonic." %}

## App Description

AoWallet's [App Store listing](https://apps.apple.com/us/app/aowallet-arweave-wallet/id6737453345) is a numbered feature list rather than prose. It describes creating "AR and AO wallets", importing wallets from JSON key files, checking token balances, sending tokens, generating receive QR codes, listing and adding tokens, creating a new token "specifically for your project", a faucet hub, contact management, and support for "Chivesweave Blockchain Network". The assets named are therefore Arweave and AO, plus tokens on those networks. The seller of record is ZHENGZHOU DANDIAN TECHNOLOGY SOFTWARE LTD.

The app is at version 0.0.17 and has not been updated since 2025-01-18.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Two independent descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which names Arweave, AO and Chivesweave. Bitcoin is not mentioned.
- **overtorment's coin classification**, derived from the shipped binary rather than the listing. For this app he records **AR**.

These agree. That agreement is the evidence for the verdict below, and it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

A public repository exists at [github.com/chives-network/AoWallet](https://github.com/chives-network/AoWallet), licensed GPL-2.0, whose Capacitor application identifier matches the shipped app. Its last push was in January 2025. We have not attempted to build it or to compare a build against the released binary, so this page makes no claim that the published code is the code that was shipped. Note that overtorment's finding concerns Ionic Live Updates, a mechanism that can replace the app's JavaScript after review — if that is in use, a repository snapshot would not in any case describe what a given device is running.

### Verdict: does not support Bitcoin (BTC)

The developer's own listing describes an Arweave and AO wallet, and the coin classification taken from the shipped binary agrees. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
