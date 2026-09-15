---
title: DIAM Wallet
date: 2026-09-15
authors:
- danny
website: https://diamante.io/
android:
  appId: com.diamante.diamwallet
  users: 50000
  appCountry: us
  released: 2023-08-21
  updated: 2025-12-05
  version: 4.4.9
  reviews: 68
  icon: com.diamante.diamwallet.png
  meta: ok
  verdict: nobtc
  developerName: DIAMANTE FINANCIAL TECHNOLOGIES L.L.C
iphone:
  appId: com.diamante.diamwallet
  idd: '6450691849'
  appCountry: us
  released: '2023-08-25T07:00:00Z'
  updated: 2025-12-07
  version: 4.4.9
  reviews: 53
  icon: com.diamante.diamwallet.jpg
  meta: ok
  verdict: nobtc
  developerName: DIAMANTE FINANCIAL TECHNOLOGIES L.L.C

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6450691849" author="overtorment" severity="critical" finding="Swipe-to-sign POSTs the live private key through an encrypt helper that returns its argument unchanged." note="Per overtorment’s analysis of the iPhone app, version 4.4.9: when a transfer or signing request is opened from a link and confirmed with a swipe, the app sends the wallet’s private key to Diamante’s own server (dwsprod.diamante.io). The data passes through a function named “encrypt” that returns it unchanged, so the key leaves the phone unencrypted. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

DIAM Wallet, published by Diamante Financial Technologies, is a self-custody mobile wallet built around the Diamante blockchain. It stores DIAM, Tether (USDT), USD Coin (USDC), BNB and Ether (ETH), and it can bridge DIAM from the Diamante network to Binance's network as a BEP-20 token. It also lets users back up their recovery phrase. Neither the Google Play nor the App Store description mentions Bitcoin.

## Testing and Analysis

This assessment was recorded on 2026-09-15.

### The app offers no Bitcoin network

We installed the Android app from [Google Play](https://play.google.com/store/apps/details?id=com.diamante.diamwallet), where the current version is 4.4.9, and created a new test wallet. The app's **Select a network** menu lists four networks:

- Diamante Mainnet
- Binance Mainnet
- Ethereum Mainnet
- TRON Mainnet

Bitcoin is not among them. We published the [screenshot of that menu](https://x.com/BitcoinWalletz/status/2099755596363047157).

The store listings agree. They name DIAM, USDT, USDC, BNB and ETH, and never Bitcoin. The in-app list also includes TRON, which the listings do not mention.

### overtorment's finding was not tested

overtorment's finding concerns transfers or signing requests opened from a link. To avoid sending a private key to the server, we did not open such a link or confirm any transaction, so we could not check the finding. He analysed the iPhone build, and the Android app is a separate binary.

### Verdict: does not support Bitcoin (BTC)

The released app's own network list has no Bitcoin. A wallet that offers no Bitcoin network cannot hold or send native Bitcoin, whatever else it supports. Both entries on this page are the same product with the same store description, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate. Custody and source availability are not assessed.
