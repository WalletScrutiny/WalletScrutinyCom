---
wsId: owallet
title: OWallet
date: 2026-09-04
authors:
- danny
website: https://owallet.io/
appCountry: us
redirect_from:
- /android/com.io.owallet/
- /iphone/io.orai.owallet/
- /mobile/io.orai.owallet/
android:
  appId: com.io.owallet
  users: 10000
  appCountry: us
  released: 2022-05-30
  updated: 2026-03-18
  version: 3.8.2
  reviews: 19
  icon: com.io.owallet.png
  meta: ok
  verdict: nobtc
  developerName: Oraichain Labs US
iphone:
  appId: io.orai.owallet
  idd: '1626035069'
  appCountry: us
  released: 2022-06-06
  updated: 2026-05-20
  version: 3.8.3
  reviews: 47
  icon: io.orai.owallet.jpg
  meta: ok
  verdict: nobtc
  developerName: Oraichain

---

## App Description

OWallet is a multichain mobile wallet from Oraichain. It is published as `com.io.owallet` by Oraichain Labs US on Google Play and as `io.orai.owallet` by Oraichain on the App Store. The different identifiers belong to the same product: OWallet's official repository links to both store listings, and both apps use the same name, website and advertised feature set.

Both store listings advertise Bitcoin together with EVM, Cosmos, Tron and Solana networks. The app also offers swaps, staking, portfolio tracking and a dApp browser. Hands-on testing, however, found that OWallet's actual network and receive-address lists do not include Bitcoin.

## Testing and Analysis

This assessment uses the US store listings and a hands-on check of the current Android app, recorded on 2026-09-04.

### The store claim does not survive an in-app check

The [Google Play listing](https://play.google.com/store/apps/details?id=com.io.owallet) advertises a universal wallet for Bitcoin and other supported networks. The [App Store listing](https://apps.apple.com/us/app/owallet/id1626035069) makes the same claim. A WalletScrutiny reviewer installed the current Android app and inspected its network and receive-address selectors. Bitcoin was absent: there was no Bitcoin network to enable or select and no Bitcoin address to receive to.

The reviewer published the [test record and screenshot](https://x.com/BitcoinWalletz/status/2095815398763720967). The captured **Receive → Copy Address** sheet lists LFG, Neutaro, Noble, OraiBridge, Osmosis, Solana and Tron, but not Bitcoin.

For this gate, functionality in the released app controls—not a claim in its store description. An app that does not expose the Bitcoin network cannot create or use a native Bitcoin wallet, regardless of the listing's use of the word “Bitcoin.” Store marketing alone is not sufficient evidence of Bitcoin support.

The Android and iPhone records are the same OWallet product and carry the same advertised feature set. The hands-on product check contradicts that shared Bitcoin claim, so the finding applies to both entries in this merged review.

### Verdict: nobtc

OWallet is a cryptocurrency wallet, but the reviewed product does not offer Bitcoin in its actual network or receive-address lists. Its store descriptions are misleading on this point. Both Android and iPhone therefore receive our **nobtc** verdict, and the review stops at the Bitcoin-support gate. Custody and source availability are not assessed.
