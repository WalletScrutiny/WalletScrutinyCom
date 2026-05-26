---
wsId: Unocoin
title: 'Unocoin: Buy Bitcoin & Crypto'
verdict: custodial
meta: ok
date: 2020-05-29
authors:
- leo
website: https://www.unocoin.com
twitter: Unocoin
social:
- https://www.linkedin.com/company/unocoin
- https://www.facebook.com/unocoin
features:
- buyWithCC
- fingerprint
- tradeAlts
redirect_from:
- /com.unocoin.unocoinwallet/
- /posts/com.unocoin.unocoinwallet/
- /android/com.unocoin.unocoinwallet/
- /iphone/com.unocoin.mainapp.production/
android:
  appId: com.unocoin.unocoinwallet
  users: 1000000
  released: 2016-11-30
  updated: 2026-05-25
  version: 5.3.42
  reviews: 55
  icon: com.unocoin.unocoinwallet.png
  website: https://www.unocoin.com
  developerName: Unocoin Technologies
iphone:
  appId: com.unocoin.mainapp.production
  idd: 1030422972
  appCountry: in
  released: 2016-05-12
  updated: 2026-04-15
  version: 6.2.75
  reviews: 1628
  icon: com.unocoin.mainapp.production.jpg
  developerName: Unocoin Technologies Private Limited

---

## Android

This app appears to be the interface to a trading platform. The description on
Google Play does not talk about where the keys are stored but it links to their
website and there we read

> AES-256 Encryption<br>
  The address-private key pairs obtained are encrypted using AES-256, sealed in
  envelopes and stored in multiple safe deposit lockers.

which clearly means they have the keys and you don't. As a custodial service,
this app is **not verifiable**.

---

## iPhone

This app appears to be the interface to a trading platform. The description
does not talk about where the keys are stored but it links to their
website and there we read

> AES-256 Encryption<br>
  The address-private key pairs obtained are encrypted using AES-256, sealed in
  envelopes and stored in multiple safe deposit lockers.

which clearly means they have the keys and you don't. As a custodial service,
this app is **not verifiable**.

{% include featureEvidence.html feature="fingerprint" quote="Biometric login & app lock" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Buy, sell & trade Bitcoin, Ethereum, Dogecoin, Shiba Inu and 95+ cryptocurrencies instantly using INR." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="INR Deposit & Withdrawal" source="Store description" %}
