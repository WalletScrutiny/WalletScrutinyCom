---
title: 'Helios: Tron wallet'
date: 2026-09-17
authors:
- danny
iphone:
  appId: io.heliosionictestapp.helios
  idd: '6739870604'
  appCountry: us
  released: 2025-02-18
  updated: 2025-04-08
  version: 1.0.8
  reviews: 3
  icon: io.heliosionictestapp.helios.jpg
  meta: stale
  verdict: nobtc
  developerName: Helios Tron Wallet

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6739870604" author="overtorment" severity="critical" finding="Dashboard auto-OCRs the photo library to S3. Preferences store the seed and key in plaintext. Optional iCloud backup is repeating-key XOR." %}

## App Description

Helios is presented as a wallet for a single network. Its [App Store listing](https://apps.apple.com/us/app/helios-tron-wallet/id6739870604) is titled "Helios: Tron wallet" and opens with "SECURE NON-CUSTODIAL WALLET FOR TRON BLOCKCHAIN", describing an app that "gives you complete control over your TRON digital assets". The feature list is TRON-specific throughout — "Send & Receive TRON Assets" and "TRON Network Native – Built specifically for TRON blockchain". No other blockchain is named anywhere in the description. The seller of record is Cloak + Armor Inc.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. What we have is two independent descriptions of which assets the app handles:

- **The store listing**, which is the developer's own claim about the app, and which names TRON and nothing else.
- **overtorment's coin classification**, which he derived from the shipped binary rather than from the listing. For this app he records **TRX**.

These agree. That agreement is the evidence for the verdict below, and it is worth being explicit that it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the seller's listing and store text, and looked for a published organisation or project. Nothing was found. This is recorded here because it closes the reproducibility question independently of anything else: without published source there is nothing to build and nothing to compare a released binary against.

### Verdict: does not support Bitcoin (BTC)

The developer's own listing describes a TRON-only wallet, and the coin classification taken from the shipped binary agrees. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
