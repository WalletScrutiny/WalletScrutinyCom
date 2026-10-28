---
title: Qubetics Wallet
date: 2026-10-28
authors:
- leo
twitter: qubetics
redirect_from:
- /iphone/com.qubetics.wallet/
android:
  appId: com.qubetics.wallet
  users: 5000
  appCountry: us
  released: May 26, 2025
  updated: 2025-11-13
  version: 1.1.5
  reviews: 19
  icon: com.qubetics.wallet.webp
  meta: ok
  verdict: sourceavailable
  developerName: Qubetics
iphone:
  appId: com.qubetics.wallet
  idd: '6746333540'
  appCountry: us
  released: '2025-11-14T08:00:00Z'
  updated: 2026-03-06
  version: 1.0.1
  reviews: 29
  icon: com.qubetics.wallet.webp
  meta: ok
  verdict: sourceavailable
  developerName: Qubetics Labs LLC

---

## App Description

Qubetics Wallet is a multi-chain wallet by Qubetics, the team behind the Qubetics blockchain and its TICS token. The Play description lists "Bitcoin, Ethereum, Solana, BNB Chain, TRON, Polygon, and Qubetics Chain", on-chain and cross-chain swaps, NFTs, a dApp browser, WalletConnect, and an optional "decentralized private connectivity layer" for routing traffic. It calls itself "fully non-custodial, giving you complete control over your private keys", with "Secure local key storage with encryption".

## Analysis

- **Bitcoin support.** Bitcoin is in the description's list of chains. In the source, the wallet derives a native Bitcoin address and key from the user's seed with Trust Wallet Core (`CoinType.BITCOIN` in [`WalletHandler.java`](https://github.com/Qubetics/qubetics-mobile-app/blob/main/android/app/src/main/java/com/qubetics_app/WalletHandler.java)). This is BTC on the Bitcoin network, not a wrapped token.
- **Custody.** The recovery phrase is generated on the device: `CreateWallet.generateMnemonics` creates a new Trust Wallet Core `HDWallet` and derives the addresses from its mnemonic locally. The app also has a separate "Chain Abstraction Protocol" feature that generates "MPC" addresses and saves them to Qubetics' backend (`mpc/saveMpcWallets`). We did not analyze that feature. The custody of the main wallet's BTC does not depend on it.
- **Source code.** The [Qubetics GitHub organization](https://github.com/Qubetics), linked from [qubetics.com](https://www.qubetics.com/), publishes two MIT-licensed repositories for the app, [wallet-mobile-app](https://github.com/Qubetics/wallet-mobile-app) (created 2026-10-16) and [qubetics-mobile-app](https://github.com/Qubetics/qubetics-mobile-app) (created 2026-10-23, "Prepare repository for public release"). Both build the app ID `com.qubetics.wallet` ([`build.gradle`](https://github.com/Qubetics/qubetics-mobile-app/blob/main/android/app/build.gradle)).
- **Version mismatch.** Google Play ships version 1.1.5 from 2025-11-13. Both repositories declare `versionName "1.1.8"` and have no tags. The history of wallet-mobile-app goes back to 2025, but no commit sets version 1.1.5, so we could not identify the exact source of the release on Google Play.

The wallet is self-custodial and its source is public under the same app ID. We have not yet tried to build it. The source would first have to be matched to the version on Google Play. See [our methodology](/methodology/#sourceavailable).

## iOS

There is also an [iOS version on the App Store](https://apps.apple.com/us/app/id6746333540). It is published by Qubetics, the same provider, and it is the same wallet, so the same verdict applies to it. The iOS project is in the same repository, under [`ios/`](https://github.com/Qubetics/qubetics-mobile-app/tree/main/ios). We have not tried to build it.

**Source code is available**
