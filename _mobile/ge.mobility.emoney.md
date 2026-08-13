---
wsId: eMoneyGe
title: Emoney
date: 2025-05-23
authors:
- danny
website: https://www.emoney.ge/
social:
- https://www.instagram.com/emoney.georgia
- https://www.facebook.com/emoney.ge
redirect_from:
- /android/ge.mobility.emoney/
- /iphone/ge.smatex.eMoney/
android:
  appId: ge.mobility.emoney
  users: 100000
  appCountry: us
  released: 2015-08-22
  updated: 2026-07-29
  version: 11.6.0
  reviews: 33
  icon: ge.mobility.emoney.png
  meta: ok
  verdict: custodial
  developerName: eMoney Georgia
iphone:
  appId: ge.smatex.eMoney
  idd: '1084288470'
  appCountry: ge
  released: 2020-04-19
  updated: 2026-08-10
  version: 11.6.0
  reviews: 9
  icon: ge.smatex.eMoney.jpg
  meta: ok
  verdict: custodial
  developerName: eMoney

---

## Android

## App Description

eMoney is a Georgian digital finance app that bridges fiat and cryptocurrency services through an electronic money account system. The app allows users to buy, sell, and manage both traditional currencies (GEL, USD, EUR) and cryptocurrencies within a single platform. Users can obtain the "All Money Card" for global payments using both fiat and crypto funds. The service is regulated by the National Bank of Georgia and offers features like automatic account top-ups, payment requests, and international money transfers.

## Analysis

1. **Is it a wallet?** Partially, eMoney is primarily an e-money service that includes cryptocurrency trading and transfer functionality.

2. **Is it for bitcoins?** Yes, Bitcoin is supported among other cryptocurrencies available in the platform.

3. **Can it send and receive bitcoins?** Yes, eMoney is obliged to "transfer to the Client the crypto-currency corresponding to the order in the possession of eMoney to the digital address on the foreign servers requested by the Client" as stated in their [Terms and Conditions](https://www.emoney.ge/docs/general-agreement/general-agreement-en.pdf).

4. **Is the product self-custodial?** No, (8.12) "the corresponding amount of the displayed cryptocurrency balance in the eMoney account belongs to eMoney" and is stored on eMoney-owned servers or with international cryptocurrency exchangers as stated in their [Terms and Conditions](https://www.emoney.ge/docs/general-agreement/general-agreement-en.pdf).

5. **Is the source code publicly available?** No, there is no mention of open source code in eMoney's documentation.

6. **Is the decompiled binary legible?** Not applicable, as the source code is not available.

7. **Is the source code of this wallet available?** No, eMoney does not provide public access to their source code.

## Verdict

eMoney functions as a **custodial** Bitcoin wallet because it allows external transfers while maintaining custody of user funds. According to their Terms and Conditions (Section 8.12): "The corresponding amount of the displayed cryptocurrency balance in the eMoney account belongs to eMoney" and users can "transfer it to a digital address on other foreign servers." While users can send and receive Bitcoin to/from external addresses, eMoney retains ownership and control of the cryptocurrency, making it a custodial service rather than a self-custodial wallet.

---

## iPhone

{% include copyFromAndroid.html %}
