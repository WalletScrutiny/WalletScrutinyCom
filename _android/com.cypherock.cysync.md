---
wsId: cypherrockCySync
title: Cypherock CySync Crypto Wallet
altTitle: 
authors:
  - danny
users: 1000
appId: com.cypherock.cysync
alternativeStores: 
appCountry: 
released: 2025-03-28
updated: 2026-05-18
version: 0.1.22
reviews: 
website: https://www.cypherock.com/
repository: 
icon: com.cypherock.cysync.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2026-05-27
signer: 
twitter: CypherockWallet
social:
- https://www.facebook.com/cypherock
- https://www.linkedin.com/company/cypherockwallet 
redirect_from: 
developerName: Cypherock
builds: 
features: 

---

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

