---
wsId: newMoneyAIWallet
title: Newmoney AI Wallet
date: 2025-11-20
authors:
- danny
website: https://newmoney.ai/
twitter: NewmoneyAI
social:
- https://t.me/NewmoneyAi_Bot
- https://discord.com/invite/newmoneyai
- https://www.facebook.com/easycryptoau
- https://www.instagram.com/easycrypto.global
- https://www.linkedin.com/company/easy-crypto
- https://www.youtube.com/c/EasyCryptoGlobal
redirect_from:
- /android/com.newmoney.ai/
- /iphone/com.newmoney.ai/
android:
  appId: com.newmoney.ai
  users: 10000
  appCountry: us
  released: 2025-04-28
  updated: 2025-08-15
  version: 1.8.10
  reviews: 10
  icon: com.newmoney.ai.png
  meta: ok
  verdict: custodial
  developerName: NewmoneyAI
iphone:
  appId: com.newmoney.ai
  idd: '6745225114'
  appCountry: us
  released: 2025-05-09
  updated: 2025-08-16
  version: 1.9.14
  reviews: 8
  icon: com.newmoney.ai.jpg
  meta: removed
  verdict: custodial
  developerName: Newmoney AI Wallet

---

## Android

## App Description

Newmoney AI markets itself as an “AI-powered” crypto and cash wallet from NM Technology LLC, combining support for Bitcoin, SUI, Ethereum, Solana and fiat-like balances inside a single mobile interface with optional browser access. The company highlights its built-in “Newton” assistant plus integrations with SMS, email, Telegram, and mainstream payment rails (Circle, Transak, Onramper) so users can fund wallets via cards, Apple Pay or bank transfers and send cash, crypto or stock to contacts using a phone number or email address.

The published terms describe the software as a non-custodial wallet: users generate and manage their own keys, the provider says it cannot access funds, and even its “Digital Cash” tokens remain backed 1:1 with USDC locked in Aave-operated smart contracts rather than company accounts. 

## Analysis

Our [tests](https://x.com/BitcoinWalletz/status/1991401441479848420) were not successful in locating the seed generation or private key export function. If they were there, they are so difficult to find or are broken. We tried to clarify this with them via [twitter](https://x.com/BitcoinWalletz/status/1991406846750695599).

Despite those claims, the official GitHub organization currently lists no public repositories, so the Android application source code is not available for independent review.

Absent proof that the private keys can indeed be exported, we are marking this app as **custodial** until proven otherwise.

---

## iPhone

{% include copyFromAndroid.html %}
