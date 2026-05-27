---
wsId: rockitCoin
title: 'RockItCoin: Buy Bitcoin & More'
verdict: nosource
date: 2023-07-07
authors:
- danny
website: https://rockitcoin.com
twitter: rockitcoin
social:
- https://www.facebook.com/RockItCoin
- https://www.instagram.com/rockitcoin
features:
- fingerprint
- tradeAlts
- buyWithCC
redirect_from:
- /android/co.rockitcoinx.app/
- /iphone/rockitcoinexchange/
android:
  appId: co.rockitcoinx.app
  users: 100000
  released: 2019-09-20
  updated: 2026-05-18
  version: 3.7.13
  reviews: 195
  icon: co.rockitcoinx.app.png
  meta: ok
  developerName: RockItCoin
iphone:
  appId: rockitcoinexchange
  idd: '1476730078'
  appCountry: us
  released: 2019-09-18
  updated: 2026-05-20
  version: 3.7.13
  reviews: 160
  icon: rockitcoinexchange.jpg
  meta: ok
  developerName: RockitCoin

---

## Android

## Update 2024-07-24

There hasn't been any news on whether the app's source code will be made available. The site's [terms](https://www.rockitcoin.com/terms-of-service/) explicitly license and prohibit decompiling, re-distributing or modifying the service's intellectual property including the app's source code, meaning it is closed source. 

## App Description from Google Play 2023-07-07

> Start Your Crypto Adventure with RockItCoin, the Most Trusted Name in Cryptocurrency™. We make buying crypto out-of-this-world easy with our network of over 2,000 Bitcoin ATMs and newly-designed mobile app!
>
> The RockItCoin app allows you to securely buy, store, send, and receive cryptocurrency like Bitcoin (BTC), Ether (ETH), Bitcoin Cash (BCH), Litecoin (LTC), Dogecoin (DOGE), Polygon (MATIC), and Tether (USDT).
>
> Truly own your crypto with possession of your private keys - RockItCoin champions self-custody and customer privacy. And with biometrics, PIN login, and available 2-factor authentication, your assets are kept secure.

## Analysis

- Registration required an email address, first and last name and a phone number.
- The [Terms and Conditions](https://www.rockitcoin.com/terms-of-service/) of the site:
  - May refuse an account to the user.
  - Claims to not have custody of any user funds.
  - May terminate a user's account upon its discretion.
- Once we have verified our throwaway US phone number, we were shown the main app interface.
- We clicked on 'Wallet' in the bottom panel and to our surprise, the app enjoined us to "Create an account" with what we think is another provider, Edge.
- There is a [tweet](https://twitter.com/TheRealXMoney/status/1534693878439325698) that says that the Edge referred to in this app is in fact: {% include walletLink.html wallet='android/co.edgesecure.app' verdict='true' %}. We tried confirming this with them on [twitter](https://twitter.com/BitcoinWalletz/status/1677267338972872706).
- We were provided with a P2SH BTC address on the same app.
- There was an option to back up the private keys. It can be presented in seed phrases or the raw private key.
- This is a self-custodial wallet.
- Despite the link with Edge, we're going to search GitHub for RockitCoin's app ID.
- There was [no result](https://github.com/search?q=co.rockitcoinx.app&type=code) when we did a code search on GitHub for the RockitCoin app ID.
- This app is **not source-available**.

{% include featureEvidence.html feature="fingerprint" quote="And with biometrics, PIN login, and available 2-factor authentication, your assets are kept secure." source="App Description from Google Play 2023-07-07" %}

{% include featureEvidence.html feature="tradeAlts" quote="The RockItCoin app allows you to securely buy, store, send, and receive cryptocurrency like Bitcoin (BTC), Ether (ETH), Bitcoin Cash (BCH), Litecoin (LTC), Dogecoin (DOGE), Polygon (MATIC), and Tether (USDT)." source="App Description from Google Play 2023-07-07" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="buyWithCC" quote="Quickly and securely purchase cryptocurrencies like Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Dogecoin (DOGE), Bitcoin Cash (BCH), Tether (USDT), USD Coin (USDC), PAX Gold (PAXG), Stellar (XLM), and more through our trusted partner Simplex. Supported payment methods include debit cards, credit cards (Visa & Mastercard), Apple Pay, and Google Pay." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Securely swap any RockItCoin supported cryptocurrency for another." source="Store description" %}
