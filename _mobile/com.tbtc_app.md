---
wsId: theBitcoinCompany
title: The Bitcoin Company Rewards
date: 2024-07-17
authors:
- danny
website: https://thebitcoincompany.com
twitter: thebtcco
social:
- https://www.facebook.com/thebtcco
- https://www.linkedin.com/company/thebitcoincompany
- https://www.instagram.com/thebtcco
- https://t.me/thebitcoincompany
features:
- ln
redirect_from:
- /android/com.tbtc_app/
- /iphone/com.thebitcoincompany.app.ios/
android:
  appId: com.tbtc_app
  users: 10000
  appCountry: us
  released: 2022-03-17
  updated: 2025-08-26
  version: 0.1.37
  reviews: 20
  icon: com.tbtc_app.png
  meta: ok
  verdict: custodial
  developerName: The Bitcoin Company
iphone:
  appId: com.thebitcoincompany.app.ios
  idd: '1600995023'
  appCountry: us
  released: 2022-03-17
  updated: 2025-02-04
  version: '1.36'
  reviews: 29
  icon: com.thebitcoincompany.app.ios.jpg
  meta: stale
  verdict: nosendreceive
  developerName: Two Twenty Two, Inc.

---

## Android

## App Description from Google Play 

> Get cash back Bitcoin rewards when you shop online, pay your utility bills, or buy our Visa cards.

### [Terms](https://thebitcoincompany.com/terms.html) 

### [FAQ](https://intercom.help/thebitcoincompany/en/)

## Analysis 

- We opened an account and used a referral code we found on twitter. 
- The app first makes you choose your products. 
- If you make a purchase, you are rewarded with Satoshis. 
- Users can buy a virtual Visa debit card with a preloaded amount. However, this cannot be used for subscription services or linking to Paypal. 
- There is a bitcoin balance but the interface is labeled "Top up USD balance". When you click this, you then enter an amount $1-$2000. It is further described as:

> Top up your USD balance, which you can apply to future purchases in The Bitcoin Company app. Balance top-ups are TBC gift cards that are non-refundable. 

Clicking purchase will show the user an LN invoice. Users can also select On-Chain payments. Both addresses expire in 30 minutes. User then has to open a wallet or choose "I don't have a wallet". User can then send an amount. 

This app is more of a rewards platform where the rewards are denominated in Sats/Bitcoin. Though the user can 'send' Sats to the app via "Top Up", its more akin to sending Sats to the provider who then reflects these sats in the balance of the app. While withdraw is also a function that is available, it has its limits: "Users can only withdraw their rewards when the user has **spent** $21 (USD) in the app."

Thus, we can say that this app is a **custodial** provider.

{% include featureEvidence.html feature="ln" comment="(no justification provided by LLM)" %}

---

## iPhone

{% include copyFromAndroid.html %}
