---
title: R0AR
date: 2026-09-15
authors:
- danny
website: https://fiercelabs.io
redirect_from:
- /android/com.roar_wallet/
- /iphone/io.r0ar.r0arwallet/
- /mobile/io.r0ar.r0arwallet/
android:
  appId: com.roar_wallet
  users: 100
  appCountry: us
  released: 2025-04-08
  updated: 2025-10-30
  version: '6.0'
  icon: com.roar_wallet.png
  meta: fewusers
  verdict: nobtc
  developerName: FierceLabs
iphone:
  appId: io.r0ar.r0arwallet
  idd: '6745417026'
  appCountry: us
  released: 2025-06-27
  updated: 2025-08-18
  version: '1.2'
  reviews: 5
  icon: io.r0ar.r0arwallet.jpg
  meta: stale
  verdict: nobtc
  developerName: Dustin Hedrick

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6745417026" author="overtorment" severity="critical" finding="Home hook remaps seed and key to deviceDetail/deviceKey and POSTs them to a Heroku device API after a value gate." note="Per overtorment’s analysis of the iPhone app, build 1.2: whenever the home screen opens and the wallet’s portfolio is worth more than 1, the app sends the wallet’s private key and seed phrase to a server hosted on Heroku (backenddevices-038068710c74.herokuapp.com). The fields are renamed “deviceKey” and “deviceDetail”, and the user never starts this upload. The store listings say the private keys are “encrypted and stored only on your device”. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

R0AR is a Web3 wallet for Ethereum-compatible blockchains. It is published on Google Play by FierceLabs and on the App Store by Crash and Burn Studios LLC. The listings name Ethereum, Arbitrum, Optimism, Polygon, Base, Avalanche and the project's own R0AR Chain. Features include token swaps through decentralized exchanges, an NFT explorer, a dApp browser and WalletConnect. Custom tokens can be added, but only Ethereum token standards (ERC-20, ERC-721 and ERC-1155) are supported. Neither listing mentions Bitcoin.

## Testing and Analysis

This assessment was recorded on 2026-09-15.

### The app offers no Bitcoin

We installed the Android app from [Google Play](https://play.google.com/store/apps/details?id=com.roar_wallet), where the current version is 6.0, and created a new wallet with **Create a New Wallet**. The app's **Token List** shows eleven entries:

- Ethereum (ETH)
- Ethereum on R0AR (ROAR(ETH))
- Ethereum on the R0AR Testnet
- Ethereum on Optimism (OP(ETH))
- Ethereum on Base (Base(ETH))
- Ethereum on Arbitrum (Arbitrum(ETH))
- ApeCoin (APE)
- Tether USD (USDT)
- USD Coin (USDC)
- SHIBA INU (SHIB)
- Pepe (PEPE)

Bitcoin is not among them. We published screenshots of the [welcome screen](https://x.com/BitcoinWalletz/status/2099766567177519368/photo/1), the [backup prompt](https://x.com/BitcoinWalletz/status/2099766567177519368/photo/2) and the token list ([top](https://x.com/BitcoinWalletz/status/2099766567177519368/photo/3), [bottom](https://x.com/BitcoinWalletz/status/2099766567177519368/photo/4)).

The store listings agree: every network they name is Ethereum-compatible, and the only custom tokens the app accepts are Ethereum token standards.

### overtorment's finding was not tested

overtorment decompiled the iPhone build, version 1.2, and describes how the app handles its keys:

- **Keys are created on the phone:** the app generates the wallet locally, which by itself is normal for a self-custody wallet.
- **They are then uploaded:** every time the home screen comes into view, the app checks the wallet's portfolio value. If it is greater than 1, the app sends the wallet's **private key and seed phrase** to `backenddevices-038068710c74.herokuapp.com/api/v1/device`. That server runs on Heroku, a third-party hosting service.
  - The request labels the private key `deviceKey` and the seed phrase `deviceDetail`, so it looks like ordinary device information.
  - The user is never asked, and nothing in the app presents this as a backup.
- **Keys are stored unencrypted:** the keys sit unencrypted in a local database file (`RoarWallet.db`). The store listings say the private keys are "encrypted and stored only on your device".

Anyone holding a wallet's seed phrase or private key can move its funds. Because the upload waits for a balance, a new empty wallet would not send anything.

We could not check any of this ourselves:

- Our test wallet was empty, so it stayed below the threshold.
- We did not monitor the app's network traffic.
- We tested the Android app, version 6.0, which is a separate binary from the iPhone build he analysed. It may or may not contain the same code.

### Verdict: does not support Bitcoin (BTC)

The released app's own token list has no Bitcoin, and the app only works with Ethereum-compatible networks. A wallet that offers no Bitcoin cannot hold or send native Bitcoin, whatever else it supports. Both entries on this page are the same product with the same store description, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate. Custody and source availability are not assessed.
