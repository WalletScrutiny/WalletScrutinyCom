---
wsId: neutronLNBitcoinWallet
title: 'Neutron: LN Bitcoin Wallet'
altTitle: 
authors:
- danny
users: 100000
appId: neutronpay.wallet
appCountry: 
released: 
updated: 2026-02-03
version: 3.4.0
reviews: 
website: https://web.archive.org/web/20250612191436/https://neutron.me/app
repository: 
issue: 
icon: neutronpay.wallet.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-12-31
signer: 
twitter: neutron__me
social:
- https://www.instagram.com/neutronpay
- https://www.linkedin.com/company/neutronme
- https://t.me/go_neutron
redirect_from: 
developerName: Neutronpay Inc.
builds: 
features: 

---

## App Description

Neutron Wallet is a mobile Bitcoin and Lightning payment application focused on fiat integration, enabling users to buy, sell, swap, and spend Bitcoin and USDt with direct conversion to and from local currencies and bank accounts. The app supports Lightning payments (including LNURL and Lightning Addresses) and merchant POS features, with transactions and conversions mediated through Neutron’s infrastructure. Based on website statements and terms, the app does not provide explicit guarantees of exclusive user key control, indicating a custodial or hybrid custodial model rather than a standalone self-custodial wallet.

### Neutron Lend

According to this [page](https://web.archive.org/web/20251115184603/https://www.neutron.me/lend):

You lock BTC by creating a contract and moving it into a multi‑sig wallet so no single party controls the keys while the loan is active. Next you pick the loan amount and terms you want, with rates starting around 8%. After your BTC deposit confirms, they send the stablecoins straight to your address. When you repay principal plus interest, the contract closes and the BTC is released back to you immediately.

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/2006315420186554511) the app and confirm the existence of a Bitcoin wallet.

Wallet provision is generated after email registration. Additional functions are unlocked via user compliance with KYC procedures. We were not given the seed phrases.

Although not explicitly stated in its [terms](https://web.archive.org/web/20251116101724/https://www.neutron.me/terms-of-use), the lack of seed-phrases, together with KYC procedures, account based wallet provision, the existence of lending features, all point to a **custodial** service.
