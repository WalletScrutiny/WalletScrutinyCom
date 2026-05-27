---
title: 'Amaze: Crypto Mining Wallet'
verdict: nosource
date: 2024-03-02
authors:
- danny
website: https://amazewallet.com
twitter: amazewallet
social:
- https://www.linkedin.com/company/amazewallet
- https://t.me/OfficialAmazeWallet
- https://discord.com/invite/zBMgvBvYUe
redirect_from:
- /android/com.walletamaze.nftwallet/
android:
  appId: com.walletamaze.nftwallet
  users: 50000
  released: 2023-06-26
  updated: 2024-01-18
  version: 1.1.8
  reviews: 1
  icon: com.walletamaze.nftwallet.png
  meta: removed
  developerName: AmazeWallet

---

## App Description from Google Play

> - Hold 1000s of tokens across 60+ blockchains.
> - In-app on-ramping to securely turn fiat into crypto.
> - Swap tokens with our 1inch DEX integration
> - Instant market information with live token prices.
> - Ultra secure with 384-bit cipher encryption and 12 to 24-word seed phrase.

## Analysis

- After signing up for an account we proceeded to create a wallet.
- The seed phrases were provided. The app stopped working right after we confirmed the phrases. The app just closed and would not open again. This was in BlueStacks 5 Android 9.
- The iphone version is still on testflight.
- We tried again on a mobile device and were successfully able to import the seed phrases.
- We were able to generate a BTC wallet with a Bech32 native SegWit address and prefix of bc1. It can send and receive.
- There are no overt statements saying the project is source-available.
- We did find an organizational account on GitHub: [AmazeWallet](https://github.com/WeAreAmaze/amazewallet)
- However, searching for the app Id of {{ page.title }}, [did not yield any results](https://github.com/search?q=org%3AWeAreAmaze%20com.walletamaze.nftwallet&type=code). It appears the GitHub account is merely a placeholder.
- The app is **not source-available**.
