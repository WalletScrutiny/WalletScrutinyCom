---
title: Wallet of Satoshi POS
appId: com.walletofsatoshi.pos
meta: ok
verdict: nowallet

---

## App Description

Wallet of Satoshi POS is a receive-only point-of-sale mobile application designed to accept Bitcoin payments over the Lightning Network using LNURL. The app provides a simple merchant-focused interface for generating Lightning invoices and monitoring payment status without managing a full wallet. It is intended to be used as a companion application alongside an existing Wallet of Satoshi account.

## Analysis

We installed the app and note that a {% include walletLink.html wallet='android/com.livingroomofsatoshi.wallet' verdict='true' %} account is required in order to use the app. 

From its description we can gather that it is a companion app to the main Satoshi wallet which has receive-only function. As such, it is **not a wallet**, since it would require the main app for key handling.

