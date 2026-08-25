---
title: Surge Credit
date: 2026-06-09
website: https://www.surge.credit/
redirect_from:
- /iphone/credit.surge.app/
android:
  appId: credit.surge.app
  users: 500
  appCountry: us
  released: 2026-04-08
  updated: 2026-08-13
  version: 1.0.13
  reviews: 5
  icon: credit.surge.app.png
  meta: fewusers
  verdict: custodial
  developerName: Amby, Inc.
iphone:
  appId: credit.surge.app
  idd: '6756261968'
  appCountry: us
  released: 2026-03-17
  updated: 2026-08-18
  version: 1.0.13
  reviews: 5
  icon: credit.surge.app.jpg
  meta: ok
  verdict: custodial
  developerName: Surge Credit

---

## App Description

Surge Credit provides a revolving dollar credit line backed by Bitcoin collateral. Users create a self-custodial wallet in-app or connect an existing one, then lock BTC in an on-chain Taproot vault (BIP341/BIP342) with custody enforced by a Distributed Custody Network (DCN) using threshold Schnorr signatures. Credit is issued as USDC via EVM chains (Base, Ethereum) and can be transferred or spent through gift cards. The service claims no KYC, no rehypothecation, fixed or variable rates, and collateral health monitoring.

## Analysis

The app's "non-custodial" claim does not hold under WalletScrutiny's definition. The Taproot vault has three pre-committed spend paths: cooperative repayment (user and DCN co-sign), DCN-controlled liquidation (triggered by collateral ratio breach or delinquency), and user-only exit after an approximate one-year timelock. The liquidation path gives the DCN unilateral authority to move the user's Bitcoin without the user's signature — the Bitcoin script enforces this authority directly without verifying whether real-world liquidation conditions were actually met.

Consider Bob, who locks 1 BTC as collateral for a USDC credit line. Surge's Coordination Layer determines that his position qualifies for liquidation, and at least three of the four DCN participants cooperate to produce the required threshold signature. The resulting transaction can move Bob's BTC to a DCN-controlled sweep address without Bob's signature. Bitcoin validates the DCN signature but does not independently verify the reported collateral ratio or delinquency. If the vault remains unspent, Bob can recover it alone after an approximately one-year relative timelock; this exit cannot recover BTC that was already liquidated.

Under WalletScrutiny's [custodial definition](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_data%2Fverdicts%2Fcustodial.yml?blame=1#L17), shared or conditional third-party access to funds is still custodial regardless of the technical sophistication of the arrangement.
