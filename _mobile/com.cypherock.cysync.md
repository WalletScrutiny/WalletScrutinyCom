---
wsId: cypherrockCySync
title: Cypherock CySync Crypto Wallet
date: 2026-05-27
authors:
- danny
website: https://www.cypherock.com/
twitter: CypherockWallet
social:
- https://www.facebook.com/cypherock
- https://www.linkedin.com/company/cypherockwallet
redirect_from:
- /android/com.cypherock.cysync/
- /iphone/com.cypherock.cysync/
android:
  appId: com.cypherock.cysync
  users: 1000
  released: 2025-03-28
  updated: 2026-05-18
  version: 0.1.22
  icon: com.cypherock.cysync.png
  meta: ok
  verdict: nowallet
  developerName: Cypherock
iphone:
  appId: com.cypherock.cysync
  idd: '6743165054'
  appCountry: us
  released: '2025-04-08T07:00:00Z'
  updated: 2026-05-22
  version: 0.1.22
  reviews: 3
  icon: com.cypherock.cysync.jpg
  meta: ok
  verdict: nowallet
  developerName: HODL Tech Private Limited

---

## Android

## App Description

Cypherock CySync is the companion app for the Cypherock X1 hardware wallet. It also supports
Ledger, Metamask, Phantom, and any BIP-39 compatible wallet. The app offers portfolio tracking
across 18,000+ assets, send/receive, token swaps across 15+ networks, WalletConnect for dApp
access, and a fiat on-ramp powered by Binance Connect.

## Analysis

CySync Android is a companion app for the Cypherock X1 hardware wallet. It does **not function
as a standalone wallet**. Testing confirms that the app presents no wallet functionality whatsoever until a QR code is scanned from the Cypherock X1 hardware device. There is no option to create or import a wallet via seed phrase or private key on the phone itself.

See the [test screencast](https://x.com/BitcoinWalletz/status/2059575146260934841) for a
demonstration of a fresh install with no hardware device connected — the app is inert.

Private key material never resides on the phone. This app is **not a wallet**.

---

## iPhone

{% include copyFromAndroid.html %}
