---
wsId: bitcoli
title: BitcoLi Lightning wallet
verdict: custodial
date: 2025-06-18
authors:
- danny
website: https://BitcoLi.com
redirect_from:
- /android/com.bitcoli.bitcoli/
- /iphone/com.bitcoli.bitcoli/
android:
  appId: com.bitcoli.bitcoli
  users: 10000
  released: 2023-01-13
  updated: 2024-10-09
  version: 1.2.1
  reviews: 7
  icon: com.bitcoli.bitcoli.jpg
  meta: removed
  developerName: BitcoLi
iphone:
  appId: com.bitcoli.bitcoli
  idd: '6473613857'
  appCountry: us
  released: 2024-01-10
  updated: 2024-10-23
  version: 1.2.1
  reviews: 1
  icon: com.bitcoli.bitcoli.jpg
  meta: removed
  developerName: Jaroslav Bruzek

---

## Android

## App Description from Google Play 

> The main advantages of this wallet include:
> - custom Lightning address including user profile
> - You can receive and send payment through both Onchain and Lightning Network.
> - the issued invoice can be paid directly with a bitcoin NFC card!
> - ability to send and receive Lightning payments with milliSatoshi accuracy (0.001Sat)
> - very low fees
> - simplicity and clarity

## Analysis

- Users are given several login options:
  - No login (for testing)
  - Email
  - Username and password
- If the user chooses to have an account, it would look something like
`dannybuntu@bitcoli.com`
- Users are primarily given a lightning address, but an onchain address is also available.
- We did not find the private keys for the onchain wallet. Absent the private keys, this app is **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
