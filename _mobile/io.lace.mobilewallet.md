---
title: Lace
date: 2026-10-28
authors:
- leo
website: https://lace.io
twitter: lace_io
redirect_from:
- /iphone/io.lace.mobilewallet/
android:
  appId: io.lace.mobilewallet
  users: 5000
  appCountry: us
  released: Apr 20, 2026
  updated: 2026-10-07
  version: 2.4.2
  reviews: 3
  icon: io.lace.mobilewallet.webp
  meta: ok
  verdict: sourceavailable
  developerName: IOHK
iphone:
  appId: io.lace.mobilewallet
  idd: '6743856101'
  appCountry: us
  released: '2026-04-20T07:00:00Z'
  updated: 2026-08-24
  version: 2.2.0
  reviews: 16
  icon: io.lace.mobilewallet.webp
  meta: ok
  verdict: sourceavailable
  developerName: Input Output HK Limited

---

## App Description

Lace is a wallet by IOHK (Input Output), the company behind Cardano. The Android app launched in April 2026. The Play Store description calls it "the Lace non-custodial wallet" and "a multi-chain crypto wallet for storing your cryptocurrencies, including Bitcoin". It supports hardware wallets and dApp connections, and mainly manages Cardano (ADA) assets and NFTs.

## Analysis

- **Bitcoin support.** The launch post [Lace Mobile Is Here (Finally!)](https://www.lace.io/blog/lace-mobile-is-here-finally) says: "Our mobile app serves Cardano & Bitcoin". The mobile app's source pulls in the modules `@lace-module/blockchain-bitcoin`, `@lace-module/bitcoin-provider-maestro` and `@lace-module/bitcoin-mempool-fee-market` ([package.json](https://github.com/input-output-hk/lace/blob/main/apps/lace-mobile/package.json)). Bitcoin is behind a feature flag, `BLOCKCHAIN_BITCOIN` ([feature-flags.ts](https://github.com/input-output-hk/lace/blob/main/apps/lace-mobile/src/app/feature-flags.ts)). The same repository has Bitcoin PSBT signing for Ledger, Trezor and Keystone.
- **Custody.** The listing calls Lace "non-custodial". The repository has a recovery-phrase contract package (`packages/contract/recovery-phrase`) and local and in-memory key vaults (`packages/module/vault-local`, `vault-in-memory`). We found nothing indicating that keys are held by IOHK.
- **Source code.** A GitHub code search for `io.lace.mobilewallet` leads to the Apache-2.0 repository [input-output-hk/lace](https://github.com/input-output-hk/lace), which contains the mobile app in `apps/lace-mobile`. The [app.json](https://github.com/input-output-hk/lace/blob/main/apps/lace-mobile/app.json) there declares `"package": "io.lace.mobilewallet"`, and its Android version, 2.4.2, is the same as the version on Google Play. The newest mobile release tag is [lace-mobile@2.4.0](https://github.com/input-output-hk/lace/releases/tag/lace-mobile%402.4.0) (2026-09-29). Version 2.4.2 exists only on the `main` branch so far.

The app's current source is public under the same app ID, so Lace is [source available](/methodology/#sourceavailable). A reproducibility test is still to be done.

## iOS

There is also an [iOS version on the App Store](https://apps.apple.com/us/app/id6743856101). The provider's website links to it, and it is the same wallet, so the same verdict applies to it. The same `apps/lace-mobile` source declares the iOS bundle ID `io.lace.mobilewallet` in its [app.json](https://github.com/input-output-hk/lace/blob/main/apps/lace-mobile/app.json). We have not tried to build it.

**Source code is available**
