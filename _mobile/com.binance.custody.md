---
wsId: ceffuCustody
title: 'Ceffu: Institutional Custody'
date: 2023-07-21
authors:
- danny
website: https://ceffu.com
twitter: CeffuGlobal
social:
- https://www.linkedin.com/company/ceffu
features:
- multiSig
redirect_from:
- /android/com.binance.custody/
- /iphone/com.binance.custody/
android:
  appId: com.binance.custody
  users: 500000
  released: 2021-11-25
  updated: 2023-08-17
  version: 2.9.1
  reviews: 8
  icon: com.binance.custody.png
  meta: removed
  verdict: custodial
  developerName: Binance Inc.
iphone:
  appId: com.binance.custody
  idd: '1595828184'
  appCountry: sg
  released: 2021-12-01
  updated: 2026-06-25
  version: 5.12.0
  reviews: 0
  icon: com.binance.custody.jpg
  meta: ok
  verdict: custodial
  developerName: Block Technologies Pte Ltd

---

## Android

Note: The same developer developed the {% include walletLink.html wallet='android/com.binance.dev' verdict='true' %}

## App Description from Google Play

> Access robust security and liquidity from wherever you are with the Ceffu app.
>
> Ceffu is an independent, compliant, insured, and audited institutional custody service built to help institutions store and manage their crypto assets efficiently and with peace of mind.
>
> Innovative Wallet Solutions:
>
> Access cold storage solutions powered by the latest breakthroughs in multi-party computation (MPC) technology with our Qualified Wallet. Manage transactions, wallets and sub-accounts with instantaneous withdrawals using our Prime Wallet.

## Analysis 

Other than explicitly offering a "custody service" the provider also promotes its use of cold-storage which tells us this is a **custodial** service.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiSig" quote="multi-signature authorization" source="Store description" %}
