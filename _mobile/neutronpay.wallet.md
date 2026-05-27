---
wsId: neutronLNBitcoinWallet
title: 'Neutron: LN Bitcoin Wallet'
date: 2025-12-31
authors:
- danny
website: https://neutron.me/app
twitter: neutron__me
social:
- https://www.instagram.com/neutronpay
- https://www.linkedin.com/company/neutronme
- https://t.me/go_neutron
features:
- ln
- tradeAlts
redirect_from:
- /android/neutronpay.wallet/
- /iphone/neutronpay.wallet/
android:
  appId: neutronpay.wallet
  users: 100000
  updated: 2026-03-09
  version: 3.5.0
  icon: neutronpay.wallet.png
  meta: removed
  verdict: custodial
  developerName: Neutronpay Inc.
iphone:
  appId: neutronpay.wallet
  idd: '1629825080'
  appCountry: vn
  released: 2022-11-22
  updated: 2025-10-30
  version: 3.3.0
  reviews: 18
  icon: neutronpay.wallet.jpg
  meta: ok
  verdict: custodial
  developerName: Neutronpay Inc.

---

## Android

## App Description

Neutron Wallet is a mobile Bitcoin and Lightning payment application focused on fiat integration, enabling users to buy, sell, swap, and spend Bitcoin and USDt with direct conversion to and from local currencies and bank accounts. The app supports Lightning payments (including LNURL and Lightning Addresses) and merchant POS features, with transactions and conversions mediated through Neutron’s infrastructure. Based on website statements and terms, the app does not provide explicit guarantees of exclusive user key control, indicating a custodial or hybrid custodial model rather than a standalone self-custodial wallet.

### Neutron Lend

According to this [page](https://web.archive.org/web/20251115184603/https://www.neutron.me/lend):

You lock BTC by creating a contract and moving it into a multi‑sig wallet so no single party controls the keys while the loan is active. Next you pick the loan amount and terms you want, with rates starting around 8%. After your BTC deposit confirms, they send the stablecoins straight to your address. When you repay principal plus interest, the contract closes and the BTC is released back to you immediately.

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/2006315420186554511) the app and confirm the existence of a Bitcoin wallet.

Wallet provision is generated after email registration. Additional functions are unlocked via user compliance with KYC procedures. We were not given the seed phrases.

Although not explicitly stated in its [terms](https://web.archive.org/web/20251116101724/https://www.neutron.me/terms-of-use), the lack of seed-phrases, together with KYC procedures, account based wallet provision, the existence of lending features, all point to a **custodial** service.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Pay: Instantly pay anywhere that accepts Bitcoin Lightning payments." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap: Easily exchange between Bitcoin, USDt and your local currency directly within the app" source="Store" %}
