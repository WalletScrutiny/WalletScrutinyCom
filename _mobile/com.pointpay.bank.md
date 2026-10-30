---
wsId: pointpay
title: 'PointPay: Crypto Wallet App'
date: 2026-10-30
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
  icon: com.pointpay.bank.webp
  meta: removed
  verdict: custodial
  developerName: Point Pay OÜ
iphone:
  appId: com.pointpayio.PointPayBank
  idd: 1512836089
  appCountry: us
  released: 2020-07-30
  updated: 2026-09-25
  version: 8.8.96
  reviews: 695
  icon: com.pointpayio.PointPayBank.webp
  meta: ok
  verdict: custodial
  developerName: Point Pay LTD

---

## Android

**Update 2026-10-30:** The app is gone from Google Play, while the iPhone app
is still listed. PointPay is still active:
[pointpay.io](https://pointpay.io/) now redirects to its exchange, which offers
spot and futures trading, staking and P2P. We found nothing that gives users the
keys to their bitcoins, so the verdict stays
{% include verdictBadge.html verdict="custodial" type='short' %}.

The PointPay website has very little information about how they manage private keys of the user.
The only basic statement is...

> We use strong military-grade encryption to store private keys

we will have to conclude the wallet funds are in control of the provider and hence custodial.

Our verdict: This 'wallet' is custodial and therefore is **not verifiable**.

---

## iPhone

**Update 2026-10-30:** PointPay is still active:
[pointpay.io](https://pointpay.io/) now redirects to its exchange, which offers
spot and futures trading, staking and P2P. The App Store description still offers
"a cryptocurrency account at PointPay CryptoBank" with daily interest, and we
found nothing that gives users the keys to their bitcoins. The verdict stays
{% include verdictBadge.html verdict="custodial" type='short' %}.

The PointPay Bank website has very little information about how they manage
private keys of the users.
The only basic statement is...

> We use strong military-grade encryption to store private keys

we will have to conclude the wallet funds are in control of the provider and
hence custodial.

Our verdict: This 'wallet' is custodial and therefore is **not verifiable**.

{% include featureEvidence.html feature="buyWithCC" quote="Purchase Bitcoin BTC, Ethereum ETH, Tether USDT, and other cryptocurrencies using credit cards, bank transfers, Apple Pay / Samsung Pay / Google Pay." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="You will be able to easily create a cryptocurrency account at PointPay CryptoBank and make purchases of Bitcoin and other currencies." source="Store" %}
