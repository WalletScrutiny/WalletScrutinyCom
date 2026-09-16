---
title: 'Perpex: Hyperliquid Copy Trade'
date: 2026-09-16
authors:
- danny
website: https://perpex.co
android:
  appId: com.celebit.perpex
  users: 100
  appCountry: us
  released: 2026-03-26
  updated: 2026-07-24
  version: 1.3.0
  icon: com.celebit.perpex.png
  meta: fewusers
  verdict: nobtc
  developerName: Celebit Ltd
iphone:
  appId: com.celebit.perpex
  idd: '6761027014'
  appCountry: us
  released: 2026-05-13
  updated: 2026-08-05
  version: 1.3.0
  reviews: 2
  icon: com.celebit.perpex.jpg
  meta: ok
  verdict: nobtc
  developerName: Celebit Ltd

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6761027014" author="overtorment" severity="high" finding="Copy-trade setup registers the Hyperliquid agent private key with api.perpex.co." note="Per overtorment’s analysis of the iPhone app, build 1.3.0: the account itself is not a write-down-your-words wallet, it is held in a Privy hardware enclave, and he found no recovery phrase being sent anywhere. Separately, when copy trading is set up the app creates a second key — a Hyperliquid “agent” key used to place trades on the user’s behalf — and sends that key in plain form to the developer’s own server at api.perpex.co, during onboarding and again from the copy-trade screen. His own assessment is that this is how server-side copy trading is built rather than a hidden third party, but it is still a private key leaving the device. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

Perpex is published by Celebit Ltd and is a trading app for Hyperliquid, a trading platform with its own network. Its selling point is copy trading: picking a trader and having the app place the same trades for you. Accounts are funded by depositing crypto, and balances and withdrawals are handled in USDC.

## Testing and Analysis

This assessment was recorded on 2026-09-16 using the Android app, version 1.3.0, installed from [Google Play](https://play.google.com/store/apps/details?id=com.celebit.perpex). Screenshots are published in [this thread](https://x.com/BitcoinWalletz/status/2100154611625787544) and [this one](https://x.com/BitcoinWalletz/status/2100155528408449262). Both entries on this page are the same product.

### Bitcoin goes in, but only as a way to fund a trading balance

Perpex does offer a Bitcoin deposit screen, and the address it gives is genuine: `bc1ph0kf9ayle52qrxws4t4mtqu6s8hgc84kaj08jv8j25crm8c523tqt3nu57`, a Taproot address, under the instruction "Only send BTC on Bitcoin to this address. Funds sent on another network may be lost." The screen shows "Waiting for transfer" and a minimum deposit of 0.0003 BTC.

The app also says what the deposit becomes. The asset on that screen is labelled:

> **BTC** — HyperUnit

HyperUnit is the bridge that carries Bitcoin onto Hyperliquid. Bitcoin sent to that address does not stay as bitcoin; it becomes a Hyperliquid-side asset that stands in for it. The app names the mechanism itself, so this is not an inference on our part.

### The way out is dollars

The withdraw screen removes any doubt about what the account holds. It is denominated in USDC — "Available Balance: 0.00 USDC", "Min. Withdraw: 2 USDC" — with no option to take Bitcoin back out.

So bitcoin can be paid in, and dollars can be taken out. At no point is there a Bitcoin balance the user holds or a Bitcoin payment the user can make.

### There is no Bitcoin key, and no recovery phrase at all

The account has no recovery phrase to write down. Keys are held for the user in a hardware enclave, as overtorment describes, which means there is no Bitcoin key in the app and nothing a user could take to another Bitcoin wallet.

### overtorment's finding was not tested

His finding is about the copy-trading feature, not about Bitcoin. We did not set up copy trading, so we did not see the key upload he describes and can neither confirm nor contradict it. He analysed the iPhone build; we used the Android build of the same version number.

It is worth separating two things for readers. The key he describes being uploaded is a trading agent key, created so the service can place trades for the user — it is not the key to the main account. That is a meaningful distinction, and it is his own framing.

### Verdict: does not support Bitcoin (BTC)

Perpex accepts bitcoin at a real Bitcoin address, but by the app's own label that deposit crosses the HyperUnit bridge and becomes a Hyperliquid asset. The balance is in dollars, withdrawals are in dollars, there is no Bitcoin key and no way to send bitcoin to anyone. Funding a trading account with bitcoin is not the same as holding it. Both entries on this page are the same product, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**.

The review stops at the Bitcoin-support gate. The agent key finding above is overtorment's research, recorded here so readers can weigh it; it is not a finding of ours. Custody and source availability are not assessed.
