---
wsId: 
title: Vision Crypto
altTitle: 
authors:
- danny
users: 10000
appId: net.visioncrypto.app
appCountry: 
released: 2025-05-23
updated: 2025-08-22
version: 0.0.1
reviews: 
website: https://visioncrypto.net/
repository: 
icon: net.visioncrypto.app.png
bugbounty: 
meta: ok
verdict: nowallet
appHashes: 
date: 2026-04-20
signer: 
twitter: 
social:
- https://t.me/visioncrypto
redirect_from: 
developerName: VISION D'AFRIQUE
builds: 
features: 

---

## App Description

Vision Crypto is a hybrid P2P custodial exchange platform developed by VISION D'AFRIQUE, based in Dakar, Senegal. It targets the African market and allows users to buy and sell cryptocurrencies (including Bitcoin and USDT) using over 70 payment methods — including credit/debit cards, bank transfers, mobile money, and SEPA.

## How It Works

Vision Crypto operates as a human-operated OTC desk with a mobile app frontend — similar to other Senegal-based platforms like Africa Crypto:

1. The buyer enters an amount and their own external crypto receiving address
2. For accounts above $200, KYC identity verification is required before the trade proceeds
3. The buyer sends fiat via mobile money (Wave, Orange Money), bank transfer, or card
4. A Vision Crypto operator manually confirms receipt of payment — per their T&Cs: *"Toute transaction doit être validée uniquement après réception réelle du paiement ou des cryptos"* ("Any transaction must be validated only after actual receipt of payment or crypto")
5. The operator then sends crypto to the buyer's submitted address
6. For selling, the flow is reversed: crypto is sent first, operator confirms on-chain, then fiat is returned

Disputes are handled via WhatsApp and phone support — there is no smart contract or cryptographic guarantee. Users are trusting a human operator.

## Analysis

Vision Crypto **does not provide a cryptocurrency wallet**. Users supply their own external receiving address; no private keys, seed phrases, or self-custody mechanism are provided or mentioned.

From their Terms and Conditions:

> "Vision Crypto agit comme intermédiaire de mise en relation entre acheteurs et vendeurs."
> ("Vision Crypto acts as an intermediary connecting buyers and sellers.")

The platform reserves the right to suspend accounts and remove earnings, confirming centralized control over the transaction flow. No source code is available.

## Verdict

Vision Crypto **does not provide a wallet**. It is a hybrid P2P custodial exchange — closer to a human-operated OTC broker than an automated swap service — where users must trust the platform operator to complete trades.
