---
wsId: rockwalletApp
title: 'RockWallet: Buy and Swap'
meta: ok
date: 2023-08-28
authors:
- danny
website: http://www.rockwallet.com
twitter: rockwallet
social:
- https://www.facebook.com/rockwalletofficial
- https://www.instagram.com/rockwallet
- https://www.linkedin.com/company/rockwallet
features:
- buyWithCC
- tradeAlts
redirect_from:
- /android/com.rockwallet.app/
- /iphone/com.rockwallet.app/
android:
  appId: com.rockwallet.app
  users: 100000
  released: 2022-11-14
  updated: 2025-09-08
  version: 5.17.8
  reviews: 283
  icon: com.rockwallet.app.jpg
  verdict: nosource
  developerName: RockWallet
iphone:
  appId: com.rockwallet.app
  idd: '6444194230'
  appCountry: us
  released: 2022-11-16
  updated: 2025-09-15
  version: 5.17.8
  reviews: 764
  icon: com.rockwallet.app.jpg
  verdict: sourceavailable
  developerName: RockWallet, LLC
  repository: https://github.com/rockwalletcode/wallet-ios#deadLink

---

## Android

## App Description from Google Play

> - RockWallet’s multicurrency mobile wallet makes it quick and easy to buy, use, swap, and store top digital assets.
> - Registered with FinCEN as a Money Service Business (MSB). 
> - Compliant with all applicable regulations in all of our markets.
> - Built on the trusted BRD open-source codebase, the first and regarded most secure mobile crypto wallet.
> - Your RockWallet app is protected by your mobile device’s state-of-the-art security features.
> - Securely manage multiple digital currencies in a self-custodial mobile wallet: In other words, we won’t have access to your RockWallet, only you have the ‘private keys’ to your assets.

## Analysis 

- RockWallet is **no longer source-available** and can not be verified.
- This is a multi-currency wallet.
- We installed the app and were provided the seed phrases prior to email sign-up. 
- There was a BTC wallet with a legacy address.
- Users can opt to not sign up with the service. 
- The developers claim that this app was derived from {% include walletLink.html wallet='android/com.breadwallet' verdict='true' %} which was code-available in the past.

An issue has been opened at [https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/498](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/498)

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="swap and store top digital assets like BTC, ETH, BSV, XRP and many more" source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Purchase digital assets with your debit or credit card right from your mobile device" source="Store" %}

An issue has been opened at [https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/498](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/498)
