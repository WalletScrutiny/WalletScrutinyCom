---
wsId: lifPay
title: LifPay
verdict: custodial
meta: ok
date: 2024-09-07
authors:
- danny
twitter: lifpay
social:
- https://primal.net/p/npub1pzerv8rqqvhk82y85axa3t3yxr8rdqnea03zlmk5crsne509esqqw0x463
- https://t.me/lifpay
features:
- ln
- nfc
redirect_from:
- /android/flutter.android.LifePay/
- /iphone/com.prominentwiselimited.lifpay/
android:
  appId: flutter.android.LifePay
  users: 1000
  released: 2022-09-21
  updated: 2025-08-25
  version: 2.4.8
  icon: flutter.android.LifePay.png
  website: https://lifpay.me
  developerName: ProminentWise
iphone:
  appId: com.prominentwiselimited.lifpay
  idd: '1645840182'
  appCountry: hk
  released: 2022-10-17
  updated: 2025-08-07
  version: 2.4.7
  reviews: 0
  icon: com.prominentwiselimited.lifpay.jpg
  developerName: PROMINENTWISE LIMITED

---

## Android

## App Description from Google Play

> LifPay’s highlights include:
> 
> 1.Enjoy zero fees on borderless Bitcoin payments between LifPay users.
> 2.Personalized Lightning Address for all users (username@lifpay.me) for seamless Internet money transactions.
> 3.Nostr features, such as Nostr Wallet Connect, NIP05 supported, including a checkmark symbol displayed on your Nostr profile, etc.
> 4.NFC support for seamless Bitcoin reception.
> 5.Create vouchers and issue NFC gift cards with ease.
> 6.Intuitive contact list for frequent Bitcoin payments.
> 7.Map of local businesses accepting Bitcoin via Lightning.

## Analysis

[Screenshots](https://x.com/BitcoinWalletz/status/1832331612845174838)

- As of 2024-09-07, the app only supports lightning. On-chain Bitcoin wallet functions are not available.
- No private keys were provided when we signed up. 
- Instead, we were given a `@lifpay.me` account. This was denominated in sats. 
- Absent the private keys, this is a **custodial service**.

{% include featureEvidence.html feature="ln" quote="Personalized Lightning Address for all users (username@lifpay.me) for seamless Internet money transactions." source="App Description from Google Play" %}

{% include featureEvidence.html feature="nfc" quote="NFC support for seamless Bitcoin reception." source="App Description from Google Play" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="LifPay is your comprehensive Bitcoin Lightning wallet solution. Beyond instant and low-fee transactions on mobile, POS services" source="Store" %}

{% include featureEvidence.html feature="nfc" quote="NFC support for seamless Bitcoin reception." source="Store" %}
