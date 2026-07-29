---
title: 'VELO: Bitcoin & USDT Wallet'
date: 2026-07-21
website: https://velo.cash
redirect_from:
- /android/cash.velo.app/
- /iphone/cash.velo.app/
android:
  appId: cash.velo.app
  users: 1000
  appCountry: us
  released: 2025-12-16
  updated: 2026-01-02
  version: 1.0.8
  icon: cash.velo.app.png
  meta: ok
  verdict: nosource
  developerName: Monica.cash
iphone:
  appId: cash.velo.app
  idd: '6756588147'
  appCountry: us
  released: 2025-12-17
  updated: 2026-01-02
  version: 1.0.6
  reviews: 2
  icon: cash.velo.app.jpg
  meta: ok
  verdict: nosource
  developerName: Monica technologies limited

---

## App Description

VELO is a multi-chain cryptocurrency wallet distributed for Android and iOS under the identifier `cash.velo.app`, published as Monica.cash on Google Play and Monica technologies limited on the App Store. The developer describes it as a non-custodial wallet whose "private keys never leave your device", stating that it cannot access user funds, freeze accounts, or require identity verification, and that no KYC is needed. The listing's main advertised feature is gasless stablecoin transfers, sending USDT on Tron and USDC on Ethereum and BNB Chain without holding the chain's native token for fees. Bitcoin is listed with "full send and receive", alongside native balances on Ethereum, Solana, BNB Chain and Tron, plus biometric and PIN protection, balance display in over 50 local currencies, and support for more than 150 languages.

## Testing

We installed the Android app and created a new wallet. The app displayed a **12-word recovery phrase**, and we imported that phrase into Electrum as a BIP39 seed. Electrum derived the same Bitcoin addresses the app had shown.

The app therefore provides the user with standard BIP39 key material that reconstructs the wallet in independent software. It is **not custodial**: a user holding these words can recover their bitcoin without the developer's cooperation.

## Analysis

The user holds the keys, so the remaining question is whether the app can be verified. It cannot: no source code is published.

A GitHub search for the application ID `cash.velo.app` returns no repository belonging to the developer, and searches for the developer's names and domain return nothing associated with this app. Neither the Google Play listing nor the App Store listing claims that the app is open source; their transparency claims concern self-custody rather than source availability.

Without published source there is no way to confirm how the recovery phrase is generated, whether key material remains on the device, or that the published binaries correspond to any reviewable code. Our seed export test shows the app behaved correctly in one observed instance; it cannot establish what the binary does in every other case. We therefore assign the verdict **nosource**.
