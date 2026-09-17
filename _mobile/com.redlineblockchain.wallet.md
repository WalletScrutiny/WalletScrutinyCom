---
title: Red Wallet
date: 2026-09-17
authors:
- danny
website: https://redlinewallet.io/
iphone:
  appId: com.redlineblockchain.wallet
  idd: '1607470682'
  appCountry: us
  released: 2022-02-05
  updated: 2024-07-16
  version: '19'
  reviews: 4
  icon: com.redlineblockchain.wallet.jpg
  meta: obsolete
  verdict: nobtc
  developerName: Redline Blockchain

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-1607470682" author="overtorment" severity="high" finding="An InAppBrowser explorer path can inject the private key into a third-party page." %}

## App Description

RED Wallet is described on its [App Store listing](https://apps.apple.com/us/app/red-wallet/id1607470682) as "a digital wallet and a REDNFT browser", used to "send, receive, and spend your digital assets while exploring the world of REDNFT". The listing states it is "Crafted on the robust Polygon Blockchain" and points users at "the REDNFT Marketplace" and "the treasures of the Polygon network". It is offered as both a browser extension and a mobile app. The network named is Polygon; no other chain appears. The seller of record is Redline Blockchain Inc.

The app has not been updated since 2024-07-16.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Two independent descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which names Polygon and the REDNFT ecosystem. Bitcoin is not mentioned.
- **overtorment's coin classification**, derived from the shipped binary rather than the listing. For this app he records **MATIC, RLC, USDC, USDT, BUSD, DAI** — all Polygon-side assets.

These agree. That agreement is the evidence for the verdict below, and it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the seller's site and store text, and looked for a published organisation or project. Nothing was found. Without published source there is nothing to build and nothing to compare a released binary against.

### Verdict: does not support Bitcoin (BTC)

The developer's own listing describes a Polygon and NFT wallet, and the coin classification taken from the shipped binary lists six Polygon-side assets and no Bitcoin. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
