---
title: 'Coconut Wallet: Bitcoin Wallet'
date: 2026-01-14
website: https://noncelab.com
twitter: CoconutWallet
features:
- companion
- multiSig
- coinCtrl
- batching
- foss
appCountry: us
redirect_from:
- /iphone/onl.coconut.wallet/
android:
  appId: onl.coconut.wallet
  users: 1000
  appCountry: us
  released: Jul 18, 2025
  updated: 2026-08-28
  version: 0.16.0
  icon: onl.coconut.wallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Nonce Lab Inc.
  repository: https://github.com/noncelab/coconut_wallet
iphone:
  appId: onl.coconut.wallet
  idd: '6745778545'
  appCountry: us
  released: 2025-07-22
  updated: 2026-08-28
  version: 0.16.0
  reviews: 2
  icon: onl.coconut.wallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Nonce Lab Inc.
  repository: https://github.com/noncelab/coconut_wallet

---

## App Description

Coconut Wallet (`onl.coconut.wallet` on both Google Play and the App Store) is a watch-only Bitcoin wallet from Nonce Lab Inc., a Seoul-based company. It is the online half of an air-gapped pair: it holds no private keys, and instead syncs balances, builds transactions and broadcasts them, while signing happens on a separate offline device — either the same developer's [Coconut Vault](https://github.com/noncelab/coconut_vault) app or a third-party signer. The App Store listing describes it as "a watch-only Bitcoin wallet that's easy enough for beginners" and states it "is compatible with Coconut Vault, Keystone, SeedSigner, and Jade wallets", with watch-only import by extended public key or descriptor.

## Testing and Analysis

### The keys are not on this device, and not with the provider

The project's own architecture description is explicit that this app never holds key material:

> **Coconut Wallet** is a **watch-only Bitcoin wallet** designed to work with [Coconut Vault](https://github.com/noncelab/coconut_vault). By operating the vault and wallet on two physically separate devices, it implements a **secure air-gapped transaction signing architecture** where private keys never touch an online device.

The repository states the division of labour directly — the offline side does "Key storage" and "Tx signing", the online side does "Balance sync", "Tx creation" and "Broadcasting" — and summarises the app as "No hot wallet. Watch-only only." Transactions are exchanged between the two halves as BIP-174 PSBTs over QR codes.

This makes the product self-custodial by construction rather than by promise: there is no account with the provider, and the signing key lives on hardware the user controls.

### Why a keyless app is still a wallet

An app that holds no keys cannot lose your coins by itself, and that has previously been grounds for treating companion apps as "not a wallet" — the classification once applied to AirGap Wallet and Ledger Live, and questioned in [issue #140](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/140).

We do not read it that way here. That rule was written for portfolio trackers — "if it's called 'wallet' but is actually only a portfolio tracker" — and this is not one. A tracker shows you numbers; Coconut Wallet constructs the spend, selects the inputs, bumps the fee and broadcasts the signed result.

More importantly, the premise that it cannot lose your coins is wrong in the case that matters. The signing device can only display what the companion hands it. If the companion substitutes a recipient address and the user approves it on the smaller screen without checking, the funds are gone — without any key ever leaving the offline device. That is the argument made in issue #140: companion apps get trusted in practice, so they should be verifiable too. Our own `companion` feature definition puts it plainly — "an unverifiable companion app undermines the security of an otherwise reproducible signing device."

We therefore treat this as a Bitcoin wallet and hold it to the same source and reproducibility standards as any other.

### The source is public and covers the shipping release

This is the test that decides the verdict, and it is the one most apps in this category fail. Coconut Wallet passes it cleanly:

- The app is published at [github.com/noncelab/coconut_wallet](https://github.com/noncelab/coconut_wallet) under the **MIT License**, "Copyright (c) 2024 Nonce Lab, Inc." — an OSI-approved licence, not a source-available one.
- The repository carries a **`v0.16.0` tag**, and `pubspec.yaml` at that tag declares `version: 0.16.0+88`, with per-platform build numbers `ios_mainnet: 0.16.0+1` and `aos_mainnet: 0.16.0+84`.
- Both stores are shipping **version 0.16.0**, updated 2026-08-28.

The published source therefore matches the release under review on both platforms, rather than trailing it. One repository, one licence and one tag cover the Android and iOS builds alike, which is why both entries carry the same verdict. The repository is also ahead of the store — a `v0.17.0` tag already exists — which is the correct direction for our "up to date" rule: the code is released before or alongside the binary, not after it.

Note that the GitHub *Releases* page stops at v0.12.3 (2026-06-18) and is misleading on its own; the tags, not the releases, are what track the shipped versions.

### What this verdict does not cover

Source being public is not the same as the binary being verifiable, and two things in the repository would obstruct a build verification:

- Building requires an environment file that is not in the repository. The instructions say: "This project requires environment variables configured via `flutter_dotenv`. To obtain the env file for development, please contact us at hello@noncelab.com." `pubspec.yaml` bundles `mainnet.env`, `testnet.env` and `regtest.env` as assets, and `lib/constants/dotenv_keys.dart` shows exactly what they hold: `API_HOST`, `NETWORK_TYPE`, and eight Firebase client identifiers for push notifications. That is deployment configuration, not withheld application code — and the values are shipped inside the released binary, so a verifier can recover them rather than being locked out.
- The project explicitly discourages self-built mainnet use: "If you build and run the app from source on mainnet outside of official distribution channels (App Store / Google Play), we assume no responsibility for any loss of funds or errors that may occur."

Neither changes the source verdict, which asks whether the code for the shipping release is published, not whether the developer also hands over their config. They do mean a reproducibility attempt would have to reconstruct the `.env` first, and that a mismatch there would present as a build failure rather than as a source gap.

`API_HOST` is worth noting on its own: balance and transaction data are synced through a Nonce Lab backend rather than a user-supplied node, so the provider can observe which addresses a given user watches. That is a privacy consideration, not a custody one — the keys remain out of reach either way.

{% include featureEvidence.html feature="companion" quote="By operating the vault and wallet on two physically separate devices, it implements a secure air-gapped transaction signing architecture where private keys never touch an online device." source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig — Multi-signature wallet support" source="GitHub README" %}

{% include featureEvidence.html feature="coinCtrl" quote="UTXO management — Coin control with UTXO locking and tagging" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="Batch sending — Send to multiple recipients in a single transaction" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2024 Nonce Lab, Inc. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction" source="LICENSE" %}

### Verdict: sourceavailable

The wallet holds no keys and depends on no provider account, and the complete source for the version currently in both stores is published under the MIT License at a matching tag. Nothing here has yet been independently rebuilt, so the link between that source and the binaries Apple and Google ship remains unproven — which is exactly what our **sourceavailable** verdict means, and it is the verdict this app earns on both platforms.
