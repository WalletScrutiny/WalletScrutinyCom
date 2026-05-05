---
wsId: albosWallet
title: ALBOS Wallet
altTitle: 
authors:
- danny 
users: 500
appId: io.albos.wallet
alternativeStores: 
appCountry: 
released: 2019-07-01
updated: 2026-03-04
version: 2.5.1
reviews: 
website: http://www.albos.io/
repository: 
icon: io.albos.wallet.png
bugbounty: 
meta: fewusers
verdict: custodial
appHashes: 
date: 2026-05-05
signer: 
twitter: ALBOS77566387
social: 
redirect_from: 
developerName: ALBOS AND MARE PARTNERS OÜ
builds: 
features: 

---

## App Description

ALBOS Wallet is promoted as a multi-asset cryptocurrency wallet for ALB, BTC, ETH, and other assets. The Play Store listing claims support for storing and transferring assets, multiple receive addresses, and “100% control over your private keys.”

## Analysis

The Play Store listing claims:

> 100% control over your private keys

The official website describes ALBOS as a broader crypto payment platform with POS terminal, prepaid/debit card, online payment, wallet, affiliate, reward, and exchange-related services. The site says:

> Please register KYC after signing up.

Older ALBOS news posts also describe KYC, affiliate, reward, prepaid/debit card, and exchange features inside or connected to ALBOS Wallet.

We tested the app and posted the video on [X.com](https://x.com/BitcoinWalletz/status/2051564597568803242). Both the new wallet and restore wallet paths led to a signup screen requiring a mobile number and PIN. Although the restore path allows entering a 12-word seed phrase, the app still requires backend signup before the wallet can be used.

After continuing, the app incorrectly reported that `albos.io` was offline or that there was no internet connection. The website itself was online, and the device had internet access. This suggests the app is trying to reach an unavailable backend or API.

Because wallet creation and restore are gated by signup and backend availability, users do not have practical independent control of the wallet through the app. This app is best treated as **custodial**.

As additional context, the project's [X account](https://x.com/ALBOS77566387) appears to have stopped posting in 2020. Public Estonian company records also list [ALBOS AND MARE PARTNERS OÜ](https://krediidiraportid.ee/albos-and-mare-partners-ou) as deleted on March 14, 2024. This is the company mentioned at the footer of the website albos.io
