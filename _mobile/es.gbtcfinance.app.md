---
wsId: gbtcFinance
title: GBTC Finance - Compra Bitcoin
verdict: custodial
meta: ok
date: 2025-12-27
authors:
- danny
website: https://gbtcfinance.com/
twitter: gbtcfinance
social:
- https://www.linkedin.com/company/gbtc-finance
- https://t.me/GBTCFINANCESL
- https://www.instagram.com/gbtcfinance
redirect_from:
- /android/es.gbtcfinance.app/
- /iphone/com.gbtc.finance/
android:
  appId: es.gbtcfinance.app
  users: 1000
  released: 2025-02-11
  updated: 2026-02-26
  version: '1.16'
  icon: es.gbtcfinance.app.png
  developerName: GBTC FINANCE
iphone:
  appId: com.gbtc.finance
  idd: '6742466859'
  appCountry: es
  released: 2025-08-01
  updated: 2026-03-02
  version: '1.03'
  reviews: 5
  icon: com.gbtc.finance.jpg
  developerName: GBTC FINANCE S.L.

---

## Android

## App Description

GBTC Finance provides a cryptocurrency platform that enables users to buy, sell, and exchange supported cryptoassets using provider-controlled wallets and platform-managed transaction flows. 

Users are issued deposit addresses by the platform, and asset handling, network validation, and exceptional recovery procedures are executed by GBTC Finance’s internal systems and technical staff rather than through user-controlled private keys. 

The service operates under a regulated framework in Spain, includes OTC and payment-related services, and applies manual recovery processes and fees for mis-sent or unsupported network transactions.

## Analysis

Proof of custody can be found in [this statement](https://gbtcfinance.com/recuperacion-de-fondos/):

> In the event that a client sends to the wrong address, that is, different from the one officially provided by GBTC Finance, we must warn that the funds will be considered irreversibly lost.

For "recoverable funds" the platform charges a fee of 500 Euros.

> a flat fee of 500 euros will be applied for each recovery request.

This shows that **key material is held and custodied by the service**.

---

## iPhone

{% include copyFromAndroid.html %}
