---
wsId: trustNE
title: TrustNE Wallet
altTitle: 
authors:
- danny
users: 1000
appId: com.trust_fresh
alternativeStores: 
appCountry: 
released: 2025-07-02
updated: 2026-02-12
version: 1.0.13
reviews: 
website: 
repository: 
icon: com.trust_fresh.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2026-05-02
signer: 
twitter: 
social: 
redirect_from: 
developerName: NewEra Education Center
builds: 
features: 

---

## App Description

TrustNE Wallet is presented as a multi-chain wallet with Bitcoin support. The Google Play listing says users are the sole owners of their private keys and that seed phrase generation and storage happen on the device. The website says users can import or create wallets, including a Bitcoin wallet.

## Testing and Analysis

The Privacy Policy says wallet data, including private keys and transaction history, remains on the user's device. The [Terms of Service](https://trustne.io/terms-and-conditions.html) state:

> "Users can create a wallet using both a seed phrase and an email + password. TrustNE Wallet does not store or manage private keys but offers account recovery via email authentication when enabled by the user."

These two claims are in direct contradiction. If the seed phrase is generated and stored only on the device and TrustNE holds no key material, email-based wallet recovery is technically impossible. If email recovery works, something must be stored or escrowed somewhere — but the Terms do not explain the mechanism. TrustNE's website has no help documentation or FAQ that clarifies how this recovery works. A user enabling email recovery has no way to know what key material leaves their device or who holds it.

We [tested the app](https://x.com/BitcoinWalletz/status/2050494303970148501) and can confirm the seed phrase and self-custody claims during normal use.

We searched for the app ID in Github, but [did not find relevant results](https://github.com/search?q=com.trust_fresh&type=code).

Without source code for the current Android release, the app cannot be verified from source.
