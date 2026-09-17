---
title: Uin Wallet
date: 2026-09-17
authors:
- danny
iphone:
  appId: app.uin.wallet
  idd: '6499209307'
  appCountry: us
  released: 2024-06-03
  updated: 2026-04-12
  version: 2.1.1
  reviews: 4
  icon: app.uin.wallet.jpg
  meta: ok
  verdict: nobtc
  developerName: Lamo Bit Co., Limited

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6499209307" author="overtorment" severity="critical" finding="A hardcoded AES key wraps the BIP39 seed into a Bearer token used on local-HD API calls." %}

## App Description

Uin Wallet's [App Store listing](https://apps.apple.com/us/app/uin-wallet/id6499209307) describes "a USDT-focused Web3 wallet designed for simple, secure asset management on TRON and Ethereum". The advertised features are creating or restoring a wallet, receiving funds, sending USDT, QR scanning and HD address management, with explicit "Support for USDT on TRON and Ethereum". The listing offers two modes, a "Local Wallet for self-custody control of your recovery phrase and addresses" and a "Cloud Wallet for a more streamlined wallet experience", without describing what the cloud mode does with the key material. The seller of record is Lamo Bit Co., Limited.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Two independent descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which names TRON and Ethereum and describes the app as USDT-focused. Bitcoin is not mentioned.
- **overtorment's coin classification**, derived from the shipped binary rather than the listing. For this app he records **ETH, TRX, USDT**.

These agree. That agreement is the evidence for the verdict below, and it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the seller's listing and store text, and looked for a published organisation or project. Nothing was found. Without published source there is nothing to build and nothing to compare a released binary against.

### Verdict: does not support Bitcoin (BTC)

The developer's own listing describes a USDT wallet on TRON and Ethereum, and the coin classification taken from the shipped binary agrees. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
