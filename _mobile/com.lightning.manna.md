---
wsId: mannaBitcoin
title: Manna Bitcoin Wallet
date: 2026-10-15
authors:
- danny
website: http://mannabitcoin.com/
twitter: MannaBitcoin
social:
- https://t.me/MannaBitcoin
redirect_from:
- /android/com.lightning.manna/
- /iphone/com.lightning.manna/
android:
  appId: com.lightning.manna
  users: 500
  appCountry: us
  released: 2025-05-14
  updated: 2026-10-07
  version: 1.2.33
  reviews: 8
  icon: com.lightning.manna.webp
  meta: fewusers
  verdict: custodial
  developerName: Manna Bitcoin
iphone:
  appId: com.lightning.manna
  idd: '6745337602'
  appCountry: us
  released: 2025-05-16
  updated: 2026-10-09
  version: 1.2.33
  reviews: 12
  icon: com.lightning.manna.webp
  meta: ok
  verdict: custodial
  developerName: Manna Open Economy LLC

---

## Android

## App Description

Manna calls itself a self-custodial Bitcoin wallet for Lightning and on-chain payments. It also has a point-of-sale mode, a BTC Map, a price chart and an encrypted chat.

The source code is now public under the MIT license at [MannaBitcoin/manna_app](https://github.com/MannaBitcoin/manna_app). The repository appeared on 2026-09-22, after our first review. This update reviews commit [`bdfbd186`](https://github.com/MannaBitcoin/manna_app/tree/bdfbd186d640aad38ea3060a68b1371368a81ac7), the only public state so far. That code is version 1.2.25, while the stores ship 1.2.33, so the public source is behind the apps people install.

## Analysis

**Manna is no longer a Liquid wallet.** Our first review (May 2026) found a Liquid wallet that relied on Boltz swaps for on-chain Bitcoin. The current app tells users ["Manna is now Spark Wallet"](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/screens/wallet_screen.dart#L117). Old Liquid balances stay reachable on a legacy screen, and the app suggests importing the seed into a Liquid wallet such as Blockstream Green to spend them.

**The seed is made on your phone.** The app generates a 12-word seed on the device ([`wallet_service.dart#L450`](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/services/wallet_service.dart#L450)) and gives it to the Breez SDK, which runs the Spark wallet ([`#L160-L168`](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/services/wallet_service.dart#L160-L168)). The SDK runs with its default settings apart from the API key, so Lightspark acts as the Spark service provider.

**On-chain Bitcoin goes into Spark.** The "receive Bitcoin" address now comes from the Spark SDK ([`transaction_service.dart#L53`](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/services/transaction_service.dart#L53)), not from Boltz. Coins sent there are claimed into your Spark balance. Sending to a Bitcoin address uses the SDK's normal withdrawal ([`confirm_payment_bottom_sheet.dart#L168`](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/widgets/bottom%20sheets/confirm_payment_bottom_sheet.dart#L168)). That withdrawal is a cooperative exit: the Spark service provider must help build it.

**Lightning addresses run through Manna's servers.** Usernames like `name@mannabitcoin.com` are mapped to a Spark key in Manna's database ([`db_service.dart#L613-L629`](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/services/db_service.dart#L613-L629)). The server that answers these Lightning addresses is not in the repository, so we could not check it.

**Can you get your bitcoin out without anyone's help?** No, not from the app. Spark lets a user leave on their own (a "unilateral exit") if the operators go offline or refuse. The Breez SDK that Manna bundles offers this. But Manna's only use of it is commented out ([`wallet_service.dart#L138-L143`](https://github.com/MannaBitcoin/manna_app/blob/bdfbd186d640aad38ea3060a68b1371368a81ac7/lib/services/wallet_service.dart#L138-L143)), and nothing in the app builds such an exit. If the Spark operators stopped cooperating, a Manna user would have no way to move their balance on-chain from the app.

## Verdict

We consider Manna **custodial**. The seed is yours, but every balance the app shows as Bitcoin or Lightning sits in Spark. Moving it on-chain needs the cooperation of the Spark service provider and operators. We apply the same test to all Spark wallets ([issue #947](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/947)).

This would change if the app let users exit on their own, for example by exporting the exit data or building the exit transaction itself.

---

## iPhone

{% include copyFromAndroid.html %}
