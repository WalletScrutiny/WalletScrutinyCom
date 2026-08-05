---
wsId: vultisig
title: 'Vultisig: Seedless Wallet'
date: 2026-07-28
authors:
- danny
website: https://vultisig.com
twitter: vultisig
social:
- https://discord.com/invite/54wEtGYxuv
- https://t.me/vultisig
- https://www.instagram.com/vultisig
features:
- foss
- multiSig
- tradeAlts
redirect_from:
- /android/com.vultisig.wallet/
- /iphone/com.vultisig.wallet/
android:
  appId: com.vultisig.wallet
  users: 10000
  appCountry: us
  released: 2024-07-01
  updated: 2026-07-30
  version: 1.0.116
  reviews: 13
  icon: com.vultisig.wallet.png
  meta: ok
  verdict: sourceavailable
  developerName: Vulti Holdings Ltd.
  repository: https://github.com/vultisig/vultisig-android
iphone:
  appId: com.vultisig.wallet
  idd: '6503023896'
  appCountry: us
  released: 2024-09-16
  updated: 2026-07-31
  version: '1.43'
  reviews: 62
  icon: com.vultisig.wallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Vulti Holdings Limited
  repository: https://github.com/vultisig/vultisig-ios

---

## Android

## App Description

Vultisig Wallet is an Android cryptocurrency wallet that advertises a seedless design using a Threshold Signature Scheme (TSS) to split signing authority across multiple parties — either user-controlled devices, or a user device plus Vultisig's VultiServer — instead of relying on a single recovery phrase.

The app explicitly lists Bitcoin support, alongside Ethereum, Solana, and other blockchains, according to its Google Play description.

Vultisig emphasizes multi-device access and threshold-based transaction signing rather than traditional single-key storage.

## Analysis

**Update 2026-07-28:** After reviewing [Vultisig's dispute](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/954) and the Android, iOS and VultiServer source, we withdrew our earlier custodial classification. The previous reasoning incorrectly treated the absence of a seed phrase and VultiServer's participation in Fast Vault signing as evidence that the user lacked custody. Fast Vault gives the user access to backups of both threshold shares, while Secure Vault has no provider-held share.

Our [testing](https://x.com/BitcoinWalletz/status/2004371037581201749/photo/1) found two setup modes. Fast Vault, the default, is a 2-of-2 threshold vault between the user's device and Vultisig's VultiServer. Secure Vault uses shares held across the user's own devices.

In Fast Vault the server holds one of the two shares and cannot sign on its own. During setup, Vultisig emails an encrypted backup of the server share, protected by a password the user sets. The same email carries the verification code required before the app saves the vault and completes onboarding, so setup verifies access to the message containing that backup. The app then prompts the user to export the device share as a `.vult` file and issues a monthly backup reminder unless the user disables it.

With both shares and the password, the user can import the server share on another device and sign without VultiServer. Vultisig also publishes open-source tooling intended to reconstruct the private key from the threshold shares. Secure Vault instead keeps all signing shares on user-controlled devices; Vultisig may provide relay transport but is not a signing party.

The app therefore allows self-custody. Recovery resilience remains a concern: the DKLS raw-key recovery path we found is concentrated in one community-tools codebase built on Vultisig's wrappers around the Silence Laboratories library. Vultisig's own `recovery-cli` still handles GG20 only, and we found no independent DKLS implementation that reads Vultisig backups. That is a tooling and format-specification concern rather than a custody one.

One security caveat found during this review, which does not affect custody: the password that protects the emailed server-share backup is sent to VultiServer at vault creation and again on every fast-signing request, so it is not a secret from the provider. The current server code derives the AES-GCM key with a single unsalted SHA-256 of that password, where the Android device-share backup uses PBKDF2 with 600,000 iterations and a random salt. Users should choose a strong, unique password for the Fast Vault backup.

Our verdict is **sourceavailable**: the Android and iOS source is public and we will follow up with reproducibility verifications.

{% include featureEvidence.html feature="multiSig" quote="The first multi-chain, multi-asset, multi-signature wallet in the world for everyone." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="You can deposit, send, swap and more inside Vultisig." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Open-Source Audited" source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiSig" quote="TSS threshold signature technology • Multi-signature security without complexity" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="You can deposit, send, swap and more inside Vultisig." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Open-Source Audited" source="Website" %}
