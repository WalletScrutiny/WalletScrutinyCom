---
title: IPMB Wallet
date: 2026-10-28
authors:
- leo
website: https://ipmb.com
twitter: IpmbOfficial
android:
  appId: com.ipmb.app
  users: 1000
  appCountry: us
  released: Dec 22, 2023
  updated: 2025-11-11
  version: 1.10.0
  icon: com.ipmb.app.webp
  meta: defunct
  verdict: nosource
  developerName: IPMB Wallet

---

## App Description

IPMB Wallet is a multi-chain wallet published by IPMB, a gold tokenization company that issues the GoldPro (GPRO) token and GEM NFTs. The Play description lists Bitcoin, Ethereum, Tron, Polygon, BNB Chain, Arbitrum and the IPMB token, plus in-app purchases and trading on centralized exchanges. It claims a "non-custodial framework" in which "you retain absolute control over your funds". In October 2025 IPMB [announced](https://ipmb.com/2025/10/20/ipmb-wallet-service-update-and-continued-access/) that it "no longer actively supports or maintains the IPMB Wallet app".

## Analysis

- **Bitcoin support.** The description lists "Bitcoin (BTC)" among the supported cryptocurrencies. We could not check whether this is BTC on the Bitcoin network. IPMB's announcement mentions only Ethereum-compatible wallets (NoOne, MetaMask) as replacements.
- **Custody.** The Play description says the app is non-custodial. IPMB's [service update](https://ipmb.com/2025/10/20/ipmb-wallet-service-update-and-continued-access/) calls it "a dedicated self-custody wallet interface" built on "underlying third-party wallet technology". It tells users to keep their "Secret Recovery Phrase or private keys" and to import them into another wallet. This suggests a seed the user holds, but we did not verify it.
- **Source code.** IPMB's GitHub organization, [IpmbOfficial](https://github.com/IpmbOfficial), linked from ipmb.com, has four repositories, all of them smart contracts (IPMB ERC-20, GPRO ERC-20, GEM, staking). None is the wallet app. A GitHub code search for `com.ipmb.app` found no repository for the app. The announcement says the wallet is built on third-party technology but does not name it.
- **Discontinued.** IPMB says it "made the decision to transition away from the dedicated IPMB Wallet" because of "persistent technical and support issues affecting the reliability and functionality of the underlying third-party wallet technology". The app is still on Google Play, and its latest update (2025-11-11) came after the announcement.

IPMB says the wallet is self-custodial, but we found no source code for it, so a [reproducible build](/methodology/#nosource) cannot be attempted. IPMB itself has stopped maintaining the app and recommends that users move to another wallet.

**No source for current release found**
