---
title: Bitcoin Light - Crypto Wallet
date: 2026-10-28
authors:
- leo
redirect_from:
- /iphone/com.peersyst.bitcoin-light/
android:
  appId: com.peersyst.bitcoinlight
  users: 5000
  appCountry: us
  released: Dec 26, 2025
  updated: 2026-09-16
  version: 1.4.3
  reviews: 10
  icon: com.peersyst.bitcoinlight.webp
  meta: ok
  verdict: nosource
  developerName: Peersyst Technology
iphone:
  appId: com.peersyst.bitcoin-light
  idd: '6753018094'
  appCountry: us
  released: '2026-01-22T08:00:00Z'
  updated: 2026-09-17
  version: 1.4.3
  reviews: 1
  icon: com.peersyst.bitcoin-light.webp
  meta: ok
  verdict: wip
  developerName: Peersyst

---

## App Description

Bitcoin Light is a wallet for Bitcoin and Nervos (CKB) by Peersyst Technology. Its [website](https://www.bitcoinlight.app/) presents it as the successor of CKBull, Peersyst's Nervos wallet ("Formerly known as CKBull"), while the Play description calls it "a new application" designed "from the ground up". The app offers buying, sending and receiving BTC on the Bitcoin network, CKB transfers and the Nervos DAO; Lightning support is listed as a future feature. It describes itself as "True self-custody: private keys remain on your device at all times", with an "Offline recovery code to restore your wallet".

## Analysis

- **Bitcoin support.** The Play description lists "Buy, send, and receive Bitcoin (BTC) on the Bitcoin network". Lightning, Fiber and swaps are described as "part of the product roadmap", not as current features.
- **Custody.** The description says "private keys remain on your device at all times" and "No custodians, no intermediaries". The website says "Your keys, your coins". We did not install the app and could not check what the "Offline recovery code" contains.
- **Source code.** The [Peersyst GitHub organization](https://github.com/Peersyst) has 93 public repositories. None of them is Bitcoin Light. The closest is [Peersyst/ckbull-mobile](https://github.com/Peersyst/ckbull-mobile), the predecessor app. It builds the app ID `com.peersyst.ckbull`, not `com.peersyst.bitcoinlight`, and has had no pushes since 2025-06-30, half a year before Bitcoin Light was released. A GitHub code search for `com.peersyst.bitcoinlight` returned no results. Neither the Play listing nor the website links to source code.

Bitcoin Light says it is self-custodial, but we found no source code for it, so a [reproducible build](/methodology/#nosource) cannot be attempted.

**No source for current release found**
