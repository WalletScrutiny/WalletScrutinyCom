---
title: 'Zodl: Zcash Wallet'
date: 2026-07-21
website: https://electriccoin.co/
redirect_from:
- /android/co.electriccoin.zcash/
- /iphone/co.electriccoin.secant-mainnet/
- /mobile/co.electriccoin.secant-mainnet/
android:
  appId: co.electriccoin.zcash
  users: 50000
  appCountry: us
  released: 2024-04-29
  updated: 2026-07-12
  version: 3.7.2
  reviews: 20
  icon: co.electriccoin.zcash.png
  meta: ok
  verdict: nobtc
  developerName: Zcash Open Development Lab (ZODL)
iphone:
  appId: co.electriccoin.secant-mainnet
  idd: '1672392439'
  appCountry: us
  released: 2024-03-28
  updated: 2026-07-12
  version: 3.7.3
  reviews: 108
  icon: co.electriccoin.secant-mainnet.jpg
  meta: ok
  verdict: nobtc
  developerName: The Zerocoin Electric Coin Company

---

## App Description

Zodl is a Zcash (ZEC) wallet distributed for Android as `co.electriccoin.zcash` and for iOS as `co.electriccoin.secant-mainnet`, published by the Zcash Open Development Lab on Google Play and by The Zerocoin Electric Coin Company on the App Store. The app was previously named Zashi; the developer states in a Play Store reply that "Zashi and Zodl are the exact same app from the exact same team" and that only the branding changed. The listing describes it as self-custodial — "only you can access and manage your ZEC" — and as open source, stating that "anyone can inspect the protocol code, audit the wallet, and verify our work". Advertised functionality centres on shielded ZEC transactions, with the listing claiming the app does not collect or track wallet activity, balances, or transaction history.

## Testing

We confirmed that the app handles Zcash only. It offers no Bitcoin wallet, no Bitcoin receiving address, and no way to send or receive BTC. Neither store listing names Bitcoin as a supported asset; the only reference to it is the marketing description of Zcash as "encrypted Bitcoin", which describes the ZEC protocol rather than any Bitcoin functionality in the app.

## Analysis

walletscrutiny.com reviews Bitcoin wallets. Since this app does not store, send, or receive bitcoin, there is nothing for us to test: the questions we ask of a wallet — whether the user holds the keys, and whether the published binary matches its source — have no bearing on a user's bitcoin here, because the app never holds any.

We therefore assign the verdict **nobtc**. This is a statement of scope, not a criticism: it means the app falls outside what we assess, and implies nothing about its quality or security as a Zcash wallet.
