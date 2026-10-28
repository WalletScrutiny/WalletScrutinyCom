---
title: P2P Trade
date: 2026-10-28
authors:
- leo
website: https://www.u2trades.com/
android:
  appId: com.p2p.u2trades
  users: 10000
  appCountry: us
  released: Sep 4, 2025
  updated: 2025-09-03
  version: 1.0.33
  icon: com.p2p.u2trades.webp
  meta: stale
  verdict: nobtc
  developerName: Twendee

---

**⚠️ Warning:** This app advertises Bitcoin trading with escrow, but its backend serves only test networks and its legal documents are copied from Hodl Hodl, a service it shows no connection to. Do not send it money or coins.

## App Description

P2P Trade is published on Google Play by Twendee for the website [u2trades.com](https://www.u2trades.com/). The Play Store description calls it a "peer-to-peer (P2P) crypto trading platform" for buying and selling Bitcoin and USDT with "Escrow Protection". Payment is by bank transfer or PayPal.

## Analysis

- **Bitcoin support.** Despite the app's summary "Buy, Sell BTC & Crypto", we found no Bitcoin network on the platform. The web app at u2trades.com calls the backend `be.u2trades.com`. On 2026-10-28 that backend's public network list (`https://be.u2trades.com/network`) returned only two networks: "Sepolia" (an Ethereum test network, chain ID 11155111) and "Binance Smart Chain Testnet" (chain ID 97). Neither is Bitcoin, and neither is a production network. The same backend's public advertisement list returned no offers (`"total":0`).
- **Custody.** The web app's code has wallet "Deposit" and "Withdraw" pages, a withdrawal request and verification flow, and admin pages for withdrawals and "platform/balances-analystic". This points to balances held on the platform rather than in a user-controlled wallet. We did not install the app.
- **Legal documents copied from another service.** The [Terms and Conditions](https://www.u2trades.com/terms-and-conditions) and [Privacy Policy](https://www.u2trades.com/privacy-policy) are Hodl Hodl's documents. They name "Hodlex Ltd", the Hodl Hodl platform and `accounts.hodlhodl.com`, with only the contact email changed to an `@lazy-research.com` address. We found nothing showing that u2trades is operated by or connected to Hodl Hodl.

The only networks the platform's backend serves are an Ethereum testnet and a BNB Smart Chain testnet. We found no Bitcoin support, so the app is {% include verdictBadge.html verdict="nobtc" type='short' %}.

**A wallet but not for Bitcoin**
