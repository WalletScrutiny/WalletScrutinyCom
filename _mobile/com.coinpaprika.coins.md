---
wsId: coinsonepaprika
title: 'COINS: One App For Crypto'
verdict: nosource
date: 2024-07-15
authors:
- danny
twitter: CoinsOneApp
social:
- https://www.facebook.com/CoinsOneApp
features:
- buyWithCC
- fingerprint
- hd
- segwit
- tradeAlts
appCountry: us
redirect_from:
- /android/com.coinpaprika.coins/
- /iphone/com.coinpaprika.Coins/
android:
  appId: com.coinpaprika.coins
  users: 100000
  released: 2020-06-15
  updated: 2025-08-19
  version: 1.17.18
  reviews: 94
  icon: com.coinpaprika.coins.png
  meta: ok
  website: https://coins.coinpaprika.com/
  developerName: Coinpaprika
iphone:
  appId: com.coinpaprika.Coins
  idd: 1475233621
  released: 2019-12-03
  updated: 2025-04-10
  version: 2.8.19
  reviews: 978
  icon: com.coinpaprika.Coins.jpg
  meta: stale
  website: http://coins.coinpaprika.com
  developerName: Coinpaprika Sp. z o.o.

---

## Android

## Update 2024-07-15

A search for the app ID ["com.coinpaprika.coins" on GitHub](https://github.com/search?q=%22com.coinpaprika.coins%22&type=code&p=1) does not show any relevant code or repository results.

## Review 2021-09-11

From the Google Play app description: 

> With COINS, you can Discover, Store, Invest, Send & Receive over 2000 cryptocurrencies. All in one app. 

Furthermore:

> Our non-custodial solution lets you store over different 1500 cryptocurrencies inside your phone. By using advanced biometrics, we make sure that your private keys never leave your device. Nobody has access to your funds, but you!

We downloaded the app and proceeded to create a BTC wallet. The app gives you the option to use either biometric data or a pin before the wallet is created. It then prompts the user to backup the wallet via secret phrase. You then input your biometric data again, and the app shows 12 words. Then, the 12 are re-entered to be verified. 

Furtheremore, no KYC is required.

We reached out via twitter and they confirmed that their app was non-custodial. Their source code is based on [Trust Wallet](https://github.com/trustwallet/wallet-core)

This app is **non-custodial**, so the next step is to try to find the source code for the wallet. 

We conversed with them via [twitter](https://twitter.com/dannybuntu/status/1434825692944818193).

>@coinpaprika - 33m<br>
non-custodial<br><br>
Daniel Andrei R. Garcia<br>
@dannybuntu - 23m<br>
Yeah, doing backup of seed phrase now. Your app is sleek, very well designed. Is the source code available to the general public?<br><br>
@coinpaprika Replying to @dannybuntu<br>
It's based on Trust Core - open source so kind of ;)<br>
https://github.com/trustwallet/wallet-core

Absent source code for **this specific app**, it is **not verifiable**.

{% include featureEvidence.html feature="hd" quote="Yes, of course. We use the popular cryptocurrency standard HD Wallet (Hierarchically Derived) BIP39. So You can get access to your funds in other wallets that support the BIP39 standard. To get your funds in another wallet, you need to write your mnemonic phrases from the COINS app (12 words)." source="Website" %}

{% include featureEvidence.html feature="segwit" quote="Native SegWit (bech32): addresses start with bc1 (we use this type in Coins)" source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="In Coins app every transaction like send/exchange requires user authentication (biometric or phone code).Also access to mnemonic phrases is secure by authentication." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Which cryptocurrencies can I exchange?" source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Which cryptocurrencies can I buy in Coins for FIAT?" source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="Native SegWit (bech32): addresses start with bc1 (we use this type in Coins)" source="Website" %}

{% include featureEvidence.html feature="hd" quote="We use the popular cryptocurrency standard HD Wallet (Hierarchically Derived) BIP39. So You can get access to your funds in other wallets that support the BIP39 standard. To get your funds in another wallet, you need to write your mnemonic phrases from the COINS app (12 words)." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Exchange: No more complicated infrastructure! Exchanging your cryptocurrency into another never been easier - choose the crypto you want to exchange, and we'll take care of everything else!" source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="We use several different providers for the purchase transaction for buying crypto." source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="In Coins app every transaction like send/exchange requires user authentication (biometric or phone code).Also access to mnemonic phrases is secure by authentication." source="Website" %}
