---
wsId: onekeySo.new
title: 'OneKey: Blockchain DeFi Wallet'
altTitle: 
authors:
- danny
users: 10000
appId: so.onekey.app.wallet
appCountry: 
released: 2022-04-27
updated: 2023-05-06
version: 4.5.0
stars: 4.6
ratings: 
reviews: 38
size: 
website: https://onekey.so
repository: https://github.com/OneKeyHQ/app-monorepo
issue: 
icon: so.onekey.app.wallet.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2023-04-18
signer: 
reviewArchive: 
twitter: OneKeyHQ
social:
- https://discord.com/invite/nwUJaTzjzv
redirect_from: 
developerName: OneKey Limited
features: 

---

## App Description from Google Play 

> All new designed and open source project of OneKey Wallet.

> MULTI-CHAIN SUPPORT
>
> Solana, Aptos, Near, STC, BTC, DOGE, LTC, Tron, EVM Chains (BSC, ETH, Arbitrum, Avalanche, Optimism, Polygon, CELO, CRO, FTM, HECO, OEC, xDai, and customized EVM Network).

## Analysis 

- The app claims to be Open Source and has provided the repository
- That app claims to support BTC sending and receiving 
- There is a presumption that it is non-custodial because of the reliance on the hardware wallets for the storage of private keys. Such as:

> BACK UP WITH ONEKEY LITE
> 
> Back up and restore your wallet without typing a word.

We tried installing the app on several of our devices: 

- On a Samsung phone with Android 12 
- On BlueStacks 5 Nougat 32-bit
- On BlueStacks 5 Pie 64-bit 
- APKCombo on BlueStacks5 Pie 64-bit
- Android Studio Emulator Pixel 5 API 29 Android 10 

And all failed. 

As [@loatheb1](https://gitlab.com/loatheb1) has explained on [GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/469): 

> "None of these three products can be used without our APP. We all need our APP to send data, process the received information inside the hardware, and then return it. This ensures that the private key in our hardware must be is safe." 

As a **companion app** to OneKey's hardware wallets, the app does not function as a wallet itself. 