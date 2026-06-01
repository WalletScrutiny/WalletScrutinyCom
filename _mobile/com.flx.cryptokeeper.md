---
title: 'Bitcoin Wallet : BTC & Crypto'
date: 2025-11-17
authors:
- danny
website: http://www.cryptokeeperllc.com
features:
- foss
redirect_from:
- /android/com.flx.cryptokeeper/
- /iphone/com.flx.cryptokeeper/
android:
  appId: com.flx.cryptokeeper
  users: 10000
  appCountry: us
  released: 2025-06-02
  updated: 2025-08-30
  version: 3.0.0
  reviews: 12
  icon: com.flx.cryptokeeper.png
  meta: ok
  verdict: custodial
  developerName: Crypto Keeper LLC
iphone:
  appId: com.flx.cryptokeeper
  idd: '6748661577'
  appCountry: us
  released: 2025-07-22
  updated: 2026-02-21
  version: 6.0.0
  reviews: 31
  icon: com.flx.cryptokeeper.jpg
  meta: ok
  verdict: wip
  developerName: Crypto Keeper

---

## App Description

Crypto Keeper Bitcoin Wallet is a multi-cryptocurrency wallet that supports Bitcoin (BTC), Ethereum (ETH), and Tether (USDT). The app claims to be non-custodial with "AI-based encryption & security" and supports 12/24-word recovery phrases.

Features include the ability to buy crypto via Google Pay or bank card, customizable transaction fees, fingerprint unlock, and compatibility with major wallets like Trust Wallet, MetaMask, and Electrum for wallet import.

The Play Store listing states that Crypto Keeper is an **"open-source project."**

## Analysis

**Open Source Claim:**

The app's Play Store description states:
> 🔁 Open Source
> Crypto Keeper is an open-source project trusted by developers and users around the world.

However, we could not locate a public source code repository for this app. We [searched GitHub Code](https://github.com/search?q=%22com.flx.cryptokeeper%22&type=code) for "com.flx.cryptokeeper" and checked their website (cryptokeeperllc.com), but found no links to source code or repository.

**Custody Model - Critical Findings:**

Despite claiming to be "fully non-custodial" in the Play Store description, the app's own FAQ reveals it is actually **custodial**:

From the in-app [FAQ "How is my wallet secured?":](https://x.com/dannybuntu/status/1990401443640021492/photo/2)
> Private keys are never stored on your device.

This directly contradicts the Play Store claim of "private keys encrypted and stored locally."

Additionally, the [FAQ states](https://x.com/dannybuntu/status/1990401443640021492/photo/1) that **KYC (identity verification) is required to send funds**:
> Basic features like viewing your balance and receiving crypto may work without KYC, but to send, exchange, or access full functionality, identity verification is required for security and compliance.

**Verification Testing:**

We [tested](https://x.com/dannybuntu/status/1990395936246227077) the 24-word "recovery phrase" provided by Crypto Keeper by importing it into Electrum Desktop. The Bitcoin address shown in Crypto Keeper (`bc1qjk7lkwuh8adywrq9nx0d698tdpu6h5mak8s6q4`) did **not match any addresses** derived from the recovery phrase in Electrum using standard BIP39/BIP84 derivation.

This confirms that the "recovery phrase" does not actually control the Bitcoin private keys - it appears to be for account recovery on Crypto Keeper's servers, not for independent wallet restoration.

**Verdict:**

Despite marketing itself as "non-custodial" and providing a "recovery phrase", Crypto Keeper is a **custodial** service where:
- Private keys are stored on the provider's servers (not on user's device)
- The recovery phrase does not derive the actual Bitcoin addresses
- KYC is required to send funds (account-based system)

This is a **custodial** service with misleading claims about being non-custodial and open source.

{% include featureEvidence.html feature="foss" comment="(no justification provided by LLM)" %}
