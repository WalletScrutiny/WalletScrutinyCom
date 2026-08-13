---
title: Tajir Wallet
date: 2026-07-21
website: https://tajirwallet.io/
redirect_from:
- /android/com.tajir.wallet.app/
- /iphone/com.tajir.wallet.app/
android:
  appId: com.tajir.wallet.app
  users: 1000
  appCountry: us
  released: 2025-08-13
  updated: 2026-08-07
  version: 2.2.91
  reviews: 3
  icon: com.tajir.wallet.app.jpg
  meta: ok
  verdict: nosource
  developerName: Tajir Web3 LTD
iphone:
  appId: com.tajir.wallet.app
  idd: '6749449673'
  appCountry: us
  released: 2025-12-03
  updated: 2026-08-11
  version: 2.2.91
  reviews: 7
  icon: com.tajir.wallet.app.jpg
  meta: ok
  verdict: nosource
  developerName: Tajir Holding Ltd

---

## App Description

Tajir Wallet is a multi-chain cryptocurrency wallet distributed for Android and iOS under the identifier `com.tajir.wallet.app`, published as Tajir Web3 LTD on Google Play and Tajir Holding Ltd on the App Store. The developer describes it as a non-custodial wallet in which only the user holds the private keys and recovery phrase, stating that Tajir "never stores or accesses your funds" and cannot recover them, and claims the app is licensed and audited in the United Arab Emirates. The listing describes support for Ethereum, BNB Smart Chain, Polygon, Arbitrum, Solana and Base, along with token and NFT management, a built-in DApp browser, and swaps routed through liquidity aggregators.

## Testing

Our [testing](https://x.com/BitcoinWalletz/status/2079444228724387902) confirms that the app provides a Bitcoin wallet and displays a **12-word recovery phrase** to the user. We exported that phrase and imported it into Electrum, which derived the same Bitcoin address the app had shown. The app therefore hands the user standard BIP39 key material that reconstructs their wallet in independent software, and it is **not custodial**.

## Analysis

The user holds the keys, so the remaining question is whether the app can be verified. It cannot: no source code is published.

A search of GitHub for the application ID `com.tajir.wallet.app` returns no repository belonging to the developer, and no repository references the developer's domain. The `tajir` organisation on GitHub is unrelated — it was created in 2015 and has no public repositories. Neither the Google Play listing nor the developer's website claims that the app is open source; the listing's transparency claim is regulatory ("licensed and audited in the United Arab Emirates"), which speaks to the operator's authorisation rather than to anything a user or reviewer can inspect. The developer's site, [tajirwallet.io](https://tajirwallet.io/), serves only a JavaScript application shell and publishes no source, build instructions, or audit report.

Without published source there is no way to confirm that the app builds from the code its developer claims to run, that the recovery phrase is generated from sound entropy, or that key material never leaves the device. A correct seed export demonstrates that the app behaved correctly in one observed instance; it cannot establish what the binary does in every other case. We therefore assign the verdict **nosource**.
