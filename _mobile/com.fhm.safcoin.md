---
title: Safcoin
verdict: custodial
meta: removed
date: 2024-07-05
authors:
- danny
website: http://www.safcoin.co.za
twitter: SAFCOIN1
social:
- https://www.facebook.com/SAFcryptocoin
- https://www.youtube.com/channel/UCgSsFoSOSZIkulBPGr31t1Q
- https://t.me/SafcoinGroup
redirect_from:
- /android/com.fhm.safcoin/
android:
  appId: com.fhm.safcoin
  users: 5000
  released: 2018-12-13
  updated: 2022-03-30
  version: 2.0.5
  icon: com.fhm.safcoin.png
  developerName: SAFCOIN

---

## App Description from Google Play

> Safcoin: Africa’s exclusive crypto exchange and Wallet App.

## Analysis

- The service implements KYC and AML procedures
- The service can suspend and terminate the service at any time for any reason.
- We were not provided the seed phrases during startup.
- The [fees](https://www.safcoin.africa/welcome/fees#deadLink) page give us an insight that the wallet supports BTC.
- The [security guidelines](https://www.safcoin.africa/welcome/wallet-safety.html#deadLink) it issued to its users does not include making a backup of the private key. 
- We can confirm that the app provides a BTC address that can send and receive.
- The seed phrases were not provided during app initialization.
- In lieu of the seed phrases, account security questions and personal information were required. 
- There were [29 unrelated instances](https://github.com/search?q=com.fhm.safcoin&type=code) of the app ID in GitHub code. 
- This service is **custodial** and the app is **not verifiable**.
