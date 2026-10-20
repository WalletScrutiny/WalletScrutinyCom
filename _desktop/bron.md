---
title: Bron Wallet
appId: bron
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: https://app.bron.org
provider: Bron Foundation
providerWebsite: https://bron.org/
website: https://bron.org/
repository: 
icon: bron.webp
bugbounty: https://bugbounty.bron.org/rewards-desktop
meta: ok
verdict: custodial
date: 2026-10-20
twitter: BronWallet
social:
- https://t.me/bronwallet
builds: 
features: 

---

## Related to:

- {% include walletLink.html wallet='android/org.bron.mobile' verdict='true' %}
- {% include walletLink.html wallet='iphone/org.bron.mobile' verdict='true' %}

## App Description

Bron Wallet is a multi-chain wallet by Bron Foundation, "a foundation incorporated in the Cayman Islands" according to its [Wallet Terms](https://bron.org/wallet-terms) (last updated 18 May 2026). The [website](https://bron.org/) lists Bitcoin among its supported networks. The desktop app exists for macOS and Windows only. Its download page, which we viewed while testing, states: "The desktop app is required to create accounts, manage assets, and access all features." Bron's [support article](https://support.bron.org/en/articles/11930112-bron-web-and-desktop-mobile-app) says the browser version cannot sign transactions, and lists macOS 14 (Sonoma) or later with Touch ID, or Windows with Windows Hello. Bron's [bug bounty scope](https://bugbounty.bron.org/rewards-desktop) describes the app as built with Wails (Go backend, React UI) and storing shards with the TPM on Windows and the Keychain on macOS.

We could not find a version number or first release date. The earliest evidence we found is Bron's web app code archived on [31 October 2025](https://web.archive.org/web/20251031022917/https://app.bron.org/static/index-DlpGkibS.js), which already contains macOS and Windows download links and the message "This version of the Bron app is no longer supported."

Bron publishes its MPC cryptography library ([bron-crypto](https://github.com/bronlabs/bron-crypto), Apache-2.0) and SDKs; we found no published source code for the desktop or mobile apps.

## Analysis

We downloaded the desktop app but could not sign in: it kept looping between asking for the signing key, scanning a QR code and entering the passkey.

The verdict rests on Bron's published design, which is the same as for the [Android and iPhone app](/mobile/org.bron.mobile/):

- **Shards:** the Wallet Terms give one "Shard" each to the user, to Bron and to a third party (TTP) "specified by us". They state "At least two Shards must participate" to authorize a transaction. The [FAQ](https://bron.org/faq) states "Any two of the three shards can recreate the key." It names the third party as Qrypt.com, which "cannot be changed". The mobile app's signup checkbox we saw spells it "Qrypto".
- **Recovery without your device:** per the FAQ, "Qrypt generates a new shard, together with the cryptographic material held by Bron."
- **Emergency key export:** the Wallet Terms say Bron "may make available" a "Key Export Feature" if Bron stops operating. Bron's [support article](https://support.bron.org/en/articles/14171309-private-key-recovery-for-use-only-if-bron-shuts-down-permanently) describes it as requiring a previously trusted device and a response file from Qrypt. Its import instructions do not mention Bitcoin. We did not test it.
- **Unpaid fees:** the Wallet Terms say Bron "may suspend or restrict access to your Wallet" if a subscription fee remains unpaid. The current [FAQ](https://bron.org/faq), however, says that after the trial "your assets stay under your control and you can send them at any time". This is a terms clause, not something we observed, and it does not decide the verdict.

Bron says it and the third party "act only on your instructions", and calls collusion "hard to imagine". These are contractual safeguards; we could not check whether they are also enforced cryptographically. By Bron's published design, two parties other than the user hold enough shards to recreate the key, and the only documented key export still depends on the third party. Our [custodial definition](/methodology/#custodial) states that a claim of access "shared between multiple parties" does not change the outcome. We therefore rate Bron Wallet **custodial**.
