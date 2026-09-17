---
title: TRIBE Wallet
date: 2026-09-17
authors:
- danny
website: https://www.tribewallet.io/
iphone:
  appId: io.eostribe.wallet
  idd: '1521532252'
  appCountry: us
  released: 2020-07-03
  updated: 2022-11-19
  version: '111'
  reviews: 6
  icon: io.eostribe.wallet.jpg
  meta: obsolete
  verdict: nobtc
  developerName: Crypto Tribe DAO

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-1521532252" author="overtorment" severity="critical" finding="FIO and Telos setup automatically back up the private key to keystore.eostribe.io. Users can also delegate the key to guardian FIO addresses." %}

## App Description

TRIBE Wallet is described on its [App Store listing](https://apps.apple.com/us/app/tribe-wallet/id1521532252) as "a non-custodial wallet with support for Ethereum, Polygon, Binance, Aurora, Algorand, Stellar, Telos/EVM, EOS and FIO blockchain accounts". Its advertised features centre on Telos native and Telos EVM accounts, multi-chain EVM accounts, staking of Telos, FIO and Aurora, Algorand and Stellar account creation, and free FIO address registration. The listing says the private key is kept on the phone "with an option to delegate to guardians". The seller of record is Crypto Tribe DAO LC.

The app has not been updated since 2022-11-19.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Two independent descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which enumerates nine networks by name. Bitcoin is not among them.
- **overtorment's coin classification**, derived from the shipped binary rather than the listing. For this app he records **ETH, MATIC, XLM, ALGO, EOS, LINK**.

These agree: neither names Bitcoin. That agreement is the evidence for the verdict below, and it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

A public repository exists at [github.com/EOSTribe/kryptowallet](https://github.com/EOSTribe/kryptowallet). Its bundle identifier matches the shipped app and it is a React Native project, but it carries **no licence**, and its last push was in January 2026 while the App Store build has not changed since November 2022. We have not attempted to build it or to compare a build against the released binary, so this page makes no claim that the published code is the code that was shipped. The presence of a repository is recorded as a fact, not as a source-availability verdict.

### Verdict: does not support Bitcoin (BTC)

The developer's listing names nine supported networks and Bitcoin is not one of them, and the coin classification taken from the shipped binary agrees. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
