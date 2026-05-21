---
wsId: pocketmintWallet 
title: PocketMint Wallet
altTitle: 
authors:
- danny
users: 1000
appId: com.pocketmint.wallet
alternativeStores: 
appCountry: 
released: 2025-05-03
updated: 2025-12-24
version: 1.9.0
reviews: 8
website: http://pocketmint.ai
repository: 
icon: com.pocketmint.wallet.png
bugbounty: 
meta: ok
verdict: custodial
date: 2026-05-20
signer: 
twitter: 
social: 
redirect_from: 
developerName: Pocketmint Solutions LLC
builds: 
features: 

---

## App Description

PocketMint Wallet is a crypto wallet app for BTC and USDT.
The Google Play listing says users can buy, sell, send, and receive BTC and USDT.
It also says users can send USDT or BTC to other PocketMint users inside the PocketMint ecosystem.
The App Store listing repeats the same BTC and USDT claims.
The App Store version history also mentions KYC changes and SSN field protection.
The public website says only the user has access to private keys.

## Analysis

The app was not available in our country, so we were unable to install or test it directly.
Our analysis is based on publicly available materials: the Google Play listing, the App Store listing and changelog, the PocketMint website, and the developers' own published articles.

PocketMint is presented as a Bitcoin wallet supporting BTC and USDT.
It claims users can send and receive BTC, buy crypto with a card, and sell crypto to fiat.
The website states that only the user has access to private keys.

Despite this claim, the feature set is consistent with a custodial service rather than a self-custody wallet.
The app supports push-to-card and ACH withdrawals, meaning PocketMint must hold or intermediate funds to execute these payouts.
Transfers are described as happening "within the PocketMint ecosystem," which is characteristic of custodial platforms where the provider controls the underlying balances.
The App Store changelog references an enhanced KYC experience and SSN field protection, which are compliance features typical of regulated custodial services.
Card-based purchases also imply PocketMint acts as the intermediary acquiring and holding crypto on behalf of the user.

The developers' own published materials further undermine the self-custody claim.
In a Medium article on biometric and private key protection, PocketMint.AI describes traditional seed phrases as a "recipe for anxiety" and "the most intimidating part of self-custody," and promotes Multi-Party Computation (MPC) and Account Abstraction as its security model.
MPC-based key management means private key material is split and partially controlled by the provider — this is not user-controlled self-custody.

For WalletScrutiny purposes, the verdict is **custodial**.

Sources:

- [Google Play listing](https://play.google.com/store/apps/details?id=com.pocketmint.wallet)
- [PocketMint website](https://pocketmint.ai/)
- [PocketMint App Store listing](https://apps.apple.com/us/app/pocketmint-wallet/id6743178752)
- [GitHub code search for exact app id](https://github.com/search?q=%22com.pocketmint.wallet%22&type=code)
- [PocketMint terms and conditions](https://pocketmint.ai/termsandconditions)
- [PocketMint.AI Medium article: Biometric and Private Key Protection in Crypto Wallets](https://medium.com/@pocketmintai/biometric-and-private-key-protection-in-crypto-wallets-b3b01041654c)
