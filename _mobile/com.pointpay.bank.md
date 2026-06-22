---
wsId: pointpay
title: 'PointPay: Crypto Wallet App'
date: 2021-04-27
authors:
- kiwilamb
- leo
website: https://pointpay.io/
twitter: PointPay1
social:
- https://www.linkedin.com/company/pointpay
- https://www.facebook.com/PointPayLtd
- https://www.reddit.com/r/PointPay
features:
- buyWithCC
- tradeAlts
redirect_from:
- /android/com.pointpay.bank/
- /iphone/com.pointpayio.PointPayBank/
android:
  appId: com.pointpay.bank
  users: 100000
  released: 2020-07-21
  updated: 2026-04-07
  version: 8.8.81
  reviews: 135
  icon: com.pointpay.bank.png
  meta: removed
  verdict: custodial
  developerName: Point Pay OÜ
iphone:
  appId: com.pointpayio.PointPayBank
  idd: 1512836089
  appCountry: us
  released: 2020-07-30
  updated: 2026-06-19
  version: 8.8.88
  reviews: 695
  icon: com.pointpayio.PointPayBank.jpg
  meta: ok
  verdict: custodial
  developerName: Point Pay LTD

---

## Android

The PointPay website has very little information about how they manage private keys of the user.
The only basic statement is...

> We use strong military-grade encryption to store private keys

we will have to conclude the wallet funds are in control of the provider and hence custodial.

Our verdict: This 'wallet' is custodial and therefore is **not verifiable**.

---

## iPhone

The PointPay Bank website has very little information about how they manage
private keys of the users.
The only basic statement is...

> We use strong military-grade encryption to store private keys

we will have to conclude the wallet funds are in control of the provider and
hence custodial.

Our verdict: This 'wallet' is custodial and therefore is **not verifiable**.

{% include featureEvidence.html feature="buyWithCC" quote="Purchase Bitcoin BTC, Ethereum ETH, Tether USDT, and other cryptocurrencies using credit cards, bank transfers, Apple Pay / Samsung Pay / Google Pay." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="You will be able to easily create a cryptocurrency account at PointPay CryptoBank and make purchases of Bitcoin and other currencies." source="Store" %}
