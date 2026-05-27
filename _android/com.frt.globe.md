---
wsId: globe
title: "Globe: Crypto Exchange"
altTitle:
authors:
  - danny
users: 1000
appId: com.frt.globe
alternativeStores:
appCountry:
released:
updated: 2025-08-06
version: 1.3.0
reviews:
website: https://globe.exchange
repository:
icon: com.frt.globe.png
bugbounty:
meta: ok
verdict: custodial
date: 2026-05-27
signer:
twitter: globedx
social:
  - https://t.me/GlobeOfficial
redirect_from:
developerName: Globe Exchange
builds:
features:
---

## App Description

Globe is a derivatives and spot cryptocurrency exchange. It offers perpetual futures with
a unified margin system accepting BTC, USDT, USDC, DAI, or GDT as collateral, spot
markets, WebSocket API, and zero maker fees. Users deposit funds into platform-managed
accounts and can withdraw crypto to external addresses.

## Analysis

Globe is a **custodial** exchange. The Play Store description states directly:

> "Cold wallet storage, offering offline security so that you can trade with peace of mind that your funds are secure"

Their [Terms of Use](https://globe.exchange/legal/terms-of-use) further confirm custody.
From the Representations and Warranties section:

> "you are the legal owner of any funds deposited to an account with Globe"

And from the Account Suspension clause:

> "During the investigation stage you will not be able to make deposits or withdrawals to your account"

Globe holds user funds in their cold wallets. There is no mention of private keys anywhere
in the terms or app description. Investigation stops here.
