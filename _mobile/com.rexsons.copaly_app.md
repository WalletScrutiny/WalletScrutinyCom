---
wsId: copalyBitcoin
title: 'Copaly: P2P .Bitcoin & Utility'
verdict: custodial
date: 2026-05-19
authors:
- danny
website: https://copaly.com
twitter: mycopaly
social:
- https://www.linkedin.com/company/mycopaly
- https://www.facebook.com/CopalyApp
redirect_from:
- /android/com.rexsons.copaly_app/
- /iphone/com.copalycompany.CopalyApp/
android:
  appId: com.rexsons.copaly_app
  users: 1000
  released: 2022-07-25
  updated: 2026-05-07
  version: 5.2.10
  icon: com.rexsons.copaly_app.png
  meta: ok
  developerName: Copaly
iphone:
  appId: com.copalycompany.CopalyApp
  idd: '6452400536'
  appCountry: ng
  released: 2024-07-25
  updated: 2026-05-13
  version: 5.2.10
  reviews: 3
  icon: com.copalycompany.CopalyApp.jpg
  meta: ok
  developerName: Copaly Technologies Ltd

---

## Android

## App Description

Copaly is a crypto trading and wallet app. The Play Store listing says users can create and verify an account, then trade, send, receive, swap, and store Bitcoin and other cryptocurrencies. It also advertises peer-to-peer trading, QR-code payments, email and phone-number transfers, and withdrawals to local bank accounts.

The Copaly website describes the platform as an account-based crypto service for trading, saving, swapping, accepting crypto payments, and withdrawing funds.

## Testing and Analysis

We reviewed the Play Store listing and the Copaly website.

Copaly clearly supports Bitcoin. The Play Store listing says users can trade, send, receive, swap, and store Bitcoin. The Copaly website also advertises BTC support.

The custody question fails before source-code review. Copaly's own website describes the product as a custodial wallet:

> The Copaly custodial wallet is an idea that takes the financial structure and turns it into an economic freedom system.

The website also says:

> Set up your custodial wallet, begin trading BTC + 150 more from anywhere in the world.

The Play Store listing also describes account creation, account verification, trading, selling Bitcoin, and withdrawals to local bank accounts. Those are exchange/account-service signals, not evidence that users control the Bitcoin private keys.

At this stage, we found no evidence that Copaly gives users a seed phrase or private key for the Bitcoin held inside the Copaly account.

As a result, Copaly is classified as **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
