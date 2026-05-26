---
wsId: kamixApp
title: Kamix
verdict: custodial
meta: stale
date: 2025-08-18
authors:
- danny
twitter: KamixApp
social:
- https://www.linkedin.com/company/kamixapp
- https://www.facebook.com/Kamixapp
- https://www.instagram.com/kamixapp
redirect_from:
- /android/io.kamix.kamix/
- /iphone/io.kamix.app/
android:
  appId: io.kamix.kamix
  users: 5000
  released: 2019-03-14
  updated: 2025-04-25
  version: 3.0.336
  icon: io.kamix.kamix.png
  meta: stale
  website: https://kamix.io
  developerName: Kamix R&D
iphone:
  appId: io.kamix.app
  idd: '1496578894'
  appCountry: fr
  released: 2020-06-05
  updated: 2025-04-27
  version: '2.8'
  reviews: 10
  icon: io.kamix.app.jpg
  meta: removed
  website: http://kamix.fr
  developerName: Kamix

---

## Android

## App Description from Google Play 

> Kamix allows you to buy and store crypto assets in your wallet, that you can send to your recipient's wallet in Cameroon with 0% commission fees. Before using this service, it is mandatory to validate your identity as required by Anti Money Laundering and Terrorism Financing regulations.
>
> Once your recipient receives the crypto assets, the app allows him to automatically sell it and receive franc CFA directly in his mobile money account Orange Money or MTN Momo. Therefore you must indicate your recipient's mobile money number in each transaction.

## Analysis 

- We installed the app but were not able to register due to AML/KYC and regional requirements. We did however, manage to register on the web app which only required an email address. 
- The Kamix.io website also has a blockchain explorer 
- We had contacted Kamix via [twitter](https://twitter.com/BitcoinWalletz/status/1654326997353627648) to clarify, however there was no response.

[Reading the Legal article](https://www.kamix.io/fr/legal#deadLink), there are paragraphs that state the app is holding the user's assets. Unfortunately, as we cannot read French we had to run the article through Google Translate.

> **«Cryptoactive buyer»:** means a Customer who purchases a quantity of Cryptoassets sold by KAMIX against a settlement in euro by a payment method accepted by KAMIX, and, in particular, remote payment by credit card or payment by SEPA bank transfer.
>
> **«Crypto account»:** means a position-keeping register on which is recorded the quantity of crypto-assets held by a Client and kept by KAMIX as well as its counter-value in legal tender currency, in particular the’euro or the CFA franc.


We'll conclude that this app is **custodial.**

**Update 2023-11-17**:

From its translated (Google Translate) [Terms and Conditions](https://www.kamix.io/fr/legal#deadLink):

A **crypto account** is defined:

> Crypto account»: means a position-keeping register on which is recorded the quantity of crypto-assets held by a Client and kept by KAMIX as well as its counter-value in legal tender currency, in particular the’euro or the CFA franc.

The definition of **transfer:**

> «Transfer»: movement operation by the Company, at the request of the Client, of digital’actives of the Client kept on behalf of the Client by the Company.

The provider reserves the right to **refuse** to carry out transaction instructions:

> The User recognizes that the Company is not obliged to accept a request for Transaction, and that it cannot be held responsible in the event of refusal to carry out a request for Transaction, or modification, interruption or termination of the Service, these CGUVs only applying to a request for Transaction accepted by the Company.  

There is no mention of how the bitcoin private key is treated by the app. This indicates that the app is a **custodial** and therefore not-verifiable.

---

## iPhone

{% include copyFromAndroid.html %}
