---
wsId: redotpayCrypto
title: 'RedotPay: Crypto Card & Pay'
altTitle: 
authors:
- danny
users: 1000000
appId: com.redotpay
appCountry: 
released: 2023-06-09
updated: 2026-01-27
version: 3.0.4
reviews: 955
website: https://www.redotpay.com
repository: 
issue: 
icon: com.redotpay.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2026-01-23
signer: 
twitter: redotpay
social:
- https://www.linkedin.com/company/redotpayofficial
- https://www.instagram.com/redotpay
- https://www.facebook.com/RedotPayOfficial
- https://t.me/RedotPayAnnouncement
redirect_from: 
developerName: Red Dot Technology Limited
builds: 
features: 

---

## App Description

RedotPay is a global crypto payment app built around stablecoin-based cards and an all-in-one wallet designed to bridge digital currencies with everyday spending.
The app lets users add funds, spend crypto at merchants and ATMs, send and swap assets, and manage both cryptocurrencies and local currencies within a single interface.

RedotPay supports features such as virtual and physical cards, mobile payments, fiat on- and off-ramps, peer-to-peer transfers, and optional earning and credit products backed by crypto assets.

It positions itself as a compliant, globally available platform enabling crypto-powered payments, transfers, and financial services across multiple countries and regions.

## Analysis 

We [tested](https://x.com/BitcoinWalletz/status/2014539457157071155) the app and scanned its documentation.

RedotPay supports Bitcoin as an asset within the platform, allowing users to deposit BTC into their account and withdraw it to external Bitcoin wallets, as documented in its [crypto withdrawal guidance page](https://helpcenter.redotpay.com/en/articles/10339292-how-do-i-withdraw-crypto-from-redotpay-to-another-wallet-or-platform). 

By default, RedotPay operates under a **custodial model**, where user balances are held in RedotPay-managed accounts and the platform controls private keys and transaction execution, with broad rights to freeze, convert, or deduct assets for card settlement, compliance, and risk management as described in its General [Terms](https://www.redotpay.com/terms/general). 

RedotPay also offers an **optional self-custody wallet**, in which users retain control of their private keys and RedotPay states it has no control over assets held in that wallet; however, to use services such as the RedotPay card, users must lock selected “Acceptable Tokens” into a Smart Contract Vault, where assets can be automatically frozen, converted, and deducted by a smart contract under RedotPay-defined [terms](https://www.redotpay.com/terms/self-custody-wallet-etc).

However, this self-custody wallet cannot readily be accessible without having to pass through their KYC procedure. The app is also not source-available. For this reason, our final verdict still remains **custodial**.