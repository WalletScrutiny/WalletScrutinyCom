---
title: Orbit+ Wallet
date: 2026-09-16
authors:
- danny
website: https://velo.org
android:
  appId: com.velo.orbitplus
  users: 100
  appCountry: us
  updated: 2026-09-11
  version: 1.1.7
  icon: com.velo.orbitplus.png
  meta: fewusers
  verdict: nobtc
  developerName: LY Technology Pte. Ltd.
iphone:
  appId: com.velo.orbitplus
  idd: '6751701440'
  appCountry: gb
  released: 2025-11-11
  updated: 2026-09-14
  version: 1.1.7
  reviews: 0
  icon: com.velo.orbitplus.jpg
  meta: ok
  verdict: nobtc
  developerName: LY TECHNOLOGY PTE. LTD.

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6751701440" author="overtorment" severity="high" finding="Default wallet create uses Math.random as BIP39 entropy and again for the AES wrapping key." note="Per overtorment’s analysis of the iPhone app, version 1.1.3: when the app creates a new wallet it builds the recovery phrase using <code>Math.random</code>, a general-purpose number generator that is not meant for anything security-related, and it narrows each of the 16 bytes to a value between 0 and 99 instead of the full 0 to 255. Fewer possible wallets means a wallet somebody else could arrive at by searching. The same generator is used again for the key that encrypts the stored phrase. He found no phrase or key being sent anywhere. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

Orbit+ is published by LY Technology Pte. Ltd. and presents itself in-app as "Your secure gateway to Web3". It is a wallet for Ethereum-style networks, with a token list, an off-ramp for selling into local currency, a virtual debit card, a rewards scheme called Omni Points, and access to the Aave lending protocol. It is associated with Velo Finance, whose API the app registers new wallets with.

## Testing and Analysis

This assessment was recorded on 2026-09-16 using the Android app, version 1.1.7, installed from [Google Play](https://play.google.com/store/apps/details?id=com.velo.orbitplus). Screenshots are published in [this thread](https://x.com/BitcoinWalletz/status/2100126664382701579). Both entries on this page are the same product.

### The app offers no Bitcoin network

Orbit+ has a network picker, and it settles the question directly. Under **Enabled Networks** it lists five:

- NOVA Mainnet
- Avalanche C-Chain
- Base Mainnet
- BNB Smart Chain Mainnet
- Ethereum Mainnet

Every one of those is an Ethereum-style network. Bitcoin is not among them, and there is no way in the app to select it.

The token list agrees. It holds AETHWETH, AETHUSDT and AETHUSDC (Aave's interest-bearing versions of WETH, USDT and USDC), XAUT (Tether Gold), SHIB, LINK, AAVE, ETH, USDT and USDC — all tokens that live on the networks above.

We also looked specifically for a Bitcoin stand-in. On networks like these it is common to find WBTC or a similar token that tracks the Bitcoin price without being Bitcoin. We checked the full token list on the other chains as well and found none, so the question of whether a wrapped token would count does not arise here.

This matches what overtorment found in the code: the app registers a new wallet with its backend as `chainType: "evm"`, with no Bitcoin path at all.

### overtorment's finding was not tested

His finding is about how the app generates a new wallet's recovery phrase, not about Bitcoin. We did not inspect the Android package or watch the app's network traffic, so we neither confirmed nor contradicted it. He analysed version 1.1.3 of the iPhone app; we used version 1.1.7 on Android, so his result may not describe the build we installed.

It is worth reading his warning even though it falls outside this review. He reports that new wallets are created from `Math.random`, which is not a secure source of randomness, with each byte further squeezed into the range 0 to 99. If that holds, the set of wallets the app can produce is small enough to be worth searching, and anyone who searched it would find real wallets with real money in them. He also notes the app does not send the recovery phrase or private keys anywhere, which distinguishes it from most of the other apps in his research.

### Verdict: does not support Bitcoin (BTC)

The app's own network picker offers five networks and none of them is Bitcoin, the token list contains no Bitcoin and no wrapped stand-in for it, and the app's code registers wallets as Ethereum-style only. A wallet that cannot select the Bitcoin network cannot hold or send Bitcoin. Both entries on this page are the same product, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**.

The review stops at the Bitcoin-support gate. The wallet-generation problem above is overtorment's research, recorded here so readers can weigh it; it is not a finding of ours. Custody and source availability are not assessed.
