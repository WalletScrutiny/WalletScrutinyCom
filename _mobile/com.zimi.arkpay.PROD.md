---
wsId: arkpayBTCETHWallet
title: ArkPay - BTC ETH Wallet
verdict: custodial
authors:
- danny
redirect_from:
- /android/com.zimi.arkpay.PROD/
- /iphone/com.zimi.arkpay/
android:
  appId: com.zimi.arkpay.PROD
  users: 1000
  released: 2020-06-03
  updated: 2024-12-16
  version: 2.15.0
  icon: com.zimi.arkpay.PROD.png
  meta: removed
  date: 2025-05-30
  website: https://www.arkpay.site/
  developerName: ZIMI
iphone:
  appId: com.zimi.arkpay
  idd: '1490824690'
  appCountry: tw
  released: 2019-12-29
  updated: 2024-12-30
  version: 2.14.0
  reviews: 9
  icon: com.zimi.arkpay.jpg
  meta: stale
  date: 2026-02-02
  developerName: Zimi

---

## Android

## App Description from Google Play

  > Arkpay is a blockchain-based e-wallet that implements transfers, payments, and querying transaction records. It is the best digital currency asset management solution. It can centrally view digital currency assets and wallet asset totals. It also supports ICO asset record query.
  >
  > Through real-name verification and high-level security control, even if you lose your mobile phone or private key, you can query your wallet through the mechanism of online account access.

## Analysis 

- We were not provided with the seed phrases during app initialization. 
- We could not find any option to back up the private keys in the settings.
- The terms of use are written in Chinese and can only be found within the app. We translated some portions and found these information:
  - A national ID card of the Republic of China is needed.
  - User information can be provided to law enforcement upon their legal request
  - The venue for court disputes will be Taiwan (Republic of China)
- We were provided with a multicurrency wallet with legacy BTC address that can send/receive.
- Although we were not able to find explicit terms such as the use of "cold-storage" or "custodial", this app has the hallmarks of a **custodial** service, making the app, **non-verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}
