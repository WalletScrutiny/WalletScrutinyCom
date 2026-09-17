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

**The project's website is gone.** `https://www.tribewallet.io/`, the address the App Store listing
and this page both carry, now returns a Wix "ConnectYourDomain Error" — the domain is no longer
connected to a site. It is kept in this page's metadata anyway, so that another researcher knows
where the project used to publish and can pick up the trail from there. The developer's other domain,
`cryptotribe.io`, is still up but is a single page describing a proof-of-stake validator business; it
says nothing about the wallet or its assets.

**The archived site published a supported-coins list, and it is worth reading.** The Wayback Machine
snapshot of [2022-10-31](https://web.archive.org/web/20221031225451/https://www.tribewallet.io/) —
taken 19 days before the final App Store update, so it describes the version still shipping today —
carries a heading "Supported cryptocurrencies:" followed by:

> BNB · ETH · Polygon · Algorand · EOS · FIO · Stellar · TLOS · Aurora

Nine entries, and Bitcoin is not among them. A later snapshot from 2023-01-15 adds OKC to the same
list and still does not name Bitcoin. Neither page contains the word "Bitcoin" or "BTC" anywhere.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Three descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which enumerates nine networks by name. Bitcoin is not among them.
- **The developer's own website**, as archived on [2022-10-31](https://web.archive.org/web/20221031225451/https://www.tribewallet.io/), which published an explicit "Supported cryptocurrencies:" list of nine entries. Bitcoin is not among them either, and the list matches the store listing one for one once BNB is read as Binance and TLOS as Telos.
- **overtorment's coin classification**, derived from the shipped binary rather than from any of the developer's marketing. For this app he records **ETH, MATIC, XLM, ALGO, EOS, LINK**.

All three agree that Bitcoin is absent. The first two are the developer describing the product and the third is an independent reading of the code that shipped, so this is not one claim counted twice. It is still not the same thing as having opened the app and looked at an asset list, which we did not do.

The binary-derived list is narrower than the two published ones — it does not surface FIO, TLOS, Aurora or BNB, and it adds LINK, which is a token rather than a chain. That gap is not evidence of Bitcoin support; it reflects that the two methods measure different things. It is recorded here because a reader comparing the three lists will notice it.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

A public repository exists at [github.com/EOSTribe/kryptowallet](https://github.com/EOSTribe/kryptowallet). Its bundle identifier matches the shipped app and it is a React Native project, but it carries **no licence**, and its last push was in January 2026 while the App Store build has not changed since November 2022. We have not attempted to build it or to compare a build against the released binary, so this page makes no claim that the published code is the code that was shipped. The presence of a repository is recorded as a fact, not as a source-availability verdict.

### Verdict: does not support Bitcoin (BTC)

The developer's listing names nine supported networks and Bitcoin is not one of them, and the coin classification taken from the shipped binary agrees. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
