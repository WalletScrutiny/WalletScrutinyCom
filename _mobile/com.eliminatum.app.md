---
wsId: ellyCrypto
title: Elly, crypto wallet app
verdict: custodial
meta: removed
authors:
- danny
website: https://elly.com
twitter: GoCrypto_
social:
- https://www.facebook.com/gocrypto.eligma
- https://t.me/eligma
- https://medium.com/eligma-blog
- https://www.youtube.com/channel/UCfshAN27bKPe4f3uBIr7jjA
redirect_from:
- /android/com.eliminatum.app/
- /iphone/io.eligma.btcwallet/
android:
  appId: com.eliminatum.app
  users: 10000
  released: 2018-09-12
  updated: 2022-01-28
  version: 8.0.1
  icon: com.eliminatum.app.png
  date: 2025-07-03
  developerName: NAKA GLOBAL d.o.o.
iphone:
  appId: io.eligma.btcwallet
  idd: '1353823277'
  appCountry: si
  released: 2018-09-14
  updated: 2022-01-30
  version: 8.0.1
  reviews: 36
  icon: io.eligma.btcwallet.jpg
  date: 2025-07-08
  developerName: NAKA GLOBAL d.o.o

---

## Android

## App Description from Google Play

> Elly is the first all-in-one crypto wallet app. In addition to shopping with crypto, it enables simple instant buying and selling of crypto directly in the app. That also goes for GoC tokens. Enjoy instant free transfers between users. In selected countries, you can collect rewards for recommending the app to friends. Everywhere, however, you get rewarded for your every purchase at stores and service providers with the GoCrypto payment system. To sum up: with Elly, you no longer need any other crypto apps and accounts!
>
> Use crypto or digital value vouchers for instant payments with Android. No waiting involved.
>
> Exchange feature: Easily purchase any of the supported cryptocurrencies with payment cards (Visa and Mastercard) or with preowned credit (in digital value vouchers), and sell supported crypto for credit in digital value vouchers. Daily crypto exchange limit: 5,000 EUR.
>
> Make easy crypto deposits into your account. Currently, Elly supports bitcoin, bitcoin cash, ether, the GoC token, litecoin, tezos and the viberate token.
>
> You can also buy credit (in digital value vouchers) with SEPA or payment cards on Android (country restrictions apply).
>
> Easily withdraw crypto to non-Elly wallets. Daily crypto withdrawal limit: 5,000 EUR.

## Analysis

- The listed provider homepage now redirects to gocrypto.com.
- The app [describes integration](https://web.gocrypto.com/hc/en-us/articles/360048704271-Can-GoCrypto-be-joined-by-all-types-of-crypto-wallets-or-are-there-any-limitations-) with other wallet apps such as {% include walletLink.html wallet='android/com.bitcoin.mwallet' verdict='true' %}.
- This [article](https://web.gocrypto.com/hc/en-us/articles/360054976031-What-is-the-difference-between-Elly-and-GoCrypto-) differentiates between Elly and GoCrypto. The main gist is that the two are related: Elly is a crypto wallet and GoCrypto is a payments processor.
- Elly's history is that of a Point-of-Sale system that accepts both fiat and crypto.
- The app's former website (which we accessed through archive.org), distinguishes between 3 products, Elly POS, GoCrypto and Elly Crypto Wallet.
- The app did not provide the seed phrases during startup.
- Once we are in the main interface of the wallet, we can buy or receive bitcoin - but only after identity verification. Otherwise, these features including the wallet address, are locked.
- There are no options to back up the private keys under "Settings" or under the "Security" options.
- We did not find any description of the usage of **cold-storage** or the custody of funds in the terms.
- But from our experience with other wallets, the factors above are indicative of a **custodial** service. 
- At the interim, we'll mark this as custodial until we receive more information from the provider which we will email afterwards.

---

## iPhone

{% include copyFromAndroid.html %}
