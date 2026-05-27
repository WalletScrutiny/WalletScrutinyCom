---
title: Bitcoin Wallet & Crypto Market
date: 2025-11-26
authors:
- danny
website: https://coinhub8899.web.app
repository: https://github.com/hoanghiephui/coindex-wallet-android
redirect_from:
- /android/com.wallet.blockchain.bitcoin/
android:
  appId: com.wallet.blockchain.bitcoin
  users: 1000
  appCountry: us
  released: 2023-12-21
  updated: 2024-11-22
  version: 0.2.7
  icon: com.wallet.blockchain.bitcoin.png
  meta: stale
  verdict: fake
  developerName: TwiX

---

🚩 **Warning:** This app's repository, website and identity trail can create some confusion. Its website points to [coinhub8899.web.app](https://coinhub8899.web.app/), which links to a [different GitHub repo](https://github.com/hoanghiephui/coindex-wallet-android) for another app {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict='true' %}. There are significant version mismatches between repository and Play Store, and disabled GitHub issues preventing verification inquiries.

We also observe that this is from the same provider that previously listed **FAKE** apps. See {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict='true' %}. This is the historical list: 

> We list the following apps of this provider:
>
> * {% include walletLink.html wallet='android/com.bitcoin.wallet.btc' verdict=true %}
> * {% include walletLink.html wallet='android/com.blockchain.wallet.btc' verdict=true %}
> * {% include walletLink.html wallet='android/com.blockchain.bitcoin.wallet' verdict=true %}
> * {% include walletLinkArchived.html wallet='android/com.blockchain.explorer' %}
> * {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict=true %}

## App Description 

Bitcoin Wallet & Crypto Market is a non-custodial multi-chain wallet for Android, forked from the open-source Unstoppable Wallet. It supports Bitcoin, Ethereum, Binance Smart Chain, Avalanche, Solana, and other networks. Users retain control of private keys and can manage cryptocurrencies and NFTs directly in the app. The fork includes support for on-chain decentralized swaps and integrates basic coin tracking tools.

## Analysis 

**Is it a wallet?** Yes, the app provides seed phrases and Bitcoin wallet functionality.

**Is it for bitcoins?** Yes, it supports Bitcoin along with other cryptocurrencies.

**Can it send and receive bitcoins?** Yes, as a fork of Unstoppable Wallet, it supports full Bitcoin send/receive functionality.

**Is the product self-custodial?** Yes, users control their private keys and seed phrases.

**Source code availability:** Yes, source code is available at https://github.com/hoanghiephui/coindex-wallet-android

## Issues Identified

- Repository appears to be an unsynced fork of {% include walletLink.html wallet='android/io.horizontalsystems.bankwallet' verdict='true' %}
- Version mismatch exists between the repository and the Google Play Store version:
  - Google Play: 0.2.7
  - GitHub Repo: 0.23.2  
- Despite these concerns, the source code is available for verification

## Critical Information

**GitHub Issues Disabled:** We attempted to file a GitHub issue to clarify version mismatches and package ID discrepancies but discovered that issues are disabled on the repository at https://github.com/hoanghiephui/coindex-wallet-android. This prevents direct communication with developers for verification purposes.

**Multiple Package IDs Identified:**
- Current Play Store: {% include walletLink.html wallet='android/com.wallet.blockchain.bitcoin' verdict='true' %} (InvoVN Solutions)
- Historic/Alternative: {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict='true' %} (referenced in repository and third-party mirrors)

**Version Discrepancy Details:**
- Google Play Store version: 0.2.7 (updated 2024-11-22)
- GitHub repository version: 0.23.2 (significantly higher, suggesting different versioning scheme)
- Repository README references different package ID in some places

**Attempted GitHub Issue Content:**
We prepared a comprehensive inquiry regarding version mismatches, package ID clarification, and reproducible build requirements, but could not submit it due to disabled issues. The inquiry included requests for:
- Confirmation of authoritative repository
- Tagged releases matching Play Store versions
- Build environment documentation
- Package ID unification
- Upstream fork attribution

**Third-party References:**
- CoinHub/CoinDex branding site: https://coinhub8899.web.app
- Aptoide mirror: https://coinhub-invovn-solutions.en.aptoide.com/app
- Historic Play listing references to `com.blockchain.btc.coinhub`

This combination of disabled communication channels, version mismatches, and multiple package IDs raises significant concerns about the app's development transparency and verification feasibility.

## Verdict

With the generic name and generic app ID of this app, and the flagged history of the developer, we are marking this app as a **fake**.
