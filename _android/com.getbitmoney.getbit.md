---
wsId: getbit
title: GetBit
altTitle:
authors:
  - danny
users: 1000
appId: com.getbitmoney.getbit
alternativeStores:
appCountry:
released: 2023-01-16
updated: 2026-05-18
version: 2.00.52
reviews:
website: https://www.getbit.money
repository:
icon: com.getbitmoney.getbit.png
bugbounty:
meta: ok
verdict: custodial
date: 2026-05-27
signer:
twitter: GetBitDotMoney
social:
  - https://www.linkedin.com/company/getbitdotin
redirect_from:
developerName: GetBit
builds:
features:
---

## Analysis

GetBit is an Indian Bitcoin-only exchange app. Users buy Bitcoin through the app, GetBit
holds the funds in a custodial balance, and users can later request a withdrawal to an
external wallet they control. This is the same model as Coinbase or Binance — custodial
exchange with an optional exit — not a non-custodial service like Changelly where Bitcoin
is sent directly to your address at purchase time.

The scheduled withdrawal processing (thrice a week per their own website) confirms that
GetBit holds the funds between purchase and withdrawal. One App Store reviewer (harsh_truth,
Oct 2025) notes withdrawals can be delayed indefinitely with no ETA provided.

GetBit is a **custodial** Bitcoin broker, not a wallet. Investigation stops here.
