---
wsId: 
title: PocketMint Wallet
altTitle: 
authors:
- danny 
users: 1000
appId: com.pocketmint.wallet
appCountry: 
released: May 3, 2025
updated: 2025-10-02
version: 1.7.2
stars: 1.8888888
ratings: 
reviews: 6
website: http://pocketmint.ai
repository: 
issue: 
icon: com.pocketmint.wallet.png
bugbounty: 
meta: ok
verdict: wip
appHashes: 
date: 2025-12-01
signer: 
twitter: 
social: 
redirect_from: 
developerName: Pocketmint Solutions LLC
features: 

---

## App Description

Pocketmint.ai provides a platform for buying, selling, sending, and receiving USDT and Bitcoin, with features such as debit/credit card top-ups, instant fiat withdrawals, and real-time transaction tracking, according to the description. The service supports internal transfers between PocketMint users with no stated limits and processes transactions within its own PocketMint ecosystem. Users can convert crypto to fiat using push-to-card or ACH options, and the app offers multi-layer security features including encryption, 2FA, and fraud detection. The description emphasizes fast processing, integrated fiat support, and a unified interface for managing USDT and BTC in one application.

## Analysis

The app and the website are geo-restricted so we were not able to test the app and not able to find supporting claims on their website. 

Through archive.org we were able to see its [terms and conditions.](https://web.archive.org/web/20250614053036/https://pocketmint.ai/termsandconditions)

It mentions:

> “You are responsible for securing your private keys, wallet, and digital assets.”

It does not say however, whether the app itself generates the private key for the user.

> “PocketMint does not store or recover private keys and is not liable for any losses due to user negligence.”

If the app does not generate the private key then it would follow that they do not also bear responsibility for its storage. 

The app description lists features such as buying, selling, and sending USDT and Bitcoin, but the terms do not explain how these functions are performed if PocketMint does not store or recover private keys. At present, there is no available documentation showing whether the app generates private keys, relies on user-provided keys, or uses another mechanism entirely. Because of this lack of clarity, we do not have enough information to determine how custody is handled or to assign an accurate verdict.

Without enough proof of the real implementation for this app, this remains a **work-in-progress**. We'll contact the provider at the listed email in Google Play.