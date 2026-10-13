---
title: 'Station: AI Crypto Wallet'
date: 2026-10-13
authors:
- danny
website: https://station.money/
twitter: StationWallet
social:
- https://discord.gg/cjr7Vybyrq
features:
- multiSig
- tradeAlts
redirect_from:
- /iphone/money.terra.station/
android:
  appId: money.terra.station
  users: 500000
  appCountry: us
  released: 2021-02-15
  updated: 2026-07-17
  version: 6.1.0
  reviews: 195
  icon: money.terra.station.webp
  meta: ok
  verdict: nosource
  developerName: Vulti Holdings Ltd.
iphone:
  appId: money.terra.station
  idd: '1548434735'
  appCountry: us
  released: 2021-02-17
  updated: 2026-07-16
  version: 6.1.0
  reviews: 267
  icon: money.terra.station.webp
  meta: ok
  verdict: nosource
  developerName: Vulti Holdings Limited

---

## App Description

Station is a multichain wallet for Android and iPhone, published by Vulti Holdings Ltd., the team behind Vultisig. It began as Terra Station, a wallet for the Terra blockchain, and keeps that app ID. Version 6.1.0 adds an AI agent that turns typed or spoken requests into transaction drafts, which the user confirms before anything is signed. Keys use 2-of-2 multi-party computation (MPC): one key share stays on the phone and the other on a Vultisig server, so there is no seed phrase. The app lists Bitcoin alongside Ethereum, Solana, Cosmos and other chains, plus cross-chain swaps and Cosmos staking.

## Testing and Analysis

Based on publicly available information, we found the following:

- **Bitcoin support.** The store description lists sending and receiving Bitcoin, with examples such as "send 0.1 BTC to bc1q...".
- **Custody.** The description says the key is split between the device and a Vultisig server share, that neither side can sign alone, and that "Vultisig cannot move your funds". The app calls itself self-custodial. We have not confirmed whether the user receives a backup of the server share. Without one, the user needs Vultisig's server to sign.
- **No source for the app.** The [website](https://station.money/) links to the [Vultisig GitHub organization](https://github.com/vultisig). It publishes the Vultisig Android and iOS apps and the [vultisig-sdk](https://github.com/vultisig/vultisig-sdk) library. The SDK names Station (`money.terra.station`) as one of its users, but we found no repository for the Station app itself.
- **The old repository is stale.** [stationmoney/station-mobile](https://github.com/stationmoney/station-mobile) uses the same app ID. Its last release is v2.0.0 from July 2022, and its last push was in November 2023. Both stores now ship version 6.1.0.

A shared library is not the app's source code. Without the source of the release users install, a reproducible build cannot be attempted.

**No source for current release found**
