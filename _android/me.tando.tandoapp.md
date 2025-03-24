---
wsId: tandoMobileApp
title: Tando
altTitle: 
authors:
- danny
users: 1000
appId: me.tando.tandoapp
appCountry: 
released: 2024-08-21
updated: 2025-01-18
version: 1.2.0
stars: 
ratings: 
reviews: 
website: https://tando.me/
repository: 
issue: 
icon: me.tando.tandoapp.png
bugbounty: 
meta: ok
verdict: nowallet
appHashes: 
date: 2025-02-28
signer: 
reviewArchive: 
twitter: tando_me
social:
- >-
  https://njump.me/npub1tand04svfdhrt7lhg6687fh0y2xvxfpr9nkkj27rqfrxfpeklldsp48sax
- https://www.instagram.com/tando_to
- https://www.linkedin.com/company/tando-me
- https://www.tiktok.com/@tando.me
- https://www.youtube.com/@tando_me
redirect_from: 
developerName: Tando.me
features: 

---

## App Description

Tando is a non-custodial Lightning Network payment application that interfaces with M-Pesa's payment infrastructure. The app facilitates instant Bitcoin transactions while maintaining user privacy and eliminating traditional mobile money fees.

- Non-custodial architecture - users maintain control of their funds through their own Lightning-enabled Bitcoin wallets
- Lightning Network integration for instant, low-cost Bitcoin transactions
- M-Pesa payment system compatibility for merchant settlements
- No registration or KYC requirements
- Compatible with standard Lightning-enabled wallets including Phoenix, Blink, Machankura, Breeze, Strike, BitKit, Zeus, and Wallet of Satoshi
- Zero additional transaction fees - platform covers Lightning Network fees
- Direct merchant integration without requiring receiver-side software changes

## Analysis 

Tando App is a non-custodial platform that does not generate private keys, relying on user-linked Lightning wallets. The app's integration with M-Pesa, a dominant mobile money platform in Kenya, allows seamless conversion of Bitcoin to KES for payments, with zero fees. 

So to summarize: 

- It does not hold nor generate private keys. It integrates various lightning wallets.
- They've claimed with no obvious technical documentation that their platform converts lightning BTC to USD, USD to KES and KES into the bank account or mobile money account of the user. [Source](https://www.blink.sv/blog/tando-bitcoin-adoption-in-kenya)

Based on this information, we conclude that this product is **not intended to serve as a bitcoin wallet**, but as a facilitator, enabling the seamless conversion of Bitcoin to KES for mobile money transactions.





