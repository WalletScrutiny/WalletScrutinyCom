---
title: ;blackcat
date: 2026-10-31
authors:
- leo
website: https://blackcat.app
android:
  appId: com.papaya.blackcat
  users: 10000
  appCountry: us
  released: Sep 15, 2025
  updated: 2026-10-14
  version: '1.2'
  reviews: 3
  icon: com.papaya.blackcat.webp
  meta: ok
  verdict: custodial
  developerName: PAPAYA LTD
iphone:
  appId: com.papaya.blackcat
  idd: '6741854309'
  appCountry: us
  released: '2025-06-17T07:00:00Z'
  updated: 2026-09-29
  version: 1.0.46
  reviews: 21
  icon: com.papaya.blackcat.webp
  meta: ok
  verdict: custodial
  developerName: Papaya Ltd

---

## App Description

This is ";blackcat", the rebuilt app of the Malta e-money institution Papaya Ltd. It replaces the company's earlier app, {% include walletLink.html wallet='android/com.papaya.blackcatcard' verdict='true' %}. According to a [press release from March 2026](https://www.financexmagazine.com/post/european-fintech-blackcat-launches-multi-wallet-app-combining-euro-and-crypto-accounts-completing-r), Blackcat "launched a completely rebuilt mobile app based on a multi-wallet architecture that combines euro accounts and crypto services in a single interface". The launch came with "a formal rebrand that retires the Blackcatcard name". The app offers a euro IBAN, payment cards, SEPA transfers and a rewards program. The App Store description also lists "integrated crypto wallets" and says "An integrated crypto exchange and custodial crypto wallets are provided by MANERIO Sp. z o.o." The Play description does not mention crypto.

## Analysis

- **Bitcoin support.** The crypto partner's website, [maner.io](https://maner.io/), describes "a feature within the Blackcat ecosystem that allows you to buy, sell, store, send and receive cryptocurrencies in the same app". It does not name the coins. The source of the [blackcat.app](https://blackcat.app/) homepage contains a section, currently marked hidden, that reads "Buy Bitcoin, ETH, and USDC with euro in just a few clicks". That section is not visible on the page, and the visible pages no longer mention crypto.
- **Sending and receiving.** The App Store description lists "crypto wallet transfers", and maner.io says external crypto transfers are limited to "€2000 EUR per transaction and per day and €10000 EUR per month". Blackcat's [terms](https://blackcat.app/terms-conditions) list "a transfer to a crypto-asset address or crypto Wallet operated by a virtual asset service provider (VASP) or crypto-asset service provider (CASP)" among the transfer types.
- **Custody.** The App Store description says the crypto wallets are "custodial crypto wallets ... provided by MANERIO Sp. z o.o.". The terms treat them as "Linked Wallets or Crypto Wallets" held with a third-party VASP or CASP, whose balance "reflects the information received from the corresponding third-party institution or provider". The user never holds the keys.

We could not confirm that the crypto service is offered in the Android app. Its store description no longer mentions crypto, and the website hides its crypto sections. If it is offered, it is the same custodial service as on iPhone.

Bitcoin in ;blackcat is held by Blackcat's partner MANERIO, so the app is {% include verdictBadge.html verdict="custodial" type='short' %}, like the app it replaces.

**Custodial: The provider holds the keys**
