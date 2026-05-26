---
wsId: trusteePlus
title: Trustee Plus | Wallet & Card
verdict: custodial
meta: removed
date: 2026-02-20
authors:
- danny
website: https://trusteeglobal.com
twitter: TrusteeGlobal
social:
- https://t.me/trustee_ru
- https://www.youtube.com/@TrusteeGlobal
- https://www.instagram.com/trustee.global
redirect_from:
- /android/com.trusteeplus/
- /iphone/com.trusteeplus1/
android:
  appId: com.trusteeplus
  users: 500000
  released: 2022-07-01
  updated: 2026-04-23
  version: 1.32.52
  reviews: 26
  icon: com.trusteeplus.png
  developerName: UAB Trustee Global
iphone:
  appId: com.trusteeplus1
  idd: '1634455978'
  appCountry: us
  released: 2022-07-18
  updated: 2025-11-27
  version: 1.32.36
  reviews: 114
  icon: com.trusteeplus1.jpg
  developerName: Trustee Global

---

## Android

## Similar App Note 2023-08-23

This app is from the same developer of {% include walletLink.html wallet='android/com.trusteewallet' verdict='true' %}. 

We verified that both apps are linked from their homepage.

## App Description from Google Play

> Transfer money, buy, sell cryptocurrency in just a few touches.
>
> The application is free, but access is provided only to persons who have pending transfer or accepted by Trustee Plus family members.

### From the Homepage

> Services such as Trustee Plus do not require a key. After registering with your phone number, you can restore the wallet simply by contacting tech support and following the instructions.

## Analysis 

- We were able to register and found a Bech32 BTC address that can send and receive. 
- Section 5.3 of the [terms](https://trusteeglobal.eu/terms-of-use/) describes part of the service as a hosted custodial wallet.

Since the wallet does not provide the private keys, this app is **custodial** and therefore **not-verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}
