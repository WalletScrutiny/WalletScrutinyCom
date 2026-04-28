---
wsId: sezameWallet
title: Sezame Wallet
altTitle: 
authors:
- danny
users: 500
appId: org.maze2.sezamewallet
alternativeStores: 
appCountry: 
released: 2022-03-31
updated: 2026-02-12
version: 0.16.6
reviews: 
website: https://sezame.app
repository: https://github.com/maze2-org/sezame-wallet
icon: org.maze2.sezamewallet.png
bugbounty: 
meta: fewusers
verdict: sourceavailable
appHashes: 
date: 2026-04-23
signer: 
twitter: SesameWallet
social:
- https://x.com/SesameWallet
- https://t.me/sesamewalletgroup
redirect_from: 
developerName: Maze 2 Techs
builds: 
features: 

---

## App Description

Sezame Wallet is a mobile app listed on Google Play that claims multi-network support including Bitcoin, and exposes wallet creation/import, transfers, and WalletConnect-based dapp connectivity. The app’s terms page also describes external API dependencies for chain operations, including Trezor and Etherscan references for Ethereum/Bitcoin-related features.

## App Analysis

Homepage and policy/support references are available, including an app-specific terms page and privacy page. The wallet-specific [terms](https://sezame.app/terms-and-conditions), include clauses about locally hosted wallets, recovery phrase responsibility, and third-party API integrations. Play support also lists contact email and privacy policy, and the GitHub wiki exists with a minimal home page.  

The app is buggy, and closes during our testing. But if the source code is our basis for our verdict, the app supports Bitcoin and does provide the seed phrases.

Our testing was posted on [X.com](https://x.com/BitcoinWalletz/status/2047146975616020870)

> Sezame clearly supports seed phrases in its wallet flow (generation, backup, confirmation, import, and later reveal), in the Sezame source code, the wallet creation flow explicitly generates a seed phrase by calling `WalletGenerator.generateMnemonic()` and saving it via `setSeedPhrase(newMnemonic)`, which is direct repo proof that seed phrases are provided. The evidence is in [CreateWalletStep1](https://github.com/maze2-org/sezame-wallet/blob/main/src/screens/create-wallet/steps/create-wallet-step1.tsx).

Both the Android and iPhone versions of the app are **source available**.

The public repo includes [iOS source code](https://github.com/maze2-org/sezame-wallet/blob/main/ios)