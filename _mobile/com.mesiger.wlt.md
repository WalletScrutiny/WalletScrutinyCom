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

Mesiger's [App Store listing](https://apps.apple.com/us/app/mesiger-crypto-wallet/id6451153738) is a single sentence: "A cryptocurrency wallet that allows direct messaging between addresses, and multi-signature payments without the need for an intermediate guarantor." It names no blockchain and no asset. The seller of record is WEI ONETECHNOLOGY COMPANY LIMITED.

**The store screenshots do name an asset, and only one.** The images on the App Store listing show
USDT and nothing else. That is the only positive statement we have about what this wallet actually
handles, since the written description makes none.

**The developer's privacy policy could not be read.** The listing points to
`https://mesiger.com/mesigerprivacy.html`. The domain still resolves — DNS returns an address in
Amazon's Tokyo region — but nothing answers on it: both HTTP and HTTPS time out and ports 80 and 443
are closed or filtered. So the policy exists as a published URL that a user tapping it today cannot
open. We also could not fall back to an archived copy, because the Internet Archive was itself
offline when we checked on 2026-09-17. This is worth retrying.

The app has not been updated since 2025-01-02.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test.

**The evidence here is thinner than for the other apps in this batch, and that is worth stating plainly.** For most apps we can compare the developer's own written list of supported assets against a list derived from the shipped binary. Here the written description names nothing at all, and overtorment's coin classification for this app is **empty**: his analysis of the binary surfaced no coin. Neither of those two sources produces Bitcoin, but neither positively establishes what the app does handle either.

What we do have is the store screenshots, which we examined ourselves and which show **USDT only**. That is a weaker kind of evidence than a written specification — marketing images need not be complete, and they show a build at the time they were captured rather than the one now shipping — but it is a positive observation rather than an absence, and it is the only one available here. It points the same way as the other two sources.

We did not run the app, and the developer's privacy policy, which might have named the networks involved, could not be retrieved (see above).

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the store text and looked for a published organisation or project. Nothing was found. Without published source there is nothing to build and nothing to compare a released binary against. Note also overtorment's finding that an unsigned Hot Code Push mechanism can replace the app's JavaScript after App Store review — where that is in use, a source snapshot would not describe what a given device is running even if one existed.

### Verdict: does not support Bitcoin (BTC)

Nothing we can reach shows Bitcoin support: not the one-sentence description, not the coin classification taken from the shipped binary, and not the store screenshots, which show USDT alone. We therefore record **does not support Bitcoin (BTC)**.

We would rather this page rested on more. The developer publishes no asset list, the privacy policy is unreachable, and the binary analysis surfaced no coin at all, so the verdict leans on store screenshots plus two silences. It points consistently in one direction, but a reader should know it is the thinnest evidence in this group of reviews. The review stops at the Bitcoin-support gate. If a runtime check on an iPhone later shows a Bitcoin address or a Bitcoin-network transaction flow, this verdict should be revisited.
