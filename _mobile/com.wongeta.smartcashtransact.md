---
title: SmartCash Transact
verdict: custodial
date: 2023-06-10
authors:
- danny
website: https://mysmartcash.tech
twitter: mysmartcasht
social:
- https://www.instagram.com/smartcash_za
- https://www.facebook.com/mysmartcash.tech
features:
- fingerprint
- tradeAlts
redirect_from:
- /android/com.wongeta.smartcashtransact/
android:
  appId: com.wongeta.smartcashtransact
  users: 10000
  released: 2018-12-31
  updated: 2025-07-12
  version: '200'
  icon: com.wongeta.smartcashtransact.png
  meta: ok
  developerName: Wongeta

---

## App Description from Google Play 

> A mobile point of sale(mPOS) app used by merchants to facilitate payments.
>
> Available Services:
>
> 1. Payment Collection: management of cash, management of members/clients, reporting, receipting and reconciliation of every cash payment. Collect money using an existing EasyPay retail network .
>
> 2. Crypto Currency Exchange: Enable merchant to sell Bitcoin. This allows anyone to buy cryptocurrency using cash at any participating Merchant.
>
> **Individuals are also able to withdraw/sell their cryptocurrency for cash.**

## Analysis 

- We tried registering with the service, but had an error which we [screenshotted](https://twitter.com/BitcoinWalletz/status/1667440556614602753).
- We found that the web version of the registration page also exhibited the same error. 
- From the [Terms](https://mysmartcash.tech/Home/TermsAndCondition#), we find that in Section 14.2, the provider can stop the user from having access to the platform. This is clearly a **custodial** characteristic.
- This app was just updated a month ago. We'll contact info@mysmartcash.tech (found on the website) and temporarily mark this as **custodial** until new information is made available.

{% include featureEvidence.html feature="fingerprint" quote="Enabled contactless fingerprint authentication, Crypto Currency Exchange Service and Mobile Wallet Service" source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Sell & Buy Crypto Currency Facilitate the purchase and exchange of CryptoCurrency such as Bitcoin and Ethereum to you customers" source="Website" %}
