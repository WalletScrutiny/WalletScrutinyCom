---
title: Zabira
date: 2026-10-31
authors:
- leo
website: https://www.zabira.com
twitter: thezabira
android:
  appId: dev.app.grizab.ng
  users: 10000
  appCountry: us
  released: Jun 30, 2024
  updated: 2026-09-22
  version: 0.0.32
  reviews: 18
  icon: dev.app.grizab.ng.webp
  meta: ok
  verdict: custodial
  developerName: Zabira
iphone:
  appId: dev.app.grizab.ng
  idd: '6504557775'
  appCountry: ng
  released: '2024-10-06T07:00:00Z'
  updated: 2026-09-22
  version: 0.0.32
  reviews: 151
  icon: dev.app.grizab.ng.webp
  meta: ok
  verdict: custodial
  developerName: Zabira Technologies

---

## App Description

This is the current app of Zabira Technologies, a Nigerian platform for buying, selling and swapping crypto, trading gift cards, holding fiat balances in Naira, Cedi, Shilling or Dollar, and paying bills. It replaces {% include walletLink.html wallet='android/app.zabira.ng' verdict='true' %}, which is no longer on the stores. Zabira's [website](https://www.zabira.com/) now links to this app on both stores (as "Zabira Pro" on the App Store). Its [crypto page](https://www.zabira.com/products/cryptocurrency) promises: "Send, and receive BTC, ETH, USDT, USDC, and more in one secure wallet."

## Analysis

- **Bitcoin support.** Zabira's [Crypto Trading Guide](https://help.zabira.com/docs/crypto-trading-guide/) lists "Bitcoin (BTC)" on the "BTC" network, with a minimum deposit of 0.00011 BTC and a maximum withdrawal of 0.2 BTC.
- **Sending and receiving.** The same guide says to deposit, "Click Generate Wallet Address to create a unique address for your deposit" and "Copy the wallet address and share it with the sender or use it to transfer funds from your external wallet." To withdraw to an external wallet, users "Enter the recipient's external wallet address" and "The crypto will be sent to the external wallet after processing."
- **Custody.** Withdrawals can also go to another user by entering "the recipient's Zabira phone number or email or Zabira ID", which is a transfer inside Zabira's own records. Crypto can be sold from the balance straight into the user's fiat wallet. A [Zabira blog post](https://blog.zabira.com/manage-crypto-assets-securely-zabira/) claims "Your keys, your coins? Absolutely." But none of the help pages we read mentions a seed phrase, a private key or a backup, and the same account is also used through the [web app](https://app.zabira.com/wallet). When we reviewed the predecessor app, we found no seed phrase either. The coins sit in an account that Zabira controls.

Zabira holds the bitcoin for its users, so the app is {% include verdictBadge.html verdict="custodial" type='short' %}, like the app it replaces.

**Custodial: The provider holds the keys**
