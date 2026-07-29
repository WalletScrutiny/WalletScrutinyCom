---
title: 'PurpleX: Crypto Payment App'
date: 2026-07-24
website: https://purplex.io/
appCountry: us
redirect_from:
- /android/com.purplexapp.cpi/
- /iphone/com.purplexapp.cpi/
android:
  appId: com.purplexapp.cpi
  users: 100
  appCountry: us
  released: 2024-11-30
  updated: 2026-04-11
  version: 1.2.9
  icon: com.purplexapp.cpi.png
  meta: fewusers
  verdict: nobtc
  developerName: PURPLEX FINTECH PRIVATE LIMITED
iphone:
  appId: com.purplexapp.cpi
  idd: '6740024218'
  appCountry: us
  released: 2025-01-09
  updated: 2026-02-05
  version: 1.2.8
  reviews: 0
  icon: com.purplexapp.cpi.jpg
  meta: ok
  verdict: nobtc
  developerName: PURPLEX FINTECH PRIVATE LIMITED

---

## App Description

PurpleX is a cryptocurrency payment app published by PURPLEX FINTECH PRIVATE LIMITED, an Indian company, and distributed on iOS and Android under the identifier `com.purplexapp.cpi`. Its store listings describe paying merchants in shops, restaurants and online by scanning a QR code, with transactions said to complete in seconds. The listings set out the flow as: install the app, "connect your cryptocurrency wallet to the app", then scan the merchant's QR code, review the transaction details and confirm the payment. The provider says the app works with a growing number of merchants and issues an alert for each transaction.

## Testing and Analysis

**We were unable to test this app, so this assessment is based entirely on publicly available documentation** — the store listings, the App Store screenshots, and archived copies of the provider's own website, Terms and Privacy Policy. Nothing below was verified by using the software.

We did install the Android release from Google Play, but **the app never got past its splash screen** — it displayed the PurpleX logo and went no further, so no account could be created and no in-app behaviour could be observed. We cannot say from one device whether the backend is down or whether the app silently requires an Indian phone number or IP address; the service is India-only (INR pricing throughout, FIU-IND registration) and we tested from outside India.

**Both of the company's domains are unreachable.** `https://purplex.io/` and `https://purplex.ai/` (the latter redirects to the former) each return HTTP 500 from an nginx server as of 2026-07-24. The site is not merely parked — it responds, and errors.

**The asset the app calls "BTC" is a token on BNB Smart Chain, not bitcoin.** The App Store screenshots show the home screen asset list, where every holding carries a chain badge beside its ticker: `ETH` is badged **ETH**, `AVAX` is badged **AVAX**, `BNB` is badged **BNB** — and `BTC` is badged **BNB**. The account screen shows a single wallet address in EVM form (`0xb2f8…4157`) and no bitcoin address anywhere, and a completed payment is confirmed with an EVM transaction hash and a fee denominated in BNB. Taken together this describes BTCB, the Binance-pegged BEP-20 representation of bitcoin, not BTC on the Bitcoin network. Bitcoin cannot be held at an `0x` address.

**The provider's Bitcoin claim appears in copy that is demonstrably not about this product.** An archived capture of the company site (2025-07-17) states: *"PurpleX supports a variety of the top 10 cryptocurrencies, including Bitcoin (BTC), Ethereum (ETH), and others."* The same page also states *"Purplex is a cryptocurrency exchange derivative that provides leveraged tokens, futures, and Purplex trading,"* and carries testimonials praising *"their leveraged tokens and futures options."* PurpleX ships a QR-code merchant payment app with no trading, futures or leverage of any kind. That block is boilerplate from an unrelated template, so its mention of Bitcoin cannot be relied on as a statement about the shipped app.

**The provider's binding documents describe a payment gateway, not a wallet.** The archived Terms and Conditions (2024-06-14) govern *"our payment gateway solutions, which allow users to convert and pay from cryptocurrency to Indian Rupees (INR),"* and state: *"PurpleX offers a payment gateway that enables users to make payments in INR using cryptocurrency. We act as an intermediary to facilitate these transactions."* Neither the Terms nor the Privacy Policy names any cryptocurrency, and neither uses the words custody, private key or seed phrase.

**Verdict: nobtc.** The app is a wallet in the ordinary sense — it displays balances, holds assets and broadcasts transactions — but nothing it handles is bitcoin. Its "BTC" line item is a pegged BEP-20 token on BNB Smart Chain, an IOU whose redeemability depends on its issuer, and the app exposes no Bitcoin address. WalletScrutiny reviews wallets that at least also support BTC, so the review stops here.

Custody is left unresolved and was not reached. It is worth noting for any future review that the app shows no seed-phrase backup, recovery-phrase or key-export option in its settings, that access is governed by an email login, a password and a six-digit PIN with KYC approval, and that assets are listed for chains that cannot share the single EVM address shown — all of which would need examining should the app ever add real Bitcoin support.
