---
title: 'Metavest: AI Portfolio Agent'
date: 2026-10-30
authors:
- danny
website: https://metavest.app/
twitter: MetavestApp
social:
- https://www.facebook.com/Metavestapp
- https://www.linkedin.com/company/metavestapp
- https://discord.com/invite/8sex2Upn79
- https://t.me/metavestofficial
- https://www.instagram.com/metavestapp
- https://metavest.app
redirect_from:
- /android/app.metavest.mobile/
- /iphone/app.metavest.client/
android:
  appId: app.metavest.mobile
  users: 1000
  appCountry: us
  released: 2022-07-06
  updated: 2025-07-27
  version: 3.4.0
  icon: app.metavest.mobile.webp
  meta: stale
  verdict: nowallet
  developerName: Metavest
iphone:
  appId: app.metavest.client
  idd: '1622578169'
  appCountry: ph
  released: 2022-07-28
  updated: 2025-07-22
  version: 3.4.0
  reviews: 0
  icon: app.metavest.client.webp
  meta: stale
  verdict: nowallet
  developerName: Metavest Limited

---

**Update 2026-10-30:** Metavest is no longer a wallet. It turned into an AI portfolio tracker that [syncs your exchanges and wallets](https://metavest.app/) with "read only access", and the current store description says "We never hold your funds. All data connections are read-only via API keys or wallet addresses." Both apps are now {% include verdictBadge.html verdict="nowallet" type='short' %}. The analysis below describes the older custodial app.

## Android

## App Description from Google Play

  > Metavest integrates existing DeFi platforms and blockchains into a user-friendly interface to offer the best opportunities in the crypto market. Metavest at its core is positioned as an investment opportunity aggregator; its agile features, speed, and user experience shine out above other players in the market.
  >
  > We are pleased to announce the utility token of Metavest App, MVST which has been meticulously designed for its holders, including exclusive APR offers on fixed-income investment products and free crypto withdrawals per month as well as creating a detailed tier system
  >
  > Supports BTC.

## Analysis 

- After the email was verified, we tried accessing the bitcoin wallet. However, this message appeared:
  > KYC level 1 verification required. Please complete verification to access your wallet.
- We found their security page, where it was [mentioned](https://metavest.app/security) that:
  > The provider works with Fireblocks with a custodial solution.
- This explicitly proves that the provider is **custodial** and the app is **non-verifiable**.

---

## iPhone

The Android analysis above applies to the iPhone app too.
