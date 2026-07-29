---
title: Omni Web3 Wallet
date: 2026-07-24
altTitle: Steakwallet
website: https://omni.app/
redirect_from:
- /android/fi.steakwallet.app/
- /iphone/com.thesteakwallet.app/
- /mobile/com.thesteakwallet.app/
android:
  appId: fi.steakwallet.app
  users: 10000
  appCountry: us
  released: 2021-07-07
  updated: 2026-05-06
  version: 4.0.1
  reviews: 28
  icon: fi.steakwallet.app.png
  meta: ok
  verdict: nosource
  developerName: Omni Wallet
iphone:
  appId: com.thesteakwallet.app
  idd: '1569375204'
  appCountry: us
  released: 2021-06-18
  updated: 2026-07-07
  version: 4.1.3
  reviews: 97
  icon: com.thesteakwallet.app.jpg
  meta: ok
  verdict: nosource
  developerName: Steakwallet

---

## App Description

Omni (formerly Steakwallet) is a self-custodial multi-chain Web3 wallet published under the identifier `fi.steakwallet.app` on Android and `com.thesteakwallet.app` on iOS. Its store listings describe sending, receiving, storing and swapping digital assets across many chains — Bitcoin, Ethereum, Solana and others — from a single app, and describe it as *"a non custodial wallet"* in which *"your crypto and private keys are entirely under your control,"* secured with biometric authentication and a *"unique 12-word secret phrase."* The listings also advertise staking and yield features, NFT management, and hardware-wallet (Ledger) support.

## Testing and Analysis

We did not test the app; this assessment is based on the provider's published material and a search for source code, on 2026-07-24.

**It is presented as a self-custodial Bitcoin wallet.** The provider states the user holds the keys and backs the wallet up with a 12-word recovery phrase, and the App Store release notes record that Bitcoin support was added in version 3.5.0 (June 2025). This supersedes an earlier WalletScrutiny record that listed the Android app as `nobtc` and `removed`; the app is live on both stores and now handles Bitcoin.

**We could not find published source code for the current app.** The wallet's former GitHub organisation (`github.com/steakwallet`) no longer exists, the `omni-app` organisation has no public repositories, and [omni.app](https://omni.app/) neither links to a source repository nor describes the app as open source. A GitHub code search for the Android application ID [`fi.steakwallet.app`](https://github.com/search?q=%22fi.steakwallet.app%22&type=code) returns only third-party wallet-connector registries (WalletConnect, RainbowKit, ConnectKit and similar) that list it as a known wallet to connect to — not any repository containing the app's own source. Steakwallet was reported to be open source earlier in its history, but if so, that source is no longer published for the current Omni release. Without published source, the self-custody and key-handling claims cannot be verified, and the binary cannot be reproduced.

**Verdict: nosource.** The app clears the earlier gates — it is a wallet, it now supports Bitcoin, and it presents itself as self-custodial rather than custodial — but its source code is not published, so it cannot be independently verified. Per WalletScrutiny policy, a wallet whose current release has no public source is classified source-unavailable.
