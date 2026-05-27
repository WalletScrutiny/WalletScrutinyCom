---
wsId: capeCryptoExchange
title: Cape Crypto Exchange
verdict: custodial
date: 2023-09-06
authors:
- danny
website: https://capecrypto.com
twitter: capecryptoSA
social:
- https://www.linkedin.com/company/capecrypto
- https://www.youtube.com/channel/UCET8t88fPnOKD0sgM3KFIsA
- https://www.facebook.com/capecrypto
features:
- ln
- tradeAlts
redirect_from:
- /android/com.capecrypto/
- /iphone/com.capecrypto.ios/
android:
  appId: com.capecrypto
  users: 10000
  released: 2022-04-25
  updated: 2026-05-19
  version: 4.1.6
  icon: com.capecrypto.png
  meta: ok
  developerName: Cape Crypto
iphone:
  appId: com.capecrypto.ios
  idd: '1588237941'
  appCountry: za
  released: 2021-10-18
  updated: 2026-05-20
  version: 4.1.6
  reviews: 9
  icon: com.capecrypto.ios.jpg
  meta: ok
  developerName: Cape Crypto Pty Ltd

---

## Android

## App Description from Google Play

> Have the international exchange’s slow verification times got you down when all you want is to buy Bitcoin right away? No need to verify upfront with Cape Crypto! Buy Bitcoin immediately and only verify when you want to withdraw
>
> Founded in July 2020, Cape Crypto is a local South African company based in Cape Town on a mission to expand the wealth of every South African in our incredible and unique country, by making it easy and affordable to buy and store Bitcoin.

## Analysis 

- We registered an account and no mnemonics were provided. 
- We could not find a setting to back up the private keys. 
- Some [restrictions](https://support.capecrypto.com/hc/en-za/articles/360011483098-How-do-I-withdraw-cryptocurrency-from-my-Cape-Crypto-account-) are in place:
  - Users cannot withdraw cryptocurrency without verifying their accounts. 
  - Users can have their accounts locked if flagged for suspicious transactions.
  - Funds can be confiscated.
  - Provider will cooperate with authorities when requested.

Although not directly stated or described. The lack of private key backup mechanism and other signifiers indicate the provider to custody the user's funds, making the app **non-verifiable**.

{% include featureEvidence.html feature="ln" quote="BTC Lightning Deposit and withdraw Bitcoin on the Lightning network for instant BTC transfers" source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="BTC Lightning Deposit and withdraw Bitcoin on the Lightning network for instant BTC transfers" source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Lowest trade fees in SA, best way to buy Bitcoin, Ethereum, XRP and USDT" source="Website" %}
