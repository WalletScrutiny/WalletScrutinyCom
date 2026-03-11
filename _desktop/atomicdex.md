---
title: Komodo Wallet
appId: atomicdex
authors:
- danny
released: 2021-04-16
discontinued: 
updated: 2024-04-13
version: 0.8.2-beta
binaries: 
provider: KomodoPlatform
providerWebsite: https://komodoplatform.com/
website: https://atomicdex.io/
repository: https://github.com/KomodoPlatform/komodo-wallet-desktop
issue: https://github.com/KomodoPlatform/komodo-wallet-desktop/issues/35
icon: atomicdex.png
bugbounty: 
meta: deprecated
verdict: sourceavailable
date: 2025-01-15
twitter: KomodoPlatform
social: 
builds: 
features:
- tradeAlts

---

{% include featureEvidence.html feature="tradeAlts" source="[README](https://github.com/KomodoPlatform/komodo-wallet-desktop#readme)" quote="trade peer-to-peer with minimal fees and never give up control over your digital assets" %}

## App Description

Komodo Wallet is presented as a secure, non-custodial, multi-coin wallet and DEX. It is described as a place to buy, swap, and manage crypto with access to Web3 and seamless cross-chain swaps. The official description highlights support for 500+ cryptocurrencies and Atomic Swap-powered trading.

## Analysis

The source code is public on GitHub, but the `KomodoPlatform/komodo-wallet-desktop` repository is being deprecated per the maintainers in issue https://github.com/KomodoPlatform/komodo-wallet-desktop/issues/35. They state future desktop and mobile releases will be bundled from `https://github.com/KomodoPlatform/komodo-wallet`, which also powers the web app at https://app.komodoplatform.com/.

Komodo announced in December 12, 2025, that Gleec acquired the full Komodo Platform technology stack, brand, online assets, token infrastructure, and core team (https://komodoplatform.com/en/blog/gleec-acquires-komodo-ecosystem/). This places Komodo's wallet technology and roadmap within Gleec's ecosystem, which is relevant context for any future distribution or maintenance of the desktop wallet. 

We are marking this as **deprecated.**
