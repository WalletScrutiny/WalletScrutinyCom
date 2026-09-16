---
title: 'Peer: Pay & Earn'
date: 2026-09-16
authors:
- danny
website: https://www.zkp2p.xyz
android:
  appId: com.zkp2p.mobile.dev
  users: 1000
  appCountry: us
  released: 2025-10-21
  updated: 2026-09-01
  version: 1.1.32
  reviews: 2
  icon: com.zkp2p.mobile.dev.png
  meta: ok
  verdict: nobtc
  developerName: P2P Labs, Inc.
iphone:
  appId: com.zkp2p.mobile.dev
  idd: '6749191100'
  appCountry: us
  released: 2025-11-06
  updated: 2026-09-14
  version: 1.1.34
  reviews: 22
  icon: com.zkp2p.mobile.dev.jpg
  meta: ok
  verdict: nobtc
  developerName: P2P Labs Inc.

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6749191100" author="overtorment" severity="high" finding="A Wise WebView harvests rail login material and uploads seller credentials to ZKP2P." note="Per overtorment’s analysis of the iPhone app, build 1.1.30: he found no wallet recovery phrase or private key being sent anywhere. What he found is on the selling side. When a seller sets up automatic release, the app opens their payment provider inside a hidden web view and injected scripts collect the login material — Wise passwords, access tokens, and session data for Venmo, Cash App, PayPal and Chime — then upload an encrypted bundle to ZKP2P’s servers. His own assessment is that this is how the product proves a payment was really sent, and is “product-shaped, not seed theft”, but that it is still confirmed credential upload from the device. This affects sellers; it is not part of ordinary buying or holding. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

Peer is published by P2P Labs, Inc. and is built around ZKP2P, a system for swapping between ordinary money and digital dollars without an exchange in the middle. The app holds a balance in USDC on the Base network, lets people pay each other by username, buy and sell using Venmo, Cash App, PayPal, Wise and similar services, and trade on Hyperliquid. It advertises Bitcoin prominently, including a Google Play screenshot showing a Bitcoin position with Buy and Sell buttons under the caption "Trade spot via Hyperliquid".

## Testing and Analysis

This assessment was recorded on 2026-09-16 using the Android app, version 1.1.32, installed from [Google Play](https://play.google.com/store/apps/details?id=com.zkp2p.mobile.dev). Screenshots are published in [this thread](https://x.com/BitcoinWalletz/status/2100145477119533182) and [this one](https://x.com/BitcoinWalletz/status/2100146994195075366). Both entries on this page are the same product.

Peer is unusual among the apps in this group. Most of them simply have nothing to do with Bitcoin. Peer handles Bitcoin constantly — it will take bitcoin from you, and it will send bitcoin to other people — but at no point does it let you hold any. The balance is always USDC.

### Your balance is USDC, and the app says so on every screen

The receive screen carries two labels at the top, "Main Wallet" and "USDC on Base", before you choose anything. Under them is a grid of networks to receive from, and Bitcoin is one of them, alongside Base, Ethereum, Solana, Arbitrum, Robinhood Chain, BNB, Polygon, Zcash, HyperEVM, NEAR and Tron.

Choosing Bitcoin produces a genuine Bitcoin address, `bc1q736kkd…9xkrmu6x`, a "Waiting for deposit…" status, and this instruction:

> Send 0.0001 BTC or more on Bitcoin. You'll receive USDC on Base.

That is the app stating plainly what it does. Real bitcoin goes in, dollars come out, and nothing bitcoin-shaped remains in the account.

The send screen is the same in reverse. It reads "Available: 0.00 USDC" and "Send USDC from your Base balance to any wallet on any supported network." A recipient can be set to receive BTC, but the explanation underneath says "You pay from your Base USDC, and Peer bridges or converts automatically when the destination is different, which can add a small fee and a short wait." You are not spending bitcoin; you are spending dollars that Peer turns into bitcoin for the person at the other end.

### The Buy screen asks you for a Bitcoin wallet, because the app is not one

The clearest evidence is what happens when you buy Bitcoin. After choosing to pay with dollars through Venmo, the app asks where to deliver it, and the panel says:

> **No saved wallets** — Add a wallet address for Bitcoin

with options to add an address or scan a QR code.

An app that could hold bitcoin would not need to ask. Peer requires an address somewhere else because it has nowhere of its own to put it.

### There is no Bitcoin key in the app

Peer's keys are managed for the user rather than written down as a recovery phrase. The wallet export screen shows a single Ethereum-style address, `0xb0cb…cA6e`, and says "For your security, exporting keys can only be done in a secure web environment", offering to open the process in a browser. There is no recovery phrase to record and no Bitcoin key of any kind.

This matches overtorment's description of the app as using a Privy hardware-enclave wallet rather than a seed phrase.

### The Bitcoin you can see is a price, or a position

Two other places show Bitcoin. The home screen has a "Discover crypto" list with a Bitcoin price, which is a quote rather than a holding. The Trade section offers spot trading through Hyperliquid, which gives a Bitcoin-denominated position on Hyperliquid's own system. We did not fund an account or open a position, so we did not examine what that position consists of — but it is reached through the Trade tab, not through the wallet, and it does not produce a Bitcoin balance or address in the app.

### overtorment's finding was not tested

His finding concerns sellers, not Bitcoin, and we did not exercise the seller flow. We deliberately did not connect any payment provider account, so we did not see the web view he describes and cannot confirm or contradict him. He analysed build 1.1.30 on iPhone; we used 1.1.32 on Android.

### Verdict: does not support Bitcoin (BTC)

Peer will accept bitcoin and convert it to dollars, and it will convert dollars into bitcoin for somebody else, but it gives the user no way to hold bitcoin: no Bitcoin balance, no Bitcoin address of their own, and no Bitcoin key. When asked to deliver Bitcoin it requires the address of a different wallet. A product that must borrow someone else's Bitcoin wallet to hand over Bitcoin is not one itself. Both entries on this page are the same product, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**.

The review stops at the Bitcoin-support gate. The seller credential finding above is overtorment's research, recorded here so readers can weigh it; it is not a finding of ours. Custody and source availability are not assessed.
