---
title: 'Keeper: Crypto Wallet'
date: 2026-10-28
authors:
- leo
website: https://tonkeeper.com
twitter: keeper_wallet
android:
  appId: com.ton_keeper
  users: 10000000
  appCountry: us
  released: Oct 5, 2021
  updated: 2026-10-23
  version: 26.10.3
  reviews: 3564
  icon: com.ton_keeper.webp
  meta: ok
  verdict: sourceavailable
  developerName: Ton Apps Limited

---

## App Description

Keeper, formerly Tonkeeper, is a multichain wallet published by Ton Apps Limited. The Play Store description lists "TON, TRON, Ethereum, Bitcoin, Arbitrum, Base, BSC and more" and says all accounts are backed by "one recovery phrase that never leaves your device". It describes itself as "a non-custodial wallet: it does not store your funds or private keys and cannot access or recover them for you". It also offers swaps, staking, a dApp browser and support for Ledger, Keystone and Keeper Signer.

## Analysis

- **Bitcoin support.** The Play description names Bitcoin among the supported networks and BTC among the assets you can "Buy, swap, send and stake". The app's source code has a dedicated Bitcoin chain: [BlockchainKit.kt](https://github.com/tonkeeper/android/blob/main/lib/wallet/src/main/kotlin/com/tonapps/wallet/BlockchainKit.kt) signs `Chain.Bitcoin` transactions with the HD wallet derived from the recovery phrase. This is native BTC on the Bitcoin network, not a token on TON.
- **Custody.** The description says: "Your recovery phrase is generated on your device and stays there. There is no sign-up. There is no account anyone can freeze. Nobody, including us, can move your funds or hand them to someone else." We found nothing in the listing that suggests otherwise.
- **Source code.** The developer's website, [keeperwallet.com](https://keeperwallet.com/) (tonkeeper.com redirects there), links to the [tonkeeper GitHub organization](https://github.com/tonkeeper). Its [tonkeeper/android](https://github.com/tonkeeper/android) repository is GPL-3.0 licensed. Its build file sets `applicationId = "com.ton_keeper"`, the ID of this app, and it was last pushed on 2026-10-26. The repository's newest tag is `v26.10.4_1353`. The version on Google Play is 26.10.3, which has no tag of its own.

The source of this app is public and matches its app ID, so this wallet is [source available](/methodology/#sourceavailable). We have not yet tried to build it and compare the result with the Play Store version. A reproducibility test is still to be done.

**Source code is available**
