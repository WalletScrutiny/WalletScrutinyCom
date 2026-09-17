---
title: Mesiger Crypto Wallet
date: 2026-09-17
authors:
- danny
iphone:
  appId: com.mesiger.wlt
  idd: '6451153738'
  appCountry: us
  released: 2023-07-31
  updated: 2025-01-02
  version: 1.5.5
  reviews: 1
  icon: com.mesiger.wlt.jpg
  meta: stale
  verdict: nobtc
  developerName: WEI ONETECHNOLOGY COMPANY LIMITED

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6451153738" author="overtorment" severity="high" finding="Unsigned Hot Code Push can replace the wallet JavaScript after review. The mnemonic and derived keys sit in localStorage and iCloud Web Storage." %}

## App Description

Mesiger's [App Store listing](https://apps.apple.com/us/app/mesiger-crypto-wallet/id6451153738) is a single sentence: "A cryptocurrency wallet that allows direct messaging between addresses, and multi-signature payments without the need for an intermediate guarantor." It names no blockchain and no asset. There is no seller website on the listing. The seller of record is WEI ONETECHNOLOGY COMPANY LIMITED.

The app has not been updated since 2025-01-02.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test.

**The evidence here is thinner than for the other apps in this batch, and that is worth stating plainly.** For most apps we can compare the developer's own list of supported assets against a list derived from the shipped binary. Here the developer publishes no list at all — the one-sentence description names nothing — and overtorment's coin classification for this app is **empty**: his analysis of the binary surfaced no coin. So the two sources agree only in the weak sense that neither produces Bitcoin; nothing here positively establishes what this app does support.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the store text and looked for a published organisation or project. Nothing was found. Without published source there is nothing to build and nothing to compare a released binary against. Note also overtorment's finding that an unsigned Hot Code Push mechanism can replace the app's JavaScript after App Store review — where that is in use, a source snapshot would not describe what a given device is running even if one existed.

### Verdict: does not support Bitcoin (BTC)

Neither the developer's description nor the coin classification taken from the shipped binary shows Bitcoin support. We therefore record **does not support Bitcoin (BTC)**, while noting that this rests on the absence of evidence of Bitcoin rather than on a positive account of what the app does handle. The review stops at the Bitcoin-support gate. If a runtime check on an iPhone later shows a Bitcoin address or a Bitcoin-network transaction flow, this verdict should be revisited.
