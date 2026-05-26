---
wsId: trustNE
title: TrustNE Wallet
verdict: nosource
meta: ok
date: 2026-05-02
authors:
- danny
website: https://trustne.io/
redirect_from:
- /android/com.trust_fresh/
- /iphone/com.trustfresh/
android:
  appId: com.trust_fresh
  users: 1000
  released: 2025-07-02
  updated: 2026-02-12
  version: 1.0.13
  icon: com.trust_fresh.png
  developerName: NewEra Education Center
iphone:
  appId: com.trustfresh
  idd: '6746805908'
  appCountry: jp
  released: 2025-08-12
  updated: 2026-02-05
  version: 1.0.4
  reviews: 0
  icon: com.trustfresh.jpg
  developerName: Metgen Solution LTD

---

## Android

## App Description

TrustNE Wallet is presented as a multi-chain wallet with Bitcoin support. The Google Play listing says users are the sole owners of their private keys and that seed phrase generation and storage happen on the device. The website says users can import or create wallets, including a Bitcoin wallet.

## Testing and Analysis

The Privacy Policy says wallet data, including private keys and transaction history, remains on the user's device. The [Terms of Service](https://trustne.io/terms-and-conditions.html) state:

> "Users can create a wallet using both a seed phrase and an email + password. TrustNE Wallet does not store or manage private keys but offers account recovery via email authentication when enabled by the user."

These two claims are in direct contradiction. If the seed phrase is generated and stored only on the device and TrustNE holds no key material, email-based wallet recovery is technically impossible. If email recovery works, something must be stored or escrowed somewhere — but the Terms do not explain the mechanism. TrustNE's website has no help documentation or FAQ that clarifies how this recovery works. A user enabling email recovery has no way to know what key material leaves their device or who holds it.

We [tested the app](https://x.com/BitcoinWalletz/status/2050494303970148501) and can confirm the seed phrase and self-custody claims during normal use.

We searched for the app ID in Github, but [did not find relevant results](https://github.com/search?q=com.trust_fresh&type=code).

Without source code for the current Android release, the app cannot be verified from source.

---

## iPhone

{% include copyFromAndroid.html %}
