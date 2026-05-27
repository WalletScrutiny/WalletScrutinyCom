---
wsId: ari10Exchange
title: Ari10 Crypto Exchange
verdict: custodial
date: 2023-09-07
authors:
- danny
website: https://ari10.com
twitter: ari10com
social:
- https://www.instagram.com/senexpay
- https://www.linkedin.com/company/ari10-com
- https://t.me/ari10_com
features:
- buyWithCC
- tradeAlts
redirect_from:
- /android/com.ari10.bitcan/
- /iphone/com.ari10.bitcan/
android:
  appId: com.ari10.bitcan
  users: 10000
  released: 2022-06-14
  updated: 2026-02-11
  version: 2.10.3
  icon: com.ari10.bitcan.png
  meta: ok
  developerName: ARI10
iphone:
  appId: com.ari10.bitcan
  idd: '1623342435'
  appCountry: pl
  released: 2022-07-19
  updated: 2026-01-29
  version: 2.10.2
  reviews: 164
  icon: com.ari10.bitcan.jpg
  meta: ok
  developerName: BITCAN sp. z o.o.

---

## Android

## App Description from Google Play

> Buying and selling cryptocurrencies (so far those available in Kantor Ari10). At the moment, you can use the app to buy Bitcoin, Ethereum, USDT, Binance Coin, Binance USD (BUSD) and the ARI10 token.
>
> There are three payment methods available: quick transfer, payment card and BLIK purchase.
>
> At the moment, the application allows for deposits and withdrawals in PLN. In the next iteration of the product, we will also add more fiat currencies (USD and EUR).

## Analysis 

- The provider is formerly known as bitcan.pl
- This is a cryptocurrency exchange
- Registration required a Polish phone number and verification immediately at the start. Registration is also possible in bitcan.pl
- Some indicators of a custodial platform, can be found in the [terms](https://strapi.ariteninternal.com/uploads/regulamin_001c16fbf7.pdf):
  - submission of documents that prove the source of funds is legitimate.
  - The provider is AML and CTF compliant
- After some more digging, we found the security page which states that 98% of funds are [stored offline](https://bitcan.pl/en/security).

This is a **custodial** provider with a **non-verifiable** app.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap crypto directly in the exchange with just a 1% fee" source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="BLIK, debit & credit cards (VISA, Mastercard)" source="Store" %}
