---
title: 'Tria: Crypto & Cards'
date: 2026-10-28
authors:
- leo
website: https://tria.so
twitter: useTria
android:
  appId: com.tria.v2
  users: 100000
  appCountry: us
  released: Jul 14, 2025
  updated: 2026-10-17
  version: 0.0.75
  reviews: 91
  icon: com.tria.v2.webp
  meta: ok
  verdict: custodial
  developerName: Threely Dimensions Inc.

---

## App Description

Tria is a crypto app with a Visa card, trading, yield and travel booking, published by Threely Dimensions Inc. The Play Store description lists "Bitcoin, Ethereum, Solana, USDT and 1,000+ assets" and calls the app "a self-custody crypto wallet" with "No seed phrase to write down, and no custodian holding your funds". Users sign up with a Google or Apple account and an access code.

## Analysis

- **Bitcoin support.** The help article [Tria Wallet](https://help.tria.so/en/articles/14056526-tria-wallet) lists Bitcoin among the supported chains. It also notes that "BTC native token is required as the gas on Bitcoin chain", so the wallet handles BTC on the Bitcoin network.
- **Custody claims.** The [Terms of Service](https://docs.tria.so/terms-of-service) state: "Tria does not hold, store, or take custody of your funds, digital assets, collateral, or private keys." The same section, however, describes the wallet as a "Digital Asset Wallet" that you "connect", whose provider has its own terms. It does not describe the wallet built into Tria's own app.
- **How the keys work is not public.** The [documentation](https://docs.tria.so/) refers to "TSS-based programmable wallets", which means threshold signatures where several parties hold key shares. The page that explains this, [Security and TSS](https://docs.tria.so/security-tss), is password-protected: "This section is password-protected and intended for authorized use only." We could not find out who holds the key shares or whether the user can sign without Tria.
- **The account depends on the login.** According to [How do I sign up for Tria?](https://help.tria.so/en/articles/14033999-how-do-i-sign-up-for-tria), "Using a different email address creates a brand new account rather than logging into your old one." The wallet is tied to the Google or Apple login.
- **Discrepancy about the seed phrase.** The Play Store says there is "No seed phrase to write down", and "No custodian, no seed phrase, no exceptions." The same help article calls a 12- or 24-word seed phrase the wallet's "master key" and says that "you can use your seed phrase to recover your Tria Wallet". We could not find any instructions for showing or exporting such a phrase.
- **Funds may be lost if the service stops.** The Terms of Service say: "in the event of permanent suspension or termination of the Services, the Digital Assets associated with your Tria Account and Card Account may be lost". If the user alone controlled the keys, a shutdown of Tria's services would not cost them their funds.
- **Source code.** The [triahq GitHub organization](https://github.com/triahq) has a relay server, an SDK test project and a RainbowKit fork, but no repository for the app. A GitHub code search for `com.tria.v2` found only third-party lists.

Tria's key management is undocumented in public, the wallet is tied to a Google or Apple login, and its own terms warn that assets "may be lost" if Tria ends the service. We cannot confirm that the user alone controls the keys. Until Tria documents who holds the key shares and how a user can sign without Tria, we treat the app as [custodial](/methodology/#custodial).

**Custodial: The provider holds the keys**
