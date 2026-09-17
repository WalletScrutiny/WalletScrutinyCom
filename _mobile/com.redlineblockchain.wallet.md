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

**The project's website no longer exists.** `redlinewallet.io` has no DNS record — neither the bare
domain nor `www`. The privacy-policy link the App Store listing still advertises,
`redlinewallet.io/privacy-policy/`, is dead for the same reason. The address is kept in this page's
metadata so another researcher knows where the project used to publish. The developer's other domain,
`redlineblockchain.com`, does resolve but returns an anti-bot interstitial we did not get past, so we
cannot say what it currently contains.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Three descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which names Polygon and the REDNFT ecosystem. Bitcoin is not mentioned.
- **The store screenshots**, which we examined ourselves. They show the app's own asset screen, and it is the most direct account of the wallet's contents available without running it. See below.
- **overtorment's coin classification**, derived from the shipped binary. For this app he records **MATIC, RLC, USDC, USDT, BUSD, DAI**.

All three agree that this is a Polygon wallet.

### What the app's own screens say

The listing's screenshots show a token list containing **MATIC, RLC, USDC, USDT, BUSD, DAI, UNI, WBTC, LINK, SAND and AAVE**, with the balance denominated in MATIC and a separate tab for NFTs. That is five assets more than the binary-derived list, which is unsurprising: a coin classification and a marketing screenshot are not measuring the same thing.

More useful than the list is the notice the developer prints beneath it on every asset screen:

> Only **Polygon Blockchain**. Transferring using other networks may result in token loss.

That is the developer stating the wallet's scope inside the product itself, and warning users that sending from another network will lose their funds.

### WBTC is not Bitcoin

One entry in that list deserves to be named rather than passed over. **WBTC is Wrapped Bitcoin** — an ERC-20 style token, here on Polygon, that represents Bitcoin value on another chain. It is not BTC on the Bitcoin network, and by the app's own "Only Polygon Blockchain" notice it cannot be: the wallet does not transact outside Polygon.

A reader scanning the screenshots could see "WBTC" and conclude this wallet handles Bitcoin. It does not. Holding WBTC means holding a Polygon token whose value tracks Bitcoin and whose redemption depends on the custodian who issued it; it does not give the user a Bitcoin address, a Bitcoin transaction, or Bitcoin held on the Bitcoin network. This is the same distinction recorded for Canton Bitcoin (cBTC) elsewhere in these reviews. That agreement is the evidence for the verdict below, and it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the seller's site and store text, and looked for a published organisation or project. Nothing was found. Without published source there is nothing to build and nothing to compare a released binary against.

### Verdict: does not support Bitcoin (BTC)

The developer's listing describes a Polygon and NFT wallet, the coin classification taken from the shipped binary lists Polygon-side assets only, and the app's own screens declare "Only Polygon Blockchain". The single Bitcoin-named asset visible anywhere, WBTC, is a Polygon token representing Bitcoin rather than Bitcoin itself. We therefore record **does not support Bitcoin (BTC)**.

The review stops at the Bitcoin-support gate. This verdict should be revisited if a released build exposes a Bitcoin address and a Bitcoin-network transaction flow — a wrapped token on another chain is not that.
