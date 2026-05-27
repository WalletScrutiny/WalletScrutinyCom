---
wsId: noonesMarketplace
title: 'NoOnes: Buy Bitcoin & Crypto'
date: 2023-07-30
authors:
- danny
website: https://noones.com/
twitter: noonesapp
social:
- https://www.tiktok.com/@noonesapp
- https://www.facebook.com/noonesapp
- https://www.instagram.com/noones.app
redirect_from:
- /android/team.noones.mobilemessenger/
- /iphone/com.noones.marketplace/
android:
  appId: team.noones.mobilemessenger
  users: 100000
  appCountry: us
  released: 2023-05-04
  updated: 2026-04-08
  version: 1.26.0
  reviews: 158
  icon: team.noones.mobilemessenger.png
  meta: ok
  verdict: custodial
  developerName: Eaton Consulting
iphone:
  appId: com.noones.marketplace
  idd: '6447785195'
  appCountry: in
  released: 2023-05-04
  updated: 2024-09-18
  version: 1.5.7
  reviews: 17
  icon: com.noones.marketplace.jpg
  meta: removed
  verdict: custodial
  developerName: Eaton Consulting FZE

---

## Android

## App Description from Google Play

> Noones is a financial communication super app that brings empowerment by connecting people to the global conversation (chat) and the world’s financial system (payments). You will have the ability to freely message anyone, trade around 250 payment methods on the marketplace, and make payments peer-to-peer—all with a Bitcoin wallet that acts as a store of value.

## Analysis 

- After email registration, we were given a Noone's citizen ID.
- We then find the BTC wallet from the main interface.
- We were shown a message:

    > You need to pass an ID verification to receive the crypto to your wallet. 

- The app's security options only include 2FA. There was no provision to back up the private keys.
- Absent these options together with the requirement to pass ID verification prior to even seeing the BTC wallet address, this is a **custodial** and **non-verifiable** app.

---

## iPhone

{% include copyFromAndroid.html %}
