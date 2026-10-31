---
title: Kute Wallet
date: 2026-10-30
authors:
- danny
website: http://kutewallet.com
android:
  appId: com.kutewallet.app
  users: 100
  appCountry: us
  released: 2026-05-27
  updated: 2026-10-08
  version: 2.1.1
  icon: com.kutewallet.app.webp
  meta: fewusers
  verdict: wip
  developerName: REXMO TECHNOLOGIES OÜ

---

## App Description

Kute is an Android wallet for on-chain Bitcoin and Lightning. Its website says both share one balance. It supports Ledger, Jade, Keystone, Krux, Passport, and SeedSigner. It also supports watch-only xpub wallets. Users can open prediction-market positions, hold dollar-denominated USDB, and swap tokens.

## Testing and Analysis

The [website](https://kutewallet.com/) calls Kute a self-custody app. A Play user review mentions BDK and Spark; the developer listing mentions neither. We have not downloaded or inspected the APK. Spark use therefore remains unverified.

The website says on-chain Bitcoin and Lightning share one balance. How Lightning works, and whether users can exit independently, remain untested. Open positions move to Polymarket or Hyperliquid, remaining there under their rules until closed. USDB is dollar-denominated. The listing says incoming tokens convert to Bitcoin through a third-party swap.

The Play listing links no source repository. No App Store listing appeared in our search. Lightning and third-party-held balances need further custody review.

The website claims iOS availability. We found no App Store listing during this search.
