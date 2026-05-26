---
wsId: cashInCryptoNaira
title: 'Cash-in: Crypto to naira app'
verdict: nosendreceive
meta: ok
date: 2024-09-24
authors:
- danny
twitter: cashin_app
social:
- https://www.facebook.com/Cashin.app1
- https://www.instagram.com/cashin_app
- https://t.me/cashin_app
- https://medium.com/@cash-in
redirect_from:
- /android/com.whitehat.cashin_app/
- /iphone/com.macroblocs.cashinApp/
android:
  appId: com.whitehat.cashin_app
  users: 100000
  released: 2022-07-16
  updated: 2026-04-23
  version: 2.0.0
  reviews: 117
  icon: com.whitehat.cashin_app.png
  meta: ok
  website: https://cash-in.app
  developerName: Macroblocs Ltd
iphone:
  appId: com.macroblocs.cashinApp
  idd: '6443628065'
  appCountry: ng
  released: 2022-10-04
  updated: 2022-10-04
  version: '1.0'
  reviews: 1243
  icon: com.macroblocs.cashinApp.jpg
  meta: obsolete
  website: https://cash-in.app/
  developerName: Macroblocs Limited

---

## Android

## App Description from Google Play

> Cash-in App makes it possible for any user to send Crypto to their designated Cash-in wallet address in the app, and automatically receive the value in Naira via their registered Naira bank account within minutes.
> 
> 1. Download the app to your phone.
> 2. Open the app and register your personal and Naira bank account details, then your unique Cash-in wallet address will be auto-generated for you.
> 3. Share your Cash-in wallet address with anyone who wants to pay you in Crypto.
> 4. Once you receive Crypto in your Cash-in wallet address, it will be automatically converted into Naira and paid into your registered bank account within minutes.

## Analysis 

- Once the app opens, we are asked to fill in African bank details including:
    - Bank name
    - Account No.
    - Email address
- We provided some test details we found online and it then gave an account name. Registration was completed.
- Cash-in with fiat is possible with their third-party partner, Transak.
- The cash in would be in USDT, and this cannot be withdrawn.
- Other supported payment methods are Apple Pay, Google Pay, Credit/Debit card and bank transfer. 
- The platform charges a fee for this and KYC will be required.
- The app automatically gathered information from our location and presented local non-African banks and payment options.
- The home screen shows Bitcoin, BUSD, USDT and USDC.
- Cash in with Binance Pay and Trust Wallet is also possible. 
- Once we clicked 'bitcoin', we were presented a Bech32 BTC wallet address that we think is controlled by the provider, as no private keys were given. 
- We were notified that once bitcoin is sent to this address, it would be immediately converted to Naira to be withdrawn to the bank account we inputted before. 
- **Bitcoin cannot be sent and received** through this app.

---

## iPhone

{% include copyFromAndroid.html %}
